# PAGE PORTFOLIO AND TRANSFORMATION BLUEPRINT

> **Authority:** L2 — Current Website Operating Truth
> **Status:** Active
> **Owner:** Kenji Phạm
> **Purpose:** Portfolio-wide transformation classification, approval gates, execution sequence and page-brief seeds derived from the current website audit.
> **Decision scope:** Transformation class, relative sequence, dependencies, risks, approval gates and brief seeds. **Non-decision scope:** Runtime/public-copy change, Founder Decision, offer contract, Page Contract, price, payment, booking, data architecture, redirect, deletion, indexing or deployment approval.
> **Governing basis:** [Conflict Register](../../governance/CONFLICT_REGISTER.md) C-01–C-12; [Site Journey Map](ESSENCE_SITE_JOURNEY_MAP.md); [Route State Matrix](ROUTE_STATE_MATRIX.md); [Offer State Matrix](OFFER_STATE_MATRIX.md); [Indexing Policy](INDEXING_POLICY.md).
> **Baseline evidence commit:** origin/main at a45e4242c0e68f52e0004ee8dd5d02745e4212dd; P1 re-baseline at 733b19900d3f8c471fb90cbd6f17bc4acf8b1332
> **Last verified:** 733b19900d3f8c471fb90cbd6f17bc4acf8b1332
> **Review:** Founder Decision, material page/route/offer/dependency change, or 90 days.

## 1. How to use this blueprint

This document turns the G1 audit into an approval-gated execution plan. It does not approve code work. Before implementation, the task must supply the Page Contract, exact copy and every approval named in the relevant row or brief seed.

The portfolio contains **28 route nodes**:

- 22 source-served routes, including `/404`;
- two technical redirect nodes, `/old-path` and its unresolved target `/new-path`;
- four Planned/Missing route families named by governance or historical evidence.

The transformation sequence sits **under the active M0–M6 roadmap**. It neither replaces that roadmap nor revives the superseded 13-phase roadmap. M6 indexing remains a separately approved final gate.

### Evidence and verification limit

Classification combines baseline source/configuration inspection, the four other G1 current-truth documents and a rendered first-viewport preview of representative public pages at desktop and mobile sizes. The preview supports composition and obvious responsive-risk observations; it is **not** full-page interaction, accessibility, performance, device or production QA. Every implementation package must repeat rendered, responsive, keyboard, content and production verification.

### Transformation classes

| Class | Meaning |
|---|---|
| **KEEP / REFINE** | Preserve the route and core structure; correct bounded content, state, navigation, accessibility or responsive issues. |
| **RESTRUCTURE** | Keep the route but materially reorganize its information, interaction or operating truth. |
| **REBUILD** | Replace the current implementation under a new approved Page Contract. |
| **MIGRATION SOURCE** | Evidence to adapt into another canonical route; not an independent public destination to optimize. |
| **PRIVATE FLOW REBUILD** | Rebuild a non-public operational sequence with privacy and Human Decision Gates. |
| **HOLD** | Do not implement or activate until the stated authority/dependency exists. |
| **LEGACY CONTAINMENT** | Preserve outside the new journey; do not reuse, migrate, promote or infer authority. |
| **PARTNER ASSET** | Keep independent from consumer navigation and conversion. |
| **TECHNICAL HOLD** | Resolve ownership or target truth before changing technical behavior. |
| **PLANNED/MISSING** | No executable page exists or no current approval exists. |

“Ready” below means ready to become a scoped task after its named approvals. It never means approved for runtime work.

## 2. Portfolio transformation matrix

| Route(s) | Role / audience | Maturity, implementation quality and authority readiness | Class / priority | Problem → required visitor or operating outcome | Dependencies, risk, action and approval gate |
|---|---|---|---|---|---|
| `/` | Canonical Villa; adults, parents and trust-seeking public visitors | Canonical Villa implemented through shared `VillaPage.tsx` (P1); QA passed at 375/768/1440; noindex preserved | **REBUILD — P1, COMPLETED (PR #112 at 733b199)** | ~~Ambiguous “coming soon” and sole legacy CTA~~ → resolved: clear adult/parent/trust doors render at root | Historical gate satisfied by the P1 package (approved Villa material, shared-header scope, noindex preservation). Remaining root work follows normal page tasks. |
| ~~`/trang-chu-v2`~~ | ~~Non-canonical Villa migration evidence; same public audience~~ | N/A — file deleted | **RETIRED — 07/08/2026 (L0 C-19)** | The "post-cutover disposition decision" this row was waiting on is now resolved: retirement, not further containment. | Route removed. `VillaPage.tsx` simplified to a single-route contract (no more `pageUrl` prop). No redirect was requested or added. |
| `/ban-sac-cua-ban` | Adult discovery hub | Recent, strong editorial structure; rendered desktop hierarchy is coherent but mobile preview shows clipping/overflow risk; L2 journey role clear; offer-state claims remain conditional | **REFINE — P4** | Three attractive options can imply equal readiness → explicit active/planned state and bounded next action | Gate: approved availability language and offer contracts. Preserve discovery role; correct responsive/keyboard/CTA clarity. Do not activate unapproved offers. |
| `/lang-90` | Public Lặng discovery for adults | Mature public composition; core structure reusable; downstream flow violates C-05 | **KEEP / REFINE — P4** | Strong landing leads directly into a non-conforming flow → honest capacity/CTA state leading only to an approved private flow | Dependency: P3 private flow, exact capacity and CTA approval. Preserve structure where it survives Page Contract review. No direct-checkout inference. |
| `/lang-90/dat-phien` | Private six-question adult intake | Implemented but client-side; high sensitive-data and operating risk; not authority-ready | **PRIVATE FLOW REBUILD — P3, blocked** | `sessionStorage` intake proceeds without support report/Human Decision Gate → safe intake followed by Kenji review | Gate: sensitive-data design, support-report contract, receiver/storage/retention rules, exact crisis copy and C-05 flow approval. Never public sitemap. |
| `/lang-90/xac-nhan` | Private review/payment/booking continuation | Placeholder/manual evidence; no approved backend, confirmation state or booking link | **PRIVATE FLOW REBUILD — P3, blocked** | Static QR/legacy mailto implies premature confirmation → Kenji-approved applicant, payment, Kenji confirmation, then private booking link | Gate: Human Decision state, payment provider/process, confirmation authority, private booking, exact support copy. Never public sitemap. |
| `/ban-sac-cua-con` | Parent discovery hub | Recent, strong child-safe framing; route quality high; mobile preview shows clipping/overflow risk; availability truth conditional | **REFINE — P6** | Three age routes can look equally actionable → only Hạt Mầm 0–7 may become active, and only after its new flow is ready | Gate: approved availability state and C-06-compliant downstream flow. Preserve observation-before-labeling. Validate responsive/keyboard clarity. |
| `/an-pham-ban-sac-hat-mam` | Public Hạt Mầm 0–7 discovery | Content implementation is substantial, but the rendered opening is comparatively sparse and mobile preview shows clipping risk; current Tally/schema/flow is not canonical | **RESTRUCTURE + HOLD ACTIVATION — P6, blocked** | Legacy Tally and commercial claims imply a ready offer → approved public explanation and CTA into a wholly new child-safe flow | Gate: C-06 form/payment/confirmation/delivery/email architecture, child-data contract, price/offer/Page Contract, schema truth. No legacy funnel reuse. |
| `/an-pham-ban-sac-kham-pha` | Preview for a possible 7–14 child line | Implemented preview with placeholders/empty form URLs; no active-offer authority | **HOLD — P7, blocked** | Rendered preview can be mistaken for an available offer → remain clearly unavailable until independently approved | Gate: Founder Decision, offer/Page Contract, child privacy/autonomy and complete delivery/CTA specification. Do not infer timing or price. |
| `/an-pham-ban-sac-giao-mua` | Preview for a possible 14–21 line | Implemented preview with placeholders/empty form URLs; age/autonomy contract unresolved | **HOLD — P7, blocked** | Rendered preview can be mistaken for an available offer → remain clearly unavailable until independently approved | Gate: Founder Decision, offer/Page Contract, consent/autonomy/privacy and complete delivery/CTA specification. |
| `/ban-la-duy-nhat` | Adult offer candidate | Implemented preview; placeholder/claim-heavy; no active-offer contract | **HOLD — P7, blocked** | Price/delivery/mailto can imply a live offer → no activation until commercial and operating truth is approved | Gate: Founder-approved offer contract, price, delivery, data, CTA and Page Contract. |
| `/dau-an-cua-ban` | Adult offer candidate | Implemented preview; placeholder/timeline claims; no active-offer contract | **HOLD — P7, blocked** | Session/delivery/mailto can imply a live offer → no activation until commercial and operating truth is approved | Gate: Founder-approved offer contract, price, booking/delivery, data, CTA and Page Contract. |
| `/ve-kenji` | Primary public identity/trust page | Strong recent structure; identity/schema wording needs exact C-07 alignment | **KEEP / REFINE — P2b** | Good trust page contains shortened organization wording → exact approved identity and evidence-backed claims | Gate: exact C-07 and approved claims. Any new Kenji portrait uses FLUX.1 + Kenji LoRA. No credential inference. |
| `/phuong-phap` | Method/trust explanation | Mature structure; claims require authority trace | **KEEP / REFINE — P2b** | Method explanation may outrun governed evidence → clear method, limits and links without inflated claims | Gate: approved Page Contract/claims and exact identity/entity wording. Preserve scannability. |
| `/dieu-essence-khong-hua` | Boundary/trust page | Serviceable and well placed; some absolute privacy/AI language may exceed operations | **KEEP / REFINE — P2b** | Strong promises can conflict with actual handling → operationally true, plain-language boundaries | Gate: approved boundary copy, C-11 and verified privacy operations. |
| `/chinh-sach-rieng-tu` | Privacy/legal support | Serviceable copy; implementation and contact truth are inconsistent; observed noindex gap | **RESTRUCTURE — P2a, blocked** | Policy statements are not fully reconciled to actual systems → accurate data map, rights, contact and retention disclosure | Gate: legal/operational review, data inventory, C-08 receiver decision and explicit pre-M6 noindex task. |
| `/lien-he` | General support, not an offer | Form is a client-side mailto to legacy Gmail and can imply successful submission | **RESTRUCTURE — P2a, blocked** | Unreliable contact state → honest, accessible contact path to the approved public receiver | Gate: C-08 receiver and either backend specification or explicit honest-mailto contract; privacy/error/success behavior. Keep partner link separate. |
| `/kidbook` | Legacy child sales funnel | Live legacy implementation; explicitly outside the new journey | **LEGACY CONTAINMENT — excluded** | Legacy continues to exist → no new journey, CTA, migration or authority derived from it | Preserve. Any child-data, privacy, noindex or retirement action requires its own approved task. |
| `/thanh-toan-goi-1` | Legacy private payment instruction | Live manual/static payment evidence; not reusable | **LEGACY CONTAINMENT — excluded** | Historical payment surface → remain outside new flows | Preserve. Payment/privacy remediation requires a separate task; never link from new journey. |
| `/thanh-toan-goi-2` | Legacy private payment/disabled booking | Live placeholder/manual evidence; not a canonical booking system | **LEGACY CONTAINMENT — excluded** | Historical payment/booking UI → remain outside new flows | Preserve. No inference of provider, booking or delivery authority. |
| `/ai-startup` | Independent partner dossier | Implemented; consumer separation is L0, rewrite/noindex gaps remain | **PARTNER ASSET — hold rewrite** | Partner narrative can leak into consumer journey and lacks observed noindex → isolated, explicitly noindex partner evidence | Gate: scoped partner Page Contract/rewrite and explicit runtime noindex approval. Do not add to consumer navigation. |
| `/404` | Technical recovery page | Implemented but generic/English and visually outside the governed shell | **REFINE TECHNICAL — P8** | Dead end → concise Vietnamese recovery into canonical root/discovery | Dependency: final Villa/shared shell. Gate: technical Page Contract; no sitemap role. |
| `/old-path` | Configured legacy redirect alias | Runtime config exists; ownership/meaning unknown | **TECHNICAL HOLD — P8, blocked** | Permanent redirect points to an unresolved target → verified target or explicit retirement decision | Gate: route owner, destination decision and runtime verification. G1 does not edit config. |
| `/new-path` | Unresolved redirect target | No source page observed; not authority-ready | **TECHNICAL HOLD — P8, blocked** | Target is assumed by config but absent in source → define or replace only under an approved route decision | Gate: route owner/Page Contract or redirect correction scope. |
| `/ve-essence` | Historical trust/partner candidate | No source route and no current Page Contract | **PLANNED/MISSING — future** | Historical name only → remain absent until role and overlap are approved | Gate: Founder-approved role, Page Contract and relationship to current trust/partner nodes. |
| `/goc-doc` | Historical knowledge-hub candidate | No source route, content model or M6 decision | **PLANNED/MISSING — future** | Historical name only → remain absent until editorial system exists | Gate: Page Contract, content governance, ownership and M6 inclusion policy. |
| `/an-pham/[random-slug]` | Possible private publication delivery family | No dynamic source/access architecture | **PLANNED/MISSING PRIVATE — future** | Guessable route concept without protection → secure, private delivery only if approved | Gate: access control, non-guessability, child/privacy, delivery and noindex architecture. Never public sitemap. |
| `/admin/*` | Possible internal operations family | No source/security authority | **PLANNED/MISSING INTERNAL — future** | Historical route idea → remain absent until an internal operating need and security model are approved | Gate: explicit authority, authentication/authorization, audit, privacy and deployment scope. Never public sitemap. |

### Classification count

The count is node-based and totals 28:

| Class | Nodes |
|---|---:|
| REBUILD | 1 |
| MIGRATION SOURCE | 1 |
| KEEP / REFINE (including one technical refine) | 7 |
| RESTRUCTURE | 3 |
| PRIVATE FLOW REBUILD | 2 |
| HOLD offer candidates | 4 |
| LEGACY CONTAINMENT | 3 |
| PARTNER ASSET | 1 |
| TECHNICAL HOLD | 2 |
| PLANNED/MISSING | 4 |

### Cross-page quality and reuse findings

- Newer systems show useful semantic headings, labelled navigation, decorative `aria-hidden` use and deliberate image alt handling. However, route-level QA must still verify visible keyboard focus, reduced motion, overlay focus trap/Escape/focus return, heading order and contrast.
- Responsive intent exists through bounded containers, responsive grids and viewport units, but no source pattern is a substitute for testing at 320–390px. Long headings, dense narrative, fixed/sticky layers and Hạt Mầm’s wide package table are priority overflow risks.
- Shared leverage is highest in `HomeHeader`, `HomeFooter`, typography primitives, reveal systems and room-based landing patterns. A shared-component edit can regress multiple routes, so the implementation task must name its shared-file scope; otherwise prefer bounded page-local adaptation.
- Homepage/Lặng assets show stronger composition and alt discipline than several older landing/trust/legacy surfaces. Every page still needs an explicit Page Mode, image authority and Signal Moment decision; image presence is not visual-system compliance.

## 3. Approval-gated execution sequence

This is a dependency sequence, not permission to start code:

1. **P1 — Canonical Villa Cutover — COMPLETED (PR #112 at 733b199):** `/` renders the canonical Villa through the shared `VillaPage.tsx`; shared home links corrected; `/trang-chu-v2` contained and noindex at the time. **Update 07/08/2026 (L0 C-19):** the post-cutover disposition this step deferred is now resolved — `/trang-chu-v2` is retired and removed, not merely contained.
2. **P2 — Trust Foundation:** first reconcile `/chinh-sach-rieng-tu` and `/lien-he` with actual operations (P2a), then refine `/ve-kenji`, `/phuong-phap` and `/dieu-essence-khong-hua` (P2b).
3. **P3 — Lặng Private Flow:** rebuild the two private steps to exact C-05, sensitive-data and Human Decision Gate requirements.
4. **P4 — Adult Discovery:** refine `/ban-sac-cua-ban` and `/lang-90`; activate the Lặng CTA only toward the conforming P3 flow.
5. **P5 — Hạt Mầm Private Chain:** design and build the wholly new C-06 form → payment → confirmation → delivery → email chain.
6. **P6 — Parent Discovery:** refine `/ban-sac-cua-con` and restructure the Hạt Mầm public landing; activate only after P5 passes.
7. **P7 — Held Offer Candidates:** treat each candidate as an independent future decision; no assumed order or shared approval.
8. **P8 — Technical Housekeeping:** refine `/404` and resolve `/old-path` → `/new-path` only after route ownership is decided.
9. **M6 — Search Indexing Launch:** remains last, separate and Founder-approved; no preceding package opens indexing.

Urgent observed gaps—root/partner noindex inconsistency, the non-conforming Lặng flow and visible crisis/payment placeholders—are approval-gated runtime risks. G1 records them; it does not silently remediate them.

## 4. Page-brief seeds for executable packages

These are seeds, not Page Contracts. A runtime task must replace every “task-approved” item with exact approved content and implementation decisions.

### P1 — Canonical Villa Cutover (`/`)

| Brief field | Seed |
|---|---|
| Role | Canonical public routing hall. |
| Audience | Adults, parents and visitors establishing trust. |
| Desired visitor shift | From an ambiguous “coming soon” state to one calm, clear choice: self, child or trust. |
| Primary message | Exact task-approved homepage message; do not invent or silently promote V2 copy to authority. |
| Primary CTA state | Adult hub, parent hub and contextual trust links. No `/kidbook`, direct offer or payment CTA. |
| Required sections/functions | Canonical header; opening orientation; two discovery doors; trust anchors; accessible footer/contact; shared logo/home links resolve to `/`. |
| Content authority | C-01, C-02, C-07, C-08; approved root Page Contract and copy. `/trang-chu-v2` is implementation evidence only. |
| Image mode | Preserve approved V2 assets if the Page Contract permits. New Kenji portraits: FLUX.1 + Kenji LoRA. New non-Kenji imagery: FLUX.2 Klein 9B. |
| Typography mode | Canonical five-role composition system; exactly one Signal Moment. Run Type Lab only for a material typography change. |
| Dependencies | Root Page Contract, exact metadata/copy, shared-header scope, asset approval, explicit noindex preservation, post-cutover V2 containment decision. |
| Non-goals | No V2 redirect/deletion, global design-system rewrite, offer activation, child/payment/form/backend work, sitemap, robots or indexing opening. |
| Definition of Done | `/` renders the approved Villa; exact C-07; all shared home links return to `/`; adult/parent doors work; no legacy CTA; keyboard/focus/contrast and desktop/mobile overflow checks pass; governed noindex remains; `/trang-chu-v2` remains contained/noindex; production build and rendered link/meta QA pass. |

> **07/08/2026 update (L0 C-19):** the table above records the P1 contract as it stood at completion (PR #112, 733b199) — left as the historical record, not rewritten. What has since changed: `/trang-chu-v2`'s "post-cutover disposition" (Content authority, Dependencies and Definition of Done rows) is no longer pending — it is **retired and removed**, superseding the "keep contained" framing in those rows. The P1-era Non-goal "no V2 redirect/deletion" applied to the P1 task specifically; it does not bind this later, separately-approved retirement task.

**Why first:** it fixes the only canonical-entry bottleneck, removes the root’s active path into legacy, reuses the most mature available implementation evidence and unlocks coherent navigation without waiting for offer backends.

### P2a — Privacy and Contact Foundation

| Brief field | Seed |
|---|---|
| Role | Operational privacy and contact trust foundation. |
| Audience | Anyone considering contact, intake or purchase. |
| Desired visitor shift | From uncertainty about where data/message goes to a truthful understanding of handling, rights and response path. |
| Primary message | Exact task-approved operational truth; do not convert policy assumptions into promises. |
| Primary CTA state | Contact only through the C-08-approved receiver and accurately represented mechanism. |
| Required sections/functions | Data inventory and purpose, sensitive/child-data boundaries, retention/rights/contact; honest form success/error behavior or explicit mailto behavior. |
| Content authority | C-08, verified real operations and approved legal/privacy copy. |
| Image mode | Prefer no image unless it improves comprehension; any non-Kenji image uses FLUX.2 Klein 9B. |
| Typography mode | Functional support composition using the canonical roles; clarity outranks cinematic pacing. |
| Dependencies | Verified systems, receiver, retention, processors, incident/contact flow, legal review and explicit pre-M6 noindex handling. |
| Non-goals | No new offer, CRM/provider invention, consent dark pattern, indexing launch or partner-to-consumer blending. |
| Definition of Done | Policy matches deployed handling; contact reaches the approved receiver or states the manual mechanism honestly; privacy/error/success states are accessible; no sensitive data appears in URL/client logs; rendered noindex and links pass. |

### P2b — Identity, Method and Boundary Trust Suite

| Brief field | Seed |
|---|---|
| Role | Identity, method and boundary trust suite. |
| Audience | Visitors deciding whether Kenji and Essence are credible, suitable and ethically bounded. |
| Desired visitor shift | From cautious curiosity to informed trust without inflated authority or certainty. |
| Primary message | Exact C-07 identity plus evidence-backed method and limits. |
| Primary CTA state | Contextual links to discovery/contact, not hard conversion. |
| Required sections/functions | Consistent identity block, claim provenance, method explanation, boundaries, cross-links and accessible navigation. |
| Content authority | C-07, C-10, C-11 and approved Page Contracts/claims. |
| Image mode | Kenji imagery only via FLUX.1 + Kenji LoRA; non-Kenji supporting imagery via FLUX.2 Klein 9B. |
| Typography mode | Canonical composition roles and one Signal Moment per page. |
| Dependencies | P2a operational truth where privacy/confidentiality is mentioned; claim review; C-07 entity/schema alignment. |
| Non-goals | No new credential, neuroscience/AI guarantee, diagnosis, offer activation or indexing. |
| Definition of Done | Exact C-07 is consistent in visible copy and approved metadata/schema scope; claims trace to authority; boundaries match operations; keyboard/mobile/readability and link QA pass. |

### P3/P4 — Lặng Public Discovery and Private Flow

| Brief field | Seed |
|---|---|
| Role | Public Lặng orientation plus a private application/review/payment/booking sequence. |
| Audience | Adults considering one bounded 1:1 session. |
| Desired visitor shift | From pressure and uncertainty to a bounded application, then a human-reviewed next step. |
| Primary message | Exact task-approved Lặng copy; maximum five sessions/month. |
| Primary CTA state | Apply for consideration; never promise acceptance or direct checkout. |
| Required sections/functions | Public capacity/state; six-question private intake; support report; Kenji Human Decision Gate; approved payment; Kenji payment confirmation; private booking link. |
| Content authority | C-05, approved Lặng Page Contract and exact crisis/support copy. |
| Image mode | Preserve approved existing assets if the Page Contract permits; new Kenji/non-Kenji imagery follows the split image authority. |
| Typography mode | Preserve the approved Lặng composition where valid; keep application status and next action plainly readable. |
| Dependencies | Sensitive-data minimization, storage/retention/receiver, support-report contract, human-review states, payment and private-booking approval. |
| Non-goals | No automated acceptance, public applicant data, client-only sensitive record, public booking URL, unapproved provider or indexing. |
| Definition of Done | Exact C-05 sequence is technically enforced; decline/wait/accept states are truthful; payment cannot precede approval; booking cannot precede Kenji payment confirmation; private routes are noindex and absent from sitemap; security, accessibility, error/recovery, build and rendered end-to-end QA pass. |

### P5/P6 — Parent Discovery and Hạt Mầm New Chain

| Brief field | Seed |
|---|---|
| Role | Parent discovery and the canonical 0–7 Hạt Mầm public/private journey. |
| Audience | Parents or guardians of children age 0–7. |
| Desired visitor shift | From wanting a label for the child to careful observation, informed consent and a safe next step. |
| Primary message | Exact approved 0–7 copy; Hạt Mầm is the only L0-approved child line. |
| Primary CTA state | Enter only the new C-06 flow when it is approved and ready; otherwise state unavailable honestly. |
| Required sections/functions | Clear active/planned age state; child-safe public explanation; new form; approved payment; confirmation; protected delivery; email; recovery/support states. |
| Content authority | C-06, Security/Privacy/Child Data Policy and approved offer/Page Contracts. |
| Image mode | Non-Kenji child/family imagery uses FLUX.2 Klein 9B; no diagnostic or deterministic visual symbolism. |
| Typography mode | Canonical composition roles with direct age, privacy, availability and next-step information outside narrative effects. |
| Dependencies | Child-data minimization/consent/retention, offer/price, payment, confirmation, access-controlled delivery, email, exact schema and parent support. |
| Non-goals | No legacy Tally/payment reuse, deterministic child labels, 7–14 or 14–21 activation, public child data, guessable delivery route or indexing of private steps. |
| Definition of Done | Only approved availability is visible; public CTA cannot enter legacy; full C-06 chain succeeds and recovers safely; child data is protected server-side under the approved model; private routes are non-guessable/noindex/absent from sitemap; accessibility, content, security, build and rendered end-to-end QA pass. |

### P8 — Technical Recovery Package

| Brief field | Seed |
|---|---|
| Role | Technical recovery and redirect-truth package. |
| Audience | Visitors arriving at an unknown route and operators resolving the stale redirect. |
| Desired visitor shift | From a dead end to a clear return to the canonical Villa or discovery route. |
| Primary message | Concise task-approved Vietnamese recovery language. |
| Primary CTA state | Canonical root as the primary return; approved discovery links only if useful. |
| Required sections/functions | Essence shell, status clarity, accessible links; explicit decision for `/old-path` and `/new-path`. |
| Content authority | Approved technical Page Contract and current route truth. |
| Image mode | No image required; if used, non-Kenji imagery follows FLUX.2 Klein 9B. |
| Typography mode | Functional canonical roles; error status and recovery action must be immediate. |
| Dependencies | Final P1 shell, route owner, redirect-target decision and production behavior evidence. |
| Non-goals | No public sitemap entry, historical-content invention or unrelated redirect cleanup. |
| Definition of Done | 404 renders correct status and recovery; approved redirect behavior resolves to a real owned target; redirect loops/chains, links, noindex expectations, build and production HTTP QA pass. |

## 5. Portfolio-wide execution controls

Every future page task must:

1. read the Universal and Current website truth bundles;
2. name the exact route(s), class, priority, dependencies, approval gate and non-goals from this blueprint;
3. provide an approved Page Contract and exact copy rather than deriving public wording from this document;
4. preserve the C-07 entity **Essence Coaching** and exact positioning: **Kenji Phạm — Huấn luyện viên Tâm lý Chiều sâu, Essence Coach. Người sáng lập Essence Coaching.**
5. apply the canonical typography composition system without making narrative the only navigation;
6. use FLUX.1 + Kenji LoRA only for Kenji imagery, and FLUX.2 Klein 9B for non-Kenji imagery;
7. verify headings, keyboard/focus, contrast, reduced motion where relevant, desktop/mobile wrapping and overflow, CTA truth, errors and recovery;
8. test rendered HTTP/HTML and links in addition to source/build checks;
9. keep private, payment, confirmation, booking, child-sensitive, legacy, partner and internal nodes out of the public sitemap;
10. treat robots, sitemap, canonical tags, schema reconciliation and Search Console as separately approved M6/runtime work.

No classification in this blueprint changes the runtime, route, CTA, commercial state, privacy operation or index visibility by itself.
