# Essence Founder Review Demo

This directory is a deliberately isolated, static founder-review application.

- It contains synthetic fixtures only.
- It has no API routes, Supabase dependency, environment variables, analytics, provider connection, or network requests.
- All interaction is browser-only state stored under `essence-founder-review-demo-v1` in `localStorage`.
- The Vercel project for this directory must remain separate from the protected Admin staging project and must not receive environment variables.
- It is `noindex, nofollow`, is not included in the main-site sitemap, and is not linked from the main website.

`vercel.json` adds no-store, no-referrer and noindex response headers. The app is intended for temporary Founder review only.
