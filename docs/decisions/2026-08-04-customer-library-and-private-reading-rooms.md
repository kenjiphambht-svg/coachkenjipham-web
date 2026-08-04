# Customer Library and Private Reading Rooms

**Founder Decision date:** 2026-08-04  
**Scope:** Future customer entitlement architecture and the synthetic Founder
Review Demo.  
**Out of scope:** final public route name, real customer identity, Supabase,
Storage, email, PDF generation, provider connection, activation and indexing.

## Evidence labels

This record distinguishes **FOUNDER DECISION**, **CURRENT IMPLEMENTATION**,
**FUTURE IMPLEMENTATION**, **MISSING FOUNDER INPUT**, **OPEN GATE** and
**OUT OF SCOPE**. A rendered reading room never authorizes delivery or sale.

## Founder decision and customer experience

ESSENCE will have one private customer-facing **Thư viện của tôi** (final route
is **MISSING FOUNDER INPUT**) and a separate private reading room for each
entitled item. The library groups only customer-safe states: **Đang chuẩn bị**,
**Sẵn sàng đọc**, **Có bản cập nhật**, **Đã lưu trữ**, and **Không còn quyền
truy cập**. It never exposes provider names, technical gates, audit language or
internal operating states.

**SUPERSEDED ASSUMPTION (2026-08-04 correction):** this record formerly listed
ebooks generically as eligible Library items. The public Góc đọc ebook now
belongs to the anonymous public-reading model and is not a default paid-library
item. An ebook may enter the Library only if a later, approved product-specific
private entitlement explicitly requires it.

Eligible types are approved downloadable/private resources; the paid assessment
result/approved PDF; Bạn Là Duy Nhất, Dấu Ấn Của Bạn and an approved Lặng
follow-up only where its product contract permits it; and Hạt Mầm, Khám Phá and
Giao Mùa. A product page or order alone creates no library item: only approved
product-specific delivery conditions create an entitlement.

Each room can show its title, delivery introduction, current version/delivery
date, HTML contents/chapter navigation/previous-next/progress, approved A5 PDF
download, reading instructions, revision/update notice, support control and
privacy reminder. It must be usable at 390px, 768px and 1440px.

## Future access and data contracts

**FUTURE IMPLEMENTATION:** verified purchase email → expiring, single-use or
securely rotated magic link → customer session → customer library → entitled
room. The first version does not require a reusable customer password.
Tokens are hash-at-rest, removed from the visible URL after session creation,
and customer sessions are isolated from Admin sessions. No customer can
enumerate another's items. Lost access uses the verified purchase email;
support cannot reveal another customer's link.

The future backend contract includes `customer_identities`, `customer_sessions`,
`product_entitlements`, `publications`, `publication_versions`,
`publication_assets`, `reading_room_access`, `access_events`, `download_events`,
`delivery_events`, `revision_requests`, `entitlement_revocations` and
`customer_support_requests`.

An entitlement binds verified identity, order, product/package, the delivered
publication/result, access state, grant/expiry/revocation and deletion state.
A publication version is immutable: number, Kenji-approval evidence, HTML/PDF
references, checksum, created/delivered times, change note and current/history
state are preserved. A revision creates a new version; prior versions remain
internal, customers see the latest approved version by default.

## PDF, privacy, revocation and support boundary

PDF A5 is generated and checksum-validated before an item is ready, never on a
customer click. Every download requires entitlement authorization and a
short-lived signed private-Storage URL, then records an event. Object paths and
safe names use publication/order codes only, for example
`essence-{order-code}-{product-code}-v{version}-a5.pdf`; no child/customer name,
public bucket, permanent URL or Git-committed PDF is permitted.

Customer support may safely request help with link, PDF, display, clarification,
permitted revision, wrong-recipient and deletion concerns; subjects/URLs must
not expose sensitive content. Access states are active, temporarily suspended,
expired, revoked, pending deletion and deleted. Revocation stops future access;
deletion removes private objects before metadata and writes audit evidence.
Refund is not automatic deletion without an approved policy.

All library and room surfaces require server-side authorization, noindex,
no-follow where appropriate, sitemap exclusion, no public navigation,
no-store/cache-leak controls, no personal data in URL/query and no raw
publication content in logs or analytics. A random slug alone is insufficient.

## Current synthetic demo

`founder-review-demo/` provides localStorage-only fixtures: a completed
assessment result, Hạt Mầm preparing and ready records, an adult
publication and an updated publication. It simulates chapter navigation, PDF
authorization/download, support, revision versioning and audit. It contains no
real PDF, magic link, email, customer/child data, Supabase/API/Storage/provider
call or destructive operation.

The separate public-reader fixture is deliberately outside the paid Library;
see [Public reading, subscriber model and Launch Core](2026-08-04-public-reading-subscriber-model-and-launch-core.md).

## Open activation gates

Customer identity and magic-link auth, entitlement/RLS isolation, private
Storage and direct-object denial, signed downloads, versioning, PDF A5
generation/checksum, mobile/accessibility QA, noindex/sitemap/cache validation,
lost-access/wrong-recipient/support/revision/revocation, retention/deletion E2E,
access audit, backup/restore, synthetic and real-provider E2E, Founder
acceptance and a feature flag that remains OFF must all pass before activation.
