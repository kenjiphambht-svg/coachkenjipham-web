# BACKLOG — Essence Website

File sống: nguồn sự thật duy nhất về "đang làm gì, làm gì tiếp theo".
Mọi phiên Claude Code/Codex đọc file này trước khi nhận task (xem `PLAYBOOK.md`).
Roadmap chi tiết: `docs/website/master-plan/12_IMPLEMENTATION_ROADMAP_PHASES.md`.
Quyết định đã chốt: `docs/website/master-plan/15_DECISION_LOG_AND_NEXT_ACTIONS.md`.

## Current Phase

**Phase 1 — Homepage V2**

## Phase 0 — Route & Source Audit

Status: Completed — see `docs/website/audits/PHASE_0_ROUTE_SOURCE_AUDIT.md`

- [x] Audit current routes.
- [x] Audit homepage current implementation.
- [x] Audit `/kidbook`.
- [x] Audit `/ai-startup`.
- [x] Audit payment pages.
- [x] Audit SEO/noindex/privacy requirements.
- [x] Báo cáo route nào giữ, route nào sửa, route nào redirect/noindex sau.

Nguồn đọc: `docs/website/master-plan/02_PUBLIC_SITEMAP_AND_ROUTE_POLICY.md`, `docs/website/master-plan/09_SECURITY_PRIVACY_AND_CHILD_DATA_POLICY.md`.

## Phase 1 — Homepage V2

- [ ] Rebuild homepage as Light-led Essence Premium.
- Keep Inter during beta.
- No DM Sans switch in Phase 0.
- No brown.
- Dark only as silence.
- Do not touch child/payment/private routes.

Nguồn đọc: `docs/website/master-plan/04_HOMEPAGE_10000_USD_SPEC.md`, `docs/brand/design-system/FOUNDER_VISUAL_DECISION_SUMMARY.md`, `docs/brand/design-system/UPDATED_COLOR_AND_PAGE_RULES_FOR_CODEX.md`.

## Phase 2 — Bản Sắc Hạt Mầm Landing

- [ ] Audit current kidbook/landing relationship.
- [ ] Rebuild public landing carefully.
- Child-safe language only.
- No deterministic/spiritual labeling for children.

Nguồn đọc: `docs/website/master-plan/05_BAN_SAC_HAT_MAM_FUNNEL_AND_LANDING_SPEC.md`, `docs/brand/CHILD_LANGUAGE_RULES.md`.

## Phase 3 — Private Publication Delivery

- [ ] Plan `/an-pham/[random-slug]`.
- noindex.
- privacy-first.
- no client-side fake password.

Nguồn đọc: `docs/website/master-plan/06_PRODUCT_DELIVERY_PRIVATE_PUBLICATION_SYSTEM.md`.

## Phase 4 — SEO/AIO/GEO + Content System

- [ ] Route metadata.
- [ ] Entity clarity.
- [ ] Safe public knowledge layer.

Nguồn đọc: `docs/website/master-plan/10_SEO_AIO_GEO_CONTENT_SYSTEM.md`, `docs/brand/SEO_ENTITY.md`.

## Phase 5 — Ops / CRM / Payment / Customer Care

- Only after public funnel is stable.

Nguồn đọc: `docs/website/master-plan/07_BACKEND_CRM_PAYMENT_AND_DATA_ARCHITECTURE.md`, `docs/website/master-plan/08_EMAIL_NURTURE_AND_CUSTOMER_CARE_SYSTEM.md`.

## Do Not Touch Without Explicit Task

- Payment pages (`/thanh-toan-*`).
- Private publication routes (`/an-pham/[random-slug]` và tương tự).
- Child data handling.
- Package dependencies (`package.json`, `package-lock.json`).
- Deployment settings.
- Existing live paid pages.

## Migration Note

Live routes stay online until replacements are fully built, QA-passed, and explicitly approved by Kenji for migration.

## Luật của file này

- Task xong → tick checkbox + ghi PR số.
- Đổi phase → cập nhật mục "Current Phase" trong PR của task cuối phase.
- Quyết định mới → ghi vào `docs/website/master-plan/15_DECISION_LOG_AND_NEXT_ACTIONS.md` trước, sửa backlog sau.
