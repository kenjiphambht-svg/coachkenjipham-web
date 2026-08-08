# M2B — Controlled Staging Probe Evidence

Date: 2026-08-08  
Status: STAGING EVIDENCE — not production approval

## Purpose

Exercise the M2 Machine Library against a deliberately small, non-sensitive canonical governance allowlist before configuring an automated runtime Drive identity.

## Controlled batch

Five current governance sources were manually read through the connected Drive tooling and staged as partial-source evidence:

- Authority Map
- Founder Decision Register
- Conflict Register
- Source Registry
- Project Directory

No private-vault source, customer record, child-sensitive record, payment evidence or session note was used.

## Staging result

The controlled batch produced:

- 5 `knowledge_sources`
- 5 current `knowledge_versions`
- 5 selected `knowledge_units`
- 0 private-zone / child-sensitive source rows

Each staged source is explicitly marked as a manual partial-ingest probe. This is not represented as an automated Drive crawl.

## Retrieval probes

Lexical FTS for `FCP` surfaced both relevant current governance sources:

1. Founder Decision Register — L0 — current FCP disambiguation decision.
2. Conflict Register — L1 — resolved FCP alias-collision record.

Lexical FTS for `thẩm quyền` surfaced the current Authority Map.

Exact source-code lookup returned the Founder Decision Register as L0 / current / current-truth.

These probes demonstrate that the exact + lexical retrieval substrate can surface the correct current authority evidence. They do **not** yet prove end-to-end answer generation or ambiguous-alias response behavior; the authority-aware context builder remains a later layer.

## Controlled sync gate added

`runInitialDriveCrawl` and `runDriveDeltaSync` now accept an explicit Drive File ID allowlist for M2B staging. When enabled:

- non-allowlisted files are ignored before content read;
- allowed files can ingest normally;
- out-of-batch delta removals are ignored;
- allowlisted removals still purge;
- shortcuts are resolved to the canonical target identity before the allowlist/policy decision.

This is defense-in-depth for the controlled pilot. The permanent baseline remains folder/privacy policy plus a dedicated least-privilege Drive identity.

## Remaining hard gate

A dedicated runtime Drive OAuth/service identity has **not** been configured in the current tool environment. Therefore physical inability of that future identity to read `99_KHO RIÊNG TƯ` is still unverified.

Do not expand from this manual allowlist probe to unattended automated crawling until that credential boundary is configured and verified.

## Explicit exclusions

- no production merge or activation;
- no AI provider;
- no embeddings/vector/reranker;
- no browser Machine Library reader;
- no autonomous AI write action;
- no customer or child-sensitive data;
- no claim that physical `99` denial is already proven.
