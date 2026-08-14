# WO-LAUNCH-CORE-04 · FD-2026-027 rebaseline evidence

Status: implementation evidence for Draft PR #158. This document records the
Founder-authorized pre-Production migration-history correction. It is not a
new product decision and does not authorize merge, Production database access,
provider activation, or WO-05.

- Checked at: 2026-08-14 (Asia/Ho_Chi_Minh)
- Repository: `kenjiphambht-svg/coachkenjipham-web`
- Branch: `backend/WO-LAUNCH-CORE-04`
- Worktree: `coachkenjipham-worktrees/backend/WO-LAUNCH-CORE-04`
- Main: `ee78efab086f2b38965f906543eec3ef51733e8c`
- Baseline PR head: `0abfc2f5153c44ede94ff1febf96a8af104bb3aa`
- Staging: `essence-staging` (`jmnkhlgumlvywdaeahmx`)
- Data used: fixed, non-sensitive synthetic UUID fixtures only

## Rebaseline plan and decision record

### A. Final canonical WO-04 truth

`production.jobs` is the logical work request. `production.job_attempts` is
append-only execution provenance. `production.artifacts` is stable identity.
`production.artifact_versions` is immutable produced history. Reviews are
immutable QA evidence. None of those facts grants Entitlement, Access,
publication, or Delivery.

`production.artifacts.product_version_id` remains a nullable, immutable,
foreign-keyed creation-time evidence field. It is deliberately retired from
current Artifact identity and version-lineage decisions. Each produced
occurrence derives its actual Product Version from its originating Job. This
lets one Artifact accumulate valid versions from later Product Versions while
preserving the legacy value exactly.

Review replay closure is also legacy-safe. Existing NULL or duplicated
correlation evidence remains unchanged and is marked as pre-enforcement.
Every new Review must carry a correlation reference, is forced into the replay
guard by trigger, and is protected from concurrent duplicate inserts by a
partial unique index. A migration never rewrites immutable Review evidence.

### B–D. Canonical clean-database history

A clean database executes all 26 repository migrations in timestamp order.
The 11 existing WO-04 filenames remain canonical. FD-2026-027 corrects only
`20260814112920_launch_core_production_global_state_operation_closure.sql`
before Production:

- the old staging-only execution dropped `artifacts.product_version_id` and
  two foreign keys, irreversibly discarding non-empty legacy evidence;
- the corrected migration preserves the column, values, and constraints;
- its functions treat the retained value as legacy evidence rather than
  current lineage;
- review replay and global Job/Attempt state closure remain intact.

No skip list, manual Production SQL, or staging-specific install path is
needed.

### E. Staging convergence

Staging contained zero rows in all seven `production` tables. In the first
atomic Founder-authorized reconciliation transaction, the builder:

1. locked and copied the 11 WO-04 ledger rows;
2. asserted every `production` table was empty;
3. removed only those 11 ledger rows;
4. reconstructed only the `production` schema from the 11 canonical files;
5. restored the same 11 version/name ledger identities with the exact
   canonical statements;
6. committed only after all assertions passed.

Fresh evaluators then found that the first Review replay tightening did not
cover previously legal NULL/duplicate correlations. A second atomic zero-row
correction removed only that superseded tightening, applied the final
legacy-safe replay marker/trigger/index, and replaced only the 112920 statement
payload with the final canonical file. Both transactions asserted zero
Production rows and rolled back on any failed assertion.

This was a staging-only canonical reconciliation, not application runtime
logic and not a Production operation.

### F. Blocks 1–3 isolation

Identity, Commerce, Entitlement, and Knowledge migration hashes and structural
fingerprints are unchanged. No migration file belonging to those modules was
edited. Before/after fingerprints are recorded below.

### G–H. Recovery and non-empty safety

The corrected rollback never recreates an empty replacement column. It keeps
the legacy column/data/FKs in place, restores pre-112920 Job/Artifact function
behavior, and makes the derived Review replay marker inert without dropping
or reordering it. A disposable local
Supabase database proved this over non-empty synthetic state through:

1. canonical apply;
2. rollback;
3. migration-ledger repair to `reverted` in the disposable database only;
4. canonical reapply;
5. assertions after every state.

The staging-safe fixture and runtime suite are transaction-neutral components
owned by `wo04_staging_transaction.sql`, which has exactly one outer
`BEGIN/ROLLBACK`. The same composition was executed on staging and rolled back.
The separate commit-based seed runner is explicitly disposable-local-only.

### I. Maintainability, replacement, and repair locality

The engine boundary stores only provider-neutral attempt correlation and
build identity. Person, Product, Journey, Order, Entitlement, Artifact, and QA
truth stay in their canonical modules. Replacing an execution engine appends a
new Attempt/Artifact Version; it does not rewrite customer, commercial, or
historical truth. First repair locations are recorded under “Future visual map
pointers”.

## BEFORE snapshot

### Git and PR

- Main: `ee78efab086f2b38965f906543eec3ef51733e8c`
- Branch/remote/PR head: `0abfc2f5153c44ede94ff1febf96a8af104bb3aa`
- PR #158: OPEN, DRAFT, base `main`, mergeable/clean at precheck
- Worktree: clean at precheck

### Staging identity and data

- Project: `essence-staging`
- Project ref: `jmnkhlgumlvywdaeahmx`
- Postgres: 17.6.1, project healthy/active at precheck
- Full ledger: 26 rows, ending at `20260814112920`
- WO-04 ledger: 11 rows, `20260814034500` through `20260814112920`
- Rows in each of the seven `production` tables: 0

### Structural fingerprints before correction

Fingerprint input includes columns/ordinals/defaults, constraints, indexes,
functions, triggers, views, RLS/force-RLS, comments, and table/routine grants.

| Schema | BEFORE fingerprint | Lines |
|---|---:|---:|
| commerce | `a23a6796ff67d1b705490baa0b0aa61f` | 255 |
| entitlement | `3827c34493a35f3dac864a0e3dc86776` | 284 |
| identity | `437451dca1706d8a8af083b9a4cf4d3c` | 241 |
| knowledge | `e7225b6e0b0dac1506de6dfe22f927b3` | 255 |
| production | `25f885699b23a0634fbe15520ed72148` | 363 |

### Superseded destructive artifact

- Old 112920 migration SHA-256:
  `0717a866fe3798231fb92c34033ac935706a2140336c923fb05d8b92ddba0d6f`
- Old 112920 rollback SHA-256:
  `d2c68677446c638749976f77979a0849fd1e6286538e9441c1853cd3d8fd2092`

The old migration dropped the legacy column; its rollback only recreated an
empty column, so it could recover shape but not discarded values.

## AFTER snapshot and convergence

### Ledger truth

Fresh install and staging both contain exactly these 26 versions:

`20260807133314`, `20260808042208`, `20260808095439`,
`20260808095710`, `20260812044335`, `20260812053126`,
`20260813120549`, `20260813123721`, `20260813130502`,
`20260813135325`, `20260813165456`, `20260813172831`,
`20260813180023`, `20260813183452`, `20260813185043`,
`20260814034500`, `20260814035042`, `20260814035327`,
`20260814035522`, `20260814050321`, `20260814051819`,
`20260814052905`, `20260814054459`, `20260814060704`,
`20260814093326`, `20260814112920`.

The 11 staging WO-04 statement payloads have the same MD5 as their canonical
files, ending with corrected 112920 MD5
`4019ded88430b9efe2eb94e6d4e8d3fb`.

### Structural convergence

| Schema | Fresh install | Reconciled staging | Lines | Result |
|---|---:|---:|---:|---|
| commerce | `a23a6796ff67d1b705490baa0b0aa61f` | `a23a6796ff67d1b705490baa0b0aa61f` | 255 | exact |
| entitlement | `3827c34493a35f3dac864a0e3dc86776` | `3827c34493a35f3dac864a0e3dc86776` | 284 | exact |
| identity | `437451dca1706d8a8af083b9a4cf4d3c` | `437451dca1706d8a8af083b9a4cf4d3c` | 241 | exact |
| knowledge | `e7225b6e0b0dac1506de6dfe22f927b3` | `e7225b6e0b0dac1506de6dfe22f927b3` | 255 | exact |
| production | `9d8d8b9467837a0074d04cf90386f6e3` | `9d8d8b9467837a0074d04cf90386f6e3` | 371 | exact |

Artifact column order is also exact on both sides; the retained legacy field
is ordinal 4, not a hidden drop/re-add ordinal.

## Migration SHA-256 manifest

### Canonical WO-04 forward migrations

| Version | SHA-256 |
|---|---|
| 20260814034500 | `5a132e9dbebd13a248eb8887be0112fc7d96f1968705d97274a258356f3daa78` |
| 20260814035042 | `edbe3b23d0a9557e61fe4102f54802cc1a28a970bc071cc7861f080c3f715f48` |
| 20260814035327 | `411a197e5a68d1181308724782328772f9a03ba268893bb27910463c6a4f5b53` |
| 20260814035522 | `8b679f632786d95866ceec1b3ff7127aa5e4c32610150cbf9944ebb2885cffab` |
| 20260814050321 | `b93375946dcee978923185d754e802d774e774045bf531e2e93679bfd67d3c22` |
| 20260814051819 | `2f80c19e32cd6c68770a1f10350bd11c2cd5fe18735d8e4342f00e07d74e3a49` |
| 20260814052905 | `2f6fc4e5d5acc5a23b6c13e8ace9e4600cccf9c7f9ddd0bd9538e93980072ac3` |
| 20260814054459 | `da8a9e5c9f4268c23381f13cc273059bc2ca8ac2dba581cae76641cd052297b4` |
| 20260814060704 | `d119d9eb11c970695adc69953ce80249ef33b314fc6629d9a36d9a8e644013e7` |
| 20260814093326 | `686fefaf04a5f675a9da3243ef83c5170e33bf953565d9ef0c71bcfd74aea7f0` |
| 20260814112920 | `e4669ec4885c500aae3d3a4bc502ebfa058c1c06f72b256edc5388df33cf7586` |

Corrected 112920 rollback SHA-256:
`1af8757a46aacf7ee76fd3c5a9e900f2725de32c9f6b85aa82ff568c2da41a39`.

### Blocks 1–3 migration hashes (BEFORE = AFTER)

| Version | SHA-256 |
|---|---|
| 20260807133314 | `9fcfa5c263a27b6d25300aceb04bc013a6c6cd3949bf8d08a626607349fb0ef4` |
| 20260808042208 | `681ce5d6b1d755c8287f445116a69535e01e3f355b40027663aaa9bdd264912a` |
| 20260808095439 | `48651819971e88843804d9cca76e353b6afdce8f8e366274faafb82d0a597191` |
| 20260808095710 | `e006dfcd9461f4199252b62212ad8d489861beb262fc1f79c40313bbd3a8156c` |
| 20260812044335 | `1f4759a1e37d800b0c2e6aa6bd8974bbaf3b396d9289427884a1bd3365459ad9` |
| 20260812053126 | `0ac14a03e10c0d1f4fcbb70117efd635df2507046f4777b257470b7dc5f978a0` |
| 20260813120549 | `7001cfb3a0cdfd9cafad525d8b550c4e33fd1198d794b97b5823ba5492408a91` |
| 20260813123721 | `b27a95129b111095358008f9de80cf2febd090a8e6e3e35d6b36d4ff81cd7b38` |
| 20260813130502 | `398fb9b825e91f4dea7980ed9f20da15bcf43c017f5f6cde96cb390e6bc40df9` |
| 20260813135325 | `49a7fb67c615ae1ab340127fd4ec166b43b7b3b32c527ac4fca60c98946846aa` |
| 20260813165456 | `170581809afbbe3e069d167c015068076df2408c3a0765c1902a6bd25a1bee4c` |
| 20260813172831 | `edb263c45e07f82e7ae1aab0e63f3a5fc1344a9c4665d8b235ab2e4b84bb4e7f` |
| 20260813180023 | `0e5c35541241280278901b767eb74fdd5a69c347bd26750a46e3533951a3aee7` |
| 20260813183452 | `24064a3aa0197f2e953db7cfca502badda0f7a320bd440ee08c95624455e1b92` |
| 20260813185043 | `aa327bc617d969f765803323855e91cb8060fd6fc1b94514b1a59e60e5a876cd` |

## Fresh install and non-empty recovery proof

### Fresh install from zero

A new disposable Supabase stack applied all 26 repository migrations from
zero without manual exceptions. Final ledger count was 26. The five-schema
fingerprints exactly matched reconciled staging. A final reset/reinstall also
passed, proving reproducibility after the recovery exercise.

### Representative non-empty fixture

The deterministic recovery fixture contained one Person, one Product, Product
Versions v1/v2, one Journey anchor, one Order plus snapshot, two Jobs, two
Attempts, one Artifact, two Artifact Versions, and four Reviews. Two Review
rows deliberately model previously legal legacy states: one NULL correlation
and one duplicate non-NULL correlation. It contained zero Entitlements. The
Artifact retained legacy Product Version v1 while its two version events
correctly originated from Jobs pinned to v1 and v2.

After canonical apply, rollback, and canonical reapply, every assertion passed:

- Jobs: 2
- Attempts: 2
- Artifacts: 1
- Artifact Versions: 2
- Reviews: 4
- preserved legacy NULL correlations: 1
- preserved legacy duplicate correlation rows: 2
- Entitlements: 0
- preserved legacy Product Version:
  `00000000-0000-4000-8000-000000000403`

### Four recovery layers

- Schema: legacy Artifact column, both Product-Version FKs, inert/reactivated
  Review replay marker, functions, views, indexes, RLS, grants, and triggers
  were coherent.
- Data: the legacy Artifact value and all Job/Attempt/Version/Review history
  survived apply → rollback → reapply.
- Behavior: state guards, successful-origin requirements, replay protection,
  immutability, and legal later-version evolution passed after recovery.
- Dependency: structural fingerprint before and after the round trip was exact;
  the FKs, views, indexes, grants, force-RLS, and function dependencies resolved.

## Runtime, security, separation, and replaceability

The SQL regression scripts prove by execution:

- Job and Attempt remain distinct identities;
- a running Attempt blocks incompatible Job termination;
- Job success requires a compatible successful Attempt;
- retry after canonical success is blocked;
- failed execution cannot originate an Artifact Version;
- Artifact/Job Person, Product, and Journey lineage remains coherent;
- Artifact is stable identity and Artifact Version is immutable history;
- v1 → v2 Product-Version evolution on one Artifact is legal;
- logical output and review replay are rejected;
- a genuinely new Review is representable;
- previously legal NULL/duplicate Review evidence survives unchanged, while
  every new Review is forced into the replay guard;
- service-role direct history fabrication is denied;
- privileged history rewriting is stopped by immutable triggers;
- actual `anon` and `authenticated` reads are denied;
- SECURITY DEFINER functions have fixed `pg_catalog, production` search paths
  and are not executable by browser roles;
- Artifact, provider success, and QA approval create no Entitlement and make
  `entitlement.has_active_entitlement(...)` remain false.

No Generator/provider-specific FK, canonical lifecycle owner, or hardcoded
provider identity exists. `provider_execution_reference` and `build_identity`
are optional neutral evidence. Generator unavailability stops only new
attempt/output creation; existing Person/Product/Journey/Order/Entitlement and
Artifact/QA history remain intact. Provider failure is a failed Attempt, not a
customer-state rewrite. QA unavailability pauses new Review evidence, never
creates Access. Artifact execution/storage unavailability stops new produced
versions; it cannot manufacture Delivery.

## Verification results

- Focused corrected 112920 SQL/proof-runner contract: 1 file, 23 tests PASS
- Full `npm test`: 31 files, 373 tests PASS, 0 fail, 0 skip
- `npm run test:m1`: 2 files, 22 tests PASS, 0 fail, 0 skip
- Standalone `npx tsc --noEmit`: PASS
- Next.js Production build (including its lint/type validity stage): PASS
- `git diff --check`: PASS
- Disposable full migration chain: PASS, 26/26
- Local non-empty apply/rollback/reapply: PASS
- Canonical `wo04_staging_transaction.sql`: PASS and ROLLBACK locally and on
  staging; all included components are transaction-neutral
- Staging residue: all seven Production tables and fixed Identity/Commerce
  fixture IDs = 0
- Security Advisor: 0 WARN, 0 ERROR; 27 INFO
  `rls_enabled_no_policy`, consistent with intentional default-deny/
  service-role-only tables. Reference:
  https://supabase.com/docs/guides/database/database-linter?lint=0008_rls_enabled_no_policy

No frontend or shared TypeScript configuration was changed under this
production-only decision.

## Adversarial builder review

- Fresh/staging drift: rejected by exact five-schema fingerprint equality.
- Destructive legacy debt: corrected 112920 and rollback contain no drop/re-add
  of the evidence column/FKs.
- Empty-only recovery: rejected by the two-version non-empty round trip.
- Blocks 1–3 drift: rejected by hashes and structural fingerprints.
- Generator coupling: no engine-owned canonical truth or provider-specific FK.
- Access inference: executable entitlement/access query remains false.
- Ledger/file drift: all 11 staging statement payloads match canonical files.
- Production install dependency on staging: rejected by fresh 26/26 install.
- History loss: exact legacy value and immutable event counts survive.
- Cross-module corruption: failure boundaries remain append-only and local.

## Independent read-only evaluations

### Evaluator A — migration/recovery: PASS

The first pass found two material gaps: direct NOT NULL/UNIQUE tightening did
not cover legacy NULL/duplicate Review evidence, and the checked fixture owned
a COMMIT that made the staging rollback claim non-reproducible. The builder
replaced the tightening with the legacy-safe marker/trigger/partial-index
design, split transaction ownership, reran fresh/non-empty/recovery/staging
proofs, and resubmitted the final state. Evaluator A then passed the final
migration/rollback, hashes, representative legal states, transaction runners,
and recovery logic with no material finding.

### Evaluator B — isolation/replaceability: PASS

The first pass independently found the same transaction-ownership issue. After
correction, Evaluator B passed Blocks 1–3 isolation, provider neutrality,
Generator replaceability, failure locality, Artifact/QA/Entitlement/Access/
Delivery separation, security, legacy evidence preservation, and zero-residue
test design with no material finding.

Both evaluations were separate read-only filesystem contexts. They did not
query or mutate staging; live ledger/fingerprint/residue/Advisor evidence was
re-queried by the primary builder after their fixes.

## Known limitations and scope boundaries

- This proves PostgreSQL schema/data/behavior/dependency recovery, not a full
  Supabase platform restore.
- There is no real Generator, provider, Storage object, Delivery workflow, or
  customer data in this proof.
- INFO advisor findings are intentional fail-closed tables; they are not being
  relabeled as WARN/ERROR.
- Rollback is a coordinated maintenance operation. While replay enforcement is
  intentionally inert, old/default writers create `review_replay_guarded=false`;
  trusted service-role writers must not manually assert TRUE until canonical
  reapplication restores the trigger/index.
- No P11 product QA rules and no P09 Care rules were invented.
- No Production database was touched.

## Future Backend Visual Map pointers

Machine-readable module/repair outline for the later, separately authorized map:

| Module | Canonical truth | Replaceable interface | First repair location | Failure containment |
|---|---|---|---|---|
| Identity | Person/customer relationship | UUID references | `identity` migrations/functions | Production cannot rewrite Person truth |
| Commerce | Product/Version/Journey/Order | read-only FKs | `commerce` constraints | Attempt failure cannot rewrite Order |
| Entitlement | payment evidence/access right | `has_active_entitlement` | `entitlement` state functions | Artifact/QA never grants access |
| Production Job | logical work state | Job contract | Job transition triggers | engine outage pauses Attempts only |
| Attempt | execution provenance | neutral correlation pointer | Attempt guards | provider failure appends failure evidence |
| Artifact | stable output identity | canonical Person/Product/Journey keys | Artifact scope trigger | storage/output outage creates no Delivery |
| Artifact Version | immutable produced occurrence | Job/Attempt lineage | Version scope/immutability triggers | failed attempt cannot create history |
| QA Review | immutable technical evidence | review event contract | review replay/immutability constraints | QA outage pauses reviews only |

## Explicit confirmations

- No merge = YES
- No Production DB = YES
- No provider activation = YES
- No real customer/child data = YES
- No WO-05 = YES
- Identity unchanged = YES
- Commerce unchanged = YES
- Entitlement unchanged = YES
- Knowledge unchanged = YES
- Generator repository unchanged = YES
