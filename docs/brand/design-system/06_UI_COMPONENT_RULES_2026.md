# 06_UI_COMPONENT_RULES_2026.md
Đường dẫn repo: docs/brand/design-system/06_UI_COMPONENT_RULES_2026.md
Quy ước chung mọi component: token file 03, chữ file 04, spacing/radius file 05; focus state nhìn thấy được (viền gold-accent 1px hoặc outline hệ) — accessibility không phải tùy chọn; vùng chạm mobile ≥ 44px; không component nào tự sáng tác biến thể ngoài file này.

## 1. Header/nav
Vai trò: định danh + lối đi chính, không phải bảng quảng cáo. Dùng: mọi trang public. Visual: logo inline/wordmark minimal trái; 3–5 link; nền theo mode; hairline đáy. Copy: nhãn ngắn, sentence case. Mobile: menu gọn, không mega-menu. Không được: chứa CTA vàng thứ hai cạnh CTA trang; chứa link đối tác.

## 2. Footer
Vai trò: kết lặng + nhà của luồng phụ. Visual: nền dark hoặc warm theo mode, footer logo, hairline border-dark/light. Nội dung: liên hệ, chính sách, dòng đối tác lặng (text-link). Không được: grid link dày kiểu tập đoàn; icon mạng xã hội to hàng loạt.

## 3. Buttons
- **Primary**: nền gold-accent, chữ #1A1A1A, radius theo mode, một trang MỘT nút primary (luật vàng file 03). Hover: nền vàng trầm hơn một nấc hoặc underline dịch chuyển nhẹ. Không đổ bóng.
- **Secondary**: viền hairline + chữ primary theo nền; nền trong suốt.
- **Ghost**: chỉ chữ + khoảng đệm; dùng trong vùng đã nhiều lớp.
- **Text link**: underline mảnh, hover chuyển gold-text-light (nền sáng) / gold-accent (nền tối).
Copy nút: động từ mời, ≤ 5 từ, không "MUA NGAY!!!", không tạo gấp. Không được: hai primary một viewport; nút vàng cho hành động phụ.

## 4. Cards
- **Editorial card** (bài viết): ảnh/kicker + title serif + 2 dòng dẫn; hairline; không hover bay.
- **Product card** (cửa sản phẩm): tên + một câu bản chất + trạng thái (badge) + một lối vào; KHÔNG giá trên card ở homepage (giá sống ở landing).
- **Trust card** (điều không hứa): nền warm/dark tùy mode, chữ đối chuẩn contrast, không icon minh họa dễ dãi.
- **Boundary card** (ranh giới/điều kiện): giọng điềm, không cảnh báo đỏ; dùng hairline + label.
Không được: card có shadow; card bấm toàn khối mà không rõ đích.

## 5. Forms (input, textarea, select, error, success)
Visual: underline hoặc khung hairline; nhãn luôn hiển thị (không chỉ placeholder); radius theo mode. Error: một dòng chữ rõ (#8A6D1F trên sáng — không đỏ gắt), nói cách sửa, không trách người điền. Success: xác nhận điềm đạm + bước tiếp theo. Accessibility: label gắn đúng field, error đọc được bởi screen reader. Không được: bắt buộc field không dùng tới (luật tối thiểu dữ liệu — website plan 05); captcha nặng (dùng honeypot).

## 6. Badges/status
"Đang mở" (gold-text-light/gold-accent theo nền), "Sắp mở" (muted), "Riêng tư" (secondary + khóa hairline), "Nội bộ/noindex" (chỉ trong admin). Chữ thật, không icon lấp lánh. Không được: badge "HOT/SALE"; badge sắp mở giả để tạo mong đợi ảo.

## 7. Quote/pullquote
Cormorant italic, size subhead+, kẻ vàng 1px một cạnh HOẶC ngoặc — không cả hai. Chỉ dùng quote có mức consent ≥ 2 (VoC Bank). Không được: quote tiên tri hóa sản phẩm (luật docs/strategy/06).

## 8. Divider/hairline
0.5px border theo nền; vàng 1px chỉ khi đánh dấu khoảnh khắc (một lần/vài section). Không divider trang trí lặp dày.

## 9. Step rows (quy trình đặt/giao)
Số Cormorant numeral + tiêu đề ngắn + một câu; dọc trên mobile. Không được: icon minh họa mỗi bước kiểu SaaS.

## 10. FAQ accordion
Câu hỏi sentence case, mở một mục không tự đóng mục khác; nội dung là câu trả lời thật (kể cả bất lợi — "có hoàn tiền không" trả lời thẳng). Accessibility: mở được bằng bàn phím, aria đúng. Không được: giấu thông tin xấu vào cuối accordion.

## 11. Product mockup block
Khung trình bày ấn phẩm (trang A5 nghiêng nhẹ/thẳng) trên nền warm; dùng bản DUMMY. Không được: dùng trang ấn phẩm của khách thật; hiệu ứng 3D bóng lộn.

## 12. Private reading room components
Khối tiêu đề ấn phẩm + nút tải PDF (primary duy nhất của trang) + khối "cách đọc bản này" + dòng liên hệ khi lỗi. Nền warm, reading width, không nav đầy đủ (chỉ logo nhỏ), không link ra ngoài lung tung, không analytics theo dõi hành vi đọc. Không được: hiện tên khai sinh của bé; nút share mạng xã hội.

## 13. Email/landing CTA block
Một khối kết: một câu mời + một nút/một dòng lệnh nhắn tin. Không được: ba nút; đếm ngược; "chỉ còn X suất" khi không đúng sự thật tuyệt đối.

## Definition of Done
Codex build được từng component chỉ từ mô tả này + token; mọi component qua kiểm: focus state, mobile 360px, contrast, và mục "Không được" của chính nó.
