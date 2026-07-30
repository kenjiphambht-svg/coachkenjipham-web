# 00_READ_ME_FIRST_IMAGE_SYSTEM.md
> **Governance status:** L3 — Active with Patch
> **Owner:** Kenji Phạm
> **Purpose:** Image-system entrypoint and workflow.
> **Decision scope:** Image ethics, workflow and production routing. **Non-decision scope:** A global replacement of FLUX.1.
> **L0 authority split:** Kenji portraits use FLUX.1 + Kenji LoRA. Non-Kenji imagery uses FLUX.2 Klein 9B.
> **Still valid:** Light-led, no-brown and image ethics. **Outdated/superseded:** Any reading that labels all FLUX.1 knowledge historical.
> **Replacement:** [Conflict Register](../../governance/CONFLICT_REGISTER.md) C-12; dedicated Portrait Production System is a follow-up task.
> **Baseline evidence commit:** ead2eb75ae1da28f1cec8a2b9ac6f5cf52f419fc
> **Last verified:** PR #110 head; finalize at merge
> **Review:** System/model trigger or 180 days.
Đường dẫn repo: docs/brand/image-system/00_READ_ME_FIRST_IMAGE_SYSTEM.md
Phiên bản: v1.0 — 06/07/2026. Nền tảng: Design System v1.1 (light-led, dark as silence, no brown).

## 0. CẬP NHẬT 24/07/2026 — TẦNG THỰC THI MỚI (ưu tiên cao hơn file 03)

Bổ sung 2 file mới, KHÔNG xoá nội dung cũ bên dưới:

- `08_ESSENCE_LIGHTSCAPE.md` — chuẩn thị giác "Essence Lightscape": nội thất
  tối giản, ánh sáng là nhân vật chính, rất ít vật thể, typography luôn là
  trung tâm.
- `09_PROMPT_MASTER_FLUX2_KLEIN_9B.md` — prompt master + cài đặt Draw Things
  cho model đã chốt **FLUX.2 [klein] 9B** (4 bước, Guidance 1, Shift 3, không
  Negative Prompt), kèm 5 light module chuẩn và template điền nhanh.

**Ưu tiên theo phạm vi:** với ảnh **không có Kenji**, file **08 + 09** thắng
phần prompt non-Kenji của file 03. Với ảnh **có Kenji**, FLUX.1 + Kenji LoRA
trong file 03 vẫn là tầng portrait production Active L3. File 03 giữ phần
non-Kenji làm kho tham khảo lịch sử; 08/09 là tầng thực thi non-Kenji hiện hành.

**Đọc trước khi thiết kế/tạo ảnh** (tầng chiến lược, ngoài image-system):
`docs/brand/ESSENCE_VISUAL_ARCHITECTURE.md` (Page Mode + Signal Moment + quy
trình 6 lớp — phải chốt TRƯỚC khi viết bất kỳ prompt nào) và
`docs/brand/ESSENCE_CREATIVE_GROWTH_COMPASS.md` (phân loại P0/P1/P2,
Definition of Done, cách báo cáo cho Kenji).

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
