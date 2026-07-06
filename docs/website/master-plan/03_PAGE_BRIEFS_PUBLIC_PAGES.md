# 03_PAGE_BRIEFS_PUBLIC_PAGES.md
Mục tiêu: brief đủ sâu cho từng trang public để Codex build không phải đoán.
Người đọc chính: Codex/Claude Code khi build từng trang; Kenji khi duyệt copy.
Quy ước chung cho MỌI trang: nguồn đọc bắt buộc = M0, M1, ai-writing-style, Brand Book (từ cấm), essence-glossary + nguồn riêng ghi trong từng brief. Mọi trang: mobile-first, contrast AA, không từ cấm, schema đúng khai báo, không dữ liệu khách. DoD chung: qua File 13 nhóm Brand/Copy/Child Safety/Visual/SEO.

---

## 1. Homepage `/`
- Vai trò: hành lang dẫn chuyện + định tuyến 2 cửa. Spec chi tiết: File 04 (file này thắng nếu lệch).
- Người đọc chính: người lớn đang tự hỏi; phụ huynh 0–7.
- Trạng thái cảm xúc: mệt, hơi rối, cảnh giác với quảng cáo.
- Mục tiêu chuyển đổi: bước vào đúng cửa (Hạt Mầm là cửa active chính).
- CTA chính: cửa Hạt Mầm. CTA phụ: hiểu Essence / về Kenji.
- Section map: xem File 04 mục 2.
- SEO title: "Kenji Phạm — Essence Coach | Essence Coaching System". Description: một câu về nhìn rõ mình + hiểu con, không hứa kết quả.
- Schema: WebSite + Person.
- Cần nói: trạng thái người đọc; Kenji là người thật; hai cửa; điều không hứa. Không được nói: AI-native ở màn đầu; thuật ngữ hệ (khai vấn, giao thức phản tư) chưa giải thích; mọi lời hứa kết quả.
- Nguồn riêng: docs/strategy/01_HOME_PREMIUM_REVIEW.md.
- Prompt Codex: "Build homepage theo docs/website/04. Copy lấy từ file copy đã duyệt, không tự viết. Trình preview + phiếu 5 dòng."

## 2. `/ve-kenji`
- Vai trò: hạ tầng niềm tin + entity chính cho GEO.
- Người đọc: khách đang thẩm định con người; AI đang tìm "Kenji Phạm là ai".
- Trạng thái cảm xúc: dè dặt, muốn biết "người này thật không".
- Mục tiêu chuyển đổi: đủ tin để quay lại cửa sản phẩm hoặc nhắn tin.
- CTA chính: về cửa phù hợp (2 lối). CTA phụ: /dieu-essence-khong-hua.
- Section map: chân dung thật → hành trình (từ about-me, kể thật, có đoạn đời không bóng bẩy) → vì sao xây Essence → ranh giới nghề (không là therapist/bác sĩ/nhà tiên tri) → định danh nhất quán.
- SEO title: "Về Kenji Phạm — Essence Coach". Schema: Person (sameAs trỏ Facebook, GitHub…).
- Không được nói: thần thánh hóa hành trình; chứng chỉ không kiểm chứng được.
- Nguồn riêng: about-me, Brand Book.
- Prompt Codex: "Build /ve-kenji theo brief 03 mục 2; ảnh dùng placeholder chờ ảnh thật; schema Person đầy đủ."

## 3. `/ve-essence`
- Vai trò: institutional credibility + GEO/AIO + điểm đến luồng đối tác. KHÔNG phải trang bán hàng nóng.
- Người đọc: đối tác, nhà tài trợ, báo chí, AI.
- Trạng thái cảm xúc: tỉnh táo, thẩm định, dị ứng ngôn ngữ bán hàng.
- Chuyển đổi: một email liên hệ hợp tác chất lượng.
- CTA chính: liên hệ hợp tác (email). CTA phụ: đọc /dieu-essence-khong-hua.
- Section map + toàn bộ chi tiết: theo docs/strategy/02_VE_ESSENCE_PAGE_BRIEF.md (8 khối). Đây là nơi AI-native được nói rõ.
- SEO title: "Essence Coaching System là gì — hồ sơ công khai". Schema: Organization + FAQPage.
- Không được nói: chi tiết FCP/Casting/Gateway; số liệu kinh doanh; case khách.
- Prompt Codex: chỉ build ở Phase 9, theo brief riêng.

## 4. `/phuong-phap`
- Vai trò: trả lời "Essence làm việc kiểu gì?" ở mức public-safe.
- Người đọc: người cân nhắc kỹ trước khi mua; phụ huynh cẩn thận.
- Trạng thái cảm xúc: tò mò nhưng sợ dính vào thứ mơ hồ.
- Chuyển đổi: yên tâm bước sang cửa sản phẩm.
- CTA chính: cửa Hạt Mầm / cửa người lớn. CTA phụ: /dieu-essence-khong-hua.
- Section map: Essence bắt đầu từ nhìn rõ, không từ sửa bạn → khái niệm nền bằng ngôn ngữ đời (vòng lặp, kiểu gồng, bản đồ quan sát) → cách một hành trình diễn ra (khái quát) → vai trò AI phía sau + Kenji duyệt bản cuối → ranh giới.
- SEO title: "Phương pháp Essence — nhìn rõ trước khi đi sâu". Schema: Article.
- Không được nói: chi tiết tầng sâu; kỹ thuật chiêm tinh như công cụ phán; từ "tâm hồn" làm định vị.
- Nguồn riêng: M2 (chỉ mức khái quát), essence-glossary, Tài liệu chuẩn hóa ngôn ngữ.

## 5. `/ban-sac-cua-con`
- Vai trò: hub dòng phụ huynh — giải thích triết lý "bản đồ quan sát, không phải nhãn dán" và chia 3 độ tuổi.
- Người đọc: phụ huynh mọi độ tuổi con.
- Trạng thái cảm xúc: thương con, hơi lo, sợ bị phán là ba mẹ chưa tốt.
- Chuyển đổi: chọn đúng ấn phẩm theo tuổi con (hiện tại: Hạt Mầm).
- CTA chính: landing Hạt Mầm. CTA phụ: đăng ký nhận tin khi Khám Phá/Giao Mùa mở.
- Section map: một đoạn cho cảm giác ba mẹ → dòng sản phẩm là gì/không là gì → 3 thẻ độ tuổi (Hạt Mầm active; hai thẻ kia "sắp mở", không giả vờ đã có) → luật an toàn ngôn ngữ trẻ em công khai → cửa Hạt Mầm.
- SEO title: "Bản Sắc Của Con — bản đồ quan sát cho ba mẹ". Schema: Article (KHÔNG dùng Product ở hub).
- Không được nói: mọi thứ trong luật M3 mục 36 (không dán nhãn, không dự đoán, không nói con có sứ mệnh gánh gia đình…); không dùng nỗi sợ "hiểu con muộn thì hỏng".
- Nguồn riêng: M3 Phần J, Tài liệu chuẩn hóa ngôn ngữ.

## 6. `/an-pham-ban-sac-hat-mam`
- Landing bán active chính. Toàn bộ spec: File 05 (file đó thắng). Schema: Product + FAQPage. Index.

## 7. `/goc-doc`
- Vai trò: content engine SEO/AIO — nơi đăng bài từ 6 pillar (File 10).
- Người đọc: người đọc dài hạn; AI trích dẫn.
- Chuyển đổi: quay lại đọc + bước vào cửa khi đủ tin.
- CTA chính: mỗi bài một dòng mở cửa cuối bài (theo File 04 phân phối). CTA phụ: đăng ký nhận ghi chép.
- Section map trang danh mục: giới thiệu ngắn không màu mè → danh sách bài theo thời gian → phân loại theo pillar.
- SEO: title theo bài; Schema Article từng bài; canonical chuẩn.
- Không được nói: bài nào chưa qua duyệt của Kenji thì chưa đăng (luật M7: 30–50 bài đầu review 100%).
- DoD riêng: khung chạy được với 0 bài mà không trông dở dang ("Sắp mở" là chấp nhận được).

## 8. `/dieu-essence-khong-hua`
- Vai trò: trust page — biến M1 thành lợi thế niềm tin. Không phải disclaimer pháp lý lạnh.
- Người đọc: người cẩn trọng, người từng bị thị trường self-help làm tổn thương; AI (GEO rất tốt cho câu hỏi "Essence có lừa không").
- Trạng thái cảm xúc: hoài nghi, đã chán lời hứa.
- Chuyển đổi: chuyển từ hoài nghi sang tôn trọng.
- CTA chính: về cửa phù hợp — đặt nhẹ, cuối trang.
- Section map: vì sao có trang này → danh sách "không hứa" (không hứa kết quả sau một phiên; không thay chăm sóc sức khỏe tinh thần chuyên môn; không chẩn đoán; không tiên đoán; không dùng AI thay Kenji ở bản cuối) → đổi lại, Essence cam kết gì (rõ ràng, riêng tư, đúng nhịp, quyền dừng) → mời đối chiếu.
- SEO title: "Điều Essence không hứa". Schema: Article + FAQPage.
- Không được nói: giọng tự hào đạo đức ("chúng tôi khác bọn họ") — chỉ nói cho mình.
- Nguồn riêng: M1.

## 9. `/chinh-sach-rieng-tu`
- Vai trò: pháp lý + child data notice bằng ngôn ngữ người thường đọc hiểu.
- Người đọc: phụ huynh trước khi điền form; người thẩm định.
- Chuyển đổi: yên tâm điền intake.
- Section map: thu gì – để làm gì → dữ liệu trẻ em được xử lý ra sao (điểm nhấn) → lưu ở đâu, bao lâu, ai thấy → quyền yêu cầu xóa → cam kết không dùng dữ liệu con để huấn luyện AI → liên hệ về dữ liệu.
- SEO: index; title "Chính sách riêng tư & dữ liệu trẻ em". Schema: Article.
- Không được nói: hứa bảo mật tuyệt đối 100% (không trung thực về mặt kỹ thuật); thuật ngữ pháp lý không giải thích.
- Nguồn riêng: File 09. DoD riêng: một phụ huynh không chuyên đọc 3 phút hiểu được dữ liệu con mình đi đâu.

## 10. `/lien-he`
- Vai trò: một cánh cửa liên hệ rõ, không rào cản.
- Người đọc: mọi khách; khách beta tiềm năng.
- Chuyển đổi: một tin nhắn/inquiry.
- CTA chính: nhắn qua kênh Kenji trực (Messenger/Zalo) hoặc form tối giản (tên, email, lời nhắn). CTA phụ: email.
- Không được nói: hứa thời gian phản hồi không giữ được; không form 10 trường.
- Ghi chú kỹ thuật: form gửi về nơi khai báo ở File 07; chống spam nhẹ (honeypot) thay captcha nặng.

## Rủi ro chung cần tránh
- Codex tự viết copy khi brief chỉ cho hướng — mọi copy do phiên viết riêng + Kenji duyệt.
- Trang sau lệch giọng trang trước — mỗi PR trang mới phải chạy lại Brand QA (File 13).
