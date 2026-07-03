# Route Policy

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

