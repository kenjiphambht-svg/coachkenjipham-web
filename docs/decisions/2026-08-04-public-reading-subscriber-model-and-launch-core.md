# Public reading, subscriber model and Launch Core

**Founder Decision date:** 2026-08-04  
**Authority:** WP2 Founder Correction Pass; controls public-reading and subscriber boundaries for the Founder Review Demo and future implementation.  
**Out of scope:** real public route, email provider, CRM, payment, login, PDF, private Storage, provider connection, indexing and activation.

## Evidence labels

This record distinguishes **FOUNDER DECISION**, **CURRENT IMPLEMENTATION**, **FUTURE IMPLEMENTATION**, **EXPERIENCE PROPOSAL**, **MISSING FOUNDER INPUT**, **OPEN GATE** and **OUT OF SCOPE**. A rendered Founder Review Demo is neither a public launch nor an entitlement.

## Public ebook is reading, not a lead gate

**FOUNDER DECISION:** the ebook is public and completely readable on the web. It does not require email, account, payment, login, download or PDF. Its basic reader may use only chapter links, an optional share/copy action and same-device progress. It creates no CRM identity, customer record, library entitlement or right to a private room.

The public reader is intentionally separate from **Thư viện của tôi**. A public ebook is not the default paid-library item and must never imply an anonymous reader has purchased access. No public route is created by this decision; the current surface is a local, synthetic Founder Review Demo.

## Three distinct relationships

| Relationship | What it may receive | What it never implies |
| --- | --- | --- |
| Anonymous reader | Full public ebook, stable public chapter links, local same-device progress and share/copy. | Email identity, CRM record, Customer Library or entitlement. |
| Email subscriber | Future cross-device continuation, saved-reading list, return link, new articles/letters, preference controls and unsubscribe. | A purchase, paid result, private room or unrestricted marketing consent. |
| Paying entitled customer | Product-specific private area, purchased result/publication, Reading Room, approved PDF, support and approved updates. | A right to unrelated products, public activation or a bypass of verified identity. |

**FUTURE IMPLEMENTATION:** subscriber consent separates reader-continuity communications from optional content communications. An unsubscribe must be available for optional communications and must not erase a paid entitlement or required transactional delivery notice. Consent wording, lawful basis, retention, CRM fields, provider and unsubscribe mechanics remain **OPEN GATES**.

## Natural invitation and assessment placement

An email invitation may appear only after a saved chapter, a return visit, the end of an ebook or a reader-selected related article. It must state that reading remains free without signup and never use a popup, gate, countdown, pressure or a claim that the reader will lose access.

The 50.000 VND **Tôi đang ở đâu?** assessment is an optional next step after reading, naturally placed around an early reflection point and at the end. The public reader has no checkout, payment instruction, scoring, result or email submission. Its future flow is email → versioned questions → locked result → payment instruction → reported transfer/evidence → Kenji confirmation → deterministic result → private entitlement. It is not a diagnosis, prediction, eligibility decision or AI score.

## Lifecycle and future access map

The future progression is: anonymous reader → optional subscriber → optional assessment participant → paying customer → entitled private reader → optional longer private journey. Access levels remain respectively **public**, **subscriber**, **member** (future definition), **purchased**, and **private journey**. Each transition needs its own consent, identity, provider and authorization evidence; it never happens merely by viewing a page.

**MISSING FOUNDER INPUT:** whether there will be a membership product, its offer, price, benefits, renewal/refund, consent, retention and relationship to subscriber access. The Founder Review Demo labels membership only as a future access level; it creates no membership implementation.

## Future CRM lifecycle classification

**FUTURE IMPLEMENTATION:** an anonymous reader has no identified CRM contact,
customer record or personal tracking. A subscriber has verified email, reading
source, consent state and permitted preference/interaction fields, but is not a
customer by default. An assessment customer has an assessment order, payment
confirmation, result entitlement and private result room. A product customer
has identity, order, payment, item-specific entitlement and permitted support
history. A future member has recurring knowledge entitlement and access period;
an active future journey customer has a journey entitlement, milestones and
customer/shared/Kenji-private visibility boundaries. WP2 implements none of
these records or a CRM.

## Launch Core priority lock

**FOUNDER DECISION:** the next backend capability sequence is limited to:

1. **Lặng backend:** intake, support summary, Kenji decision, payment evidence and confirmation, booking and follow-up; no automated suitability or booking before payment.
2. **Hạt Mầm backend:** consent, HM-01/HM-02 immutable snapshots, evidence, production/review/revision, versioned private delivery, support, retention and deletion; no legacy KIDMAP migration.
3. **Private Customer Reading Room:** verified identity, magic link, entitlement isolation, private Storage, signed download, versioning, support/revoke/deletion/audit and mobile reading.

**Growth next — deferred:** real public ebook route, subscriber identity and cross-device progress, reading email, assessment backend and baseline CRM.

**Expansion later — deferred:** adult preview products, Khám Phá, Giao Mùa, membership, Journey backend, advanced CRM, AI and media capabilities.

All release/provider flags stay OFF. This priority lock does not authorize WP3, a merge, deployment, indexing, a provider connection or public activation.

## Current synthetic review surface

`founder-review-demo/` renders five public-reading chapters, table of contents, previous/next controls, same-device return, saved-place and share simulations, an optional email-invitation simulation, assessment landing preview and the three-relationship comparison. It deliberately sends no email, accepts no identity, uses no API/provider/network request, does not create a public route, and contains no downloadable PDF, checkout or real payment.

## Release gates

Before any real public-reading, subscriber or assessment launch: approved asset/copy/route, consent and privacy model, provider connection, recipient and unsubscribe E2E, canonical Auth/RLS and entitlement evidence, rate limits, noindex/cache/sitemap review, payment evidence, content/result versioning, mobile/accessibility QA, Security Advisor, backup/recovery and explicit Founder activation must pass. None is passed by this decision.

## Related authority

This correction supplements and supersedes only the earlier assumption that an ebook belongs by default inside the paid Customer Library. It must be read with [WP2 customer experience](2026-08-04-wp2-customer-experience-reading-templates-and-journey-space.md), [Customer Library](2026-08-04-customer-library-and-private-reading-rooms.md) and [Unified Portfolio](2026-08-04-unified-product-portfolio-and-operating-console.md).
