# BACKLOG — Essence Website

> **Governance status:** L2 — Active with Patch
> **Owner:** Kenji Phạm
> **Purpose:** Task queue and work visibility.
> **Decision scope:** Declared task state only. **Non-decision scope:** Canonical roadmap, route truth, offer truth or Founder Decisions.
> **Precedence:** [Documentation Authority](docs/governance/ESSENCE_DOCUMENTATION_AUTHORITY.md) and the [Conflict Register](docs/governance/CONFLICT_REGISTER.md) win over the phase labels below.
> **Still valid:** Task tracking and protected areas. **Outdated/superseded:** The Phase 1–5 sequence below is not the M0–M6 roadmap.
> **Replacement:** docs/website/current/ROUTE_STATE_MATRIX.md and docs/website/current/OFFER_STATE_MATRIX.md. **Baseline evidence commit:** ead2eb75ae1da28f1cec8a2b9ac6f5cf52f419fc. **Last verified:** a45e4242c0e68f52e0004ee8dd5d02745e4212dd. **Review:** Founder Decision trigger or 90 days.

File theo dõi công việc: ghi nhận điều đang làm, tiến độ và việc kế tiếp. Đây không phải nguồn sự thật canonical; authority, conflict precedence và Founder Decisions thuộc governance L0.
Mọi phiên Claude Code/Codex đọc governance L0 và Reading Bundles trước; chỉ đọc file này khi task yêu cầu task-tracking.
Roadmap chi tiết và decision log cũ chỉ là historical evidence, không phải source để suy ra scope, route, indexing, offer hay Founder Decision.

## Current Phase

**Historical tracking state — requires G1 re-baseline before use for execution**

**Toàn bộ phase block và source references bên dưới là historical tracking evidence, không phải executable task list. Không tick, đổi phase, mở route, thay indexing hoặc suy ra implementation từ chúng; G1 current-truth matrices và task-provided approved specification mới có thể mở execution scope.**

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
- Không đổi phase từ evidence lịch sử; chờ G1 re-baseline và Founder Decision.
- Quyết định mới → dùng Founder Decision Protocol và cập nhật registry/conflict status; không ghi vào decision log lịch sử như nguồn authority.
