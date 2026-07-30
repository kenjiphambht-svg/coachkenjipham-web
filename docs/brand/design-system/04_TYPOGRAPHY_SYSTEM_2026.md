# 04_TYPOGRAPHY_SYSTEM_2026.md
> **Governance status:** L4 — Implementation Evidence
> **Owner:** Kenji Phạm
> **Purpose:** Typography proposal, readability observations and implementation evidence.
> **Decision scope:** Evidence and QA observations. **Non-decision scope:** Canonical composition, font-family production approval or runtime implementation.
> **Still valid:** Vietnamese readability and implementation observations. **Outdated/superseded:** This file's font proposal and any claim above the canonical typography system.
> **Replacement:** [Canonical Typography Composition System](../essence-typography-composition-system-v1.md). The Lặng snapshot is L4 evidence, not authority above it.
> **Baseline evidence commit:** ead2eb75ae1da28f1cec8a2b9ac6f5cf52f419fc
> **Last verified:** PR #110 head; finalize at merge
> **Review:** Verify when used as evidence.
Đường dẫn repo: docs/brand/design-system/04_TYPOGRAPHY_SYSTEM_2026.md

> ⚠️ CẬP NHẬT 27/07/2026 (sau PR #90, brief bổ sung 4 việc): file này là bản
> đề xuất SOẠN TRƯỚC khi Kenji chốt hệ chính thức (xem dòng "chờ Kenji chốt"
> ở mục 2 — chưa bao giờ là luật đã ký). Nguồn chuẩn thật là
> `docs/brand/essence-typography-composition-system-v1.md` — file đó không
> cho số px cố định, chỉ cho QUY TẮC TỶ LỆ (mục 11: "Anchor = 45–65% Hero",
> "Signal lớn hơn Hero"). Số px THẬT đã được khóa khi `/lang-90` được duyệt
> (production, PR #89) — xem `src/components/lang-90/Lang90Composition.tsx`
> và `docs/website/LANG_90_TYPOGRAPHY_COMPOSITION_APPROVED_IMPLEMENTATION_SNAPSHOT.md`.
> Bảng mục 3 dưới đây đã sửa lại cho khớp bằng chứng thật (display desktop
> 52–64 → nâng trần lên 68, khớp `Lang90HeroComposition` dòng italic thứ 3
> `lg:text-[68px]`). Khi mục 3 và essence-typography-composition-system-v1.md
> mâu thuẫn, luôn ưu tiên file kia + code `/lang-90` thật, không phải bảng số
> tĩnh ở đây.

## 1. Hiện trạng

- Hệ cũ (zip): **Cormorant Garamond** (display) + **DM Sans** (body), weight 300/400/500, cấm bold 600+.
- Sản phẩm hiện tại: một số nơi có thể đang dùng **Inter** (cần Claude Code xác nhận trong token audit — file 10 phase 3).

## 2. Đề xuất chuẩn cuối

- **Display serif: Cormorant Garamond** — giữ, không bàn lại. Là chữ ký thị giác của Essence.
- **Body sans: DM Sans vs Inter** — phân tích:

| | DM Sans | Inter |
|---|---|---|
| Ưu | Ấm, tròn nhẹ, hợp giọng Đời; là di sản hệ cũ, đồng bộ toàn bộ asset/prototype cũ | Trung tính, cực bền cho UI/số liệu/form; hỗ trợ tiếng Việt rất chắc mọi weight; phổ biến nên render ổn định |
| Nhược | Ở size nhỏ + tiếng Việt dày dấu, kém "gọn" hơn Inter một chút; ít weight trung gian | Lạnh hơn, dễ trôi về "SaaS mặc định" — đúng thứ Essence tránh ở trang public |

- **Khuyến nghị (chờ Kenji chốt — file 11):** hai mode có chủ đích:
  - Website public + ấn phẩm Hạt Mầm: **Cormorant Garamond + DM Sans** (giữ hơi ấm thương hiệu; ấn phẩm cần chất "giấy" hơn chất "app").
  - Admin/backend + tài liệu nội bộ: **Inter** (thực dụng, không cần chất brand).
  - Lý do không dồn một font: public cần ấm, backend cần bền — ép một font làm cả hai sẽ hy sinh một đầu. Nếu Kenji muốn tối giản vận hành, phương án dự phòng là Inter toàn hệ, chấp nhận public lạnh hơn một bậc.

## 3. Type scale (đơn vị px ở desktop; mobile xem mục 7)

| Cấp | Font | Size/LH | Dùng |
|---|---|---|---|
| label | DM Sans 400 | 12/16, letter-spacing +0.08em, uppercase NGẮN | nhãn nhỏ, kicker |
| caption | DM Sans 300–400 | 13/20 | chú thích, metadata |
| body small | DM Sans 400 | 15/24 | ghi chú phụ, form hint |
| body | DM Sans 400 | 17/28 | văn bản chính |
| body large | DM Sans 300 | 20/32 | sapo, đoạn dẫn |
| subhead | Cormorant 400 | 24/32 | tiêu đề phụ |
| headline | Cormorant 400 | 34/42 | tiêu đề section (khớp `Lang90SectionHeading` desktop 42px thật; mobile thật đo được là 30px, không phải 34) |
| display | Cormorant 300–400 | 52–68/1.1 | hero — trần thật đã duyệt là 68px desktop (`Lang90HeroComposition`, dòng italic thứ 3, `lg:text-[68px]`), KHÔNG phải 64 |
| numeral | Cormorant 300 | 48+/1 | số trang trí (01, 02…) |
| price | Cormorant 400 | 28/36 | giá — serif để giá đọc như lời mời, không như bảng kê |

## 4. Quy tắc chữ

- Line-height: body ≥ 1.6; display 1.05–1.15; không line-height chật cho tiếng Việt (dấu chồng dòng trên).
- Letter-spacing: 0 cho body; +0.02–0.05em cho Cormorant size lớn nếu cần; **không tracking rộng cho chuỗi tiếng Việt dài** (dấu bị tách rời chữ, khó đọc).
- Weight: 300/400/500; **không bold 600+** (giữ luật cũ); nhấn mạnh bằng size/khoảng cách/serif, không bằng đậm.
- Italic: chỉ Cormorant italic cho trích dẫn/mantra; không italic đoạn dài; DM Sans không dùng italic.
- Không ALL-CAPS cho câu dài; uppercase chỉ ở label ≤ 3 từ.

## 5. Vietnamese readability rules

- Kiểm bộ ký tự dấu ("ữ ẫ ợ ề ẳ") ở MỌI weight/size dùng thật, cả hai font, cả PDF ấn phẩm.
- Heading Cormorant 300 ở size < 28px với tiếng Việt: nếu dấu mảnh khó đọc → nâng lên 400. Luật: thà nặng hơn một weight còn hơn mất dấu.
- Không tự động viết hoa đầu từ (title-case) cho tiếng Việt — dùng sentence case.

## 6. Mobile type rules

Display 31–34px (đỉnh thật đo trong `/lang-90`: 34px — dòng italic cuối Hero); headline/anchor 30px (đo thật `Lang90SectionHeading`, không phải 26–28 như bản cũ ghi); body giữ 17–18px (không bóp nhỏ hơn 16px); LH body mobile 1.65–1.72; độ dài dòng mục tiêu 60–75 ký tự (desktop) / tự nhiên theo màn (mobile).

## 7. QA checklist typography

- [ ] Đúng 2 họ font theo mode; 0 font khác lọt vào (grep font-family).
- [ ] 0 weight ≥ 600 trong code.
- [ ] Chuỗi kiểm dấu tiếng Việt render đúng ở label/caption/body/headline/display (screenshot dán PR).
- [ ] Không tracking dương trên đoạn tiếng Việt dài.
- [ ] Body mobile ≥ 16px, LH ≥ 1.6.
