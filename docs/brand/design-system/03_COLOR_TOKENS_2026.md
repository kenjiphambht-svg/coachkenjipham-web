# 03_COLOR_TOKENS_2026.md
Đường dẫn repo: docs/brand/design-system/03_COLOR_TOKENS_2026.md
Phiên bản: v1.1 — 06/07/2026, đã áp Founder Visual Decision (light-led, no brown). Bản thi hành chi tiết cho homepage: UPDATED_COLOR_AND_PAGE_RULES_FOR_CODEX.md.

## 1. Palette gốc (kế thừa, không đổi hex)

#FAF9F7 (ivory) · #FFFFFF (white) · #F1EFE8 (cream) · #1A1A1A (black/than) · #5F5E5A (xám ấm phụ) · #B4B2A9 (muted) · #E8E6DF (viền sáng) · #2C2C2A (viền tối) · #E0C068 (vàng sáng) · #8A6D1F (vàng trầm utility).

Hai hex đã chốt (06/07/2026): cream chính = **#F1EFE8** (hex di sản, khớp toàn bộ asset cũ — không thêm cream thứ hai); đen chính = **#1A1A1A** (đen di sản của logo/token cũ, mềm hơn #111111 — khoảng lặng là nín thở, không phải hố đen).

## 2. Token 2026

| Token | Hex | Ghi chú |
|---|---|---|
| white | #FFFFFF | Khối tinh khiết, dùng xen — không làm nền cả trang (chói trên điện thoại ban đêm) |
| background-light | #FAF9F7 | Nền trang mặc định (ivory) |
| background-warm | #F1EFE8 | Cream — Hạt Mầm mode, section tự soi |
| background-dark | #1A1A1A | CHỈ cho dark silence section + footer |
| text-primary-light | #1A1A1A | Chữ chính trên nền sáng |
| text-primary-dark | #FAF9F7 | Chữ chính trong silence section |
| text-secondary-light | #5F5E5A | Chữ phụ nền sáng (~7:1) |
| text-secondary-dark | #B4B2A9 | Chữ phụ trong silence (~5.9:1) |
| text-muted | #B4B2A9 | CHỈ caption/label ngắn trên nền sáng; caption dài hơn 1 dòng → dùng secondary |
| border-light | #E8E6DF | Hairline nền sáng |
| border-dark | #2C2C2A | Hairline trong silence |
| gold-accent | #E0C068 | Vàng để NHÌN: hairline, hover, MỘT CTA chính |
| gold-text-light (deep gold utility) | #8A6D1F | CHỈ chữ vàng nhỏ cần đọc trên nền sáng (label, vài từ). CẤM làm nền/mood/diện lớn — đứng diện rộng nó đọc thành nâu |

Giữ nguyên logic hai sắc vàng của hệ cũ: vàng sáng chỉ ~1.7:1 trên nền sáng, cấm làm chữ.

## 3. Triết lý màu & các mode (v1.1)

**Ivory/cream là chủ đạo. Đen là khoảng lặng. Vàng là dấu nhấn.** Không còn mode "Dark premium" toàn trang.

| Mode | Nền | Dùng cho |
|---|---|---|
| **Light-led premium** | background-light chủ đạo, white + cream xen kẽ; chèn tối đa MỘT dark silence section giữa trang | Homepage và mọi trang public (/ve-kenji, /phuong-phap, /ve-essence, /goc-doc, /dieu-essence-khong-hua, /chinh-sach-rieng-tu) |
| **Dark silence section** (không phải mode trang — là section có tên) | background-dark | Section trang trọng nhất của trang (vd "Điều Essence không hứa") + footer. Không đặt hai silence liền kề |
| **Hạt Mầm warm publication** | background-warm chủ đạo, khối light xen | /ban-sac-cua-con, landing Hạt Mầm, phòng đọc riêng |
| **Admin neutral** | trắng/ghi thực dụng | Công cụ nội bộ |

**Tỉ lệ toàn trang:** 65–75% light/cream — 15–25% black silence (gồm cả footer) — 5–10% vàng điểm nhấn.

## 4. Forbidden color mood (cấm tuyệt đối)

Brown làm background; sepia overlay; muddy beige; chocolate; amber-heavy sections; dark brown gradients; vintage coffee tone; gold flood. Test nheo mắt: chụp màn hình toàn trang, nheo mắt — tổng thể ngả nâu/cafe là FAIL dù từng hex hợp lệ (nâu thường sinh từ vàng đặt dày trên kem, không phải từ một hex nâu). Các cụm cấm trong mô tả direction: "warm brown", "brown gradient", "sepia", "mocha", "earthy brown", "chocolate", "coffee tone", "amber-heavy" — đưa vào .claude/rules/.

## 5. Contrast rule (đo, không ước lượng)

Body ≥ 4.5:1; heading lớn ≥ 3:1. gold-accent không bao giờ làm body text; chữ vàng trên nền sáng chỉ dùng gold-text-light. text-muted cấm cho đoạn văn; trong silence section không dùng muted và không dùng #5F5E5A (fail contrast trên nền tối).

## 6. Gold usage — "vàng là dấu lặng"

1. Mỗi trang chỉ MỘT phần tử vàng đầy: nút CTA chính.
2. Mỗi viewport tối đa một điểm vàng nhìn thấy.
3. Vàng chỉ dùng cho: hairline, small label, hover, một primary CTA, dấu nhấn nhỏ. Không nền vàng diện lớn; không body text vàng.
4. Mọi chỗ dùng vàng phải nêu được lý do trong PR. Không nêu được = bỏ.

## 7. CSS variables

```css
:root{
  --white:#FFFFFF; --background-light:#FAF9F7; --background-warm:#F1EFE8; --background-dark:#1A1A1A;
  --text-primary-light:#1A1A1A; --text-primary-dark:#FAF9F7;
  --text-secondary-light:#5F5E5A; --text-secondary-dark:#B4B2A9; --text-muted:#B4B2A9;
  --border-light:#E8E6DF; --border-dark:#2C2C2A;
  --gold-accent:#E0C068; --gold-text-light:#8A6D1F;
}
```

## 8. Tailwind token

Như v1.0 (extend theo tên token trên, thêm white). Cấm hex trần trong class sau khi token vào — audit bằng grep.

## 9. QA checklist màu

- [ ] 0 hex trần ngoài file token; 0 hex ngoài danh sách mục 1.
- [ ] Đo contrast từng cặp chữ/nền, dán bảng vào PR.
- [ ] Tỉ lệ sáng/tối/vàng trong khung 65-75/15-25/5-10 (ước theo chiều dài cuộn).
- [ ] Tối đa một dark silence section giữa trang; giữa silence và footer có section sáng.
- [ ] Một nút vàng/trang; test nheo mắt không ngả nâu.
- [ ] Kiểm điện thoại thật: ban ngày ngoài sáng + ban đêm trong phòng tối (ivory không chói, chữ không chìm).
