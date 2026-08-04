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

## Founder Auth enrollment and recovery

`/admin/dang-nhap` now offers **Quên mật khẩu?** and points a Founder who has
not yet set a password to their Supabase email. `/admin/quen-mat-khau` always
returns the same confirmation copy and only sends for the canonical Founder
address; it never reveals whether an account exists. The recovery email uses
one exact branch-alias callback path, `/admin/dat-lai-mat-khau`, and a
server-only Vercel Preview access value.

The reset route exchanges a recovery code only in the browser, removes it from
the visible URL, checks the current session against the canonical active-admin
record on the server, then changes the password through Supabase Auth. It does
not create an admin role, relax RLS, reset an MFA factor or grant AAL2. The
session is signed out locally after a successful reset, so the Founder must log
in and verify MFA again before any admin route is available. The UI requires at
least 12 characters with lowercase, uppercase and a number.

No key, secret, command, environment setting or manual debugging is required
from the Founder. Passwords, recovery tokens, QR codes and provider errors are
never written to repository evidence or application logs.

### Approved Vercel branch access (2026-08-04)

Founder authorised the one-link Hobby-plan replacement. Before replacement,
Vercel reported only that one Shareable Link already existed; its target,
creation date and label were not exposed in the project UI. Replacing it
revoked access only: no deployment or domain was deleted. The new Shareable
Link is bound to `feat/wp1-admin-operating-experience`, which follows its
latest Preview deployment. Vercel Authentication remains ON.

Its opaque access value is stored as the sensitive Preview variable
`VERCEL_ADMIN_RECOVERY_SHARE_QUERY`, scoped to that branch. It is never placed
in a `NEXT_PUBLIC_` variable, source, Git, PR text, runtime log or test
evidence. The server builds `redirectTo` from a hard-coded exact branch alias
and `/admin/dat-lai-mat-khau`; it ignores request Host headers and all client
redirect input. The reset page immediately removes Vercel/Supabase parameters
from the visible URL and uses `Cache-Control: no-store`, `Referrer-Policy:
no-referrer` and `noindex, nofollow`.

The staging Auth redirect allowlist contains the exact branch callback path
pattern required for that protected route. A no-cookie preflight confirmed that
the Shareable Link reaches the reset page, while the same route without link
access reaches Vercel login. A no-cookie request through the link could not
read an admin API (HTTP 401), and a reset route with no recovery credential
showed the fail-closed invalid-link state. One recovery request was then
submitted through the staging UI for the canonical Founder address; its
response used the required non-enumerating confirmation copy. No link,
access value, recovery credential, password, MFA value or email content was
recorded.

### Cross-device recovery repair

The first recovery request was created from a trusted server while the Founder
opens the email on a separate device. A PKCE code flow would bind that code to
the initiating browser's verifier and therefore cannot complete on the
Founder's browser. Recovery mail now intentionally uses Supabase's implicit
one-time recovery flow. The reset page accepts only the resulting canonical
Founder session, immediately replaces the URL to remove the fragment and then
requires a new sign-in plus MFA. The previous email cannot be relied upon; a
single replacement recovery email is sent only after this repair reaches the
protected branch Preview.

## Founder acceptance correction pass

This correction remains on the same Draft PR and adds a complete
synthetic-only operating loop:

- Publication review can request revision, approve/re-approve and revoke a
  synthetic metadata/checksum record. Every action writes synthetic audit
  evidence; no private Storage operation is callable.
- Deletion can open an affected-record preview, show object-before-metadata
  order, confirm and retry. Confirmation deliberately records
  `FAIL_CLOSED`; it never calls destructive SQL or Storage deletion.
- Hạt Mầm distinguishes payment reported, confirmed, in production, awaiting
  Kenji review, revision requested and ready. Delivery remains blocked by B4.
  Due dates, revision deadline and overdue warnings are per-order values.
- Payment confirmation is a single database transaction that locks the order,
  reads its immutable package snapshot, requires a non-revoked reported
  payment request plus a matching receipt-evidence record, then audits the
  transition. Current price constants are not used for confirmation.
- New parent-intake orders read the active versioned settings and snapshot
  package name, amount, capacity, delivery, revision and retention. Existing
  order snapshots are never rewritten by later settings changes.
- Server-side validation rejects invalid integer/range/text values, reference
  prices below launch prices and every attempt to turn on release/provider
  readiness.

### Correction migrations and verification

- `0020_wp1_founder_acceptance_corrections.sql` — applied to staging.
- `0021_fix_wp1_intake_lint.sql` — applied to staging; forward-only lint
  repair of the active-settings intake function.
- Migration history is aligned through `0021`.
- `supabase db lint --linked` — no schema errors.
- `npx tsc --noEmit` — pass.
- `npx vitest run --exclude tests/rls-child-profiles.test.ts` — 19 files,
  111 tests pass; no skipped tests.
- `npm run lint` and production build — pass with only pre-existing legacy
  warnings outside WP1 scope.

The canonical staging Auth/RLS/AAL/Security-Advisor release gates remain OPEN.
They are not represented as pass evidence in this document.
