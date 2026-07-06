# 07_IMAGE_INVENTORY_TEMPLATE.md
Đường dẫn repo: docs/brand/image-system/07_IMAGE_INVENTORY_TEMPLATE.md

## 1. Vai trò

Inventory là sổ hộ khẩu của kho ảnh: ảnh nào tồn tại, ai duyệt, dùng được ở đâu, cấm ở đâu, tái lập bằng seed/weight nào. Không có nó, sau 3 tháng không ai nhớ ảnh nào được phép làm gì.

**Nơi ở thật của inventory: Google Sheet hoặc Airtable** (bảng "ImageAssets" trong base Essence Ops — khớp File 07 website plan). Repo CHỈ giữ template này hoặc bản public-safe (không ghi chú nội bộ nhạy cảm). Cập nhật inventory là bước 11 bắt buộc của workflow (file 05).

## 2. Cấu trúc bảng

| Cột | Ghi chú |
|---|---|
| Asset ID | IMG-001, IMG-002… |
| Filename | đúng quy ước file 05 mục 4 |
| Source | AI-assisted Kenji / generated atmosphere / product mockup / real photo |
| Prompt group | G1–G10 (file 03) hoặc "real" |
| LoRA weight + seed | để tái lập; real photo ghi "—" |
| Date generated | |
| Approved by Kenji | ngày + một dòng lý do chọn |
| Approved use | trang/section/kênh được phép |
| Forbidden use | ghi rõ (vd "không dùng cho ads", "không dùng ngoài phòng đọc") |
| Page placement | nơi ĐANG dùng thật (route+section); trống = chưa dùng |
| Alt text | bản chuẩn dùng khi nhúng |
| File size | sau nén WebP |
| Status | inbox / shortlist / approved / web-ready / rejected / archived |
| Notes | lỗi đã regenerate, phiên bản thay thế… |

## 3. Template dòng (Markdown, khi chưa dựng Sheet)

```markdown
| ID | Filename | Source | Group | LoRA/seed | Ngày | Kenji duyệt | Approved use | Forbidden use | Đang dùng | Alt | KB | Status | Notes |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| IMG-001 | kenji-homepage-portrait-v01.webp | AI-assisted Kenji | G1 | 0.75 / 12345 | 06/07 | 06/07 — "mắt thật, nền thở" | homepage s2, OG | ads, landing Hạt Mầm | / s2 | Kenji Phạm — Essence Coach | 240 | web-ready | |
```

## 4. Luật vận hành inventory

- Ảnh không có dòng inventory = không được vào repo (agent từ chối task).
- Đổi Approved use / Forbidden use = quyết định của Kenji, ghi ngày.
- Mỗi quý rà một lần: ảnh archived quá hạn xóa khỏi kho local (trừ bản đang dùng), giữ dòng sổ.
- Ảnh real photo khi có: thêm vào cùng inventory — một sổ cho cả ảnh AI lẫn ảnh thật, để việc "ảnh thật thay dần vị trí niềm tin" (file 00) theo dõi được.
