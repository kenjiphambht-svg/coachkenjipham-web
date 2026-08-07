# B0 security hardening — implementation record

**Ngày:** 03/08/2026
**Phạm vi:** technical hardening của `feat/b0-backend-foundation`; không đổi route/CTA/copy công khai, giá, gói, chính sách hay dữ liệu khách.

## Thay đổi đã thực hiện

1. `0003_admin_aal2_and_atomic_lang_transition.sql`
   - MFA/AAL2 là restrictive RLS policy cho toàn bộ bảng nghiệp vụ.
   - `/admin/*` kiểm AAL2 tại middleware, SSR và API. Route `/admin/xac-minh-mfa` cho phép admin tự enrol/verify TOTP trước khi vào dữ liệu quản trị.
   - `transition_lang_application()` chỉ service role gọi được; thao tác khóa hồ sơ, kiểm state machine và quota tháng, ghi audit, và ghi payment trong một transaction.
2. `0004_hash_private_tokens.sql`
   - Đổi token booking/phòng đọc sang hash SHA-256 tại rest. Raw token chỉ được phát ở server trong tương lai, không lưu DB/log/audit.
3. `0005_shared_rate_limit.sql`
   - Thêm bucket rate limit Postgres nguyên tử. Key là fingerprint SHA-256, không lưu raw IP. Public API ở phase nối form phải gọi `checkPostgresRateLimit()` bằng service role; Map in-memory chỉ còn cho unit test khi chưa có public API.

Ghi chú authority: mục 4 của B0.1 từng ghi việc này để B1 vì khi đó chưa có public API. Handoff continuation yêu cầu rate limit Postgres là hard gate của PR #121; thay đổi ở đây chỉ thực thi hard gate kỹ thuật, không tạo quyết định Founder mới.

## Verification status

- **CONFIRMED:** 60 unit tests pass; production build pass sau thay đổi (cảnh báo lint cũ ngoài phạm vi B0 vẫn tồn tại).
- **UNVERIFIED:** migrations 0003–0005 chưa được áp vào `essence-staging` trong phiên này; không có biến Supabase cục bộ để chạy integration/RLS test. 10 test RLS được Vitest báo `SKIPPED`, không tính là pass.
- **EXTERNAL ACTION REQUIRED:** bật/kiểm tra Supabase Auth *Leaked Password Protection* trong dashboard. Đây là setting dashboard, không thể sửa bằng migration/source code.

## Không thay đổi

- Không gửi email, không phát booking/publication token, không mở public API, không chạy migration/seed từ máy local.
- Không merge PR, không deploy/cutover production.
