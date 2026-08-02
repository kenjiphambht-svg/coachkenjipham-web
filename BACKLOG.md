# BACKLOG — Essence Website

> **Governance status:** L2 — Active with Patch
> **Owner:** Kenji Phạm
> **Purpose:** Task queue and work visibility.
> **Decision scope:** Declared task state only. **Non-decision scope:** Canonical roadmap, route truth, offer truth or Founder Decisions.
> **Precedence:** [Documentation Authority](docs/governance/ESSENCE_DOCUMENTATION_AUTHORITY.md) and the [Conflict Register](docs/governance/CONFLICT_REGISTER.md) win over the phase labels below.
> **Still valid:** Task tracking and protected areas. **Outdated/superseded:** The Phase 1–5 sequence below is not the M0–M6 roadmap.
> **Replacement:** docs/website/current/ROUTE_STATE_MATRIX.md and docs/website/current/OFFER_STATE_MATRIX.md. **Baseline evidence commit:** ead2eb75ae1da28f1cec8a2b9ac6f5cf52f419fc. **Last verified:** 733b19900d3f8c471fb90cbd6f17bc4acf8b1332. **Review:** Founder Decision trigger or 90 days.

File theo dõi công việc: ghi nhận điều đang làm, tiến độ và việc kế tiếp. Đây không phải nguồn sự thật canonical; authority, conflict precedence và Founder Decisions thuộc governance L0.
Mọi phiên Claude Code/Codex đọc governance L0 và Reading Bundles trước; chỉ đọc file này khi task yêu cầu task-tracking.
Roadmap chi tiết và decision log cũ chỉ là historical evidence, không phải source để suy ra scope, route, indexing, offer hay Founder Decision.

## HIỆN TRẠNG — đọc mục này trước (cập nhật 31/07/2026, evidence 733b199)

**Đã hoàn thành và merge (thứ tự thời gian):**

| Mốc | Nội dung | PR | Merge commit |
|---|---|---|---|
| G0 | Governance foundation (authority L0–L5, registry, conflict register, bundles, archive policy) | #110 | a45e424 |
| G1 | Current Website Truth v1 (journey map, route/offer matrix, indexing policy, blueprint) | #111 | fe0739d |
| G1.1 | Governance end state (C-07 = Essence Coaching, C-13 khoá self-merge, registry 69 entries, load-chain thật, hết placeholder) | #113 | d8cfa93 |
| P1 | Canonical Villa Cutover — `/` render Villa qua `VillaPage.tsx` dùng chung; `/trang-chu-v2` contained; cả hai noindex; entity Villa = Essence Coaching | #112 | 733b199 |
| P1.5 | Homepage Editorial Completion — Locked Copy, S09 Editorial Reading Table redesign, SEO/GEO metadata, card asset swap | #116 | 887a631 |

**Hiện trạng:** `/` là Villa canonical. Governance foundation ĐÓNG — không còn cleanup PR nào chờ. Roadmap thực tế = `docs/website/current/PAGE_PORTFOLIO_AND_TRANSFORMATION_BLUEPRINT.md` (mục 3, đã đánh dấu P1 COMPLETED).

**Homepage `/` (branch `audit/homepage-index-readiness`, PR #117, chưa merge):** trạng thái **INDEX-READY LOCKED — NOINDEX PENDING FOUNDER ACTIVATION**. Closeout chính thức = `docs/website/homepage/HOMEPAGE_FINAL_COMPLETION_RECORD.md`. Founder Decisions 02/08/2026 ghi tại C-14/C-15; domain canonical đã lật xong và verify live (O-07 đóng). `noindex` không đổi, chưa kích hoạt sitemap/robots/Search Console — M6 vẫn là Founder Decision riêng.

**Việc kế tiếp theo blueprint (mỗi việc cần Page Contract + approved copy + Kenji phê duyệt trước khi làm):** P2a (privacy/contact foundation) → P2b (trust suite) → P3 (Lặng private flow) → ... → M6 (indexing, Founder Decision riêng, luôn cuối cùng).

**Gaps mở còn lại:** xem Conflict Register O-01 (phần /ai-startup), O-02..O-05, O-06 (các route ngoài Villa). Không suy ra quyền làm từ file này.

## Lịch sử tracking cũ (dưới đây) — chỉ là evidence

**Toàn bộ phase block và source references bên dưới là historical tracking evidence, không phải executable task list. Không tick, đổi phase, mở route, thay indexing hoặc suy ra implementation từ chúng; current-truth matrices và task-provided approved specification mới có thể mở execution scope.** Việc "Homepage V2" trong Phase 1 cũ đã được thay thế bằng P1 Canonical Villa Cutover (bảng trên) — không tick vào block cũ.

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
