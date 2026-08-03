-- ============================================================
-- 0002 · SECURITY HARDENING — vá 3 cảnh báo từ Supabase security advisor
-- Ngày: 03/08/2026 · Master build Phase 1 · Nhóm A (kỹ thuật, tự quyết)
--
-- Nguồn: get_advisors(security) chạy trực tiếp trên essence-staging
-- 03/08/2026. Ba cảnh báo có thể vá bằng SQL được vá ở đây; cảnh báo
-- thứ tư (Leaked Password Protection đang tắt) là cài đặt Auth trên
-- dashboard, không vá được bằng SQL — nằm trong Founder Connection
-- Checklist.
-- ============================================================

-- 1+2. Ghim search_path cho hai hàm còn mutable search_path.
--      (is_admin() đã ghim sẵn từ 0001.) Hàm không ghim có thể bị đổi
--      hành vi nếu kẻ tấn công kiểm soát được search_path của phiên.
alter function set_updated_at()        set search_path = public;
alter function generate_access_token() set search_path = public;

-- 3. is_admin() là SECURITY DEFINER và đang được lộ qua PostgREST RPC
--    (/rest/v1/rpc/is_admin) cho cả anon. Với anon, hàm chỉ trả về
--    false (auth.uid() là null) — không lộ dữ liệu — nhưng không có lý
--    do gì để anon gọi được nó. Thu hồi.
--
--    GIỮ EXECUTE cho authenticated: mọi policy RLS của hệ đánh giá
--    is_admin() bằng quyền của role đang gọi — thu hồi của authenticated
--    sẽ làm TOÀN BỘ policy admin chết. Không đụng.
revoke execute on function is_admin() from anon;
revoke execute on function is_admin() from public;
grant  execute on function is_admin() to authenticated;
