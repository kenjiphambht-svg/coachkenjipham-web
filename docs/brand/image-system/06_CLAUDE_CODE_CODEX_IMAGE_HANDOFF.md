# 06_CLAUDE_CODE_CODEX_IMAGE_HANDOFF.md
Đường dẫn repo: docs/brand/image-system/06_CLAUDE_CODE_CODEX_IMAGE_HANDOFF.md

## 1. Luật gốc cho mọi agent

- KHÔNG tự generate ảnh nếu Kenji chưa yêu cầu.
- CHỈ dùng ảnh từ 03_web_ready/ (đã Kenji duyệt, có dòng inventory). Ảnh ngoài web-ready = không tồn tại với agent.
- KHÔNG đổi ảnh Kenji đang public nếu chưa hỏi — chân dung là quyết định của Kenji, kể cả khi agent thấy "bản mới đẹp hơn".
- Đưa ảnh vào repo: WebP, đúng folder public/images/*, dung lượng đúng chuẩn (hero ≤300KB, thường ≤200KB), có alt text, kiểm mobile, không làm chữ khó đọc.

## 2. Task format (thay/thêm ảnh)

```
BRANCH: feature/<tên>
SOURCE IMAGE PATH: 03_web_ready/<filename>.webp (kèm dòng inventory)
TARGET ROUTE: <route>  ·  TARGET SECTION: <section theo 08_PAGE_APPLICATION>
CROP/RATIO: <theo style guide file 02 mục 7>
ALT TEXT: <tiếng Việt, mô tả thật; chân dung ghi "Kenji Phạm — Essence Coach...">
FILES ALLOWED: public/images/<folder>/, component của section đó
FILES FORBIDDEN: mọi route khác, token, ảnh khác đang dùng
QA: file 04 nhóm 3+6 (đặt trong trang) + docs/website/13 nhóm Build/Merge
REPORT: theo mục 5
```

## 3. Prompt mẫu — Codex thay ảnh homepage

"Đọc docs/brand/image-system/06 và docs/brand/design-system/08 mục 1. Branch feature/homepage-kenji-portrait. Việc: đặt kenji-homepage-portrait-v01.webp vào section 2 homepage, crop 4:5, lazy-load tắt cho ảnh này (above fold thứ hai), alt text 'Kenji Phạm — Essence Coach, founder Essence Coaching System'. Files allowed: public/images/kenji/ + component section 2. Kiểm: mobile 360px mặt không bị cắt, chữ cạnh ảnh đạt contrast, trang không chậm đi (ảnh ≤300KB). Không đụng ảnh/route khác. Phiếu 5 dòng, không merge."

## 4. Prompt mẫu — Claude Code audit ảnh

"Đọc docs/brand/image-system/04 và 06. Task audit (không sửa): liệt kê mọi ảnh trong public/images/** — filename, dung lượng, định dạng, alt text hiện có, trang đang dùng; đối chiếu inventory; đánh dấu: ảnh >300KB, không WebP, thiếu alt, không có trong inventory, hoặc nghi chứa dữ liệu khách/trẻ em rõ mặt. Xuất bảng + đề xuất xử lý. Phiếu 5 dòng."

## 5. Checklist trước PR + report cuối

Trước PR: [ ] ảnh từ web-ready + inventory khớp · [ ] WebP đúng dung lượng · [ ] alt text đúng · [ ] mobile kiểm · [ ] contrast chữ cạnh/đè ảnh kiểm · [ ] không ảnh nào khác bị đổi.
Report cuối bắt buộc ghi: ảnh nào thêm/thay — dùng ở đâu (route+section) — dung lượng — alt text — kết quả QA (nhóm nào pass) — **Kenji đã duyệt ảnh này chưa (dẫn dòng inventory)**.
