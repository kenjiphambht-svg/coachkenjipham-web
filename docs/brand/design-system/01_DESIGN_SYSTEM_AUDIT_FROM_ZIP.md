# 01_DESIGN_SYSTEM_AUDIT_FROM_ZIP.md
Đường dẫn repo: docs/brand/design-system/01_DESIGN_SYSTEM_AUDIT_FROM_ZIP.md
Nguồn audit: Essence_Coaching_Design_System.zip (300 file) — đọc trực tiếp, trích dẫn từ ESSENCE_DESIGN_SYSTEM_MASTER.md v1.0 (04/2026) và Brand Spec cho AI.

## 1. Trong zip có gì (7 nhóm)

1. **Tài liệu luật**: ESSENCE_DESIGN_SYSTEM_MASTER.md, Brand Spec cho AI.md, README, SKILL.md (skill cho Claude), colors_and_type.css.
2. **Logo Asset Pack**: monogram, wordmark minimal/full VN/full EN/inline, footer logo — mỗi loại 2 nền light/dark, đủ PNG+SVG, đặt tên rất sạch (essence-wordmark-full-vn-dark.svg…).
3. **Chữ ký Kenji**: HTML + kenji-signature-black.png (trong Ebook/assets).
4. **Ebook kit**: Essence Ebook Template.html, ebook.css, và đáng chú ý — **Ban-Sac-Hat-Mam-Shi.html + 2 bản PDF A5** (một bản tên "Bản sao…").
5. **Social/Footer kit**: IG carousel, social footer, footer kiểu 1.
6. **HTML prototypes + preview components + Download Center**.
7. **Rác hệ điều hành**: __MACOSX/, .DS_Store nhiều tầng, file state của công cụ (.design-canvas.state.json, _ds_bundle.js).

## 2. Điểm mạnh (giữ làm nền)

- **Màu**: palette ivory–than–vàng có kỷ luật; đặc biệt logic **hai sắc vàng** rất trưởng thành: vàng sáng #E0C068 chỉ cho đường kẻ/accent nhìn, vàng trầm #8A6D1F cho chữ vàng cần đọc (master ghi rõ vàng sáng trên nền sáng chỉ đạt ~1.7:1 — không được làm chữ). Đây là tư duy contrast đúng, giữ nguyên.
- **Font**: Cormorant Garamond + DM Sans, weight 300/400/500, cấm bold 600+ — nhất quán, thanh lịch.
- **Kỷ luật thị giác**: 0px radius, không shadow, hairline 0.5px, vàng tối đa 4 điểm/trang — tinh thần "ít mà chắc" rất đúng Essence.
- **Voice**: xưng "tôi/bạn", không "chúng tôi" doanh nghiệp, em-dash làm chữ ký câu, cấm emoji; đã có sẵn danh sách từ cấm (manifest, năng lượng vũ trụ, wellness, healing journey…).
- **Asset pack**: naming chuẩn, đủ biến thể light/dark, PNG+SVG — dùng lại được gần như nguyên vẹn.
- **Ebook kit**: template + css là tài sản cho máy ấn phẩm.

## 3. Điểm rủi ro / lệch với Essence 2026

1. **Target audience cũ hẹp**: "entrepreneurs, traders, and people at inflection points" — thiếu hoàn toàn tệp phụ huynh/Bản Sắc Hạt Mầm (mũi nhọn 60 ngày hiện tại, M8 persona 8).
2. **Copy cũ chứa từ cấm**: tone example "Không phải ai cũng cần được chữa lành…" — dù dùng ở thế phủ định, luật hiện tại cấm từ này xuất hiện; câu này chỉ được xếp historical, không dùng public mới.
3. **FCP nêu tên public**: "Rooted in… FCP (Functional Coaching Protocol)" — lệch nguyên tắc không public chi tiết tầng sâu; bản 2026 nói "giao thức phản tư có cấu trúc" ở mức khái quát.
4. **"AI-assisted insight" đặt trong định vị brand** — lệch luật "Kenji đứng trước, AI đứng sau" ở tầng khách hàng.
5. **Font conflict**: hệ cũ DM Sans; một số sản phẩm hiện tại có thể đang dùng Inter → cần một chuẩn cuối (phân tích ở file 04, quyết ở file 11).
6. **Light/dark mismatch**: hệ cũ thiên light ivory (dark chỉ là section); homepage hiện tại thiên dark toàn trang → cần chuẩn hóa thành các mode có tên (file 03).
7. **Gold 4 instances/page**: đúng tinh thần nhưng cứng kiểu đếm số; homepage hiện tại đang vượt → cần rule thực dụng hơn (file 03 mục 5).
8. **0px radius/no shadow áp toàn hệ**: đúng cho public premium; sẽ làm admin/backend và vài khối Hạt Mầm khô cứng nếu áp máy móc (file 05).
9. **Contrast thực địa**: luật cũ tốt trên giấy, homepage hiện tại vẫn dính chữ chìm — luật phải kèm bước ĐO (file 03 QA).
10. **Vệ sinh file**: __MACOSX, .DS_Store, file "Bản sao…", state file của tool — không được vào repo.
11. **Cảnh báo dữ liệu**: Ebook/ chứa Ban-Sac-Hat-Mam-Shi (HTML+PDF). Nếu đây là ấn phẩm của một bé thật → là dữ liệu khách, KHÔNG được đưa vào repo dưới mọi hình thức (luật File 09 website plan). Kenji xác nhận: mẫu dummy hay case thật. Chưa xác nhận = coi là thật.

## 4. Bảng phán quyết

| Rule/nhóm gốc | Quyết | Lý do | Rule 2026 |
|---|---|---|---|
| Palette ivory–than–vàng + 2 sắc vàng | Keep | Trưởng thành, đúng chất | Token hóa ở file 03, thêm mode |
| Cormorant + DM Sans, cấm bold | Keep (chờ chốt body font) | Nhất quán | File 04; quyết DM Sans vs Inter ở file 11 |
| 0px radius, no shadow | Update | Đúng public, cứng cho admin/Hạt Mầm | Theo mode — file 05 |
| Gold max 4/trang | Update | Tinh thần đúng, đếm cứng khó thi hành | "Vàng là dấu lặng" — file 03 mục 5 |
| Positioning entrepreneurs/traders | Update | Thiếu phụ huynh | Định vị 2026 — file 02 |
| Tone example có "chữa lành" | Reject (archive) | Từ cấm hiện hành | Câu thay thế — file 02 |
| FCP nêu tên public | Reject (archive) | Không public tầng sâu | "Giao thức phản tư có cấu trúc" |
| "AI-assisted insight" trong brand IS | Update | AI lùi ra sau ở tầng khách | Cách nói AI — file 02 |
| Voice tôi/bạn, em-dash, no emoji | Keep | Đúng Đời — Lặng — Thức | Bổ sung xưng hô "Ba mẹ thân mến" cho tệp phụ huynh |
| Danh sách từ cấm cũ | Keep + mở rộng | Trùng phần lớn luật mới | Hợp nhất với Brand Book — file 02 |
| Logo Asset Pack | Keep | Sạch, đủ biến thể | Policy ở file 07 |
| Chữ ký Kenji | Keep có điều kiện | Tài sản quý, dễ lạm dụng | Luật dùng — file 07 |
| Ebook kit (template + css) | Keep as reference | Tài sản cho máy ấn phẩm | Chuyển xưởng ấn phẩm; không thuộc repo web |
| File Hạt Mầm Shi trong Ebook/ | Kiểm tra | Nghi dữ liệu khách | Kenji xác nhận; mặc định không đưa repo |
| HTML prototypes/Download Center | Archive | Tham khảo, không phải production | Không copy vào repo |
| __MACOSX/.DS_Store/state files | Reject | Rác | .gitignore + không commit |

## 5. Kết luận

Brand cũ là **reference mạnh** — 70% giữ được, đặc biệt màu, font, kỷ luật thị giác, asset pack. Nhưng nó được viết cho một Essence hẹp hơn (người lớn ở điểm gãy) và trước khi có luật ngôn ngữ 2026. Essence 2026 cần bản chuẩn hóa mới: mở tệp phụ huynh, dọn từ cấm, giấu tầng sâu, thêm hệ mode (light/dark/Hạt Mầm/admin), và biến luật cảm tính thành luật đo được. Bộ file 02–11 chính là bản chuẩn hóa đó.
