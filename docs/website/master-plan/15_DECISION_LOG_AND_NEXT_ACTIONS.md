# 15_DECISION_LOG_AND_NEXT_ACTIONS.md
Mục tiêu: một nơi duy nhất ghi quyết định đã chốt + việc kế tiếp. File sống — cập nhật mỗi khi có quyết định mới.
Người đọc chính: Kenji mỗi tuần; mọi agent trước khi làm task.

## 1. Quyết định đã chốt (tính đến 04/07/2026)

1. Website chính: coachkenjipham.com; repo kenjiphambht-svg/coachkenjipham-web; hosting Vercel; repo private.
2. Bản Sắc Hạt Mầm là mũi nhọn thị trường; 10 khách thật trong 60 ngày là ưu tiên số một (docs/strategy/03).
3. `/kidbook` là legacy route — giữ nguyên, không redirect khi chưa audit payment/product flow.
4. Ấn phẩm giao qua `/an-pham/[random-slug]`, noindex; PDF A5 tạo sẵn lúc sản xuất (không tạo lúc khách bấm).
5. AI Startup xuống footer, thuộc luồng đối tác/thẩm định; không nằm trong menu/lưới sản phẩm cho khách.
6. Không public chi tiết FCP/Casting/Gateway; /ve-essence chỉ nói mức khái quát, làm ở Phase 9.
7. Chưa build backend lớn khi chưa có market proof; MVP = Tally + Airtable + VietQR + đối soát tay.
8. Payment thực tế VN: VietQR/chuyển khoản, không giả định Stripe.
9. Kênh phân phối: Facebook cá nhân là kênh chính 90 ngày; fanpage/Instagram/Threads chỉ hiện diện + đăng lại.
10. Hero homepage không mở đầu bằng AI-native; AI đứng phía sau, Kenji đứng phía trước.
11. Mọi AI làm việc theo luật File 11: branch → PR → QA → Kenji duyệt; phiếu 5 dòng; không tự merge/push.
12. OpenOPC: giữ ở Giai đoạn 0 (mượn tư tưởng role/playbook/backlog), xét cài lại ở Phase 12.

## 2. Việc 7 ngày tới

- [ ] Kenji: bật 2FA GitHub/Vercel/Airtable/email; bật branch protection (Phase 0).
- [ ] Claude Code: audit route theo File 02 (chỉ nhìn, không sửa); dựng AGENTS.md.
- [ ] Codex: homepage v2 theo File 04 + docs/strategy/01 mục 5 (Phase 1).
- [ ] Kenji: chốt giá beta (khuyến nghị phương án B docs/strategy/03) + danh sách 10–15 người quen để mời.
- [ ] Kenji: đặt lịch chụp chân dung (cần trước Phase 2 — việc chỉ anh làm được, đừng để nó chặn cả roadmap).
- [ ] Bắt đầu 3 bài pillar 1–2 trên Facebook cá nhân (docs/strategy/04 tuần 1).

## 3. Việc 30 ngày tới

- [ ] Xong Phase 1–3 (homepage, core pages, landing Hạt Mầm).
- [ ] Phase 4 MVP tiền + intake chạy với đơn dummy.
- [ ] Máy ấn phẩm đạt PASS case dummy; thống nhất format bàn giao file với website (chuẩn bị Phase 5).
- [ ] Beta vòng thân quen bắt đầu (4–6 case).
- [ ] Scorecard điền đủ 4 tuần đầu.

## 4. Việc 60 ngày tới

- [ ] Phase 5–6 xong: khách nhận phòng đọc + chuỗi chăm sóc chạy.
- [ ] Đủ 10 case beta, ≥7 feedback sâu; VoC Bank có dữ liệu thật.
- [ ] Đánh giá beta PASS/FAIL theo docs/strategy/03 mục 8 → quyết giá chính thức.
- [ ] Phase 7 hardening ngay khi có khách thật.

## 5. Việc KHÔNG nên làm lúc này

Cài OpenOPC; build /ve-essence; mở /goc-doc rầm rộ; dashboard admin; n8n; cổng thanh toán tự động; redirect /kidbook; mở rộng Khám Phá/Giao Mùa; vận hành đủ 4 kênh social như kênh thật.

## 6. Câu hỏi còn mở

- Nghĩa vụ hóa đơn/kê khai khi có doanh thu thật — Kenji hỏi kế toán/người có chuyên môn (ngoài phạm vi tư vấn của AI).
- Chính sách hoàn tiền cho sản phẩm cá nhân hóa — Kenji quyết trước Phase 3 (FAQ landing cần nó).
- X ngày cam kết giao ấn phẩm — chốt sau khi đo thời gian sản xuất case dummy.
- /ai-startup sau này gộp vào /ve-essence hay giữ riêng — quyết ở Phase 9.
- Ngày xét nâng phòng đọc từ MVP lên mức "Tốt hơn" — mặc định: khi bán chính thức sau beta.

## 7. Điều cần từng bên làm tiếp

- **Kenji quyết:** giá beta; chính sách hoàn; ngày chụp ảnh; duyệt copy hero.
- **Codex làm:** Phase 1 theo task format File 11.
- **Claude Code kiểm:** audit Phase 0; QA chéo PR homepage; script quét từ cấm vào .claude/rules/.

## Luật của file này
Mọi quyết định mới: thêm dòng mục 1 kèm ngày. Mọi sự cố riêng tư: ghi tại đây kèm cách xử lý. File này đổi trước, spec liên quan đổi sau, code đổi cuối.
