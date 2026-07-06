# 08_EMAIL_NURTURE_AND_CUSTOMER_CARE_SYSTEM.md
Mục tiêu: thiết kế hệ email + chăm sóc khách giữ đúng nhịp Essence, không spam, không thao túng.
Người đọc chính: người dựng email (Cowork/Claude Code), Kenji duyệt nội dung.
Nguồn bắt buộc: ai-writing-style, M7 (quy tắc AI gửi/duyệt), M8, docs/strategy/03 và 06.

## 0. Bổ sung thực tế Việt Nam (tài liệu gốc chưa nhắc)

Với phụ huynh Việt, kênh chăm sóc tự nhiên là **Zalo/Messenger**, không phải email. Thiết kế đúng: email là **kênh hồ sơ** (xác nhận đơn, giao link, nội dung cần lưu lại); Zalo/Messenger là **kênh hơi ấm** (hỏi thăm, follow-up, trả lời thắc mắc — Kenji nhắn thật). Mỗi sequence dưới đây ghi rõ kênh. Đừng ép khách check email cho việc mà họ chỉ quen nhắn tin.

## 1. Triết lý

Email Essence không phải spam; nó là cách giữ nhịp. Mỗi email chỉ cần chạm một sự thật, một vòng lặp, một điểm nhận ra (M5 mục 15). Người nhận luôn có quyền dừng — link hủy đăng ký rõ ràng, không giấu.

## 2. Chín sequence

Định dạng từng email: Trigger / Mục tiêu / Kênh / Hướng subject / Nội dung chính / CTA / Không được nói / Điều kiện dừng.

**S1 — Welcome (vào list từ /goc-doc hoặc form quan tâm).** Trigger: đăng ký. Kênh: email. Mục tiêu: người mới biết sẽ nhận gì, nhịp nào. Subject hướng: một lời chào lặng, không "chào mừng bạn đến với…" sáo. Nội dung: Kenji là ai (2 dòng), sẽ nhận ghi chép nhịp nào, một bài đáng đọc trước. CTA: đọc một ghi chép. Không nói: mọi lời bán. Dừng: hủy đăng ký.

**S2 — Hạt Mầm purchase (sau khi đặt).** Trigger: Order tạo. Kênh: email (hồ sơ) + tin nhắn xác nhận ngắn. Mục tiêu: yên tâm đã đặt thành công. Nội dung: xác nhận gói, số tiền, bước tiếp theo (điền intake), thời gian dự kiến. Không nói: hứa nhanh hơn năng lực thật. Dừng: tự kết thúc.

**S3 — Intake reminder.** Trigger: 48–72h sau S2 mà intake chưa đủ. Kênh: tin nhắn trước, email sau. Mục tiêu: gỡ kẹt, không thúc ép. Nội dung: hỏi có vướng chỗ nào khi điền (nhiều ba mẹ kẹt ở giờ sinh) + mời nhắn trực tiếp. Không nói: giọng đòi nợ. Dừng: intake đủ, hoặc sau 2 lần nhắc thì chờ khách chủ động.

**S4 — Delivery (giao ấn phẩm).** Trigger: Publication = ready và Kenji bấm giao. Kênh: email (link phòng đọc + PDF) + tin nhắn báo "đã gửi vào email". Mục tiêu: khoảnh khắc giao trang trọng, ấm. Nội dung: lời dẫn ngắn của Kenji, link, cách đọc (chậm, không cần đồng ý hết), cách báo lỗi. Không nói: xin review ngay lúc giao. Dừng: tự kết thúc.

**S5 — Follow-up 3–7 ngày.** Trigger: 3–7 ngày sau delivered. Kênh: tin nhắn (Kenji nhắn thật — đây là chỗ con người, không tự động). Mục tiêu: hỏi thăm không bán. Một câu hỏi mở duy nhất. Dừng: khách trả lời hoặc không — không nhắc lần hai.

**S6 — Feedback request.** Trigger: sau S5 có phản hồi tích cực, hoặc ngày 7–10. Kênh: tin nhắn kèm link form. Mục tiêu: thu feedback + mức cho phép dùng quote (4 mức, docs/strategy/06). Không nói: gợi ý khen. Dừng: nhận form hoặc sau 1 lần nhắc.

**S7 — Nurture phụ huynh.** Trigger: thuộc list phụ huynh, nhịp 1–2 email/tháng. Kênh: email. Nội dung: ghi chép pillar 1–2 (quan sát con, gỡ nhãn). Mỗi email một dòng mở cửa cuối thư, không hơn. Không nói: dùng dữ liệu con họ đã gửi để cá nhân hóa lời bán — cấm tuyệt đối. Dừng: hủy đăng ký.

**S8 — Ghi chép Essence / newsletter chung.** Như S7 cho tệp người lớn, pillar kiểu gồng/vòng lặp.

**S9 — Partner/Essence inquiry (khi có liên hệ hợp tác).** Trigger: email từ /ve-essence hoặc /ai-startup. Kênh: email, Kenji trả lời thật. Mục tiêu: chuyên nghiệp, đúng hẹn. Không tự động hóa nội dung — chỉ tự động hóa nhắc Kenji trả lời.

## 3. Quy tắc AI gửi / Kenji duyệt (theo M7)

- AI được tự động gửi: email giao dịch máy móc (S2 xác nhận, S3 nhắc) SAU khi template đã được Kenji duyệt một lần và đóng băng.
- Kenji duyệt từng lần: S4 (giao — vì gắn với bản ấn phẩm cụ thể), S5 (tự nhắn), mọi email nurture trong 30–50 bản đầu.
- FLAG — CẦN KENJI REVIEW (tự động dừng, không gửi): nội dung nhắc tới chi tiết con của khách; khách trả lời có dấu hiệu buồn sâu/khủng hoảng; khiếu nại; mọi trường hợp máy không chắc. Luật một dòng: máy phân vân thì máy im, người trả lời.

## 4. Tone

Đời — Lặng — Thức. Ngắn. Một ý một thư. Không upsell bằng áp lực; không "chỉ hôm nay"; không dùng dữ liệu con để chạm nỗi sợ của ba mẹ. Mọi template qua danh sách từ cấm trước khi đóng băng.

## Checklist
- [ ] 9 sequence có template đã duyệt, ghi rõ kênh từng bước.
- [ ] SPF/DKIM/DMARC cấu hình xong trước khi gửi thư đầu (File 07 mục 4).
- [ ] Link hủy đăng ký hoạt động ở mọi email nurture.
- [ ] Rule FLAG được cài trong quy trình (dù đang vận hành tay: checklist người gửi phải soát).
- [ ] Test trọn S2→S6 bằng đơn dummy tới email thật của Kenji.

## Definition of Done
Một khách dummy đi trọn S2→S6 đúng kênh đúng nhịp; không email nào rơi spam (kiểm bằng hộp thư Gmail/Outlook thật); mọi template 0 từ cấm.

## Rủi ro cần tránh
- Tự động hóa S5 — mất đúng khoảnh khắc con người mà khách trả tiền để có.
- Gửi nurture quá dày sau khi có khách — nhịp đã khai báo (1–2/tháng) là cam kết.
- Dùng công cụ email chưa cấu hình DNS — toàn bộ giao hàng rơi spam.

## Prompt mẫu (Cowork)
"Đọc docs/website/08. Soạn nháp 9 template theo đúng format từng sequence, tiếng Việt, giọng theo ai-writing-style, mỗi bản kèm ghi chú kênh + trigger. Xuất một file để Kenji duyệt theo lô."
