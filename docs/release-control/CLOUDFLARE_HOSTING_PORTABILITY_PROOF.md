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
`CLOUDFLARE_PORTABILITY_PROOF=1 npx --yes @opennextjs/cloudflare@1.20.2 build`

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
