# ESSENCE DOCUMENTATION AUTHORITY

**Version:** v1.0
**Authority:** L0 — Founder-Approved Governance Constitution
**Status:** Active
**Owner:** Kenji Phạm
**Documentation Steward:** repository maintainer, under Kenji approval
**Baseline evidence commit:** ead2eb75ae1da28f1cec8a2b9ac6f5cf52f419fc
**Last verified:** a45e4242c0e68f52e0004ee8dd5d02745e4212dd
**Review trigger:** every Founder Decision; otherwise by authority cadence.

## Purpose

This Founder-approved Governance Constitution governs how Essence documentation is ranked, read, changed, verified and archived. It prevents useful history from silently acting as current truth.

## Authority hierarchy

| Level | Meaning | Examples |
|---|---|---|
| L0 | Founder Decision and Governance Constitution | Explicit Kenji rulings and this Founder-approved constitution |
| L1 | Canonical Brand & Product Truth | Experience Bible |
| L2 | Current Website Operating Truth | Governance, active route/workflow policy |
| L3 | Canonical Specialized System | Typography, image and other specialist systems |
| L4 | Implementation Evidence | Approved snapshots and implementation evidence |
| L5 | Historical Record | Audits, old roadmaps, decision logs and handoffs |

The Founder-approved hierarchy and conflict precedence are L0. Higher level wins. A newer date does not win merely because it is newer.

## Constitution protection

No L1–L5 document may change this constitution, its hierarchy, conflict precedence or Founder Decision Protocol. Governance operating records may be L2, but any change to this constitution requires a new Founder Decision from Kenji.

## Status model

- **Active**: current authority in its defined scope.
- **Active with Patch**: useful current document that must be read through its governance header.
- **Historical**: retained evidence, not current authority.
- **Superseded**: retained history with a named replacement.
- **Implementation Evidence**: evidence only; never above its canonical system.
- **External Dependency Pending**: referenced source is not imported or approved.
- **Planned**: approved future document, not present truth.

## Conflict protocol

1. Identify the statements, source paths and authority levels.
2. Apply the higher level and register the outcome.
3. For a same-level conflict, stop and request a Founder Decision.
4. Record affected docs, pages, routes, code and agents.
5. Prepare a patch plan; Kenji approves it before application.
6. Update registry, conflict register and affected status in the same scoped change.

## Founder Decision Protocol

Founder Decision → L0 record → impact analysis → patch plan → Kenji approval → apply → registry/conflict/status update.

The Founder Decision Protocol is L0. Agents do not infer L0 from an old document, production implementation or a newer date.

## Owner and verification metadata

- Founder Decision Owner: Kenji Phạm.
- Canonical Brand/Product Owner: Kenji Phạm.
- Current Website Operating Truth Owner: Kenji Phạm.
- Documentation Steward: repository maintainer under Kenji approval.
- Technical Last Verification: the agent or maintainer that inspected evidence, with commit SHA.

Active documents record owner, decision scope, non-decision scope, last_verified reference, review trigger and replacement where relevant. Before merge this may be the PR head; after merge it is the merged commit SHA.

## Review cadence

| Authority | Review rule |
|---|---|
| L0 | Immediately when a Founder Decision changes |
| L1–L2 Active | Triggered review and at least every 90 days |
| L3 Active | System/model/implementation trigger and at least every 180 days |
| L4 | Verify when used as evidence; no fixed cadence |
| L5 | No periodic review |

## External documentation boundary

External files need Kenji approval, provenance, authority, status and a registry row. Local availability or a newer timestamp does not establish authority. G0 imports only the two canonical sources expressly approved by Kenji.

## Required reading

Read docs/governance/READING_BUNDLES.md before work. Use docs/governance/CONFLICT_REGISTER.md when a conflict or missing authority appears.
