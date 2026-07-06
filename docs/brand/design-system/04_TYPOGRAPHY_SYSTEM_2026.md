# 04_TYPOGRAPHY_SYSTEM_2026.md
Đường dẫn repo: docs/brand/design-system/04_TYPOGRAPHY_SYSTEM_2026.md

## 1. Hiện trạng

- Hệ cũ (zip): **Cormorant Garamond** (display) + **DM Sans** (body), weight 300/400/500, cấm bold 600+.
- Sản phẩm hiện tại: một số nơi có thể đang dùng **Inter** (cần Claude Code xác nhận trong token audit — file 10 phase 3).

## 2. Đề xuất chuẩn cuối

- **Display serif: Cormorant Garamond** — giữ, không bàn lại. Là chữ ký thị giác của Essence.
- **Body sans: DM Sans vs Inter** — phân tích:

| | DM Sans | Inter |
|---|---|---|
| Ưu | Ấm, tròn nhẹ, hợp giọng Đời; là di sản hệ cũ, đồng bộ toàn bộ asset/prototype cũ | Trung tính, cực bền cho UI/số liệu/form; hỗ trợ tiếng Việt rất chắc mọi weight; phổ biến nên render ổn định |
| Nhược | Ở size nhỏ + tiếng Việt dày dấu, kém "gọn" hơn Inter một chút; ít weight trung gian | Lạnh hơn, dễ trôi về "SaaS mặc định" — đúng thứ Essence tránh ở trang public |

- **Khuyến nghị (chờ Kenji chốt — file 11):** hai mode có chủ đích:
  - Website public + ấn phẩm Hạt Mầm: **Cormorant Garamond + DM Sans** (giữ hơi ấm thương hiệu; ấn phẩm cần chất "giấy" hơn chất "app").
  - Admin/backend + tài liệu nội bộ: **Inter** (thực dụng, không cần chất brand).
  - Lý do không dồn một font: public cần ấm, backend cần bền — ép một font làm cả hai sẽ hy sinh một đầu. Nếu Kenji muốn tối giản vận hành, phương án dự phòng là Inter toàn hệ, chấp nhận public lạnh hơn một bậc.

## 3. Type scale (đơn vị px ở desktop; mobile xem mục 7)

| Cấp | Font | Size/LH | Dùng |
|---|---|---|---|
| label | DM Sans 400 | 12/16, letter-spacing +0.08em, uppercase NGẮN | nhãn nhỏ, kicker |
| caption | DM Sans 300–400 | 13/20 | chú thích, metadata |
| body small | DM Sans 400 | 15/24 | ghi chú phụ, form hint |
| body | DM Sans 400 | 17/28 | văn bản chính |
| body large | DM Sans 300 | 20/32 | sapo, đoạn dẫn |
| subhead | Cormorant 400 | 24/32 | tiêu đề phụ |
| headline | Cormorant 400 | 34/42 | tiêu đề section |
| display | Cormorant 300–400 | 52–64/1.1 | hero |
| numeral | Cormorant 300 | 48+/1 | số trang trí (01, 02…) |
| price | Cormorant 400 | 28/36 | giá — serif để giá đọc như lời mời, không như bảng kê |

## 4. Quy tắc chữ

- Line-height: body ≥ 1.6; display 1.05–1.15; không line-height chật cho tiếng Việt (dấu chồng dòng trên).
- Letter-spacing: 0 cho body; +0.02–0.05em cho Cormorant size lớn nếu cần; **không tracking rộng cho chuỗi tiếng Việt dài** (dấu bị tách rời chữ, khó đọc).
- Weight: 300/400/500; **không bold 600+** (giữ luật cũ); nhấn mạnh bằng size/khoảng cách/serif, không bằng đậm.
- Italic: chỉ Cormorant italic cho trích dẫn/mantra; không italic đoạn dài; DM Sans không dùng italic.
- Không ALL-CAPS cho câu dài; uppercase chỉ ở label ≤ 3 từ.

## 5. Vietnamese readability rules

- Kiểm bộ ký tự dấu ("ữ ẫ ợ ề ẳ") ở MỌI weight/size dùng thật, cả hai font, cả PDF ấn phẩm.
- Heading Cormorant 300 ở size < 28px với tiếng Việt: nếu dấu mảnh khó đọc → nâng lên 400. Luật: thà nặng hơn một weight còn hơn mất dấu.
- Không tự động viết hoa đầu từ (title-case) cho tiếng Việt — dùng sentence case.

## 6. Mobile type rules

Display 34–40px; headline 26–28px; body giữ 17px (không bóp nhỏ hơn 16px); LH body mobile 1.65; độ dài dòng mục tiêu 60–75 ký tự (desktop) / tự nhiên theo màn (mobile).

## 7. QA checklist typography

- [ ] Đúng 2 họ font theo mode; 0 font khác lọt vào (grep font-family).
- [ ] 0 weight ≥ 600 trong code.
- [ ] Chuỗi kiểm dấu tiếng Việt render đúng ở label/caption/body/headline/display (screenshot dán PR).
- [ ] Không tracking dương trên đoạn tiếng Việt dài.
- [ ] Body mobile ≥ 16px, LH ≥ 1.6.
