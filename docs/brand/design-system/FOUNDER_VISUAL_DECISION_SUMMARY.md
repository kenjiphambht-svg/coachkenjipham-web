# FOUNDER_VISUAL_DECISION_SUMMARY.md
Đường dẫn repo: docs/brand/design-system/FOUNDER_VISUAL_DECISION_SUMMARY.md
Ngày: 06/07/2026 — Quyết định của Kenji Phạm. File này thắng mọi file design system khác khi mâu thuẫn.

## 1. Điều đang đúng trong design system hiện tại

Palette gốc (ivory–đen–vàng, hai sắc vàng), font Cormorant + DM Sans, kỷ luật 0px/no-shadow, luật contrast đo được, "vàng là dấu lặng", asset pack, và toàn bộ quy trình làm việc (token → component → trang → QA). Tất cả giữ nguyên.

## 2. Điều cần chỉnh

Một quyết định duy nhất nhưng ảnh hưởng lớn: **hướng sáng–tối của website**. Bản trước đặt homepage ở "Dark premium mode" (kế thừa hiện trạng trang đang chạy). Quyết định mới đảo lại cho đúng gu và đúng hệ.

## 3. Quyết định mới

- **Light-led premium**: website dẫn bằng nền sáng (trắng/ivory/kem).
- **Dark as silence**: màu đen không phải nền nhà — nó là **khoảng lặng**, xuất hiện ở đúng những section cần trang trọng rồi trả lại ánh sáng.
- **Bảng màu chỉ xoay quanh 4 nhóm: trắng — kem — đen — vàng.**
- **No brown**: cấm mọi cảm giác nâu/sepia/chocolate/muddy beige/amber-heavy làm mood chủ đạo, cả trên web lẫn ảnh AI sau này.

## 4. Vì sao quyết định này đúng với Essence

Đời — Lặng — Thức dịch ra ánh sáng là: **Đời** = nền sáng như trang giấy thật, ban ngày, không giấu gì; **Lặng** = khoảng đen có chủ đích, như một nhịp nín thở giữa bài — hiếm nên mới quý; **Thức** = chữ rõ, mắt tỉnh, không mờ ảo. Một website toàn tối nói "bí ẩn, đêm, câu lạc bộ" — không phải giọng của một hệ minh bạch về ranh giới. Và về nguồn gốc: design system cũ vốn thiên light ivory — quyết định này thực ra là **trở về đúng gốc brand**, chỉ thêm tên gọi cho các khoảng đen.

## 5. Website $10k theo gu Kenji nghĩa là

Không phải tối hơn, mà: **sáng hơn** — **thoáng hơn** — **chữ rõ hơn** — **tối đúng lúc hơn** — **vàng ít hơn nhưng đắt hơn**.

## 6. Năm dòng Kenji cần nhớ

1. Nền là giấy sáng; đen là khoảng lặng, không phải ngôi nhà.
2. Tỉ lệ ước: 65–75% sáng/kem — 15–25% đen — 5–10% vàng.
3. Một trang chỉ một nút vàng.
4. Thấy "nâu" ở đâu, đó là lỗi, không phải phong cách.
5. Chữ nào phải nheo mắt là chữ sai, dù đẹp đến đâu.

## 7. Năm điều Codex/Claude Code phải tuân theo

1. Homepage và mọi trang public: mode "Light-led premium with dark silence sections" — không còn trang nào "Dark premium" toàn trang.
2. Chỉ dùng token 4 nhóm màu (file UPDATED_COLOR_AND_PAGE_RULES); cấm mọi hex ngoài danh sách, cấm gradient nâu/sepia/overlay ấm.
3. Đen chỉ dùng theo section có tên (silence section), tối đa ~1/4 chiều dài trang.
4. #8A6D1F chỉ là deep gold utility cho chữ vàng nhỏ cần contrast trên nền sáng — không dùng làm mood, nền, hay diện lớn.
5. Mọi PR visual kèm ảnh chụp + tự trả lời 6 câu Visual QA (file UPDATED_COLOR_AND_PAGE_RULES mục cuối).
