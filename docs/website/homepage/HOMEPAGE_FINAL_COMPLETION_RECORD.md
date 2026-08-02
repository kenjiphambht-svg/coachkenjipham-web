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

# `/` = INDEX-READY LOCKED — NOINDEX PENDING FOUNDER ACTIVATION

All Homepage-scoped layers are complete and verified. The canonical-domain infrastructure action recorded here as O-07 was performed by the Founder on 02/08/2026 and **verified live in production** (§4) — apex serves 200, `www` returns a permanent 308 to apex, HTTP redirects to HTTPS apex, and no redirect loop exists at any entry point.

`noindex` is unchanged everywhere. No sitemap, robots, or Search Console action was taken. When the Founder later authorizes M6, activation should require only removing the `noindex` directive and re-verifying production — no content, SEO, domain, security, accessibility or performance retrofit remains outstanding for `/`.

**One code change lands with the merge of PR #117** — the `<link rel="canonical">` tag — verified in the PR's built HTML but not yet on production, since the PR is intentionally unmerged. Everything else in this record is already live. No copy change ships: the Signal Moment matches the Founder's final ruling exactly as production already renders it.

## 2. Founder Decisions of 02/08/2026 — reconciled into current truth

These supersede the corresponding rows of the earlier Editorial Completion Package. Recorded here so no later agent re-opens them as defects:

| # | Founder Decision (02/08/2026) | Status |
|---|---|---|
| 1 | Hero body line reads **"Vẫn trả lời những tin nhắn."** | Already matches production. No change needed. Earlier audit flagged this as drift — **withdrawn**. |
| 2 | Kenji section closing line reads **"Tôi giữ những khoảng lặng để bạn nhìn rõ điều đang diễn ra và nghe được chính mình."** | Already matches production. Earlier audit flagged this as drift — **withdrawn**. |
| 3 | S08 CTA reads **"Mời bạn đọc đầy đủ →"** | Already matches production. Earlier audit flagged this as drift — **withdrawn**. |
| 4 | S04 and S08 use the **current background images** (`two-paths-light-room.webp`, `not-promised-plaster-field.webp`) — Founder-approved. | Approved as-is. Earlier audit BLOCKER on "code background required" — **withdrawn**. Package §8.4/§8.5 and DoD #12/#13 are superseded on this point. |
| 5 | Signal Moment reads exactly **"Không phải mọi chương đều đẹp."** — **without** "vì". | Already matches production. **No change ships.** An interim instruction earlier on 02/08 had asked to insert "vì"; that edit was made and then **reverted in this same PR** once the Founder's final ruling landed, so nothing reaches production. Recorded in **C-15**. |
| 6 | Canonical domain is **`https://coachkenjipham.com`** (apex, no `www`); `www` redirects permanently to it. | Code layer applied (§3); infrastructure verified live (§4). Recorded as **L0 C-14**. |
| 7 | **Typography scope:** each page may keep its own rhythm and hierarchy; the site keeps the two approved base fonts (Cormorant Garamond + Inter); no new font; no global font redesign inside a page task. | Verified: `globals.css` imports exactly those two families and nothing else. No typography change ships in this PR. Recorded as **L0 C-16**. |

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

## 4. Canonical domain — infrastructure layer (RESOLVED 02/08/2026, verified live)

The Founder set `coachkenjipham.com` as the Vercel Primary Domain and configured `www` as a 308 permanent redirect. **Independently verified in production**, not taken on report:

| Entry point | Hops | Final URL | Final code |
|---|---|---|---|
| `https://coachkenjipham.com/` | **0** | `https://coachkenjipham.com/` | **200** ✅ |
| `https://www.coachkenjipham.com/` | 1 (**308** permanent) | `https://coachkenjipham.com/` | 200 ✅ |
| `http://coachkenjipham.com/` | 1 (308) | `https://coachkenjipham.com/` | 200 ✅ |
| `http://www.coachkenjipham.com/` | 2 (308 → 308) | `https://coachkenjipham.com/` | 200 ✅ |

**No redirect loop at any entry point** — every path converges on the apex in at most two hops, confirmed with `curl -L --max-redirs 10` reporting `num_redirects` and `url_effective`. The two-hop case (`http://www`) is the standard, unavoidable HTTP→HTTPS-then-host-normalisation sequence, not a misconfiguration.

**Internal navigation carries no redirect penalty:** all eight Homepage CTA destinations plus key assets (OG image, Hero images) return **200 with 0 redirects** directly on the apex.

**Historical record of the earlier state**, retained so the reasoning is not lost: before the fix, `https://coachkenjipham.com/` returned a **307 (temporary)** to `https://www.coachkenjipham.com/`, which served 200 — i.e. exactly backwards from C-14. That rule lived in the Vercel dashboard, not in `vercel.json` or `next.config.mjs`.

**Where the rule lives — verified, not assumed:** `vercel.json` contains exactly one redirect (`/old-path` → `/new-path`) and no host-based rule; `next.config.mjs` defines no `redirects`, `rewrites` or `headers`. The Vercel project (`prj_Okp2A6f4oiba8HxrHhQIat9WhDmR`, team `Kenji Pham's projects`) lists **both** hostnames as project domains. Host normalisation is therefore entirely a **Vercel dashboard domain setting**, and the repository correctly contains no host redirect.

**Why no code redirect was added — this remains the operating rule:** adding a `www → apex` rule to `vercel.json` on top of the dashboard's host normalisation risks a **redirect loop** if the dashboard rule is ever pointed the other way. The dashboard is the single source of host normalisation; the repository must stay out of it. **Do not add host-based redirects to `vercel.json`.**

**DNS:** no DNS record change was required or made — both hostnames already resolved to Vercel and both already served valid TLS.

## 5. HTTPS / TLS / security

| Check | Result |
|---|---|
| HTTPS enforced | ✅ Both hostnames 308 from HTTP to HTTPS |
| TLS certificate | ✅ Valid on **both** hostnames, verified via `openssl s_client`. Apex: `CN=coachkenjipham.com`, issuer Let's Encrypt, valid 17/07/2026 → 15/10/2026. `www`: `CN=www.coachkenjipham.com`, Let's Encrypt, same window. Separate Vercel-managed certificates, auto-renewing — `www` keeps its own valid certificate so the 308 redirect completes over TLS without a warning, which is the correct arrangement. |
| HSTS | ✅ Present: `strict-transport-security: max-age=63072000` (2 years) on production responses |
| HSTS `preload` / `includeSubDomains` | ⚠️ **Not enabled, and deliberately not enabled here.** Adding `preload` is effectively irreversible for a long period and `includeSubDomains` would bind every current and future subdomain to HTTPS-only. Both are site-wide, high-consequence changes that the task itself says to flag rather than self-apply. Recorded as a separate Kenji decision. |
| Mixed content | ✅ None — zero `http://` sub-resources in the rendered HTML |
| Security headers | `x-content-type-options: nosniff` present (from `vercel.json`). No CSP, `X-Frame-Options`, `Referrer-Policy` or `Permissions-Policy`. Lighthouse Best Practices scored **100/100** on both form factors regardless. Adding these is a **site-wide** header change affecting all 23 routes — out of Homepage scope, flagged not applied. |
| Secret / env exposure | ✅ None — no secret-shaped strings and no `NEXT_PUBLIC_*` values embedded in the rendered HTML; no `.env*` file is tracked in git |
| Preview / assets / routes | ✅ Unaffected — no config, route or asset change was made |

## 6. Lighthouse (production, `lighthouse@12.8.2`, headless Chrome, 02/08/2026)

Four runs: two against `www` before the domain flip, two against the apex after it.

| Category | Mobile (apex, final) | Desktop (apex, final) | Mobile (www, earlier) | Desktop (www, earlier) |
|---|---|---|---|---|
| Performance | 93 | 73 | 61 | 73 |
| **Accessibility** | **100** | **100** | **100** | **100** |
| **Best Practices** | **100** | **100** | **100** | **100** |
| SEO | 63 | 63 | 63 | 63 |

| Metric | Mobile (apex) | Desktop (apex) |
|---|---|---|
| First Contentful Paint | 2.1 s | 1.9 s |
| Largest Contentful Paint | 2.9 s | 2.7 s |
| **Cumulative Layout Shift** | **0** | **0** |
| **Total Blocking Time** | **0 ms** | **0 ms** |
| Speed Index | 2.8 s | 2.4 s |

**The mobile 61 → 93 swing must not be read as an improvement caused by the domain change, and is not claimed as one.** Both runs fetched the identical page over a direct 200 with no redirect hop (`www` was the primary at the time of the earlier run), issued the same **53** network requests, used the same `simulate` throttling, and hit the same single render-blocking resource — which in fact cost *more* in the faster run (1042 ms vs 791 ms). The difference is run-to-run variance in Lighthouse's simulated throttling, not a structural change. Desktop, measured under less aggressive throttling, returned an identical **73** both times, which is consistent with that reading. The honest summary is that mobile Performance for `/` currently measures somewhere in the **61–93** band depending on conditions, and the structural lever below is unchanged by the domain work.

**SEO 63 is not a defect.** The only failing SEO audit on either form factor is `is-crawlable` — *"Page is blocked from indexing"* — which is the intended, governed state under L0 C-02. Every other SEO audit passes. On the day indexing is activated, this score rises on its own with no code change.

**Accessibility 100 with no failing audits** on either form factor, including `color-contrast`, `image-alt`, `link-name`, `heading-order` and `html-has-lang` — this is the contrast evidence the task asked for.

**Font loading — system observation only, not a Homepage blocker.** Per **L0 C-16**, font *loading* performance is recorded as an observation and is explicitly **not** treated as a Homepage defect, and no optimisation task is opened here.

The observation, with evidence: `src/styles/globals.css` line 1 loads the two approved base families via `@import url('https://fonts.googleapis.com/css2?...')`, which Lighthouse classifies as render-blocking (~791 ms mobile in one run, ~1042 ms in another). The LCP element is the Hero background image, already `priority`-loaded; it paints late because the stylesheet gates first paint, not because the image is mishandled.

**Typography itself is correct and nothing is broken:** exactly the two approved families are loaded — Cormorant Garamond and Inter — with no third family anywhere, no missing-font fallback, no layout break at any tested viewport, **CLS 0** and **TBT 0 ms** on both form factors, and Accessibility 100 including `color-contrast`. Under C-16 each page keeps its own rhythm within those two fonts, so no cross-page hierarchy alignment is owed.

Any future change here would touch `globals.css`, a shared file governing all 23 routes and named in `AGENTS.md` / `PLAYBOOK.md` §5 exception (c) as requiring Kenji's prior approval. Recorded for whenever the Founder chooses to open it — deliberately not opened by this task.

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
| Links | ✅ All 8 Homepage CTA/nav destinations return **200 with 0 redirects on the apex**; no legacy `/kidbook` link anywhere |
| Canonical domain | ✅ Apex primary, `www` → 308 permanent, no loop, TLS valid on both (§4) |
| Single H1 | ✅ Exactly one, the Brand Signature Line |
| Horizontal overflow | ✅ None at 375 px or 1440 px |
| Console / runtime | ✅ No console errors, no hydration warnings on production |
| Analytics / tracking | ✅ NOT IMPLEMENTED — zero third-party requests, no tracking code; no privacy/consent mismatch possible |
| Bilingual readiness | VI complete and locked; EN not implemented (per instruction). Architecture notes retained in the audit document. |

## 9. Remaining system dependencies

**None block `/`.** Every item below is site-wide or organisational, not Homepage-scoped, and none of them require a Homepage change at M6 activation.

| # | Dependency | Owner | Required action |
|---|---|---|---|
| 1 | ~~Canonical domain flip~~ | — | ✅ **RESOLVED 02/08/2026** by the Founder and verified live (§4). Closed as O-07. |
| 2 | Font-loading performance — **system observation, not a dependency** (§6, L0 C-16) | Kenji, if and when he chooses | Nothing is owed. Typography is correct: the two approved base fonts, no new font, nothing broken. Recorded with evidence only; no optimisation task opened. |
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
