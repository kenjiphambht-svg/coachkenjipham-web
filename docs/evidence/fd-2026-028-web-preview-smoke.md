# FD-2026-028 — Website lane preview smoke

Purpose: acceptance evidence only for Founder Directive FD-2026-028.

Canonical lane under test: `web/*` → Website Project Preview.

This file has no runtime, UI, database, provider, customer-data, or WO-05 behavior.

Expected routing:
- Website Project: build this `web/*` branch as Preview.
- Founder/Backend Review Project: do not build this `web/*` branch.

This branch must not be used to alter the approved `main + web/*` / `backend/*` routing split.

Retrigger evidence: second push on the same canonical `web/*` branch; no runtime behavior changed.
