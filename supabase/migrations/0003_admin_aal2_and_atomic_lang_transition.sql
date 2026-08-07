-- ============================================================
-- 0003 · B0 hardening: AAL2 + chuyển trạng thái Lặng nguyên tử
--
-- 1. Mọi truy cập bằng JWT authenticated phải đạt AAL2, kể cả khi một
--    route app bị cấu hình sai. Đây là policy restrictive nên nó luôn
--    được AND với policy quyền admin có sẵn ở 0001.
-- 2. Chỉ service_role mới gọi được RPC ghi trạng thái Lặng. RPC khoá hàng,
--    kiểm tra transition/capacity, cập nhật hồ sơ, ghi audit và payment
--    trong CÙNG MỘT giao dịch. Không còn trạng thái đã đổi nhưng mất audit.
-- ============================================================

-- ---------- AAL2 là điều kiện bắt buộc ở tầng dữ liệu ----------

create policy admin_users_require_aal2 on admin_users
  as restrictive for all to authenticated
  using ((select auth.jwt()->>'aal') = 'aal2')
  with check ((select auth.jwt()->>'aal') = 'aal2');

create policy contact_messages_require_aal2 on contact_messages
  as restrictive for all to authenticated
  using ((select auth.jwt()->>'aal') = 'aal2')
  with check ((select auth.jwt()->>'aal') = 'aal2');

create policy lang_applications_require_aal2 on lang_applications
  as restrictive for all to authenticated
  using ((select auth.jwt()->>'aal') = 'aal2')
  with check ((select auth.jwt()->>'aal') = 'aal2');

create policy lang_capacity_require_aal2 on lang_capacity
  as restrictive for all to authenticated
  using ((select auth.jwt()->>'aal') = 'aal2')
  with check ((select auth.jwt()->>'aal') = 'aal2');

create policy hatmam_orders_require_aal2 on hatmam_orders
  as restrictive for all to authenticated
  using ((select auth.jwt()->>'aal') = 'aal2')
  with check ((select auth.jwt()->>'aal') = 'aal2');

create policy child_profiles_require_aal2 on hatmam_child_profiles
  as restrictive for all to authenticated
  using ((select auth.jwt()->>'aal') = 'aal2')
  with check ((select auth.jwt()->>'aal') = 'aal2');

create policy payments_require_aal2 on payments
  as restrictive for all to authenticated
  using ((select auth.jwt()->>'aal') = 'aal2')
  with check ((select auth.jwt()->>'aal') = 'aal2');

create policy publications_require_aal2 on publications
  as restrictive for all to authenticated
  using ((select auth.jwt()->>'aal') = 'aal2')
  with check ((select auth.jwt()->>'aal') = 'aal2');

create policy consents_require_aal2 on consents
  as restrictive for all to authenticated
  using ((select auth.jwt()->>'aal') = 'aal2')
  with check ((select auth.jwt()->>'aal') = 'aal2');

create policy audit_log_require_aal2 on audit_log
  as restrictive for all to authenticated
  using ((select auth.jwt()->>'aal') = 'aal2')
  with check ((select auth.jwt()->>'aal') = 'aal2');

-- ---------- Nguyên tử hoá transition Lặng + audit + payment ----------

-- Admin browser không được UPDATE `lang_applications` trực tiếp. Nếu mở
-- quyền này, bất kỳ admin AAL2 nào cũng có thể gọi PostgREST để nhảy qua
-- state machine và tự viết lịch sử không khớp. API server xác thực admin
-- trước, rồi gọi RPC này bằng service_role trong một transaction duy nhất.
drop policy if exists lang_applications_update on lang_applications;
revoke update on lang_applications from authenticated;

create or replace function transition_lang_application(
  p_application_id uuid,
  p_expected_status lang_status,
  p_next_status lang_status,
  p_actor text,
  p_reason text default null,
  p_target_session_month date default null,
  p_payment_amount_vnd bigint default null
)
returns table (
  from_status lang_status,
  to_status lang_status,
  capacity_month date,
  capacity_used integer,
  capacity_limit integer
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_application lang_applications%rowtype;
  v_target_month date;
  v_capacity_used integer := null;
  v_capacity_limit integer := null;
begin
  select *
    into v_application
    from lang_applications
    where id = p_application_id
    for update;

  if not found then
    raise exception using errcode = 'P0001', message = 'APPLICATION_NOT_FOUND';
  end if;

  if v_application.status <> p_expected_status then
    raise exception using errcode = 'P0001', message = 'CONCURRENT_UPDATE';
  end if;

  if not (
    (v_application.status = 'submitted' and p_next_status in ('under_review', 'cancelled')) or
    (v_application.status = 'under_review' and p_next_status in ('accepted', 'declined', 'more_info_needed', 'cancelled')) or
    (v_application.status = 'more_info_needed' and p_next_status in ('under_review', 'cancelled')) or
    (v_application.status = 'accepted' and p_next_status in ('awaiting_payment', 'cancelled')) or
    (v_application.status = 'awaiting_payment' and p_next_status in ('paid', 'cancelled')) or
    (v_application.status = 'paid' and p_next_status in ('scheduled', 'cancelled')) or
    (v_application.status = 'scheduled' and p_next_status in ('completed', 'cancelled'))
  ) then
    raise exception using errcode = 'P0001', message = 'INVALID_TRANSITION';
  end if;

  if p_actor is null or btrim(p_actor) = '' then
    raise exception using errcode = 'P0001', message = 'ACTOR_REQUIRED';
  end if;

  if p_next_status in ('accepted', 'declined', 'more_info_needed')
    and p_actor not like 'human:%' then
    raise exception using errcode = 'P0001', message = 'HUMAN_DECISION_REQUIRED';
  end if;

  if p_next_status = 'accepted' then
    if p_target_session_month is null
      or extract(day from p_target_session_month) <> 1 then
      raise exception using errcode = 'P0001', message = 'TARGET_MONTH_REQUIRED';
    end if;
    v_target_month := p_target_session_month;
  else
    v_target_month := v_application.target_session_month;
    if p_target_session_month is not null then
      raise exception using errcode = 'P0001', message = 'TARGET_MONTH_NOT_ALLOWED';
    end if;
  end if;

  if p_next_status = 'declined' and coalesce(btrim(p_reason), '') = '' then
    raise exception using errcode = 'P0001', message = 'DECLINE_REASON_REQUIRED';
  end if;

  -- Chỉ phát link thanh toán mới khoá suất. Advisory lock theo tháng
  -- làm hai request đồng thời xếp hàng, nên không thể bán suất thứ sáu.
  if v_application.status = 'accepted' and p_next_status = 'awaiting_payment' then
    if v_target_month is null then
      raise exception using errcode = 'P0001', message = 'TARGET_MONTH_REQUIRED';
    end if;

    perform pg_advisory_xact_lock(hashtext(v_target_month::text));

    select count(*)::integer
      into v_capacity_used
      from lang_applications
      where target_session_month = v_target_month
        and status in ('awaiting_payment', 'paid', 'scheduled', 'completed');

    select max_slots
      into v_capacity_limit
      from lang_capacity
      where month = v_target_month;
    v_capacity_limit := coalesce(v_capacity_limit, 5);

    if v_capacity_used >= v_capacity_limit then
      raise exception using errcode = 'P0001', message = 'CAPACITY_FULL';
    end if;

    -- Giá trị trả về là trạng thái SAU khi vừa khoá thêm một suất.
    v_capacity_used := v_capacity_used + 1;
  end if;

  if p_next_status = 'paid' and (p_payment_amount_vnd is null or p_payment_amount_vnd < 0) then
    raise exception using errcode = 'P0001', message = 'PAYMENT_AMOUNT_REQUIRED';
  end if;
  if p_next_status <> 'paid' and p_payment_amount_vnd is not null then
    raise exception using errcode = 'P0001', message = 'PAYMENT_AMOUNT_NOT_ALLOWED';
  end if;

  update lang_applications
    set status = p_next_status,
        target_session_month = case
          when p_next_status = 'accepted' then v_target_month
          else target_session_month
        end,
        decided_at = case
          when p_next_status in ('accepted', 'declined') then now()
          else decided_at
        end,
        decline_reason = case
          when p_next_status = 'declined' then btrim(p_reason)
          else decline_reason
        end
    where id = p_application_id;

  insert into audit_log (
    actor, action, entity_type, entity_id, from_state, to_state, reason
  ) values (
    p_actor,
    'lang.' || v_application.status::text || '->' || p_next_status::text,
    'lang_application',
    p_application_id,
    v_application.status::text,
    p_next_status::text,
    nullif(btrim(p_reason), '')
  );

  if p_next_status = 'paid' then
    insert into payments (subject, subject_id, amount_vnd, status, confirmed_at)
      values ('lang', p_application_id, p_payment_amount_vnd, 'confirmed', now());
  end if;

  return query
    select
      v_application.status,
      p_next_status,
      v_target_month,
      v_capacity_used,
      v_capacity_limit;
end;
$$;

comment on function transition_lang_application(uuid, lang_status, lang_status, text, text, date, bigint) is
  'Server-only RPC: state machine Lặng + quota + audit + payment trong một transaction. Raw request không được gọi trực tiếp.';

revoke all on function transition_lang_application(uuid, lang_status, lang_status, text, text, date, bigint)
  from public, anon, authenticated;
grant execute on function transition_lang_application(uuid, lang_status, lang_status, text, text, date, bigint)
  to service_role;
