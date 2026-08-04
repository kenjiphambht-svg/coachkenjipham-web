# WP2 — Customer experience, reading templates and Journey Space

**Authority:** Founder Decision for a synthetic experience/architecture pass.  
**Scope:** Stacked Draft PR WP2; Founder Review Demo only.  
**Out of scope:** public route, Auth/magic link, Supabase/API, private Storage,
PDF, email, Cal.com, analytics, provider connection, activation and indexing.

## Evidence and source reconciliation

This document uses **CONFIRMED REPOSITORY FACT**, **FOUNDER DECISION**,
**CURRENT IMPLEMENTATION**, **EXPERIENCE PROPOSAL**, **WORKING ASSUMPTION**,
**MISSING FOUNDER INPUT**, **OPEN TECHNICAL GATE**, **CONFLICT** and **OUT OF
SCOPE**.

**CONFIRMED REPOSITORY FACT:** the public Villa is governed noindex pending M6;
Lặng is the sole canonical adult flow, Hạt Mầm is canonical but public-blocked,
and all other publication offers are preview/candidate only. Existing legacy
KIDMAP/payment routes remain isolated. The portfolio, Customer Library,
proportionate child-data and WP1 records remain controlling sources; the
Experience Bible supplies rhythm/typography/restraint rather than route or
offer authority. Cormorant Garamond and Inter are the approved base fonts.

**CONFLICT:** older private-room material permits a random-slug MVP; the newer
Customer Library Founder Decision requires verified identity for the official
production library. WP2 adopts the stricter future identity model and makes no
implementation claim for either model.

## Customer experience architecture

**FOUNDER DECISION:** the private experience is a calm continuation of the
Villa, not a generic account, CRM, LMS or download portal. The provisional
**Không gian của tôi** Customer Home includes a warm orientation, Continue,
**Thư viện của tôi**, an optional Journey Space and at most two quiet next
doors. It remains useful for a one-item customer. Final public route and title
are **MISSING FOUNDER INPUT**.

Customer Home can lead to a product entitlement and its separate Reading Room.
The library carries only customer-safe states (preparing, ready, updated,
archived, no access). A Reading Room is product-aware and binds approved
content, template, product/package snapshot, entitlement and delivery version.
It never exposes provider/gate/audit details.

## Template and configurable-block system

**FUTURE IMPLEMENTATION:** `content ≠ template ≠ entitlement ≠ product
configuration`. Contracts are `experience_templates`,
`experience_template_versions`, `experience_blocks`,
`template_block_bindings`, `reading_layout_presets`,
`publication_content_versions`, `publication_experience_bindings` and
`experience_migration_requests`.

Changing copy/content creates a publication version; changing typography/layout
creates a template version. Delivered rooms remain pinned; a migration is an
explicit future approval, never an automatic consequence of changing a
template. Founder may select/reorder/show approved blocks, choose a preset and
labels, configure PDF/recommendation placement and publish a new configuration
version. A new block, visibility/access model, media/AI/recommendation engine,
communication channel, PDF system, autonomy model, automatic migration, route,
provider or production activation requires code/tests/Founder approval.

Approved synthetic blocks are opening/cover/guidance/contents/chapter/divider/
signal/reflection/personal note/shared practice/media placeholders/resource/PDF/
update/revision/support/privacy/related door/milestone/session/shared note/
reflection/Kenji-approved summary. A missing block is a software change.

## Experience-family proposals

| Family | Experience proposal | Binding/open boundary |
| --- | --- | --- |
| Ebook/Góc đọc | light, editorial, three sections, resume and optional resource | asset/route/consent/email remain open. |
| Assessment 50k | calm result, dimensions, observation and one next step | deterministic rule/result and PDF approval remain open; never diagnosis/AI scoring. |
| Bạn Là Duy Nhất | personal editorial chapters/reflection/PDF/quiet final door | all commercial/form/SLA/revision inputs remain open. |
| Dấu Ấn | distinct two layers, session insight, day-30 return, update | price/form/refund/booking/fulfilment remain open. |
| Hạt Mầm 0–7 | parent-facing, warm observational guidance/reflection/PDF/support | public flow and private delivery remain blocked. |
| Khám Phá 7–14 | more mature rhythm, parent observation and future Giao Mùa door | independent preview; no inherited Hạt Mầm contract. |
| Giao Mùa 14–21 | mature/private room and reflection | parent-only, shared or young-person-primary visibility are **EXPERIENCE PROPOSALS**; Founder decides autonomy. |
| Lặng follow-up | optional approved summary/reflection/check-in/resource | depends on a future approved Lặng contract; not automatic. |

## Quiet next door

“Cánh cửa tiếp theo” is configured only from safe mapping: current product,
family, entitlement and Founder-selected mapping. It has no sensitive-content
inference, AI, popup, countdown, discount, scarcity, checkout or legacy route.
It appears only after natural reading or on Home, with one or two honest-state
options and an existing approved/preview landing route.

## Journey Space and visibility

**EXPERIENCE PROPOSAL:** three-, six- and twelve-month spaces use intentions,
milestones, sessions, practices, reflections, approved summaries, resources
and return points — not streaks, points, percentage healing or automated scores.
There is no emergency care, 24/7 messaging, clinical record or automatic
monitoring promise.

Every future item declares one visibility type: **CUSTOMER PRIVATE**, **SHARED**,
**KENJI PRIVATE**, or **SYSTEM OPERATIONAL**. Types never merge automatically;
AI must never use Kenji-private notes in customer copy. The Founder view may
show work/deadline/approval signals; the customer view excludes Kenji-private
and operational DOM content.

## Current synthetic implementation and gates

WP2 uses only localStorage fixtures/placeholder media. It has no real identity,
data, PDF, link, provider, API, analytics or public route. Required real gates
include entitlement isolation/RLS, verified magic-link access, private Storage,
signed download/direct-object denial, content/template versioning, PDF A5
generation/checksum, access/revoke/deletion audit, privacy/noindex/cache/sitemap
validation, lost-access/wrong-recipient/support/revision flows, mobile and
accessibility QA, backup/restore, provider E2E and explicit feature flag/Founder
activation.

## Founder acceptance requirements

Founder can review the Home, Library, all family templates, Giao Mùa visibility
proposals, quiet next door, 3/6/12 Journey fixtures, template-version save and
historical restore. This review does not approve a product contract, content,
template, route, access model, recommendation mapping or activation.

## Related authority

This decision supplements
[WP1](2026-08-04-wp1-admin-operating-experience.md),
[Unified Portfolio](2026-08-04-unified-product-portfolio-and-operating-console.md)
and [Customer Library](2026-08-04-customer-library-and-private-reading-rooms.md)
without replacing their route/indexing/provider/release-gate authority.
