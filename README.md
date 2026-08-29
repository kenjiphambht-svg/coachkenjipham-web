# Essence Coaching — Production Web

Canonical implementation repository for **coachkenjipham.com**.

## Deployment authority

- **Source code authority:** GitHub `main`
- **Production primary:** Cloudflare Workers
- **Deployment adapter currently present:** `@opennextjs/cloudflare`
- **Cloudflare config:** `wrangler.jsonc`
- **Vercel:** backup/fallback only; it is not production authority and its preview/deploy status is not default production evidence.

The repository is already Cloudflare-ready through the existing OpenNext + Wrangler setup. Production changes should follow the approved PR/merge flow and then be built/deployed on Cloudflare. Do not reintroduce Vercel as the primary path in repository instructions or project documentation.

## Verification

Useful Cloudflare scripts are defined in `package.json`, including `cf:build`, `cf:preview`, and `cf:upload`.
