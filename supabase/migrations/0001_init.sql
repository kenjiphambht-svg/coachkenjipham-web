-- ============================================================
-- B0 · ESSENCE BACKEND FOUNDATION — migration khởi tạo
-- Ngày: 02/08/2026 · Work order B0 · Founder: Kenji Phạm
--
-- NGUYÊN TẮC BẢO MẬT CỦA FILE NÀY (đọc trước khi sửa bất cứ dòng nào):
--   1. MỌI bảng bật RLS và MẶC ĐỊNH TỪ CHỐI TẤT CẢ. Postgres coi
--      "bật RLS mà không có policy" = không ai đọc/ghi được. Mỗi quyền
--      bên dưới được mở RIÊNG từng cái, kèm lý do.
--   2. Vai trò `anon` (khách chưa đăng nhập) KHÔNG được cấp quyền trên
--      bất kỳ bảng nào trong file này. Form công khai chưa nối vào hệ
--      này (ngoài scope B0) — khi nối sẽ đi qua API server-side dùng
--      service_role, không phải anon đọc thẳng bảng.
--   3. hatmam_child_profiles là bảng nhạy cảm nhất hệ (dữ liệu trẻ em).
--      Nó TÁCH HẲN khỏi hatmam_orders, chỉ nối bằng khoá ngoại, và có
--      policy riêng chặt hơn mọi bảng khác. Không JOIN mặc định ở đâu.
-- ============================================================

-- ---------- Kiểu trạng thái (bộ luật ở tầng CSDL, không chỉ ở TS) ----------

create type lang_status as enum (
  'submitted',
  'under_review',
  'accepted',
  'declined',
  'more_info_needed',
  'awaiting_payment',
  'paid',
  'scheduled',
  'completed',
  'cancelled'
);

create type hatmam_status as enum (
  'submitted',
  'awaiting_payment',
  'paid',
  'in_production',
  'ready',
  'delivered',
  'cancelled'
);

create type payment_status as enum ('pending', 'confirmed', 'failed', 'refunded');

create type subject_type as enum ('lang', 'hatmam');

-- ---------- Hàm dùng chung ----------

-- Tự cập nhật updated_at mỗi lần UPDATE. Gắn trigger cho MỌI bảng bên dưới.
create or replace function set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Người đang đăng nhập có phải admin không.
-- SECURITY DEFINER để hàm tự đọc được admin_users mà không cần policy
-- SELECT mở cho chính người dùng đó (tránh đệ quy policy).
-- search_path cố định = chống tấn công chiếm quyền qua schema giả.
create or replace function is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from admin_users
    where admin_users.user_id = auth.uid()
      and admin_users.is_active = true
  );
$$;

-- Sinh token ngẫu nhiên 32 byte (256 bit) dạng base64url — không đoán được,
-- không tuần tự. Dùng cho booking link và publication link.
create or replace function generate_access_token()
returns text
language sql
volatile
as $$
  select replace(replace(encode(gen_random_bytes(32), 'base64'), '/', '_'), '+', '-');
$$;

-- ============================================================
-- BẢNG
-- ============================================================

-- ---------- 1. admin_users ----------
create table admin_users (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null unique references auth.users(id) on delete cascade,
  email       text not null,
  is_active   boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
comment on table admin_users is 'Ai được vào /admin. Nối 1-1 với auth.users của Supabase Auth.';

-- ---------- 2. contact_messages ----------
create table contact_messages (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  contact     text not null,
  message     text not null,
  is_handled  boolean not null default false,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
comment on table contact_messages is 'Tin nhắn từ form liên hệ. B0 CHƯA nối form public vào đây.';

-- ---------- 3. lang_applications ----------
create table lang_applications (
  id             uuid primary key default gen_random_uuid(),
  order_code     text not null unique,
  status         lang_status not null default 'submitted',

  -- 6 câu hỏi nguyên văn theo bộ lọc Lặng đang chạy ở /lang-90/dat-phien
  q1_situation   text not null,
  q2_level       text not null,
  q3_prior_help  text not null,
  q4_want        text not null,
  q5_openness    text not null,
  q6_extra       text,

  applicant_name    text not null,
  applicant_contact text not null,

  -- Tháng DỰ KIẾN DIỄN RA phiên — Kenji chọn tại bước "Nhận".
  -- Bộ đếm 5 suất khoá theo cột này, không theo tháng nộp hồ sơ.
  -- Luôn lưu ngày 01 của tháng để so sánh cho gọn.
  target_session_month date,

  decided_at     timestamptz,
  decline_reason text,

  -- Booking token: DÙNG MỘT LẦN, có hạn. Chỉ phát sau khi đã 'paid'.
  booking_token            text unique,
  booking_token_expires_at timestamptz,
  booking_token_used_at    timestamptz,

  scheduled_at   timestamptz,

  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now(),

  -- Đã chọn tháng thì phải là ngày mùng 1 — chặn dữ liệu bẩn từ đầu.
  constraint target_month_is_first_of_month
    check (target_session_month is null or extract(day from target_session_month) = 1)
);
comment on column lang_applications.target_session_month is
  'Tháng dự kiến diễn ra phiên, Kenji chọn khi bấm Nhận. Bộ đếm 5 suất khoá theo cột này (FD-2026-08-02).';

create index lang_applications_status_idx on lang_applications (status);
create index lang_applications_target_month_idx on lang_applications (target_session_month);

-- ---------- 4. lang_capacity ----------
create table lang_capacity (
  id          uuid primary key default gen_random_uuid(),
  month       date not null unique,
  max_slots   integer not null default 5 check (max_slots >= 0),
  note        text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  constraint capacity_month_is_first_of_month check (extract(day from month) = 1)
);
comment on table lang_capacity is
  'Giới hạn suất theo tháng. Không có dòng cho tháng nào thì mặc định 5 (L0 C-05). Bảng này chỉ để Kenji ghi đè khi cần.';

-- ---------- 5. hatmam_orders ----------
create table hatmam_orders (
  id             uuid primary key default gen_random_uuid(),
  order_code     text not null unique,
  status         hatmam_status not null default 'submitted',
  package        text not null,
  parent_name    text not null,
  parent_contact text not null,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);
comment on table hatmam_orders is
  'Đơn Hạt Mầm. CỐ Ý không chứa bất kỳ dữ liệu nào của trẻ — xem hatmam_child_profiles.';

create index hatmam_orders_status_idx on hatmam_orders (status);

-- ---------- 6. hatmam_child_profiles — BẢNG NHẠY CẢM NHẤT ----------
create table hatmam_child_profiles (
  id           uuid primary key default gen_random_uuid(),
  order_id     uuid not null unique references hatmam_orders(id) on delete cascade,

  child_name        text,
  birth_date        date,
  birth_time        time,
  birth_time_known  boolean not null default false,
  birth_place       text,
  family_context    text,

  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);
comment on table hatmam_child_profiles is
  'DỮ LIỆU TRẺ EM. Tách hẳn khỏi hatmam_orders theo L0 C-06 + chính sách child data. '
  'KHÔNG được JOIN mặc định trong bất kỳ query danh sách nào. '
  'Chỉ đọc khi có lý do nghiệp vụ rõ ràng và người đọc là admin đang đăng nhập.';

-- ---------- 7. payments ----------
create table payments (
  id            uuid primary key default gen_random_uuid(),
  subject       subject_type not null,
  subject_id    uuid not null,
  amount_vnd    bigint not null check (amount_vnd >= 0),
  status        payment_status not null default 'pending',
  bank_ref      text,
  confirmed_at  timestamptz,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
comment on table payments is
  'Ghi nhận tiền. Cửa 2 (Payment Confirmation) theo FD-2026-08-02 FD-B: đây là sự thật kế toán, ĐƯỢC phép tự động hoá. '
  'Khác hẳn Cửa 1 (Human Decision Gate) — cửa đó tuyệt đối không tự động.';

create index payments_subject_idx on payments (subject, subject_id);

-- ---------- 8. publications ----------
create table publications (
  id             uuid primary key default gen_random_uuid(),
  order_id       uuid not null references hatmam_orders(id) on delete cascade,
  access_token   text not null unique default generate_access_token(),
  token_expires_at timestamptz,
  delivered_at   timestamptz,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);
comment on table publications is
  'Phòng đọc riêng của từng ấn phẩm. access_token 256-bit ngẫu nhiên — URL không đoán được, không dùng id tuần tự.';

-- ---------- 9. consents ----------
create table consents (
  id            uuid primary key default gen_random_uuid(),
  subject       subject_type not null,
  subject_id    uuid not null,
  consent_type  text not null,
  granted       boolean not null,
  granted_at    timestamptz,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
comment on table consents is 'Lưu vết đồng ý của khách. Không suy ra đồng ý từ im lặng.';

create index consents_subject_idx on consents (subject, subject_id);

-- ---------- 10. audit_log ----------
create table audit_log (
  id           uuid primary key default gen_random_uuid(),
  actor        text not null,
  action       text not null,
  entity_type  text not null,
  entity_id    uuid,
  from_state   text,
  to_state     text,
  reason       text,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);
comment on table audit_log is
  'Mọi lần chuyển trạng thái tự ghi vào đây. KHÔNG ghi nội dung form vào bảng này — chỉ id, hành động, thời gian.';

create index audit_log_entity_idx on audit_log (entity_type, entity_id);
create index audit_log_created_idx on audit_log (created_at desc);

-- ---------- Trigger updated_at cho mọi bảng ----------
create trigger set_updated_at before update on admin_users            for each row execute function set_updated_at();
create trigger set_updated_at before update on contact_messages       for each row execute function set_updated_at();
create trigger set_updated_at before update on lang_applications      for each row execute function set_updated_at();
create trigger set_updated_at before update on lang_capacity          for each row execute function set_updated_at();
create trigger set_updated_at before update on hatmam_orders          for each row execute function set_updated_at();
create trigger set_updated_at before update on hatmam_child_profiles  for each row execute function set_updated_at();
create trigger set_updated_at before update on payments               for each row execute function set_updated_at();
create trigger set_updated_at before update on publications           for each row execute function set_updated_at();
create trigger set_updated_at before update on consents               for each row execute function set_updated_at();
create trigger set_updated_at before update on audit_log              for each row execute function set_updated_at();

-- ============================================================
-- RLS — BẬT TRÊN MỌI BẢNG, MẶC ĐỊNH TỪ CHỐI TẤT CẢ
-- ============================================================

alter table admin_users            enable row level security;
alter table contact_messages       enable row level security;
alter table lang_applications      enable row level security;
alter table lang_capacity          enable row level security;
alter table hatmam_orders          enable row level security;
alter table hatmam_child_profiles  enable row level security;
alter table payments               enable row level security;
alter table publications           enable row level security;
alter table consents               enable row level security;
alter table audit_log              enable row level security;

-- FORCE: chủ sở hữu bảng cũng phải tuân RLS. Không có cửa sau nào.
alter table hatmam_child_profiles  force row level security;

-- Thu hồi sạch quyền của anon và authenticated ở tầng GRANT, trước khi
-- mở lại đúng thứ cần qua policy. Hai lớp khoá, không phải một.
revoke all on all tables in schema public from anon, authenticated;

grant select, insert, update on admin_users, contact_messages, lang_applications,
  lang_capacity, hatmam_orders, payments, publications, consents, audit_log
  to authenticated;

-- child_profiles: authenticated chỉ được SELECT/UPDATE, KHÔNG được xoá.
-- Xoá hồ sơ trẻ em phải qua service_role với thao tác có chủ đích.
grant select, insert, update on hatmam_child_profiles to authenticated;

-- anon KHÔNG được gì cả. Cố ý bỏ trống — đây không phải thiếu sót.

-- ---------- Policy: mở từng quyền một, kèm lý do ----------

-- admin_users: admin tự xem được danh sách admin (để biết ai có quyền).
-- Không cho tự INSERT/UPDATE — thêm admin phải qua service_role.
create policy admin_users_select on admin_users
  for select to authenticated using (is_admin());

-- contact_messages: admin đọc + đánh dấu đã xử lý.
create policy contact_messages_select on contact_messages
  for select to authenticated using (is_admin());
create policy contact_messages_update on contact_messages
  for update to authenticated using (is_admin()) with check (is_admin());

-- lang_applications: admin đọc + chuyển trạng thái.
create policy lang_applications_select on lang_applications
  for select to authenticated using (is_admin());
create policy lang_applications_update on lang_applications
  for update to authenticated using (is_admin()) with check (is_admin());

-- lang_capacity: admin đọc; sửa giới hạn tháng cũng cho phép (Kenji tự chỉnh).
create policy lang_capacity_select on lang_capacity
  for select to authenticated using (is_admin());
create policy lang_capacity_update on lang_capacity
  for update to authenticated using (is_admin()) with check (is_admin());
create policy lang_capacity_insert on lang_capacity
  for insert to authenticated with check (is_admin());

-- hatmam_orders: admin đọc + chuyển trạng thái.
create policy hatmam_orders_select on hatmam_orders
  for select to authenticated using (is_admin());
create policy hatmam_orders_update on hatmam_orders
  for update to authenticated using (is_admin()) with check (is_admin());

-- hatmam_child_profiles: CHỈ MỘT policy SELECT, chỉ cho admin đang đăng nhập.
-- Không policy INSERT/DELETE cho authenticated — ghi dữ liệu trẻ em phải đi
-- qua service_role ở API server-side, nơi có kiểm soát và ghi log rõ ràng.
-- Đây là bảng duy nhất bật FORCE RLS.
create policy child_profiles_select_admin_only on hatmam_child_profiles
  for select to authenticated using (is_admin());

-- payments: admin đọc. Ghi nhận tiền vào (Cửa 2) do service_role thực hiện
-- từ webhook ngân hàng — không mở INSERT cho authenticated.
create policy payments_select on payments
  for select to authenticated using (is_admin());

-- publications: admin đọc để biết đã giao chưa.
create policy publications_select on publications
  for select to authenticated using (is_admin());

-- consents: admin đọc. Ghi do service_role lúc khách đồng ý.
create policy consents_select on consents
  for select to authenticated using (is_admin());

-- audit_log: admin đọc. CHỈ ĐỌC — không ai được sửa/xoá lịch sử,
-- kể cả admin. Ghi mới do service_role thực hiện.
create policy audit_log_select on audit_log
  for select to authenticated using (is_admin());

-- ============================================================
-- KẾT: mọi bảng đã bật RLS. Bảng nào không có policy cho một thao tác
-- nào đó thì thao tác đó BỊ TỪ CHỐI với authenticated/anon — đúng ý đồ.
-- ============================================================
