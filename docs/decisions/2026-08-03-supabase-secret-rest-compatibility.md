# Supabase secret REST compatibility — support packet

## Scope

- UTC date: 2026-08-03
- Project: `essence-staging` (`jmnkhlgumlvywdaeahmx`)
- Canonical host: `jmnkhlgumlvywdaeahmx.supabase.co`
- Affected service: PostgREST `/rest/v1`; Storage has a separate authorization requirement.

## Redacted reproduction

Keys were retrieved by authenticated Supabase CLI into a permission-600 temporary file and removed by shell trap. The selected new secret had the expected `sb_secret_` prefix, no trailing whitespace, and correct opaque-key length. Requests used a server User-Agent, canonical host, no cookies, and only header names `apikey` and `User-Agent` for the new-secret REST probe.

| Endpoint family | Expected | Actual |
| --- | --- | --- |
| PostgREST root with `apikey: sb_secret…` | Gateway accepts elevated secret key | HTTP 401 `Invalid API key` |
| Storage bucket with `apikey: sb_secret…` | Storage asks for its caller authorization | HTTP 400 requiring `authorization` |
| Storage bucket with `apikey: sb_secret…` plus legacy service JWT authorization | Private bucket metadata available | HTTP 200 |
| PostgREST with legacy service-role API key | Compatibility diagnostic | HTTP 401; project states legacy API keys are disabled |

No key, signed URL, request header value, customer data, or fixture was persisted or logged.

## Impact and workaround

The current platform behavior blocks trusted-server PostgREST fixture/metadata operations using the new secret key, so B4 cannot be marked staging-ready through that path. Storage object operations can use the documented split transport: new secret in `apikey`, authorization JWT separately. Production application behavior must use admin AAL2/RLS operations or wait for PostgREST secret-key compatibility to be resolved.

## Support ticket text

**Subject:** `sb_secret` key rejected by PostgREST on project `jmnkhlgumlvywdaeahmx`

Authenticated CLI returns a valid new secret key for the project. A server-side, canonical-host request to `/rest/v1/` with only `apikey: sb_secret…`, no Bearer secret, no cookies and no browser User-Agent returns HTTP 401 `Invalid API key`. The same project accepts the secret key at Storage gateway level, where Storage additionally requires an authorization JWT. Legacy API keys are disabled for this project. Please confirm whether new secret keys are enabled for PostgREST for this project and provide the supported server-side authorization transport.
