# 05_BAN_SAC_HAT_MAM_FUNNEL_AND_LANDING_SPEC.md
Mục tiêu: spec landing + funnel hoàn chỉnh cho Ấn phẩm Bản Sắc Hạt Mầm — sản phẩm active chính 60–90 ngày tới.
Người đọc chính: Codex (build), Kenji (duyệt), người dựng email/form.
Nguồn bắt buộc: M3 Phần J, M8 persona 8, Tài liệu chuẩn hóa ngôn ngữ, docs/strategy/03 (kế hoạch beta), docs/strategy/06 (VoC).

## 1. Vai trò trong 60–90 ngày

Đây là trang bán duy nhất cần hoạt động hoàn chỉnh trong quý này. Nó phục vụ kế hoạch 10 khách beta (docs/strategy/03) và sau đó là bán chính thức. Mọi trang khác có thể "sắp mở"; trang này phải xong, đúng, và đo được.

Vì sao Hạt Mầm là mũi nhọn: rào cản mua thấp nhất hệ; sản phẩm cầm nắm được; ba mẹ chi cho con dễ hơn chi cho mình; là sản phẩm scale không ăn giờ coaching của Kenji; và là nguồn dữ liệu thật đầu tiên của toàn hệ.

## 2. Persona chính

Ba mẹ có con 0–7 tuổi (M8 persona 8): thương con, hơi bối rối trước một nét nào đó của con, sợ bị phán là ba mẹ chưa tốt, dị ứng cả hai cực — tâm linh phán số và cẩm nang nuôi dạy máy móc. Họ cần một sản phẩm dịu, đẹp, riêng tư, cầm nắm được.

## 3. Cấu trúc landing (9 khối, thứ tự cố định)

1. **Hero.** Một câu về khoảnh khắc ba mẹ nhìn con mà chưa hiểu con. Ảnh/hình minh họa ấm (không ảnh trẻ em thật của khách). Một CTA.
2. **Vấn đề của phụ huynh.** Gọi tên cảm giác (con "khó", con "nhát", so con với con nhà người ta) — không khoét sâu nỗi sợ, chỉ gọi tên để được nhìn thấy.
3. **Sản phẩm là gì.** Ấn phẩm cá nhân hóa: bản đồ quan sát về khí chất, nhịp sinh hoạt, cảm giác an toàn của con; HTML phòng đọc riêng + PDF A5. Nêu quy trình: máy hỗ trợ soạn, Kenji đọc duyệt từng bản trước khi giao.
4. **Sản phẩm KHÔNG phải gì.** Không xem số, không dự đoán tương lai, không dán nhãn, không chẩn đoán, không thay chuyên môn y tế. Khối này bắt buộc, đặt cao, không giấu cuối trang.
5. **Bên trong ấn phẩm có gì.** Mô tả cấu trúc (theo template 15 section ở mức khách hiểu) + 1–2 trích đoạn mẫu dummy (không dùng bản của khách thật).
6. **Quy trình đặt/giao.** 5 bước: đặt → điền thông tin → Kenji soạn và duyệt → nhận link phòng đọc riêng + PDF trong X ngày → nhắn hỏi tự do sau khi đọc. Ghi X thật, đừng hứa nhanh hơn khả năng.
7. **Bảo mật dữ liệu con.** 3–4 dòng người thường đọc hiểu + link /chinh-sach-rieng-tu. Cam kết: không công khai, không dùng huấn luyện AI, xóa theo yêu cầu.
8. **FAQ.** 6–8 câu: cần thông tin gì của bé; không nhớ giờ sinh thì sao; khác xem chiêm tinh chỗ nào; bao lâu nhận; đọc xong muốn hỏi thêm; có hoàn tiền không (chính sách thật); dữ liệu lưu ở đâu; ấn phẩm cho bé lớn hơn 7 tuổi (→ hub, "sắp mở").
9. **CTA cuối + trạng thái thật.** Nếu đang đợt beta: nói rõ là beta, giá beta, đổi lại xin phản hồi. Số suất chỉ ghi khi đúng sự thật.

## 4. Copy rules cho trẻ em (bắt buộc, không ngoại lệ)

Theo Tài liệu chuẩn hóa ngôn ngữ + M3 mục 36: không dán nhãn; không dự đoán; không tâm linh hóa; không nói con có sứ mệnh gánh gia đình; không để con chịu trách nhiệm cảm xúc người lớn; xưng "Ba mẹ thân mến" khi nói trực tiếp; giọng ấm — thơ — có hơi người nhưng không định mệnh hóa; Tropical only (không nói kỹ thuật này trên landing, chỉ là luật nội dung). Không bán bằng nỗi sợ: cấm mọi biến thể của "không hiểu con sớm thì muộn mất".

## 5. Pricing / offer (placeholder)

- Khung theo M3 mục 40: Gói 1 — Món Quà Thấu Hiểu (ấn phẩm); Gói 2 — Trò Chuyện Cùng Kenji (ấn phẩm + call ngắn). Giá do Kenji chốt theo chiến dịch (beta: docs/strategy/03 mục 3).
- Nguyên tắc hiển thị: giá rõ ràng, một màn hình, không gạch giá ảo, không "trị giá thật là X".

## 6. Payment flow (thực tế Việt Nam — điểm tài liệu gốc chưa xử lý)

Lưu ý quan trọng: Stripe chưa hỗ trợ chính thức doanh nghiệp tại Việt Nam; với khách Việt, chuyển khoản QR là hành vi tự nhiên nhất. Ba mức:
- **MVP (dùng cho beta):** nút "Đặt ấn phẩm" → form đặt → trang xác nhận hiện mã VietQR (STK + số tiền + nội dung CK theo mã đơn) → Kenji xác nhận tay khi tiền vào → email/tin nhắn xác nhận. Đủ cho 10–30 đơn/tháng, chi phí 0.
- **Semi-auto:** dịch vụ đối soát chuyển khoản tự động (loại webhook báo tiền vào theo nội dung CK — ví dụ các dịch vụ đối soát VietQR phổ biến; chọn sau, có phí nhỏ) → tự cập nhật trạng thái đơn.
- **Sau này:** cổng thanh toán nội địa đầy đủ (thẻ/ví) khi volume xứng đáng.
Luật: trang thanh toán/xác nhận noindex; không nhét thông tin nhạy cảm vào URL; số tài khoản hiển thị là quyết định công khai của Kenji (chấp nhận được), nhưng mã đơn không chứa tên bé.

## 7. Intake form — thu gì và KHÔNG thu gì

Thu (tối thiểu đủ làm ấn phẩm): tên/biệt danh gọi bé trong ấn phẩm (khuyến khích biệt danh); ngày sinh, giờ sinh (nếu nhớ — có nhánh "không nhớ giờ"), nơi sinh; đôi nét nhịp sinh hoạt; bối cảnh gia đình ở mức ba mẹ muốn chia sẻ; CÂU HỎI THẬT của ba mẹ về con; email + kênh nhắn (Zalo/Messenger).
KHÔNG thu khi chưa cần: họ tên khai sinh đầy đủ của bé, ảnh bé, địa chỉ nhà, thông tin y tế, thông tin hôn nhân chi tiết. Nguyên tắc: mỗi trường phải trả lời được "dùng vào section nào của ấn phẩm"; không trả lời được thì bỏ.
Trên form ghi rõ một dòng: thông tin chỉ dùng để soạn ấn phẩm của bé, không công khai, không dùng huấn luyện AI.

## 8. Chuỗi email/tin nhắn (chi tiết ở File 08; landing chỉ cần khớp trigger)

Xác nhận sau đặt → hướng dẫn cung cấp thông tin (nếu chưa điền đủ) → báo "Kenji đang soạn và sẽ đích thân duyệt" → giao ấn phẩm (link phòng đọc + PDF + cách đọc) → follow-up 3–7 ngày → xin phản hồi + xin quyền dùng quote ẩn danh (4 mức theo docs/strategy/06).

## 9. Đo lường (bổ sung — tài liệu gốc chưa nhắc)

Landing phải đo được tối thiểu: lượt xem, bấm CTA, gửi form, đơn xác nhận — nạp cho scorecard (docs/strategy/05). Dùng analytics tôn trọng riêng tư (Vercel Analytics hoặc tương đương, không cookie theo dõi chéo trang), khai báo trong /chinh-sach-rieng-tu.

## Checklist
- [ ] Đủ 9 khối đúng thứ tự; khối 4 (không phải gì) hiển thị rõ.
- [ ] Copy qua từ cấm + copy rules trẻ em = 0 vi phạm.
- [ ] Form chỉ thu trường trong mục 7; có dòng cam kết riêng tư.
- [ ] Flow MVP chạy trọn: đặt → QR → xác nhận → intake → giao (test bằng đơn dummy).
- [ ] Route thanh toán/xác nhận noindex.
- [ ] Sự kiện đo lường bắn đúng 4 mốc.

## Definition of Done
Một phụ huynh lạ tự đi trọn từ landing → đặt → điền form → nhận ấn phẩm dummy mà không cần Kenji giải thích gì ngoài band tin nhắn bình thường; toàn flow qua File 13 nhóm Child Safety + Security.

## Rủi ro cần tránh
- Viết khối 2 (vấn đề) quá tay thành bán bằng nỗi sợ — Child Safety QA chặn.
- Hứa thời gian giao ngắn hơn năng lực duyệt của Kenji — X ngày phải lấy từ số liệu scorecard thật.
- Thu thừa dữ liệu "cho tiện sau này" — vi phạm nguyên tắc tối thiểu dữ liệu.

## Prompt mẫu cho Codex
"Đọc docs/website/05. Branch: feature/landing-hat-mam. Scope: route /an-pham-ban-sac-hat-mam + form intake + trang xác nhận đơn (noindex). Copy dùng bản đã duyệt tại [đường dẫn]. Payment: mức MVP (VietQR tĩnh theo mã đơn). Xong: chạy checklist file này + File 13, preview, phiếu 5 dòng. Không merge."
