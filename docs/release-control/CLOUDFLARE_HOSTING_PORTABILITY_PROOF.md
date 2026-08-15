# Cloudflare Hosting Portability Proof

Status: IN PROGRESS — isolated proof only
Founder directive: keep Vercel Production and coachkenjipham.com unchanged.
Base main: 1158a4ef0f93c7f82001726803683a7901895ce2
Proof branch: web/cloudflare-hosting-portability-proof
Worker target name: essence-web-portability-proof

## Hard boundaries

- No coachkenjipham.com or www custom-domain assignment.
- No DNS or nameserver changes.
- No Vercel deletion or Production change.
- No Production DB migration.
- No provider activation or real customer data.
- No WO-05.
- Stop if portability requires business-logic rewrite or material architecture rewrite.

## Release model under proof

- web/*: Cloudflare non-production build -> Worker Version upload -> Preview URL; no Production traffic.
- main: Cloudflare production-branch build -> Worker Version upload only; no Production traffic.
- Founder Release Gate: explicitly promote/deploy the exact reviewed Worker Version to 100% Worker Production traffic.
- Recovery: explicitly roll back/repoint to the previous Worker Version.
- During the proof, Worker Production traffic means only the isolated workers.dev Worker; coachkenjipham.com remains on Vercel.

## Cloudflare build settings required

Build command:
`CLOUDFLARE_PORTABILITY_PROOF=1 npm run cf:build`

Production deploy command:
`npx --yes @opennextjs/cloudflare@1.20.2 upload`

Preview deploy command:
`npx --yes @opennextjs/cloudflare@1.20.2 upload`

Production branch: `main`
Non-production branch builds: enabled for `web/*`.
Custom domains: none.

## Runtime variables/secrets for proof

Use staging/synthetic-safe values only. Never commit or paste secret values in Git/chat.

- `CLOUDFLARE_PORTABILITY_PROOF=1`
- `SUPABASE_URL` -> staging/non-production endpoint only
- `SUPABASE_SERVICE_ROLE_KEY` -> staging/non-production secret only

`CLOUDFLARE_PORTABILITY_PROOF` is a non-secret Worker variable committed in
`wrangler.jsonc` so the isolated probe route exists at runtime. Without the two
staging Supabase bindings, the probe deliberately returns `503` with presence
booleans set to `false`; it never prints credential values.

Do not configure `ESSENCE_GOOGLE_DRIVE_SERVICE_ACCOUNT_JSON` for this proof unless a later Founder gate explicitly permits provider testing.

## Acceptance ledger

1. Current website builds/runs on Cloudflare Workers: PENDING.
2. Public routes + SSR/assets/SEO/security-header parity: PENDING.
3. Staging Supabase/server secrets: PENDING. Read-only probe only.
4. web/* -> Preview Version/URL: PENDING.
5. main merge -> new Worker Version, no Production traffic: PENDING.
6. Founder exact-Version release -> isolated Worker Production: PENDING.
7. rollback/repoint to previous Worker Version: PENDING.
8. Website release does not migrate Production DB: architecture static check PASS; runtime release proof PENDING.
9. Free vs Workers Paid cost: PENDING actual Worker gzip/CPU evidence.
10. DNS/custom-domain migration + rollback plan: research PENDING; no DNS change allowed in proof.

## Security/header parity adapter

Vercel-specific `vercel.json` currently carries `X-Content-Type-Options: nosniff` and a legacy redirect. The proof branch mirrors those in `next.config.mjs` so both hosts execute the same Next-level behavior. This is hosting portability configuration, not product/business logic.

## Images

The proof deliberately does not enable the separately metered Cloudflare Images product. With `CLOUDFLARE_PORTABILITY_PROOF=1`, Next image optimization is disabled and local originals are served so functional/assets parity can be tested without a paid image dependency. A Founder cutover decision must separately choose whether to keep originals or enable an image optimization path.

## Runtime 500 diagnosis — 15/08/2026

### Reproduction before the fix

The commit Preview and a clean local OpenNext/Wrangler Preview both returned
`500 Internal Server Error` for `/`. The local Worker log exposed the actual
startup exceptions hidden by the plain HTTP response:

```text
TypeError: Cannot read properties of undefined (reading 'contexts')
Error: Missing optional dependency "react-dom/server.edge"
```

The application homepage, environment bindings and Supabase probe were not in
the failing stack. Normal `next build` completed successfully.

### Root cause and bounded correction

Two compatibility defects were present in the proof toolchain:

1. The lockfile resolved Next.js `15.5.20`, outside
   `@opennextjs/cloudflare@1.20.2`'s supported peer range, which starts at
   `15.5.21`. Next is now pinned to the smallest supported patch, `15.5.21`.
2. OpenNext 1.20.2 has an acknowledged React 18 Pages Router bug
   ([upstream #1325](https://github.com/opennextjs/opennextjs-cloudflare/issues/1325)).
   Its optional-dependency stub throws a plain Error when
   `react-dom/server.edge` is absent. Next expects that absence under React 18
   and falls back to `react-dom/server.browser`, but only when the error has a
   standard module-resolution code. The incomplete Pages runtime then emits
   the secondary `contexts` errors.

The proof keeps React 18 and application behavior unchanged. It pins OpenNext
1.20.2 and Wrangler 4.123.0 in the lockfile, then applies the one-line upstream
fix only in the Cloudflare build path: Cloudflare Workers Builds supplies its
documented `WORKERS_CI=1` marker during install, while local `npm run cf:build`
uses an explicit script flag. The generated missing-module Error receives
`code: "MODULE_NOT_FOUND"`. A normal or Vercel `npm ci` runs the inert guard and
leaves OpenNext untouched. The patch script is version- and source-guarded,
idempotent, and fails visibly if the pinned adapter changes shape.

React 19 was not adopted: the repository's current `react-day-picker@8.10.1`
peer contract excludes React 19, so that route would require an unrelated
frontend dependency migration.

### Reproducible local result

```text
npm ci
# Normal install leaves OpenNext's optional-dependency source unchanged.
CLOUDFLARE_PORTABILITY_PROOF=1 npm run cf:build
CLOUDFLARE_PORTABILITY_PROOF=1 npm run cf:preview
curl http://127.0.0.1:8787/
```

Result after the correction: `/` returned `200 OK`; the canonical homepage
title, `noindex`, canonical URL and `X-Content-Type-Options: nosniff` rendered;
the homepage CSS, JavaScript and PNG asset each returned `200`. No service
secret or Production service was required for this public-route proof.

## Phase C builder proof — 15/08/2026

### Cloudflare-only shim scope

A fresh normal `npm ci` left OpenNext's optional-dependency source unchanged,
and a normal `npm run build` passed in that unpatched state. Workers Builds is
identified only by Cloudflare's documented `WORKERS_CI=1` marker; local
`npm run cf:build` uses an explicit opt-in flag. Both Cloudflare paths apply the
exact guarded OpenNext 1.20.2 patch before building the Worker. This keeps
normal and Vercel installs free from Cloudflare adapter mutation even when the
Workers Build command invokes the adapter directly.

The first integration attempt scoped the patch only to the `cf:build` npm
script. Cloudflare Build `2d2bc63d-a53d-4ea9-9f2d-183eb5ef5f0c` uploaded
Version `07b8ee4c-855e-4c21-8957-aa9bebd3dc73`: the new runtime variable was
present (the probe returned the expected `503`), but Pages Router requests
still returned `500`. This isolated the remaining failure to the configured
Workers Build path bypassing the npm wrapper. Cloudflare's documented
`WORKERS_CI=1` system marker closes that path without enabling mutation in
normal CI or Vercel.

### Local Worker and safe negative probe

The built Worker served `/` and representative CSS, JavaScript, WebP, JPG and
PNG assets with `200`. The public, non-secret
`CLOUDFLARE_PORTABILITY_PROOF=1` Worker variable exposes the isolated probe;
without staging Supabase bindings it returned `503` with both binding-presence
booleans `false` and `supabaseReadOnlyRpc: false`. No credential value was
requested or emitted.

### Dry-run size evidence

`wrangler deploy --dry-run` did not upload or deploy anything. Wrangler 4.123.0
reported:

- Worker upload: 4,886.75 KiB uncompressed;
- Worker gzip: 1,001.08 KiB;
- static assets read by Wrangler: 177 files;
- local static asset directory: 78.16 MiB.

The gzip result is below the current Workers Free 3 MB Worker-size limit and
177 assets are below the 20,000-file limit. Wrangler did not report startup
time in this dry run. CPU consumption is also **UNKNOWN** until actual runtime
metrics exist; neither value is inferred from bundle size.
