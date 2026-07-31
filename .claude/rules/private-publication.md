# Private Publication Rule

> **Governance status:** L2 — Active machine rule
> **Owner:** Kenji Phạm
> **Purpose:** Auto-loaded privacy and indexing guardrail for private/payment surfaces.
> **Decision scope:** Minimum containment reminders. **Non-decision scope:** Access architecture, payment/provider, child-data implementation, route creation or indexing action.
> **Precedence/provenance:** Subordinate to the Universal bundle, C-02/C-03/C-06, Current website truth and the applicable backend task bundle.
> **Baseline evidence commit:** fe0739d6d88ba8c9b9a1a6bc9b467bc0f22f5dae
> **Last verified:** G1.1 PR head; finalize at merge.
> **Review:** Privacy, payment, child-data or indexing trigger; otherwise 90 days.

Private personalized publications must stay private by default.

For `/an-pham/[random-slug]` and similar routes:

- Use `noindex`.
- Do not place in navigation.
- Do not include in sitemap.
- Do not expose predictable slugs.
- Do not mix with public marketing content.
- Treat child and family data with extra caution.

Payment and checkout routes matching `/thanh-toan-*` must also stay noindex and out of navigation.
