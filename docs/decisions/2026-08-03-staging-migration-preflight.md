# Staging migration preflight — essence-staging

**Project ref:** `jmnkhlgumlvywdaeahmx`  
**Environment:** staging only; no production deployment or customer data.

## Baseline verification before history repair

Read-only metadata queries confirmed that the remote database already has the complete effective baseline of local migration `0001`:

- 10 expected public tables, each with RLS enabled; only `hatmam_child_profiles` has FORCE RLS.
- Four expected enum types, three baseline functions, ten `set_updated_at` triggers and seven baseline indexes.
- All 15 expected baseline policies exist; no extra baseline policy was observed.
- Aggregate-only seed checks matched the known test fixture counts and patterns: 5 Lặng, 3 Hạt Mầm, 2 child profiles and 3 contact messages. No row content was exported.

## `0002` equivalence

Remote migration version `20260803022722` has the same executable effects as local `0002_security_hardening.sql`: pin `search_path` for `set_updated_at` and `generate_access_token`; revoke `is_admin()` from anon/public; retain execute for authenticated. Differences are comments and a harmless duplicate semicolon only.

## Repair scope and rollback

The approved repair only inserts version markers `0001` and `0002` in `supabase_migrations.schema_migrations`. It does not execute their SQL, reset the database, drop objects or mutate business data.

If a post-repair dry-run is not limited to `0003`–`0007`, stop before `db push`; inspect history and restore the prior history snapshot/markers rather than running any migration. Pre-migration dump is required before `db push`.

## Canonical history and snapshot evidence

- Repaired history markers: `0001` and `0002` marked applied only after the preceding metadata verification. The obsolete marker `20260803022722` was then marked reverted; its SQL was not rolled back.
- `supabase/migrations/` is now forward-only. The destructive manual rollback for `0001` is retained at `supabase/rollbacks/0001_init_down.sql` and is never run automatically.
- Dry-run after canonicalization listed exactly `0003`–`0007` and no other migration.
- Pre-migration snapshots are outside the repository at `/private/tmp/essence-staging-pre-0003-0007-{schema,data}.sql`:
  - schema SHA-256: `26b3e0e88f9b22f26dd65df8d753ec6253be1c623f395933573b27f233e7e51d` (20,062 bytes)
  - data SHA-256: `087db2bc8d9d7dc378f19d30fa2d1ed1d53895af8e37b946bf5c60301697e3a7` (9,705 bytes)

## Migration scope review

`0003`–`0007` contain no table/schema drop, data delete, truncate or reset. `0004` renames raw-token columns and hashes their existing values; `0003` replaces one direct-update policy with a server-only transaction RPC; `0007` uses foreign-key cascade only for a future payment-request row when its parent application is explicitly deleted.

## Applied migrations and staging test evidence

- `0003`–`0007` were applied to staging after the snapshot. `0004` initially exposed that Supabase installs pgcrypto in `extensions`; its still-unapplied SQL was corrected to call `extensions.digest` and then applied successfully.
- Integration then exposed the same namespace issue in the already-applied `0006` intake RPC. Forward migration `0008_fix_intake_pgcrypto_search_path.sql` was dry-run and applied; it pins that function to `search_path = public, extensions`.
- Migration history is now synchronized through `0008`.
- Preview-environment test suite: 74 passed; 1 guard test skipped because its missing-environment reminder is inapplicable when staging variables are supplied. The 10 live anon RLS cases ran and passed; the skip is not counted as a pass.
- Additional transaction test ran on staging and rolled back: anon denial; authenticated non-admin denial; admin AAL1 denial; admin AAL2 access; failed paid transition rollback; confirmed-payment evidence; booking/payment hash-at-rest; expired and revoked payment link denial; Postgres rate limiting; idempotency replay/reuse denial.
- `supabase db lint --linked` completed with two non-security PL/pgSQL warnings about `v_attempt` in the intake RPC. No Security Advisor result is asserted: the official advisor endpoint requires a Management API token with `advisors_read`, and no credential was read from keychain or source.
