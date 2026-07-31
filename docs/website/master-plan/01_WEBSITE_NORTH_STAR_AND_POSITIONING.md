# 01_WEBSITE_NORTH_STAR_AND_POSITIONING.md
> **Governance status:** L1 — Active with Patch
> **Owner:** Kenji Phạm
> **Purpose:** Website positioning principles.
> **Decision scope:** Human-first experience and professional boundaries. **Non-decision scope:** Any statement conflicting with current L0 public positioning.
> **Still valid:** Human-first framing, boundaries and no-guru principles. **Outdated/superseded:** Former organization suffix and incomplete public identity wording.
> **Replacement:** [Conflict Register](../../governance/CONFLICT_REGISTER.md), C-07.
> **Baseline evidence commit:** ead2eb75ae1da28f1cec8a2b9ac6f5cf52f419fc
> **Last verified:** fe0739d6d88ba8c9b9a1a6bc9b467bc0f22f5dae
> **Review:** Founder Decision trigger or 90 days.
Mục tiêu: định nghĩa "website trị giá 10.000 USD" trong hệ Essence nghĩa là gì, để mọi quyết định sau này có la bàn.
Người đọc chính: Kenji, rồi mọi người/AI làm dự án.

## 1. Website phục vụ ai — và không phục vụ ai

**Phục vụ (theo M8):**
- Người lớn đang tự hỏi về mình — cần được nhìn thấy, không cần bị phán.
- Phụ huynh có con 0–21 tuổi muốn hiểu con mà không dán nhãn con.
- Người thẩm định (đối tác, nhà tài trợ, báo chí) — qua lối riêng, không qua sảnh chính.

**Không phục vụ:**
- Người tìm tiên đoán, xem số, "giải mã toàn bộ con người".
- Người tìm liệu pháp y khoa/tâm thần — website phải chỉ rõ Essence không phải nơi đó.
- Người muốn khóa học làm giàu nhanh.
Website tốt đuổi đúng người cũng khéo như đón đúng người.

## 2. Cảm giác phải tạo — và không được tạo

Phải tạo: bước vào một không gian yên, có người thật đứng sau, mọi thứ rõ ràng và không ai ép mình. Người đọc thở chậm lại một nhịp.
Không được tạo: cảm giác đền thờ guru; cảm giác phần mềm SaaS lạnh; cảm giác chợ khuyến mãi; cảm giác bị đọc vị và bị bán.

## 3. Định vị public

- **Kenji Phạm** — Huấn luyện viên Tâm lý Chiều sâu, Essence Coach. Người sáng lập Essence Coaching. Một người thật, có hành trình thật, có ranh giới nghề rõ. Không là guru, không là nhà tiên tri, không là therapist, không là bác sĩ.
- **Essence Coaching** — tên thương hiệu, tổ chức và public entity chính thức. Mô tả public cụ thể ngoài C-07 phải do L0 hoặc task-provided approved copy cung cấp; tài liệu này không cấp phép dùng tên phương pháp hay giao thức làm public positioning.

## 4. Ghi chú lịch sử về AI-native

Các mô tả AI-native trong tài liệu cũ chỉ là evidence lịch sử, không phải public positioning hoặc chỉ dẫn copy hiện hành. Không dùng chúng làm title, bio, route copy hay CTA nếu L0 hoặc task-provided approved copy không yêu cầu rõ.

## 5. Năm câu hỏi website phải trả lời được

1. Kenji là ai? → /ve-kenji + mặt người thật trên homepage.
2. Essence là gì? → homepage section + /phuong-phap + /ve-essence.
3. Tôi nên bắt đầu từ đâu? → hai trạng thái tự nhận trên homepage, cửa Hạt Mầm active.
4. Tôi có thể tin hệ này vì điều gì? → /dieu-essence-khong-hua + quy trình review + hậu trường.
5. Dữ liệu của tôi/con tôi có được bảo vệ không? → /chinh-sach-rieng-tu + ghi chú bảo mật ngay trên form.

## 6. Mười nguyên tắc cảm giác premium

1. Mỗi màn hình một ý. 2. Khoảng trống là vật liệu chính. 3. Chuyển động chỉ ở mức hơi thở. 4. CTA ít nhưng đúng lúc. 5. Ảnh thật của Kenji, không stock. 6. Chữ đọc được (contrast đạt chuẩn, kể cả ngoài nắng trên điện thoại). 7. Không spiritual guru. 8. Không SaaS template lạnh. 9. Không over-design — bớt luôn thắng thêm. 10. Không bán bằng áp lực — không đếm ngược, không khan hiếm giả, không popup chèn ngang.

Bổ sung nguyên tắc 11 (tài liệu gốc chưa nhắc): **nhanh là một phần của sang**. Trang tải chậm phá cảm giác premium trước khi chữ đầu tiên kịp hiện. Chuẩn: đạt Core Web Vitals mức tốt trên 4G điện thoại tầm trung.

## 7. Definition of Done cho website $10k

- Trả lời trọn 5 câu hỏi ở mục 5 mà không cần ai giải thích thêm.
- Một phụ huynh lạ vào từ Facebook, trong 90 giây hiểu Hạt Mầm là gì, không phải gì, và biết bước tiếp theo.
- Không một từ cấm nào trên toàn site; qua trọn Child Safety QA (File 13).
- Đạt contrast AA, mobile mượt, Core Web Vitals tốt.
- Route riêng tư/payment noindex, không dữ liệu khách trong repo.
- Kenji nhìn tổng thể và nói được: "Đúng là mình."

## Rủi ro cần tránh
- Chạy theo đẹp mà quên 5 câu hỏi — website đẹp không trả lời được câu 3 là website trang trí.
- Định vị trôi dần theo trend content — mọi copy mới đối chiếu file này trước khi đăng.

## Prompt gợi ý cho Codex
"Đọc docs/website/01 và docs/strategy/01_HOME_PREMIUM_REVIEW.md. Trước khi build bất kỳ trang nào, xuất bản tóm tắt 10 dòng: trang này phục vụ ai, tạo cảm giác gì, CTA chính là gì. Chờ Kenji xác nhận rồi mới code."
