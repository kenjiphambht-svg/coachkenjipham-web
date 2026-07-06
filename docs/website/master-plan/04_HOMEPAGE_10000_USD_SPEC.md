# 04_HOMEPAGE_10000_USD_SPEC.md
Mục tiêu: spec chi tiết duy nhất cho homepage. Nếu tài liệu khác lệch với file này về homepage, file này thắng.
Người đọc chính: Codex (build), Kenji (duyệt), designer.

## 1. Triết lý

Homepage KHÔNG phải menu dịch vụ. Nó là **hành lang dẫn chuyện**: khách bước qua từng nhịp, thở chậm lại, tự nhận ra mình, rồi tự chọn cửa. Ẩn dụ: khách sạn tốt không dí bảng giá vào mặt khách ở cửa — nó cho khách đi qua sảnh đủ đẹp để tự muốn ở lại.

## 2. Cấu trúc 8 section (thứ tự cố định)

1. **Hero — trạng thái con người.** Một câu đời thường mà người đọc tự thấy mình. Không từ "AI", không "hệ khai vấn", không nút mua. Nhiều khoảng trống. Kèm định danh nhỏ: Kenji Phạm — Essence Coach.
2. **Kenji như người thật.** Chân dung thật + 3–4 dòng + link /ve-kenji.
3. **Hai trạng thái tự nhận.** (a) Người lớn muốn hiểu mình — một đoạn cảm giác, một cửa. (b) Phụ huynh muốn hiểu con — một đoạn cảm giác, một cửa. Mô tả trạng thái, không mô tả dịch vụ.
4. **Essence là gì.** 2–3 câu, mức public: có cấu trúc, có ranh giới, không hứa phép màu. Link /phuong-phap.
5. **Bản Sắc Hạt Mầm — cửa active chính.** Nổi bật nhất trang về thị giác. Trạng thái thật ("Đang mở"). Link landing.
6. **Điều Essence không hứa.** 4–5 dòng "không", contrast đầy đủ, link trang đầy đủ. Đây là section khác biệt nhất — không được làm mờ.
7. **Ghi chép Essence — sắp mở.** Một dòng, trung thực.
8. **Footer.** Liên hệ, chính sách riêng tư, dòng đối tác lặng ("Dành cho đối tác & nhà tài trợ…" → /ai-startup, sau này /ve-essence).

## 3. Copy direction

- Không mở đầu bằng AI-native (AI chỉ được nhắc từ section 4 trở xuống, ở thế "phía sau, Kenji duyệt bản cuối" — hoặc không nhắc trên homepage).
- Không mở đầu bằng thuật ngữ hệ. Từ hệ (bản sắc, vòng lặp, kiểu gồng) chỉ dùng sau khi ngữ cảnh đời thường đã dọn đường.
- Câu trạng thái đời thường; giọng Đời — Lặng — Thức; xưng hô ấm, không "quý khách".
- Toàn trang qua danh sách từ cấm trước khi merge.

## 4. Visual direction

- Dark warm premium (giữ nền trầm hiện tại nhưng ấm hơn, tránh đen tuyệt đối trên diện rộng).
- Serif cho heading, sans-serif dễ đọc cho thân bài; font hiển thị dấu tiếng Việt chuẩn (kiểm chữ "ữ", "ẫ", "ợ" ở mọi weight).
- Contrast: thân bài ≥ 4.5:1, heading lớn ≥ 3:1 (WCAG AA) — đo bằng công cụ, không ước lượng bằng mắt.
- Mobile-first; hero không vỡ dòng xấu ở màn 360px.
- Ảnh Kenji thật; cấm stock image toàn trang.
- Chuyển động mức hơi thở: fade/translate ≤ 300ms, tôn trọng prefers-reduced-motion, không parallax mạnh, không auto-carousel.
- Hiệu năng: ảnh nén hiện đại (AVIF/WebP), lazy-load dưới màn đầu, đạt Core Web Vitals tốt trên 4G.

## 5. CTA hierarchy

- CTA chính (duy nhất dạng nút đầy, màu vàng thương hiệu): cửa Hạt Mầm (section 5, lặp lại cuối trang).
- CTA phụ (viền hoặc text-link): cửa người lớn, /phuong-phap, /ve-kenji.
- Đối tác: chỉ một dòng text ở footer. Không bao giờ là nút.
- Không popup, không sticky bar chèn ngang, không chat widget bật tự động.

## 6. Checklist QA homepage (chạy trước mỗi lần trình duyệt)

- [ ] Hero không chứa "AI", thuật ngữ hệ, lời hứa.
- [ ] Đúng 8 section, đúng thứ tự.
- [ ] Chỉ một CTA chính dạng nút đầy.
- [ ] Ảnh Kenji thật hiển thị đúng mọi breakpoint.
- [ ] Contrast đo đạt AA toàn trang.
- [ ] Từ cấm: quét toàn bộ text = 0.
- [ ] Mobile 360px: không tràn ngang, không chữ chồng.
- [ ] Section 6 (không hứa) đọc rõ, không chìm.
- [ ] Footer có dòng đối tác + link chính sách riêng tư.
- [ ] Lighthouse mobile: performance và accessibility đạt mức tốt.

## 7. Lỗi thường gặp và cách sửa

| Lỗi | Cách sửa |
|---|---|
| Hero nói ngôn ngữ hệ ("hệ khai vấn AI-native") | Thay bằng câu trạng thái người đọc; AI lùi khỏi màn đầu |
| Luồng đối tác lộ trên menu/lưới sản phẩm | Gỡ khỏi nav; một dòng footer |
| Chữ xám chìm trên nền đen | Nâng độ sáng chữ theo 3 bậc; đo contrast từng section |
| Nhiều nút vàng cạnh tranh nhau | Một CTA chính; còn lại hạ bậc |
| Ảnh stock hoặc không có mặt người | Chụp ảnh thật (xem File 15 — việc cần Kenji làm) |
| Trang "đẹp lúc rảnh mạng" nhưng ì trên 4G | Nén ảnh, bỏ hiệu ứng nặng, đo Core Web Vitals |

## Definition of Done
Toàn bộ checklist mục 6 pass; một người lạ mở trang trên điện thoại, cuộn 90 giây, trả lời được: Kenji là ai, trang này dành cho mình không, bước tiếp theo là gì.

## Rủi ro cần tránh
- "Nâng cấp thẩm mỹ" tự phát của AI làm lệch Brand Book — mọi thay đổi visual token phải qua duyệt.
- Sửa homepage nhiều vòng vụn vặt — gom sửa theo lô, mỗi PR một phạm vi.

## Prompt mẫu cho Codex
"Đọc docs/website/04 và docs/strategy/01_HOME_PREMIUM_REVIEW.md mục 5. Branch: feature/homepage-v2. Scope: chỉ homepage + component nó dùng. Copy: dùng file copy đã duyệt tại [đường dẫn], không tự viết. Làm xong: chạy checklist mục 6, xuất preview, trình phiếu 5 dòng. Không merge."
