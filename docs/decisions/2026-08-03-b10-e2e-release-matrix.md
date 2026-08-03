# B10 — end-to-end release matrix

## Verified in the current staging/Preview evidence set

| Control | Evidence | Status |
| --- | --- | --- |
| Schema migration history | local/remote `0001`–`0017` aligned; DB lint clean after `0017` | pass |
| Existing RLS, token, rate-limit, idempotency, state-machine, mock email/calendar/deletion controls | Preview-backed Vitest suite | pass — automated evidence only |
| Test accounting | 13 test files, 82 tests | pass — 0 skip |
| Public Hạt Mầm activation | database gate remains false | pass — safely off |

## Not verified — release blockers, not skipped passes

| Flow | Why it is not passed | Gate |
| --- | --- | --- |
| User-scoped AAL2 private Storage E2E | server-side PostgREST/secret-key compatibility is documented in B4 Track B | `private_storage_ready=false` |
| Real deletion of a dummy private object plus metadata | depends on the same B4 trusted Storage path | `deletion_workflow_ready=false` |
| Resend sending and webhook lifecycle | account/domain credentials not connected | email readiness is waiting |
| Cal.com private embed booking | account/integration not connected | calendar readiness is waiting |
| Security Advisor rerun | Founder Dashboard checkpoint still open | release gate remains open |
| Isolated restore drill | requires a Founder-approved disposable database target | recovery gate open |

## Enforcement

`src/lib/release/gates.ts` keeps readiness false unless every real dependency is explicitly verified. Passing mock/unit/integration tests do not override a missing operational proof. There is no deployment or public activation action in B10.
