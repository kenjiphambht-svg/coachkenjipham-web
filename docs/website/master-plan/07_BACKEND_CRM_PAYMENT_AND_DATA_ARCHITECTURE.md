# 07_BACKEND_CRM_PAYMENT_AND_DATA_ARCHITECTURE.md
Mục tiêu: vẽ backend/dữ liệu/CRM/payment đủ rõ để triển khai theo 3 mức, không xây thừa.
Người đọc chính: Claude Code/Codex, automation builder; Kenji đọc mục 1–3 để hiểu và quyết.

## 1. Giải thích cho Kenji

Backend là khu bếp và sổ sách phía sau nhà hàng: khách không thấy, nhưng món ra đúng bàn nhờ nó. Nguyên tắc của hệ Essence: **bắt đầu bằng sổ tay giấy tốt (Airtable + form), chỉ mua bếp công nghiệp khi khách xếp hàng** — nhưng sổ tay phải ghi theo đúng cột mà bếp công nghiệp sau này dùng, để lúc nâng cấp chỉ chuyển sổ, không ghi lại từ đầu. Toàn bộ data model mục 5 chính là "đúng cột" đó.

## 2. Chín module

1. Lead capture (bắt liên hệ quan tâm) — 2. Intake form — 3. Payment — 4. Order management — 5. CRM/tag — 6. Publication generation (máy ấn phẩm, sống ngoài website) — 7. Delivery (File 06) — 8. Feedback — 9. Support/contact.

## 3. Ba mức stack (phân tích, chưa chốt công cụ cuối)

| Module | MVP ít code (dùng cho beta) | Semi-automated | Production-grade |
|---|---|---|---|
| Form (lead+intake) | Tally (miễn phí, đẹp, tiếng Việt tốt) hoặc Google Forms (miễn phí, xấu hơn) | Tally + webhook | Form tự build trên site, ghi thẳng DB |
| Kho dữ liệu | Airtable (Kenji đã có connector; dễ nhìn như bảng tính, có view theo trạng thái) — thay thế: Google Sheets (miễn phí hẳn nhưng dễ loạn) | Airtable + n8n automation | Supabase (Postgres thật, phân quyền, backup) |
| Payment | VietQR tĩnh theo mã đơn + đối soát tay (xem File 05 mục 6; Stripe chưa chính thức hỗ trợ VN — điểm tài liệu gốc cần chỉnh) | Dịch vụ đối soát chuyển khoản tự động (webhook báo tiền vào) | Cổng nội địa đầy đủ (thẻ/ví) |
| Email | Brevo hoặc Mailerlite gói miễn phí (Resend thiên developer; ConvertKit đắt sớm) | Cùng công cụ + automation theo trigger | Cùng công cụ, tách transactional/nurture |
| Automation | Không có — người làm tay theo checklist | n8n self-host (miễn phí, đúng M7) | n8n + hàng đợi + retry |
| Hosting web | Vercel (đã dùng) | Vercel | Vercel/Cloudflare + edge protection |
| Code | GitHub private repo (đã có) | như cũ | như cũ |

Luật chọn mức: beta 10 khách chạy trọn ở cột MVP. Chỉ nâng một module lên Semi khi scorecard (docs/strategy/05) chỉ đúng module đó là chỗ tốn giờ Kenji lặp lại.

## 4. Điểm bổ sung tài liệu gốc chưa nhắc — email gửi từ domain riêng

Trước khi gửi bất kỳ email nào từ @coachkenjipham.com, phải khai báo SPF/DKIM/DMARC trên DNS (bản ghi xác nhận "email này đúng là từ Kenji, không phải kẻ giả mạo"). Thiếu nó, email giao ấn phẩm rơi vào spam — cả funnel gãy ở mét cuối. Đây là task một lần, làm ở Phase 6, công cụ email nào cũng có hướng dẫn sẵn.

## 5. Data model (10 bảng — "đúng cột" dùng cho mọi mức)

| Model | Field chính | Nhạy cảm | Nơi lưu (MVP) | Ai truy cập | Retention |
|---|---|---|---|---|---|
| Lead | email/kênh nhắn, nguồn, ngày, trạng thái | Nhẹ | Airtable | Kenji | Xóa nếu 12 tháng không tương tác |
| Parent | tên xưng hô, email, kênh nhắn, tag | CÓ | Airtable | Kenji | Theo yêu cầu xóa |
| ChildProfile | child_alias, tháng/năm sinh (đủ dùng), ghi chú nhịp | RẤT CAO | Kho intake riêng (không repo, không trộn CRM) | Kenji + máy ấn phẩm | Xóa sau khi giao + X ngày, trừ khi khách muốn giữ |
| Order | order_id, gói, giá, trạng thái tiền, ngày | CÓ | Airtable | Kenji | Giữ theo nghĩa vụ kế toán |
| Intake | link tới ChildProfile + câu hỏi của ba mẹ | RẤT CAO | Kho intake riêng | Kenji + máy | Như ChildProfile |
| Publication | theo File 06 mục 6 | CÓ | Airtable (metadata); file thật ở kho riêng | Kenji | Archive sau follow-up |
| EmailEvent | loại email, ngày gửi, trạng thái | Không | Công cụ email | Kenji | Mặc định công cụ |
| Feedback | nội dung, permission_level | CÓ | Airtable (VoC Bank — docs/strategy/06) | Kenji | Theo consent |
| Consent | ai, đồng ý gì, mức nào, ngày, hình thức | CÓ | Airtable, gắn từng Parent | Kenji | Vĩnh viễn (là bằng chứng) |
| AdminNote | ghi chú vận hành từng case | Nhẹ | Airtable | Kenji | Tự do |

Nguyên tắc xuyên suốt: dữ liệu trẻ em (ChildProfile, Intake) sống tách khỏi CRM thường; mọi bảng có cột consent/permission khi dữ liệu có thể được dùng lại; không bảng nào sống trong repo GitHub.

## 6. Cái gì KHÔNG build ngay

- CRM chuyên dụng trả phí; dashboard admin tự code (Airtable view là dashboard rồi); n8n (chờ scorecard chỉ điểm); cổng thanh toán đầy đủ; hệ đăng nhập khách hàng; chatbot chăm sóc tự động. Tất cả có chỗ ở Phase 6–12, không ở quý này.

## Checklist
- [ ] Airtable base dựng đúng 10 bảng, đúng cột nhạy cảm.
- [ ] Form Tally nối về Airtable (thủ công hoặc tích hợp sẵn) chạy thử với case dummy.
- [ ] Kho intake tách riêng, không nằm trong repo nào.
- [ ] Flow tiền MVP: mã đơn → QR → xác nhận tay → cập nhật Order chạy thử trọn.
- [ ] SPF/DKIM checklist ghi vào backlog Phase 6.

## Definition of Done
Một đơn dummy đi trọn 9 module ở mức MVP, mọi dữ liệu nằm đúng bảng đúng kho, không dữ liệu nhạy cảm nào chạm repo.

## Rủi ro cần tránh
- "Tiện tay" gộp ChildProfile vào CRM chung — vi phạm nguyên tắc tách dữ liệu trẻ em.
- Nâng cấp stack vì thích công nghệ, không vì scorecard — mọi nâng cấp phải trích số liệu.
- Quên nghĩa vụ giấy tờ khi có doanh thu thật (hóa đơn, kê khai) — em không tư vấn pháp lý được; ghi thành câu hỏi mở ở File 15 để anh hỏi kế toán.

## Prompt mẫu (cho Claude Code / Cowork, không phải Codex vì không đụng repo)
"Đọc docs/website/07 mục 5. Dựng Airtable base 'Essence Ops' với 10 bảng đúng field, tạo view theo trạng thái cho Order và Publication. Chạy một case dummy xuyên suốt và báo cáo chỗ vướng."
