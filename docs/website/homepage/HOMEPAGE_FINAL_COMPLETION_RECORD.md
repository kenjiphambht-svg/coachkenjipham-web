# HOMEPAGE FINAL COMPLETION RECORD — `/`

> **Authority:** L4 — Implementation Evidence (completion record; records Founder Decisions applied, does not itself create them)
> **Status:** Active
> **Owner:** Kenji Phạm
> **Purpose:** Final closeout record for the Canonical Villa Homepage `/`. Records the Founder Decisions of 02/08/2026, the verification evidence, and the single outstanding infrastructure action before `/` can be called fully index-ready.
> **Decision scope:** Records evidence and applied decisions. **Non-decision scope:** Does not authorize indexing, sitemap, robots, Search Console, DNS changes or any M6 action.
> **Governing basis:** [Conflict Register](../../governance/CONFLICT_REGISTER.md) C-01, C-02, C-07, C-13, **C-14**; [Indexing Policy](../current/INDEXING_POLICY.md).
> **Baseline evidence commit:** origin/main at 887a6317857550413502838ccff899533acacf76 (PR #116); this record's own changes are on branch `audit/homepage-index-readiness` (PR #117).
> **Last verified:** 887a631 + PR #117 head
> **Review:** Founder Decision, or when the outstanding Vercel domain action in §4 is completed.

## 1. Final status

**HOMEPAGE CODE LAYER: INDEX-READY LOCKED.**
**OVERALL: NOT YET fully `INDEX-READY LOCKED — NOINDEX PENDING FOUNDER ACTIVATION`.**

Everything inside the repository is complete. Exactly **one** item remains, and it is not a code change: the production canonical-domain redirect currently runs **backwards** relative to the Founder's 02/08/2026 decision, and it can only be corrected in the Vercel dashboard (§4). Until that is flipped, `/` cannot honestly be called domain-consistent, because the canonical tag declares the apex domain while the infrastructure bounces the apex away to `www`.

`noindex` is unchanged everywhere. No sitemap, robots, or Search Console action was taken.

## 2. Founder Decisions of 02/08/2026 — reconciled into current truth

These supersede the corresponding rows of the earlier Editorial Completion Package. Recorded here so no later agent re-opens them as defects:

| # | Founder Decision (02/08/2026) | Status |
|---|---|---|
| 1 | Hero body line reads **"Vẫn trả lời những tin nhắn."** | Already matches production. No change needed. Earlier audit flagged this as drift — **withdrawn**. |
| 2 | Kenji section closing line reads **"Tôi giữ những khoảng lặng để bạn nhìn rõ điều đang diễn ra và nghe được chính mình."** | Already matches production. Earlier audit flagged this as drift — **withdrawn**. |
| 3 | S08 CTA reads **"Mời bạn đọc đầy đủ →"** | Already matches production. Earlier audit flagged this as drift — **withdrawn**. |
| 4 | S04 and S08 use the **current background images** (`two-paths-light-room.webp`, `not-promised-plaster-field.webp`) — Founder-approved. | Approved as-is. Earlier audit BLOCKER on "code background required" — **withdrawn**. Package §8.4/§8.5 and DoD #12/#13 are superseded on this point. |
| 5 | Signal Moment reads **"Không phải vì mọi chương đều đẹp."** | Production was missing "vì". **FIXED** in this PR (`KietTac.tsx`). |
| 6 | Canonical domain is **`https://coachkenjipham.com`** (apex, no `www`); `www` must redirect permanently to it. | Code layer applied (§3). Infrastructure layer outstanding (§4). Recorded as **L0 C-14**. |

## 3. Canonical domain — code layer (DONE)

All four absolute-URL layers on `/` now agree on the apex domain, verified in the built HTML (`.next/server/pages/index.html`), not merely in source:

| Layer | Value |
|---|---|
| `<link rel="canonical">` | `https://coachkenjipham.com/` |
| `og:url` | `https://coachkenjipham.com/` |
| JSON-LD `Person.url` | `https://coachkenjipham.com/` |
| JSON-LD `Organization.url` | `https://coachkenjipham.com/` |

The canonical tag is **new in this PR**. It was added specifically so that M6 activation requires no SEO retrofit. It is inert for indexing today because the page remains `noindex`.

`/trang-chu-v2` **self-canonicals** to `https://coachkenjipham.com/trang-chu-v2` rather than pointing at `/`. This is deliberate: L0 C-01 leaves that route's disposition as a pending Kenji decision, and pointing its canonical at `/` would silently pre-decide a consolidation that C-01 has not authorized. Both routes are `noindex`, so nothing is exposed either way.

## 4. Canonical domain — infrastructure layer (OUTSTANDING, Kenji action required)

**Observed production behaviour, 02/08/2026:**

| Request | Result |
|---|---|
| `http://coachkenjipham.com/` | 308 → `https://coachkenjipham.com/` ✅ HTTP→HTTPS enforced |
| `http://www.coachkenjipham.com/` | 308 → `https://www.coachkenjipham.com/` ✅ HTTP→HTTPS enforced |
| `https://coachkenjipham.com/` | **307 → `https://www.coachkenjipham.com/`** ❌ backwards vs. C-14, and *temporary* not permanent |
| `https://www.coachkenjipham.com/` | 200, serves the page ❌ `www` is currently the primary |

**Where this comes from — verified, not assumed:** `vercel.json` contains exactly one redirect (`/old-path` → `/new-path`) and no host-based rule; `next.config.mjs` defines no `redirects`, `rewrites` or `headers`. The Vercel project (`prj_Okp2A6f4oiba8HxrHhQIat9WhDmR`, team `Kenji Pham's projects`) lists **both** `www.coachkenjipham.com` and `coachkenjipham.com` as project domains. The apex→www 307 is therefore a **Vercel dashboard domain setting**, outside this repository.

**Why this was not "fixed" from code — this matters:** adding a `www → apex` redirect to `vercel.json` while the dashboard still redirects `apex → www` produces an **infinite redirect loop** (dashboard sends apex to www; vercel.json sends www back to apex; repeat). Creating that loop is explicitly forbidden by the task, and it would take the whole site down, not just `/`. The dashboard setting must be flipped first; no code change is needed at all once it is.

**Required action (Kenji, Vercel dashboard — 1 setting):**
Project → Settings → Domains → make `coachkenjipham.com` the **primary/production** domain, and set `www.coachkenjipham.com` to **redirect to it permanently (308)**.

After that flip, re-verify: `https://www.coachkenjipham.com/` should return 308 → `https://coachkenjipham.com/`, and `https://coachkenjipham.com/` should return 200. No repository change accompanies this.

**DNS:** no DNS record change is required for this flip — both hostnames already resolve to Vercel and both already serve valid TLS. DNS was therefore not touched.

## 5. HTTPS / TLS / security

| Check | Result |
|---|---|
| HTTPS enforced | ✅ Both hostnames 308 from HTTP to HTTPS |
| TLS certificate | ✅ Valid on both apex and `www`; Vercel-managed, auto-renewing |
| HSTS | ✅ Present: `strict-transport-security: max-age=63072000` (2 years) on production responses |
| HSTS `preload` / `includeSubDomains` | ⚠️ **Not enabled, and deliberately not enabled here.** Adding `preload` is effectively irreversible for a long period and `includeSubDomains` would bind every current and future subdomain to HTTPS-only. Both are site-wide, high-consequence changes that the task itself says to flag rather than self-apply. Recorded as a separate Kenji decision. |
| Mixed content | ✅ None — zero `http://` sub-resources in the rendered HTML |
| Security headers | `x-content-type-options: nosniff` present (from `vercel.json`). No CSP, `X-Frame-Options`, `Referrer-Policy` or `Permissions-Policy`. Lighthouse Best Practices scored **100/100** on both form factors regardless. Adding these is a **site-wide** header change affecting all 23 routes — out of Homepage scope, flagged not applied. |
| Secret / env exposure | ✅ None — no secret-shaped strings and no `NEXT_PUBLIC_*` values embedded in the rendered HTML; no `.env*` file is tracked in git |
| Preview / assets / routes | ✅ Unaffected — no config, route or asset change was made |

## 6. Lighthouse (production, `lighthouse@12.8.2`, headless Chrome, 02/08/2026)

Measured against `https://www.coachkenjipham.com/` — the origin that actually serves content today. Once the §4 flip happens, the same page will serve from the apex without the extra redirect hop, which can only improve these numbers.

| Category | Mobile | Desktop |
|---|---|---|
| Performance | 61 | 73 |
| **Accessibility** | **100** | **100** |
| **Best Practices** | **100** | **100** |
| SEO | 63 | 63 |

| Metric | Mobile | Desktop |
|---|---|---|
| First Contentful Paint | 5.0 s | 1.9 s |
| Largest Contentful Paint | 8.8 s | 2.7 s |
| **Cumulative Layout Shift** | **0** | **0** |
| **Total Blocking Time** | **0 ms** | **0 ms** |
| Speed Index | 5.6 s | 2.4 s |

**SEO 63 is not a defect.** The only failing SEO audit on either form factor is `is-crawlable` — *"Page is blocked from indexing"* — which is the intended, governed state under L0 C-02. Every other SEO audit passes. On the day indexing is activated, this score rises on its own with no code change.

**Accessibility 100 with no failing audits** on either form factor, including `color-contrast`, `image-alt`, `link-name`, `heading-order` and `html-has-lang` — this is the contrast evidence the task asked for.

**Performance — root cause identified, deliberately not fixed here.** The dominant lever is a render-blocking stylesheet: `src/styles/globals.css` line 1 is an `@import url('https://fonts.googleapis.com/css2?...')` for Cormorant Garamond + Inter. Lighthouse attributes ~791 ms of direct blocking to it on mobile and ~3.9 s of total render-blocking opportunity. The LCP element is the Hero background image (`hero-hien-vuon1.webp`), which is already `priority`-loaded — it is late because the render-blocking font CSS delays the whole paint, not because the image itself is mishandled. CLS 0 and TBT 0 ms mean layout stability and interactivity are already ideal.

Fixing this means editing **`globals.css`**, which is a shared file governing all 23 routes and is named explicitly in `AGENTS.md` / `PLAYBOOK.md` §5 exception (c) as requiring Kenji's prior approval. It is therefore recorded as a system dependency, not silently changed inside a Homepage task.

## 7. Build / typecheck / lint — exact results

Run in the `audit/homepage-index-readiness` worktree, checked out from `origin/main`, dependencies installed fresh:

| Command | Exit code | Result |
|---|---|---|
| `npm run build` | **0** | 23/23 static pages generated, compiled successfully |
| `npx tsc --noEmit` | **0** | No errors, no output |
| `npm run lint` | **0** | 0 errors, 14 warnings — all pre-existing (`<img>` vs `next/image`, unused imports), none in files changed by this PR |

**Correction to the earlier audit record.** The previous audit document reported a "pre-existing TypeScript error in `src/pages/kidbook.tsx`". That was wrong, and the cause is worth recording: `next-env.d.ts` is untracked and generated, and it `/// <reference path="./.next/types/routes.d.ts" />`. In a freshly created worktree, running `npx tsc --noEmit` **before** the first `next build` leaves that reference unresolved, which surfaces a spurious styled-jsx typing error. After any successful build, typecheck is clean at exit code 0. There is no real TypeScript defect in the codebase — the earlier finding was an artifact of command ordering in a fresh worktree, and it has been withdrawn.

## 8. Homepage index-readiness — remaining checks

| Layer | Result |
|---|---|
| Rendered `noindex` | ✅ `<meta name="robots" content="noindex">` in built HTML and live production. Unchanged by this PR. |
| Metadata | ✅ Title, description, OG title/description match the Founder-locked SEO/GEO package exactly |
| Schema | ✅ Person + Organization, entity `Essence Coaching` per L0 C-07, no Product/Review/Medical |
| Links | ✅ All 7 Homepage CTA destinations return HTTP 200; no legacy `/kidbook` link anywhere |
| Single H1 | ✅ Exactly one, the Brand Signature Line |
| Horizontal overflow | ✅ None at 375 px or 1440 px |
| Console / runtime | ✅ No console errors, no hydration warnings on production |
| Analytics / tracking | ✅ NOT IMPLEMENTED — zero third-party requests, no tracking code; no privacy/consent mismatch possible |
| Bilingual readiness | VI complete and locked; EN not implemented (per instruction). Architecture notes retained in the audit document. |

## 9. Remaining system dependencies

| # | Dependency | Owner | Required action |
|---|---|---|---|
| 1 | **Canonical domain flip** (§4) | Kenji | One Vercel dashboard setting: apex primary, `www` → 308 to apex. No code change. **This is the only item blocking full index-ready status.** |
| 2 | Render-blocking Google Fonts `@import` in `globals.css` (§6) | Kenji | Approve a scoped, site-wide font-loading change (e.g. `next/font`, or preload + non-blocking load). Affects all 23 routes. |
| 3 | HSTS `preload` / `includeSubDomains` (§5) | Kenji | Separate decision; irreversible-by-nature, site-wide |
| 4 | Additional security headers — CSP, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy` (§5) | Kenji | Site-wide `vercel.json` header change; Best Practices already 100/100 without them |
| 5 | `HomeHeader.tsx` uses `<img>` for two logo SVGs | Kenji | Shared file also on `/ve-kenji`'s render path; low-risk but deferred per shared-file caution |
| 6 | Founder-locked source documents are untracked | Kenji | `docs/website/homepage/ESSENCE_HOMEPAGE_EDITORIAL_COMPLETION_PACKAGE_OFFICIAL.md` and `CODEX_IMPLEMENTATION_PROMPT_CANONICAL_HOMEPAGE.md` exist only as untracked local files — decide whether to commit them |
| 7 | M6 Search Indexing Launch | Kenji | Unchanged; sitemap, robots, Search Console all remain untouched and out of scope |

## 10. Evidence index

- PR #116 (baseline): merged 2026-08-01 by `kenjiphambht-svg`, commit `887a631`
- PR #117 (this work): branch `audit/homepage-index-readiness`, Draft
- Lighthouse JSON: generated 2026-08-02, `lighthouse@12.8.2`, mobile + desktop, production origin
- Production HTTP behaviour: `curl -sI` against both hostnames over HTTP and HTTPS, 2026-08-02
- Vercel project domains: read via Vercel API, project `prj_Okp2A6f4oiba8HxrHhQIat9WhDmR`
- Built HTML verification: `.next/server/pages/index.html` and `trang-chu-v2.html` after a clean `rm -rf .next && npm run build`
