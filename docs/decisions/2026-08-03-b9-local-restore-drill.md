# B9 — isolated local restore drill, final audit

## Result

**PASS — public schema and seed-only data restored to an isolated local
PostgreSQL 16 container with explicit Supabase compatibility shims.** This is
not a claim that Auth, Storage, Realtime, or Supabase migration metadata were
restored.

- Source snapshots: B8 durable staging schema/data dumps, outside Git.
- SHA-256 verification: schema `a93145f2ddc69a3f1be222b57cff084bade6ae60f318242a0058f070d950c76e`; data `6af4b50a42fb448b538ba93d56714fa10fe561a60b309427c126e9aef78f9ae0`.
- Target: `postgres:16-alpine`, an internal Docker network and a named volume
  created solely for the drill. No staging or production connection exists in
  the script.
- Duration: 2 seconds after the image was available.
- Cleanup: the script trap removed the named container, network and volume;
  post-run Docker filters returned no matching resource.

## Restored and smoke-tested

| Check | Result |
| --- | --- |
| public tables / functions | 20 / 10 |
| RLS-enabled public tables / policies | 20 / 35 |
| seed-only row-count summary | `admin_users:1`, `hatmam_orders:3`, `hatmam_child_profiles:2`, `lang_applications:5`, `payments:2`, `publications:0` |
| anonymous child-table SELECT privilege | `false` |
| authenticated AAL1 admin child rows (local auth shim) | 0 |
| authenticated AAL2 non-admin child rows (local auth shim) | 0 |
| authenticated AAL2 admin child rows (local auth shim) | 2 |
| `consume_rate_limit` first / second call | `true` / `false` |

The drill printed metadata and row counts only; it did not print seed values,
child data, credentials or tokens.

## Explicit limitations

The durable dump was created with `--schema public`, so
`supabase_migrations.schema_migrations` is intentionally absent. The local
target supplies minimal `auth.jwt()`, `app_private.is_admin()`, Auth-user and
`extensions.pgcrypto` shims only to allow public schema, policies and seed
data to restore. It cannot verify Supabase Auth MFA, Storage object policies,
Realtime, API gateway behavior or a production restore.

This closes the B9 **isolated restore-drill** evidence for public schema/data.
It does not clear B4/B8 Storage/deletion gates and does not authorize an
overwrite, `db reset`, schema drop, production restore or deployment.

Reproducible command: `scripts/audit-local-restore-drill.sh`.
