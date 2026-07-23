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

**GAM CHUẨN trang chủ — BẢN SỬA 23/07 (PR#65), thay bảng PR#64:**

**Case PR#65 (23/07) — NEO SAI MỐC:** bảng gam PR#64 lấy đích là "đa số thống
kê" của các ảnh đang có (warm +8..+15) và coi ⑤⑧ (+21/+28) là outlier cần GIẢM
bão hoà. Kenji xem thật: ⑧⑨ sau chỉnh thành "NHẠT và LẠNH, mất chất villa" —
tức đích đúng là TÔNG VÀNG ẤM CỦA ẢNH MỐC (cầu nối sàn gỗ + ghế, ảnh Kenji
khen đẹp), không phải mức trung bình của các ảnh. **NGUYÊN TẮC MỚI: gam chuẩn
phải neo vào ẢNH MỐC THẨM MỸ do Kenji chỉ định, đo bằng TỈ LỆ NHIỆT R/B (bất
biến theo độ sáng), không neo vào trung bình thống kê.** Mốc hiện hành: ảnh
cầu nối `window-first-light` — **R/B ≈ 1.21, hue ~40-47° (vàng-gỗ)**.

- Section SÁNG (④⑤⑥⑧⑨): warm DƯƠNG RÕ, hue vàng-gold (pink âm nhẹ), R/B
  hướng về 1.1-1.2 ở vùng ảnh lộ nhiều (⑧ sepia(0.3): R/B 1.208 ≈ cầu nối
  1.206). Veil dùng CREAM (ấm), tránh ivory/white gần-trắng cho section cần
  giữ chất villa — veil gần-trắng là nguồn "bạc/lạnh" thứ hai ngoài ảnh.
- Section TỐI (③⑦): đen trung tính → hơi ấm. ⑦ chốt bằng
  `saturate(0) sepia(0.12)`: saturate(0) TRIỆT chroma mọi pixel (không thể
  còn ám xanh về mặt toán), sepia(0.12) phủ lại lớp ấm đều.

**QUY TRÌNH PHÒNG NGỪA (giữ từ PR#64, sửa mốc):** mỗi khi thay ảnh nền, sau
contrast (mục 7) đo thêm composite + so R/B với ảnh mốc; lệch → filter ngay
trong cùng PR. Filmstrip composite xếp cạnh nhau để soi mắt.

**3 tính chất filter cần nhớ (đã kiểm chứng bằng canvas thật):**
- `saturate()` **bảo toàn luma TUYỆT ĐỐI** → chỉnh bão hoà không đổi contrast.
- `hue-rotate()` **KHÔNG bảo toàn luma** → phải đo lại contrast, bù overlay nếu
  tụt (case ⑨ PR#64: 4.85→4.67, bù 78→82%).
- `sepia()` là filter TẠO ẤM + khử hồng/olive cùng lúc (ép mọi hue về vàng-gỗ
  ~40°) — cùng họ sepia(0.18) của ảnh Kenji ở Hero; làm SÁNG nhẹ pixel sáng
  (tổng hàng ma trận >1) nên chữ-tối/nền-sáng chỉ lợi, nhưng chữ-sáng/nền-tối
  phải đo lại. Overlay ĐEN THUẦN không khử được hue-cast (PR#62).

**Case PR#65 — WORST-CASE PIXEL TRƯỢT THEO WIDTH (bổ sung mục 6/7):** ⑦ đạt
5.0 ở desktop-width nhưng FAIL 4.01 ở mobile cùng overlay — cover-crop mỗi
width lộ dải ảnh khác, pixel sáng (trăng 210-244) chui xuống dưới câu chữ ở
width này mà không ở width kia. Số đo contrast của MỘT width không suy ra
được width khác — phải đo từng breakpoint thật (đã là luật mục 1, case này
là bằng chứng thêm ở chiều contrast).

---

## 10. HỆ MÀU CHUNG (UNIFIED COLOR GRADE) — DỪNG VÁ TỪNG SECTION, DỰNG 1 LỚP GRADE

**Case PR#67 (23/07) — bài học kiến trúc màu, giống tinh thần PR#57:** Sau
PR#63→66 chỉnh màu từng section RỜI RẠC (mỗi ảnh 1 filter riêng: `saturate(0.6)`
ở ⑤, `sepia(0.3)+blur` ở ⑧, `sepia(0.5)` ở ⑨, không filter ở ④⑥) + mỗi overlay
1 mức khác nhau → "đuổi theo từng chỗ lệch", chỉnh xong chỗ này chỗ khác lại
lệch tương đối vì KHÔNG có 1 chuẩn tham chiếu chung. Sửa dứt điểm = dựng **1
GRADE DUY NHẤT** áp cả dải sáng ④⑤⑥⑧⑨ (như LUT phim):
- **1 filter chung:** `sepia(0.4)` cho MỌI ảnh dải sáng (thay 4 recipe rời).
  sepia ép mọi hue về vàng-gỗ ~40° → tông đồng bộ tự động, không cần đo-khử
  từng ảnh nữa.
- **1 màu veil chung:** `cream-2026` (#F1EFE8) mọi section.
- **Khi đổi ảnh mới cho section nào:** chỉ cần thả vào, grade chung tự kéo tông
  — KHÔNG chỉnh màu riêng lẻ từng ảnh nữa (đó là gốc rễ bệnh lệch màu lặp lại).

**GIẢM LỚP (đo trước/sau):** overlay div dải sáng 6→5 (gộp 2 gradient breakpoint
của ⑤ thành 1); filter recipe 4→1; bỏ luôn blur(16px)+`-inset-10`+overflow-hidden
của ⑧. Nguyên tắc: dựng hệ = BỚT lớp, không phải thêm 1 lớp đè lên đống cũ.

**GIỚI HẠN THẬT — không phải mọi ảnh nhập được hệ "làm rõ":** `cường độ veil`
KHÔNG thể đồng nhất tuyệt đối vì contrast từng section khác nhau. Đo được: ⑥
`essence-la-gi` có **pixel ĐEN THUẦN (0,0,0) ngay dưới chữ ký + thân bài Vai-3
yếu** (màu 95,94,90) → cần ~90-92% veil mới giữ ≥4.5 (ở 65% tụt 2.34). Đen thì
grade/sepia KHÔNG nâng được (đen bất biến qua ma trận sepia), chỉ overlay nâng.
→ ⑥ KHÔNG lộ ảnh +20% như ⑧⑨ được. **Quy tắc: ảnh có mảng đen gắt dưới vùng
chữ = không dùng được cho section chữ-nhiều/chữ-yếu; cần ảnh nền sáng-đều dưới
khối chữ** (nối tiếp mục 8). Xử lý: grade vẫn áp cho ⑥ (đồng tông), veil giữ
cao TẠM, chờ ảnh ⑥ mới (Kenji cấp) rồi mới làm rõ. Các section còn lại
(④⑤⑧⑨) làm rõ theo brief.

**Case PR#67 — VỆT SÁNG CHỚP DO REVEAL LỘ NỀN DƯỚI (dạng lỗi mới, khác mục 1):**
cuộn ⑦(tối)→ảnh cầu nối(tối) thấy 1 vệt TRẮNG chớp ngang. Nguyên nhân đo được:
`ImageBridge` mang class `.e26-reveal` (opacity:0 khi chưa vào khung hình);
opacity:0 làm TRONG SUỐT cả nền `bg-black` của chính khung → nền `<main>`
(`bg-e26-ivory` = 250,249,247) lộ qua = vệt sáng giữa 2 khối tối, chớp lên
trước khi ảnh fade vào. **Khác 2 case mục 1** (đó là lệch điểm-dừng gradient /
cửa sổ hở giữa 2 overlay); đây là **opacity-reveal để lộ NỀN SÁNG phía sau**.
Sửa: bỏ `.e26-reveal` ở khung full-bleed nằm giữa 2 vùng tối (ảnh chuyển tiếp
không cần fade-up). **Quy tắc: đừng đặt reveal (opacity 0→1) lên khối mà nền
trang phía sau nó SÁNG hơn hẳn khối đó** — sẽ chớp nền sáng khi chưa reveal.
