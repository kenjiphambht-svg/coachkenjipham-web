# B2 — Lặng private payment & booking links

**Ngày:** 03/08/2026  
**Trạng thái:** Draft implementation; staging migration verification is blocked by missing Supabase management/database credential.

## Điều đã được thực thi

- Link báo đã chuyển khoản và link đặt lịch được sinh 256-bit ở server.
- Chỉ SHA-256 hash được lưu trong Postgres; raw link chỉ trả về một lần cho admin.
- Phát link thanh toán, khoá suất và audit log là một RPC transaction.
- Link payment có hạn, có thể phát lại (thay hash cũ), không lộ trong danh sách admin.
- Link booking chỉ phát sau trạng thái `paid`; mọi trang riêng đều `noindex, nofollow`.
- Không tích hợp tài khoản ngân hàng, Resend hoặc Cal.com. Giao diện nói đúng: **“Chờ Kenji kết nối”**; không mô phỏng xác nhận tiền/lịch.

## Rollback

Trước khi merge hoặc áp staging, rollback chỉ cần không merge/đóng Draft PR B2.
Sau khi migration `0007` đã áp staging, rollback an toàn là ngừng route B2 và revoke các link đang phát; không xoá migration history hay dữ liệu audit/payment report. Migration down chỉ được viết sau khi môi trường staging có snapshot và test khôi phục (B9).

## Bằng chứng còn thiếu

`0007` chưa được áp Supabase staging vì phiên executor không có `SUPABASE_ACCESS_TOKEN` hoặc database credential. Vì vậy RPC atomicity, RLS policy mới, expiry/revocation và POST payment-report chưa được gọi trên DB thật.
