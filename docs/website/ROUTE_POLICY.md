# Route Policy

> **Authority:** L5 — Historical Record
> **Status:** Superseded
> **Owner:** Kenji Phạm
> **Purpose:** Preserve an early route/indexing policy.
> **Decision scope:** Historical evidence only. **Non-decision scope:** Current route role, indexability, sitemap, redirect, launch or runtime action.
> **Outdated/superseded:** The indexable route list and `/ai-startup` treatment below conflict with pre-M6 truth.
> **Replacement:** Conflict Register C-01–C-04, `docs/website/current/ROUTE_STATE_MATRIX.md` and `docs/website/current/INDEXING_POLICY.md`.
> **Baseline evidence commit:** fe0739d6d88ba8c9b9a1a6bc9b467bc0f22f5dae
> **Last verified:** fe0739d6d88ba8c9b9a1a6bc9b467bc0f22f5dae
> **Review:** No periodic cadence.

The content below is preserved as historical provenance and cannot authorize indexing, sitemap, redirect or route work.

This policy defines which routes are public/indexable, noindex, deprecated, excluded from navigation, and which require human approval before launch.

## Indexable Routes

The following routes may be public and indexable when their pages exist and content is reviewed:

- `/`
- `/ve-kenji`
- `/phuong-phap`
- `/ban-sac-cua-con`
- `/an-pham-ban-sac-hat-mam`
- `/goc-doc`
- `/ai-startup`
- `/lien-he`

## Noindex Routes

The following must be noindex and should not be submitted to the sitemap:

- `/an-pham/[random-slug]`
- `/thanh-toan-*`
- Private publication pages
- Payment pages
- Checkout pages

## Deprecated Routes

- `/fcp` - Deprecated; do not promote. Redirect or noindex later after human approval.

## Legacy Routes

- `/kidbook` should continue working for now.
- Do not break `/kidbook`.
- Later, it may redirect to `/an-pham-ban-sac-hat-mam` after the payment and product flow is checked.

## Routes That Must Not Be In Navigation

- `/an-pham/[random-slug]`
- `/thanh-toan-*`
- Checkout pages
- Private publication pages
- Deprecated routes such as `/fcp`

## Routes Requiring Human Approval Before Launch

- `/phien-90-lang`
- `/phan-tich-2-lop`
- `/hanh-trinh-90-ngay`
- `/tu-dien-essence`
- Any payment or checkout page
- Any private publication route
- Any route collecting child or family data
