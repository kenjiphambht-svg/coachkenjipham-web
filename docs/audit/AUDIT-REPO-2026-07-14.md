# AUDIT REPORT — coachkenjipham-web — 2026-07-14

Người thực hiện: Claude Code (Fable Mode). Mọi dòng đều có bằng chứng thật (lệnh đã chạy: `find`, `grep`, `git diff`, `gh pr`, `curl -L` lên production, `npm audit/outdated`, `next build`, `next lint`). Không suy đoán — chỗ nào không chắc ghi rõ "cần Kenji xác nhận".

---

## PHẦN 1 — HIỆN TRẠNG

### 1.1 — Route hiện có (Pages Router thuần, không có /app)

Tất cả 23 route dưới đây **ĐỀU ĐANG LIVE trên production** (curl -L `coachkenjipham.com/*` → HTTP 200, đã kiểm từng cái). Domain gốc 307 → `www.coachkenjipham.com` (bình thường). Site **KHÔNG có sitemap.xml, KHÔNG có robots.txt** (curl 404 + không có file trong repo).

| Route | Live? | noindex? | Ghi chú |
|---|---|---|---|
| `/` | ✅ 200 | ❌ index | Coming Soon cũ — GIỮ NGUYÊN theo lệnh Kenji |
| `/kidbook` | ✅ 200 | ❌ index | Funnel sống V1 — GIỮ NGUYÊN theo lệnh Kenji |
| `/ai-startup` | ✅ 200 | ❌ index | Route sống, đã rebuild PR #11 |
| `/thanh-toan-goi-1` | ✅ 200 | ⚠️ **KHÔNG có noindex — HỞ** | Vi phạm ROUTE_POLICY.md |
| `/thanh-toan-goi-2` | ✅ 200 | ⚠️ **KHÔNG có noindex — HỞ** | Vi phạm ROUTE_POLICY.md |
| `/chinh-sach-rieng-tu` | ✅ 200 | ❌ index | CỐ Ý — Kenji đã duyệt bỏ noindex 13/07 |
| `/trang-chu-v2` | ✅ 200 | ✅ | Homepage V2 nháp |
| `/ve-kenji` | ✅ 200 | ✅ | |
| `/phuong-phap` | ✅ 200 | ✅ | |
| `/ban-sac-cua-con` | ✅ 200 | ✅ | Hub trẻ em |
| `/ban-sac-cua-ban` | ✅ 200 | ✅ | Hub người lớn |
| `/an-pham-ban-sac-hat-mam` | ✅ 200 | ✅ | Landing V3 |
| `/an-pham-ban-sac-kham-pha` | ✅ 200 | ✅ | PREVIEW (PR #15 merged) |
| `/an-pham-ban-sac-giao-mua` | ✅ 200 | ✅ | PREVIEW (PR #16 merged) |
| `/ban-la-duy-nhat` | ✅ 200 | ✅ | PREVIEW |
| `/dau-an-cua-ban` | ✅ 200 | ✅ | PREVIEW |
| `/lang-90` + `/dat-phien` + `/xac-nhan` | ✅ 200 | ✅ (cả 3) | Chờ hotline + VietQR thật |
| `/lien-he` | ✅ 200 | ✅ | |
| `/dieu-essence-khong-hua` | ✅ 200 | ✅ | |
| `/404` | — | — | Trang lỗi |
| ~~`/api/hello`~~ | đã xóa hôm nay | — | Stub starter, 0 nơi gọi (Nhóm A) |

### 1.2 — Pull Requests

| PR | Trạng thái | Kết luận |
|---|---|---|
| #16 Giao Mùa | MERGED 14/07 | Xong |
| #15 Khám Phá | MERGED 14/07 | Xong |
| **#14 Lặng 90'** | **MERGED 13/07** | **Đã merge rồi** (câu hỏi "còn thiếu gì để merge" không còn áp dụng). Việc còn treo của Lặng 90' là NỘI DUNG, không phải PR: duyệt thông điệp khủng hoảng Câu 2=C + điền hotline, ảnh/STK VietQR thật, [X] ngày |
| **#8 homepage-polish-v2** | OPEN/draft | **Đề xuất CLOSE không merge.** Bằng chứng đã copy đủ: `git diff origin/feature/homepage-polish-v2 main` — mọi khác biệt đều là main MỚI HƠN branch (branch còn "0–6 tuổi" cũ, CTA trỏ `/kidbook` sai, card "Sắp mở" chưa có link, footer chưa có logo 2026). Không có dòng nội dung nào branch có mà main thiếu. Riêng `index.tsx`: branch thay thẳng trang chủ — main cố ý giữ Coming Soon, nội dung đã sang `/trang-chu-v2` |
| **#7 homepage-v2** | OPEN/draft | **Đề xuất CLOSE không merge** — là bản cũ hơn #8, cùng kết luận |
| #9–#13 | MERGED | Xong |
| #2 homepage-brand-hub-v1 | CLOSED không merge | Đã đóng từ trước, đúng |
| #1, #3–#6 | MERGED | Docs, xong |

### 1.3 — Route "mồ côi" (0 link nội bộ trỏ tới)

| Route | Tình trạng |
|---|---|
| `/thanh-toan-goi-1`, `/thanh-toan-goi-2` | 0 link nội bộ — chỉ vào được từ Tally form (external). Đúng thiết kế funnel kidbook, KHÔNG phải rác. Nhưng đang hở noindex (xem 2.6) |
| `/trang-chu-v2` | Chỉ 1 link nội bộ (logo header). Đúng — nó là bản nháp thay `/` sau này |
| Còn lại | Đều có ≥1 link nội bộ thật |

### 1.4 — Assets 2026

- **Nhất quán bộ 2026**: mọi trang mới (17 route từ trang-chu-v2 trở đi) dùng favicon PNG 2026 + `essence-og-1200x630.png` + logo `/brand/logo/*-2026*.svg`. ✅
- **Còn dùng asset CŨ (cố ý — route bảo tồn)**: `index.tsx` (Coming Soon), `kidbook.tsx`, `ai-startup.tsx` — dùng `essence-monogram-light.svg`, `og-image.png`, `essence-wordmark-inline-light.svg`. Giữ nguyên theo lệnh.
- ⚠️ **Lệch nhỏ**: `SEO.tsx` (dùng chung MỌI trang) vẫn inject favicon cũ `essence-monogram-light.svg` mặc định → trang mới hiện có **2 thẻ favicon** (SVG cũ + PNG 2026). Không hỏng gì nhưng không sạch — sửa thuộc Giai đoạn 2 (đụng component dùng chung).
- 4 file brand 2026 chưa dùng tới (`monogram-2026.svg`, `wordmark-full-vn-2026(-dark).svg`, `wordmark-inline-2026-dark.svg`) — là bộ dự phòng có chủ đích, KHÔNG phải rác.

---

## PHẦN 2 — AUDIT KỸ THUẬT

### 2.1 — Code chết (0 importer, đã xác minh bằng grep import-path)

Đã xóa hôm nay (Nhóm A, chi tiết ở Phần 3): `ThemeSwitch.tsx`, `contexts/ThemeProvider.tsx`, `skeleton/SkeletonSection.tsx`, `api/hello.ts`.

Còn lại — **`src/components/ui/` (shadcn): 45 component, chỉ ~12 được dùng thật** (accordion, button, dialog, dropdown-menu, input, label, separator, sheet, skeleton, toast, toggle, tooltip — một phần là ui import lẫn nhau). ~33 component 0 nơi dùng (calendar, carousel, command, drawer, form, menubar, table, tabs, v.v.). → Nhóm B: cần phân tích transitive kỹ trước khi xóa hàng loạt.

### 2.2 — Trùng lặp / bản nào sống

| Nhóm | Bản sống | Bản nháp/preview | Rác? |
|---|---|---|---|
| Homepage | `/` Coming Soon (V1) | `/trang-chu-v2` (V2) | Không có rác — V1 brand-hub đã đóng ở PR #2, không còn code trong main |
| Landing trẻ em | `/kidbook` (V1 funnel) | `/an-pham-ban-sac-hat-mam` (V3) | Không có V2 sót |
| Room* 3 bộ (hat-mam / kham-pha / giao-mua) | — | — | Trùng cấu trúc NHƯNG khác copy — cố ý theo chỉ thị "tái dùng layout". Không phải rác |

### 2.3 — Nhánh Git chết (chỉ liệt kê — Nhóm B, không tự xóa)

- **Remote đã merge, xóa được**: `docs/anti-rationalization-webperf`, `docs/fable-mode-skill`, `feature/lang-90`, `feature/landing-kham-pha-preview`, `feature/landing-giao-mua-preview` (5 nhánh).
- **Remote giữ lại tới khi close PR #7/#8**: `feature/homepage-v2`, `feature/homepage-polish-v2`.
- **Local đã merge, xóa được** (11): `chore/agent-skills-v1`, `chore/workshop-operating-system-v1`, `docs/anti-rationalization-webperf`, `docs/essence-systems-2026`, `docs/fable-mode-skill`, `docs/phase-0-route-source-audit`, `feature/ai-startup-rebuild-v1`, `feature/landing-giao-mua-preview`, `feature/landing-kham-pha-preview`, `feature/lang-90`, `fix/remove-legacy-color-tokens`.
- **Local mồ côi** (2): `chore/ai-operating-system` (bản trùng cũ của PR #1, chưa merge, chứa commit lịch sử QR/payment cũ), `feature/landing-hat-mam-v3` (PR #9 đã merged nhưng nhánh local còn stack commit cũ chồng homepage-v2). Cả 2 xóa được sau khi Kenji xác nhận không cần giữ lịch sử.

### 2.4 — Dependencies

- **Đã gỡ 14 gói không dùng** (Nhóm A, xác minh 0 import toàn repo kể cả config): `stripe`, `@stripe/stripe-js`, `@stripe/react-stripe-js`, `micro`, `framer-motion` (AGENTS.md cấm animation lib — chưa từng dùng), `@gsap/react`, `react-intersection-observer`, `react-error-boundary`, `@t3-oss/env-nextjs`, `zod`, `vercel` (CLI ~100MB không cần trong deps), `@hookform/resolvers`, `next-themes` (2 file duy nhất dùng nó là ThemeSwitch/ThemeProvider — đã chết), `@softgenai/element-tagger` (next.config có fallback tự nhận biết vắng mặt).
- **Kết quả**: lỗ hổng npm audit giảm **28 → 11** (high: 12 → 5). Build + lint pass sau khi gỡ.
- **Giữ lại**: `gsap` (mist effect `/kidbook` + `/`), 8 gói chỉ được ui/ chưa dùng tham chiếu (`date-fns`, `react-day-picker`, `embla-carousel-react`, `cmdk`, `input-otp`, `vaul`, `react-resizable-panels`, `react-hook-form`) — gỡ cùng đợt dọn ui/ (Nhóm B).
- **Lỗi thời**: toàn bộ Radix minor-outdated (vá được bằng `npm update`); **`next` 15.5.9 dính 2 advisory HIGH** (DoS qua Image Optimizer remotePatterns + RSC deserialization) → nâng next là ưu tiên (Nhóm B vì đụng framework).

### 2.5 — Build & Lint

- `next build`: ✅ pass, 23 trang static, 0 error.
- `next lint`: 0 error, **14 warning** — 6× `<img>` thay vì `next/image` (logo SVG nhỏ ở HomeHeader/HomeFooter/Room7Doors/Room6FAQKP/Room6FAQGM/ve-kenji — vô hại, chuẩn hóa sau) + 8× unused import trong `kidbook.tsx` (route bảo tồn, không đụng).

### 2.6 — SEO/an toàn: route thanh toán hở noindex

Rà **TOÀN BỘ** route trên production: chỉ đúng **2 route hở**: `/thanh-toan-goi-1`, `/thanh-toan-goi-2` (không có cái thứ 3). Cả hai đang live, KHÔNG noindex, vi phạm trực tiếp `docs/website/ROUTE_POLICY.md` ("thanh-toan-* must be noindex"). **Diff đề xuất** (chờ Kenji duyệt vì đụng route sống — thêm vào `<Head>` của từng file):

```diff
       <Head>
+        <meta name="robots" content="noindex" />
         {/* ...phần còn lại giữ nguyên... */}
```

Lưu ý thêm: site không có sitemap.xml/robots.txt — thời điểm này KHÔNG gấp (các trang nháp đều tự noindex), nhưng cần trước khi công khai Giai đoạn 2.

### 2.7 — Cấu trúc / dấu vết starter

- Đã xóa (Nhóm A): `logs/*.log`, `ecosystem.config.js`, screenshot rác trong `public/`, `api/hello.ts`. Thêm `logs/` vào `.gitignore`.
- Còn lại (Nhóm B): `.softgen/` (docs starter cũ — mô tả sản phẩm kidbook V1, có tí giá trị lịch sử); `package.json` name vẫn là `"softgen-starter"`; `next.config.mjs` còn loader Softgen + `images.remotePatterns: hostname "**"` (quá rộng — **liên quan trực tiếp advisory DoS HIGH của next**) + `allowedDevOrigins` softgen.dev; `vercel.json` còn redirect mẫu `/old-path → /new-path` (rác template); `docs/audit/REPO_AUDIT.md` nằm lẻ ngoài `docs/website/audits/` (gom về một chỗ).

---

## PHẦN 3 — DỌN DẸP

### Nhóm A — ĐÃ XÓA hôm nay (mỗi món có bằng chứng "chết" ghi ở trên)

| # | Đã xóa | Lý do xác nhận chết |
|---|---|---|
| 1 | `src/components/ThemeSwitch.tsx` | 0 importer toàn repo |
| 2 | `src/contexts/ThemeProvider.tsx` | 0 importer — không được gắn trong `_app.tsx` |
| 3 | `src/components/skeleton/SkeletonSection.tsx` | 0 importer — 6 trang khung đã thay nội dung thật |
| 4 | `src/pages/api/hello.ts` | Stub starter trả `{"name":"John Doe"}`, 0 nơi gọi |
| 5 | `public/A_nh_chu_p_Ma_n_hi_nh_2026-05-17….png` | Screenshot rác, 0 reference toàn repo |
| 6 | `logs/err.log`, `logs/out.log` + thêm `logs/` vào .gitignore | Log dev starter bị commit nhầm |
| 7 | `ecosystem.config.js` | Config PM2 chạy `npm run dev` — vô nghĩa trên Vercel |
| 8 | 14 npm package (danh sách mục 2.4) | 0 import toàn repo; verify lại bằng build+lint pass; audit 28→11 |

### Nhóm B — CHỜ KENJI DUYỆT (không tự làm)

| Việc | Trạng thái | Ưu tiên | Ghi chú |
|---|---|---|---|
| Gắn noindex cho `/thanh-toan-goi-1` + `/thanh-toan-goi-2` | Chờ Kenji duyệt | **Gấp** | Diff ở mục 2.6 — 1 dòng/file, route sống nên chờ duyệt |
| Nâng `next` 15.5.9 → bản vá mới + siết `images.remotePatterns` (bỏ hostname `"**"`) | Chờ Kenji duyệt | **Gấp** | 2 advisory HIGH đang mở; remotePatterns `**` chính là bề mặt tấn công của advisory DoS |
| Close (không merge) PR #7 và PR #8 | Chờ Kenji duyệt | Vừa | Bằng chứng đã copy đủ ở mục 1.2 — main mới hơn branch ở mọi điểm khác biệt |
| Xóa 5 nhánh remote đã merge + 11 nhánh local đã merge + 2 nhánh local mồ côi | Chờ Kenji duyệt | Vừa | Danh sách mục 2.3 — nhánh khó phục hồi hơn file nên chờ lệnh |
| Dọn ~33 component `ui/` không dùng + 8 gói npm chỉ ui/ tham chiếu | Chờ Kenji duyệt | Thấp | Cần phân tích transitive kỹ 1 lượt nữa lúc làm |
| Gỡ favicon cũ khỏi `SEO.tsx` (đang double-favicon trên trang mới) | Chờ Kenji duyệt | Thấp | Đụng component dùng chung với /kidbook — làm trong Giai đoạn 2 |
| Dọn dấu vết Softgen: `.softgen/`, đổi name package.json, dọn next.config loader + allowedDevOrigins, bỏ redirect mẫu trong vercel.json | Chờ Kenji duyệt | Thấp | Không hỏng gì, chỉ là vệ sinh |
| Gom `docs/audit/REPO_AUDIT.md` về `docs/website/audits/` | Chờ Kenji duyệt | Thấp | Nhất quán cấu trúc docs |
| Dựng sitemap.xml + robots.txt | Chờ làm | Vừa | Cần trước khi bỏ noindex hàng loạt ở Giai đoạn 2; điều kiện bật 'live' 2 trang preview cũng cần sitemap |

---

## BẢNG TỔNG (định dạng Airtable "Web & Backend")

| Việc | Trạng thái | Ưu tiên | Ghi chú |
|---|---|---|---|
| Audit toàn repo + báo cáo (file này) | Xong | Vừa | 23 route live kiểm production thật; PR #7/#8 xác nhận đã copy đủ; PR #14 đã merged 13/07 |
| Xóa 7 file chết + 14 gói npm không dùng (Nhóm A) | Xong | Vừa | Chi tiết Phần 3A; build+lint pass sau xóa; npm audit 28→11 lỗ hổng |
| Gắn noindex 2 route thanh-toan | Chờ Kenji duyệt | Gấp | Đang hở trên production, vi phạm ROUTE_POLICY; diff 1 dòng/file đã kèm |
| Nâng next + siết images.remotePatterns | Chờ Kenji duyệt | Gấp | 2 advisory HIGH; remotePatterns "**" là bề mặt tấn công |
| Close PR #7, #8 (không merge) | Chờ Kenji duyệt | Vừa | Nội dung đã copy + tiến hóa trên main, branch chỉ còn bản cũ hơn |
| Xóa 18 nhánh git chết (5 remote + 13 local) | Chờ Kenji duyệt | Vừa | Danh sách đầy đủ mục 2.3 |
| Dựng sitemap.xml + robots.txt | Chờ làm | Vừa | Điều kiện cho Giai đoạn 2 + LAUNCH_CHECKLIST 2 trang preview |
| Dọn ~33 ui/ component + 8 gói đi kèm | Chờ Kenji duyệt | Thấp | Sau khi duyệt sẽ phân tích transitive lần cuối rồi xóa |
| Gỡ double-favicon trong SEO.tsx | Chờ Kenji duyệt | Thấp | Đụng component chung với /kidbook |
| Dọn dấu vết Softgen (config/name/docs) | Chờ Kenji duyệt | Thấp | Vệ sinh, không rủi ro chức năng |
| Sửa 14 lint warning (6 img + 8 unused import kidbook) | Chờ làm | Thấp | Không chặn build; kidbook thuộc route bảo tồn |

---

## ⚠️ CẢNH BÁO CẦN KENJI QUYẾT NGAY

1. **`/thanh-toan-goi-1` + `/thanh-toan-goi-2` đang index được trên Google** — route thanh toán sống, có số tài khoản/giá, không noindex. Rà đủ toàn bộ route: chỉ đúng 2 cái này hở, không có cái thứ 3. Diff sẵn ở mục 2.6, chờ anh gật là em apply.
2. **Next.js 15.5.9 dính 2 lỗ hổng HIGH chưa vá**, trong đó 1 cái (DoS qua Image Optimizer) khớp trực tiếp với config hiện tại `images.remotePatterns: hostname "**"` (cho phép optimize ảnh từ MỌI domain). Nên nâng next + siết remotePatterns cùng lúc.
3. **Trang chủ sống (`/` Coming Soon) đang dùng description "Coaching tâm hồn chuyên sâu"** — "tâm hồn" nằm trong danh sách từ tránh của AGENTS.md/SEO_ENTITY.md, và đây là trang index được. Em KHÔNG tự sửa (route bảo tồn + là nội dung) — nhưng đây là chữ đang hiển thị với Google hôm nay, anh cân nhắc cho sửa sớm thay vì đợi thay trang chủ mới.
4. **PR #7/#8 nên đóng** để repo hết "nợ treo" trước Giai đoạn 2 — bằng chứng đầy đủ rằng không mất gì khi đóng.
5. PR #14 (Lặng 90') **đã merged từ 13/07** — các việc treo còn lại của Lặng 90' là nội dung (hotline khủng hoảng, VietQR, [X] ngày), nằm trong Giai đoạn 2.
