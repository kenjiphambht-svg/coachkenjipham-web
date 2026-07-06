# 13_QA_CHECKLIST_10000_USD_WEBSITE.md
Mục tiêu: checklist QA tổng — cửa kiểm cuối trước mọi lần merge/publish.
Người đọc chính: mọi agent trước khi trình phiếu; Kenji khi duyệt lô.
Cách dùng: mỗi PR chạy nhóm liên quan + nhóm 8, 10 (bắt buộc mọi PR). Kết quả dán vào PR.

## 1. Brand QA
- [ ] Đúng Kenji? (đọc lên nghe như người thật này nói, không như template)
- [ ] Đúng Essence? (giọng Đời — Lặng — Thức; đối chiếu ai-writing-style)
- [ ] AI có đứng phía sau không? (AI không xuất hiện ở màn đầu bán hàng)
- [ ] Có bị spiritual guru không? (không tôn xưng, không huyền bí hóa)
- [ ] Có bị SaaS lạnh không? (không jargon, không "giải pháp tối ưu hóa")

## 2. Copy QA
- [ ] Dễ hiểu với người ngoài hệ? (một người lạ đọc không cần glossary)
- [ ] Quá thuật ngữ không? (từ hệ chỉ dùng sau khi đã dọn ngữ cảnh)
- [ ] Có phán người đọc không? (không câu nào kết luận họ là gì)
- [ ] Có hứa quá không? (không kết quả cam kết, không mốc thời gian thần kỳ)
- [ ] Từ cấm = 0? (chạy script quét danh sách trong .claude/rules/ + soát tay biến thể)

## 3. Child Safety QA (bắt buộc cho mọi nội dung chạm dòng Bản Sắc Của Con)
- [ ] Có dán nhãn trẻ không? ("con là kiểu…", "bé thuộc nhóm…" = fail)
- [ ] Có dự đoán tương lai không? (mọi thì tương lai chắc chắn về trẻ = fail)
- [ ] Có tâm linh hóa trẻ không? (sứ mệnh, gánh gia đình = fail)
- [ ] Có dùng dữ liệu/nỗi lo về con để gây áp lực phụ huynh không? (mọi biến thể "kẻo muộn" = fail)
- [ ] Xưng hô đúng chuẩn? ("Ba mẹ thân mến", không lạm "dạ thưa")

## 4. UX QA
- [ ] Mobile 360px: không tràn, không chồng chữ, nút bấm được bằng ngón cái
- [ ] CTA rõ: mỗi trang một CTA chính, nhìn 3 giây biết bấm gì
- [ ] Mỗi màn hình một ý
- [ ] Người đọc luôn biết bước tiếp theo (không trang cụt)
- [ ] Hạt Mầm có nổi đúng vị thế cửa active chính không

## 5. Visual QA
- [ ] Contrast đo đạt AA (thân bài 4.5:1, heading lớn 3:1) — bằng công cụ
- [ ] Spacing thở được; không section nào chen nhau
- [ ] Font render dấu tiếng Việt chuẩn mọi weight (kiểm "ữ ẫ ợ ề")
- [ ] Ảnh Kenji thật hiển thị đúng, không stock ở bất kỳ đâu
- [ ] Cảm giác premium (đối chiếu 10+1 nguyên tắc File 01 mục 6)
- [ ] Không quá tối: đọc thử ngoài trời trên điện thoại thật

## 6. SEO/AIO/GEO QA
- [ ] Title/description đúng, ≤60/≤160 ký tự, không từ cấm
- [ ] Canonical đúng
- [ ] Schema đúng loại theo File 10, validate pass
- [ ] Internal link về đúng trang nguồn chuẩn
- [ ] noindex: private + payment xác nhận bằng test; sitemap.xml sạch

## 7. Security QA
- [ ] Slug riêng tư đạt chuẩn (ngẫu nhiên, không tên bé)
- [ ] noindex private route (test pass)
- [ ] Secrets: không trong code/diff/log
- [ ] Dữ liệu khách: 0 trong repo (quét cả docs, test fixture, ảnh)
- [ ] Email mẫu không dồn thông tin nhạy cảm

## 8. Build QA (bắt buộc mọi PR)
- [ ] `npm run build` pass
- [ ] Lint pass
- [ ] `git diff --check` sạch
- [ ] Không package mới ngoài duyệt
- [ ] Không route/file thay đổi ngoài scope task

## 9. Business QA
- [ ] Người đọc có biết mua gì, giá bao nhiêu, nhận gì không?
- [ ] Có đường vào beta/đặt Hạt Mầm thông suốt không? (tự bấm thử trọn flow)
- [ ] Có đo được inquiry/purchase không? (event analytics bắn đúng — nạp scorecard)
- [ ] Có follow-up sau mua không? (trigger S4–S6 nối đúng)

## 10. Merge QA (bắt buộc mọi PR)
- [ ] PR scope đúng khai báo?
- [ ] Preview đã xem trên desktop + điện thoại thật?
- [ ] Kenji duyệt chưa? (không có ngoại lệ)
- [ ] Rollback plan: biết cách quay về bản trước trong 5 phút (Vercel giữ deployment cũ — chỉ cần biết bấm restore)

## Definition of Done
PR nào cũng có kết quả checklist dán kèm; hai nhóm 8 và 10 không bao giờ được bỏ; fail một mục ở nhóm 3 (Child Safety) = chặn merge vô điều kiện.

## Rủi ro cần tránh
- QA thành nghi thức tick cho có — phiếu 5 dòng phải trích mục fail/không chắc cụ thể.
- Chỉ QA lúc build lần đầu — mỗi lần sửa copy sau này chạy lại nhóm 1–3.
