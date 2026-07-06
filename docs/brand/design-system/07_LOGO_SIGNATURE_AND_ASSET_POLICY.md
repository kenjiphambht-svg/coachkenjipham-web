# 07_LOGO_SIGNATURE_AND_ASSET_POLICY.md
Đường dẫn repo: docs/brand/design-system/07_LOGO_SIGNATURE_AND_ASSET_POLICY.md
Nguồn: Essence Logo - Asset Pack trong zip (naming đã chuẩn: essence-{loại}-{light|dark}.{png|svg}).

## 1. Kho logo hiện có và khi nào dùng

| Loại | Dùng khi | Không dùng |
|---|---|---|
| monogram | Favicon nguồn, avatar social, dấu nhỏ trên ấn phẩm | Làm logo chính header |
| wordmark minimal | Header website (gọn) | Nơi cần đủ danh xưng VN |
| wordmark full VN | Tài liệu chính thức tiếng Việt, /ve-essence, PDF | Header (dài) |
| wordmark full EN | Ngữ cảnh quốc tế/đối tác EN | Trang tiếng Việt cho khách |
| wordmark inline | Header/nav khi cần một dòng | Footer lớn |
| footer logo | Footer các trang | Header |

Quy tắc nền: nền sáng dùng bản `-light`… LƯU Ý đặt tên của pack: hậu tố chỉ **phiên bản dành cho nền nào** — Claude Code kiểm bằng mắt một lần khi inventory (phase 2, file 10) và ghi chú lại chiều đúng, tránh cả hệ dùng ngược.

- SVG ưu tiên cho web (sắc ở mọi cỡ); PNG cho email/social/PDF.
- Khoảng thở quanh logo: tối thiểu bằng chiều cao chữ E của chính logo; không đặt logo lên ảnh nhiễu; không đổi màu logo ngoài 2 bản light/dark; không kéo méo.

## 2. Vị trí chuẩn theo bề mặt

- Homepage/nav: wordmark minimal hoặc inline, trái, cỡ khiêm tốn.
- Footer: footer logo + một dòng định danh.
- Ấn phẩm/PDF: monogram hoặc wordmark full VN ở bìa + trang cuối; trong ruột chỉ dấu nhỏ nếu cần.
- Social: monogram làm avatar; wordmark cho ảnh bìa.

## 3. Chữ ký Kenji

- Dùng ở: cuối thư/lá dẫn trong ấn phẩm ĐÃ được Kenji duyệt; trang /ve-kenji (một lần, như dấu con người); thư gửi khách mà Kenji thật sự đứng tên từng bản.
- Không dùng ở: nội dung tự động chưa qua duyệt từng bản; landing/quảng cáo; email hàng loạt; bất kỳ chỗ nào tạo cảm giác Kenji đích thân viết trong khi không phải. **Không giả chữ ký** — chữ ký là cam kết, lạm dụng là phá niềm tin và lệch M1.
- File: kenji-signature-black.png (nền sáng); cần bản cho nền tối → xuất thêm, không invert tự động.

## 4. Favicon

Nguồn từ monogram. Bộ tối thiểu: favicon.ico, icon-192.png, icon-512.png, apple-touch-icon.png. Kiểm hiển thị trên tab sáng/tối. (Zip chưa thấy bộ favicon xuất sẵn đầy đủ — đưa vào inventory phase 2; nếu thiếu, xuất từ SVG monogram.)

## 5. Cấu trúc thư mục trong repo

```
public/brand/logo/       ← chỉ SVG+PNG dùng thật, giữ nguyên tên pack
public/brand/signature/  ← chữ ký (chỉ bản dùng thật)
public/brand/favicon/    ← bộ favicon
```
Chỉ copy **có chọn lọc** từ zip — không đổ cả pack; bản không dùng ở lại archive ngoài repo.

## 6. Luật vệ sinh asset

- Không commit `__MACOSX/`, `.DS_Store`, file "Bản sao…", file state của tool (.design-canvas.state.json, _ds_bundle.js) — thêm vào .gitignore.
- Không tên file có dấu tiếng Việt/khoảng trắng trong public/ (URL dễ lỗi) — đổi kiểu `khong-dau-gach-noi`.
- Không asset trùng nội dung khác tên; một bản chuẩn, một nơi.
- Ảnh người/ảnh sản phẩm KHÔNG thuộc file này — thuộc image system (viết sau); riêng ảnh khách/trẻ em: cấm vào repo vô điều kiện.

## 7. QA asset checklist

- [ ] Mọi logo hiển thị đúng chiều nền (kiểm mắt từng bản một lần, chụp lại làm chuẩn).
- [ ] Không file rác/trùng/tên có dấu trong public/brand/.
- [ ] Favicon đủ bộ, hiện đúng trên tab sáng và tối.
- [ ] Chữ ký chỉ xuất hiện ở các vị trí mục 3.
- [ ] SVG không nhúng font lạ (mở kiểm một lần).
