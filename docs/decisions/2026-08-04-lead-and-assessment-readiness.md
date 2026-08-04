# Lead magnet and paid assessment readiness

**Founder Decision date:** 2026-08-04  
**Scope:** future free ebook acquisition/nurture and the low-price self-reflection assessment.  
**Does not authorize:** a public flow, indexing, payment provider, Resend, production delivery, automated financial confirmation or feature-flag activation.

## Product boundary

- **Free discovery:** ebook lead magnets support audience acquisition and
  consented nurture.
- **Low-price entry product:** **“Tôi đang ở đâu?”**, current
  Founder-approved price **50.000 VND**, delivers a result by email only after
  confirmed payment.
- Neither product is a diagnosis, treatment, psychological test, prediction,
  automatic eligibility decision or pressure-selling mechanism.
- Results are controlled by deterministic, versioned rules. AI is not the
  scoring authority and cannot alter a score/category. Payment evidence or a
  customer transfer report is not payment confirmation. Until a verified
  provider is expressly approved, Founder/manual confirmation is required.

## Repository inventory

| Element | Classification | Evidence / consequence |
| --- | --- | --- |
| Legacy child-focused Mini Ebook pages and assets | HISTORICAL | `/kidbook` and its legacy payment pages are C-03 excluded; they are not an approved free-lead implementation. |
| Ebook template/reference inventory | CONFIRMED / HISTORICAL | `docs/brand/design-system/01_DESIGN_SYSTEM_AUDIT_FROM_ZIP.md` records an external ebook kit, not a safe approved lead asset in this repo. |
| Ebook name “Bắt Đầu Từ Đâu? Bản Sắc Nhân Hiệu” | HISTORICAL | `docs/brand/ESSENCE_GEO_STRATEGY.md`; asset, route, consent and delivery contract are missing. |
| Email nurture principles/sequences | HISTORICAL | `docs/website/master-plan/08_EMAIL_NURTURE_AND_CUSTOMER_CARE_SYSTEM.md` is an older design reference; it is not a connected sending/unsubscribe implementation. |
| 50.000 VND quiz reference | CONFIRMED | `docs/brand/ESSENCE_GEO_STRATEGY.md` records “Khởi đầu (quiz)” at 50.000đ. This Founder Decision makes the current paid-assessment name/price explicit. |
| Assessment questions, scoring and result templates | MISSING FOUNDER INPUT | No approved question set, deterministic rules, result groups or approved result copy was found. |
| Leads, lead source/magnet, consent/subscription/unsubscribe tables | MISSING IMPLEMENTATION | No matching application schema or migration was found. |
| Ebook/assessment email delivery, bounce and unsubscribe handling | MISSING IMPLEMENTATION | Existing provider is OFF; no real result-email flow exists. |
| Manual payment evidence/admin confirmation pattern | IMPLEMENTED (other offers only) | Hạt Mầm/Lặng demonstrate an auditable manual review pattern; it must not be reused as proof that an assessment flow exists. |
| Public route, checkout or real result delivery | MISSING IMPLEMENTATION | Must remain OFF until the activation standard below is complete. |

## Future data and rule contract

The implementation must version and preserve: `assessment_versions`,
`question_versions`, `answers`, `scoring_dimensions`,
`deterministic_result_rules`, `result_template_versions`,
`assessment_orders`, payment confirmation, `generated_results` and delivery
events. An answer set belongs to one immutable version; the same input and
version must produce the same result; later rule/template changes never
rewrite history; Founder approval is required for result copy.

Lead operations must separately model `leads`, `lead_sources`, `lead_magnets`,
`consent_events`, `email_subscriptions`, `nurture_sequences`,
`sequence_enrollments`, `email_delivery_events` and unsubscribe events.
Operational email needed to deliver an ebook/result is separate from optional
marketing consent. Marketing consent must never be required to obtain a paid
result.

## Payment/provider boundary

Initial real flow: customer reports transfer → evidence attached → Admin queue
→ Founder checks the actual bank receipt → Founder confirms → result generation
and delivery begin. A future verified webhook provider may replace the
confirmation trigger only without changing the immutable assessment history.

## Ready-to-activate gate

All of the following remain required: approved ebook asset/delivery route,
questions, deterministic rules, result templates, 50.000 VND commercial
contract, consent/privacy/payment copy, confirmation workflow, Resend,
unsubscribe/bounce handling, result delivery, nurture stop conditions, Admin
management/audit/rate limiting, responsive and synthetic E2E, real provider
E2E, rollback, OFF feature flags, and a later explicit Founder activation.

Founder may configure approved title/copy/timing/price/effective date/state,
templates and conversion destination. Code/test/approval is required for a new
scoring method/question type/provider/data category/access model or automated
financial confirmation.
