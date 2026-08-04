-- 0025 · WP3 forward repair for linted publication/payment functions.
-- 0024 was additive and did not execute these paths during migration. This
-- migration replaces only function definitions: no data/schema rewrite.

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

  -- The canonical publication row is locked above this version calculation,
  -- so versions for the same order serialize without an illegal aggregate
  -- FOR UPDATE clause.
  select id into v_publication_id from publications where order_id = p_order_id order by created_at asc limit 1 for update;
  if not found then
    insert into publications(order_id) values (p_order_id) returning id into v_publication_id;
  end if;
  select coalesce(max(pv.version_number), 0) + 1 into v_version_number
    from publication_versions pv where pv.publication_id = v_publication_id;
  insert into publication_versions(publication_id, version_number, status, template_version)
    values (v_publication_id, v_version_number, 'review_pending', nullif(btrim(p_template_version), ''))
    returning id into v_version_id;
  insert into audit_log(actor, action, entity_type, entity_id, to_state)
    values (p_actor, 'hatmam.publication_version_created', 'publication_version', v_version_id, 'review_pending');
  return query select v_publication_id, v_version_id, v_version_number, 'review_pending'::text;
end;
$$;

create or replace function confirm_lang_payment_with_evidence(
  p_application_id uuid,
  p_expected_status lang_status,
  p_actor text,
  p_confirmed_by uuid
)
returns table (from_status lang_status, to_status lang_status, idempotent boolean)
language plpgsql
security definer
set search_path = public, app_private
as $$
declare
  v_application lang_applications%rowtype;
  v_snapshot lang_order_snapshots%rowtype;
  v_request lang_payment_requests%rowtype;
  v_evidence lang_payment_evidence%rowtype;
  v_payment_id uuid;
begin
  if nullif(btrim(p_actor), '') is null or p_actor not like 'human:%' then
    raise exception using errcode = 'P0001', message = 'HUMAN_ACTOR_REQUIRED';
  end if;
  if not exists (select 1 from admin_users where id = p_confirmed_by and is_active = true) then
    raise exception using errcode = 'P0001', message = 'PAYMENT_CONFIRMATION_ACTOR_INVALID';
  end if;

  select * into v_application from lang_applications where id = p_application_id for update;
  if not found then raise exception using errcode = 'P0001', message = 'APPLICATION_NOT_FOUND'; end if;

  if v_application.status = 'paid' and p_expected_status = 'awaiting_payment' then
    perform 1 from payment_confirmations c
      join payments p on p.id = c.payment_id
      where c.subject = 'lang' and c.subject_id = p_application_id and p.status = 'confirmed'
      for update;
    if found then
      insert into audit_log(actor, action, entity_type, entity_id, from_state, to_state)
        values (p_actor, 'lang.payment_confirmation_idempotent', 'lang_application', p_application_id, 'paid', 'paid');
      return query select 'paid'::lang_status, 'paid'::lang_status, true;
      return;
    end if;
  end if;

  if v_application.status <> p_expected_status then raise exception using errcode = 'P0001', message = 'CONCURRENT_UPDATE'; end if;
  if v_application.status <> 'awaiting_payment' then raise exception using errcode = 'P0001', message = 'INVALID_TRANSITION'; end if;
  select * into v_snapshot from lang_order_snapshots where application_id = p_application_id for update;
  if not found then raise exception using errcode = 'P0001', message = 'LANG_ORDER_SNAPSHOT_REQUIRED'; end if;
  select * into v_request from lang_payment_requests where application_id = p_application_id for update;
  if not found then raise exception using errcode = 'P0001', message = 'PAYMENT_REQUEST_REQUIRED'; end if;
  select * into v_evidence from lang_payment_evidence where payment_request_id = v_request.id for update;
  if not found
    or v_request.reported_transfer_at is null
    or v_request.revoked_at is not null
    or v_request.expires_at <= now()
    or nullif(btrim(v_request.report_reference), '') is null
    or v_evidence.reported_amount_vnd <> v_snapshot.amount_vnd
    or v_evidence.transfer_reference <> v_request.report_reference then
    raise exception using errcode = 'P0001', message = 'PAYMENT_EVIDENCE_INVALID';
  end if;
  insert into payments(subject, subject_id, amount_vnd, status, bank_ref, confirmed_at)
    values ('lang', p_application_id, v_snapshot.amount_vnd, 'confirmed', v_evidence.transfer_reference, now())
    returning id into v_payment_id;
  insert into payment_confirmations(payment_id, subject, subject_id, evidence_sha256, transfer_reference, confirmed_by)
    values (v_payment_id, 'lang', p_application_id, v_evidence.receipt_sha256, v_evidence.transfer_reference, p_confirmed_by);
  update lang_applications set status = 'paid' where id = p_application_id;
  insert into audit_log(actor, action, entity_type, entity_id, from_state, to_state)
    values (p_actor, 'lang.awaiting_payment->paid', 'lang_application', p_application_id, 'awaiting_payment', 'paid');
  return query select 'awaiting_payment'::lang_status, 'paid'::lang_status, false;
end;
$$;
