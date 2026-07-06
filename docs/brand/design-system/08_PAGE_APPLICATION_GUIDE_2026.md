# 08_PAGE_APPLICATION_GUIDE_2026.md
Đường dẫn repo: docs/brand/design-system/08_PAGE_APPLICATION_GUIDE_2026.md
Phiên bản: v1.1 — đã áp Founder Visual Decision (light-led, no brown).
Cách đọc: mỗi trang khai báo Mode (màu — file 03) / Chữ (file 04) / Component chính (file 06) / Ảnh / CTA / Cấm. Nội dung-copy của trang theo website plan (docs/website/03–05).

## 1. Homepage `/`
Mode: **Light-led premium with dark silence sections** (narrative corridor 1 cột). Section color map (bản đầy đủ: UPDATED_COLOR_AND_PAGE_RULES_FOR_CODEX.md):
1. Hero: ivory/white — không nút vàng, không nền đen. 2. Kenji: white xen ivory, light editorial. 3. Hai trạng thái tự nhận: cream. 4. Essence là gì: ivory. 5. Hạt Mầm: cream publication — **NÚT VÀNG DUY NHẤT CỦA TRANG**. 6. Điều Essence không hứa: **black — dark silence duy nhất giữa trang**, chữ #FAF9F7/#B4B2A9. 7. Ghi chép: ivory (trả lại ánh sáng). 8. Footer: black.
Chữ: display Cormorant + body DM Sans, chữ theo nền từng section. Ảnh: chân dung Kenji thật, ánh sáng ban ngày. Cấm: AI ở hero; nút vàng thứ hai; card đối tác trong lưới; hai section đen liền kề; mọi mood nâu/sepia.

## 2. /ve-kenji
Mode: Light editorial human (2-column editorial). Ảnh: chân dung + 1 ảnh đời thường; chữ ký một lần cuối trang. Câu chuyện thật nhưng có ranh giới (không kể chi tiết đời tư người khác). CTA: hai lối về cửa. Cấm: timeline thành tích kiểu LinkedIn; tôn xưng.

## 3. /ve-essence
Mode: Light editorial institutional. Component: step rows (hệ vận hành khái quát), boundary card, FAQ. Ảnh: 1 chân dung + sơ đồ hệ mức khái quát (không lộ ruột). CTA: email hợp tác (secondary, không vàng). Cấm: ngôn ngữ bán hàng nóng; chi tiết FCP/Casting/Gateway; số liệu nội bộ.

## 4. /ban-sac-cua-con
Mode: **Hạt Mầm warm parent** (nền background-warm chủ đạo). Chữ: như hệ, giọng "Ba mẹ thân mến". Component: 3-card grid độ tuổi (một active + hai "sắp mở"), trust card an toàn ngôn ngữ. Ảnh: minh họa ấm trung tính — KHÔNG ảnh trẻ em thật của khách, không ảnh stock trẻ em cười giả. CTA: landing Hạt Mầm. Cấm: trẻ con hóa (pastel kẹo, icon hoạt hình dày); mọi visual bói toán (cung hoàng đạo vẽ sao, quả cầu, bàn tay).

## 5. /an-pham-ban-sac-hat-mam
Mode: Hạt Mầm warm publication/product. Component: product mockup block (bản dummy), step rows quy trình, FAQ accordion, form intake, CTA block. CTA: một nút vàng "Đặt ấn phẩm". Điểm bảo mật hiển thị: khối "dữ liệu của con được giữ thế nào" đặt trước form. Cấm: đếm ngược/khan hiếm giả; ảnh bé thật; ngôn ngữ tiên đoán.

## 6. /goc-doc
Mode: Light editorial reading (reading width ≤72ch). Component: editorial card danh mục, quote đúng luật consent. CTA: một dòng mở cửa cuối bài. Cấm: sidebar dày; popup đăng ký; banner quảng cáo chính mình.

## 7. /dieu-essence-khong-hua
Mode: Trust/legal-warm — nền light, section đầu có thể là dark silence section — trang này là ứng viên đúng của khoảng lặng. Component: trust card list, boundary card. Chữ đối chuẩn contrast tuyệt đối (trang này mà khó đọc là tự phản bội thông điệp). CTA: lối về cửa, đặt nhẹ cuối. Cấm: giọng tự hào đạo đức; chữ mờ.

## 8. /chinh-sach-rieng-tu
Mode: Readable/legal — light, reading width, heading rõ từng khối, không trang trí. Component: bảng/danh mục đơn giản, mục lục neo. Cấm: tường chữ pháp lý không heading; thuật ngữ không giải thích.

## 9. Private reading room /an-pham/[slug]
Mode: Calm private warm — nền warm, chỉ logo nhỏ, không nav đầy đủ. Component theo file 06 mục 12. Ảnh: chỉ minh họa thuộc ấn phẩm. CTA: nút tải PDF duy nhất. Cấm: share button; analytics hành vi; hiện tên khai sinh; link chéo sang trang bán.

## 10. Backend/admin
Mode: Practical neutral — Inter, radius 6–8px, shadow nhẹ được phép, không cần brand token đầy đủ. Cấm: dành thời gian làm đẹp admin trong quý này (Airtable là admin).

## Quy tắc chung khi áp
Một trang một mode; chuyển mode giữa trang qua footer/hero có chủ đích; trang mới chưa có trong file này → thêm mục vào file này trước, build sau.

## Definition of Done
Mỗi trang khi build/PR khai báo mode ngay trong mô tả PR; QA (file 13 website plan + checklist các file 03–06) chạy theo đúng mode đã khai.
