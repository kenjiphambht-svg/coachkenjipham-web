# SỔ TAY BÀI HỌC KỸ THUẬT — coachkenjipham-web

**Đọc TRƯỚC khi làm việc liên quan ảnh nền / gradient / hiệu ứng cuộn.**
Phát hiện lỗi mới thuộc các nhóm dưới → bổ sung case cụ thể, kèm ngày + PR số.

---

## 1. NHIỀU LỚP MỜ/TỐI CHỒNG NHAU PHẢI KHỚP ĐIỂM DỪNG

Khi có ≥2 lớp gradient/overlay/mask cùng che một vùng, phải **ĐO** toạ độ bắt
đầu/kết thúc của TỪNG lớp, xác nhận chúng "đóng kín" CÙNG LÚC. Lớp A hết hiệu
lực ở X, lớp B chỉ đạt trạng thái cuối ở Y≠X → khoảng X-Y là **"cửa sổ hở"**.

- **Case PR#41 (21/07):** `bg-wall-dark` mobile — `bg-cover` phóng đại quá mức
  trên container cao hẹp → mất hết vân tường. Sửa: đo hệ số phóng đại + dò
  `background-position` theo vùng có vân đẹp nhất, không mặc định `center`.
- **Case PR#52 (21/07):** vùng tối Hero — lớp "Kenji tan mờ" (mask-image) hết
  hiệu lực ở y≈953–1024, lớp "nền đen đặc" chỉ đạt 100% ở y≈1048 → hở "cửa sổ
  sáng" ~70px lộ sàn villa (overlay chỉ 40%) thành vệt ngang qua chân ghế.
  Sửa: kéo dài + làm dốc lớp nền cho đạt gần-đặc ĐÚNG chỗ Kenji tan hết.
- **Case PR#53 (21/07):** cơ chế "bleed tail" của vệt sơn (dựng ở PR#46 để tan
  mượt vào nền đen TRƠN của ③ lúc ③ CHƯA có ảnh riêng) bị **bỏ sót** khi ③ đổi
  sang có ảnh + overlay riêng (PR#52) → 2 cơ chế chồng nhau tạo **đốm sáng dư**
  lạc chỗ giữa vùng đen. Đo xác nhận: Hero kết y=1328, ③ bắt đầu y=1328, nhưng
  đuôi bleed trải 1308→1398 nên 70px nằm TRONG ③; đuôi có `z-20` còn overlay ③
  `z-auto` → đuôi vẽ ĐÈ lên overlay ③. Sửa: xoá hẳn đuôi (③ tự lo overlay).
  **BÀI HỌC PHỤ:** đổi ảnh/overlay 1 section → rà lại section LIỀN KỀ xem có cơ
  chế nào đang "viện trợ" cho nó dựa trên trạng thái CŨ không.

---

## 2. LUẬT CSS TOÀN CỤC CÓ THỂ RÒ SANG TRANG KHÔNG LIÊN QUAN

Rule global (vd `body{font-weight:300}`) viết cho 1 route có thể âm thầm áp lên
MỌI route khác dùng chung layout nếu route đó không khai báo riêng.

- **Case PR#47 (21/07):** `font-weight:300` viết cho `/kidbook`, `/ai-startup`
  rò sang `/trang-chu-v2`, vi phạm luật cấm nét 300 cho tiếng Việt có dấu —
  hàng loạt đoạn thân bài ③④⑤⑥⑦⑧⑨ đang render 300 dù class không ghi.
  **BÀI HỌC:** định kỳ rà **COMPUTED STYLE thật**, không chỉ đọc class trong
  source. Sửa tại từng component (thêm `font-normal` rõ ràng), KHÔNG sửa rule
  global vì nó không có scope riêng và sẽ ảnh hưởng ngược 2 route sống kia.

---

## 3. CÔNG CỤ CHỤP ẢNH TRONG MÔI TRƯỜNG NÀY CÓ THỂ GLITCH

Màn trắng / khung cũ dù DOM render đúng — lỗi công cụ thật đôi khi xảy ra.
Xử lý: tab mới, đổi viewport, đợi vài giây, cuộn cách khác.

`elementFromPoint` / `getBoundingClientRect` là bằng chứng **THAY THẾ** khi mọi
cách chụp thật đều thất bại — **KHÔNG phải lựa chọn mặc định**. Vấn đề hình
dạng / thẩm mỹ (méo, lệch phối cảnh, màu xấu, đốm sáng lạc chỗ) **BẮT BUỘC**
phải nhìn thấy bằng ảnh thật.

---

## 4. HIỆU ỨNG CUỘN (IntersectionObserver) CÓ THỂ BẮN SAI THỜI ĐIỂM

- **Case PR#50 (21/07):** observer gắn **TRƯỚC** khi web font load xong →
  layout dùng font dự phòng (metrics ngắn hơn ~100px) khiến phần tử bị tính
  nhầm "đã trong khung hình" ngay lúc tải trang → nhận `is-visible` + unobserve
  luôn; user cuộn tới thì animation đã chạy xong từ lâu → "không thấy hiệu ứng".
  Đo trên production build: `rectTop=1103 > viewport 1024` ở `scrollY=0` mà vẫn
  `is-visible=true`. Sửa: chờ `document.fonts.ready` rồi mới `observe`.
- **Case PR#50 (21/07):** 2 CSS rule **cùng độ đặc hiệu** đá nhau khiến 1 phần
  hiệu ứng (`translateY`) không bao giờ chạy dù phần kia (`opacity`) đúng —
  rule sau trong file thắng vĩnh viễn. **BÀI HỌC:** đo COMPUTED STYLE **từng
  property riêng biệt**, đừng chỉ nhìn tổng thể "có vẻ đã hiện ra".
- **Verify hiệu ứng cuộn ĐÚNG:** dùng **wheel/scroll THẬT** (không chỉ
  `scrollTo()` lập trình — observer có thể không bắn với scroll lập trình),
  chụp **NHIỀU ảnh liên tiếp** tại các mốc cuộn khác nhau để chứng minh trạng
  thái đổi dần, không chỉ 1 ảnh trạng thái cuối. Nếu latency chụp dài hơn
  animation, đóng băng transition bằng Web Animations API (`pause()` +
  `currentTime`) để chụp đúng khoảnh khắc giữa.

---

## 5. QUY TẮC ĐẶT TÊN FILE ẢNH

`[vi-tri]-[noi-dung].webp` — không dấu, chữ thường, nối gạch ngang.

Ví dụ: `hero-hien-vuon`, `kiettac-villa-toi`, `andinh-vuon-toi`,
`kenji-phong-doc`, `haicua-hanhlang`.

Giữ cả file `.png` gốc cạnh `.webp` (quy ước đã dùng từ PR#44/#49).

---

## 6. KHI ĐỔI ẢNH NỀN 1 SECTION, LUÔN KIỂM CẢ 2 BIÊN (TRÊN VÀ DƯỚI)

Không chỉ kiểm bên trong section — phải kiểm điểm nối với section **TRƯỚC** và
**SAU**, vì section liền kề có thể có cơ chế giả định trạng thái cũ (xem mục 1).

- **Case PR#53 (21/07):** đáy ⑦ ở overlay phẳng 82% composite ra ~54/255, trong
  khi ảnh cầu nối ngay sau (`ImageBridge`) có mép trên rất tối (11–13/255) →
  **bước nhảy độ sáng** tại đường nối. Sửa: đổi overlay ⑦ từ phẳng sang
  gradient tối dần về đáy (82% → 96%), đo lại đáy ⑦ còn ~31/255, sát
  `#1A1A1A` (26) nên nối liền mạch. Đo xác nhận 2 mốc trùng nhau: đáy ⑦ =
  đầu cầu nối = y 6368, không hở khe.

---

## 7. CHỌN "WORST-CASE PIXEL" ĐÚNG CHIỀU KHI ĐO CONTRAST TRÊN ẢNH

Khi đo WCAG cho chữ nằm trên ảnh, "trường hợp xấu nhất" **đảo chiều** tuỳ màu chữ:

- **Chữ SÁNG trên nền TỐI** (③, ⑦): worst-case = **pixel SÁNG nhất** trong vùng
  chữ (nền càng sáng, contrast càng giảm).
- **Chữ TỐI trên nền SÁNG** (②Hero, ④, ⑤): worst-case = **pixel TỐI nhất**
  (nền càng tối, contrast càng giảm).

**Case PR#53 (21/07):** ban đầu đo ④ bằng "pixel sáng nhất" (thói quen từ ③/⑦)
ra kết quả sai chiều — tưởng 78% là đủ. Đo lại đúng chiều (pixel tối nhất) mới
thấy cần ~84–85%. Nếu chọn sai chiều sẽ **ship thiếu overlay** mà vẫn tưởng đạt.

**Lưu ý phụ:** "pixel tối/sáng nhất" là thước đo rất khắt khe (1 đốm nhỏ cũng
tính). Repo này ship theo thước đo đó cho an toàn; nếu dùng trung bình thì phải
ghi rõ trong báo cáo là đã dùng trung bình.

---

## 8. ẢNH NỀN "ĐẸP" CÓ THỂ PHẢI HY SINH ĐỘ RÕ VÌ CONTRAST

Section nền SÁNG + chữ TỐI (④, ⑤) cần veil rất nặng (~85%) mới đạt 4.5:1 nếu
ảnh có vùng tối/chi tiết (kệ sách, khung cửa gỗ) nằm dưới chữ → ảnh chỉ còn là
"cảm giác sáng", không còn nhận ra cảnh. Đây là **đánh đổi có thật**, không
phải lỗi.

Ngược lại section nền TỐI + chữ SÁNG (③, ⑦) giữ được ảnh rõ hơn nhiều ở cùng
mức an toàn (③ chỉ ~58–68%, ⑦ 82% mà villa vẫn "le lói").

Nếu muốn ảnh RÕ hơn ở ④/⑤ mà vẫn an toàn: cân nhắc (a) đặt chữ lên panel đặc
riêng, (b) veil theo gradient ngang — nặng sau chữ, nhẹ ở vùng trống, hoặc
(c) chọn ảnh có vùng phẳng/sáng đều ngay dưới khối chữ. **Cần Kenji quyết
định** vì đây là đánh đổi thẩm mỹ ↔ khả đọc, không phải lựa chọn kỹ thuật thuần.
