-- ============================================================
-- 0018 · Work Package 1 — admin operating experience.
--
-- Hai RPC service-only, luôn được gọi sau requireAdmin() AAL2 ở API route:
--   1. transition_hatmam_order: state + manual-payment evidence + audit.
--   2. save_operational_settings_version: tạo version mới, active duy nhất,
--      và audit trong cùng transaction.
-- Không mở Storage, provider, public activation hay destructive deletion.
-- ============================================================

create or replace function transition_hatmam_order(
  p_order_id uuid,
  p_expected_status hatmam_status,
  p_next_status hatmam_status,
  p_actor text,
  p_payment_amount_vnd bigint default null
)
returns table (from_status hatmam_status, to_status hatmam_status)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_current hatmam_status;
  v_allowed boolean := false;
begin
  select status into v_current from hatmam_orders where id = p_order_id for update;
  if not found then raise exception using errcode = 'P0001', message = 'ORDER_NOT_FOUND'; end if;
  if v_current <> p_expected_status then raise exception using errcode = 'P0001', message = 'CONCURRENT_UPDATE'; end if;
  if nullif(btrim(p_actor), '') is null then raise exception using errcode = 'P0001', message = 'ACTOR_REQUIRED'; end if;

  v_allowed :=
    (v_current = 'submitted' and p_next_status in ('awaiting_payment', 'cancelled'))
    or (v_current = 'awaiting_payment' and p_next_status in ('paid', 'cancelled'))
    or (v_current = 'paid' and p_next_status in ('in_production', 'cancelled'))
    or (v_current = 'in_production' and p_next_status in ('ready', 'cancelled'))
    or (v_current = 'ready' and p_next_status = 'delivered');
  if not v_allowed then raise exception using errcode = 'P0001', message = 'INVALID_TRANSITION'; end if;

  if p_next_status = 'paid' and (p_payment_amount_vnd is null or p_payment_amount_vnd < 0) then
    raise exception using errcode = 'P0001', message = 'PAYMENT_AMOUNT_REQUIRED';
  end if;

  update hatmam_orders set status = p_next_status where id = p_order_id;

  if p_next_status = 'paid' then
    if not exists (
      select 1 from payments where subject = 'hatmam' and subject_id = p_order_id and status = 'confirmed'
    ) then
      insert into payments(subject, subject_id, amount_vnd, status, confirmed_at)
        values ('hatmam', p_order_id, p_payment_amount_vnd, 'confirmed', now());
    end if;
  end if;

  insert into audit_log(actor, action, entity_type, entity_id, from_state, to_state)
    values (p_actor, 'hatmam.' || v_current::text || '->' || p_next_status::text, 'hatmam_order', p_order_id, v_current::text, p_next_status::text);

  return query select v_current, p_next_status;
end;
$$;

create or replace function save_operational_settings_version(
  p_values jsonb,
  p_actor text
)
returns table (settings_id uuid, settings_version integer, effective_at timestamptz)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_version integer;
  v_id uuid;
  v_now timestamptz := now();
begin
  if p_values is null or jsonb_typeof(p_values) <> 'object' then
    raise exception using errcode = 'P0001', message = 'INVALID_SETTINGS';
  end if;
  if nullif(btrim(p_actor), '') is null then
    raise exception using errcode = 'P0001', message = 'ACTOR_REQUIRED';
  end if;

  perform pg_advisory_xact_lock(hashtext('operational_settings_versions'));
  select coalesce(max(version), 0) + 1 into v_version from operational_settings_versions;
  update operational_settings_versions set active = false where active = true;
  insert into operational_settings_versions(version, values, active, created_by, activated_at)
    values (v_version, p_values, true, p_actor, v_now)
    returning id into v_id;
  insert into audit_log(actor, action, entity_type, entity_id)
    values (p_actor, 'settings.version_created', 'operational_settings_version', v_id);
  return query select v_id, v_version, v_now;
end;
$$;

revoke all on function transition_hatmam_order(uuid, hatmam_status, hatmam_status, text, bigint) from public, anon, authenticated;
grant execute on function transition_hatmam_order(uuid, hatmam_status, hatmam_status, text, bigint) to service_role;
revoke all on function save_operational_settings_version(jsonb, text) from public, anon, authenticated;
grant execute on function save_operational_settings_version(jsonb, text) to service_role;
