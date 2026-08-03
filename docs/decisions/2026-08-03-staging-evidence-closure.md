# Đóng evidence staging B0–B2 — 03/08/2026

## Snapshot bền vững

Hai dump trước migration đã được sao chép ngoài repository. Không commit dump, không chạy restore.

| File | SHA-256 |
| --- | --- |
| `/Users/macos/Documents/03. RESOURCES/coachkenjipham-backups/essence-staging/2026-08-03-pre-0003-0007/essence-staging-pre-0003-0007-schema.sql` | `26b3e0e88f9b22f26dd65df8d753ec6253be1c623f395933573b27f233e7e51d` |
| `/Users/macos/Documents/03. RESOURCES/coachkenjipham-backups/essence-staging/2026-08-03-pre-0003-0007/essence-staging-pre-0003-0007-data.sql` | `087db2bc8d9d7dc378f19d30fa2d1ed1d53895af8e37b946bf5c60301697e3a7` |

Restore procedure (manual-only): Founder first approves a target that is neither production nor a customer-data environment; verify both checksums; create a fresh pre-restore dump of the target; review the dump contents; restore schema before data using a privileged local operator. Never run this procedure through an application route or an automatic migration.

## Resolution of the skipped test

- **File:** `tests/rls-child-profiles.test.ts`
- **Former skipped test:** `ca 4 — bỏ qua vì chưa có kết nối cơ sở dữ liệu > nhắc cách chạy test RLS`.
- **Technical reason:** it was deliberately guarded by `describe.skipIf(hasDb)`, so a staging run with credentials always skipped this reminder test.
- **Missing dependency:** none on staging; only `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` were missing in a developer shell.
- **Impact:** it did not skip the ten real anonymous RLS assertions, therefore did not conceal a B0/B1/B2 failure. It nevertheless prevented a 0-skip evidence pack.
- **Resolution:** the reminder test is removed and an explicit credentials assertion is part of the real RLS suite. A staging run now fails closed if credentials are absent; expected result is 75 pass, 0 skip.

**Confirmed regression:** Vercel preview environment test run on 03/08/2026: **9 files passed, 75 tests passed, 0 skipped**.

## DB lint classification

`supabase db lint --linked` reported both warnings for `public.create_lang_application_from_intake`, defined in migration `0006_public_intake_write_api.sql`.

| Warning | Cause | Security impact | Runtime impact | Decision |
| --- | --- | --- | --- | --- |
| `auto variable "v_attempt" shadows a previously defined variable` | `v_attempt` was declared and then re-declared by `FOR v_attempt IN ...`. | No authorization, RLS, SQL-injection, or data exposure finding; it reduces review clarity in a `SECURITY DEFINER` RPC. | None observed. | Fix with forward migration `0009`; never edit applied `0006`. |
| `unused variable "v_attempt"` | The loop counter was never referenced. | Same: not an Advisor finding, but avoidable ambiguity in sensitive code. | None observed; retry behavior worked. | Fix with `v_order_attempt`, used to raise on the fifth collision. |

`0009` preserves the service-role-only grant and explicit `public, extensions` search path. PostgreSQL still diagnosed its explicit loop declaration, so `0010` is the minimal forward completion: it removes only that declaration. Neither migration rewrites applied history. Regression is required after applying `0010`.

**Confirmed regression:** `0010` was dry-run, applied to staging, then `supabase db lint --linked` returned `No schema errors found` with an empty result set.

## Open release gate

Security Advisor remains open. Founder manual checkpoint: **Supabase Dashboard → Database → Security Advisor → Rerun Advisor**. Supply a screenshot or result only; never provide an API key or secret in chat.
