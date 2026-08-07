# ESSENCE DOCUMENTATION AUTHORITY

**Version:** v1.1
**Authority:** L0 — Founder-Approved Governance Constitution
**Status:** Active
**Owner:** Kenji Phạm
**Documentation Steward:** repository maintainer, under Kenji approval
**Current Founder source:** Drive `FD-2026-001` + `AUTHORITY MAP v1.1`
**Current FCP source:** Drive `FD-2026-014`
**Baseline evidence commit:** ead2eb75ae1da28f1cec8a2b9ac6f5cf52f419fc
**Review trigger:** every Founder Decision; otherwise by authority cadence.

## Purpose

This Founder-approved Governance Constitution governs how Essence documentation is ranked, read, changed, verified and archived. It prevents useful history from silently acting as current truth.

## Authority hierarchy

| Level | Meaning | Examples |
|---|---|---|
| L0 | Founder Decision / Governance Constitution | Explicit Kenji rulings and this Founder-approved constitution |
| L1 | Current Governance & Operating Truth | Current business, product, website and launch governance; verified operating truth |
| L2 | Approved Contracts | Product Contract, Page Contract, Operating Contract and Method Contract |
| L3 | Canonical / Deep Intelligence in scope | Canonical nodes, brand truth and approved specialized intelligence |
| L4 | Second Brain | Wiki, patterns, checklists, lessons and distilled registers; memory, not authority |
| L5 | Raw Evidence / Implementation Evidence | Repository, branch, commit, PR, preview, production evidence and raw source |
| L6 | Historical / Superseded / Proposal | Historical records, superseded documents and unapproved proposals |

The Founder-approved hierarchy and conflict precedence are L0. Higher level wins **within the source's applicable scope and effective period**. A newer date does not win merely because it is newer.

Authority, lifecycle/currentness, scope/answerability and security/access are separate dimensions. They must not be collapsed into one score.

## Constitution protection

No L1–L6 document may change this constitution, its hierarchy, conflict precedence or Founder Decision Protocol. Governance operating records may be L1, but any change to this constitution requires a current Founder Decision from Kenji.

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
2. Apply the higher level only within the source's valid scope.
3. For a same-level conflict that cannot be resolved by scope/effective period, stop and request a Founder Decision.
4. Record affected docs, pages, routes, code and agents.
5. Prepare a patch plan; Kenji approves it before application.
6. Update registry, conflict register and affected status in the same scoped change.

## Founder Decision Protocol

Founder Decision → L0 record → impact analysis → patch plan → Kenji approval → apply → registry/conflict/status update.

The Founder Decision Protocol is L0. Agents do not infer L0 from an old document, production implementation or a newer date.

## Concept identity and alias rule

An alias does not define concept identity or lifecycle. Current example: `FCP` is an alias shared by **Full Cycle Process** (operating / journey context) and **Future Casting Protocol** (internal coaching protocol). When context is insufficient, treat bare `FCP` as `AMBIGUOUS_ALIAS`; do not infer Historical/Superseded from the alias collision.

## Owner and verification metadata

- Founder Decision Owner: Kenji Phạm.
- Canonical Brand/Product Owner: Kenji Phạm.
- Current Governance/Operating Truth Owner: Kenji Phạm.
- Documentation Steward: repository maintainer under Kenji approval.
- Technical Last Verification: the agent or maintainer that inspected evidence, with commit SHA when the evidence is repository-dynamic.

Active documents record owner, decision scope, non-decision scope, last_verified reference, review trigger and replacement where relevant. Before merge this may be the PR head; after merge it is the merged commit SHA.

## Review cadence

| Authority | Review rule |
|---|---|
| L0 | Immediately when a Founder Decision changes |
| L1–L2 Active | Triggered review and at least every 90 days |
| L3 Active | System/model/implementation trigger and at least every 180 days |
| L4 | Review when reused for a decision-sensitive task |
| L5 | Verify whenever used as current implementation evidence |
| L6 | No periodic review; never default current truth |

## External documentation boundary

External files need Kenji approval, provenance, authority, lifecycle and an allowed-use scope before they may influence current decisions. Local availability or a newer timestamp does not establish authority.

## Required reading

Read `docs/governance/READING_BUNDLES.md` before work. Use `docs/governance/CONFLICT_REGISTER.md` when a conflict or missing authority appears.
