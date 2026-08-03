# B0.1 — Follow-up decisions on backend foundation (PR #121)

**Ngày:** 02/08/2026
**Founder:** Kenji Phạm
**Bối cảnh:** trả lời trực tiếp cho work order B0.1, bổ sung cho PR #121 (feat/b0-backend-foundation). Ghi nguyên văn 5 quyết định, không diễn giải thêm.

## 1. Giá Phiên Lặng 90'

10.000.000đ. Đúng với seed hiện tại (`supabase/seed.sql`) và copy đang sống ở `/lang-90` (`Lang90Cinematic.tsx`) và `/lang-90/xac-nhan.tsx`. Không đổi.

Ghi thành hằng số dùng chung: `LANG_SESSION_PRICE_VND` tại `src/lib/domain/states.ts`.

## 2. Xác nhận tiền vào (Cửa 2)

Giai đoạn đầu: **Kenji tự bấm nút** trong `/admin/lang/[id]` ("Đã nhận tiền"). Không webhook ngân hàng ở giai đoạn này.

Kiểm tra lại nút hiện có (B0.1): nút đã đổi đúng trạng thái (`awaiting_payment → paid`) và ghi `audit_log`, nhưng **chưa ghi gì vào bảng `payments`** — tức là chưa để lại bằng chứng kế toán cho lần xác nhận. Đã vá trong cùng PR: hành động `confirm_payment` giờ insert thêm 1 dòng vào `payments` (`amount_vnd = LANG_SESSION_PRICE_VND`, `status = 'confirmed'`, `confirmed_at = now()`).

## 3. Booking token (link chọn lịch qua email)

Hạn dùng: ~~48 giờ~~ → **24 giờ** kể từ lúc phát ra.
**(Cập nhật 03/08/2026 — Đính kèm Master Prompt v1.0 Điểm 3 thay thế quyết định 48h bên dưới. Hằng số `BOOKING_TOKEN_TTL_HOURS` đã sửa thành 24.)**

Quyết định gốc 02/08/2026 (đã bị thay thế): 48 giờ.

Kiểm tra code hiện tại (B0.1): cột `booking_token_expires_at` đã có trong schema (`supabase/migrations/0001_init.sql`), nhưng **chưa có bất kỳ đoạn code nào phát hành booking token** — đúng theo phạm vi B0 đã ghi rõ trong `src/pages/admin/lang/[id].tsx`: "Bước xếp lịch và phát link đặt lịch riêng sẽ làm ở vòng sau." Vì vậy không có "giá trị placeholder sai" để sửa — chưa có giá trị nào cả.

Đã ghi số 48 vào hằng số `BOOKING_TOKEN_TTL_HOURS` tại `src/lib/domain/states.ts`, kèm chú thích rõ là chưa được đọc ở đâu, để khi work order xây bước phát booking token, con số đến từ một nơi đã duyệt thay vì bị đoán lại.

## 4. Rate limit chống spam khi nối form thật (B1)

Dùng bảng Postgres trong Supabase đang có. **Không thêm Upstash hay dịch vụ ngoài nào.**

Chỉ ghi nhận quyết định này ở đây. Không code trong B0 — bộ đếm trong `src/lib/api/guard.ts` hiện tại là bộ nhớ trong tiến trình (in-memory), đủ dùng vì B0 chưa nối form public nào (lưu lượng thật bằng 0). Khi B1 nối form, thay bộ đếm đó bằng một bảng Postgres (ví dụ `rate_limit_buckets` theo IP + cửa sổ thời gian), không dùng dịch vụ bên thứ ba.

## 5. Lưu dữ liệu

- **Hồ sơ Lặng (người lớn):** giữ vô thời hạn, không tự động xoá.
- **Hồ sơ trẻ em (Hạt Mầm):** giữ vô thời hạn, không tự động xoá, **nhưng bắt buộc luôn có khả năng xoá theo yêu cầu của phụ huynh.**

Xem Gap Register trong báo cáo B0.1 (chat) — khả năng xoá theo yêu cầu **chưa tồn tại** trong B0 (không có policy RLS `DELETE` nào, không có nút xoá trong admin). Cố ý không tự thêm trong PR này vì xoá dữ liệu trẻ em cần thiết kế riêng (ai được xoá, xoá thật hay archive, ghi audit gì). Đề xuất đưa vào B1 hoặc một work order riêng.
