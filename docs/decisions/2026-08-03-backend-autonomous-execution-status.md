# Autonomous execution ledger — 03/08/2026

| Phase | Branch / PR | Staging | Evidence / gate |
| --- | --- | --- | --- |
| B0–B2 | #121–#123 | 0001–0010 applied | 75 passed, 0 skipped; lint clean |
| B3 | `feat/b3-hat-mam-journey` / #124 | 0011 applied | public/deletion/Storage fail-closed |
| B4 | `feat/b4-private-publication` / #125 | 0012–0013 applied | canonical-host probe: publishable works for Auth/Storage; new secret is rejected by the installed JS client because it sends it as Bearer. Direct Storage `apikey` probe reaches gateway (400, not invalid-key); replace runner with server-only HTTP protocol before E2E. `private_storage_ready=false` |

Security: `app_private.is_admin()` replaces exposed public helper. Leaked Password Protection is PLAN-LIMITED PRODUCTION GATE. `api_idempotency_keys` and `rate_limit_buckets` require direct-denial evidence before final Advisor classification.
