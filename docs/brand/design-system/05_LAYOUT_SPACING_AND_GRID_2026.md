# 05_LAYOUT_SPACING_AND_GRID_2026.md
Đường dẫn repo: docs/brand/design-system/05_LAYOUT_SPACING_AND_GRID_2026.md

## 1. Base unit

4px. Mọi spacing là bội của 4 (4/8/12/16/24/32/48/64/96/128). Ẩn dụ: gạch lát một cỡ — nhà thẳng hàng mà không cần đo lại từng viên.

## 2. Section padding

| Breakpoint | Dọc | Ngang |
|---|---|---|
| Desktop ≥1024 | 96–128px | 48px |
| Tablet | 64–96px | 32px |
| Mobile | 48–64px | 20–24px |

Section hero và dark silence section được phép dọc lớn hơn (tới 160px desktop) — khoảng lặng phải thở. Không đặt hai dark silence section liền kề (lặng liền lặng thành đêm); giữa silence và footer đen phải có section sáng.

## 3. Max-width

- Reading width (đoạn văn): 65–72ch (~680–720px) — /goc-doc, chính sách, phòng đọc.
- Homepage content width: 1120px.
- Landing width: 1040px (hẹp hơn homepage một bậc để giữ nhịp đọc).
- Full-bleed image: chỉ hero hoặc dải chuyển mode; ảnh trong bài không full-bleed.

## 4. Grid

- **1-column narrative corridor**: homepage, landing — mặc định của Essence.
- **2-column editorial**: /ve-kenji, /phuong-phap (chữ + ảnh/kê lề).
- **3-card grid**: chỉ khi thật sự có 3 mục ngang vai (3 độ tuổi Bản Sắc Của Con); không dựng grid 3 cột để lấp chỗ.
- Mobile: tất cả collapse về 1 cột, thứ tự đọc giữ nguyên logic.

## 5. Nguyên tắc spacing

Khoảng trống là vật liệu chính; mỗi màn hình một ý; không ép nhiều block vào một viewport. Quy tắc tay: nếu phải giảm padding để nhét thêm nội dung → bỏ nội dung, giữ padding.

## 6. Border

- Hairline 0.5px cho mọi viền cấu trúc (card, divider) — border-light trên nền sáng, border-dark trên nền tối.
- 1px CHỈ cho kẻ vàng (gold-accent divider, hover underline) — kế thừa luật cũ.
- Không viền 2px+, không viền đôi.

## 7. Radius (cập nhật luật 0px của hệ cũ)

| Vùng | Radius | Lý do |
|---|---|---|
| Public premium pages (homepage, /ve-kenji, /ve-essence, /phuong-phap, /dieu-essence-khong-hua) | **0px** — giữ luật cũ | Chất editorial sắc, sang |
| Hạt Mầm mode (/ban-sac-cua-con, landing, phòng đọc) | 0px mặc định; cho phép 2–4px trên card/khung minh họa/input nếu cần mềm — RẤT tiết chế, một giá trị duy nhất toàn mode | Ấm hơn cho tệp phụ huynh mà không trẻ con hóa |
| Admin/backend | 6–8px thoải mái | Công cụ, ưu tiên thực dụng |

## 8. Shadow

Không box-shadow ở public (giữ luật cũ). Cần phân tầng (elevation) → dùng tương phản nền (light/warm), hairline, và khoảng cách. Admin được dùng shadow nhẹ mặc định của công cụ. "Shadow rẻ" (đổ bóng mờ to màu đen 20%) cấm mọi nơi.

## 9. Motion

Chỉ ở mức hơi thở: fade/translate ≤ 300ms, easing dịu, mỗi section một lần khi vào viewport; tôn trọng prefers-reduced-motion; không parallax mạnh, không auto-carousel, không hiệu ứng lặp vô hạn.

## 10. QA layout checklist

- [ ] Mọi spacing là bội của 4 (soát diff).
- [ ] Không viewport nào chứa quá một ý chính.
- [ ] Đúng bảng radius theo mode; 0 giá trị radius lạ.
- [ ] 0 box-shadow ở public.
- [ ] Reading width ≤ 72ch ở mọi trang đọc.
- [ ] Mobile 360px: 1 cột, không tràn ngang, thứ tự đọc đúng.
