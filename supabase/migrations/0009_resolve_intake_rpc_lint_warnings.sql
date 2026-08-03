-- ============================================================
-- 0009 · Resolve verified PL/pgSQL compiler warnings in the public intake RPC.
--
-- Forward-only: 0006/0008 are already applied to staging. This preserves
-- behavior while removing a shadowed declaration and making the retry counter
-- semantically meaningful on the final collision attempt.
-- ============================================================

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
set search_path = public, extensions
as $$
declare
  v_existing_request_hash text;
  v_existing_response jsonb;
  v_application_id uuid;
  v_order_code text;
  v_order_attempt integer;
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
      where scope = 'lang-intake' and key_hash = p_idempotency_key_hash
      for update;

    if v_existing_request_hash <> p_request_hash then
      raise exception using errcode = 'P0001', message = 'IDEMPOTENCY_KEY_REUSED';
    end if;
    if coalesce(v_existing_response->>'application_id', '') = '' then
      raise exception using errcode = 'P0001', message = 'IDEMPOTENCY_INCOMPLETE';
    end if;

    return query select (v_existing_response->>'application_id')::uuid,
      v_existing_response->>'order_code';
    return;
  end if;

  for v_order_attempt in 1..5 loop
    v_order_code := 'LANG90-' || upper(substr(encode(extensions.gen_random_bytes(6), 'hex'), 1, 12));
    begin
      insert into lang_applications (
        order_code, q1_situation, q2_level, q3_prior_help, q4_want, q5_openness,
        q6_extra, applicant_name, applicant_contact
      ) values (
        v_order_code, p_q1_situation, p_q2_level, p_q3_prior_help, p_q4_want,
        p_q5_openness, nullif(p_q6_extra, ''), p_applicant_name, p_applicant_contact
      ) returning id into v_application_id;
      exit;
    exception when unique_violation then
      if v_order_attempt = 5 then
        raise exception using errcode = 'P0001', message = 'ORDER_CODE_RETRY_EXHAUSTED';
      end if;
    end;
  end loop;

  insert into consents (subject, subject_id, consent_type, granted, granted_at)
    values ('lang', v_application_id, 'lang_intake_v1', true, now());
  insert into audit_log (actor, action, entity_type, entity_id, to_state)
    values ('public:intake', 'lang.created', 'lang_application', v_application_id, 'submitted');
  update api_idempotency_keys
    set response = jsonb_build_object('application_id', v_application_id, 'order_code', v_order_code)
    where scope = 'lang-intake' and key_hash = p_idempotency_key_hash;
  return query select v_application_id, v_order_code;
end;
$$;

revoke all on function create_lang_application_from_intake(
  text, text, text, text, text, text, text, text, text, text
) from public, anon, authenticated;
grant execute on function create_lang_application_from_intake(
  text, text, text, text, text, text, text, text, text, text
) to service_role;
