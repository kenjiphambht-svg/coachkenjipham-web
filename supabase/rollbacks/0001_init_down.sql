-- ============================================================
-- MANUAL ROLLBACK cho 0001_init.sql
--
-- `supabase/migrations/` CHỈ chứa forward migrations. Thư mục này chứa
-- rollback scripts thủ công và Supabase CLI KHÔNG tự chạy chúng.
--
-- CẢNH BÁO: xoá hết dữ liệu trong 10 bảng. Chỉ dùng trên môi trường thử,
-- sau snapshot đã được xác minh và với uỷ quyền phá huỷ riêng.
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
