# 05_IMAGE_PRODUCTION_WORKFLOW.md
Đường dẫn repo: docs/brand/image-system/05_IMAGE_PRODUCTION_WORKFLOW.md

## 1. Quy trình 13 bước (một "image set" = một use case)

1. Chọn use case (trang/section cụ thể — không generate vu vơ).
2. Chọn prompt group (file 03) + LoRA weight khởi điểm.
3. Generate batch 8–20 ảnh (ghi seed).
4. Loại nhanh ảnh fail kỹ thuật (tay, mắt, chữ lỗi) → 04_rejected/.
5. Shortlist 3–5 ảnh → 01_shortlist/.
6. Chạy QA đầy đủ (file 04), điền bảng.
7. Kenji duyệt (chọn 1–2 bản, ghi lý do một dòng).
8. Export bản gốc chất lượng cao → 02_approved/.
9. Convert WebP + resize theo vị trí (hero ≤300KB, thường ≤200KB).
10. Đặt tên đúng quy ước (mục 4) → 03_web_ready/.
11. Cập nhật image inventory (file 07): weight, seed, approved use.
12. CHỈ khi trang cần mới đưa vào repo (qua handoff file 06) — repo không phải kho ảnh.
13. Ảnh cũ bị thay → chuyển archive trong inventory, không xóa lịch sử.

## 2. Folder local

`/Users/macos/Documents/03. RESOURCES/Essence Visual Assets/`
```
00_inbox_generated/   ← batch thô từ Flux (dọn hằng tuần)
01_shortlist/
02_approved/          ← bản gốc đã Kenji duyệt
03_web_ready/         ← WebP đúng tên, sẵn giao Codex
04_rejected/          ← giữ 30 ngày để học lỗi rồi xóa
05_prompt_bank/       ← bản sao file 03 + prompt thử nghiệm
06_reference/         ← ảnh mood tham khảo (không dùng public)
07_project_exports/   ← gói ảnh theo dự án (vd homepage-relight)
```

## 3. Folder repo (chỉ ảnh đang dùng thật)

`public/images/kenji/` · `public/images/brand/` · `public/images/hat-mam/` · `public/images/social/` · `public/images/og/`

## 4. Quy ước đặt tên

`{chủ thể}-{vị trí}-{loại}-v{số}.webp` — ví dụ: kenji-homepage-portrait-v01.webp · kenji-about-editorial-v01.webp · essence-ivory-reading-room-v01.webp · hat-mam-product-mockup-v01.webp. Không dấu tiếng Việt, không khoảng trắng, tăng v khi thay bản.

## 5. KHÔNG commit vào repo

Raw batch/ảnh fail; ảnh rejected; ảnh chưa nén (>500KB); ảnh chứa dữ liệu riêng tư hoặc trang ấn phẩm khách thật; ảnh trẻ em có thể gây hiểu lầm là case; PSD/file nguồn lớn; ảnh chưa có dòng trong inventory.

## 6. Definition of Done cho một image set

Use case có 1–2 ảnh PASS public nằm ở 03_web_ready/ đúng tên + WebP đúng dung lượng + dòng inventory đầy đủ (kèm seed/weight tái lập được) + Kenji đã duyệt có ghi vết. Thiếu một trong bốn = chưa xong.

## 7. Nhịp làm thực tế (khớp lịch tuần của Kenji)

Generate + loại thô: việc máy chạy nền, làm lúc rảnh. Shortlist + QA: gom vào khung duyệt lô (thứ Tư/thứ Bảy) — không duyệt ảnh rải rác cả ngày. Một use case mỗi lần; đừng mở 5 use case song song.

## 8. First Image Set — Kenji Homepage Editorial Portrait

Đây là image set đầu tiên của hệ, chạy trong 48 giờ tới. Vừa tạo ảnh đang chặn Phase re-light homepage, vừa là bài test toàn bộ workflow.

- **Mục tiêu:** chọn được 1 ảnh chân dung Kenji đạt PASS public cho homepage section 2.
- **Prompt group:** G1 (file 03), kèm negative chung bản mới (đã có wood rule + chống cháy sáng).
- **Số lượng generate:** 12–20 ảnh, chia 3 đợt theo LoRA weight: **0.70 / 0.75 / 0.80** (mỗi đợt 4–7 ảnh, ghi seed).
- **Aspect ratio:** 4:5.
- **Tiêu chuẩn chọn 1 ảnh homepage:** giống Kenji thật (người quen nhận ra ngay); mắt nhìn ống kính, có catchlight; da còn texture; khung sáng chủ đạo NHƯNG còn bóng mềm/chiều sâu (không cháy sáng); nền ≥60% sáng, đúng palette ivory/cream/đen; vàng ≤ một chi tiết nhỏ; đạt trọn PASS/FAIL file 02 mục 8 + QA file 04.
- **Tiêu chuẩn reject:** lệch tuổi ±5; da nhựa/mắt chết/cười giả; tay lỗi trong khung; nền hoặc gỗ ngả nâu khi nheo mắt; cháy sáng trắng lâm sàng; vibe guru/CEO stock/AI headshot.
- **Export:** WebP, ≤300KB, crop 4:5 chuẩn homepage.
- **Filename:** `kenji-homepage-portrait-v01.webp` → 03_web_ready/.
- **Alt text:** "Kenji Phạm — Essence Coach, founder Essence Coaching System".
- **Kết sổ:** ghi dòng inventory (IMG-001) kèm weight + seed của bản chọn; các bản gần đạt lưu 01_shortlist/ làm dự phòng OG/social.
