-- ============================================================
-- 0004 · Không lưu raw token riêng tư trong CSDL.
--
-- Booking token và token phòng đọc là bí mật một lần: chỉ SHA-256 hash
-- được lưu. Token thô được tạo ở server và chỉ trả về đúng luồng phát
-- link; tuyệt đối không ghi audit/log/database.
-- ============================================================

alter table lang_applications rename column booking_token to booking_token_hash;
alter table publications rename column access_token to access_token_hash;

-- B0 chưa phát link thật nên hai bảng staging hiện không có token sống.
-- Vẫn chuyển hash an toàn nếu migration gặp một token cũ từ môi trường dev.
update lang_applications
  set booking_token_hash = encode(digest(booking_token_hash, 'sha256'), 'hex')
  where booking_token_hash is not null;

update publications
  set access_token_hash = encode(digest(access_token_hash, 'sha256'), 'hex')
  where access_token_hash is not null;

alter table publications alter column access_token_hash drop default;

alter table lang_applications
  add constraint booking_token_hash_is_sha256
  check (booking_token_hash is null or booking_token_hash ~ '^[a-f0-9]{64}$');

alter table publications
  add constraint publication_token_hash_is_sha256
  check (access_token_hash ~ '^[a-f0-9]{64}$');

comment on column lang_applications.booking_token_hash is
  'SHA-256 của booking token 256-bit. Raw token không được lưu trong database.';

comment on column publications.access_token_hash is
  'SHA-256 của publication token 256-bit. Raw token không được lưu trong database.';

-- Hàm cũ chỉ trả token thô, không còn DEFAULT hay caller hợp lệ. Đóng RPC
-- để anon/authenticated không có lý do gọi trực tiếp.
revoke execute on function generate_access_token() from public, anon, authenticated;
