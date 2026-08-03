-- ============================================================
-- 0020 · WP1 founder-acceptance correction pass.
--
-- Adds audited, synthetic-only review/deletion workflows and makes Hạt Mầm
-- payment/state/settings invariants explicit. No Storage object, provider,
-- real deletion or public activation is enabled by this migration.
-- ============================================================

alter type hatmam_status add value if not exists 'review_pending';
alter type hatmam_status add value if not exists 'revision_requested';

alter table hatmam_orders
  add column if not exists payment_confirmed_at timestamptz,
  add column if not exists delivery_due_at date,
  add column if not exists revision_deadline_at date;

alter table hatmam_package_snapshots
  add column if not exists package_name text;

create table hatmam_payment_evidence (
  id uuid primary key default gen_random_uuid(),
  payment_request_id uuid not null unique references hatmam_payment_requests(id) on delete cascade,
  evidence_kind text not null check (evidence_kind in ('synthetic_receipt', 'manual_receipt_metadata')),
  receipt_file_name text not null check (length(btrim(receipt_file_name)) > 0),
  receipt_sha256 text not null check (receipt_sha256 ~ '^[a-f0-9]{64}$'),
  reported_amount_vnd bigint not null check (reported_amount_vnd >= 0),
  transfer_reference text not null check (length(btrim(transfer_reference)) > 0),
  created_at timestamptz not null default now()
);
comment on table hatmam_payment_evidence is
  'Receipt metadata evidence for manual payment review. WP1 fixtures use synthetic_receipt only; no banking credential, object or image is stored.';
alter table hatmam_payment_evidence enable row level security;
alter table hatmam_payment_evidence force row level security;
revoke all on hatmam_payment_evidence from anon, authenticated;
grant select on hatmam_payment_evidence to authenticated;
create policy hatmam_payment_evidence_select_admin_aal2 on hatmam_payment_evidence
  for select to authenticated using (app_private.is_admin() and (select auth.jwt()->>'aal') = 'aal2');

create table hatmam_synthetic_publications (
  order_id uuid primary key references hatmam_orders(id) on delete cascade,
  status text not null default 'draft'
    check (status in ('draft', 'revision_requested', 'approved', 'revoked')),
  metadata jsonb not null default '{}'::jsonb,
  checksum_sha256 text not null check (checksum_sha256 ~ '^[a-f0-9]{64}$'),
  revision_reason text,
  updated_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);
comment on table hatmam_synthetic_publications is
  'Synthetic-only WP1 publication review ledger. It never represents a Storage object or delivery.';
create trigger set_updated_at before update on hatmam_synthetic_publications for each row execute function set_updated_at();
alter table hatmam_synthetic_publications enable row level security;
alter table hatmam_synthetic_publications force row level security;
revoke all on hatmam_synthetic_publications from anon, authenticated;
grant select on hatmam_synthetic_publications to authenticated;
create policy hatmam_synthetic_publications_select_admin_aal2 on hatmam_synthetic_publications
  for select to authenticated using (app_private.is_admin() and (select auth.jwt()->>'aal') = 'aal2');

create table hatmam_synthetic_deletion_runs (
  request_id uuid primary key references data_deletion_requests(id) on delete cascade,
  status text not null default 'previewed'
    check (status in ('previewed', 'confirmation_attempted', 'fail_closed', 'retry_ready')),
  affected_records jsonb not null default '[]'::jsonb,
  execution_order jsonb not null default '[]'::jsonb,
  attempts integer not null default 0 check (attempts >= 0),
  last_result text not null default 'PREVIEW_ONLY',
  updated_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);
comment on table hatmam_synthetic_deletion_runs is
  'Synthetic-only deletion acceptance ledger. Confirmation is recorded as fail-closed and never calls Storage or destructive SQL.';
create trigger set_updated_at before update on hatmam_synthetic_deletion_runs for each row execute function set_updated_at();
alter table hatmam_synthetic_deletion_runs enable row level security;
alter table hatmam_synthetic_deletion_runs force row level security;
revoke all on hatmam_synthetic_deletion_runs from anon, authenticated;
grant select on hatmam_synthetic_deletion_runs to authenticated;
create policy hatmam_synthetic_deletion_runs_select_admin_aal2 on hatmam_synthetic_deletion_runs
  for select to authenticated using (app_private.is_admin() and (select auth.jwt()->>'aal') = 'aal2');

create or replace function app_private.add_business_days(p_start date, p_days integer)
returns date
language sql
immutable
set search_path = public
as $$
  select coalesce(
    (select d::date
       from generate_series(p_start + 1, p_start + greatest(p_days * 3 + 7, 14), interval '1 day') d
      where extract(isodow from d) < 6
      order by d
      offset greatest(p_days - 1, 0) limit 1),
    p_start
  );
$$;

create or replace function app_private.assert_operational_settings_values(p_values jsonb)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_hm jsonb := p_values->'hatmam';
  v_lang jsonb := p_values->'lang';
  v_booking jsonb := v_lang->'bookingDefaults';
  v_integrations jsonb := p_values->'integrations';
begin
  if jsonb_typeof(p_values) <> 'object' or jsonb_typeof(v_hm) <> 'object'
    or jsonb_typeof(v_lang) <> 'object' or jsonb_typeof(v_booking) <> 'object'
    or jsonb_typeof(v_integrations) <> 'object' then
    raise exception using errcode = 'P0001', message = 'INVALID_SETTINGS';
  end if;
  if coalesce(v_hm->>'hm01Name','') = '' or coalesce(v_hm->>'hm02Name','') = ''
    or coalesce(v_lang->>'publicLocationLabel','') = '' then
    raise exception using errcode = 'P0001', message = 'INVALID_SETTINGS';
  end if;
  if (v_hm->>'hm01LaunchPriceVnd') !~ '^\d+$' or (v_hm->>'hm01ReferencePriceVnd') !~ '^\d+$'
    or (v_hm->>'hm02LaunchPriceVnd') !~ '^\d+$' or (v_hm->>'hm02ReferencePriceVnd') !~ '^\d+$'
    or (v_hm->>'capacityMonth') !~ '^\d+$' or (v_hm->>'deliveryBusinessDays') !~ '^\d+$'
    or (v_hm->>'revisionWindowDays') !~ '^\d+$' or (v_hm->>'rawIntakeRetentionMonths') !~ '^\d+$'
    or (v_hm->>'publicationRetentionMonths') !~ '^\d+$' or (v_lang->>'priceVnd') !~ '^\d+$'
    or (v_lang->>'capacityMonth') !~ '^\d+$' or (v_lang->>'responseSlaMinutes') !~ '^\d+$'
    or (v_lang->>'paymentConfirmationSlaMinutes') !~ '^\d+$' or (v_lang->>'sessionDurationMinutes') !~ '^\d+$'
    or (v_booking->>'postSessionBufferMinutes') !~ '^\d+$' or (v_booking->>'minNoticeHours') !~ '^\d+$'
    or (v_booking->>'bookingHorizonDays') !~ '^\d+$' or (v_booking->>'rescheduleDeadlineHours') !~ '^\d+$'
    or (v_booking->>'maxBookingsPerWeek') !~ '^\d+$' or (v_booking->>'hardMonthlyCapacity') !~ '^\d+$' then
    raise exception using errcode = 'P0001', message = 'INVALID_SETTINGS';
  end if;
  if (v_hm->>'hm01ReferencePriceVnd')::bigint < (v_hm->>'hm01LaunchPriceVnd')::bigint
    or (v_hm->>'hm02ReferencePriceVnd')::bigint < (v_hm->>'hm02LaunchPriceVnd')::bigint
    or (v_hm->>'capacityMonth')::integer not between 1 and 100
    or (v_hm->>'deliveryBusinessDays')::integer not between 1 and 60
    or (v_hm->>'revisionWindowDays')::integer not between 0 and 60
    or (v_hm->>'rawIntakeRetentionMonths')::integer not between 1 and 120
    or (v_hm->>'publicationRetentionMonths')::integer not between 1 and 120
    or (v_lang->>'capacityMonth')::integer not between 1 and 100
    or (v_lang->>'responseSlaMinutes')::integer not between 1 and 1440
    or (v_lang->>'paymentConfirmationSlaMinutes')::integer not between 1 and 1440
    or (v_lang->>'sessionDurationMinutes')::integer not between 15 and 480
    or (v_booking->>'bookingHorizonDays')::integer not between 1 and 365
    or (v_booking->>'hardMonthlyCapacity')::integer <> (v_lang->>'capacityMonth')::integer then
    raise exception using errcode = 'P0001', message = 'INVALID_SETTINGS';
  end if;
  if coalesce((v_hm->>'publicActivationEnabled')::boolean, true)
    or coalesce((v_integrations->>'privateStorageReady')::boolean, true)
    or coalesce((v_integrations->>'deletionWorkflowReady')::boolean, true)
    or coalesce(v_integrations->>'resendReadiness','') <> 'off'
    or coalesce(v_integrations->>'calcomReadiness','') <> 'off' then
    raise exception using errcode = 'P0001', message = 'FROZEN_READINESS';
  end if;
end;
$$;

create or replace function save_operational_settings_version(p_values jsonb, p_actor text)
returns table (settings_id uuid, settings_version integer, effective_at timestamptz)
language plpgsql security definer set search_path = public as $$
declare v_version integer; v_id uuid; v_now timestamptz := now();
begin
  if nullif(btrim(p_actor), '') is null then raise exception using errcode = 'P0001', message = 'ACTOR_REQUIRED'; end if;
  perform app_private.assert_operational_settings_values(p_values);
  perform pg_advisory_xact_lock(hashtext('operational_settings_versions'));
  select coalesce(max(version), 0) + 1 into v_version from operational_settings_versions;
  update operational_settings_versions set active = false where active = true;
  insert into operational_settings_versions(version, values, active, created_by, activated_at)
    values (v_version, p_values, true, p_actor, v_now) returning id into v_id;
  insert into audit_log(actor, action, entity_type, entity_id)
    values (p_actor, 'settings.version_created', 'operational_settings_version', v_id);
  return query select v_id, v_version, v_now;
end;
$$;

create or replace function transition_hatmam_order(
  p_order_id uuid, p_expected_status hatmam_status, p_next_status hatmam_status,
  p_actor text, p_payment_amount_vnd bigint default null
)
returns table (from_status hatmam_status, to_status hatmam_status)
language plpgsql security definer set search_path = public, app_private as $$
declare
  v_current hatmam_status; v_allowed boolean := false; v_order_code text;
  v_amount bigint; v_delivery_days integer; v_revision_days integer;
  v_reported_at timestamptz; v_revoked_at timestamptz; v_request_reference text;
  v_evidence_amount bigint; v_evidence_reference text; v_evidence_sha text;
begin
  select status, order_code into v_current, v_order_code from hatmam_orders where id = p_order_id for update;
  if not found then raise exception using errcode = 'P0001', message = 'ORDER_NOT_FOUND'; end if;
  if v_current <> p_expected_status then raise exception using errcode = 'P0001', message = 'CONCURRENT_UPDATE'; end if;
  if nullif(btrim(p_actor), '') is null then raise exception using errcode = 'P0001', message = 'ACTOR_REQUIRED'; end if;
  v_allowed :=
    (v_current = 'submitted' and p_next_status in ('awaiting_payment', 'cancelled'))
    or (v_current = 'awaiting_payment' and p_next_status in ('paid', 'cancelled'))
    or (v_current = 'paid' and p_next_status in ('in_production', 'cancelled'))
    or (v_current = 'in_production' and p_next_status in ('review_pending', 'cancelled'))
    or (v_current = 'review_pending' and p_next_status in ('revision_requested', 'ready', 'cancelled'))
    or (v_current = 'revision_requested' and p_next_status in ('in_production', 'cancelled'))
    or (v_current = 'ready' and p_next_status = 'cancelled');
  if not v_allowed then raise exception using errcode = 'P0001', message = 'INVALID_TRANSITION'; end if;

  if p_next_status = 'paid' then
    select s.amount_vnd, s.delivery_business_days, s.revision_window_days
      into v_amount, v_delivery_days, v_revision_days from hatmam_package_snapshots s where s.order_id = p_order_id;
    if not found then raise exception using errcode = 'P0001', message = 'PACKAGE_SNAPSHOT_REQUIRED'; end if;
    select r.reported_transfer_at, r.revoked_at, r.report_reference,
           e.reported_amount_vnd, e.transfer_reference, e.receipt_sha256
      into v_reported_at, v_revoked_at, v_request_reference, v_evidence_amount, v_evidence_reference, v_evidence_sha
      from hatmam_payment_requests r join hatmam_payment_evidence e on e.payment_request_id = r.id
      where r.order_id = p_order_id for update;
    if not found or v_reported_at is null or v_revoked_at is not null or v_evidence_sha is null
      or v_evidence_amount <> v_amount or v_evidence_reference <> ('HATMAM ' || v_order_code)
      or v_request_reference <> v_evidence_reference or (p_payment_amount_vnd is not null and p_payment_amount_vnd <> v_amount) then
      raise exception using errcode = 'P0001', message = 'PAYMENT_EVIDENCE_INVALID';
    end if;
  end if;

  update hatmam_orders set
    status = p_next_status,
    payment_confirmed_at = case when p_next_status = 'paid' then now() else payment_confirmed_at end,
    delivery_due_at = case when p_next_status = 'paid' then app_private.add_business_days(current_date, v_delivery_days) else delivery_due_at end,
    revision_deadline_at = case when p_next_status = 'paid' then app_private.add_business_days(current_date, v_delivery_days) + v_revision_days else revision_deadline_at end
  where id = p_order_id;

  if p_next_status = 'paid' and not exists (select 1 from payments where subject = 'hatmam' and subject_id = p_order_id and status = 'confirmed') then
    insert into payments(subject, subject_id, amount_vnd, status, bank_ref, confirmed_at)
      values ('hatmam', p_order_id, v_amount, 'confirmed', v_evidence_reference, now());
  end if;
  insert into audit_log(actor, action, entity_type, entity_id, from_state, to_state)
    values (p_actor, 'hatmam.' || v_current::text || '->' || p_next_status::text, 'hatmam_order', p_order_id, v_current::text, p_next_status::text);
  return query select v_current, p_next_status;
end;
$$;

create or replace function run_hatmam_synthetic_publication_action(p_order_id uuid, p_action text, p_actor text)
returns table (publication_status text)
language plpgsql security definer set search_path = public as $$
declare v_status text; v_next text;
begin
  if nullif(btrim(p_actor), '') is null then raise exception using errcode = 'P0001', message = 'ACTOR_REQUIRED'; end if;
  if not exists (select 1 from hatmam_orders where id = p_order_id and order_code like 'HATMAM-TEST%' and parent_name like '%Test%') then
    raise exception using errcode = 'P0001', message = 'SYNTHETIC_ONLY';
  end if;
  select status into v_status from hatmam_synthetic_publications where order_id = p_order_id for update;
  if not found then raise exception using errcode = 'P0001', message = 'SYNTHETIC_PUBLICATION_NOT_FOUND'; end if;
  v_next := case
    when p_action = 'request_revision' and v_status in ('draft', 'approved') then 'revision_requested'
    when p_action = 'approve' and v_status in ('draft', 'revision_requested') then 'approved'
    when p_action = 'revoke' and v_status = 'approved' then 'revoked'
    else null end;
  if v_next is null then raise exception using errcode = 'P0001', message = 'INVALID_SYNTHETIC_PUBLICATION_ACTION'; end if;
  update hatmam_synthetic_publications set status = v_next,
    revision_reason = case when v_next = 'revision_requested' then 'Synthetic review: cần Kenji chỉnh sửa trước khi duyệt lại.' else revision_reason end
    where order_id = p_order_id;
  insert into audit_log(actor, action, entity_type, entity_id, from_state, to_state)
    values (p_actor, 'synthetic_publication.' || p_action, 'hatmam_synthetic_publication', p_order_id, v_status, v_next);
  return query select v_next;
end;
$$;

create or replace function run_hatmam_synthetic_deletion_action(p_request_id uuid, p_action text, p_actor text)
returns table (deletion_status text, result_code text)
language plpgsql security definer set search_path = public as $$
declare v_status text; v_next text; v_attempts integer;
begin
  if nullif(btrim(p_actor), '') is null then raise exception using errcode = 'P0001', message = 'ACTOR_REQUIRED'; end if;
  if not exists (
    select 1 from data_deletion_requests d join hatmam_orders o on o.id = d.subject_id
     where d.id = p_request_id and o.order_code like 'HATMAM-TEST%' and o.parent_name like '%Test%'
       and d.execution_evidence->>'source' = 'wp1-synthetic-fixture'
  ) then raise exception using errcode = 'P0001', message = 'SYNTHETIC_ONLY'; end if;
  insert into hatmam_synthetic_deletion_runs(request_id, affected_records, execution_order)
    values (p_request_id,
      '["synthetic publication metadata", "synthetic deletion audit", "parent-intake preview"]'::jsonb,
      '["private Storage object (NOT CALLED)", "publication metadata (NOT CALLED)", "audit evidence"]'::jsonb)
    on conflict (request_id) do nothing;
  select status, attempts into v_status, v_attempts from hatmam_synthetic_deletion_runs where request_id = p_request_id for update;
  v_next := case when p_action = 'open' then 'previewed' when p_action = 'confirm' then 'fail_closed' when p_action = 'retry' then 'retry_ready' else null end;
  if v_next is null then raise exception using errcode = 'P0001', message = 'INVALID_SYNTHETIC_DELETION_ACTION'; end if;
  update hatmam_synthetic_deletion_runs set status = v_next,
    attempts = case when p_action = 'confirm' then v_attempts + 1 else v_attempts end,
    last_result = case when p_action = 'confirm' then 'FAIL_CLOSED_B4_STORAGE_AND_DELETION_GATE' when p_action = 'retry' then 'RETRY_READY_NO_DESTRUCTIVE_CALL' else 'PREVIEW_ONLY' end
    where request_id = p_request_id;
  insert into audit_log(actor, action, entity_type, entity_id, from_state, to_state)
    values (p_actor, 'synthetic_deletion.' || p_action, 'hatmam_synthetic_deletion', p_request_id, v_status, v_next);
  return query select v_next, case when p_action = 'confirm' then 'FAIL_CLOSED' else 'PREVIEW' end;
end;
$$;

-- Existing public intake signature remains unchanged; active settings become
-- the source of new-order package, capacity, delivery, revision and retention snapshots.
create or replace function create_hatmam_order_from_parent_intake(
  p_package_code text, p_parent_name text, p_parent_contact text, p_child_name text,
  p_birth_date date, p_birth_time time, p_birth_time_known boolean, p_birth_place text,
  p_family_context text, p_parent_question text, p_consent_version text,
  p_idempotency_key_hash text, p_request_hash text
) returns table (order_id uuid, order_code text)
language plpgsql security definer set search_path = public, extensions as $$
declare
  v_existing_request_hash text; v_existing_response jsonb; v_order_id uuid; v_order_code text;
  v_amount bigint; v_package_name text; v_delivery integer; v_revision integer; v_raw_retention integer; v_pub_retention integer;
  v_capacity integer; v_month date := date_trunc('month', current_date)::date; v_count integer; v_settings jsonb; v_attempt integer;
begin
  if p_package_code not in ('HM-01', 'HM-02') then raise exception using errcode='P0001', message='INVALID_PACKAGE'; end if;
  if p_idempotency_key_hash !~ '^[a-f0-9]{64}$' or p_request_hash !~ '^[a-f0-9]{64}$' then raise exception using errcode='P0001', message='INVALID_IDEMPOTENCY_KEY'; end if;
  if nullif(btrim(p_parent_name), '') is null or nullif(btrim(p_parent_contact), '') is null or p_birth_date is null or nullif(btrim(p_parent_question), '') is null or nullif(btrim(p_consent_version), '') is null then raise exception using errcode='P0001', message='INVALID_INTAKE'; end if;
  insert into api_idempotency_keys(scope, key_hash, request_hash, response) values ('hatmam-intake', p_idempotency_key_hash, p_request_hash, '{}'::jsonb) on conflict do nothing;
  if not found then
    select request_hash, response into v_existing_request_hash, v_existing_response from api_idempotency_keys where scope='hatmam-intake' and key_hash=p_idempotency_key_hash for update;
    if v_existing_request_hash <> p_request_hash then raise exception using errcode='P0001', message='IDEMPOTENCY_KEY_REUSED'; end if;
    if coalesce(v_existing_response->>'order_id','')='' then raise exception using errcode='P0001', message='IDEMPOTENCY_INCOMPLETE'; end if;
    return query select (v_existing_response->>'order_id')::uuid, v_existing_response->>'order_code'; return;
  end if;
  select values into v_settings from operational_settings_versions where active = true for update;
  if not found then raise exception using errcode='P0001', message='SETTINGS_REQUIRED'; end if;
  v_capacity := coalesce((v_settings#>>'{hatmam,capacityMonth}')::integer, (v_settings#>>'{hatmam,capacity_month}')::integer, 10);
  select count(*) into v_count from hatmam_orders where target_delivery_month = v_month and status <> 'cancelled';
  if v_count >= v_capacity then raise exception using errcode='P0001', message='CAPACITY_FULL'; end if;
  insert into hatmam_capacity(month,max_slots) values(v_month,v_capacity) on conflict (month) do update set max_slots = excluded.max_slots;
  if p_package_code = 'HM-01' then
    v_amount := coalesce((v_settings#>>'{hatmam,hm01LaunchPriceVnd}')::bigint, (v_settings#>>'{hatmam,hm01_price_vnd}')::bigint, 2000000);
    v_package_name := coalesce(nullif(v_settings#>>'{hatmam,hm01Name}',''), 'Ấn phẩm Bản Sắc');
  else
    v_amount := coalesce((v_settings#>>'{hatmam,hm02LaunchPriceVnd}')::bigint, (v_settings#>>'{hatmam,hm02_price_vnd}')::bigint, 3500000);
    v_package_name := coalesce(nullif(v_settings#>>'{hatmam,hm02Name}',''), 'Trò Chuyện Cùng Kenji');
  end if;
  v_delivery := coalesce((v_settings#>>'{hatmam,deliveryBusinessDays}')::integer, (v_settings#>>'{hatmam,delivery_business_days}')::integer, 5);
  v_revision := coalesce((v_settings#>>'{hatmam,revisionWindowDays}')::integer, (v_settings#>>'{hatmam,revision_window_days}')::integer, 7);
  v_raw_retention := coalesce((v_settings#>>'{hatmam,rawIntakeRetentionMonths}')::integer, (v_settings#>>'{hatmam,raw_intake_retention_months}')::integer, 12);
  v_pub_retention := coalesce((v_settings#>>'{hatmam,publicationRetentionMonths}')::integer, (v_settings#>>'{hatmam,publication_retention_months}')::integer, 24);
  for v_attempt in 1..5 loop
    v_order_code := 'HM-' || upper(substr(encode(extensions.gen_random_bytes(6), 'hex'), 1, 12));
    begin insert into hatmam_orders(order_code,status,package,parent_name,parent_contact,submission_validated_at,target_delivery_month) values(v_order_code,'submitted',p_package_code,p_parent_name,p_parent_contact,now(),v_month) returning id into v_order_id; exit;
    exception when unique_violation then if v_attempt=5 then raise exception using errcode='P0001', message='ORDER_CODE_RETRY_EXHAUSTED'; end if; end;
  end loop;
  insert into hatmam_child_profiles(order_id,child_name,birth_date,birth_time,birth_time_known,birth_place,family_context,parent_question) values(v_order_id,nullif(btrim(p_child_name),''),p_birth_date,p_birth_time,coalesce(p_birth_time_known,false),nullif(btrim(p_birth_place),''),nullif(btrim(p_family_context),''),nullif(btrim(p_parent_question),''));
  insert into hatmam_package_snapshots(order_id,package_code,package_name,package_version,amount_vnd,delivery_business_days,revision_window_days,raw_intake_retention_months,publication_retention_months) values(v_order_id,p_package_code,v_package_name,'active-settings-v' || (select version from operational_settings_versions where active),v_amount,v_delivery,v_revision,v_raw_retention,v_pub_retention);
  insert into consents(subject,subject_id,consent_type,consent_version,granted,granted_at,evidence) values('hatmam',v_order_id,'parent_child_data_processing',p_consent_version,true,now(),jsonb_build_object('source','website-native-intake'));
  insert into audit_log(actor,action,entity_type,entity_id,to_state) values('parent:intake','hatmam.submitted','hatmam_order',v_order_id,'submitted');
  update api_idempotency_keys set response=jsonb_build_object('order_id',v_order_id,'order_code',v_order_code) where scope='hatmam-intake' and key_hash=p_idempotency_key_hash;
  return query select v_order_id,v_order_code;
end; $$;

insert into hatmam_payment_evidence(payment_request_id,evidence_kind,receipt_file_name,receipt_sha256,reported_amount_vnd,transfer_reference)
select r.id, 'synthetic_receipt', 'hatmam-test01-receipt.synthetic', encode(extensions.digest('wp1-test01-receipt', 'sha256'),'hex'), 2000000, 'HATMAM HATMAM-TEST01'
from hatmam_payment_requests r join hatmam_orders o on o.id = r.order_id
where o.order_code = 'HATMAM-TEST01' and o.parent_name like '%Test%'
on conflict (payment_request_id) do nothing;

update hatmam_orders set status = 'ready', payment_confirmed_at = now() - interval '9 days', delivery_due_at = current_date - 2, revision_deadline_at = current_date + 5
where order_code = 'HATMAM-TEST02' and parent_name like '%Test%';
update hatmam_orders set status = 'in_production', payment_confirmed_at = now() - interval '10 days', delivery_due_at = current_date - 3, revision_deadline_at = current_date + 4
where order_code = 'HATMAM-TEST03' and parent_name like '%Test%';

insert into hatmam_synthetic_publications(order_id,status,metadata,checksum_sha256)
select id, 'draft', jsonb_build_object('synthetic',true,'package','HM-02','review_checklist','ready for Founder acceptance'), encode(extensions.digest('wp1-test02-publication','sha256'),'hex')
from hatmam_orders where order_code = 'HATMAM-TEST02' and parent_name like '%Test%'
on conflict (order_id) do nothing;

revoke all on function app_private.assert_operational_settings_values(jsonb) from public, anon, authenticated;
revoke all on function transition_hatmam_order(uuid,hatmam_status,hatmam_status,text,bigint) from public, anon, authenticated;
grant execute on function transition_hatmam_order(uuid,hatmam_status,hatmam_status,text,bigint) to service_role;
revoke all on function run_hatmam_synthetic_publication_action(uuid,text,text) from public, anon, authenticated;
grant execute on function run_hatmam_synthetic_publication_action(uuid,text,text) to service_role;
revoke all on function run_hatmam_synthetic_deletion_action(uuid,text,text) from public, anon, authenticated;
grant execute on function run_hatmam_synthetic_deletion_action(uuid,text,text) to service_role;
