# B3 — Hạt Mầm: phạm vi an toàn

- Native route `/hat-mam/dang-ky` is `noindex` and **not publicly activated**. It has no Tally CTA and does not change `/kidbook` or either legacy payment route.
- Minimal child intake is isolated in `hatmam_child_profiles`: nickname, birth date/time (optional), birth place (optional), short family context (optional), and the parent's question. It excludes photo, address, medical information and detailed family/marital information. Its default classification is **Restricted Child Personal Data — Limited Operational Scope** under `2026-08-04-proportionate-child-data-protection.md`; this does not relax any private-route, consent, RLS or release-gate control.
- Consent is explicit and versioned as `hatmam-parent-intake-v1`; a package snapshot records HM-01/HM-02 terms at valid submission. Working defaults: capacity 10/month, delivery target 5 business days, revision window 7 days, raw intake retention 12 months and private publication retention 24 months.
- Payment cannot precede a valid submitted order. Confirmation remains Kenji manual confirmation; no bank credential is stored or displayed. Raw tokens are never persisted.
- Private Storage is a hard dependency for B4. `hatmam_release_gates.private_storage_ready` and `deletion_workflow_ready` are both false; together with `public_activation_enabled=false`, the API fails closed and no real child data may be collected.
- Early deletion request and actual deletion workflow are hard gates for B8. This phase does not claim that deletion exists.
- No child PII is placed in URL/query, logs, or email. The native POST endpoint uses `Cache-Control: no-store` and logs only timestamp on unexpected server failure.
