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
- **Case PR#58→#59 (22/07):** đổi SCALE ảnh Kenji trong Hero (82%→60%, brief
  ghép nền villa) dịch điểm chạm chân/ghế XUỐNG SÂU HƠN (+116px tại md, so với
  mốc ~95px PR#57 đã đo cho scale CŨ) — nhưng lớp gradient tối (LỚP 4) vẫn giữ
  nguyên mốc "đen đặc ở 90px" đo cho vị trí cũ, không ai cập nhật lại vì brief
  đổi scale không nhắc tới gradient. Kết quả: dư ~26px vùng ramp-mờ nằm chồng
  lên cảnh villa phía trên, đọc như một dải sương/xám lem lên vườn. Sửa: đo lại
  điểm chạm THẬT sau khi đổi scale (không dùng lại số đo cũ), TÁCH ramp theo
  breakpoint (mobile không đổi scale nên giữ nguyên mốc cũ; md+ dùng mốc mới:
  mờ hoàn toàn tới 55px để trả cảnh, đen đặc ở 108px sao cho chân +116px vẫn dư
  biên ≥5px trong đen — chuẩn của PR#57).
  **BÀI HỌC:** đổi SCALE/POSITION của BẤT KỲ lớp nào trong 1 khung ghép nhiều
  lớp → phải liệt kê HẾT các lớp KHÁC đang tham chiếu toạ độ của lớp đó (bóng,
  gradient che, mask...) và xác nhận lại TỪNG lớp, không chỉ lớp bị đổi trực
  tiếp — hệ quy chiếu chung (mục này, xem case PR#57 "kiến trúc" bên dưới) chỉ
  giải quyết trôi giữa breakpoint, KHÔNG tự động giải quyết trôi do đổi scale.
  **Checklist:** sau khi đổi scale/position của 1 lớp, liệt kê mọi lớp khác
  đang phụ thuộc toạ độ của nó, rồi xác nhận lại TỪNG lớp bằng đo/ảnh thật —
  không giả định lớp phụ thuộc vẫn đúng chỉ vì hệ quy chiếu (px-stops) không đổi.

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

## 6. ĐỔI BẤT KỲ THAM SỐ HÌNH HỌC NÀO CỦA 1 LỚP → KIỂM CẢ 2 BIÊN + MỌI LỚP PHỤ THUỘC

Không chỉ khi đổi ẢNH NỀN 1 section — BẤT KỲ thay đổi hình học nào (scale,
position, margin/bleed, crop) của BẤT KỲ lớp nào trong 1 vùng ghép nhiều lớp
đều cần rà đủ 2 việc:

- **(a)** điểm nối với section **TRƯỚC** và **SAU**, vì section liền kề có thể
  có cơ chế giả định trạng thái cũ (xem mục 1);
- **(b)** mọi lớp KHÁC đang phụ thuộc toạ độ của lớp vừa đổi (bóng, gradient
  che, mask) — đổi scale/position không tự động kéo các lớp phụ thuộc đó cập
  nhật theo, dù hệ quy chiếu (vd px-stops) đã đúng chuẩn (xem case PR#58→#59,
  mục 1: đổi scale ảnh Kenji không đụng tới gradient, nhưng gradient vẫn cần
  đo lại vì điểm nó che đã dịch chuyển).

- **Case PR#53 (21/07):** đáy ⑦ ở overlay phẳng 82% composite ra ~54/255, trong
  khi ảnh cầu nối ngay sau (`ImageBridge`) có mép trên rất tối (11–13/255) →
  **bước nhảy độ sáng** tại đường nối. Sửa: đổi overlay ⑦ từ phẳng sang
  gradient tối dần về đáy (82% → 96%), đo lại đáy ⑦ còn ~31/255, sát
  `#1A1A1A` (26) nên nối liền mạch. Đo xác nhận 2 mốc trùng nhau: đáy ⑦ =
  đầu cầu nối = y 6368, không hở khe.
- **Case PR#57 (22/07):** PR#54 cap layer nền Hero theo `max-w-[1440px]` để
  chống trôi object-position — nghiệm thu khi đó CHỈ theo tiêu chí của brief
  đó (khung vòm né chữ), không rà 2 mép màn hình → viewport >1440 hở **2 dải
  cream dọc 240px mỗi bên** mà không ai thấy cho tới khi Kenji xem trên màn
  rộng. Sửa tận gốc: nền full-bleed trở lại + zoom theo bậc viewport
  (`min-[1560px]:scale-110`, origin-right...) vì ảnh gốc 1920px không đủ rộng
  để vừa phủ kín vừa giữ bố cục chỉ bằng pan (đã giải bằng số: hết dư địa ở
  ~1578px). **BÀI HỌC:** "2 biên" không chỉ là biên trên/dưới của section —
  còn là 2 MÉP TRÁI-PHẢI ở viewport RỘNG HƠN mốc thiết kế; và fix cho một
  brief phải rà lại bằng checklist đầy đủ của các brief trước, không chỉ
  tiêu chí của brief đang làm.
- **Case PR#57 (22/07, bài học kiến trúc):** vùng đáy Hero từng qua ~6 PR vá
  nối tiếp (mask, bệ bóng, contact shadow, kéo gradient...) — mỗi lớp vá dùng
  MỘT HỆ QUY CHIẾU KHÁC (bóng theo % ảnh, gradient theo % chiều cao khối,
  ảnh neo theo px bleed) nên chỉnh lớp này lệch lớp kia. Sửa dứt điểm = đổi
  gradient sang **px-stops tính từ mép trên khối** (cùng hệ quy chiếu với
  điểm neo px của ảnh) rồi XOÁ 3 lớp bóng (6 lớp → 3 lớp). Khi thấy mình vá
  cùng một vùng lần thứ 3, dừng lại tìm hệ quy chiếu chung thay vì thêm lớp.

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

---

## 9. THỐNG NHẤT TÔNG MÀU TOÀN TUYẾN — ĐO "GAM CHUẨN" KHI ĐỔI ẢNH, KHÔNG CHỈ TỐI ƯU 1 SECTION

**Case PR#63→#64 (23/07):** Sau ~2 tuần đổi ảnh nền từng section RIÊNG LẺ (mỗi
lần chỉ tối ưu overlay/contrast CHO ĐÚNG section đó), chưa lần nào xếp cả 9 ảnh
cạnh nhau để so gam. Kết quả: nhiều đường nối lộ rõ vì mỗi ảnh một sắc — ⑤/⑧
ngả beige-olive (composite warm +21/+28), ④ trắng-lạnh (warm +3), ⑨ ám hồng-đào
ở tường vữa, trong khi ⑥/⑨ là kem êm (+5/+13). Sửa: audit TOÀN TUYẾN 1 lượt, đo
composite từng ảnh, kéo mọi ảnh về **một gam kem-vàng ấm chung** bằng filter ở
tầng hiển thị (không đụng file gốc): ⑤ `saturate(0.6)`, ⑧ `saturate(0.5)`, ⑨
`saturate(0.8) hue-rotate(10deg)`, ④ đổi overlay `white`→`cream`.

**2 CHỈ SỐ ĐO TÔNG (mean composite, sau overlay + filter, như mắt thấy):**
- **warm = R − B** (dương = ấm/vàng; âm = lạnh/xanh).
- **pink = (R+B)/2 − G** (dương = ám hồng/tím; âm = ngả lục/olive; ~0 = vàng-gold cân).

**GAM CHUẨN trang chủ (đích khi đổi ảnh mới — đo composite):**
- Section SÁNG (④⑤⑥⑧⑨): **warm +8..+15, pink −3..0**. Ngoài dải này là outlier.
- Section TỐI (③⑦): **warm −2..+6, pink ~0** (trung tính hơi ấm; ⑦ từng ám xanh
  −7, đã kéo về −1 bằng `saturate(0.3)` — xem PR#62).

**BÀI HỌC / QUY TRÌNH PHÒNG NGỪA:** mỗi khi thay ẢNH NỀN 1 section, sau khi đo
contrast (mục 7) phải ĐO THÊM composite warm/pink của ảnh MỚI và so với bảng gam
chuẩn trên. Nếu lệch ra ngoài dải → hiệu chỉnh filter NGAY trong cùng PR đó,
đừng để dồn thành "lệch cả tuyến" phát hiện muộn. Xếp ảnh cạnh nhau (filmstrip
composite) để soi bằng mắt là cách nhanh nhất thấy outlier.

**2 tính chất filter cần nhớ khi hiệu chỉnh (đã kiểm chứng bằng canvas thật):**
- `saturate()` **bảo toàn luma TUYỆT ĐỐI** (ma trận chỉ co chrominance quanh trục
  luma) → giảm bão hoà để dịu olive/orange KHÔNG làm đổi contrast chữ. An toàn nhất.
- `hue-rotate()` **KHÔNG bảo toàn luma tuyệt đối** → dùng để xoay hồng→vàng nhưng
  phải đo lại contrast; nếu tụt (case ⑨: 4.85→4.67) thì bù bằng +overlay
  (⑨: 78%→82%, intro về 4.9). Overlay ĐEN THUẦN là phép nhân, KHÔNG khử được
  hue-cast — chỉ filter mới khử được (xem PR#62 mục ⑦).
