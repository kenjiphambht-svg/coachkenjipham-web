-- ============================================================
-- 0006 · Public intake write API (Lặng + liên hệ)
--
-- Không mở bảng cho anon. API server dùng service_role gọi hai RPC này;
-- mỗi RPC tự xử lý idempotency và chỉ lưu response không nhạy cảm.
-- Hạt Mầm cố ý KHÔNG có RPC ở migration này: field contract trẻ em chưa có
-- Founder input hiện hành, nên public child flow phải giữ trạng thái block.
-- ============================================================

create table api_idempotency_keys (
  scope        text not null,
  key_hash     text not null check (key_hash ~ '^[a-f0-9]{64}$'),
  request_hash text not null check (request_hash ~ '^[a-f0-9]{64}$'),
  response     jsonb not null,
  created_at   timestamptz not null default now(),
  primary key (scope, key_hash)
);

comment on table api_idempotency_keys is
  'Idempotency public API. Chỉ hash key và response không nhạy cảm (id/mã đơn), không raw request.';

alter table api_idempotency_keys enable row level security;
revoke all on api_idempotency_keys from anon, authenticated;

create or replace function create_lang_application_from_intake(
  p_q1_situation text,
  p_q2_level text,
  p_q3_prior_help text,
  p_q4_want text,
  p_q5_openness text,
  p_q6_extra text,
  p_applicant_name text,
  p_applicant_contact text,
  p_idempotency_key_hash text,
  p_request_hash text
)
returns table (application_id uuid, order_code text)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_existing_request_hash text;
  v_existing_response jsonb;
  v_application_id uuid;
  v_order_code text;
  v_attempt integer;
begin
  if p_idempotency_key_hash !~ '^[a-f0-9]{64}$'
    or p_request_hash !~ '^[a-f0-9]{64}$' then
    raise exception using errcode = 'P0001', message = 'INVALID_IDEMPOTENCY_KEY';
  end if;

  insert into api_idempotency_keys (scope, key_hash, request_hash, response)
    values ('lang-intake', p_idempotency_key_hash, p_request_hash, '{}'::jsonb)
    on conflict do nothing;

  if not found then
    select request_hash, response
      into v_existing_request_hash, v_existing_response
      from api_idempotency_keys
      where scope = 'lang-intake'
        and key_hash = p_idempotency_key_hash
      for update;

    if v_existing_request_hash <> p_request_hash then
      raise exception using errcode = 'P0001', message = 'IDEMPOTENCY_KEY_REUSED';
    end if;
    if coalesce(v_existing_response->>'application_id', '') = '' then
      raise exception using errcode = 'P0001', message = 'IDEMPOTENCY_INCOMPLETE';
    end if;

    return query
      select
        (v_existing_response->>'application_id')::uuid,
        v_existing_response->>'order_code';
    return;
  end if;

  for v_attempt in 1..5 loop
    v_order_code := 'LANG90-' || upper(substr(encode(gen_random_bytes(6), 'hex'), 1, 12));
    begin
      insert into lang_applications (
        order_code,
        q1_situation,
        q2_level,
        q3_prior_help,
        q4_want,
        q5_openness,
        q6_extra,
        applicant_name,
        applicant_contact
      ) values (
        v_order_code,
        p_q1_situation,
        p_q2_level,
        p_q3_prior_help,
        p_q4_want,
        p_q5_openness,
        nullif(p_q6_extra, ''),
        p_applicant_name,
        p_applicant_contact
      ) returning id into v_application_id;
      exit;
    exception when unique_violation then
      v_application_id := null;
    end;
  end loop;

  if v_application_id is null then
    raise exception using errcode = 'P0001', message = 'ORDER_CODE_RETRY_EXHAUSTED';
  end if;

  insert into consents (subject, subject_id, consent_type, granted, granted_at)
    values ('lang', v_application_id, 'lang_intake_v1', true, now());

  insert into audit_log (actor, action, entity_type, entity_id, to_state)
    values ('public:intake', 'lang.created', 'lang_application', v_application_id, 'submitted');

  update api_idempotency_keys
    set response = jsonb_build_object(
      'application_id', v_application_id,
      'order_code', v_order_code
    )
    where scope = 'lang-intake'
      and key_hash = p_idempotency_key_hash;

  return query select v_application_id, v_order_code;
end;
$$;

create or replace function create_contact_message_from_public_form(
  p_name text,
  p_contact text,
  p_message text,
  p_idempotency_key_hash text,
  p_request_hash text
)
returns table (message_id uuid)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_existing_request_hash text;
  v_existing_response jsonb;
  v_message_id uuid;
begin
  if p_idempotency_key_hash !~ '^[a-f0-9]{64}$'
    or p_request_hash !~ '^[a-f0-9]{64}$' then
    raise exception using errcode = 'P0001', message = 'INVALID_IDEMPOTENCY_KEY';
  end if;

  insert into api_idempotency_keys (scope, key_hash, request_hash, response)
    values ('contact-form', p_idempotency_key_hash, p_request_hash, '{}'::jsonb)
    on conflict do nothing;

  if not found then
    select request_hash, response
      into v_existing_request_hash, v_existing_response
      from api_idempotency_keys
      where scope = 'contact-form'
        and key_hash = p_idempotency_key_hash
      for update;

    if v_existing_request_hash <> p_request_hash then
      raise exception using errcode = 'P0001', message = 'IDEMPOTENCY_KEY_REUSED';
    end if;
    if coalesce(v_existing_response->>'message_id', '') = '' then
      raise exception using errcode = 'P0001', message = 'IDEMPOTENCY_INCOMPLETE';
    end if;

    return query select (v_existing_response->>'message_id')::uuid;
    return;
  end if;

  insert into contact_messages (name, contact, message)
    values (p_name, p_contact, p_message)
    returning id into v_message_id;

  update api_idempotency_keys
    set response = jsonb_build_object('message_id', v_message_id)
    where scope = 'contact-form'
      and key_hash = p_idempotency_key_hash;

  return query select v_message_id;
end;
$$;

revoke all on function create_lang_application_from_intake(
  text, text, text, text, text, text, text, text, text, text
) from public, anon, authenticated;
grant execute on function create_lang_application_from_intake(
  text, text, text, text, text, text, text, text, text, text
) to service_role;

revoke all on function create_contact_message_from_public_form(text, text, text, text, text)
  from public, anon, authenticated;
grant execute on function create_contact_message_from_public_form(text, text, text, text, text)
  to service_role;
