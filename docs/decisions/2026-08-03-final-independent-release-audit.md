# Final independent release audit and Founder decision package

**Audit scope:** B0–B12, canonical staging `essence-staging`
(`jmnkhlgumlvywdaeahmx`), stack PR #121–#133. This is the canonical status
record. Historical PR evidence remains historical; it is not overwritten by
this assessment.

## Executive conclusion — YELLOW, do not release

The backend has a credible staged schema baseline, canonical anonymous-RLS
evidence, 94 non-skipped automated tests, a clean database lint result and a
successful isolated restore of the public-schema/seed snapshot. The code is
**not ready for production or public Hạt Mầm activation**. The critical real
private-publication/deletion path is platform-blocked, email and calendar are
mocks without providers, and authenticated AAL1/AAL2 checks were not rerun
against canonical Supabase Auth sessions.

**Recommendation:** do not merge the stack; do not deploy production; keep
public activation OFF; keep legacy PR #118 and #120 Draft. This is YELLOW
rather than RED because no confirmed data loss, public-child-data exposure or
failed control was found, and fail-closed gates remain effective. It must not
be interpreted as a go-live approval.

## Independent top-of-stack evidence

| Check | Result |
| --- | --- |
| lockfile/install integrity | `npm ci --ignore-scripts --dry-run` completed |
| typecheck | pass |
| lint | exit 0; 12 pre-existing frontend warnings listed below |
| production build | pass, 25 routes generated |
| final suite | 17 files, **94 passed, 0 skipped** |
| canonical staging anonymous RLS | 11 assertions passed directly against `jmnkhlgumlvywdaeahmx.supabase.co` |
| migration history | local/remote `0001`–`0017` aligned |
| `supabase db lint --linked` | clean, no schema errors |
| secret / dump / CLI-temp scan | no tracked secret pattern, dump or `.temp`; `.env.example` only |
| private route / sitemap assertions | 6 noindex/direct-Cal/sitemap/Tally assertions passed |
| isolated B9 restore | pass for public schema + seed data; Docker resources destroyed |

### Warnings and S0/S1 findings

**S0: none.**

**S1 — production dependency debt:** `npm audit fix --omit=dev` safely moved
Next `15.5.20 → 15.5.22` and resolved five high plus one moderate findings.
Three high findings remain through Next's bundled PostCSS and Sharp range.
`npm audit` proposes only `--force`, which would downgrade to incompatible
`next@9.3.3`; that is unsafe and was not run. No production deployment should
occur until a supported Next/Sharp remediation path is available and tested.

**Non-blocking frontend lint debt (outside this backend package):**

- `src/components/homepage/HomeHeader.tsx:49,54` — two `<img>` LCP/bandwidth warnings.
- `src/components/landing-giao-mua/Room6FAQGM.tsx:112`,
  `src/components/landing-hat-mam/Room7Doors.tsx:162`,
  `src/components/landing-kham-pha/Room6FAQKP.tsx:109`,
  `src/pages/thanh-toan-goi-1.tsx:52`, `src/pages/thanh-toan-goi-2.tsx:55`
  — six `<img>` optimization warnings.
- `src/pages/kidbook.tsx:2` — six unused icon imports on a legacy route.
- `next lint` itself is deprecated; the script exits successfully. Migration
  to ESLint CLI is separate build-tooling work.
- Tailwind reports ambiguous `duration-[400ms]` during build. It is existing
  frontend styling debt, not a backend security warning.

No warning was changed in this audit because fixing it would be unrelated
frontend/legacy polish.

## B0–B12 truthful phase readiness

| Phase | Objective | Implementation / migration | Positive evidence | Negative evidence / gate | Readiness |
| --- | --- | --- | --- | --- | --- |
| B0 | backend security, RLS/AAL2, atomic Lặng state changes | `0003`–`0005`; admin/auth/domain modules | migrations aligned; canonical anonymous denial; local RLS shim proves policy shape | canonical authenticated non-admin/AAL1/AAL2 sessions not rerun | code complete; partial staging verification |
| B1 | public contact/Lặng intake, validation, idempotency | `0006`, `0008`; public API routes | schema applied; validation/crisis/idempotency tests | canonical positive service-RPC journey not rerun | code complete; mock verified |
| B2 | Lặng payment/report/private booking token | `0007`; private routes/admin APIs | token hash/expiry/revocation tests; noindex assertions | real payment confirmation and booking provider flow absent | mock verified |
| B3 | Hạt Mầm safe native intake and gates | `0011`; parent route/API/schema | gates-off handler test; consent/package/retention schema | real child intake intentionally unavailable | code complete; public flow not release-ready |
| B4 | private Storage publication | `0012`, `0013` | private bucket/metadata schema, lint, redacted gateway probe | user-scoped AAL2 Storage E2E cannot use observed trusted PostgREST transport | platform blocked |
| B5 | versioned admin operations | `0014` | migration and AAL2 read policy present | settings management/write UI absent | code complete, limited scope |
| B6 | email | `0015`, mock provider | hash-only outbox and idempotency test | Resend/domain/provider adapter unconnected | provider connection pending |
| B7 | private calendar | `0016`, mock provider/private route | noindex/no-direct-URL/idempotency test | Cal.com adapter/event types unconnected | provider connection pending |
| B8 | retention and deletion | `0017`, approval ledger/adapter | object-before-metadata mock, RLS, retention rules | real object+metadata deletion blocked by B4 | platform blocked |
| B9 | backup/recovery | manifest + audit script | checksum, public schema/seed restore and smoke checks in isolated Docker | Auth/Storage/migration metadata excluded from snapshot scope | staging snapshot verified, partial platform scope |
| B10 | end-to-end release truth | release matrix/gates + new safety tests | gate tests, Hạt Mầm fail-closed test, route checks | not executable cross-provider E2E | mock verified; not E2E complete |
| B11 | technical map | documentation | map exists | no executable system behavior | documentation only |
| B12 | cutover control | guard/runbook | Founder/every-gate tests | no authorization and gates open | Founder decision required |

Detailed requirement-level classification: see
`2026-08-03-final-traceability-matrix.md`.

## Journey readiness

- **Contact:** server route, validation, rate limiting and hash idempotency are
  implemented. Canonical anonymous RLS is verified. Full positive service-RPC
  and AAL2 admin visibility are not independently current-staging verified.
- **Lặng:** six-question validation, crisis stop, Human Decision state model,
  capacity model, hash-only payment/booking tokens and private noindex routes
  are implemented. Actual bank evidence, authenticated admin AAL2 lifecycle,
  provider booking and follow-up email are not real E2E passes.
- **Hạt Mầm:** package/consent/minimal intake schema, 10/month default,
  5-business-day/7-day defaults and retention rules exist. Public collection
  is correctly OFF. Hạt Mầm manual payment confirmation/Kenji operations path
  is not implemented; publication/deletion are blocked.
- **Storage/publication and deletion:** both stay OFF:
  `private_storage_ready=false`, `deletion_workflow_ready=false`. No customer
  or child publication flow may activate.
- **Email and Cal.com:** mock-only; connection package is
  `2026-08-03-provider-connection-package.md`.
- **Backup/restore:** public schema/data restore passed locally from the
  durable staging snapshot. This is not a full Supabase platform restore.
- **Security Advisor:** historical evidence was 0 errors, a former public
  `is_admin` warning, one plan-limited Leaked Password Protection warning and
  two deny-all-policy info items. `public.is_admin()` has moved to
  `app_private.is_admin()`. A fresh Advisor rerun is an external final gate;
  no management credential was available and no key was requested.

## PR audit and merge order

All PR #121–#133 are open Drafts, unmerged, and their bases form the intended
linear stack: `#121 → #122 → #123 → #124 → #125 → #126 → #127 → #128 → #129
→ #130 → #131 → #132 → #133`. GitHub reported `CLEAN` mergeability for each
at audit time. No production deployment or public activation was initiated.

| PR | Branch | Base | Audited head before final-audit commit |
| --- | --- | --- | --- |
| #121 | `feat/b0-backend-foundation` | `main` | `3ee3e63b0f8be404de4e3ae00dce413cadb6c637` |
| #122 | `feat/b1-public-intake` | `feat/b0-backend-foundation` | `c29de3f733ee453b9f15acb6af4b7c2734560179` |
| #123 | `feat/b2-lang-journey` | `feat/b1-public-intake` | `41e8ed65a87f202d7e9e7d4ad9207f260fb8735c` |
| #124 | `feat/b3-hat-mam-journey` | `feat/b2-lang-journey` | `04470fbaaa7df3f37d67fbabf83c92cf427ceb0e` |
| #125 | `feat/b4-private-publication` | `feat/b3-hat-mam-journey` | `41a0e0bec7e04bf849903619b7e1eb75ec1bd07c` |
| #126 | `feat/b5-admin-operations` | `feat/b4-private-publication` | `3f2730100387b7f932c735758d6bc4c1d8992c8b` |
| #127 | `feat/b6-email-resend` | `feat/b5-admin-operations` | `634eebd76ead5d6a8c5422f68c95deadf121fc68` |
| #128 | `feat/b7-private-calcom` | `feat/b6-email-resend` | `cd0c42e01bffcf5d120936045f235c92d9ad37c8` |
| #129 | `feat/b8-data-deletion` | `feat/b7-private-calcom` | `5e33cf131023a8d531fb69040980837d357a3c16` |
| #130 | `feat/b9-backup-recovery` | `feat/b8-data-deletion` | `aa37cf226fc199a9d8696d15d4985e50561efa96` |
| #131 | `feat/b10-end-to-end` | `feat/b9-backup-recovery` | `01041670a608fbaeca5b6b2e68435453d8cf8c38` |
| #132 | `feat/b11-technical-map` | `feat/b10-end-to-end` | `97198360df74e28a6a27e2f0e30acf6d2053a90e` |
| #133 | `feat/b12-cutover` | `feat/b11-technical-map` | see current PR head; this audit is committed on that branch |

This is dependency order, **not a merge authorization**. PR #118 and #120
remain untouched Drafts.

## Consolidated Founder action list

1. **Submit one Supabase support ticket** using the redacted text in
   `2026-08-03-supabase-secret-rest-compatibility.md`. This is the only path
   to unblock trusted PostgREST/private Storage verification without guessing
   a credential transport.
2. **Authorize one secure provider connection session** for Resend, Cal.com
   and required DNS/account access, following the consolidated connection
   package. Do not send credentials in chat or edit environment files.
3. **Make the release decision only after a fresh Security Advisor rerun is
   available through an authorized management channel and the S1 dependency
   remediation has a supported path.** No screenshot or dashboard debugging
   is requested from Founder in this package.

No Founder command, Docker action, screenshot, key copy/paste or manual
environment edit is requested.
