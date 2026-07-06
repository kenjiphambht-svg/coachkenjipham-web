# 11_DESIGN_SYSTEM_DECISION_LOG.md
Đường dẫn repo: docs/brand/design-system/11_DESIGN_SYSTEM_DECISION_LOG.md
Phiên bản: v1.1 — 06/07/2026. File sống — quyết định mới ghi tại đây kèm ngày. Khi tài liệu mâu thuẫn, file này + FOUNDER_VISUAL_DECISION_SUMMARY.md thắng.

## 1. ĐÃ CHỐT

1. (06/07) **Light-led premium**: website dẫn bằng sáng (trắng/ivory/kem); đen chỉ là dark silence section + footer; không trang public nào dark toàn trang. Đây là **quyết định visual cuối cùng trước beta** — mọi ý mới ghi vào backlog "v2 sau beta", không thi hành trước beta.
2. (06/07) **No brown**: cấm mood nâu/sepia/chocolate/muddy beige/amber-heavy trên web và trên mọi ảnh AI (Flux/LoRA) sau này.
3. (06/07) Tỉ lệ toàn trang: 65–75% light/cream — 15–25% black silence — 5–10% vàng.
4. (06/07) Cream chính = #F1EFE8; đen chính = #1A1A1A (lý do ở file 03 mục 1).
5. (06/07) Rule vàng: "vàng là dấu lặng" — một nút vàng đầy/trang; vàng chỉ hairline, small label, hover, một CTA, dấu nhấn nhỏ. #8A6D1F là deep gold utility, không làm mood.
6. Palette kế thừa nguyên hex hệ cũ; logic hai sắc vàng giữ nguyên.
7. Display font: Cormorant Garamond — không bàn lại.
8. Radius: 0px public; Hạt Mầm cho phép 2–4px tiết chế; admin 6–8px. No shadow ở public. (Chốt theo mode như file 05.)
9. Copy cũ chứa "chữa lành"/"FCP" nêu tên: archive; câu thay thế ở file 02 mục 9.
10. Định vị mở rộng thêm tệp phụ huynh; AI-native chỉ nói ở tầng vận hành/đối tác.
11. Zip design system cũ = archive tham khảo ngoài repo, không phải luật; asset copy có chọn lọc ở migration Phase 2.
12. Chữ ký Kenji chỉ dùng ở nội dung Kenji duyệt từng bản (file 07 mục 3).

## 2. CÒN MỞ — cần Kenji chốt

| # | Câu hỏi | Khuyến nghị | Chốt |
|---|---|---|---|
| 1 | Font body cuối: DM Sans hay Inter? | DM Sans cho public + ấn phẩm; Inter cho admin. Xác nhận hiện trạng ở token audit (migration Phase 3) rồi chốt | ☐ |
| 2 | Logo header dùng bản nào? | wordmark minimal (hoặc inline) — chốt khi xem preview Phase 4 re-light | ☐ |
| 3 | Favicon production? | Xuất từ SVG monogram, bộ 4 file (file 07 mục 4) | ☐ |
| 4 | Ảnh Kenji thật/AI-assisted? | Ảnh THẬT cho mọi vị trí niềm tin; ảnh AI chỉ minh họa trừu tượng không-người, sau khi có image system, kế thừa luật no-brown | ☐ |
| 5 | **Ebook/Ban-Sac-Hat-Mam-Shi trong zip cũ là dummy hay case thật?** | Kenji xác nhận. Chưa xác nhận = xử lý như dữ liệu khách, không vào repo | ☐ |

## 3. Việc 7 ngày tới

- [ ] Docs-only PR: đưa bộ v1.1 (14 file) vào docs/brand/design-system/ (prompt sẵn ở PROMPT_FOR_CODEX file).
- [ ] Asset inventory PR (migration Phase 2): logo/favicon/chữ ký sạch vào public/brand/.
- [ ] Claude Code: token audit (Phase 3) — kèm xác nhận font hiện trạng cho quyết định mở #1.
- [ ] Kenji trả lời 5 câu mục 2 (một tin nhắn 5 dòng là đủ).
- [ ] Xếp lịch chụp chân dung — ảnh ban ngày, ánh sáng tự nhiên, nhìn ống kính (nút chặn của mọi trang niềm tin).

## Luật của file
Quyết định mới: thêm vào mục 1 kèm ngày. Mục 2 chốt xong chuyển lên mục 1. Không quyết định visual nào "chốt miệng" trong chat mà không ghi vào đây.
