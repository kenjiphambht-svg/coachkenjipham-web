# ESSENCE Backend — Start Here

> **Status:** Current navigation / implementation evidence  
> **Owner:** Kenji Phạm  
> **Purpose:** Help Founder, AI, engineers and future operators understand the backend before changing it.  
> **Decision authority:** This folder does **not** create Founder Decisions. Governance, approved contracts and current authority documents still win.

## Read order

When starting any backend task, read in this order:

1. [`ESSENCE_BACKEND_CURRENT_STATE_2026-08-08.md`](./ESSENCE_BACKEND_CURRENT_STATE_2026-08-08.md) — what has actually been built, tested, staged, blocked or deliberately left OFF.
2. [`ESSENCE_BACKEND_SYSTEM_MAP.md`](./ESSENCE_BACKEND_SYSTEM_MAP.md) — how the backend is divided into layers, how data flows, where code/data live, and what must change together.
3. The task-specific approved contract / work order.
4. The current PR, migrations, runtime logs and staging evidence for the subsystem being changed.

Do not infer current truth from historical phase labels, old master plans or an old PR description if newer implementation evidence conflicts with them.

## Status vocabulary

- **PRODUCTION LIVE** — active for real users.
- **STAGING VERIFIED** — exercised against real staging infrastructure with synthetic/non-sensitive data.
- **IMPLEMENTED / NOT RUNTIME VERIFIED** — code exists but the exact current commit has not completed runtime E2E.
- **SYNTHETIC PREVIEW ONLY** — UI/logic demonstration, no real provider or customer data.
- **FAIL-CLOSED / OFF** — intentionally unavailable until a separate gate is approved and verified.
- **BLOCKED** — waiting on external infrastructure/quota/permission rather than unresolved architecture.

## Non-negotiable backend boundaries

- No real customer, child, payment, session-note or private-vault content in the AI Knowledge Backend.
- `99_KHO RIÊNG TƯ` is a hard deny for the Drive sync identity.
- Service-role credentials stay server-side only.
- Customer authorization is identity + entitlement based; a random URL/token alone is never authorization for the official Reading Room.
- Payment reports are not payment confirmations; confirmation remains atomic and idempotent.
- AI may know, summarize and propose within approved scope; it does not autonomously confirm money, grant entitlement, approve publication, delete data or execute business actions.
- No production merge, provider activation or public release without the corresponding Founder gate.

## Current documentation responsibility

Whenever a backend milestone changes materially:

1. update the Current State document;
2. update the System Map if boundaries/flows/components changed;
3. record exact PR/commit/migration/runtime evidence;
4. state what is still OFF or unverified;
5. never rewrite an old failure as if it had passed.
