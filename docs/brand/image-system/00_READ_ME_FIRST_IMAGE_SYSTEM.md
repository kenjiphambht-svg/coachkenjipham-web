# 00_READ_ME_FIRST_IMAGE_SYSTEM.md
Đường dẫn repo: docs/brand/image-system/00_READ_ME_FIRST_IMAGE_SYSTEM.md
Phiên bản: v1.0 — 06/07/2026. Nền tảng: Design System v1.1 (light-led, dark as silence, no brown).

## 1. Vì sao Essence cần image system riêng

Với một thương hiệu coaching, **hình ảnh không phải trang trí — hình ảnh là niềm tin**. Khách quyết định "người này thật không, tin được không" bằng mắt trước khi đọc chữ đầu tiên. Một ảnh sai (da nhựa, ánh nâu studio giả, vibe guru) phá trong 2 giây thứ mà 10 trang copy xây. Vì Essence dùng ảnh AI (Flux + LoRA) làm hệ hình ảnh giai đoạn này, luật phải chặt gấp đôi: ảnh AI không được *nhìn giả* và không được *dùng để giả*.

## 2. Vì sao phải làm SAU Design System v1.1

Ảnh là tầng trên của luật thương hiệu. Chưa chốt palette (trắng/ngà/kem/đen/vàng, no brown) thì prompt Flux là đoán mò — sinh trăm ảnh đẹp lẻ mà không thuộc cùng một nhà. Giờ nền đã chốt, mọi prompt trong bộ này kế thừa thẳng token màu và cảm giác light-led.

## 3. Vị thế của ảnh AI trong hệ (điều kiện chuyển tiếp — đọc kỹ)

- Ảnh AI Kenji là **giải pháp giai đoạn** (chưa có điều kiện chụp bộ ảnh chuyên nghiệp), theo hướng **editorial** — đọc như ảnh tạp chí được art-direct, không giả tài liệu (không dựng "ảnh chụp tại workshop", "cùng khách hàng").
- Lộ trình nâng cấp ghi sẵn: một buổi chụp điện thoại + ánh sáng cửa sổ (chi phí ~0 đồng) có thể thay dần vị trí niềm tin cao nhất (/ve-kenji). Ảnh thật đạt chuẩn luôn thắng ảnh AI ở vị trí cùng vai trò.
- Quyết định này cập nhật mục mở #4 của Design System Decision Log: từ "ảnh AI chỉ trừu tượng" thành "ảnh AI editorial được phép có kiểm soát, theo bộ luật này".

## 4. Ai cần đọc

Kenji (tạo và duyệt ảnh), Claude (QA chiến lược), Claude Code (audit ảnh trong repo), Codex (đưa ảnh vào trang), designer/dev, automation/AI agent tương lai.

## 5. Thứ tự đọc

- Kenji: 00 → 02 (style guide chân dung) → 03 (prompt bank) → 05 (workflow) → 04 (QA khi duyệt).
- Codex/Claude Code: 00 → 06 (handoff) → 04 (QA) → 01 (chiến lược khi cần ngữ cảnh).
- Người viết prompt mới: 01 → 02 → 03.

## 6. Nguyên tắc vận hành

Design System trước — prompt sau — QA trước khi public — **không ảnh nào vào repo khi chưa qua trạng thái web-ready và chưa được Kenji duyệt** (workflow file 05). Ảnh và prompt là tài sản: prompt tốt lưu vào prompt bank, ảnh duyệt ghi vào inventory (file 07).

## 7. Năm luật hình ảnh (thuộc lòng)

1. **Light-led** — ảnh sáng, thoáng; tối chỉ là khoảng lặng có chủ đích.
2. **No brown** — không nâu/sepia/amber-heavy/coffee tone ở bất kỳ ảnh nào.
3. **Kenji như người thật** — texture da thật, ánh mắt thật, không AI headshot, không guru.
4. **AI không giả case thật** — không sự kiện giả, không khách giả, không trẻ em như case cụ thể.
5. **Ảnh phục vụ trải nghiệm đọc** — ảnh nhường chữ và CTA; ảnh nào tranh sân khấu với nội dung là ảnh sai.

## Definition of Done
Bất kỳ ai đọc xong bộ này: tạo được ảnh đúng hướng, loại được ảnh sai, và biết đường đi của một ảnh từ Flux đến website mà không cần hỏi thêm.
