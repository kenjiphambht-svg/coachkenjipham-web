# Supabase secret REST compatibility — support packet

## Scope

- Evidence-record timestamp (UTC): `2026-08-03T14:25:20Z` (the commit time
  of the redacted diagnostic record; the raw request timestamp was not
  retained and is deliberately not reconstructed).
- Project: `essence-staging` (`jmnkhlgumlvywdaeahmx`)
- Canonical host: `jmnkhlgumlvywdaeahmx.supabase.co`
- Affected service: PostgREST `/rest/v1`; Storage has a separate authorization requirement.
- Probe implementation: direct server-side HTTP, not an SDK. Application
  dependency inspected during final audit: `@supabase/supabase-js 2.111.0`;
  authenticated Supabase CLI: `2.111.0`.
- Correlation/request IDs: none were returned or retained by the redacted
  direct-HTTP diagnostic. No value is invented here.

## Redacted reproduction

Keys were retrieved by authenticated Supabase CLI into a permission-600 temporary file and removed by shell trap. The selected new secret had the expected `sb_secret_` prefix, no trailing whitespace, and correct opaque-key length. Requests used a server User-Agent, canonical host, no cookies, and only header names `apikey` and `User-Agent` for the new-secret REST probe.

| Endpoint family | Expected | Actual |
| --- | --- | --- |
| PostgREST root with `apikey: sb_secret…` | Gateway accepts elevated secret key | HTTP 401 `Invalid API key` |
| Storage bucket with `apikey: sb_secret…` | Storage asks for its caller authorization | HTTP 400 requiring `authorization` |
| Storage bucket with `apikey: sb_secret…` plus legacy service JWT authorization | Private bucket metadata available | HTTP 200 |
| PostgREST with legacy service-role API key | Compatibility diagnostic | HTTP 401; project states legacy API keys are disabled |

No key, signed URL, request header value, customer data, or fixture was persisted or logged.

## Minimal reproduction and consequence

1. Authenticate the Supabase CLI for this project; write API-key output only
   to an owner-read/write temporary file and delete it with a shell trap.
2. Send a direct HTTPS request to the canonical `/rest/v1/` family with header
   names `apikey` and `User-Agent` only. Do not send a raw value to logs.
3. The expected elevated gateway acceptance instead returns HTTP 401. The
   Storage family separately accepts the `apikey` format but requires an
   `authorization` caller JWT, returning HTTP 400 if that header is absent.

Security consequence: the application cannot safely use the observed
new-secret/PostgREST transport to create a controlled fixture, verify
user-scoped AAL2 metadata access, or delete object metadata. Current
workaround is no workaround for production: keep the B4/B8 release gates OFF.
The blocked operations are real private-publication E2E and real
object-plus-metadata deletion. Do not repeatedly reprobe until Supabase gives
a supported transport or asks for a new diagnostic.

## Impact and workaround

The current platform behavior blocks trusted-server PostgREST fixture/metadata operations using the new secret key, so B4 cannot be marked staging-ready through that path. Storage object operations can use the documented split transport: new secret in `apikey`, authorization JWT separately. Production application behavior must use admin AAL2/RLS operations or wait for PostgREST secret-key compatibility to be resolved.

## Support ticket text

**Subject:** `sb_secret` key rejected by PostgREST on project `jmnkhlgumlvywdaeahmx`

Authenticated CLI returns a valid new secret key for the project. A server-side, canonical-host request to `/rest/v1/` with only `apikey: sb_secret…`, no Bearer secret, no cookies and no browser User-Agent returns HTTP 401 `Invalid API key`. The same project accepts the secret key at Storage gateway level, where Storage additionally requires an authorization JWT. Legacy API keys are disabled for this project. Please confirm whether new secret keys are enabled for PostgREST for this project and provide the supported server-side authorization transport.
