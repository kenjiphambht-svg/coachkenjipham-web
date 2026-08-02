# HOMEPAGE INDEX-READINESS AUDIT — 2026-08-02

> ## ⚠️ SUPERSEDED IN PART — read the completion record first
>
> Founder Decisions of **02/08/2026** (recorded as **L0 C-14 and C-15**) resolved every BLOCKER in this document. **§3 and §4 below are withdrawn** — do not re-open them as defects. The typecheck claim in §2 is also corrected.
>
> Current closeout: **[`HOMEPAGE_FINAL_COMPLETION_RECORD.md`](HOMEPAGE_FINAL_COMPLETION_RECORD.md)**. This file is retained as dated audit evidence only.

> **Authority:** L4 — Implementation Evidence (audit findings only; no L0/L1/L2 ruling authority)
> **Status:** Active
> **Owner:** Kenji Phạm (ruling); Claude Code (evidence gathering)
> **Purpose:** Record the Homepage (`/`) index-readiness audit against PR #116 and the Founder-locked Editorial Completion Package. Documents PASS / FIX NOW / SYSTEM DEPENDENCY / BLOCKER findings. Does not itself authorize any content, indexing, canonical-domain or background-asset change.
> **Decision scope:** Evidence and classification only. **Non-decision scope:** Content-fidelity rulings, background-asset rulings, canonical-domain rulings, M6 indexing activation — all require a Founder Decision.
> **Governing basis:** [Conflict Register](../../governance/CONFLICT_REGISTER.md) C-01, C-02, C-07, C-13; [Indexing Policy](../current/INDEXING_POLICY.md); [Route State Matrix](../current/ROUTE_STATE_MATRIX.md); ESSENCE HOMEPAGE — EDITORIAL COMPLETION PACKAGE (Official Founder-Locked Package, 2026-08-01, untracked local file — see §7 below).
> **Baseline evidence commit:** origin/main at 887a6317857550413502838ccff899533acacf76 (PR #116, "Complete canonical homepage editorial")
> **Last verified:** 887a6317857550413502838ccff899533acacf76
> **Review trigger:** Founder Decision on any BLOCKER below, or next Homepage PR.

## 1. Route and status

**Route:** `/` (and its contained migration-evidence twin `/trang-chu-v2`, same shared `VillaPage.tsx`)

**Audit status at the time of writing:** NOT READY. **Now superseded — `/` reached `INDEX-READY LOCKED — NOINDEX PENDING FOUNDER ACTIVATION` on 02/08/2026;** see the completion record. Original text retained below as dated evidence.

**(historical)** **NOT READY** for `HOMEPAGE INDEX-READY LOCKED` classification. Technical layers (indexing, schema, links, accessibility basics, performance, analytics, build) are clean. Two categories of finding block the LOCKED status until Kenji rules on them: (a) four Founder Locked Copy text discrepancies, (b) two Founder-locked background-asset decisions (S04, S08) implemented as photographic images instead of the specified code backgrounds. `noindex` is unchanged and correctly rendered throughout; nothing in this audit touched indexing, routes, or Locked Copy content.

## 2. PASS (verified with evidence)

- **`noindex` rendered correctly.** Source (`VillaPage.tsx`) and production HTML (`curl` on 2026-08-02) both show `<meta name="robots" content="noindex">`. No sitemap/robots file exists (documented gap, not created here).
- **Exactly one `<h1>` on the page**, text `"Câu chuyện cuộc sống của bạn là một kiệt tác."` — confirmed via live DOM query on production, matches Founder-locked H1/Brand Signature Line exactly.
- **Heading hierarchy** matches the package's Heading Map: H2 `Kenji Phạm` (with a small "Tôi là" label above it, reconciling the package's prose "Tôi là Kenji Phạm." with its own Heading Map requirement of H2 = "Kenji Phạm"), `sr-only` H2 "Hai cánh cửa để bắt đầu" with H3s for each card, H2 "Essence Coaching là gì?", H2 "Điều Essence không hứa.", H2 "Một góc để quay lại." with H3s for its three panels.
- **SEO title, meta description, OG title/description, JSON-LD Person/Organization** all match the Founder-locked SEO/GEO Package exactly, verified against **both source and live production HTML** (`curl https://www.coachkenjipham.com/`, 2026-08-02): title `"Kenji Phạm — Huấn luyện viên Tâm lý Chiều sâu, Essence Coach"`, description, `og:title "Kenji Phạm — Essence Coaching"`, `og:description`, `Person.jobTitle "Huấn luyện viên Tâm lý Chiều sâu, Essence Coach"`, `Organization.name "Essence Coaching"` (no "System" suffix, per L0 C-07). No Product/Review/Medical schema present.
- **CTA destinations** — all 7 Homepage CTA links verified live (`curl -o /dev/null -w "%{http_code}"` against production): `/ve-kenji`, `/ban-sac-cua-ban`, `/ban-sac-cua-con`, `/phuong-phap`, `/dieu-essence-khong-hua`, `/lien-he`, `/trang-chu-v2` all return HTTP 200. No legacy (`/kidbook`) links anywhere in Header, Footer, or body — confirmed by source read.
- **OG/social image** — `https://coachkenjipham.com/essence-og-1200x630.png` resolves HTTP 200, downloaded and confirmed 1200×630 PNG (correct 1.91:1 OG ratio).
- **Accessibility (source + live DOM verified):** header menu implements focus trap, `Escape`-to-close-and-return-focus, `aria-expanded`/`aria-controls`/`role="dialog"`/`aria-modal`, `motion-reduce:` variants on the menu transition. All interactive CTAs carry explicit `aria-label` and visible `focus-visible:ring-2 ring-e26-gold` styling. S09 panels are static `<article>` content — no `<a>`/`<button>`/`role="button"`, no hover-as-clickable styling, confirmed against the package's explicit S09 interaction-state lock. No horizontal overflow at 375px or 1440px (`document.documentElement.scrollWidth === clientWidth`, verified live via DOM on production).
- **No console errors or hydration warnings** on a fresh production navigation (`read_console_messages` — empty, checked immediately post-navigation).
- **No broken images** — all `next/image` requests observed in the network log for `/` returned HTTP 200; four new PR #116 image assets (`ban-sac-cua-ban-quiet-pause.webp` 143KB, `kenji-section-light-wall.webp` 119KB, `not-promised-plaster-field.webp` 449KB, `two-paths-light-room.webp` 19KB) all present, reasonable payload, WebP format.
- **Build / typecheck / lint** (run in a fresh worktree checked out from `origin/main`, `npm install` fresh): `npm run build` — 23/23 pages generate, `/` is 290 B page-specific / 144 kB First Load JS, no errors. `npx tsc --noEmit` — ⚠️ **this claim was wrong and is corrected in the completion record §7.** The reported `src/pages/kidbook.tsx` error was an artifact of running `tsc` in a fresh worktree *before* the first `next build` (the untracked, generated `next-env.d.ts` references `.next/types/routes.d.ts`, which does not exist yet). After any successful build, typecheck exits **0** with no errors. There is no real TypeScript defect. `npm run lint` — zero errors; warnings are all pre-existing (`<img>` vs `next/image` in `HomeHeader.tsx` and three unrelated landing components; unused imports in `_app.tsx`/`kidbook.tsx`).
- **Analytics/tracking: NOT IMPLEMENTED.** Repo-wide grep for `gtag`, `google-analytics`, Vercel Analytics package, Facebook pixel — no matches. Live network log during a full page load shows zero third-party requests; everything is same-origin `_next` assets and images. Per this task's own classification rule, this is recorded as NOT IMPLEMENTED, not a defect. No privacy/consent mismatch is possible because nothing is tracked.
- **Section-by-section Locked Copy check — clean sections:** S04 (Hai Cánh Cửa) copy and both CTAs, S06 (An Định → An Thịnh — package required only that the trailing two sentences be removed; confirmed removed, nothing else was locked to compare), S07 (Image Bridge — no copy added, existing asset kept, matches package exactly), S09 (Một góc để quay lại — intro paragraph and all three panel titles/bodies/quotes/statuses match the package byte-for-byte; DOM order is Intro → Ebook → Ghi chép Essence → Khởi đầu as required; no `<a>`/`<button>`/hover-as-clickable, "Mời bạn đọc" fully removed), S10 (Signature Ending) all match the Founder-locked text exactly.

## 3. ~~BLOCKER~~ — WITHDRAWN 02/08/2026 (Founder ruled; see C-15)

**All four rows below were ruled correct-as-implemented by the Founder on 02/08/2026 — including the Signal Moment.** Hero "Vẫn trả lời những tin nhắn.", the Kenji closing line, and the S08 CTA "Mời bạn đọc đầy đủ →" are the approved wording; the package rows they were compared against are superseded.

**Signal Moment — final ruling:** the approved sentence is **"Không phải mọi chương đều đẹp."**, i.e. exactly what production already renders, **without** "vì". An interim instruction earlier the same day had asked to insert "vì"; that edit was made and then reverted inside this same PR once the final ruling landed, so no copy change reaches production. See **C-15**. Retained below as dated evidence only — the row claiming a missing "vì" is **wrong** and is withdrawn.

### (withdrawn) Original finding — Locked Copy text drift

Content-text edits are outside this task's Fix Boundaries even when the edit would only restore already-approved wording, so these are reported, not applied. Four exact-wording mismatches between the Founder-locked package and the current production/source implementation (all four are genuine PR #116 authoring gaps, confirmed against the PR #116 diff itself — not pre-existing legacy text):

| Section | Locked (package) | Implemented (production, verified live) | Diff |
|---|---|---|---|
| S01 Hero body, line 2 | "Vẫn trả lời những tin nhắn **cần trả lời**." | "Vẫn trả lời những tin nhắn." | Missing "cần trả lời" |
| ~~S02 Signal Moment supporting line~~ **WITHDRAWN — this row was wrong** | ~~"Không phải **vì** mọi chương đều đẹp."~~ | "Không phải mọi chương đều đẹp." | **No defect.** Founder's final ruling (C-15) is the sentence *without* "vì" — production was correct all along. |
| S03 Kenji body, closing line | "Tôi giữ cho không gian đủ yên để **họ** nhìn rõ điều đang diễn ra và nghe được chính mình." | "Tôi giữ những khoảng lặng để **bạn** nhìn rõ điều đang diễn ra và nghe được chính mình." | Different wording, not a typo — a rewritten sentence |
| S08 CTA (Điều Essence không hứa) | Visible: "Đọc đầy đủ →" · Accessible label: "Đọc đầy đủ những điều Essence không hứa" | Visible: "Mời bạn đọc đầy đủ →" · aria-label: "Mời bạn đọc đầy đủ những điều Essence không hứa" | Extra "Mời bạn" prefix on both visible text and accessible name |

**Required next action:** Kenji reviews the four rows above and rules one of: (a) production wording is fine, update the package to match reality; or (b) package is correct, authorize a scoped, content-only PR to restore the exact locked wording. Either ruling is a one-line decision per row; none of the four require design or layout work.

## 4. ~~BLOCKER~~ — WITHDRAWN 02/08/2026 (Founder ruled; see C-15)

**The Founder approved the current S04 and S08 background images as-is.** Package §8.4/§8.5 and DoD #12/#13 ("code background") are superseded on this point. Nothing to fix. Retained below as dated evidence only.

### (withdrawn) Original finding — S04/S08 background asset

The package's own Definition of Done lists items #12 and #13 as required: *"Nền Hai Cánh Cửa chuyển sang code"* and *"Nền Điều Essence không hứa chuyển sang code"* — and §8.4/§8.5 are explicit: *"Bỏ ảnh nền kiến trúc hiện tại. Dùng code background cream/ivory canonical. … Không cửa, vòm, furniture, texture ảnh hoặc glow."*

PR #116 instead **added two new photographic image assets** for exactly these two sections:

- `two-paths-light-room.webp` (S04, `TwoStates.tsx`) — downloaded and visually inspected: a rendered empty room with a visible ceiling vent detail, a door opening, and a tiled floor with visible grout lines. This is squarely the "cửa" (doorway) and "texture ảnh" the package explicitly excludes, regardless of the 60–70% ivory `color-mix` overlay applied on top.
- `not-promised-plaster-field.webp` (S08, `NotPromised.tsx`) — downloaded and visually inspected: a heavy-texture plaster-wall close-up. No doorway/arch/furniture, but it is unambiguously a photographic texture image, not a CSS/code-generated background, which is what §8.5 explicitly calls for.

Both are real `next/image` background layers with filters and opacity, not `background-color`/`gradient` code layers. This is a direct, verifiable contradiction of an explicit, itemized Founder Decision — not a subjective visual-QA opinion.

**Required next action:** Kenji rules one of: (a) these two FLUX.2 Klein 9B assets are an approved evolution of the S04/S08 decision (i.e., "code background" is superseded by "abstract light-only asset, no recognizable architecture") — in which case the package DoD #12/#13 wording should be updated to reflect that; or (b) the original code-background decision stands, and a scoped follow-up task swaps these two sections back to `color-mix`/gradient-only backgrounds. This is a design decision, not something resolved by code review — flagged here, not applied.

## 5. SYSTEM DEPENDENCY (not Homepage-scoped; owner Kenji; no action taken)

| Dependency | Required action | When |
|---|---|---|
| M6 Search Indexing Launch | Founder Decision to begin M6: sitemap generation, robots policy, canonical-tag implementation, Search Console submission, partner/legacy boundary review. Per L0 C-02 this cannot start from this audit. | After Kenji explicitly opens M6 |
| **Apex-domain 307 redirect vs. hardcoded `https://coachkenjipham.com/` in all Homepage metadata/schema** — newly discovered, not previously documented in `INDEXING_POLICY.md`. `curl -IL https://coachkenjipham.com/` on 2026-08-02 shows a live HTTP 307 to `https://www.coachkenjipham.com/`, yet `VillaPage.tsx`'s `pageUrl` prop type, `og:url`, and both JSON-LD `url` fields all use the bare apex domain (no `www`) — a URL that, taken literally, never resolves without a redirect hop. | Kenji decides which domain (apex or `www`) is the canonical production domain; that decision then drives the M6 canonical-tag and metadata-URL implementation across the whole site, not just `/`. | At or before M6 canonical implementation |
| `/trang-chu-v2` duplicate-content posture | Already governed by L0 C-01 ("not canonical Villa; no redirect authorized… post-cutover disposition is a pending Kenji decision") — this audit adds no new fact, only confirms both routes still render the identical shared component and both still emit `noindex`, so there is no live duplicate-indexing exposure today. | Kenji's own pending disposition decision, unchanged by this audit |
| `HomeHeader.tsx` uses `<img>` instead of `next/image` for the two logo SVGs (build-time lint warning); one Tailwind `duration-[400ms]` class is flagged ambiguous by the Tailwind compiler | Both are trivial, low-risk, and would normally be safe metadata/performance fixes — but `HomeHeader.tsx` is a **shared file also in `/ve-kenji`'s render path**, and this task found no evidence either way of active parallel work on `/ve-kenji` (no worktree, no branch, no open PR at audit time — see §6). Per this task's explicit shared-file caution, deferred rather than edited. | Safe to fix in any small, low-risk PR once `/ve-kenji` work status is confirmed |
| **Founder-locked source documents are untracked** — `docs/website/homepage/ESSENCE_HOMEPAGE_EDITORIAL_COMPLETION_PACKAGE_OFFICIAL.md` and `CODEX_IMPLEMENTATION_PROMPT_CANONICAL_HOMEPAGE.md` (the exact documents this audit and PR #116 both treat as ground truth) exist only as **untracked local files** in the main worktree (`git status` shows `??`), never committed. If that local directory is lost or reset, the only Founder-approved specification for the canonical Homepage disappears from the record entirely. | Kenji decides whether to commit these into the tracked repo (recommended, given `ARCHIVE_POLICY.md`'s own principle of preserving authority-bearing evidence) or keep them local-only by design; either way this should be a deliberate choice, not an accident. | Before the next Homepage-scoped task, ideally |

## 6. Bilingual readiness (VI/EN)

- **VI status:** Complete, native, Founder-locked. All copy is hardcoded directly in JSX (not yet abstracted into a locale dictionary/content object — matches the package's own §11.1 observation, listed there as OPEN, not required now).
- **EN status:** NOT IMPLEMENTED. Confirmed no `/en` route, no `hreflang`, no English copy anywhere in the Homepage component tree — matches the package's explicit instruction not to implement English in this round.
- **Architecture dependencies for later English work:** (a) copy is inline in JSX, not a locale dictionary — a future transcreation pass will need to extract it; (b) four `whitespace-nowrap` spans wrap short Vietnamese phrases/CTAs (`KietTac.tsx` "kiệt tác", `AnDinhAnThinh.tsx` "đời sống An Thịnh.", `WhatIsEssence.tsx` CTA "Phương pháp Essence Coaching →", `NotPromised.tsx` CTA "Mời bạn đọc đầy đủ →") — English equivalents running 20–35% longer (per the package's own estimate) could overflow on narrow viewports and should be re-measured once English copy exists; (c) no fixed-height copy containers and no text inside CSS pseudo-elements were found anywhere in the Homepage component tree, so no layout-fragility risk exists on that front today.

## 7. Note on source documents

This audit's Founder-locked reference is `docs/website/homepage/ESSENCE_HOMEPAGE_EDITORIAL_COMPLETION_PACKAGE_OFFICIAL.md`, read from the main worktree where it currently lives as an **untracked local file** (see §5). Its content, once committed, should be diffed against this note's quotations to confirm nothing drifted between audit and commit.

## 8. Evidence index

- PR #116: https://github.com/kenjiphambht-svg/coachkenjipham-web/pull/116 (merged 2026-08-01 by `kenjiphambht-svg`, base `main`, head `agent/canonical-homepage`)
- Merge baseline / audit baseline commit: `887a6317857550413502838ccff899533acacf76`
- Production verification: `curl` against `https://www.coachkenjipham.com/` and `https://coachkenjipham.com/`, 2026-08-02; live DOM/network/console checks via browser against the same production origin, same date.
- Audit worktree/branch: `audit/homepage-index-readiness`, created from `origin/main` (887a631) — see git log on that branch for the exact commit implementing this document.
