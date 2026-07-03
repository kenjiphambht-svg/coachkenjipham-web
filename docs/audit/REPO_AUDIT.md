# Repo Audit

Audit date: 2026-07-04

This audit is based only on files inspected in the repository. It does not make claims about routes, systems, or deployment state that were not visible locally.

## Framework And Version

- Framework: Next.js Pages Router
- Next.js version in `package.json`: `15.5.9`
- React version in `package.json`: `^18.3.1`
- TypeScript is present.
- Tailwind CSS is present.

## Scripts Available

From `package.json`:

- `npm run dev` -> `next dev`
- `npm run build` -> `next build`
- `npm run start` -> `next start`
- `npm run lint` -> `next lint`

## Key Dependencies Observed

- `next`
- `react`
- `react-dom`
- `framer-motion`
- `gsap`
- `@gsap/react`
- `lucide-react`
- `stripe`
- `@stripe/react-stripe-js`
- `@stripe/stripe-js`
- Radix UI component packages
- `tailwindcss`
- `zod`
- `react-hook-form`

## Homepage File Path

- `src/pages/index.tsx`

## SEO Component Path

- `src/components/SEO.tsx`

The homepage imports and uses this SEO component. `_document.tsx` also imports `SEOElements`.

## Current Routes Observed

Files under `src/pages` include:

- `/` from `src/pages/index.tsx`
- `/kidbook` from `src/pages/kidbook.tsx`
- `/thanh-toan-goi-1` from `src/pages/thanh-toan-goi-1.tsx`
- `/thanh-toan-goi-2` from `src/pages/thanh-toan-goi-2.tsx`
- `/404` from `src/pages/404.tsx`
- `/api/hello` from `src/pages/api/hello.ts`

## Current Homepage Status

The current homepage is a minimal coming-soon page with:

- Essence Coaching brand text
- A short Vietnamese positioning line
- CTA linking to `/kidbook`
- Organization JSON-LD

The current homepage SEO description includes "Coaching tâm hồn chuyên sâu", which conflicts with the updated instruction to avoid using "tâm hồn" as main positioning. This audit only notes the issue; it does not change runtime source files.

## Current SEO And Indexing Observed

- `public/robots.txt` exists and disallows `/api/`, `/thanh-toan-goi-1`, and `/thanh-toan-goi-2`.
- `public/sitemap.xml` exists and includes `/` and `/kidbook`.
- Payment pages observed in `src/pages/thanh-toan-goi-1.tsx` and `src/pages/thanh-toan-goi-2.tsx` include `noindex, nofollow` meta tags.

## Current Risks Observed

- The worktree had existing local modifications before this documentation task began, including `package.json`, `/kidbook`, payment pages, public images, `robots.txt`, and `sitemap.xml`.
- The current visible route set is much smaller than the desired future architecture.
- `/kidbook` remains a legacy public route and is listed in the current sitemap.
- The homepage currently points to `/kidbook`, while the future route policy prefers `/an-pham-ban-sac-hat-mam` after the product/payment flow is checked.
- The current homepage copy uses legacy "tâm hồn" language that should be reviewed in the future homepage pass.

## Recommended Next Task

Open a focused homepage planning/rebuild task after human review of these docs. The next task should read:

- `AGENTS.md`
- `docs/website/HOMEPAGE_SPEC.md`
- `docs/website/ARCHITECTURE.md`
- `docs/website/ROUTE_POLICY.md`
- `docs/brand/ESSENCE_VOICE.md`
- `docs/brand/SAFETY_BOUNDARIES.md`
- `docs/brand/VISUAL_DIRECTION.md`

Then rebuild or revise the homepage without touching `/kidbook`, payment pages, private routes, or `/ai-startup` unless explicitly included in the task.

