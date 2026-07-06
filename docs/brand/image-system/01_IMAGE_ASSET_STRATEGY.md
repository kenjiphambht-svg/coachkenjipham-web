# 01_IMAGE_ASSET_STRATEGY.md
Đường dẫn repo: docs/brand/image-system/01_IMAGE_ASSET_STRATEGY.md

## 1. Vai trò của ảnh theo bề mặt

| Bề mặt | Ảnh làm gì | Mật độ |
|---|---|---|
| Homepage | MỘT chân dung Kenji (section 2) tạo niềm tin; có thể 1 atmosphere ở silence/chuyển nhịp | Rất thấp — trang chủ sống bằng chữ và khoảng trống |
| /ve-kenji | Chân dung editorial + 1 ảnh bối cảnh đời thường | Thấp |
| /ve-essence | 1 chân dung institutional + sơ đồ hệ (đồ họa, không phải ảnh AI) | Rất thấp |
| /ban-sac-cua-con | Atmosphere biểu tượng ấm (không mặt trẻ) | Thấp |
| /an-pham-ban-sac-hat-mam | Product mockup ấn phẩm (bản dummy) + 1 atmosphere ba mẹ đọc (không rõ mặt) | Trung bình |
| Private reading room | Chỉ minh họa thuộc ấn phẩm; không ảnh trang trí thêm | Tối thiểu |
| /goc-doc | 1 ảnh editorial/bài nếu cần; nhiều bài chỉ cần chữ | Thấp |
| Social | Editorial visual theo pillar + trích chữ trên nền token | Theo lịch |
| Newsletter | 1 ảnh đầu thư tối đa | Rất thấp |

## 2. Tám loại ảnh — luật từng loại

1. **Kenji AI-assisted editorial portrait** — Dùng: homepage, /ve-kenji, /ve-essence, OG. Không dùng: dựng cảnh sự kiện giả, quảng cáo dạng "ảnh đời thường chụp lén". Style: editorial, ánh sáng cửa sổ, nền ivory/cream/đen accent. Mức AI: LoRA mặt Kenji, art-direct kỹ. Rủi ro: da nhựa, lệch tuổi, AI headshot → QA file 04.
2. **Kenji contextual portrait** (đang ngồi làm việc, đọc, viết) — Dùng: /ve-kenji, pillar hậu trường, newsletter. Không dùng: giả "đang coach khách" (có người thứ hai như khách thật). Style: khung rộng hơn, nhiều không khí. Rủi ro: tay/đồ vật lỗi → ưu tiên khung giấu tay hoặc regenerate.
3. **Essence atmosphere** (không người: phòng đọc sáng, bàn, giấy, ánh nắng, vải kem) — Dùng: chuyển nhịp section, nền social, /goc-doc. Style: tĩnh vật tối giản, trắng/ngà/kem + một chi tiết đen hoặc vàng nhỏ. Mức AI: tự do nhất. Rủi ro thấp nhất — đây là "ngựa thồ" của hệ.
4. **Hạt Mầm product mockup** — Dùng: landing, social bán. Bản chất: ảnh trình bày ấn phẩm DUMMY (trang A5 trên bàn sáng). Không dùng: mockup từ trang ấn phẩm khách thật. Rủi ro: chữ trong mockup vô nghĩa kiểu AI → dùng khung chụp xa/nghiêng hoặc ghép trang dummy thật vào mockup.
5. **Parent/child symbolic atmosphere** — Dùng: /ban-sac-cua-con, landing (khối cảm xúc), social pillar 1–3. Luật cứng: **không mặt trẻ rõ** — bàn tay, dáng từ sau, bóng xa mờ, đồ vật tuổi thơ (giày nhỏ, tranh vẽ, đồ chơi gỗ sáng màu). Không dùng: mọi khung có thể đọc thành "em bé khách hàng". Rủi ro đạo đức cao nhất → QA Ethical bắt buộc.
6. **Reading room / private publication visual** — Dùng: trong phòng đọc riêng, email giao. Style: cực tĩnh, cream, một vật (tách, trang giấy). Không dùng: bất kỳ ảnh nào chứa thông tin case.
7. **Social/newsletter editorial visual** — Dùng: theo pillar; ưu tiên chữ trên nền token + atmosphere. Không dùng: meme, ảnh trend, carousel màu chói.
8. **Partner/institutional visual** — Dùng: /ve-essence, dossier. Style: chân dung điềm + đồ họa sơ đồ sạch. Không dùng: ảnh "startup team" giả (Essence là solo — giả đội ngũ là nói dối bằng ảnh).

## 3. Luật chung (mọi loại)

Không stock generic; không giả documentary; không giả khách thật; không trẻ em rõ mặt; không nâu/sepia; không all-dark; không ảnh nào cạnh tranh với CTA; mọi ảnh public đi qua workflow file 05 + QA file 04.

## Definition of Done
Mỗi bề mặt website/social có danh mục loại ảnh được phép rõ ràng; không ai phải tự đoán "ảnh này có được dùng ở đây không".
