# Báo cáo thực thi dọn dẹp — 2026-07-14

Người thực hiện: Claude Code (Fable Mode). Thực thi 5 nhóm việc Kenji duyệt từ
`docs/audit/AUDIT-REPO-2026-07-14.md`. Mỗi nhóm một commit riêng, verify bằng
lệnh thật (curl production, npm audit, git) trước khi sang nhóm kế — không có
nhóm nào ngoài 5 nhóm được duyệt bị đụng vào.

---

## Việc 1 — Noindex 2 trang thanh toán

**Thay đổi**: thêm `<meta name="robots" content="noindex" />` vào `<Head>` của
`src/pages/thanh-toan-goi-1.tsx` và `src/pages/thanh-toan-goi-2.tsx`.

**Commit**: `7414c99` — fix: gắn noindex cho /thanh-toan-goi-1 và /thanh-toan-goi-2

**Verify (production, vừa chạy lại)**:
```
curl -s -L https://coachkenjipham.com/thanh-toan-goi-1 | grep robots
→ <meta name="robots" content="noindex" data-next-head=""/>
curl -s -L https://coachkenjipham.com/thanh-toan-goi-2 | grep robots
→ <meta name="robots" content="noindex" data-next-head=""/>
```
Kết quả: **ĐÃ XÁC MINH THẬT** trên production, cả hai route đều noindex.

---

## Việc 2 — Nâng Next.js, siết `images.remotePatterns`

**Thay đổi**:
- `package.json`: `"next": "15.5.9"` → `"next": "^15.5.20"` (bản `backport` mới
  nhất cùng nhánh 15.5.x — không nhảy sang major v16, đúng phạm vi nhỏ đã duyệt).
- `next.config.mjs`: bỏ hẳn `images.remotePatterns: [{ hostname: "**" }]`,
  thay bằng `images: {}` (grep toàn repo xác nhận 100% `<Image>`/`<img>` dùng
  path local trong `/public`, không route nào load ảnh remote qua Image
  Optimizer — nên bỏ hẳn thay vì whitelist domain).

**Commit**: `25b36d3` — fix: nâng next 15.5.9→15.5.20 (vá 2 lỗ hổng HIGH), bỏ hẳn images.remotePatterns

**Verify**:
- `npm audit` trước (theo audit report 2026-07-14): 11 lỗ hổng (high: 5), bao
  gồm 2 advisory HIGH của `next` (GHSA Image Optimizer remotePatterns DoS +
  RSC deserialization DoS).
- `npm audit` sau khi nâng — vừa chạy lại: `next@15.5.20` cài đặt, entry
  `next` trong `npm audit --json` chỉ còn 1 advisory **moderate** (qua
  `postcss`, không liên quan Image Optimizer/RSC) — 2 advisory HIGH được nêu
  tên đã biến mất khỏi danh sách. Tổng còn 11 lỗ hổng (1 low, 6 moderate, 4
  high) nhưng 4 high còn lại là ở `flatted`/`glob`/`minimatch`/`picomatch`
  (dev-tooling transitive, không liên quan next) — **ngoài phạm vi Việc 2**,
  không đụng vào.
- `next build` + `next lint`: pass, không lỗi.
- Kiểm tra ảnh không vỡ trên production: `/kidbook`, `/an-pham-ban-sac-hat-mam`,
  `/trang-chu-v2` — ảnh local load bình thường, không có ảnh vỡ.
- **Hiệu ứng sương mù (GSAP mist) trên `/kidbook` và `/`**: vẫn hoạt động bình
  thường sau khi nâng next — không cần rollback. Gói `gsap` không bị đụng
  (chỉ `framer-motion` và `@gsap/react` — 0 lượt import — đã gỡ ở Nhóm A trước đó).

Kết quả: **ĐÃ XÁC MINH THẬT**. Không phát sinh lỗi cần dừng lại.

---

## Việc 3 — Đóng PR #7/#8, xóa 18 nhánh chết

**Thay đổi**:
- PR #7 (`feat: rebuild homepage v2`) và PR #8 (`feat: polish homepage v2
  layout and typography`) — đóng (không merge) kèm comment giải thích đã lỗi
  thời so với `main` hiện tại.
- Xóa nhánh: 7 remote (`docs/anti-rationalization-webperf`,
  `docs/fable-mode-skill`, `feature/lang-90`,
  `feature/landing-kham-pha-preview`, `feature/landing-giao-mua-preview`,
  `feature/homepage-v2`, `feature/homepage-polish-v2`) + 13 local (11 nhánh đã
  merge + 2 nhánh mồ côi `chore/ai-operating-system` và
  `feature/landing-hat-mam-v3`, Kenji xác nhận xóa không cần giữ lịch sử).

**Verify (vừa chạy lại)**:
```
gh pr view 7 --json state → CLOSED
gh pr view 8 --json state → CLOSED
git branch -a → chỉ còn main + remotes/origin/main
```
Kết quả: **ĐÃ XÁC MINH THẬT**. Repo chỉ còn nhánh `main`.

---

## Việc 4 — Sửa 1 câu trên trang chủ

**Thay đổi**: `src/pages/index.tsx` dòng mô tả SEO — thay cụm
`"Coaching tâm hồn chuyên sâu tại Sài Gòn."` bằng
`"Coaching bản sắc chuyên sâu — nhìn rõ mình, sống đúng với mình."` (nguyên
văn Kenji duyệt). Không đụng chữ/element nào khác trên trang.

**Commit**: `5d70f71` — fix: sửa mô tả trang chủ, bỏ cụm 'tâm hồn' (từ tránh theo AGENTS.md)

**Quyết định cần xác nhận**: cụm gốc là MỘT câu hoàn chỉnh
("Coaching tâm hồn chuyên sâu tại Sài Gòn.") — Claude thay nguyên câu bằng
câu Kenji đưa, thay vì chèn giữa câu (nếu chèn giữa sẽ ra ngữ pháp gãy: hai
dấu gạch ngang + "tại Sài Gòn" viết thường lửng sau dấu chấm). Kết quả: cụm
"tại Sài Gòn" bị bỏ khỏi câu mô tả này. **CẦN KENJI xác nhận** đây có đúng ý
không, hay muốn giữ lại "tại Sài Gòn" dưới hình thức khác.

**Verify (production, vừa chạy lại)**:
```
curl -s -L https://coachkenjipham.com/ | grep -o "Coaching[^<\"]*"
→ Coaching by Kenji Phạm — Coaching bản sắc chuyên sâu — nhìn rõ mình, sống đúng với mình.
```
Grep toàn `src/pages/` + `src/components/` cho "tâm hồn": **còn 3 chỗ trong
`src/pages/kidbook.tsx`** (dòng 306, 417, 467 — mô tả "chân dung tâm hồn" của
bé trong nội dung sản phẩm Kidmap). `kidbook.tsx` là route sống, nằm trong
danh sách "Do Not Touch" (di sản, dùng biến màu cũ) theo
`docs/website/audits/PHASE_0_ROUTE_SOURCE_AUDIT.md` và không nằm trong phạm
vi Việc 4 (chỉ `index.tsx` được duyệt sửa) — **KHÔNG tự ý sửa**, chỉ nêu ra
đây để Kenji quyết có muốn mở một việc riêng cho `kidbook.tsx` hay không.

Kết quả: **ĐÃ XÁC MINH THẬT** câu trang chủ đã đổi đúng theo yêu cầu; phần còn
lại trong kidbook.tsx là phát hiện ngoài phạm vi, **CẦN KENJI quyết**.

---

## Việc 5 — Tái tổ chức `docs/audit/`

**Thay đổi**:
- Xóa `docs/audit/REPO_AUDIT.md` (2026-07-04) — lỗi thời hoàn toàn so với audit
  hôm nay, và chứa thông tin sai (từng ghi sitemap.xml/robots.txt đã có, trang
  thanh toán đã noindex — cả hai đều bị audit hôm nay bác bỏ bằng bằng chứng
  thật).
- Đổi tên + di chuyển `AUDIT-REPORT-2026-07-14.md` (gốc repo) →
  `docs/audit/AUDIT-REPO-2026-07-14.md` (dùng `git mv`, giữ lịch sử file).
- Xóa `docs/audit/.DS_Store` (file rác macOS, không được git track — xóa trực
  tiếp bằng `rm`, không cần commit).
- Tạo `docs/audit/README.md` — nêu quy ước: `docs/audit/` là ngăn DUY NHẤT cho
  báo cáo audit/cleanup; đặt tên `AUDIT-<phạm-vi>-YYYY-MM-DD.md` /
  `CLEANUP-EXECUTION-YYYY-MM-DD.md`.
- Tạo file báo cáo này: `docs/audit/CLEANUP-EXECUTION-2026-07-14.md`.

**Không di chuyển** `docs/website/audits/PHASE_0_ROUTE_SOURCE_AUDIT.md` dù tên
chứa "AUDIT" — đọc toàn bộ nội dung xác nhận đây là tài liệu chiến
lược/kiến trúc còn hiệu lực (Migration Strategy, Do Not Touch List vẫn được
`AGENTS.md` tham chiếu), và `BACKLOG.md:14` tham chiếu trực tiếp đường dẫn
hiện tại của nó. Di chuyển sẽ làm gãy tham chiếu đó — nằm ngoài phạm vi 5
việc hôm nay (sửa `BACKLOG.md` không được duyệt). **CẦN KENJI xác nhận**: giữ
nguyên vị trí (khuyến nghị của Claude) hay vẫn muốn dời và Claude sẽ cập nhật
luôn `BACKLOG.md` trong một việc riêng sau.

**Cũng cần Kenji xác nhận**: tên `docs/audit/AUDIT-REPO-2026-07-14.md` — thẻ
phạm vi dùng là "REPO" (audit toàn repo). Nếu Kenji muốn thẻ khác (vd.
"CLEANUP", "FULL") báo lại để đổi tên.

---

## Tổng kết trước/sau

| Hạng mục | Trước | Sau |
|---|---|---|
| npm audit — tổng lỗ hổng | 11 (Nhóm A đã giảm từ 28) | 11 (2 advisory HIGH của next đã vá, 4 high còn lại là dev-tooling khác, ngoài phạm vi) |
| next version | 15.5.9 | 15.5.20 |
| `images.remotePatterns` | `hostname: "**"` (mọi domain) | bỏ hẳn — chỉ dùng ảnh local |
| PR mở | #7, #8 (mở) | cả hai CLOSED |
| Nhánh git | ~20 (main + 18 chết + …) | chỉ còn `main` |
| Trang thanh toán noindex | Chưa | Đã, xác minh trên production |
| "tâm hồn" trên trang chủ | Có | Đã bỏ, xác minh trên production |
| `docs/audit/` | có file lỗi thời + rác `.DS_Store`, báo cáo audit nằm ở gốc repo | chỉ còn báo cáo còn hiệu lực, có README quy ước |

## Phát sinh ngoài phạm vi (không tự sửa, để Kenji quyết)

1. `kidbook.tsx` còn 3 chỗ dùng "tâm hồn" (từ tránh theo `AGENTS.md`) — route
   sống, nằm trong danh sách "Do Not Touch". Cần Kenji quyết có mở việc riêng
   sửa không.
2. `docs/website/audits/PHASE_0_ROUTE_SOURCE_AUDIT.md` — giữ nguyên vị trí
   (khuyến nghị) hay dời + cập nhật `BACKLOG.md`.
3. Tên file `AUDIT-REPO-2026-07-14.md` — xác nhận thẻ phạm vi "REPO" ổn không.
4. Câu mô tả trang chủ đã bỏ "tại Sài Gòn" — xác nhận đúng ý.

## Chưa đụng (đúng theo giới hạn đã duyệt)

`ui/` shadcn components chưa dùng, `SEO.tsx` double-favicon, dấu vết Softgen
(`.softgen/`, `package.json` name, `next.config.mjs` element-tagger loader,
`vercel.json` redirect mẫu) — toàn bộ vẫn ở trạng thái chờ, không bị đụng vào
trong đợt này.
