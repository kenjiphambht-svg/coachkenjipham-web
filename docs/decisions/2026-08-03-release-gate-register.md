# Canonical release gate register — stack freeze

**Status date:** 2026-08-03  
**Applies to:** PR #121–#133, staging project `essence-staging`
(`jmnkhlgumlvywdaeahmx`)  
**Decision:** YELLOW audit accepted; feature development frozen; no merge, no
production deploy, no public activation.

This register is the single canonical gate list for the frozen stack. An open
gate remains open until explicit new evidence closes it. No open gate in this
document is to be treated as passed.

## Current frozen flags

- `private_storage_ready=false`
- `deletion_workflow_ready=false`
- email provider readiness OFF
- calendar readiness OFF

## Gate 1 — Supabase Platform

**Status:** OPEN

### Required closure items

1. **B4 Storage/PostgREST compatibility**
   - Canonical blocker: the installed `@supabase/supabase-js` server client
     rejects the observed new secret-key flow for the required trusted
     PostgREST/private Storage path because it transmits that credential as a
     Bearer token rather than the working gateway pattern captured in the
     support packet.
   - Canonical evidence path:
     `docs/decisions/2026-08-03-supabase-secret-rest-compatibility.md`
2. **Real object + metadata + audit E2E**
   - Must prove one real private publication flow with object write,
     metadata row creation, audit evidence and fail-closed authorization.
3. **Real deletion E2E**
   - Must prove one real deletion workflow that removes object + metadata,
     records the audit trail and preserves fail-closed behavior on retry or
     unauthorized access.
4. **Supabase support packet path**
   - Use the prepared redacted packet only:
     `docs/decisions/2026-08-03-supabase-secret-rest-compatibility.md`

### Frozen interpretation

- `private_storage_ready=false` remains authoritative.
- `deletion_workflow_ready=false` remains authoritative.
- No customer, child or publication workflow may rely on private Storage until
  this gate is explicitly closed with real evidence.

## Gate 2 — Supabase Auth and Security

**Status:** OPEN

### Required closure items

1. **Canonical authenticated non-admin test**
   - Must rerun against canonical staging Auth sessions, not only local shims.
2. **Canonical AAL1 test**
   - Must prove denial at the exact authenticated-but-not-AAL2 path.
3. **Canonical AAL2 test**
   - Must prove allowed access only for the intended AAL2 admin path.
4. **Fresh Security Advisor**
   - Must rerun through an authorized management channel and record the
     current result set.
5. **Leaked Password Protection plan gate**
   - Must record the production decision path for this plan-limited control
     before release.

### Frozen interpretation

- Historical anonymous-RLS evidence is retained, but it does not close the
  authenticated/AAL/Security-Advisor gate.
- No authenticated security gate is treated as fully passed for release until
  these canonical checks are rerun and recorded.

## Gate 3 — Providers

**Status:** OPEN

### Required closure items

1. **Resend secure connection**
2. **Sending-domain verification**
3. **Cal.com secure connection**
4. **Real provider E2E**
   - one real email verification flow
   - one real calendar verification flow
   - idempotency, revocation and fail-closed evidence

### Canonical connection package

- `docs/decisions/2026-08-03-provider-connection-package.md`

### Frozen interpretation

- Checked-in adapters remain mock/fail-closed.
- Email readiness remains OFF.
- Calendar readiness remains OFF.
- No provider gate is treated as passed without a secure agent-operated
  connection session and real post-connection evidence.

## Gate 4 — Dependency Security

**Status:** OPEN

### Exact remaining advisory IDs

- `GHSA-qx2v-qp2m-jg93`
- `GHSA-6g55-p6wh-862q`
- `GHSA-r28c-9q8g-f849`
- `GHSA-f88m-g3jw-g9cj`

### Affected package paths

- `node_modules/next/node_modules/postcss`
- `node_modules/sharp`

### Production applicability

- These findings remain relevant to a production release decision because the
  audited build still depends on the affected package paths.
- Safe remediation already applied where supported:
  Next `15.5.20 → 15.5.22`.
- `npm audit fix --force` proposed an incompatible downgrade to `next@9.3.3`
  and was therefore rejected.

### Supported remediation requirement

- A supported upstream remediation path must exist and pass regression before
  release.

### Accepted-risk rule

- No production accepted-risk decision is granted by this freeze.
- If no safe supported upgrade exists at the time of release-gate work, an
  explicit accepted-risk decision must be recorded with exact advisories,
  package paths, production applicability and compensating controls.

## Docker restore evidence

The preserved restore evidence is:

- **isolated PostgreSQL restore verified**
- **not a full Supabase platform restore**

Canonical evidence path:

- `docs/decisions/2026-08-03-b9-local-restore-drill.md`

This evidence verifies public-schema/seed-data restore only. It does not close
Storage, Auth, Realtime, migration-metadata or platform-compatibility gates.

## Next resumable work order

**Work order name:** `ESSENCE EXTERNAL RELEASE GATE CLOSURE`

This future work order may begin only when at least one of the following is
true:

1. Supabase responds to the prepared support ticket.
2. Founder authorizes one secure provider-connection session.
3. Supported dependency remediation becomes available.
4. Founder explicitly authorizes release-gate closure work.

## Secure connection session rule

Any future secure connection session must be agent-operated:

- Founder may only authorize account access or enter credentials into a secure
  provider field.
- Founder must not run commands, edit code, inspect logs or configure
  environment variables manually.
- No secret may be pasted into chat.

## Freeze summary

The stack is intentionally frozen in YELLOW state. PR #121–#133 remain a
stacked Draft set for preservation and later resumption; they are not approved
for merge, production deployment or public activation.
