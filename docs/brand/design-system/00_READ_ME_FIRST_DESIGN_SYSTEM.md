# 00_READ_ME_FIRST_DESIGN_SYSTEM.md
Đường dẫn repo: docs/brand/design-system/00_READ_ME_FIRST_DESIGN_SYSTEM.md
Phiên bản: 2026 **v1.1** — 06/07/2026. v1.1 = đã áp Founder Visual Decision (light-led premium, dark as silence, no brown) trực tiếp vào các file 03/05/08/10/11 — bộ này KHÔNG còn mâu thuẫn nội bộ; không cần đọc kèm patch nào khác. Hai file FOUNDER_VISUAL_DECISION_SUMMARY.md và UPDATED_COLOR_AND_PAGE_RULES_FOR_CODEX.md nằm cùng folder: một là biên bản quyết định gốc, một là bản thi hành chi tiết homepage.

## 1. Design system là gì (nói dễ hiểu)

Là **bộ luật hình ảnh** của thương hiệu: màu nào, chữ nào, khoảng cách nào, nút bấm trông ra sao, logo đặt đâu. Ẩn dụ: đồng phục + nội quy của một nhà hàng chuỗi — nhờ nó, chi nhánh nào (trang nào, ấn phẩm nào, ai/AI nào làm) trông cũng đúng là một nhà. Không có nó, mỗi AI làm một kiểu và website thành khu chợ.

## 2. Vì sao chuẩn hóa TRƯỚC khi làm ảnh AI (Flux/LoRA)

Luật hình ảnh AI chỉ là tầng trên của luật thương hiệu. Nếu chưa chốt "Essence trông thế nào" (màu, chất liệu, cảm giác), thì mọi prompt sinh ảnh là đoán mò — sinh 100 ảnh đẹp lẻ tẻ nhưng không thuộc về cùng một nhà. Chuẩn hóa xong, luật ảnh AI viết một lần dùng mãi. Thứ tự bắt buộc: **spec → code → ảnh**.

## 3. Ai cần đọc

Kenji (hiểu + quyết), Claude (chiến lược/QA nội dung), Claude Code (audit frontend), Codex (implement), designer/developer thật, automation/AI agent tương lai.

## 4. Thứ tự đọc

- Kenji: 00 → FOUNDER_VISUAL_DECISION_SUMMARY (2 phút) → 11 (5 câu còn mở) → 01 (audit). Còn lại tra khi cần.
- Codex/Claude Code: 00 → 09 (luật làm việc UI) → 03–06 (token/type/layout/component) → 08 (áp theo trang) → 10 (migration).
- Người viết luật ảnh AI sau này: 02 → 03 → 08.

## 5. Cách dùng khi giao task

Mọi task UI phải trích: file token liên quan (03–05), file component (06), file trang (08), và format task ở file 09. Task không trích spec = không làm.

## 6. Phân biệt 6 tầng (để không cãi nhau bằng cảm tính)

1. **Brand core** (file 02): Essence là ai, giọng gì — thay đổi chậm nhất.
2. **Design tokens** (03–05): màu/chữ/khoảng cách đặt tên chuẩn — như bảng vật liệu xây dựng.
3. **UI components** (06): nút, card, form — như cấu kiện đúc sẵn từ vật liệu trên.
4. **Asset/logo** (07): logo, chữ ký, favicon — tài sản có sẵn, chỉ dùng đúng chỗ.
5. **Image system** (viết sau, dựa trên bộ này): luật ảnh chụp + ảnh AI.
6. **Page application** (08): từng trang lắp các tầng trên theo mode nào.

## 7. Quy tắc gốc

- Spec trước, code sau, ảnh sau design system.
- **Không lấy file cũ trong zip làm luật nếu chưa được normalize** — zip là tham khảo; luật là bộ 2026 này. Điểm nào bộ này chưa nói, tra file 01 xem phần đó được xếp Keep/Update/Archive rồi hỏi Kenji nếu vẫn mơ hồ.
- Mâu thuẫn giữa tài liệu: file 11 (decision log) thắng, vì nó ghi quyết định mới nhất của Kenji.

## Checklist
- [ ] Bộ 12 file nằm ở docs/brand/design-system/ (PR docs-only, xem file 10).
- [ ] Kenji đọc xong 00, 01, 11 và chốt các quyết định mở.
- [ ] Mọi agent làm UI xác nhận đã đọc file 09 trước task đầu.

## Definition of Done
Một AI mới vào dự án, chỉ đọc bộ này, tạo ra được một section đúng brand mà không cần hỏi thêm câu nào về màu/chữ/khoảng cách.
