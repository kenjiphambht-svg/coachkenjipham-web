# 09_SECURITY_PRIVACY_AND_CHILD_DATA_POLICY.md
Mục tiêu: chính sách bảo mật/dữ liệu cho website và vận hành nội bộ — phần sống còn của hệ.
Người đọc chính: MỌI người/AI làm dự án; Kenji để hiểu và ký; là nguồn cho trang /chinh-sach-rieng-tu.

## 1. Vì sao sống còn

Sản phẩm chủ lực của hệ chứa dữ liệu về trẻ em. Một sự cố (ấn phẩm của một bé hiện trên Google, giao nhầm link, lộ intake) phá hủy niềm tin không sửa được bằng bất kỳ chiến dịch nào — và mâu thuẫn trực tiếp M1. Bảo mật ở đây không phải hạng mục kỹ thuật; nó là sản phẩm.

## 2. Dữ liệu nhạy cảm (danh sách chuẩn)

Tên/biệt danh bé; ngày giờ nơi sinh; bối cảnh gia đình trong intake; email/kênh nhắn phụ huynh; feedback riêng tư; toàn bộ nội dung ấn phẩm; ghi chú vận hành có chi tiết case.

## 3. Mười luật cứng

1. Không public dữ liệu trẻ em ở bất kỳ dạng nào.
2. Không commit dữ liệu khách lên GitHub (mọi repo, kể cả private).
3. Không dùng dữ liệu trẻ em để train AI — và nói rõ cam kết này với khách.
4. Không dùng quote khi chưa có consent đúng mức (4 mức — docs/strategy/06).
5. Không lưu case thật trong repo website; repo chỉ có case dummy.
6. Không gửi email dồn nhiều thông tin nhạy cảm vào một thư.
7. Không để route private indexable (test tự động bắt buộc).
8. Không đặt dữ liệu nhạy cảm trong URL/query string.
9. Không ai ngoài Kenji truy cập kho intake (mức hiện tại: một người, một kho, một mật khẩu mạnh + 2FA).
10. Mọi trường hợp phân vân: coi là nhạy cảm.

## 4. Yêu cầu kỹ thuật

- Repo: private; secrets qua environment variables (két riêng của Vercel), không bao giờ trong code; bật secret scanning của GitHub.
- Private routes: random slug ≥16 ký tự + noindex (meta + header) + loại khỏi sitemap; passcode nếu dùng phải kiểm server-side.
- Access control: tài khoản GitHub/Vercel/Airtable/email bật 2FA toàn bộ (task một buổi, làm ở Phase 0 — bổ sung tài liệu gốc chưa nhắc).
- Backup: Airtable snapshot định kỳ; kho intake sao lưu mã hóa; máy ấn phẩm local có bản sao dự phòng (ổ rời hoặc kho mã hóa).
- Audit log: mức MVP = cột AdminNote ghi ai làm gì khi giao; production = log truy cập phòng đọc.
- Deletion request: quy trình 3 bước ghi sẵn — nhận yêu cầu → xóa ở kho intake + Airtable + kho file → xác nhận lại với khách trong X ngày.
- Data retention: theo bảng ở File 07 mục 5; ChildProfile/Intake xóa sau giao + X ngày trừ khi khách muốn giữ.

## 5. Chính sách public cần có trên site

/chinh-sach-rieng-tu (ngôn ngữ người thường — brief ở File 03 mục 9); Terms/Disclaimer ngắn (Essence là coaching, không phải dịch vụ y tế/tâm thần; giới hạn trách nhiệm); Child data notice (khối riêng, nói thẳng: thu gì của bé, để làm gì, không train AI, quyền xóa); chính sách giao/hoàn (nói thật: sản phẩm cá nhân hóa nên phạm vi hoàn tiền thế nào — Kenji quyết, ghi ở File 15).

## 6. Security QA checklist

- [ ] Quét repo: 0 secret, 0 dữ liệu khách (kể cả trong file test, ảnh chụp màn hình, tài liệu docs/).
- [ ] Mọi route /an-pham/* và payment: noindex xác nhận bằng test + kiểm tay một mẫu.
- [ ] sitemap.xml không chứa route private.
- [ ] 2FA bật trên GitHub, Vercel, Airtable, email domain.
- [ ] Env vars: đủ trên Vercel, không có trong code, không in ra log.
- [ ] Form không log nội dung nhạy cảm vào analytics.
- [ ] Quy trình deletion request viết xong, chạy thử một lần với case dummy.
- [ ] Backup: phục hồi thử một bản (backup chưa phục hồi thử = chưa có backup).

## Definition of Done
Toàn bộ checklist mục 6 pass; trang /chinh-sach-rieng-tu online khớp thực tế vận hành (không hứa điều không làm); một người ngoài đọc chính sách và đối chiếu hệ không tìm được điểm nói–làm lệch nhau.

## Rủi ro cần tránh
- Chính sách viết hay hơn thực tế — kiểm tra nói–làm khớp là một mục QA, không phải văn.
- Sự cố nhỏ bị im lặng — quy ước: mọi sự cố riêng tư, dù nhỏ, ghi vào File 15 kèm cách xử lý và báo khách liên quan một cách thẳng thắn.

## Prompt mẫu cho Codex
"Đọc docs/website/09 mục 6. Task: viết test tự động xác nhận noindex cho /an-pham/* và các route payment; chạy quét secret + quét chuỗi giống dữ liệu cá nhân trong repo; xuất báo cáo. Không sửa nội dung. Phiếu 5 dòng."
