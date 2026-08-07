-- ============================================================
-- ROLLBACK cho 0001_init.sql
-- Chạy file này để gỡ sạch toàn bộ hệ B0 khỏi cơ sở dữ liệu.
-- CẢNH BÁO: xoá hết dữ liệu trong 10 bảng. Chỉ dùng trên môi trường thử.
-- ============================================================

drop table if exists audit_log             cascade;
drop table if exists consents              cascade;
drop table if exists publications          cascade;
drop table if exists payments              cascade;
drop table if exists hatmam_child_profiles cascade;
drop table if exists hatmam_orders         cascade;
drop table if exists lang_capacity         cascade;
drop table if exists lang_applications     cascade;
drop table if exists contact_messages      cascade;
drop table if exists admin_users           cascade;

drop function if exists generate_access_token() cascade;
drop function if exists is_admin()              cascade;
drop function if exists set_updated_at()        cascade;

drop type if exists payment_status cascade;
drop type if exists subject_type   cascade;
drop type if exists hatmam_status  cascade;
drop type if exists lang_status    cascade;
