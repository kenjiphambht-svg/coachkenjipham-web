-- 0024 · WP3 Hạt Mầm publication approval and entitlement boundary
-- Additive, server-only workflows. No Storage object, PDF, public URL,
-- provider connection or customer policy is created by this migration.

create or replace function app_private.guard_approved_publication_version()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if old.status = 'approved' and (
    new.publication_id is distinct from old.publication_id
    or new.version_number is distinct from old.version_number
    or new.content_checksum_sha256 is distinct from old.content_checksum_sha256
    or new.template_version is distinct from old.template_version
    or new.approved_at is distinct from old.approved_at
    or new.approved_by is distinct from old.approved_by
    or new.delivered_at is distinct from old.delivered_at
    or new.status not in ('approved', 'revoked')
  ) then
    raise exception using errcode = 'P0001', message = 'APPROVED_PUBLICATION_IMMUTABLE';
  end if;
  return new;
end;
$$;

create trigger publication_versions_approved_immutable
  before update on publication_versions
  for each row execute function app_private.guard_approved_publication_version();

-- A new version belongs to the canonical publication metadata for the order.
-- It contains no rendered content and no Storage reference; that arrives only
-- through a later authorized private-storage adapter.
create or replace function create_hatmam_publication_version(
  p_order_id uuid,
  p_actor text,
  p_template_version text default null
)
returns table (publication_id uuid, publication_version_id uuid, version_number integer, status text)
language plpgsql
security definer
set search_path = public, app_private
as $$
declare
  v_order hatmam_orders%rowtype;
  v_publication_id uuid;
  v_version_id uuid;
  v_version_number integer;
begin
  if nullif(btrim(p_actor), '') is null or p_actor not like 'human:%' then
    raise exception using errcode = 'P0001', message = 'HUMAN_ACTOR_REQUIRED';
  end if;
  select * into v_order from hatmam_orders where id = p_order_id for update;
  if not found then raise exception using errcode = 'P0001', message = 'ORDER_NOT_FOUND'; end if;
  if v_order.status <> 'ready' then raise exception using errcode = 'P0001', message = 'PUBLICATION_NOT_READY'; end if;

  select id into v_publication_id from publications where order_id = p_order_id order by created_at asc limit 1 for update;
  if not found then
    insert into publications(order_id) values (p_order_id) returning id into v_publication_id;
  end if;
  select coalesce(max(version_number), 0) + 1 into v_version_number
    from publication_versions where publication_id = v_publication_id for update;
  insert into publication_versions(publication_id, version_number, status, template_version)
    values (v_publication_id, v_version_number, 'review_pending', nullif(btrim(p_template_version), ''))
    returning id into v_version_id;
  insert into audit_log(actor, action, entity_type, entity_id, to_state)
    values (p_actor, 'hatmam.publication_version_created', 'publication_version', v_version_id, 'review_pending');
  return query select v_publication_id, v_version_id, v_version_number, 'review_pending'::text;
end;
$$;

-- Only an active Admin may record approval/revision/revocation. Approval does
-- not create a signed URL or delivery; entitlement is a separate audited step.
create or replace function review_hatmam_publication_version(
  p_publication_version_id uuid,
  p_expected_status text,
  p_action text,
  p_actor text,
  p_reviewer_admin_id uuid,
  p_safe_note text default null
)
returns table (previous_status text, next_status text)
language plpgsql
security definer
set search_path = public, app_private
as $$
declare
  v_version publication_versions%rowtype;
  v_next text;
begin
  if nullif(btrim(p_actor), '') is null or p_actor not like 'human:%' then
    raise exception using errcode = 'P0001', message = 'HUMAN_ACTOR_REQUIRED';
  end if;
  if not exists (select 1 from admin_users where id = p_reviewer_admin_id and is_active = true) then
    raise exception using errcode = 'P0001', message = 'PUBLICATION_REVIEWER_INVALID';
  end if;
  select * into v_version from publication_versions where id = p_publication_version_id for update;
  if not found then raise exception using errcode = 'P0001', message = 'PUBLICATION_VERSION_NOT_FOUND'; end if;
  if v_version.status <> p_expected_status then raise exception using errcode = 'P0001', message = 'CONCURRENT_UPDATE'; end if;

  v_next := case
    when p_action = 'request_revision' and v_version.status in ('draft', 'review_pending') then 'revision_requested'
    when p_action = 'approve' and v_version.status in ('draft', 'review_pending') then 'approved'
    when p_action = 'revoke' and v_version.status = 'approved' then 'revoked'
    else null
  end;
  if v_next is null then raise exception using errcode = 'P0001', message = 'INVALID_PUBLICATION_TRANSITION'; end if;

  update publication_versions set
    status = v_next,
    approved_at = case when v_next = 'approved' then now() else approved_at end,
    approved_by = case when v_next = 'approved' then p_reviewer_admin_id else approved_by end
    where id = p_publication_version_id;
  insert into publication_reviews(publication_version_id, reviewer_admin_id, decision, safe_note)
    values (p_publication_version_id, p_reviewer_admin_id, p_action, nullif(btrim(p_safe_note), ''));
  if v_next = 'revoked' then
    with revoked as (
      update product_entitlements set status = 'revoked', revoked_at = now(), revoke_reason_code = 'publication_revoked'
        where publication_version_id = p_publication_version_id and status = 'active'
        returning id
    )
    insert into entitlement_status_history(entitlement_id, from_status, to_status, actor, reason_code)
      select id, 'active', 'revoked', p_actor, 'publication_revoked' from revoked;
  end if;
  insert into audit_log(actor, action, entity_type, entity_id, from_state, to_state)
    values (p_actor, 'hatmam.publication.' || p_action, 'publication_version', p_publication_version_id, v_version.status, v_next);
  return query select v_version.status, v_next;
end;
$$;

-- Identity and approved publication must both be valid. This only creates an
-- authorization record; it cannot activate the Reading Room or Storage.
create or replace function grant_hatmam_approved_entitlement(
  p_customer_identity_id uuid,
  p_publication_version_id uuid,
  p_actor text,
  p_granted_by_admin_id uuid,
  p_expires_at timestamptz default null
)
returns table (entitlement_id uuid, idempotent boolean)
language plpgsql
security definer
set search_path = public, app_private
as $$
declare
  v_identity customer_identities%rowtype;
  v_version publication_versions%rowtype;
  v_order_id uuid;
  v_entitlement product_entitlements%rowtype;
  v_id uuid;
  v_had_entitlement boolean := false;
begin
  if nullif(btrim(p_actor), '') is null or p_actor not like 'human:%' then
    raise exception using errcode = 'P0001', message = 'HUMAN_ACTOR_REQUIRED';
  end if;
  if not exists (select 1 from admin_users where id = p_granted_by_admin_id and is_active = true) then
    raise exception using errcode = 'P0001', message = 'ENTITLEMENT_GRANTER_INVALID';
  end if;
  select * into v_identity from customer_identities where id = p_customer_identity_id for update;
  if not found or v_identity.status <> 'active' then raise exception using errcode = 'P0001', message = 'CUSTOMER_IDENTITY_NOT_VERIFIED'; end if;
  select pv.* into v_version
    from publication_versions pv join publications p on p.id = pv.publication_id
    where pv.id = p_publication_version_id for update;
  if not found then raise exception using errcode = 'P0001', message = 'PUBLICATION_VERSION_NOT_FOUND'; end if;
  if v_version.status <> 'approved' then raise exception using errcode = 'P0001', message = 'PUBLICATION_NOT_APPROVED'; end if;
  select order_id into v_order_id from publications where id = v_version.publication_id;

  select * into v_entitlement from product_entitlements
    where customer_identity_id = p_customer_identity_id and subject = 'hatmam' and subject_id = v_order_id for update;
  v_had_entitlement := found;
  if found and v_entitlement.status = 'active' and v_entitlement.publication_version_id = p_publication_version_id then
    return query select v_entitlement.id, true;
    return;
  end if;

  insert into product_entitlements(customer_identity_id, subject, subject_id, publication_version_id, status, granted_at, expires_at)
    values (p_customer_identity_id, 'hatmam', v_order_id, p_publication_version_id, 'active', now(), p_expires_at)
    on conflict (customer_identity_id, subject, subject_id) do update set
      publication_version_id = excluded.publication_version_id,
      status = 'active',
      granted_at = excluded.granted_at,
      expires_at = excluded.expires_at,
      revoked_at = null,
      revoke_reason_code = null
    returning id into v_id;
  insert into entitlement_status_history(entitlement_id, from_status, to_status, actor, reason_code)
    values (v_id, case when v_had_entitlement then v_entitlement.status else null end, 'active', p_actor, 'approved_publication_version');
  insert into audit_log(actor, action, entity_type, entity_id, to_state)
    values (p_actor, 'hatmam.entitlement_granted', 'product_entitlement', v_id, 'active');
  return query select v_id, false;
end;
$$;

comment on function grant_hatmam_approved_entitlement(uuid, uuid, text, uuid, timestamptz) is
  'Server-only entitlement grant after Founder/Admin approval. It does not issue a link or bypass private-storage, Auth or release gates.';

revoke all on function create_hatmam_publication_version(uuid, text, text) from public, anon, authenticated;
grant execute on function create_hatmam_publication_version(uuid, text, text) to service_role;
revoke all on function review_hatmam_publication_version(uuid, text, text, text, uuid, text) from public, anon, authenticated;
grant execute on function review_hatmam_publication_version(uuid, text, text, text, uuid, text) to service_role;
revoke all on function grant_hatmam_approved_entitlement(uuid, uuid, text, uuid, timestamptz) from public, anon, authenticated;
grant execute on function grant_hatmam_approved_entitlement(uuid, uuid, text, uuid, timestamptz) to service_role;
