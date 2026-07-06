# Phase 0 — Route & Source Audit

Mục tiêu: audit toàn bộ route và source hiện có trước khi bắt đầu Phase 1 — Homepage V2. Chỉ nhìn, không sửa (đúng luật `BACKLOG.md`).
Trạng thái: **Completed.**

## Migration Strategy

- Current live routes remain online during rebuild.
- `/kidbook` remains the active live sales funnel until the new Bản Sắc Hạt Mầm landing and payment flow are fully built, QA-passed, and Kenji-approved for migration.
- `/thanh-toan-goi-1` and `/thanh-toan-goi-2` remain untouched until a dedicated payment/noindex task.
- `/ai-startup` remains online as credibility/partner dossier until redesigned or repositioned later.
- New website routes are built in parallel through branches and preview PRs.
- No redirect/cutover happens without explicit Kenji approval.

## 1. Executive Summary

Repo đang chạy 6 route thật: `/` (stub "Coming Soon"), `/kidbook` (funnel bán hàng thật, đang sống), `/ai-startup` (dossier đối tác), 2 trang thanh toán (`/thanh-toan-goi-1`, `/thanh-toan-goi-2`), và `/404`. Toàn bộ mang visual "Dark warm premium" — nền gần đen ám nâu (`#100f0c`, `#1a1510`), vàng ấm cũ (`#c9a84c`, `#8a6820`) — **lệch hoàn toàn** với quyết định mới "Light-led premium, no brown". Homepage thật (theo spec 8 section File 04) **chưa tồn tại** — trang chủ hiện chỉ là màn hình tạm dẫn thẳng sang `/kidbook`. `/kidbook` đang là funnel doanh thu thật (Tally form → 2 trang thanh toán → Zalo xác nhận tay) nên tuyệt đối chưa được đụng/redirect. Repo chưa có `robots.txt`/`sitemap.xml`/cơ chế `noindex` nào — 2 trang thanh toán đang **thiếu noindex**, một gap thật so với chính sách. Phát hiện kỹ thuật quan trọng nhất: homepage và các trang legacy đang **dùng chung một bộ CSS variable** (`--gold`, `--ink`, `--cream`, `--dark-section`...) — nếu Homepage V2 đổi thẳng các biến này sẽ vô tình "sơn lại" cả `/kidbook` và trang thanh toán, vi phạm luật không đụng route đó.

## 2. Current Routes Inventory

| Route | Source file | Role hiện tại | Role mong muốn (File 02) | Action đề xuất |
|---|---|---|---|---|
| `/` | `src/pages/index.tsx` | Stub "Coming Soon", 1 CTA sang `/kidbook`, dark warm premium | Hành lang dẫn chuyện, định tuyến 2 cửa (spec File 04) | **rebuild** (Phase 1) |
| `/kidbook` | `src/pages/kidbook.tsx` | Funnel bán hàng thật đang sống (Mini Ebook, 2 gói giá, Tally form) | Legacy — giữ nguyên đến khi audit xác nhận an toàn | **do not touch** |
| `/ai-startup` | `src/pages/ai-startup.tsx` | Dossier AI đầy đủ, route độc lập, không link từ đâu | Giữ, hạ xuống chỉ 1 dòng footer, không phải CTA phụ huynh | keep (nội dung); **redirect nav later** — chỉ cần hạ vị trí liên kết khi có Homepage V2 |
| `/thanh-toan-goi-1` | `src/pages/thanh-toan-goi-1.tsx` | Trang xác nhận thanh toán thật (VietQR G1.jpg, 2.000.000đ) | Payment route — noindex bắt buộc | **do not touch nội dung**; **noindex later** (task riêng, cần Kenji duyệt rõ) |
| `/thanh-toan-goi-2` | `src/pages/thanh-toan-goi-2.tsx` | Trang xác nhận thanh toán thật (VietQR G2.jpg, 3.500.000đ) | Payment route — noindex bắt buộc | **do not touch nội dung**; **noindex later** |
| `/404` | `src/pages/404.tsx` | Trang lỗi mặc định, style khác hẳn brand (gray, không theo token) | Utility/error route | keep |
| `/api/hello` | `src/pages/api/hello.ts` | Stub API từ template khởi tạo, không dùng | Utility route | keep (không đụng) |

**Route trong Master Plan chưa tồn tại trong repo (greenfield hoàn toàn):** `/ve-kenji`, `/ve-essence`, `/phuong-phap`, `/ban-sac-cua-con`, `/an-pham-ban-sac-hat-mam`, `/goc-doc`, `/dieu-essence-khong-hua`, `/chinh-sach-rieng-tu`, `/lien-he`, `/an-pham/[random-slug]`, `/admin/*`.

## 3. Homepage Audit

**Hiện trạng:** `src/pages/index.tsx` là một màn hình "Coming Soon" đơn — không có 8 section theo File 04, không dùng component riêng nào ngoài `SEO` + `useMistFadeIn`. Toàn bộ màu là hex cứng viết tay (`bg-[#100f0c]`, `text-[#c9a84c]`, `text-[#8a6820]`, `text-[#f2ead8]`) — không dùng token CSS variable đã có sẵn trong `globals.css`. Font: `font-serif` (Cormorant Garamond) cho logo/copy, Inter mặc định cho nhãn uppercase.

**Điểm đúng:** Có sẵn asset wordmark/monogram SVG dùng được; có hook `useMistFadeIn` cho hiệu ứng mờ dần nhẹ — đúng tinh thần "hơi thở" nếu áp dụng đúng mực; giữ Inter đúng Font Decision.

**Điểm lệch:** Nền đen phủ 100% màn hình (vượt xa ngưỡng cho phép 15–25%); toàn bộ hex dùng (`#100f0c`, `#c9a84c`, `#8a6820`, `#f2ead8`) đều **ngoài danh sách palette 4 nhóm mới** (`#FFFFFF/#FAF9F7/#F1EFE8/#1A1A1A/#E0C068/#8A6D1F`); không có cấu trúc 8 section; hero hiện tại không nói trạng thái người đọc mà chỉ là "Coming Soon" chờ.

**Rủi ro:** Đây không phải "chỉnh sửa" mà là **xây lại từ đầu** — không có gì trong trang hiện tại đạt chuẩn spec File 04 để giữ lại nguyên trạng.

**Đề xuất phạm vi Homepage V2:** Rebuild toàn bộ `index.tsx` + component mới riêng cho homepage theo 8 section File 04 và palette `UPDATED_COLOR_AND_PAGE_RULES_FOR_CODEX.md`. **Quan trọng:** không sửa định nghĩa các CSS variable hiện có trong `globals.css` (xem mục 9) — nếu cần token màu mới, thêm biến mới song song (ví dụ `--ivory`, `--charcoal-2026`, `--gold-accent-2026`), không ghi đè `--gold`/`--ink`/`--cream`/`--dark-section` đang được `/kidbook` và 2 trang thanh toán dùng trực tiếp.

## 4. Kidbook / Bản Sắc Hạt Mầm Audit

**Hiện trạng:** `/kidbook` chính là funnel Bản Sắc Hạt Mầm **đang chạy thật**, dù đặt sai route so với master plan (`/an-pham-ban-sac-hat-mam`). Có Product schema với 2 gói giá thật (2.000.000đ / 3.500.000đ), 2 CTA nối thẳng Tally form ngoài (`tally.so/r/1ANjJ4`, `tally.so/r/Y5J2VN`), và liên kết 2 chiều với `/thanh-toan-goi-1` và `/thanh-toan-goi-2`.

**Rủi ro:**
- Route policy File 02 nói rõ: **"KHÔNG redirect khi chưa kiểm payment/product flow đang chạy trên đó"** — audit này xác nhận flow đó có thật và đang sống → chưa redirect được.
- Vài đoạn copy cần soi kỹ dưới `CHILD_LANGUAGE_RULES.md` ở Phase 2 (chỉ ghi nhận, không kết luận vi phạm): "Con bướng bỉnh — là con đang hư hay đó là cá tính?" (gần biên giới gán nhãn tính cách); Chương 5 "Lời hồi đáp từ tương lai... khi con đã bước sang tuổi thứ 7" (một hình thức viết tương lai giả định cho bé cụ thể, ranh giới mong manh với "không dự đoán tương lai").
- Dữ liệu bé (tên, ngày giờ nơi sinh) thu qua Tally form **ngoài repo** — repo không chứa dữ liệu khách, an toàn về mặt "không commit dữ liệu khách", nhưng việc Tally có tuân luật lưu trữ/xóa theo yêu cầu (File 09) là câu hỏi vận hành ngoài phạm vi code.

**Đề xuất:** Giữ nguyên tuyệt đối trong Phase 0–1. Việc "audit quan hệ kidbook/landing mới" và cân nhắc chuyển đổi để ở Phase 2, sau khi có kế hoạch migration cụ thể (không tự động redirect).

## 5. AI Startup Route Audit

**Hiện trạng:** `src/pages/ai-startup.tsx` là một dossier đầy đủ (roadmap, business model, tech stack Claude/GPT/Gemini/Bedrock) — route độc lập, hiện **không có link nội bộ nào trỏ tới nó** (homepage stub chỉ link `/kidbook`), nhưng route vẫn public/index và có logic riêng trong `_app.tsx` (ẩn nút Zalo nổi khi ở trang này) — cho thấy route được biết và chủ ý giữ sống.

**Đề xuất:** Giữ nguyên làm credibility/partner dossier — đúng vai trò route policy quy định ("giữ, hạ xuống footer", SEO: index). Không cần noindex. Chỉ cần khi Homepage V2 ra mắt, đảm bảo liên kết duy nhất tới `/ai-startup` nằm ở một dòng nhỏ trong footer (theo File 04 mục 2.8), không ở menu/nav chính hay CTA lớn — hiện tại route chưa hề bị lộ ra nav nào nên rủi ro thấp.

## 6. Payment Pages Audit

**Danh sách:** `/thanh-toan-goi-1` (`src/pages/thanh-toan-goi-1.tsx`), `/thanh-toan-goi-2` (`src/pages/thanh-toan-goi-2.tsx`).

**Rủi ro:** Đây là luồng doanh thu thật đang vận hành (VietQR tĩnh + xác nhận tay qua Zalo, khớp Decision Log #8 và #7). Sửa sai có thể làm gãy đơn hàng thật hoặc gây nhầm lẫn số tiền/nội dung chuyển khoản.

**Gap thật phát hiện:** Cả 2 trang hiện **không có noindex** — vi phạm route policy (File 02: payment routes phải noindex). Đây là điểm cần sửa nhưng **không nằm trong phạm vi Phase 0/1**.

**Quy tắc không đụng:** Không sửa nội dung, giá, QR, flow của 2 trang này trong bất kỳ PR nào chưa được Kenji giao rõ ràng — kể cả việc thêm thẻ `noindex` cũng phải là một task riêng, tách khỏi Homepage V2, có approval tường minh (đúng AGENTS.md: "Do not touch payment... unless explicitly asked").

## 7. SEO / Privacy / Noindex Audit

**Hiện trạng:** Repo **không có** `robots.txt`, **không có** `sitemap.xml`. Có 1 component SEO dùng chung (`src/components/SEO.tsx` + `SEOElements` trong `_document.tsx`) quản lý title/description/OG/Twitter — nhưng **chưa có tham số hay cơ chế `noindex`** nào được implement trong component này.

**Route cần index sau khi build:** `/`, `/kidbook` (tạm), `/ai-startup`, và toàn bộ route public tương lai (`/ve-kenji`, `/phuong-phap`, `/ban-sac-cua-con`, `/an-pham-ban-sac-hat-mam`, `/dieu-essence-khong-hua`, `/chinh-sach-rieng-tu`, `/lien-he`, `/goc-doc`).

**Route cần noindex sau:** `/thanh-toan-goi-1`, `/thanh-toan-goi-2` (hiện tại đang thiếu — gap thật), và toàn bộ `/an-pham/[slug]` + `/admin/*` khi được xây (Phase 3, 5).

## 8. Recommended Next PR

Phase 0 đã đủ dữ liệu để bắt đầu Phase 1. Đề xuất **2 PR tách nhau**, không gộp:

**PR đầu tiên (khuyến nghị bắt đầu):**
- **Branch:** `feature/homepage-v2`
- **Scope:** Chỉ `src/pages/index.tsx` + component mới tạo riêng cho homepage (ví dụ `src/components/homepage/*`) + thêm token màu mới **song song** vào `globals.css`/`tailwind.config.ts` (không đổi biến cũ)
- **Files allowed:** `src/pages/index.tsx`; file component mới trong `src/components/homepage/` (hoặc tương đương); bổ sung (không sửa/xóa) biến mới trong `src/styles/globals.css` và `tailwind.config.ts`
- **Files forbidden:** mọi file trong mục 9 dưới đây
- **QA cần chạy:** `git status --short`, `git diff --check`, `git diff --name-status`, checklist File 04 mục 6 + File 13 nhóm 1/2/4/5/6/8/10; build (`npm run build`) chỉ khi Kenji duyệt chạy

## 9. Do Not Touch List

- `src/pages/kidbook.tsx` và mọi asset nó dùng (`public/b1.png`, `public/nd1.png`, `public/klp.jpg`, `essence-wordmark-*`)
- `src/pages/thanh-toan-goi-1.tsx`, `src/pages/thanh-toan-goi-2.tsx` và QR (`public/G1.jpg`, `public/G2.jpg`)
- `src/pages/ai-startup.tsx`
- **Định nghĩa các CSS variable hiện có** trong `src/styles/globals.css`: `--gold`, `--gold-brand`, `--gold-deep`, `--ink`, `--cream`, `--cream-light`, `--cream-muted`, `--dark-section`, `--body-text` — vì `/kidbook` và 2 trang thanh toán phụ thuộc trực tiếp; Homepage V2 phải dùng token **mới, tên khác**
- `package.json`, `package-lock.json`, mọi file config (`next.config.mjs`, `tailwind.config.ts` phần ngoài việc bổ sung token mới)
- `src/pages/_app.tsx`, `src/pages/_document.tsx` (script Softgen monitoring có ghi chú "CRITICAL: DO NOT REMOVE")
- `src/components/FloatingZaloButton.tsx`, `src/components/MistFadeProvider.tsx`, `src/hooks/useMistFadeIn.ts` (dùng chung toàn site)
- Deployment settings, mọi route private/publication tương lai khi được tạo
