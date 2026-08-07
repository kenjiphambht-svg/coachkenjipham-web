# ROUTE STATE MATRIX

> **Authority:** L2 — Current Website Operating Truth
> **Status:** Active
> **Owner:** Kenji Phạm
> **Purpose:** Audited route-by-route implementation state, governed role and required action.
> **Decision scope:** Classification of actual and authority-named routes. **Non-decision scope:** Redirects, deletions, implementation, offer approval or indexing launch.
> **Governing basis:** [Conflict Register](../../governance/CONFLICT_REGISTER.md) C-01–C-08; [Site Journey Map](ESSENCE_SITE_JOURNEY_MAP.md); [Indexing Policy](INDEXING_POLICY.md).
> **Baseline evidence commit:** origin/main at a45e4242c0e68f52e0004ee8dd5d02745e4212dd; P1 re-baseline at 733b19900d3f8c471fb90cbd6f17bc4acf8b1332
> **Last verified:** 733b19900d3f8c471fb90cbd6f17bc4acf8b1332
> **Review:** Route, CTA, robots, sitemap, redirect or Founder Decision trigger; otherwise 90 days.

## Classification legend

Implemented means a source page exists. It does not mean canonical, approved, indexed, or safe for a new journey. Observed robots is source evidence only; governed index is the required state under L0/M6 policy.

Kenji Phạm owns every Founder Decision and approval gate. “Scoped task” in the final column means a separate task with Kenji approval; no row authorizes the runtime action it records.

| Route | Source/evidence | Current implementation | Canonical role / journey | Visibility and indexing | CTA / flow observation | Governing basis / gap / next action |
|---|---|---|---|---|---|---|
| / | src/pages/index.tsx → src/components/homepage/VillaPage.tsx | Implemented canonical Villa (P1 cutover, PR #112 at 733b199) | **L0 C-01:** canonical Villa public route; public-entry membership | Observed noindex (P1); governed noindex until M6 | Adult door → /ban-sac-cua-ban; parent door → /ban-sac-cua-con; trust links; no /kidbook CTA. | R-01 resolved by PR #112: legacy stub and its /kidbook CTA removed. |
| ~~/trang-chu-v2~~ | ~~src/pages/trang-chu-v2.tsx → src/components/homepage/VillaPage.tsx~~ | **RETIRED / REMOVED (07/08/2026)** — source file deleted; route no longer exists. | N/A — was never canonical | N/A — route does not exist | N/A | **L0 C-19**, superseding C-01's prior "pending disposition" framing. `VillaPage.tsx` no longer accepts a dual-route `pageUrl` prop; it self-renders only at `/`. |
| /ban-sac-cua-ban | src/pages/ban-sac-cua-ban.tsx | Implemented adult hub | Adult discovery; L2 journey node | Observed noindex; governed noindex pre-M6 | Cards → /ban-la-duy-nhat, /lang-90, /dau-an-cua-ban. | Only Lặng has L0 flow. Other cards are rendered offer candidates. |
| /lang-90 | src/pages/lang-90/index.tsx; src/components/lang-90/Lang90Cinematic.tsx | Implemented | Lặng discovery, adult journey | Observed noindex; governed noindex pre-M6 | CTA → /lang-90/dat-phien. | **L0 C-05.** Capacity 5/month; no direct-checkout inference. |
| /lang-90/dat-phien | src/pages/lang-90/dat-phien.tsx | Implemented six-question client-side intake | Private operation, not public sitemap | Observed noindex; governed noindex | Writes intake to sessionStorage, routes to confirmation. | R-02: source skips required Human Decision Gate. Scoped sensitive-data task. |
| /lang-90/xac-nhan | src/pages/lang-90/xac-nhan.tsx | Implemented confirmation/payment instruction page | Private operation, not public sitemap | Observed noindex; governed noindex | Legacy-Gmail mailto, static VietQR placeholders; no private booking link. | R-03: L0 requires Kenji payment confirmation then private booking; no backend/booking implementation. |
| /ban-sac-cua-con | src/pages/ban-sac-cua-con.tsx | Implemented parent hub | Parent discovery; Hạt Mầm 0–7 is the only L0-approved child offer | Observed noindex; governed noindex pre-M6 | Links all three age landing pages. | R-04: 7–14 and 14–21 links are rendered but not approved active offers. |
| /an-pham-ban-sac-hat-mam | src/pages/an-pham-ban-sac-hat-mam.tsx; src/components/landing-hat-mam/Room6Decision.tsx | Implemented landing | Hạt Mầm 0–7 discovery | Observed noindex; governed noindex pre-M6 | Package CTAs → external Tally URLs. | **L0 C-06:** new form/payment/confirmation/delivery/email flow required; current chain is not canonical. |
| /an-pham-ban-sac-kham-pha | src/pages/an-pham-ban-sac-kham-pha.tsx; src/config/khamPhaLaunch.ts; src/components/landing-kham-pha/Room5KenjiPackagesKP.tsx | Implemented preview; LINE_STATUS is preview | Planned child offer only | Observed noindex; governed noindex | Form URL fields are empty; preview registration falls back to legacy-Gmail mailto. | No L0 active-offer approval; do not infer launch/pricing. |
| /an-pham-ban-sac-giao-mua | src/pages/an-pham-ban-sac-giao-mua.tsx; src/config/giaoMuaLaunch.ts; src/components/landing-giao-mua/Room5KenjiPackagesGM.tsx | Implemented preview; LINE_STATUS is preview | Planned child offer only | Observed noindex; governed noindex | Form URL fields are empty; preview registration falls back to legacy-Gmail mailto. | No L0 active-offer approval; do not infer launch/pricing. |
| /kidbook | src/pages/kidbook.tsx | Legacy live sales funnel | Explicitly outside new journey | Observed: no robots directive; no new-journey action is authorized | External Tally forms and legacy payments. | **L0 C-03.** Preserve; no redirect, new CTA, migration or replacement assertion. |
| /thanh-toan-goi-1 | src/pages/thanh-toan-goi-1.tsx | Legacy live payment instruction | Private legacy operation; excluded from new journey | Observed noindex; governed noindex | Static QR/manual transfer; returns to /kidbook. | **L0 C-03.** No runtime change in G1. |
| /thanh-toan-goi-2 | src/pages/thanh-toan-goi-2.tsx | Legacy live payment/disabled booking UI | Private legacy operation; excluded from new journey | Observed noindex; governed noindex | Static QR; booking control disabled; returns to /kidbook. | **L0 C-03.** Booking UI is not a canonical booking system. |
| /ban-la-duy-nhat | src/pages/ban-la-duy-nhat.tsx | Implemented preview/registration page | Adult offer candidate; not canonical active offer | Observed noindex; governed noindex | Email-only mailto registration. | Planned/Missing approved offer contract; no price/flow approval inferred. |
| /dau-an-cua-ban | src/pages/dau-an-cua-ban.tsx | Implemented preview/registration page | Adult offer candidate; not canonical active offer | Observed noindex; governed noindex | Email-only mailto registration. | Planned/Missing approved offer contract; no price/flow approval inferred. |
| /ve-kenji | src/pages/ve-kenji.tsx | Implemented identity/trust page | Supporting trust node | Observed noindex, nofollow; governed noindex pre-M6 | Links adult/parent hubs, method, boundary and contact. | C-07 governs exact identity. Page Contract remains task-provided. |
| /phuong-phap | src/pages/phuong-phap.tsx | Implemented method/trust page | Supporting trust node | Observed noindex, nofollow; governed noindex pre-M6 | Links privacy, identity and boundary pages. | No method/title inference beyond L0/task-approved copy. |
| /dieu-essence-khong-hua | src/pages/dieu-essence-khong-hua.tsx | Implemented boundary/trust page | Supporting trust node | Observed noindex; governed noindex pre-M6 | Links identity and method. | Public boundary evidence; not a conversion flow. |
| /chinh-sach-rieng-tu | src/pages/chinh-sach-rieng-tu.tsx | Implemented privacy page | Required trust/legal support node | Observed: no robots directive; governed noindex pre-M6 | Links contact; legacy Gmail is rendered. | R-05: reconcile policy/contact with actual operations in a scoped privacy task. |
| /lien-he | src/pages/lien-he.tsx | Implemented contact form | Support node, not canonical product flow | Observed noindex; governed noindex pre-M6 | Form constructs legacy-Gmail mailto; also links partner asset. | R-06: no backend receiver; L0 public contact is contact@coachkenjipham.com. |
| /ai-startup | src/pages/ai-startup.tsx; src/components/ai-startup/Room7ClosingAccess.tsx | Implemented partner dossier | Partner asset; outside consumer journey | Observed: no robots directive. **L0:** noindex. | Partner mailto early-access contact. | R-07: scoped noindex/rewrite task; do not place in consumer navigation. |
| /404 | src/pages/404.tsx | Implemented technical not-found page | Technical fallback; not a canonical journey node | No observed robots directive; never a sitemap node | CTA → /. | Technical route only; no indexing or journey action. |
| /old-path | vercel.json | Configured permanent redirect | Technical legacy alias; no canonical journey role | Not a source page; M6 review required | Redirects → /new-path. | R-08: destination has no source route in baseline; verify before relying on redirect. |
| /new-path | vercel.json; no page source found | No source page observed | Unknown | Unknown | Redirect target only | Do not infer existence; runtime verification required. |
| /ve-essence | No page source; historical evidence: docs/website/master-plan/02_PUBLIC_SITEMAP_AND_ROUTE_POLICY.md | Planned/Missing | Historical trust/partner candidate; no current approval | Not implemented; no indexing action | None | Requires approved Page Contract and scoped task. |
| /goc-doc | No page source; historical evidence: docs/website/master-plan/02_PUBLIC_SITEMAP_AND_ROUTE_POLICY.md | Planned/Missing | Historical knowledge-hub candidate; no current approval | Not implemented; no indexing action | None | Requires approved Page Contract and M6 policy. |
| /an-pham/[random-slug] | No dynamic page source; planned evidence: docs/website/master-plan/06_PRODUCT_DELIVERY_PRIVATE_PUBLICATION_SYSTEM.md | Planned/Missing private delivery | Private only; architecture not approved by G1 | Must be noindex and excluded from sitemap | None | Requires child/privacy, delivery and access-control task. |
| /admin/* | No page source; historical evidence: docs/website/master-plan/02_PUBLIC_SITEMAP_AND_ROUTE_POLICY.md | Planned/Missing internal route family | Historical internal candidate; no current approval | Must not be public/indexed | None | Requires explicit authority and security scope. |

## Audit completeness

- 21 concrete source page routes were found under src/pages, plus the technical /404 page; _app and _document are framework wrappers, not URL rows.
- The matrix has 28 rows: 22 source-served routes (including /404), /old-path and its unresolved /new-path target, and four governance- or historical-evidence-named planned/internal candidates.
- No dynamic route file, API route, robots file, sitemap file, Next.js rewrite, or sitemap implementation was found.
- vercel.json contains one redirect only: /old-path → /new-path.
- Shared links in HomeHeader, HomeFooter, Lang90Cinematic and landing components were included in the audit.
- **P1 re-baseline (733b199):** / and /trang-chu-v2 now render the single shared src/components/homepage/VillaPage.tsx; HomeHeader logo/menu home links resolve to /; both routes emit noindex. No other row changed at P1.
- **07/08/2026 update (L0 C-19):** `/trang-chu-v2` retired and its source file deleted. Route count drops by one (20 concrete source page routes, not 21; the matrix now has 27 rows, not 28) — the counts and prose above are left as the P1-baseline historical record and not renumbered in place, per this doc's own point-in-time baseline convention.
