# 04_IMAGE_QA_CHECKLIST.md
Đường dẫn repo: docs/brand/image-system/04_IMAGE_QA_CHECKLIST.md
Chạy cho MỌI ảnh trước khi public. Kết quả cuối: PASS public / PASS internal only / REGENERATE / REJECT.

## 1. Identity QA (ảnh có Kenji)
- Có giống Kenji thật không? (người quen nhận ra ngay)
- Có làm Kenji lệch tuổi quá không? (±5 tuổi = fail)
- Có mùi AI headshot không? (nền mờ vô hồn + da mịn + cười chuẩn = fail)

## 2. Trust QA
- Người xem có TIN được không? (test 5 giây với một người không biết dự án)
- Có giả quá không? (chi tiết nào lộ AI: chữ vô nghĩa, vật thể chảy, bóng sai)
- Có stock quá không? ("ảnh này có thể của bất kỳ công ty nào" = fail)

## 3. Design System QA (v1.1)
- Đúng light-led premium? (khung sáng chủ đạo; tối chỉ là điểm lặng)
- Nheo mắt: có ngả nâu/sepia/amber không?
- Có all-dark không?
- Có cháy sáng không? (trắng lâm sàng/washed out/mất bóng mềm = fail — light-led vẫn phải có chiều sâu)
- Gỗ trong ảnh có đọc thành nâu không? (Wood rule file 03 mục 3b)
- Vàng có quá một chi tiết nhỏ không?
- Đặt ảnh cạnh nền ivory/cream của trang: có hòa không hay chỏi?

## 4. Technical QA
Mặt (texture thật) — mắt (catchlight, không chết) — răng (đều tự nhiên, không phát sáng) — tay (đủ ngón/khớp đúng hoặc ngoài khung) — cổ áo/vải (không chảy) — nền (không vật thể lỗi, không chữ vô nghĩa) — ánh sáng (một nguồn hợp lý, bóng đúng chiều) — crop (đúng tỉ lệ vị trí, kiểm 360px) — file size (ảnh hero ≤ 300KB, ảnh thường ≤ 150–200KB sau nén) — định dạng WebP — alt text (mô tả thật, có định danh khi là chân dung: "Kenji Phạm — Essence Coach").

## 5. Ethical QA (fail một mục = REJECT, không bàn)
- Có giả case thật không? (dựng cảnh khách/phiên coaching/sự kiện)
- Có dùng trẻ em sai cách không? (mặt rõ; hoặc mờ nhưng vẫn đọc thành một em bé cụ thể)
- Người xem có thể tưởng đây là khách thật không?
- Có chứa dữ liệu riêng tư không? (trang ấn phẩm thật, tên, chữ viết tay thật của khách)
- Có thao túng cảm xúc phụ huynh không? (trẻ buồn/cô đơn kịch tính để gợi sợ)

## 6. Page-fit QA
- Ảnh này dùng ở trang/section nào? (phải trả lời được trước khi duyệt)
- Có cạnh tranh với CTA không? (mắt bị hút khỏi nút = fail)
- Có làm chữ khó đọc không? (nếu là nền chữ: đo contrast vùng đặt chữ)
- Có làm trang SANG HƠN không? (nếu bỏ ảnh mà trang không kém đi → bỏ ảnh)

## 7. Bảng điền từng ảnh

```markdown
| Ảnh (filename) | Identity | Trust | DS v1.1 | Technical | Ethical | Page-fit | Kết quả | Ghi chú |
|---|---|---|---|---|---|---|---|---|
| kenji-homepage-portrait-v01.webp | ✔/✘ | ✔/✘ | ✔/✘ | ✔/✘ | ✔/✘ | ✔/✘ | PASS public / PASS internal / REGENERATE / REJECT | |
```

Quy ước kết quả: **PASS public** (đủ 6 nhóm) · **PASS internal only** (đạt nhưng chỉ dùng tài liệu nội bộ/thử layout) · **REGENERATE** (hướng đúng, lỗi kỹ thuật — ghi rõ lỗi để chỉnh prompt/weight) · **REJECT** (sai hướng hoặc fail Ethical — không sửa, bỏ).
