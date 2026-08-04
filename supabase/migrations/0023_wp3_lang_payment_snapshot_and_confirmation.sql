-- 0023 · WP3 Lặng payment snapshot and evidence confirmation
--
-- Forward-only, additive hardening.  It does not replay legacy payments,
-- alter old application rows, connect a bank, or activate a public route.
-- The price is snapshotted when an approved Lặng application receives its
-- private payment request; confirmation then verifies the existing report
-- and evidence in one transaction.

create table lang_order_snapshots (
  id uuid primary key default gen_random_uuid(),
  application_id uuid not null unique references lang_applications(id) on delete restrict,
  settings_version integer not null,
  amount_vnd bigint not null check (amount_vnd >= 0),
  capacity_month date not null check (extract(day from capacity_month) = 1),
  created_at timestamptz not null default now()
);
comment on table lang_order_snapshots is
  'Immutable Lặng commercial snapshot created with the private payment request. Later settings never rewrite it.';

create or replace function app_private.reject_lang_order_snapshot_update()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  raise exception using errcode = 'P0001', message = 'LANG_ORDER_SNAPSHOT_IMMUTABLE';
end;
$$;

create trigger lang_order_snapshots_immutable
  before update on lang_order_snapshots
  for each row execute function app_private.reject_lang_order_snapshot_update();

create index lang_order_snapshots_capacity_idx on lang_order_snapshots(capacity_month);

alter table lang_order_snapshots enable row level security;
alter table lang_order_snapshots force row level security;
revoke all on lang_order_snapshots from anon, authenticated;
grant select on lang_order_snapshots to authenticated;
create policy lang_order_snapshots_admin_aal2 on lang_order_snapshots
  for select to authenticated
  using (app_private.is_admin() and (select auth.jwt()->>'aal') = 'aal2');

-- The active version and its price are read and snapshotted while the
-- application row is locked. This avoids a server-side constant or a client
-- supplied amount changing a historical order.
create or replace function issue_lang_payment_request_wp3(
  p_application_id uuid,
  p_expected_status lang_status,
  p_actor text,
  p_token_hash text,
  p_expires_at timestamptz
)
returns table (capacity_month date, capacity_used integer, capacity_limit integer)
language plpgsql
security definer
set search_path = public, app_private
as $$
declare
  v_application lang_applications%rowtype;
  v_settings operational_settings_versions%rowtype;
  v_amount bigint;
  v_used integer;
  v_limit integer;
begin
  select * into v_application
    from lang_applications where id = p_application_id for update;
  if not found then raise exception using errcode = 'P0001', message = 'APPLICATION_NOT_FOUND'; end if;
  if v_application.status <> p_expected_status then raise exception using errcode = 'P0001', message = 'CONCURRENT_UPDATE'; end if;
  if v_application.status <> 'accepted' then raise exception using errcode = 'P0001', message = 'INVALID_TRANSITION'; end if;
  if nullif(btrim(p_actor), '') is null or p_actor not like 'human:%' then
    raise exception using errcode = 'P0001', message = 'HUMAN_ACTOR_REQUIRED';
  end if;
  if p_token_hash !~ '^[a-f0-9]{64}$' then raise exception using errcode = 'P0001', message = 'INVALID_TOKEN_HASH'; end if;
  if p_expires_at <= now() then raise exception using errcode = 'P0001', message = 'TOKEN_EXPIRY_INVALID'; end if;
  if v_application.target_session_month is null then raise exception using errcode = 'P0001', message = 'TARGET_MONTH_REQUIRED'; end if;

  select * into v_settings from operational_settings_versions where active = true for update;
  if not found or coalesce(v_settings.values#>>'{lang,priceVnd}', '') !~ '^\d+$' then
    raise exception using errcode = 'P0001', message = 'LANG_SETTINGS_REQUIRED';
  end if;
  v_amount := (v_settings.values#>>'{lang,priceVnd}')::bigint;

  perform pg_advisory_xact_lock(hashtext(v_application.target_session_month::text));
  select count(*)::integer into v_used from lang_applications
    where target_session_month = v_application.target_session_month
      and status in ('awaiting_payment', 'paid', 'scheduled', 'completed');
  select max_slots into v_limit from lang_capacity where month = v_application.target_session_month;
  v_limit := coalesce(v_limit, 5);
  if v_used >= v_limit then raise exception using errcode = 'P0001', message = 'CAPACITY_FULL'; end if;

  insert into lang_order_snapshots(application_id, settings_version, amount_vnd, capacity_month)
    values (p_application_id, v_settings.version, v_amount, v_application.target_session_month);
  insert into lang_payment_requests(application_id, token_hash, expires_at)
    values (p_application_id, p_token_hash, p_expires_at);
  update lang_applications set status = 'awaiting_payment' where id = p_application_id;
  insert into audit_log(actor, action, entity_type, entity_id, from_state, to_state)
    values (p_actor, 'lang.accepted->awaiting_payment', 'lang_application', p_application_id, 'accepted', 'awaiting_payment');

  return query select v_application.target_session_month, v_used + 1, v_limit;
end;
$$;

-- Manual bank confirmation only. An already-confirmed, evidence-bound request
-- returns an idempotent result; all other stale or incomplete requests fail.
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
  v_existing_confirmation uuid;
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
    select c.id into v_existing_confirmation
      from payment_confirmations c
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

comment on function confirm_lang_payment_with_evidence(uuid, lang_status, text, uuid) is
  'Server-only Lặng payment confirmation: locks application/request/evidence/snapshot and writes payment, confirmation and audit atomically.';

revoke all on function issue_lang_payment_request_wp3(uuid, lang_status, text, text, timestamptz)
  from public, anon, authenticated;
grant execute on function issue_lang_payment_request_wp3(uuid, lang_status, text, text, timestamptz)
  to service_role;
revoke all on function confirm_lang_payment_with_evidence(uuid, lang_status, text, uuid)
  from public, anon, authenticated;
grant execute on function confirm_lang_payment_with_evidence(uuid, lang_status, text, uuid)
  to service_role;
