# B9 — staging backup and recovery baseline

## Evidence retained outside Git

The current durable snapshot is stored outside the repository and is never committed:

`/Users/macos/Documents/03. RESOURCES/coachkenjipham-backups/essence-staging/2026-08-03-pre-0017-b8/`

| Artifact | SHA-256 |
| --- | --- |
| `essence-staging-pre-0017-schema.sql` | `a93145f2ddc69a3f1be222b57cff084bade6ae60f318242a0058f070d950c76e` |
| `essence-staging-pre-0017-data.sql` | `6af4b50a42fb448b538ba93d56714fa10fe561a60b309427c126e9aef78f9ae0` |

The earlier pre-`0003`–`0007` snapshot remains at:

`/Users/macos/Documents/03. RESOURCES/coachkenjipham-backups/essence-staging/2026-08-03-pre-0003-0007/`

## Recovery policy

- Validate the schema and data SHA-256 values before any restore.
- Restore only to a newly created isolated recovery environment, never the live staging database and never production.
- Use an approved database-owner incident runbook to load schema first, then data, and run RLS/token/application smoke checks.
- Do not use `supabase db reset`, drop a schema, or overwrite a live database as recovery steps.
- Corrective forward migrations are preferred for migration defects. Restore is for a declared incident only, after Founder approval.

`src/lib/recovery/manifest.ts` captures these boundaries in testable form. It has no database connection and cannot perform a restore.

## Open gate

This proves dump existence, checksum handling, and a fail-closed restore plan. It is not a restore drill. A real isolated restore drill still requires Founder approval plus a disposable database target; no such target is created by this phase.
