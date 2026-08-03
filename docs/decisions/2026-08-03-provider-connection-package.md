# Provider connection package — Resend and Cal.com

This is one consolidated, future connection session. Both providers remain
fail-closed today: the checked-in adapters are mocks and no provider key is in
Git, the browser bundle, logs or this document.

## One-time secure connection session

Founder action is limited to authorizing a secure Codex/provider session with
the relevant account and DNS authority. Founder must not paste a key in chat,
commit a `.env` file, or edit deployment variables manually. Codex will enter
server-only variables in the approved provider/deployment surface, perform
the non-sensitive verification below, record only result metadata, and remove
or disable the connection on rollback.

## Resend

Reserved server-only variable names:

| Variable | Required use |
| --- | --- |
| `RESEND_API_KEY` | scoped Resend API credential; server only |
| `RESEND_FROM_EMAIL` | `Kenji Phạm <hello@mail.coachkenjipham.com>` after that exact sending domain is verified |
| `RESEND_REPLY_TO` | `contact@coachkenjipham.com` |
| `RESEND_INTERNAL_ALERT_TO` | `kenjipham.bht@gmail.com` |
| `RESEND_TEST_RECIPIENT` | controlled non-customer verification mailbox, used once and removed/rotated afterwards |

The sender domain/subdomain must be owned by the Founder and fully verified in
Resend before sending. Resend requires the exact SPF and DKIM records it
generates; its documentation recommends a sending subdomain and permits DMARC
as an additional trust control. The `From` domain must exactly match the
verified domain/subdomain. See [Resend domain management](https://resend.com/docs/dashboard/domains/introduction) and its [domain-mismatch guidance](https://resend.com/docs/knowledge-base/403-error-domain-mismatch).

Verification: send one idempotent, plain-text, non-sensitive test to
`RESEND_TEST_RECIPIENT`; verify the provider response ID, delivery state and
that the outbox stores recipient hash/template version only. No child name,
birth data, intake answer, bank reference or raw private token belongs in an
email payload. Rollback: disable the server-side key/integration, retain the
hash-only delivery evidence, and leave `EMAIL_DEFAULTS.readiness` waiting.

## Cal.com

Reserved server-only variable names:

| Variable | Required use |
| --- | --- |
| `CALCOM_API_KEY` | scoped server-only Cal.com API credential |
| `CALCOM_EVENT_TYPE_ONLINE_ID` | approved online event type ID |
| `CALCOM_EVENT_TYPE_IN_PERSON_ID` | approved in-person event type ID |
| `CALCOM_EMBED_ORIGIN` | the allowed Essence origin for inline embed initialization |
| `CALCOM_WEBHOOK_SECRET` | server-only verifier for booking lifecycle webhooks |

Required configuration: two explicit event types (online and in-person), no
public booking link in the site, inline embed only inside the verified private
route, and a one-order/one-booking idempotency key persisted server-side. A
raw 256-bit private booking token remains 24 hours, SHA-256-hashed at rest,
and expires/revokes before any embed can initialize. Cal.com documents event
type embedding rather than requiring a public redirect; see [Cal.com embed
guidance](https://cal.com/help/embedding/adding-embed).

Verification: use one disposable order and one controlled event per mode;
prove authorized inline rendering, one booking on retry, webhook signature
verification, expired/revoked-token denial and cancellation/disable behavior.
Rollback: disable the embed/provider adapter, revoke the test token/event and
keep `calendar_ready=false`. No child PII, intake answer, payment evidence or
raw token is placed in an embed URL, query, logs or email.

## Current status

**PROVIDER CONNECTION PENDING.** The required real adapters, event
configuration and provider credentials do not yet exist. This package is a
connection contract, not evidence that either provider is connected.
