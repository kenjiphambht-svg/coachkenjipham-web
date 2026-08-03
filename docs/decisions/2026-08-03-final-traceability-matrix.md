# Final requirement-to-test traceability matrix

Status labels are exclusive for each row: a migration, mock or document is
never silently promoted to a real end-to-end pass. Canonical staging is
`essence-staging` (`jmnkhlgumlvywdaeahmx`). Final top-of-stack automated run:
17 test files, **94 passed, 0 skipped**; its RLS file ran directly against the
canonical staging host using a publishable credential retrieved only into a
temporary permission-600 file.

| ID | Phase | Requirement / implementation | Migration | Test / environment | Current classification | Release gate |
| --- | --- | --- | --- | --- | --- |
| CONTACT-01 | B1 | submit contact via `src/pages/api/lien-he.ts` / public RPC | 0006, 0008 | `api-guard.test.ts`; local unit | CODE COMPLETE | canonical service-RPC positive path not independently rerun |
| CONTACT-02 | B1 | validation and failure response omit input values | — | `api-guard.test.ts` “thiếu lời nhắn”, “lỗi trả về…”; local | MOCK VERIFIED | none for code behavior |
| CONTACT-03 | B0/B1 | Postgres rate-limit fingerprint and public-route use | 0005 | `postgres-rate-limit.test.ts`; local restore smoke; canonical schema present | STAGING VERIFIED | route-wide load test not run |
| CONTACT-04 | B1 | idempotency hash/deduplication | 0006 | `idempotency.test.ts`; local | MOCK VERIFIED | real contact RPC transaction not independently rerun |
| CONTACT-05 | B0 | admin contact visibility is AAL2/RLS constrained | 0003 | local restore RLS shim; `admin-gate.test.ts` | MOCK VERIFIED | canonical authenticated AAL2 session test absent |
| LANG-01 | B1 | six-question intake and crisis stop | 0006 | `api-guard.test.ts` crisis/validation; local | MOCK VERIFIED | canonical positive intake RPC not independently rerun |
| LANG-02 | B0/B2 | Human Decision Gate: review/approve/decline/wait | 0003, 0007 | `state-machine.test.ts`; local | MOCK VERIFIED | no canonical admin-session transition audit |
| LANG-03 | B0/B2 | capacity at payment-link issuance, 5/month | 0003, 0007 | `capacity.test.ts`, `state-machine.test.ts`; local | MOCK VERIFIED | no concurrent canonical capacity race test |
| LANG-04 | B2 | hash-only payment-link issuance and manual transfer report | 0004, 0007 | `private-link.test.ts`, `private-token.test.ts`; local | MOCK VERIFIED | real bank/manual confirmation lifecycle not run |
| LANG-05 | B2/B7 | private booking token expiry/revocation; private noindex route | 0004, 0007, 0016 | `private-link.test.ts`, `route-safety.test.ts`; local | MOCK VERIFIED | Cal.com booking remains provider pending |
| LANG-06 | B2 | completed state / audit entry | 0003, 0007 | `state-machine.test.ts`; local | MOCK VERIFIED | follow-up email is provider pending |
| HATMAM-01 | B3 | HM-01/HM-02 package, native parent intake, consent version | 0011 | `hatmam-release-gate.test.ts`; local | CODE COMPLETE | public activation remains OFF |
| HATMAM-02 | B3 | child-safe minimal collection; no child PII in URL/query | 0011 | `route-safety.test.ts`; schema inspection | MOCK VERIFIED | real child-data flow prohibited until B4/B8 pass |
| HATMAM-03 | B3 | payment only after valid submission / manual confirmation | 0011 | schema/state inspection | NOT IMPLEMENTED | no Hạt Mầm admin confirmation route/workflow |
| HATMAM-04 | B3 | production states and Kenji review | 0011 | `state-machine.test.ts`; local | MOCK VERIFIED | no Hạt Mầm admin operation path |
| HATMAM-05 | B4 | private PDF object and metadata contract | 0012 | schema/lint; `route-safety.test.ts` | PLATFORM BLOCKED | `private_storage_ready=false` |
| HATMAM-06 | B3/B8 | 12/24-month retention and early deletion ledger | 0011, 0017 | `deletion-workflow.test.ts`; local | MOCK VERIFIED | real object+metadata deletion blocked |
| SECURITY-01 | B0 | anonymous child/business table denial | 0003 | `rls-child-profiles.test.ts`; canonical staging, 11 assertions | STAGING VERIFIED | none for anonymous scope |
| SECURITY-02 | B0 | authenticated non-admin denial | 0003 | local restore RLS shim | MOCK VERIFIED | canonical authenticated session fixture absent |
| SECURITY-03 | B0 | AAL1 admin denial | 0003 | local restore RLS shim; `admin-gate.test.ts` | MOCK VERIFIED | canonical AAL1 MFA fixture absent |
| SECURITY-04 | B0 | AAL2 admin access | 0003 | local restore RLS shim; `admin-gate.test.ts` | MOCK VERIFIED | canonical AAL2 MFA fixture absent |
| SECURITY-05 | B0/B2 | SHA-256 token hash at rest, expiry/revocation | 0004, 0007 | `private-token.test.ts`, `private-link.test.ts`; local | MOCK VERIFIED | no provider dependency |
| SECURITY-06 | B0/B1 | audit/retry/idempotency/rate-limit | 0003, 0005, 0006 | `state-machine.test.ts`, `idempotency.test.ts`, `postgres-rate-limit.test.ts`; local restore rate-limit smoke | MOCK VERIFIED | full canonical transaction suite absent |
| SECURITY-07 | B4/B8 | no public private-bucket access, safe deletion | 0012, 0017 | redacted direct probe / deletion mock | PLATFORM BLOCKED | Supabase PostgREST secret transport |
| OPS-01 | B5 | versioned AAL2 operational settings | 0014 | schema/lint only | CODE COMPLETE | admin settings write UI not implemented |
| EMAIL-01 | B6 | idempotent, hash-only email outbox | 0015 | `email-provider.test.ts`; local | MOCK VERIFIED | Resend connection pending |
| CAL-01 | B7 | noindex private calendar surface / deterministic mock | 0016 | `calendar-provider.test.ts`, `route-safety.test.ts`; local | MOCK VERIFIED | Cal.com connection pending |
| DELETE-01 | B8 | approved object-before-metadata deletion adapter | 0017 | `deletion-workflow.test.ts`; local | MOCK VERIFIED | B4 trusted Storage path |
| RESTORE-01 | B9 | checksum-verified isolated restore drill | — | `audit-local-restore-drill.sh`; Docker PostgreSQL 16 | STAGING VERIFIED | platform components excluded from public-schema dump |
| E2E-01 | B10 | release gate cannot be opened by mocks/documents | — | `release-gates.test.ts`, `hatmam-release-gate.test.ts`; local | MOCK VERIFIED | all external real-E2E gates remain |
| MAP-01 | B11 | technical map | — | document review | DOCUMENTATION ONLY | none; does not prove runtime |
| CUTOVER-01 | B12 | Founder + every gate required before manual cutover | — | `cutover.test.ts`; local | FOUNDER DECISION REQUIRED | no cutover action is implemented |

The exact phase audit, PR map, security findings and Founder recommendation
are in `2026-08-03-final-independent-release-audit.md`.
