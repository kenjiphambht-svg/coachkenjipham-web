# Unified product portfolio and operating console

**Founder Decision date:** 2026-08-04  
**Authority:** Founder product-portfolio, console and activation architecture.  
**Scope:** Draft PR #134 and future backend contracts.  
**Out of scope:** activation, indexing, providers, production deployment, legacy-route changes, real data or automatic financial confirmation.

## Evidence labels

This decision distinguishes **CONFIRMED REPOSITORY FACT**, **FOUNDER
DECISION**, **CURRENT IMPLEMENTATION**, **WORKING BUSINESS INPUT**, **MISSING
FOUNDER INPUT**, **FUTURE IMPLEMENTATION**, **OPEN GATE**, **CONFLICT** and
**OUT OF SCOPE**. A rendered page is not approval to sell.

## Portfolio authority

| Line | Product | Current state | Contract / open boundary |
| --- | --- | --- | --- |
| Free discovery | Ebook, Góc đọc, nurture | Draft / email OFF | approved asset, route, consent and provider are still required. |
| Low-price | **Tôi đang ở đâu?** | Draft; working price **50.000 VND** | versioned deterministic questions/results; not diagnosis, prediction, eligibility or AI scoring. |
| Adult | Lặng 90’ | Canonical architecture; external gates OPEN | 5/month, 6-question intake, Kenji decision/payment confirmation/private booking. |
| Adult | Bạn Là Duy Nhất | Preview | personalised publication; all commercial/form/delivery policy inputs are missing. |
| Adult | Dấu Ấn Của Bạn | Preview | 150-minute session + publication; price/form/refund/booking/fulfilment inputs are missing. |
| Parent/child | Hạt Mầm HM-01 / HM-02 | Canonical; public flow blocked | 0–7; independent versioned packages; no legacy migration. HM-01 2m/3m; HM-02 3.5m/5.5m VND. |
| Parent/child | Khám Phá | Preview | 7–14 contract, price/form/consent remain product-specific missing inputs. |
| Parent/child | Giao Mùa | Preview | 14–21 autonomy, participation, delivery/changes/deletion authority must be Founder-decided. |
| Legacy | KIDMAP / legacy payments | Legacy | preserve and isolate; never configure or migrate through the new engine. |

Contact, `/lien-he`, AI Startup Dossier, partner/investor assets, trust,
privacy, method and identity pages are **non-product surfaces**.

## Product state and activation model

Every configurable product independently uses: **Bản nháp**, **Xem trước**,
**Sẵn sàng nội bộ**, **Đã kiểm thử**, **Chờ Founder mở**, **Đang hoạt động**,
**Tạm dừng**, **Ngừng nhận mới**, **Lưu trữ**, or **Legacy**.

“Trang đã tồn tại” is not “Được bán”; “Đã kiểm thử” is not “Đang hoạt động”.
Only an explicit later Founder activation may move a fully gated product from
“Chờ Founder mở” to “Đang hoạt động”. Activation is per product, never
inherits within a line, and does not control indexing (M6 remains separate).

## Future unified contracts

The real backend will require `products`, `product_versions`,
`product_packages`, `product_package_versions`, `product_status_history`,
`workflow_templates`, `workflow_template_versions`, `workflow_steps`,
`product_workflow_bindings`, `form_templates`, `form_template_versions`,
`question_libraries`, `pricing_versions`, `policy_versions`,
`capacity_settings`, `schedule_settings`, `email_templates`,
`nurture_sequences`, `release_checklists`, `activation_requests`,
`product_snapshots` and `audit_events`.

Each version preserves name/package/prices/effective date/capacity/SLA/revision,
refund-cancellation/retention/form/workflow/email and fulfilment contract. An
order stores an immutable snapshot; later configuration never rewrites it.

## Reusable workflow library

Approved blocks: discovery, email/consent capture, lead delivery/nurture,
intake, assessment/deterministic scoring, Kenji decision/request information,
payment request/report/evidence/confirmation, booking/session, production,
review/revision/final approval, private publication/email/follow-up, retention,
deletion and audit. Founder may compose only approved blocks. A missing block
is software/governance change, not configuration.

## Operating and AI boundary

Founder configures approved names/prices/timing/copy/forms/blocks/policies and
release requests. New capabilities, states, scoring, providers, personal-data
categories, access/deletion mechanisms, AI scoring, financial automation,
public activation and indexing require code, tests, Draft PR and Founder
approval.

A future AI Copilot may explain/search/summarise/draft/compare/propose. It
cannot activate, confirm payment, decide Lặng, score/change rules, approve a
publication, delete data, alter Auth/MFA/permissions, connect a provider,
change price without confirmation, publish or index. Every proposed write must
show before/after, affected future orders, unchanged historical orders,
effective date and Founder confirmation.

## Readiness standard

Each product needs its own approved offer/audience/route/copy/price/package/
form/consent/workflow/result/fulfilment/email/payment/provider/Storage/
retention/deletion/rate-limit/mobile/accessibility/synthetic+real E2E/
monitoring/backup/rollback checklist. External-provider and real E2E gates may
never be displayed as ready when unverified. Feature flags remain OFF pending
explicit Founder activation.

## Product journeys and email contracts

**CURRENT IMPLEMENTATION:** the Founder Review Demo renders these journeys with
synthetic fixtures only; delivery, payment, storage and providers remain OFF.

- **Ebook:** visitor → email capture → operational delivery consent → optional
  nurture consent → reading access/delivery → nurture or unsubscribe →
  conversion event. Marketing consent is never required to receive the ebook.
- **Assessment 50.000 VND:** versioned answers lock to one version → result is
  locked → request/report/evidence/manual confirmation of payment →
  deterministic versioned result → delivery/failure record → optional follow-up.
  It never diagnoses, predicts or determines eligibility.
- **Lặng:** six-question intake → rule-based support summary → Kenji decision
  (suitable/more information/not suitable) → private payment request/report/
  confirmation → booking invitation → private booking → 90-minute session →
  approved follow-up. No direct checkout, automated decision or pre-payment
  booking.
- **Bạn Là Duy Nhất:** intake → payment confirmation → production → review →
  permitted revision → private reading room/PDF → follow-up. **MISSING FOUNDER
  INPUT:** intake, template, SLA, revision, price and commercial policy.
- **Dấu Ấn Của Bạn:** approved intake/review → payment confirmation → private
  booking → 150-minute session → two-layer publication/review → private
  delivery → approved follow-up. **MISSING FOUNDER INPUT:** price, form,
  refund, booking and fulfilment terms.
- **Hạt Mầm:** intake/consent → HM-01 or HM-02 immutable package snapshot →
  payment request/report/evidence/manual confirmation → production/review/
  revision → approved private publication/email → retention/deletion. HM-02's
  conversation component never overwrites HM-01's publication contract.
- **Khám Phá:** a future independent product using only approved blocks;
  **MISSING FOUNDER INPUT:** product-specific price, form, consent and result
  logic.
- **Giao Mùa:** a future independent product; **MISSING FOUNDER INPUT:**
  young-person awareness/participation, access to final publication, change and
  deletion authority.

Versioned future email categories are lead-magnet request/delivery/nurture/
unsubscribe; assessment start/answers/payment/result/failure/follow-up; Lặng
intake/decision/payment/booking/session/follow-up; and publication intake,
payment, production, revision, approval, private delivery, retention and
deletion. Customer-facing and internal templates stay separate, variables are
allowlisted, and subjects never expose secret, raw sensitive or child detail.

## Explicit open Founder inputs

The ebook asset/copy/route/consent; assessment questions, deterministic rules,
result categories/templates and email copy; both adult preview contracts; the
Khám Phá contract; and Giao Mùa autonomy rules are not inferred by this
decision. They remain **MISSING FOUNDER INPUT**. Real provider connection,
private Storage/deletion E2E, canonical Auth/AAL evidence and a fresh Security
Advisor result remain **OPEN GATES**.

## Governance links and conflict

This decision supplements, not replaces, the Offer State Matrix, Route State
Matrix, Site Journey Map, Conflict Register and WP1 decision. **CONFLICT:**
older launch/checklist material can imply automatic noindex removal; current
Founder authority keeps indexing exclusively under the separate M6 decision.
