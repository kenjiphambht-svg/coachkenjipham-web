# OFFER STATE MATRIX

> **Authority:** L2 — Current Website Operating Truth
> **Status:** Active
> **Owner:** Kenji Phạm
> **Purpose:** Current offer/flow classification; distinguishes rendered commercial pages from governed offer approval.
> **Decision scope:** Offer state, flow boundary, legacy exclusion and runtime-gap recording. **Non-decision scope:** Price, provider, eligibility, SLA, legal claim, automation, booking or delivery architecture.
> **Governing basis:** [Conflict Register](../../governance/CONFLICT_REGISTER.md) C-03, C-05 and C-06; [Route State Matrix](ROUTE_STATE_MATRIX.md); [Security and Child Data Policy](../master-plan/09_SECURITY_PRIVACY_AND_CHILD_DATA_POLICY.md).
> **Baseline evidence commit:** origin/main at a45e4242c0e68f52e0004ee8dd5d02745e4212dd
> **Last verified:** fe0739d6d88ba8c9b9a1a6bc9b467bc0f22f5dae
> **Review:** Founder Decision, offer/CTA/form/payment change, or 90 days.

## How to use this matrix

“Current implementation” is code evidence, not commercial approval. “Governed desired state” is the L0/L2 condition a future runtime task must meet. Unknown is intentional: no price, provider, automation, booking service, SLA, delivery timeline, eligibility, or legal claim is inferred where governance does not supply it.

| Offer / commercial surface | Operating state | Audience and scope | Page / discovery / current CTA | Current implementation evidence | Governed desired state | Form / Human Decision Gate / payment | Confirmation, delivery, email | Privacy and blockers | Owner / runtime task |
|---|---|---|---|---|---|---|---|---|---|
| **Lặng 90’** | Canonical governed offer; source presents “Đang mở”; flow partially implemented | Adults; one issue needing a 1:1 session | /ban-sac-cua-ban → /lang-90 → CTA /lang-90/dat-phien | /lang-90, /lang-90/dat-phien and /lang-90/xac-nhan are rendered. Intake has six questions and consent; data is passed through sessionStorage and legacy-Gmail mailto. | **L0 C-05:** maximum 5 sessions/month; six questions → support report → Kenji Human Decision Gate → payment → Kenji payment confirmation → private booking link. | Current code routes directly to confirmation and shows static-payment instructions. It has no observed support report/review gate, payment confirmation state, or private booking link. | No approved email, private booking, or delivery implementation observed. | Intake can contain sensitive personal data. Current client-side/sessionStorage/mailto flow requires review. | Kenji; scoped Lặng private-flow and sensitive-data task required. |
| **Bản Sắc Hạt Mầm** | Canonical 0–7 offer; source presents “Đang mở”; governed new flow missing | Parents of children age 0–7 | /ban-sac-cua-con → /an-pham-ban-sac-hat-mam → external Tally CTAs | Landing is rendered; package CTAs use the same external Tally URLs as legacy /kidbook. | **L0 C-06:** canonical age 0–7; new form → payment → confirmation → delivery → email flow; no legacy funnel. | No approved new form/payment architecture is implemented. Existing Tally is implementation evidence only. | No new confirmation, private delivery, or email workflow source exists. | Child data is sensitive; no route may expose child data or enter public sitemap. | Kenji approval; scoped child-data/new-flow runtime task required. |
| **Legacy Mini Ebook / KIDMAP packages** | **LEGACY RETIRED (FD-2026-08-02, C-17)** — one-pass retirement, no phased migration | Existing legacy customers (none pending — Founder-confirmed demo-only, no live orders) | /kidbook, /thanh-toan-goi-1, /thanh-toan-goi-2 each 301 → /an-pham-ban-sac-hat-mam | Source archived under archive/legacy-routes/ (out of src/pages, kept in git history); vercel.json carries the three permanent redirects. | **L0 C-17 supersedes C-03 containment:** retired, not merely excluded — no CTA, no funnel, no route left to preserve as legacy-live. | No form/payment evidence continues live on these routes; the archived source is historical reference only. | No delivery/booking continues on these routes. | Precondition before merge: confirm Tally forms (tally.so/r/1ANjJ4, tally.so/r/Y5J2VN) do not "redirect on completion" to either retired payment route. | Kenji approved and merges the retirement PR himself (route-scope exception, AGENTS.md rule (c)). |
| **Bản Sắc Khám Phá** | Planned/Missing approval; preview implemented | **INFERENCE from rendered copy:** parents of 7–14 | /ban-sac-cua-con → /an-pham-ban-sac-kham-pha; page CTA resolves to mailto while form URLs are empty | Landing exists; config states preview and form URL fields are empty. | Planned/Missing; no L0 active-offer approval. | No usable approved form, Human Decision Gate or payment evidence. | No confirmation, delivery or email evidence. | Child-related; must not be treated as a live purchase path. | Founder approval and task-provided offer/Page Contract required before runtime work. |
| **Bản Sắc Giao Mùa** | Planned/Missing approval; preview implemented | **INFERENCE from rendered copy:** parents/young people 14–21 | /ban-sac-cua-con → /an-pham-ban-sac-giao-mua; page CTA resolves to mailto while form URLs are empty | Landing exists; config states preview and form URL fields are empty. | Planned/Missing; no L0 active-offer approval. | No usable approved form, Human Decision Gate or payment evidence. | No confirmation, delivery or email evidence. | Age/autonomy and sensitive-data requirements remain unresolved. | Founder approval and task-provided offer/Page Contract required before runtime work. |
| **Bạn Là Duy Nhất** | Offer candidate; not approved active | Adults | /ban-sac-cua-ban → /ban-la-duy-nhat → email-only mailto registration | Preview page renders price and delivery claims as implementation evidence. | Offer candidate only; no canonical active approval found. | No approved form, payment or review gate. | No approved private delivery or email flow. | Personal data/privacy process is Unknown. | Founder approval and offer contract required before any runtime task. |
| **Dấu Ấn Của Bạn** | Offer candidate; not approved active | Adults | /ban-sac-cua-ban → /dau-an-cua-ban → email-only mailto registration | Preview page renders price and session/delivery claims as implementation evidence. | Offer candidate only; no canonical active approval found. | No approved form, payment or booking gate. | No approved delivery/email flow. | Personal data/privacy process is Unknown. | Founder approval and offer contract required before any runtime task. |
| **AI Startup Dossier** | Partner asset; not a consumer offer | Partners, investors or collaborators | /lien-he → /ai-startup → partner early-access mailto | Partner dossier is rendered. | **L0 C-04:** independent partner asset; outside consumer journey; rewrite pending. | Not a consumer offer. No consumer form/payment/booking inference. | No delivery/fulfilment model is governed. | No child-data flow identified in source. | Kenji; scoped rewrite/noindex runtime task only. |
| **General contact** | Support surface; not an offer | Anyone needing a non-product question | /lien-he → client-side legacy-Gmail mailto | Contact form is rendered; no backend receiver is observed. | Support surface, not an offer or checkout. Public contact is contact@coachkenjipham.com under C-08. | No payment or gate. | No automation evidence. | Form recipient and policy need operational reconciliation. | Scoped contact/privacy runtime task if implementation changes are requested. |

## Cross-offer controls

| Control | Current truth |
|---|---|
| Public identity | Official entity: Essence Coaching. Exact positioning: Kenji Phạm — Huấn luyện viên Tâm lý Chiều sâu, Essence Coach. Người sáng lập Essence Coaching. |
| Child safety | Do not use child data to label, predict, diagnose, pressure, or train AI. Treat all uncertainty as sensitive. |
| Payment | No provider is approved by this matrix. Legacy static QR is an observation, not a new-flow decision. |
| Booking | No automated booking is approved. Lặng requires Kenji’s Human Decision Gate and payment confirmation before a private booking link. |
| Private delivery | No private delivery route is implemented. A future route must be non-guessable, noindex, excluded from sitemap, and server-side protected if access control is used. |
| Email | No G1 email implementation is approved. Existing mailto links are code facts; public contact authority is C-08. |
| Indexing | No offer, payment, confirmation, booking, delivery or child-sensitive route may enter a public sitemap. M6 governs indexing work. |

## Open runtime gaps

| ID | Gap | Runtime task boundary |
|---|---|---|
| O-01 | Lặng source lacks the L0 review/payment-confirmation/private-booking sequence. | Implement only with Kenji-approved sensitive-data/booking scope. |
| O-02 | Hạt Mầm source uses a legacy funnel. | Build the C-06 new flow independently; do not migrate/redirect legacy routes in the same task. |
| O-03 | ✅ **Resolved by FD-2026-08-02 (C-17).** Legacy payment surfaces are retired (redirected, source archived), not merely kept outside new flows. | Closed — no further remediation task needed for these three routes; live-behavior verification (curl post-deploy) remains a routine deploy check, not an open gap. |
| O-04 | Preview adult and older-child offers have pages but no approved state contracts. | Require Founder approval and exact approved specification before activation. |
| O-05 | Contact and several intake paths use legacy Gmail. | Reconcile contact/privacy operations in a scoped task; no silent replacement. |
