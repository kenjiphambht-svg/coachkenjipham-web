# 02_PUBLIC_SITEMAP_AND_ROUTE_POLICY.md
Mục tiêu: chốt danh sách route, trạng thái và luật của từng route — để không ai tạo trang bừa.
Người đọc chính: Codex/Claude Code khi tạo hoặc sửa route; Kenji khi duyệt.

## 1. Giải thích cho Kenji

Route là địa chỉ từng phòng trong ngôi nhà web (ví dụ coachkenjipham.com/ve-kenji). Luật ở đây giống sổ quy hoạch: phòng nào xây ngay, phòng nào để sau, phòng nào là phòng riêng không cho Google vào (noindex), phòng cũ nào giữ tạm (legacy). Ai muốn xây phòng mới phải sửa sổ này trước.

## 2. Bảng route

| Route | Tên hiển thị | Vai trò | Người đọc chính | Trạng thái | SEO | CTA chính | Dữ liệu nhạy cảm | Ghi chú kỹ thuật |
|---|---|---|---|---|---|---|---|---|
| `/` | Trang chủ | Hành lang dẫn chuyện, định tuyến 2 cửa | Người lớn + phụ huynh | build now | index | Cửa Hạt Mầm | Không | Spec riêng File 04 |
| `/ve-kenji` | Về Kenji | Niềm tin con người + entity GEO | Mọi khách + AI | build now | index | Về trang chủ / Hạt Mầm | Không | Schema Person |
| `/ve-essence` | Về hệ Essence | Institutional credibility, GEO/AIO, đối tác | Người thẩm định | later (Phase 9) | index | Liên hệ hợp tác | Không | Brief: docs/strategy/02 |
| `/phuong-phap` | Phương pháp | Giải thích cách Essence làm việc, public-safe | Người cân nhắc | later (Phase 2) | index | Hạt Mầm / Liên hệ | Không | Không mở FCP/Casting chi tiết |
| `/ban-sac-cua-con` | Bản Sắc Của Con | Hub dòng phụ huynh (3 độ tuổi) | Phụ huynh | build now (Phase 2) | index | Landing Hạt Mầm | Không | Khám Phá/Giao Mùa ghi "sắp mở" |
| `/an-pham-ban-sac-hat-mam` | Ấn phẩm Bản Sắc Hạt Mầm | Landing bán sản phẩm active chính | Ba mẹ con 0–7 | build now (Phase 3) | index | Đặt ấn phẩm / vào beta | Form intake liên kết | Spec riêng File 05 |
| `/kidbook` | (legacy) | Route cũ đang sống | Khách cũ | legacy — GIỮ NGUYÊN | giữ hiện trạng | — | Kiểm tra | KHÔNG redirect khi chưa kiểm payment/product flow đang chạy trên đó |
| `/goc-doc` | Ghi chép Essence | Content engine SEO/AIO | Người đọc + AI | later (Phase 8) | index | Đọc tiếp / Bắt đầu | Không | Khung dựng sẵn, để trống được |
| `/dieu-essence-khong-hua` | Điều Essence không hứa | Trust page (không phải disclaimer lạnh) | Người cẩn trọng + AI | build now (Phase 2) | index | Về cửa phù hợp | Không | Nguồn: M1 |
| `/chinh-sach-rieng-tu` | Chính sách riêng tư | Pháp lý + child data notice | Phụ huynh + thẩm định | build now (Phase 2) | index | — | Không | Nguồn: File 09 |
| `/lien-he` | Liên hệ | Một kênh liên hệ rõ | Mọi khách | build now (Phase 2) | index | Gửi tin / Zalo-Messenger | Email người gửi | Không form phức tạp |
| `/ai-startup` | AI Startup Dossier | Luồng đối tác/thẩm định | Nhà đầu tư, đối tác | giữ, hạ xuống footer | index | Liên hệ hợp tác | Không | KHÔNG là CTA cho phụ huynh; sau này có thể gộp vào /ve-essence |
| `/an-pham/[random-slug]` | Phòng đọc riêng | Giao ấn phẩm cho khách | Khách đã mua | build Phase 5 | **noindex** | Tải PDF A5 | CÓ — nội dung ấn phẩm | Spec File 06; slug ngẫu nhiên, không theo tên bé |
| `/thanh-toan/*` (hoặc trang xác nhận đơn) | Payment routes | Nhận thanh toán / xác nhận | Khách mua | build Phase 4 | **noindex** | Hoàn tất đơn | CÓ — email, đơn hàng | Không nhúng dữ liệu nhạy cảm vào URL |
| `/admin/*` | Dashboard nội bộ | Quản trị (nếu cần sau này) | Kenji | later (Phase 10, chỉ khi Airtable hết đủ) | noindex + chặn truy cập | — | CÓ | Không build sớm |

## 3. Luật route

1. Không tạo route mới khi chưa thêm dòng vào bảng này và được Kenji duyệt.
2. Mọi route chứa dữ liệu khách: noindex + không nằm trong sitemap.xml + slug không đoán được.
3. `/kidbook`: đứng yên cho đến khi có audit xác nhận không còn flow mua/giao nào phụ thuộc; chỉ khi đó mới bàn redirect 301 về landing mới.
4. Đường dẫn dùng tiếng Việt không dấu, ngắn, ổn định — đổi slug sau khi index là mất SEO, coi như chuyển nhà mất địa chỉ.

## Checklist
- [ ] Bảng route khớp 100% route thực trong repo (audit Phase 0).
- [ ] Route noindex đã kiểm bằng công cụ (xem File 13 mục SEO QA).
- [ ] /kidbook đã được audit flow trước khi bàn bất kỳ thay đổi nào.

## Definition of Done
Repo không có route nào ngoài bảng; mọi route đúng trạng thái index/noindex như khai báo.

## Rủi ro cần tránh
- Redirect /kidbook sớm → gãy flow mua đang chạy → mất đơn thật. Đây là rủi ro doanh thu, không phải rủi ro kỹ thuật.
- Slug private lộ vào sitemap.xml do cấu hình mặc định của framework — phải kiểm tra tay.

## Prompt gợi ý cho Codex
"Đọc docs/website/02. Task: audit toàn bộ route hiện có trong repo, xuất bảng so sánh với bảng route chuẩn (route thừa/thiếu/sai trạng thái index). Không sửa gì. Trình phiếu 5 dòng."
