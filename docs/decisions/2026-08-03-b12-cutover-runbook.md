# B12 — manual cutover runbook

## Current decision

**Do not cut over.** This document is a runbook only. It performs no deployment, migration, public activation, provider configuration, or data operation.

## Required gates before a Founder can approve cutover

1. The latest local/remote migration history is aligned and DB lint is clean.
2. A fresh durable schema/data snapshot exists outside Git, and both SHA-256 values are checked.
3. A real dummy-data, user-scoped AAL2 private Storage E2E succeeds: upload, authorized access, expiry/denial, and cleanup.
4. The same trusted path completes private-object then metadata deletion with a second AAL2 admin verification; only then may `deletion_workflow_ready` be considered.
5. Resend and Cal.com have their intended production configuration, scoped credentials, and successful non-sensitive test transactions.
6. Founder has rerun Supabase Security Advisor and recorded its result. Leaked Password Protection requires a plan/production decision.
7. An isolated restore drill has been performed and documented; never restore over a live database.
8. The Founder explicitly approves the final release state. Technical evidence never substitutes for this approval.

## Controlled sequence after all gates are true

1. Capture and checksum a final staging snapshot.
2. Run the complete non-skipped regression suite and record its commit SHA.
3. Perform the separately approved production deployment.
4. Run deployment smoke checks while public activation remains off.
5. Enable public activation only after smoke checks, then observe audit, rate-limit, provider, and deletion evidence.

## Abort and recovery

- Before public activation: stop the cutover and use a corrective forward migration or configuration fix. Do not run `db reset` or drop a schema.
- After activation: immediately disable public activation, preserve audit evidence, and investigate on an isolated recovery target. A full restore requires a declared incident and Founder authorization.
- Never treat a mock pass, skipped test, or unconnected provider as clearance.

`src/lib/release/cutover.ts` enforces the first two conditions in code: Founder approval and a fully verified gate set. It returns instructions only and cannot perform cutover actions.
