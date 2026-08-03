# WP1 — Admin Operating Experience (staging evidence)

**Date:** 2026-08-04
**Scope:** Draft PR on top of the frozen B0–B12 stack.
**Decision boundary:** This is an operational-admin implementation. It does not
close any frozen release gate, authorize a merge, deploy production, enable
public activation or use customer/child data.

## What is now implemented

All routes are protected by the existing Supabase Auth + active-admin + AAL2
server guard.

- `/admin` — daily overview, actionable queues, readiness and SLA summary.
- `/admin/lang` and `/admin/lang/[id]` — Lặng queue, payment/booking context,
  human decision gate, AI decision-support summary and explicit decision notes.
- `/admin/hat-mam` and `/admin/hat-mam/[id]` — package snapshot, consent,
  child profile only on the deliberate protected detail page, manual payment and
  atomic production-state progression.
- `/admin/thanh-toan` — reported payment evidence for manual Kenji review; no
  banking automation or account details.
- `/admin/xuat-ban` — metadata, checksum and review checklist only. Real
  publish/revoke/delete controls are fail-closed while B4 remains open.
- `/admin/xoa-du-lieu` — retention/deletion ledger and impact preview only.
  Real deletion remains fail-closed while B4/B8 gates remain open.
- `/admin/cai-dat` — immutable, versioned operational settings. Saving creates
  a new active version and audit record; historical versions are not edited.

The corrected internal operator address is `kenjipham.bht@gmail.com`. The
public contact address remains `contact@coachkenjipham.com`.

## Staging database changes

1. `0018_admin_operating_experience.sql`
   - Adds service-role-only RPCs for atomic Hạt Mầm state transitions and
     versioned settings saves.
   - Each successful operation creates an audit record.
   - Does not enable Storage, deletion, a provider, public activation or any
     destructive schema operation.
2. `0019_wp1_synthetic_acceptance_fixtures.sql`
   - Adds/normalizes only the explicitly synthetic `HATMAM-TEST01` through
     `HATMAM-TEST03` records so Admin can demonstrate HM-01/HM-02 flows.
   - Adds synthetic consent, package snapshot, reported-payment and deletion
     preview evidence only for those test orders.
   - Does not query, modify or expose customer data.

Staging migration history was verified aligned from `0001` through `0019`.
`supabase db lint --linked` returned no schema errors after the push.

## Rollback and fixture cleanup

`supabase/rollbacks/0019_wp1_synthetic_acceptance_fixtures_down.sql` is a
manual, staging-only cleanup script. It reverses only the generated `TEST`
fixture deltas. It must never run automatically and is not a substitute for a
database restore.

`0018` is forward-only. If a rollback is needed, disable the affected UI/API
route first, restore from the verified staging snapshot under the existing
recovery procedure, then apply a separately reviewed forward repair. Do not
use `db reset`, drop a schema or re-run an old migration.

## Verification record

- `npx tsc --noEmit` — pass.
- `npx vitest run --exclude tests/rls-child-profiles.test.ts` — 18 files,
  105 tests pass; no skipped tests in this run.
- `npm run lint` — pass with the pre-existing legacy image/unused-import
  warnings outside this WP1 scope.
- `npm run build` — pass.
- `supabase db lint --linked` — no schema errors.

The canonical anonymous-RLS test file intentionally fails when no staging
public test credentials are injected; it is neither skipped nor counted as
passed. This WP1 does not close the frozen authenticated non-admin, AAL1,
AAL2, fresh Security Advisor or canonical RLS release gates. Those remain
recorded as OPEN in `docs/decisions/2026-08-03-release-gate-register.md`.

## Real versus mock/fail-closed

| Area | Status |
| --- | --- |
| Admin auth guard, AAL2 check, queues, audited settings versions, Hạt Mầm atomic transition RPCs | Real staging implementation |
| Lặng AI summary | Decision-support only; never an approval, denial, diagnosis or final customer communication |
| Payment evidence | Real admin review model; no bank connection or automatic confirmation |
| Publication, private object handling, revoke and deletion | Mock/preview and fail-closed; B4 Storage/PostgREST gate remains OPEN |
| Resend and Cal.com | OFF; no provider connection was attempted |
| Synthetic Hạt Mầm records | Staging test fixtures only; never customer/child data |

## Founder setup after a Draft preview is available

One simple enrollment instruction: open the Supabase invitation for
`kenjipham.bht@gmail.com`, set the account password, then scan the QR code on
`/admin/xac-minh-mfa` with an authenticator app and enter its six-digit code.

No key, secret, command, environment setting or manual debugging is required
from the Founder.
