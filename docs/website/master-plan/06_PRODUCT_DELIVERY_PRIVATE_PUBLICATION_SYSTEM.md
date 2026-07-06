# 06_PRODUCT_DELIVERY_PRIVATE_PUBLICATION_SYSTEM.md
Mục tiêu: thiết kế hệ giao ấn phẩm riêng tư (private reading room) — nơi khách nhận sản phẩm.
Người đọc chính: Codex/Claude Code (build), Kenji (hiểu để duyệt), người vận hành giao hàng.

## 1. Private reading room là gì (giải thích cho Kenji)

Là một trang web riêng cho từng khách tại `/an-pham/[random-slug]` — như một phòng đọc có chìa khóa riêng: chỉ ai cầm đúng link mới vào được, Google không biết phòng này tồn tại. Trong phòng: bản HTML đọc đẹp trên điện thoại + nút tải PDF A5 (đã tạo sẵn lúc sản xuất, không tạo lúc khách bấm — quyết định đã chốt) + vài dòng hướng dẫn cách đọc + cách liên hệ nếu có lỗi.

## 2. Vì sao từng luật tồn tại

- **Random slug** (ví dụ /an-pham/k7x9-mua-thu-3f2a): link không đoán được. Slug theo tên bé (/an-pham/be-minh-anh) vừa đoán được vừa lộ danh tính trẻ ngay trên URL — cấm.
- **Noindex + không vào sitemap.xml:** bảo Google "đừng ghi phòng này vào danh bạ". Thiếu nó, ấn phẩm của một em bé có thể hiện trên kết quả tìm kiếm — sự cố nghiêm trọng nhất hệ có thể gặp.
- **Không dùng client-side password giả:** kiểu hộp mật khẩu bằng JavaScript trong trang chỉ là tấm rèm — ai xem mã nguồn trang là thấy nội dung. Nếu cần mật khẩu, phải kiểm tra ở phía máy chủ (server-side) — người gác cửa đứng ngoài phòng, không phải tấm bảng "xin đừng vào" dán trong phòng.

## 3. Ba mức bảo mật

| Mức | Cơ chế | Đủ cho | Ghi chú |
|---|---|---|---|
| MVP | Random slug (≥ 16 ký tự ngẫu nhiên) + noindex + không liệt kê ở đâu | 10 khách beta | Chấp nhận rủi ro: ai được chuyển tiếp link đều đọc được — nói rõ điều này với khách |
| Tốt hơn | MVP + passcode kiểm tra server-side (gửi kèm email giao) + expires_at tùy chọn | Bán chính thức | Passcode riêng từng ấn phẩm, không dùng chung |
| Production-grade | Đăng nhập bằng magic link qua email + audit log truy cập + hết hạn/gia hạn | Khi có hàng trăm khách | Chỉ làm khi volume xứng đáng (Phase sau) |

Beta dùng mức MVP; nâng mức là việc của Phase 7.

## 4. Trải nghiệm khách (6 bước)

1. Nhận email/tin nhắn giao: lời dẫn ấm + link phòng đọc.
2. Bấm link riêng — mở được ngay trên điện thoại, không bắt đăng nhập (mức MVP).
3. Đọc online: đúng layout Shi, đúng 15 section, font tiếng Việt chuẩn.
4. Tải PDF A5 bằng một nút rõ.
5. Thấy khối "cách đọc bản này": đọc chậm, không cần đồng ý hết, ghi lại chỗ chạm và chỗ lạ.
6. Thấy cách liên hệ nếu link lỗi/hiển thị sai (kênh nhắn của Kenji).

## 5. Vòng đời trạng thái ấn phẩm

draft → kenji_review → ready → delivered → follow_up_sent → archived.
Luật chuyển: chỉ Kenji chuyển từ kenji_review → ready (đây chính là QA gate của M7); chỉ ready mới được giao; delivered tự động ghi delivered_at; archived sau khi hoàn tất follow-up + ghi VoC.

## 6. Data model gợi ý (bảng Publication)

| Field | Kiểu | Nhạy cảm | Ghi chú |
|---|---|---|---|
| publication_id | id | Không | Mã nội bộ, cũng dùng làm mã đơn đối soát |
| child_alias | text | CÓ | Biệt danh dùng trong ấn phẩm — không dùng họ tên khai sinh |
| parent_email | text | CÓ | Kênh giao |
| slug | text | CÓ (là chìa khóa) | Ngẫu nhiên ≥16 ký tự, unique |
| status | enum | Không | 6 trạng thái mục 5 |
| noindex | bool | — | Luôn true, có test tự động |
| created_at / delivered_at | time | Không | |
| expires_at | time | Không | Tùy chọn, mức Tốt hơn |
| review_by_kenji | bool + time | Không | Bằng chứng qua QA gate |
| feedback_permission_level | enum 1–4 | CÓ | Khớp docs/strategy/06 |

Nơi lưu bảng này: theo File 07 (Airtable ở mức MVP). Nội dung HTML/PDF thật của khách: lưu ở kho riêng tư (không phải repo GitHub của website).

## 7. Luật dữ liệu cứng

- Không commit output thật của khách (HTML/PDF/case) lên GitHub — kể cả repo private của website. Repo website chỉ chứa code + template + case dummy.
- Không lưu ngày giờ sinh của bé trong hệ website; dữ liệu intake sống ở kho intake (File 07), máy ấn phẩm đọc từ đó.
- Email giao hàng không đính kèm PDF nếu email đó còn chứa thông tin nhạy cảm khác — link phòng đọc là kênh chính.

## 8. QA trước khi giao (mỗi ấn phẩm)

- [ ] Đúng 15 section, đúng layout Shi, đúng giọng, 0 từ cấm (pre-QA máy).
- [ ] Kenji đã duyệt (status ready, review_by_kenji có timestamp).
- [ ] Link mở tốt trên điện thoại thật; PDF A5 tải được, mở được.
- [ ] Slug không chứa tên bé; trang trả về noindex (kiểm bằng response header/meta).
- [ ] Email giao đúng người nhận (đối chiếu publication_id ↔ parent_email) — lỗi giao nhầm là lỗi riêng tư nghiêm trọng nhất khâu này.

## Definition of Done
Một case dummy đi trọn: intake → sản xuất → kenji_review → ready → delivered; phòng đọc đạt cả 5 mục QA; test tự động xác nhận noindex cho mọi route /an-pham/*.

## Rủi ro cần tránh
- Framework tự thêm trang private vào sitemap.xml — phải có test chặn.
- Copy-paste nhầm link giữa hai khách khi giao tay — quy trình giao phải đọc lại publication_id trước khi gửi.
- Xem mức MVP là vĩnh viễn — ghi ngày xét nâng mức vào File 15.

## Prompt mẫu cho Codex
"Đọc docs/website/06. Branch: feature/private-reading-room. Scope: route /an-pham/[slug] + template phòng đọc + test noindex. Dùng case dummy trong repo, KHÔNG tạo dữ liệu khách. Xong: chạy QA mục 8 với case dummy, preview, phiếu 5 dòng. Không merge."
