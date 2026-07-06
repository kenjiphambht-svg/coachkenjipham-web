# 00_READ_ME_FIRST_WEBSITE_MASTER_PLAN.md
Mục tiêu: giải thích bộ tài liệu này dùng để làm gì và đọc theo thứ tự nào.
Người đọc chính: Kenji trước tiên; sau đó mọi AI/người vào làm dự án.

## 1. Website này là gì trong hệ Essence

Website coachkenjipham.com không chỉ là bộ mặt. Nó là **hệ vận hành online** của Essence: nơi người lạ xác tín Kenji là ai, nơi khách bước vào đúng cửa, nơi ấn phẩm được giao riêng tư, nơi dữ liệu phụ huynh được bảo vệ, và là nền để sau này gắn bán hàng, chăm sóc, automation và AI OS.

Ẩn dụ: đây không phải dựng một tấm biển hiệu, mà xây một ngôi nhà có sảnh đón khách (public pages), phòng tư vấn (funnel Hạt Mầm), phòng đọc riêng (private reading room), khu bếp (backend) và sổ sách (CRM/dữ liệu). Bộ 16 file này là bản vẽ của ngôi nhà đó.

## 2. Ai đọc bộ file này

- **Kenji** — đọc để hiểu, để giao việc và để duyệt. Không cần hiểu code.
- **Codex** — đọc để triển khai trên GitHub theo từng task.
- **Claude Code** — đọc để làm việc trong repo local, QA, hỗ trợ triển khai.
- **Designer / developer thật / automation builder / AI agent tương lai** — đọc để vào việc mà không cần ai kể lại lịch sử.

## 3. Thứ tự đọc

- Kenji: 00 → 01 → 15 (quyết định + việc cần làm) → 12 (roadmap) → còn lại đọc khi đụng việc.
- Codex/Claude Code: 00 → 11 (luật làm việc) → file của phase đang làm (theo 12) → 13 (QA) trước khi trình duyệt.
- Người làm backend/automation: 00 → 07 → 08 → 09.

## 4. Cách dùng bộ file để giao việc

Một task giao cho Codex luôn gồm: (a) phase nào trong File 12, (b) file spec liên quan, (c) format task trong File 11, (d) QA theo File 13. Không giao việc bằng mô tả miệng ngoài tài liệu — nếu spec thiếu, cập nhật spec trước, giao việc sau.

## 5. Nguyên tắc bất di bất dịch

1. Không làm tất cả một lần — đi theo phase (File 12).
2. Mỗi PR một phạm vi; không sửa ngoài scope.
3. Không sửa production trực tiếp; mọi thứ qua branch → preview → duyệt.
4. Không merge nếu chưa qua QA (File 13).
5. Kenji là người chốt cuối. AI đề xuất, không quyết.
6. Không đưa dữ liệu khách/trẻ em vào repo, vào ví dụ, vào tài liệu.

## 6. Bản đồ đơn giản

Website strategy (01) → Public pages (02–04) → Product funnel (05) → Delivery riêng tư (06) → Backend (07) → Email/chăm sóc (08) → Security (09) → SEO/AIO/GEO (10) → AI OS & cách làm việc (11) → Roadmap (12) → QA (13) → Từ điển (14) → Nhật ký quyết định (15).

## 7. Vị trí đặt bộ file trong repo

Đặt tại `docs/website/` của repo coachkenjipham-web. Lưu ý tránh nhầm: bộ 6 file market-proof trước đó (01_HOME_PREMIUM_REVIEW.md…) đặt ở `docs/strategy/` — hai bộ có số trùng (01, 02…) nhưng khác thư mục, khác vai trò. Khi giao task phải ghi đường dẫn đầy đủ.

## Checklist
- [ ] Bộ file nằm đúng docs/website/ trong repo.
- [ ] Kenji đã đọc 00, 01, 15.
- [ ] Codex/Claude Code được chỉ định đọc 11 trước khi làm task đầu tiên.

## Definition of Done
Bất kỳ ai (người hoặc AI) mở repo lần đầu, đọc file này xong biết: dự án là gì, đọc gì tiếp, luật là gì, hỏi ai khi kẹt.

## Rủi ro cần tránh
- Bộ tài liệu bị xem là "tham khảo" thay vì luật → mọi prompt giao việc phải trích đường dẫn file.
- Tài liệu và code lệch nhau theo thời gian → mỗi lần đổi quyết định, cập nhật File 15 trước, sửa spec liên quan sau.
