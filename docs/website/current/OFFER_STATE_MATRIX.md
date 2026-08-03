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
| **Lặng 90’** | Canonical governed offer; intake path implemented but staging verification pending | Adults; one issue needing a 1:1 session | /ban-sac-cua-ban → /lang-90 → CTA /lang-90/dat-phien | `/lang-90/dat-phien` POSTs six answers + consent to server-only API. Browser keeps only returned order code; no legacy-Gmail mailto or raw answers in sessionStorage. | **L0 C-05:** maximum 5 sessions/month; six questions → support report → Kenji Human Decision Gate → payment → Kenji payment confirmation → private booking link. | Confirmation explicitly stops before payment/booking. Admin queue + state machine enforces human decision; support report, payment instruction and private booking remain absent. | No email, private booking, or delivery implementation is active. | Intake is server-stored with RLS, rate limit and idempotency in source; migrations/integration RLS remain UNVERIFIED on staging. | Kenji; complete staging verification and later scoped booking/email work. |
| **Bản Sắc Hạt Mầm** | Canonical 0–7 offer; public child flow hard-blocked | Parents of children age 0–7 | /ban-sac-cua-con → /an-pham-ban-sac-hat-mam → no active CTA | Landing is rendered; former external Tally CTAs now render disabled “Tạm chưa mở” controls. | **L0 C-06:** canonical age 0–7; new form → payment → confirmation → delivery → email flow; no legacy funnel. | No child form, payment architecture or legacy funnel is active. | No confirmation, private delivery, or email workflow exists. | Child data is sensitive; no route may expose child data or enter public sitemap. | Founder decision sheet for child fields/package/payment/delivery/retention required before a scoped flow. |
| **Legacy Mini Ebook / KIDMAP packages** | Legacy live; excluded from new journey | Existing legacy customers | /kidbook → two external Tally CTAs; legacy payment routes remain independently live | /kidbook renders two Tally CTAs; /thanh-toan-goi-1 and /thanh-toan-goi-2 render static QR/manual payment pages. | **L0 C-03:** legacy and excluded from the new journey, CTA, migration and payment flows. | Existing legacy form/payment evidence may continue only as legacy; it does not authorize new use. | Existing pages describe delivery/booking; not adopted as canonical Hạt Mầm architecture. | Contains child-data and payment risk. | Preserve without G1 runtime edits; dedicated approval required for any runtime change. |
| **Bản Sắc Khám Phá** | Planned/Missing approval; preview implemented | **INFERENCE from rendered copy:** parents of 7–14 | /ban-sac-cua-con → /an-pham-ban-sac-kham-pha; page CTA resolves to mailto while form URLs are empty | Landing exists; config states preview and form URL fields are empty. | Planned/Missing; no L0 active-offer approval. | No usable approved form, Human Decision Gate or payment evidence. | No confirmation, delivery or email evidence. | Child-related; must not be treated as a live purchase path. | Founder approval and task-provided offer/Page Contract required before runtime work. |
| **Bản Sắc Giao Mùa** | Planned/Missing approval; preview implemented | **INFERENCE from rendered copy:** parents/young people 14–21 | /ban-sac-cua-con → /an-pham-ban-sac-giao-mua; page CTA resolves to mailto while form URLs are empty | Landing exists; config states preview and form URL fields are empty. | Planned/Missing; no L0 active-offer approval. | No usable approved form, Human Decision Gate or payment evidence. | No confirmation, delivery or email evidence. | Age/autonomy and sensitive-data requirements remain unresolved. | Founder approval and task-provided offer/Page Contract required before runtime work. |
| **Bạn Là Duy Nhất** | Offer candidate; not approved active | Adults | /ban-sac-cua-ban → /ban-la-duy-nhat → email-only mailto registration | Preview page renders price and delivery claims as implementation evidence. | Offer candidate only; no canonical active approval found. | No approved form, payment or review gate. | No approved private delivery or email flow. | Personal data/privacy process is Unknown. | Founder approval and offer contract required before any runtime task. |
| **Dấu Ấn Của Bạn** | Offer candidate; not approved active | Adults | /ban-sac-cua-ban → /dau-an-cua-ban → email-only mailto registration | Preview page renders price and session/delivery claims as implementation evidence. | Offer candidate only; no canonical active approval found. | No approved form, payment or booking gate. | No approved delivery/email flow. | Personal data/privacy process is Unknown. | Founder approval and offer contract required before any runtime task. |
| **AI Startup Dossier** | Partner asset; not a consumer offer | Partners, investors or collaborators | /lien-he → /ai-startup → partner early-access mailto | Partner dossier is rendered. | **L0 C-04:** independent partner asset; outside consumer journey; rewrite pending. | Not a consumer offer. No consumer form/payment/booking inference. | No delivery/fulfilment model is governed. | No child-data flow identified in source. | Kenji; scoped rewrite/noindex runtime task only. |
| **General contact** | Support surface; not an offer | Anyone needing a non-product question | /lien-he → server-only inbox API | Contact form is rendered and writes to `contact_messages` through API; no mail client or automated email. | Support surface, not an offer or checkout. Public contact is contact@coachkenjipham.com under C-08. | No payment or gate. | No automation/email evidence. | Rate limit/idempotency exist in source; staging verification and contact-operational reconciliation remain open. | Scoped contact/privacy runtime task if implementation changes are requested. |

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
| O-01 | Lặng has intake + Human Decision Gate source, but lacks support report/payment-confirmation/private-booking completion and staging proof. | Verify migrations/RLS first; implement remaining private flow only with required operating inputs. |
| O-02 | Hạt Mầm lacks a current Founder Decision for its child-data and commercial/fulfilment contract. | Keep hard-blocked; build C-06 flow only after decision sheet, without migrating legacy routes. |
| O-03 | Legacy payment surfaces contain commercial details but must stay outside new flows. | Any payment or privacy remediation is its own approved task. |
| O-04 | Preview adult and older-child offers have pages but no approved state contracts. | Require Founder approval and exact approved specification before activation. |
| O-05 | Lặng/contact source no longer use form-mailto, but no email/notification adapter is configured. | Reconcile contact/privacy operations before enabling any notification. |
