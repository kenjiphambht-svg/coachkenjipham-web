# Essence Founder Review Demo

This directory is a deliberately isolated, static founder-review application.

- It contains synthetic fixtures only.
- It has no application API routes, Supabase dependency, environment variables,
  analytics, provider connection, secrets or application data requests. (Vercel
  may inject its own Preview feedback helper; it receives no product data.)
- All interaction is browser-only state stored under `essence-founder-review-demo-v1` in `localStorage`.
- The Vercel project for this directory must remain separate from the protected Admin staging project and must not receive environment variables.
- It is `noindex, nofollow`, is not included in the main-site sitemap, and is not linked from the main website.

`vercel.json` adds no-store, no-referrer and noindex response headers. The app is intended for temporary Founder review only.

The demo visualizes the full governed portfolio and future workflow contracts;
it does not create a route, provider account, payment request, email, database
record, public offer or activation state.
