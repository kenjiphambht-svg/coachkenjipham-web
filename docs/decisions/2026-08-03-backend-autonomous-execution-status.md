# Autonomous execution ledger — 03/08/2026

| Phase | Branch / PR | Staging | Evidence / gate |
| --- | --- | --- | --- |
| B0–B2 | #121–#123 | 0001–0010 applied | 75 passed, 0 skipped; lint clean |
| B3 | `feat/b3-hat-mam-journey` / #124 | 0011 applied | public/deletion/Storage fail-closed |
| B4 | `feat/b4-private-publication` / #125 | 0012–0013 applied | canonical-host probe: publishable works for Auth/Storage; new secret is rejected by the installed JS client because it sends it as Bearer. Direct Storage `apikey` probe reaches gateway (400, not invalid-key); replace runner with server-only HTTP protocol before E2E. `private_storage_ready=false` |
| B5 | `feat/b5-admin-operations` / #126 | 0014 applied | versioned settings foundation; AAL2 admin read only |
| B6 | `feat/b6-email-resend` / #127 | 0015 applied | mock outbox/provider; Resend account is still required for real delivery |
| B7 | `feat/b7-private-calcom` / #128 | 0016 applied | noindex private route and mock calendar; Cal.com account is still required |
| B8 | `feat/b8-data-deletion` / #129 | 0017 applied | approval-only deletion ledger and mock adapter; 80 passed, 0 skipped; real drill is a B4 platform gate |

Security: `app_private.is_admin()` replaces exposed public helper. Leaked Password Protection is PLAN-LIMITED PRODUCTION GATE. `api_idempotency_keys` and `rate_limit_buckets` require direct-denial evidence before final Advisor classification.

Track B evidence: `docs/decisions/2026-08-03-supabase-secret-rest-compatibility.md`. B4 production readiness remains blocked on user-scoped AAL2 route or Supabase PostgREST secret-key compatibility; work packages B5–B12 continue independently.
