# B8 — deletion and retention controls

## Implemented, but not release-ready

Migration `0017_data_deletion_workflow.sql` adds:

- retention rules: raw Hạt Mầm intake for 12 months, private publication and Lặng private room records for 24 months;
- an early-deletion request/approval/execution ledger with SHA-256 requester and idempotency hashes only;
- forced RLS and AAL2-admin read access; no anonymous, authenticated-client, or public write path.

The application adapter is deliberately unable to run until it is given an already-approved request. Its required order is private Storage object, then metadata, and its retry behaviour is idempotent. It accepts only UUID-shaped, non-query PDF paths, so no child PII can enter an object path.

## Manual operating procedure (do not run automatically)

1. Verify the parent requester out of band and create a hash-only request.
2. An AAL2 admin records approval and the intended object/metadata targets.
3. The server-only worker deletes the private Storage object, then its metadata, and writes non-PII execution evidence.
4. A second AAL2 admin verifies both are absent. On any partial failure, preserve the request as `failed`, retain no new PII, and retry from the recorded stage.

## Release gate

`hatmam_release_gates.deletion_workflow_ready` remains `false`. The required real staging drill is blocked together with B4 by the documented server-side PostgREST secret-key compatibility issue. This mock verification is evidence for control logic only, never proof of a real data deletion. No actual child, customer, Storage, or production data has been deleted.

## Pre-migration snapshot and rollback path

The durable, untracked staging snapshot created immediately before `0017` is:

`/Users/macos/Documents/03. RESOURCES/coachkenjipham-backups/essence-staging/2026-08-03-pre-0017-b8/`

| File | SHA-256 |
| --- | --- |
| `essence-staging-pre-0017-schema.sql` | `a93145f2ddc69a3f1be222b57cff084bade6ae60f318242a0058f070d950c76e` |
| `essence-staging-pre-0017-data.sql` | `6af4b50a42fb448b538ba93d56714fa10fe561a60b309427c126e9aef78f9ae0` |

Migration `0017` is additive only: it creates two tables, indexes, triggers, RLS policies, and three retention-rule records. There is no automatic down migration. The default recovery is a corrective forward migration. A full restore is an incident-only, Founder-approved operation using the snapshot on an isolated target after verifying both checksums; it must never be attempted with `db reset`, a schema drop, or against production.
