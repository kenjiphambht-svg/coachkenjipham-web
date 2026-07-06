# 14_GLOSSARY_FOR_WEBSITE_BUILDERS.md
Mục tiêu: từ điển chung để Kenji, developer và AI nói cùng một ngôn ngữ.
Người đọc chính: Kenji (tra khi gặp từ lạ), người mới vào dự án.
Định dạng mỗi mục: nghĩa — ví dụ đời thường — dùng ở đâu trong Essence — cần tránh gì.

- **Website Brand Hub**: website làm trung tâm nhận diện thương hiệu. Như ngôi nhà chính hãng giữa phố. Ở Essence: coachkenjipham.com. Tránh: biến hub thành chợ nhiều gian.
- **Routing Hall**: kiểu trang chủ dạng sảnh nhiều cửa chọn ngay. Như sảnh thang máy chung cư. Essence KHÔNG dùng kiểu này thuần túy. Tránh: lưới dịch vụ ngay màn đầu.
- **Narrative Corridor**: trang chủ dạng hành lang dẫn chuyện, cuộn theo nhịp rồi mới mở cửa. Như lối vào khu vườn có người dẫn. Dùng: homepage (File 04). Tránh: kể lể dài đến mức mất cửa.
- **Landing Page**: trang đích cho một sản phẩm/chiến dịch, một mục tiêu duy nhất. Như gian hàng riêng của một món. Dùng: /an-pham-ban-sac-hat-mam. Tránh: một landing bán nhiều thứ.
- **Funnel**: đường đi của khách từ biết → tin → mua → được chăm. Như dòng suối dẫn về hồ. Dùng: content → landing → đặt → giao → follow-up. Tránh: hiểu funnel là "bẫy" — ở Essence là hành lang có cửa thoát.
- **CTA (Call To Action)**: lời mời hành động (nút/dòng link). Như câu "mời anh ngồi" đúng lúc. Tránh: nhiều CTA cạnh tranh trong một màn hình.
- **Lead**: người đã để lại dấu quan tâm (email, tin nhắn). Như khách ghé hỏi giá. Dùng: bảng Lead trong Airtable. Tránh: coi lead là số, quên là người.
- **Intake Form**: form thu thông tin để làm sản phẩm cá nhân hóa. Như phiếu bác sĩ hỏi trước khi khám — nhưng Essence không phải phòng khám, chỉ mượn hình. Dùng: intake Hạt Mầm (File 05 mục 7). Tránh: hỏi thừa.
- **CRM**: hệ ghi nhớ quan hệ khách (ai, đang ở bước nào, đã hứa gì). Như sổ ghi khách của quán quen. Dùng: Airtable. Tránh: mua CRM xịn khi sổ tay còn trống.
- **Tag**: nhãn phân loại trong CRM ("phụ huynh", "beta", "quan tâm Khám Phá"). Như tab màu dán sổ. Tránh: tag vô tội vạ, sau không ai hiểu.
- **Backend**: phần chạy phía sau mà khách không thấy. Như bếp của nhà hàng. Dùng: File 07. Tránh: xây bếp công nghiệp cho quán 10 khách.
- **Database**: kho dữ liệu có cấu trúc. Như tủ hồ sơ có ngăn dán nhãn. Dùng: Airtable (nay), Supabase (sau). Tránh: nhét mọi thứ một ngăn.
- **Private Reading Room**: trang đọc riêng cho từng khách. Như phòng đọc có chìa riêng. Dùng: /an-pham/[slug] (File 06). Tránh: để phòng riêng lọt danh bạ Google.
- **Random Slug**: đuôi địa chỉ ngẫu nhiên không đoán được. Như số phòng khách sạn không theo tên khách. Tránh: slug theo tên bé.
- **Noindex**: biển báo bảo máy tìm kiếm đừng ghi trang này vào danh bạ. Tránh: tin rằng noindex = khóa cửa (nó chỉ là biển, khóa là việc của bảo mật).
- **SEO**: tối ưu để Google xếp hạng. Như đặt biển hiệu đúng phố người ta hay qua.
- **AIO**: tối ưu để các AI hiểu đúng về mình. Như gửi hồ sơ chuẩn cho người môi giới uy tín.
- **GEO**: tối ưu để AI trích dẫn mình khi trả lời người khác. Như được môi giới nhắc tên đúng lúc khách hỏi. Dùng: File 10. Tránh: đo kết quả quá sớm.
- **Schema**: nhãn dữ liệu gắn vào trang cho máy đọc (đây là Người, đây là Sản phẩm). Như tem phân loại trên hộp hồ sơ. Tránh: khai schema sai loại.
- **Sitemap (sitemap.xml)**: bản danh mục các trang public gửi máy tìm kiếm. Như mục lục sách. Tránh: để trang riêng tư lọt mục lục.
- **robots.txt**: bảng nội quy cho máy quét ("khu này đừng vào"). Tránh: dùng làm bảo mật.
- **Canonical**: khai báo "bản gốc của trang này là địa chỉ nào" khi nội dung trùng. Như ghi "bản chính" lên một trong các bản photo. Tránh: quên canonical khi trang có biến thể URL.
- **Webhook**: cách một dịch vụ tự báo tin cho dịch vụ khác khi có sự kiện. Như chuông cửa reo khi có khách, thay vì ra ngó liên tục. Dùng: đối soát tiền vào, form nối Airtable. Tránh: webhook không kiểm tra nguồn.
- **n8n**: công cụ nối các dịch vụ thành dây chuyền tự động, tự host được. Như hệ băng chuyền lắp giữa các máy. Dùng: Phase 12 / M7. Tránh: lắp băng chuyền khi mới có một máy.
- **Environment Variable**: biến cấu hình đặt ngoài code (khóa, mật khẩu dịch vụ). Như két số của quán, không dán mã lên tường bếp. Tránh: viết thẳng khóa vào code.
- **Secret**: mọi chuỗi cho quyền truy cập (API key, mật khẩu). Luật: sống trong env vars, không bao giờ trong repo.
- **Edge/Worker**: đoạn code chạy ở máy chủ gần người dùng (biên mạng), phản hồi nhanh. Như chốt bảo vệ ở đầu ngõ thay vì trong nhà. Dùng: kiểm passcode phòng đọc mức "Tốt hơn". Tránh: nhét logic nặng ra biên.
- **Server-side protection**: kiểm tra quyền ở phía máy chủ trước khi trả nội dung. Người gác đứng NGOÀI cửa. Đối lập với—
- **Client-side password problem**: "khóa" bằng JavaScript trong trang — nội dung đã nằm sẵn trong tay người xem, rèm chứ không phải cửa. Tránh tuyệt đối cho ấn phẩm.
- **PR (Pull Request)**: gói đề xuất thay đổi code chờ duyệt. Như bản thảo trình giám đốc ký trước khi in. Dùng: mọi thay đổi (File 11). Tránh: PR ôm nhiều việc.
- **Branch**: nhánh làm việc tách khỏi bản chính. Như bàn nháp riêng, không vẽ lên bản treo tường. Tránh: làm thẳng trên main.
- **Merge**: nhập nhánh nháp vào bản chính sau khi duyệt.
- **Preview**: bản chạy thử online của một branch (Vercel tự sinh). Như phòng mẫu trước khi xây thật. Dùng: mọi lần duyệt của Kenji.
- **Rollback**: quay về bản trước khi bản mới có lỗi. Như phục hồi bản in cũ trong 5 phút. Dùng: File 13 nhóm 10. Tránh: deploy mà không biết đường lùi.
- **QA Gate**: chốt kiểm bắt buộc trước khi qua bước tiếp (Kenji duyệt = QA gate cao nhất). Như cửa soát vé.
- **Definition of Done**: định nghĩa "xong" viết trước khi làm, để khỏi cãi nhau "vậy là xong chưa". Như biên bản nghiệm thu thỏa thuận trước.

## Definition of Done (của chính file này)
Kenji gặp từ lạ trong bất kỳ phiếu/PR nào đều tra được ở đây; từ mới phát sinh trong dự án được bổ sung vào file trong cùng tuần.
