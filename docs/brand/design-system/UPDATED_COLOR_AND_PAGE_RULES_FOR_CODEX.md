# UPDATED_COLOR_AND_PAGE_RULES_FOR_CODEX.md
Đường dẫn repo: docs/brand/design-system/UPDATED_COLOR_AND_PAGE_RULES_FOR_CODEX.md
Đây là bản thi hành. Khi lệch với 03/08 bản cũ, file này thắng (cho tới khi 03/08 được update theo PATCH_NOTES).

## Final palette (chỉ 4 nhóm — cấm hex ngoài danh sách)

### White / Ivory
- `white: #FFFFFF` — nền khối tinh khiết, khoảng thở lớn nhất.
- `ivory: #FAF9F7` — nền trang mặc định.

### Cream
- `cream: #F1EFE8` — **chọn #F1EFE8, không thêm #F4F1E9.** Lý do: #F1EFE8 đã là hex di sản trong toàn bộ asset/ebook kit cũ (warm-light) — giữ nó thì logo, ebook, prototype cũ khớp ngay; thêm một cream mới gần giống chỉ tạo hai "kem" cãi nhau mà mắt thường không phân biệt. Một cream, một nguồn sự thật.

### Black / Charcoal
- `black: #1A1A1A` — **chọn #1A1A1A, không dùng #111111.** Lý do: #1A1A1A là đen di sản (logo bản dark, token cũ đều dựng quanh nó), và nó "mềm" hơn #111111 một chút — khoảng lặng của Essence là nín thở, không phải hố đen; #111111 dễ đẩy cảm giác sang club/tech.

### Gold
- `gold-accent: #E0C068` — vàng để NHÌN: hairline, hover, một CTA.
- `deep-gold: #8A6D1F` — **utility only**: chữ vàng nhỏ cần đọc trên nền sáng (label, giá trị nhấn ≤ vài từ). Cấm dùng làm nền, mood, khối lớn — đứng diện rộng nó đọc thành nâu, vi phạm No-brown.

### Neutral text
- `text-primary: #1A1A1A` (trên nền sáng) / `#FAF9F7` (trong silence section).
- `text-secondary: #5F5E5A` (trên nền sáng, ~7:1) / `#B4B2A9` (trong silence, ~5.9:1).
- `text-muted: #B4B2A9` — CHỈ caption/label ngắn trên nền sáng; cấm đoạn văn; nếu caption dài hơn một dòng → dùng text-secondary. Không để muted thành "chữ chìm phiên bản sáng".

## Forbidden color mood (cấm tuyệt đối)

Brown làm background; sepia overlay; muddy beige; chocolate; amber-heavy sections; dark brown gradients; vintage coffee tone; gold flood (vàng tràn diện). Test nhanh: chụp màn hình, nheo mắt — nếu tổng thể ngả nâu/cafe, FAIL dù từng hex đều hợp lệ (nâu thường sinh ra từ vàng đặt dày trên kem, không phải từ một hex nâu).

## Homepage color map (8 section)

| # | Section | Background | Text | Gold ở đâu | Vai trò sáng/tối | Cấm |
|---|---|---|---|---|---|---|
| 1 | Hero | ivory (hoặc white) | text-primary + text-secondary | một hairline HOẶC không có vàng | Mở bằng ánh sáng, trang giấy đầu | Nền đen; nút vàng ở hero; ảnh overlay ấm |
| 2 | Kenji | white xen ivory | như trên | không | Light editorial, mặt người dưới ánh sáng thật | Ảnh chỉnh tông nâu studio |
| 3 | Hai trạng thái tự nhận | cream | text-primary/secondary | hover link đổi gold-accent | Kem = ấm nhẹ để tự soi | Hai nút vàng (mỗi cửa dùng secondary/text-link) |
| 4 | Essence là gì | ivory | như trên | không | Giữ nhịp sáng trước khoảng lặng | Silence ở đây nếu section 6 đã là silence |
| 5 | Hạt Mầm (cửa chính) | cream publication | text-primary | **NÚT VÀNG DUY NHẤT CỦA TRANG** | Điểm ấm nhất trang — bằng cream + vàng, không bằng tối | Nền vàng; badge vàng thứ hai |
| 6 | Điều Essence không hứa | **black — dark silence** | text-primary-dark #FAF9F7; phụ #B4B2A9 | một hairline vàng mở đầu section (tùy chọn) | Khoảng lặng duy nhất giữa trang — nín thở rồi trả sáng | Kéo silence dài quá một viewport; đặt sát footer đen tạo "đêm kép" |
| 7 | Ghi chép (sắp mở) | ivory | text-secondary | không | Trả lại ánh sáng sau khoảng lặng | Chữ muted cho cả khối |
| 8 | Footer | black | #FAF9F7 / #B4B2A9 | hover link | Kết lặng | Vàng dày; grid link tập đoàn |

Tỉ lệ kiểm: cuộn toàn trang — sáng/kem 65–75%, đen 15–25% (section 6 + footer), vàng 5–10% điểm nhấn. Giữa section 6 và 8 phải có section sáng (7) — đúng nhịp lặng–thở–lặng.

## Visual QA (6 câu, dán vào mọi PR visual)

1. Trang có quá tối không? (đen > 25% chiều dài = FAIL)
2. Nheo mắt: có nhìn ra nâu/cafe không? (có = FAIL)
3. Mọi chữ có đọc rõ không? (bảng contrast kèm; nheo mắt trên điện thoại ngoài sáng)
4. Vàng có quá nhiều không? (đếm: 1 nút vàng + các dấu nhấn lẻ; vàng xuất hiện mọi viewport = FAIL)
5. Section tối có thật là khoảng lặng không? (nó có nội dung xứng đáng trang trọng, hay tối chỉ để "sang"?)
6. Nhìn có giống Essence không — hay giống quán cafe / quầy whiskey / luxury fake? (so với 5 dòng trong FOUNDER_VISUAL_DECISION_SUMMARY)
