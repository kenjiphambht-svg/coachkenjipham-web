-- ============================================================
-- 0011 · B3 Hạt Mầm foundation. New native flow only.
--
-- Public activation stays OFF. No legacy route, Tally flow, Storage object,
-- or raw token is touched. Child data remains in its existing isolated table.
-- ============================================================

alter table hatmam_orders
  add column target_delivery_month date,
  add column submission_validated_at timestamptz;
alter table hatmam_child_profiles add column parent_question text;
alter table hatmam_orders
  add constraint hatmam_target_month_is_first_of_month
  check (target_delivery_month is null or extract(day from target_delivery_month) = 1);

alter table consents add column consent_version text;
alter table consents add column evidence jsonb not null default '{}'::jsonb;

create table hatmam_package_snapshots (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null unique references hatmam_orders(id) on delete cascade,
  package_code text not null check (package_code in ('HM-01', 'HM-02')),
  package_version text not null,
  amount_vnd bigint not null check (amount_vnd >= 0),
  delivery_business_days integer not null default 5 check (delivery_business_days > 0),
  revision_window_days integer not null default 7 check (revision_window_days >= 0),
  raw_intake_retention_months integer not null default 12 check (raw_intake_retention_months > 0),
  publication_retention_months integer not null default 24 check (publication_retention_months > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
comment on table hatmam_package_snapshots is
  'Snapshot immutable-ish of HM-01/HM-02 business terms at valid submission. Prices are working defaults until B5 settings exists.';

create table hatmam_capacity (
  month date primary key,
  max_slots integer not null default 10 check (max_slots >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint hatmam_capacity_month_is_first_of_month check (extract(day from month) = 1)
);
comment on table hatmam_capacity is 'Hạt Mầm monthly capacity. Default is 10 as Founder working default.';

create table hatmam_payment_requests (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null unique references hatmam_orders(id) on delete cascade,
  token_hash text not null unique check (token_hash ~ '^[a-f0-9]{64}$'),
  expires_at timestamptz not null,
  revoked_at timestamptz,
  reported_transfer_at timestamptz,
  report_reference text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint hatmam_payment_request_expiry check (expires_at > created_at)
);
comment on table hatmam_payment_requests is
  'Private Hạt Mầm payment-report link. SHA-256 token hash only; bank details remain an unconnected B5/B6 setting.';

create table hatmam_release_gates (
  id boolean primary key default true check (id),
  public_activation_enabled boolean not null default false,
  deletion_workflow_ready boolean not null default false,
  private_storage_ready boolean not null default false,
  updated_at timestamptz not null default now()
);
insert into hatmam_release_gates (id) values (true) on conflict (id) do nothing;
comment on table hatmam_release_gates is
  'Hard gates: no real child intake until deletion workflow and private Storage are verified. Public activation is OFF by default.';

create trigger set_updated_at before update on hatmam_package_snapshots for each row execute function set_updated_at();
create trigger set_updated_at before update on hatmam_capacity for each row execute function set_updated_at();
create trigger set_updated_at before update on hatmam_payment_requests for each row execute function set_updated_at();
create trigger set_updated_at before update on hatmam_release_gates for each row execute function set_updated_at();

alter table hatmam_package_snapshots enable row level security;
alter table hatmam_package_snapshots force row level security;
alter table hatmam_capacity enable row level security;
alter table hatmam_payment_requests enable row level security;
alter table hatmam_payment_requests force row level security;
alter table hatmam_release_gates enable row level security;
revoke all on hatmam_package_snapshots, hatmam_capacity, hatmam_payment_requests, hatmam_release_gates from anon, authenticated;
grant select on hatmam_package_snapshots, hatmam_capacity, hatmam_payment_requests, hatmam_release_gates to authenticated;
create policy hatmam_package_snapshots_select_admin on hatmam_package_snapshots for select to authenticated using (is_admin());
create policy hatmam_capacity_select_admin on hatmam_capacity for select to authenticated using (is_admin());
create policy hatmam_payment_requests_select_admin on hatmam_payment_requests for select to authenticated using (is_admin());
create policy hatmam_payment_requests_require_aal2 on hatmam_payment_requests as restrictive for select to authenticated using ((select auth.jwt()->>'aal') = 'aal2');
create policy hatmam_release_gates_select_admin on hatmam_release_gates for select to authenticated using (is_admin());

create or replace function create_hatmam_order_from_parent_intake(
  p_package_code text,
  p_parent_name text,
  p_parent_contact text,
  p_child_name text,
  p_birth_date date,
  p_birth_time time,
  p_birth_time_known boolean,
  p_birth_place text,
  p_family_context text,
  p_parent_question text,
  p_consent_version text,
  p_idempotency_key_hash text,
  p_request_hash text
) returns table (order_id uuid, order_code text)
language plpgsql security definer set search_path = public, extensions as $$
declare
  v_existing_request_hash text;
  v_existing_response jsonb;
  v_order_id uuid;
  v_order_code text;
  v_amount bigint;
begin
  if p_package_code not in ('HM-01', 'HM-02') then raise exception using errcode='P0001', message='INVALID_PACKAGE'; end if;
  if p_idempotency_key_hash !~ '^[a-f0-9]{64}$' or p_request_hash !~ '^[a-f0-9]{64}$' then raise exception using errcode='P0001', message='INVALID_IDEMPOTENCY_KEY'; end if;
  if nullif(btrim(p_parent_name), '') is null or nullif(btrim(p_parent_contact), '') is null or p_birth_date is null
    or nullif(btrim(p_parent_question), '') is null or nullif(btrim(p_consent_version), '') is null then
    raise exception using errcode='P0001', message='INVALID_INTAKE';
  end if;

  insert into api_idempotency_keys(scope, key_hash, request_hash, response)
    values ('hatmam-intake', p_idempotency_key_hash, p_request_hash, '{}'::jsonb) on conflict do nothing;
  if not found then
    select request_hash, response into v_existing_request_hash, v_existing_response from api_idempotency_keys
      where scope='hatmam-intake' and key_hash=p_idempotency_key_hash for update;
    if v_existing_request_hash <> p_request_hash then raise exception using errcode='P0001', message='IDEMPOTENCY_KEY_REUSED'; end if;
    if coalesce(v_existing_response->>'order_id','')='' then raise exception using errcode='P0001', message='IDEMPOTENCY_INCOMPLETE'; end if;
    return query select (v_existing_response->>'order_id')::uuid, v_existing_response->>'order_code'; return;
  end if;

  v_amount := case p_package_code when 'HM-01' then 2000000 else 3500000 end;
  for v_attempt in 1..5 loop
    v_order_code := 'HM-' || upper(substr(encode(extensions.gen_random_bytes(6), 'hex'), 1, 12));
    begin
      insert into hatmam_orders(order_code,status,package,parent_name,parent_contact,submission_validated_at)
        values(v_order_code,'submitted',p_package_code,p_parent_name,p_parent_contact,now()) returning id into v_order_id;
      exit;
    exception when unique_violation then
      if v_attempt=5 then raise exception using errcode='P0001', message='ORDER_CODE_RETRY_EXHAUSTED'; end if;
    end;
  end loop;
  insert into hatmam_child_profiles(order_id,child_name,birth_date,birth_time,birth_time_known,birth_place,family_context,parent_question)
    values(v_order_id,nullif(btrim(p_child_name),''),p_birth_date,p_birth_time,coalesce(p_birth_time_known,false),nullif(btrim(p_birth_place),''),nullif(btrim(p_family_context),''),nullif(btrim(p_parent_question),''));
  insert into hatmam_package_snapshots(order_id,package_code,package_version,amount_vnd)
    values(v_order_id,p_package_code,'2026-08-03-working-default',v_amount);
  insert into consents(subject,subject_id,consent_type,consent_version,granted,granted_at,evidence)
    values('hatmam',v_order_id,'parent_child_data_processing',p_consent_version,true,now(),jsonb_build_object('source','website-native-intake'));
  insert into audit_log(actor,action,entity_type,entity_id,to_state)
    values('parent:intake','hatmam.submitted','hatmam_order',v_order_id,'submitted');
  update api_idempotency_keys set response=jsonb_build_object('order_id',v_order_id,'order_code',v_order_code)
    where scope='hatmam-intake' and key_hash=p_idempotency_key_hash;
  return query select v_order_id,v_order_code;
end; $$;

revoke all on function create_hatmam_order_from_parent_intake(text,text,text,text,date,time,boolean,text,text,text,text,text,text) from public,anon,authenticated;
grant execute on function create_hatmam_order_from_parent_intake(text,text,text,text,date,time,boolean,text,text,text,text,text,text) to service_role;
