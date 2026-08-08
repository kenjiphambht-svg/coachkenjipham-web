# M2C — Authority Retrieval Reliability Checkpoint

**Date:** 2026-08-08
**Scope:** M2 only — staging/read-only knowledge retrieval. No AI provider, no production activation, no Command Layer.

## Manual QA reconciliation

Library Assistant returned 6/6 usable non-sensitive samples with 0 FAIL and 0 new conflict:

1. Founder Decision Register — L0/current truth.
2. Authority Map — L1/current truth.
3. CANON-003 FCP — L3/current canonical truth.
4. Lặng Product Operating Contract — L2/approved current operational policy.
5. AI Knowledge Backend Architecture Direction — active workspace/implementation baseline; not default L0/L1 current authority.
6. WIKI-001 — L4 Second Brain/supporting reference; not authority.

Direct Docs inspection was then performed for the six native Docs. No current `suggestedInsertionIds` or `suggestedDeletionIds` were observed in the inspected document resources. The earlier 4/6 suggestion-state UNKNOWN is therefore closed for the checked revisions only.

The Library Assistant statement that move/delete/access-loss was PASS is narrowed to: all six IDs were resolvable at checked-at time. A real transition test has **not** yet been exercised and remains pending the dedicated Drive sync identity. Canonical sources will not be moved/deleted for that test; use disposable staging fixtures.

## Controlled staging alignment

The four QA sources not present in the first five-source probe were added as explicitly partial manual-probe evidence:

- `CANON-003`
- `LANG_PRODUCT_OPERATING_CONTRACT`
- `AI_KNOWLEDGE_ARCHITECTURE_DIRECTION`
- `WIKI-001`

Staging now contains:

- 9 sources
- 9 current version-evidence rows
- 9 selected knowledge units
- 0 `99_private`, private or child-sensitive sources

All rows remain marked as partial/manual M2B probe evidence and **not** as automated Drive-sync proof.

## Retrieval hardening

Two default-retrieval bugs/risks were closed:

1. A source with lifecycle `current` but usage mode `workspace` could previously qualify as current evidence. Default retrieval now requires current/approved lifecycle **and** `current_truth` or `governance` usage. Workspace only appears with explicit `includeWorkspace`.
2. A `supporting` source with stale lifecycle could previously qualify by usage mode alone. Default supporting retrieval now allows only `current`, `approved` or `reference`; `superseded`/historical supporting material stays out unless routed through an explicit historical path.

A deterministic retrieval-decision layer now returns one of:

- `ready`
- `ambiguous_alias`
- `insufficient_evidence`

Bare `FCP` therefore stops at `ambiguous_alias`; it does not silently select one concept.

## Gold-case test evidence

A targeted Vercel test-gated build on commit `d6d8cc7ecb1c704f5385d4a5b1c82f24e6af671c` passed:

- 7 test files passed
- 67 / 67 tests passed
- 10 new authority/ambiguity gold cases passed
- Next.js type/build completed and deployment reached READY

The build command was restored immediately afterward to repository-standard `next build`.

New gold cases include:

- bare FCP → `AMBIGUOUS_ALIAS`
- Full Cycle Process → operating/journey scope
- Future Casting Protocol → internal coaching scope
- current Authority Map outranks supporting memory for authority questions
- active work-package architecture baseline excluded from default current truth
- Lặng approved L2 contract eligible as current operational policy
- WIKI-001 remains L4 supporting
- disabled derived copy never retrieves
- superseded supporting material never retrieves by default
- no eligible evidence → `insufficient_evidence`

## Staging SQL probes

Current SQL substrate confirmed:

- FCP lexical search surfaces Founder Decision Register, Conflict Register and CANON-003.
- Lặng / Human Decision Gate surfaces the L2 Product Operating Contract.
- Architecture Direction is absent from default current retrieval and appears only when workspace is explicitly included.
- revision IDs are retained for the four newly aligned QA sources.

Postgres `ts_rank` is **not** treated as final authority ranking. Final application retrieval still applies authority/lifecycle/usage logic above lexical relevance.

## Remaining M2B hard gate

Still required before unattended automated sync:

1. Dedicated least-privilege Google Drive runtime identity.
2. Physical confirmation that identity cannot access `99_KHO RIÊNG TƯ`.
3. Server-only staging credential installation.
4. Automated allowlisted crawl using that identity.
5. Real delta edit test on a disposable non-sensitive staging document.
6. Real move/delete/access-loss or move-to-deny test using disposable staging fixtures.
7. Reconciliation of automated results against the manual QA sample.

Until then, PR #150 remains Draft and staging-only.
