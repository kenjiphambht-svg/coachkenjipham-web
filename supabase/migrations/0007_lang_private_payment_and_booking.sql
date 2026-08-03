-- ============================================================
-- 0007 · B2 Lặng: payment report riêng tư + booking token riêng tư
--
-- Không lưu token thô. Hai RPC dùng service_role và tự khoá dòng trước
-- khi ghi, để trạng thái/payment link/audit không bị lệch khi có request
-- đồng thời. Chưa chứa thông tin ngân hàng hay Cal.com: hai integration
-- đó được nối qua adapter/settings ở phase riêng.
-- ============================================================

create table lang_payment_requests (
  id                  uuid primary key default gen_random_uuid(),
  application_id      uuid not null unique references lang_applications(id) on delete cascade,
  token_hash          text not null unique check (token_hash ~ '^[a-f0-9]{64}$'),
  expires_at          timestamptz not null,
  revoked_at          timestamptz,
  reported_transfer_at timestamptz,
  report_reference    text,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now(),
  constraint lang_payment_request_expiry check (expires_at > created_at)
);

comment on table lang_payment_requests is
  'Private payment-report link for a Lặng application. Token is SHA-256 only; bank details are intentionally not stored here.';

create trigger set_updated_at before update on lang_payment_requests
  for each row execute function set_updated_at();

alter table lang_payment_requests enable row level security;
alter table lang_payment_requests force row level security;
revoke all on lang_payment_requests from anon, authenticated;
grant select on lang_payment_requests to authenticated;

create policy lang_payment_requests_select_admin on lang_payment_requests
  for select to authenticated using (is_admin());
create policy lang_payment_requests_require_aal2 on lang_payment_requests
  as restrictive for select to authenticated
  using ((select auth.jwt()->>'aal') = 'aal2');

-- Issue payment + reserve capacity + private payment link in one transaction.
create or replace function issue_lang_payment_request(
  p_application_id uuid,
  p_expected_status lang_status,
  p_actor text,
  p_token_hash text,
  p_expires_at timestamptz
)
returns table (capacity_month date, capacity_used integer, capacity_limit integer)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_application lang_applications%rowtype;
  v_used integer;
  v_limit integer;
begin
  select * into v_application from lang_applications where id = p_application_id for update;
  if not found then raise exception using errcode = 'P0001', message = 'APPLICATION_NOT_FOUND'; end if;
  if v_application.status <> p_expected_status then raise exception using errcode = 'P0001', message = 'CONCURRENT_UPDATE'; end if;
  if v_application.status <> 'accepted' then raise exception using errcode = 'P0001', message = 'INVALID_TRANSITION'; end if;
  if p_actor is null or btrim(p_actor) = '' then raise exception using errcode = 'P0001', message = 'ACTOR_REQUIRED'; end if;
  if p_token_hash !~ '^[a-f0-9]{64}$' then raise exception using errcode = 'P0001', message = 'INVALID_TOKEN_HASH'; end if;
  if p_expires_at <= now() then raise exception using errcode = 'P0001', message = 'TOKEN_EXPIRY_INVALID'; end if;
  if v_application.target_session_month is null then raise exception using errcode = 'P0001', message = 'TARGET_MONTH_REQUIRED'; end if;

  perform pg_advisory_xact_lock(hashtext(v_application.target_session_month::text));
  select count(*)::integer into v_used from lang_applications
    where target_session_month = v_application.target_session_month
      and status in ('awaiting_payment', 'paid', 'scheduled', 'completed');
  select max_slots into v_limit from lang_capacity where month = v_application.target_session_month;
  v_limit := coalesce(v_limit, 5);
  if v_used >= v_limit then raise exception using errcode = 'P0001', message = 'CAPACITY_FULL'; end if;

  update lang_applications set status = 'awaiting_payment' where id = p_application_id;
  insert into lang_payment_requests (application_id, token_hash, expires_at)
    values (p_application_id, p_token_hash, p_expires_at)
    on conflict (application_id) do update set
      token_hash = excluded.token_hash,
      expires_at = excluded.expires_at,
      revoked_at = null,
      reported_transfer_at = null,
      report_reference = null;
  insert into audit_log (actor, action, entity_type, entity_id, from_state, to_state)
    values (p_actor, 'lang.accepted->awaiting_payment', 'lang_application', p_application_id, 'accepted', 'awaiting_payment');

  return query select v_application.target_session_month, v_used + 1, v_limit;
end;
$$;

create or replace function issue_lang_booking_token(
  p_application_id uuid,
  p_actor text,
  p_token_hash text,
  p_expires_at timestamptz
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare v_status lang_status;
begin
  select status into v_status from lang_applications where id = p_application_id for update;
  if not found then raise exception using errcode = 'P0001', message = 'APPLICATION_NOT_FOUND'; end if;
  if v_status not in ('paid', 'scheduled') then raise exception using errcode = 'P0001', message = 'BOOKING_NOT_AVAILABLE'; end if;
  if p_actor is null or btrim(p_actor) = '' then raise exception using errcode = 'P0001', message = 'ACTOR_REQUIRED'; end if;
  if p_token_hash !~ '^[a-f0-9]{64}$' then raise exception using errcode = 'P0001', message = 'INVALID_TOKEN_HASH'; end if;
  if p_expires_at <= now() then raise exception using errcode = 'P0001', message = 'TOKEN_EXPIRY_INVALID'; end if;

  update lang_applications set booking_token_hash = p_token_hash, booking_token_expires_at = p_expires_at,
    booking_token_used_at = null where id = p_application_id;
  insert into audit_log (actor, action, entity_type, entity_id)
    values (p_actor, 'lang.booking_link_issued', 'lang_application', p_application_id);
end;
$$;

-- Public route chỉ truyền hash; RPC khoá record nên hai lần retry đồng thời
-- không thể cùng ghi audit "đã báo chuyển".
create or replace function report_lang_payment_transfer(
  p_token_hash text,
  p_reference text default null
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare v_request lang_payment_requests%rowtype;
begin
  select * into v_request from lang_payment_requests where token_hash = p_token_hash for update;
  if not found or v_request.revoked_at is not null or v_request.expires_at <= now() then
    raise exception using errcode = 'P0001', message = 'PAYMENT_LINK_INVALID';
  end if;
  if v_request.reported_transfer_at is not null then return true; end if;

  update lang_payment_requests set reported_transfer_at = now(), report_reference = nullif(btrim(p_reference), '')
    where id = v_request.id;
  insert into audit_log (actor, action, entity_type, entity_id)
    values ('customer:private_payment_link', 'lang.payment_reported', 'lang_application', v_request.application_id);
  return false;
end;
$$;

revoke all on function issue_lang_payment_request(uuid, lang_status, text, text, timestamptz) from public, anon, authenticated;
grant execute on function issue_lang_payment_request(uuid, lang_status, text, text, timestamptz) to service_role;
revoke all on function issue_lang_booking_token(uuid, text, text, timestamptz) from public, anon, authenticated;
grant execute on function issue_lang_booking_token(uuid, text, text, timestamptz) to service_role;
revoke all on function report_lang_payment_transfer(text, text) from public, anon, authenticated;
grant execute on function report_lang_payment_transfer(text, text) to service_role;
