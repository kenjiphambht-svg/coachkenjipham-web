# LAUNCH CHECKLIST — Bản Sắc Khám Phá (/an-pham-ban-sac-kham-pha)

Route hiện đang ở trạng thái **PREVIEW** (`LINE_STATUS = 'preview'` trong
`src/config/khamPhaLaunch.ts`), noindex, không link từ nav/homepage/hub.

**Không ai — kể cả Kenji lúc hứng — được tự đổi `LINE_STATUS` sang `'live'`
khi chưa đủ ĐỦ 6 bước dưới đây, theo đúng thứ tự.** Đây là điều kiện mở khóa
cứng, không phải gợi ý.

## 6 bước bắt buộc (đủ mới được bật `'live'`)

1. **Máy ấn phẩm giao được template Khám Phá (case dummy PASS).**
   Chạy thử toàn bộ quy trình soạn ấn phẩm với một hồ sơ dummy (không phải
   khách thật) và xác nhận ra được bản PDF/phòng đọc đúng cấu trúc 5 chương
   đã mô tả trên landing.

2. **Kenji chốt giá thật vào file cấu hình.**
   Điền `priceDisplay` và `formUrl` cho cả `goi1` và `goi2` trong
   `src/config/khamPhaLaunch.ts`. Không đổi `LINE_STATUS` trước khi bước
   này xong — landing sẽ hiện giá rỗng nếu làm sai thứ tự.

3. **Gỡ noindex + thêm vào sitemap.**
   Xóa `<meta name="robots" content="noindex" />` trong
   `src/pages/an-pham-ban-sac-kham-pha.tsx`, và thêm route vào cơ chế
   sitemap của site (tại thời điểm viết file này, site **chưa có
   `sitemap.xml`** — nếu vẫn chưa có khi tới bước này, cần dựng sitemap
   trước hoặc ít nhất xác nhận route sẽ được Google index qua cách khác).

4. **Nối link từ hub + homepage.**
   Cập nhật thẻ "Bản Sắc Khám Phá" trong `src/pages/ban-sac-cua-con.tsx`
   (hiện đang "Sắp mở", không link) thành thẻ có link thật tới route này —
   theo đúng pattern đã áp dụng cho thẻ Hạt Mầm/Lặng 90'/Dấu Ấn Của Bạn/Bạn
   Là Duy Nhất ở các hub tương ứng. Cân nhắc thêm lối vào từ trang chủ nếu
   phù hợp thời điểm.

5. **Chạy lại Child Safety QA (File 13) đầy đủ.**
   Quét lại toàn bộ copy cuối cùng (kể cả đoạn Kenji ở Phòng 6 và mọi chỗ
   đã điền số `[X]` ngày) qua bộ luật child-safety: không dán nhãn, không
   tiên đoán, không tâm linh hóa, không bán bằng nỗi sợ, xưng "ba mẹ".

6. **Công bố.**
   Chỉ sau khi 5 bước trên đều đã hoàn tất và có xác nhận rõ ràng từ Kenji.

## Ghi chú
- Đoạn Kenji ở Phòng 6 ("Kenji & gói") hiện vẫn là placeholder
  `[KENJI VIẾT — chờ 3-4 câu quan sát 10 năm về tuổi 7-14]` — phải điền
  trước bước 5, không được bỏ qua.
- `[X ngày]` xuất hiện ở Phòng 5 (quy trình) và FAQ #5 — cần điền số ngày
  giao hàng thật, lấy từ năng lực thật của Kenji, không đoán.
- File liên quan: `src/config/khamPhaLaunch.ts`,
  `src/pages/an-pham-ban-sac-kham-pha.tsx`,
  `src/components/landing-kham-pha/*.tsx`.
