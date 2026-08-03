# B1 public intake — scope and blocks

**Branch:** `feat/b1-public-intake` (stacked on B0)

## Implemented backend surface

- `POST /api/lang-90/dang-ky`: server-only DB write; schema validation, honeypot, crisis stop before persistence, Postgres shared rate limit, idempotency, consent and non-sensitive audit metadata.
- `POST /api/lien-he`: server-only inbox write; validation, honeypot, Postgres shared rate limit and idempotency.
- Neither endpoint sends email. Neither current public page calls these endpoints yet; this keeps the existing page/UI/CTA/mailto behaviour unchanged while the API is verified.

## FOUNDER DECISION REQUIRED — Hạt Mầm public flow

No Hạt Mầm public API/form/payment/confirmation route is added on this branch. The currently available material conflicts: historical specs enumerate child fields/packages, while the current L0 authority forbids deciding child collection fields, package/price, payment disclosure, delivery/revision timing, retention/deletion timing and opening-held product behaviour when not supplied as a current Founder decision.

Until that decision sheet exists, the child public flow remains blocked; no data collection, payment instruction, email, delivery or new CTA is activated.

## Verification limit

The APIs depend on migrations `0003`–`0006` and the existing server-only Supabase environment variables. They have not been applied to `essence-staging` in this local session; integration/RLS verification remains **UNVERIFIED**.
