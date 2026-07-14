# LAUNCH CHECKLIST — Bản Sắc Giao Mùa (/an-pham-ban-sac-giao-mua)

Route hiện đang ở trạng thái **PREVIEW** (`LINE_STATUS = 'preview'` trong
`src/config/giaoMuaLaunch.ts`), noindex, không link từ nav/homepage/hub.

Sản phẩm này chạm **quyền tự quyết của người trẻ 14–21 tuổi** — nghiêm
ngặt hơn Khám Phá một bậc. **Không ai — kể cả Kenji lúc hứng — được tự
đổi `LINE_STATUS` sang `'live'` khi chưa đủ ĐỦ 6 bước dưới đây, theo
đúng thứ tự.**

## 6 bước bắt buộc (đủ mới được bật `'live'`)

1. **Máy ấn phẩm giao được template Giao Mùa (case dummy PASS).**
   Chạy thử toàn bộ quy trình soạn ấn phẩm với một hồ sơ dummy (không
   phải khách thật) và xác nhận ra được bản PDF/phòng đọc đúng cấu trúc
   5 chương đã mô tả trên landing.

2. **Kenji chốt giá thật vào file cấu hình.**
   Điền `priceDisplay` và `formUrl` cho cả `goi1` và `goi2` trong
   `src/config/giaoMuaLaunch.ts`.

3. **Gỡ noindex + thêm vào sitemap.**
   Xóa `<meta name="robots" content="noindex" />` trong
   `src/pages/an-pham-ban-sac-giao-mua.tsx`, và thêm route vào cơ chế
   sitemap của site (tại thời điểm viết file này, site **chưa có
   `sitemap.xml`**).

4. **Nối link từ hub + homepage.**
   Cập nhật thẻ "Bản Sắc Giao Mùa" trong `src/pages/ban-sac-cua-con.tsx`
   (hiện đang "Sắp mở", không link) thành thẻ có link thật.

5. **Chạy lại Child Safety QA (File 13) đầy đủ — ĐẶC BIỆT nghiêm vì
   chạm tuổi teen tự quyết.** Ngoài luật child-safety thông thường
   (không dán nhãn, không tiên đoán, không tâm linh hóa, không bán bằng
   nỗi sợ, xưng "ba mẹ"), phải xác nhận riêng 2 chốt đạo đức sau **vẫn
   còn nguyên vẹn, không bị rút gọn** trong bản nội dung cuối cùng:
   - Ấn phẩm đứng về phía **mối quan hệ**, không đứng về phía ba mẹ để
     "xử" con.
   - Khuyến khích ba mẹ nói với con về việc làm ấn phẩm; mời con tham
     gia tự nguyện từ 15 tuổi; ấn phẩm không được làm "sau lưng con".

6. **Công bố.**
   Chỉ sau khi 5 bước trên đều đã hoàn tất và có xác nhận rõ ràng từ
   Kenji.

## Ghi chú
- Đoạn Kenji ở Phòng 6 ("Kenji & gói") hiện vẫn là placeholder
  `[KENJI VIẾT — chờ 3-4 câu quan sát 10 năm về tuổi giao mùa]` — phải
  điền trước bước 5.
- `[X ngày]` xuất hiện ở Phòng 5 (quy trình) và FAQ #6 — cần điền số
  ngày giao hàng thật.
- File liên quan: `src/config/giaoMuaLaunch.ts`,
  `src/pages/an-pham-ban-sac-giao-mua.tsx`,
  `src/components/landing-giao-mua/*.tsx`.
