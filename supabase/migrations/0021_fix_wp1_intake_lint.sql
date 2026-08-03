-- Fix the PL/pgSQL lint warning in the 0020 active-settings intake function.
-- Forward-only function replacement; no schema/data destructive operation.
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
  v_capacity integer; v_month date := date_trunc('month', current_date)::date; v_count integer; v_settings jsonb;
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
