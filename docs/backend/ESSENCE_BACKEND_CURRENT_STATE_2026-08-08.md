# ESSENCE Backend — Current State

**Snapshot:** 2026-08-08  
**Owner:** Kenji Phạm  
**Purpose:** Current implementation/evidence record so a Founder, AI or engineer can resume backend work without reconstructing prior chats.  
**Authority:** Implementation evidence only. Founder Decisions, governance and approved contracts outrank this record.  
**Implementation baseline before this documentation pass:** `04dd676c7433fad0dabdb00947e3d368d55957a4` on `feat/m2-drive-sync-retrieval-foundation`.

---

## 1. Executive state

The ESSENCE backend is no longer one system. It now has three distinct operational domains that must not be conflated:

1. **Customer / Launch Core backend** — orders, payment evidence, product state, publication versions, entitlement, Reading Room authorization, support/deletion contracts.
2. **Founder Operating layer** — Founder-facing orchestration and relationship/care experience. Current WP3.5 implementation is synthetic preview only.
3. **AI Knowledge Backend** — canonical Drive knowledge ingestion, Machine Library, authority-aware retrieval and future Founder-AI read context. It is explicitly separated from customer/child/private operational data.

The customer backend foundation exists in staging, but the whole business is **not yet customer-ready** because provider, storage, release and end-to-end operational gates remain open.

### Current status matrix

| Area | State | What is proven | What is not yet proven / intentionally OFF |
|---|---|---|---|
| WP3 Launch Core | **STAGING VERIFIED foundation** | Shared identity/entitlement contracts, immutable order snapshots, payment evidence/confirmation, publication versioning, RLS, audit/support/deletion contracts, migrations `0022–0027` | Private Storage, PDF generation, Resend, Cal.com, real deletion E2E, public activation, provider E2E |
| WP3.5 Founder Operating Experience | **SYNTHETIC PREVIEW ONLY** | Founder cockpit, relationship/journey/care UX and deterministic synthetic logic | Real customer data, provider connections, persistence/actions, production |
| M1 Machine Library | **STAGING VERIFIED foundation** | Private `knowledge` schema, source/version/unit/sync-state model, forced RLS, service-role maintenance boundary | Routine Founder-AI reader, vector/model/provider, production merge |
| M2A Drive Sync + Retrieval | **IMPLEMENTED / substantially verified** | Root policy, change-token/delta contracts, 99 deny policy, suggestion inspection, normalization, exact + lexical retrieval | Final real runtime E2E on latest head still pending |
| M2C Authority Retrieval | **VERIFIED by deterministic tests + staging pilot evidence** | Current-truth filtering, stale supporting exclusion, FCP ambiguity handling, 10 Gold Cases | Not a production AI answer system |
| M2B Drive runtime identity | **PARTIALLY VERIFIED** | Service account identity previously reached real Drive; allowed folders shared Reader-only; root and `99` not shared; Google Docs API enabled | Final latest-head runtime rerun pending |
| M2B Supabase persistence path | **IMPLEMENTED + DB boundary verified; runtime E2E pending** | Server-only RPC boundary, real staging migrations, service-role-only execution, transactional synthetic persistence/tombstone/cleanup checks | Drive → latest Preview → real Supabase `initial/edit/removal/cleanup` sequence |
| Production activation | **OFF** | Production has not been touched by M1/M2 execution | No merge/release authorization yet |

---

## 2. PR / branch stack

The current backend work is intentionally stacked. The stack matters because later branches contain earlier foundations.

```text
WP2 customer experience base
  └─ PR #136  feat/wp3-launch-core-backend
       └─ PR #149  feat/m1-machine-library-foundation
            └─ PR #150  feat/m2-drive-sync-retrieval-foundation
```

Separate Founder Operating preview work exists on WP3.5 branches/PRs and must not be mistaken for live backend activation.

### Important merge truth

- PR #136 — Draft / unmerged.
- PR #149 — Draft / unmerged.
- PR #150 — Draft / unmerged.
- Therefore staging implementation evidence does **not** mean these capabilities are live in Production.
- Never merge the stack solely because a lower layer passes tests; each release still needs the proper Founder gate and release review.

---

## 3. Customer / Launch Core backend already built

WP3 established the first production-shaped customer backend contracts while keeping all release/provider flags fail-closed.

### Shared model

Existing product/payment records are extended rather than replaced. New normalized contracts include customer identity, identity links, product entitlements, entitlement history, publication versions/reviews, revisions, support requests and release flags.

Key rules already implemented:

- customer identity is separated from Admin identity;
- order/product/package facts are snapshot-based so later price/settings changes cannot rewrite history;
- payment evidence is scoped to the correct request/order and cannot be reused across requests;
- payment confirmation is atomic and idempotent;
- a report is evidence, not confirmation;
- Hạt Mầm requires consent and uses safe codes rather than child names in routes/logs/object paths;
- publication approval produces immutable version evidence;
- Reading Room authorization requires verified identity **and** active entitlement;
- revocation, refund and deletion are distinct concepts;
- deletion remains fail-closed if the private-object step fails;
- Admin-sensitive access requires active Admin + AAL2;
- audit records contain safe operational metadata, not raw sensitive content.

### Staging evidence already completed

- Forward migrations `0022` through `0027` applied to `essence-staging`.
- Database lint completed without schema errors after forward repairs.
- Anonymous RLS denial was tested.
- Authenticated non-admin denial was tested.
- Admin AAL1 denial and Admin AAL2 access were tested with synthetic Auth users.
- Lặng snapshot/payment evidence/confirmation/idempotency paths were exercised synthetically against staging.
- Hạt Mầm approved-version-before-entitlement and entitlement idempotency were exercised synthetically.
- Snapshot immutability and cross-request payment evidence reuse protections were probed.
- No real customer or child data was used.

### Still OFF in WP3

- private object Storage;
- PDF generation;
- Resend transactional delivery;
- Cal.com booking integration;
- real provider authorization;
- real deletion E2E;
- public/private Reading Room activation;
- Production release.

These are customer-readiness gates, not optional polish.

---

## 4. Founder Operating Experience already explored

WP3.5 created a Founder-facing operating experience to show how the backend should become usable instead of remaining a collection of tables.

Current preview concepts include:

- **Hôm nay** operating cockpit;
- **Quan hệ** relationship workspace;
- **Hành trình** journey view;
- **Chăm sóc & Phục hồi**;
- Customer Room / Founder Room concepts;
- deterministic priority and Next Best Care logic;
- product lens across Lặng, Hạt Mầm and Reading Room.

Important: this remains **synthetic preview evidence**. It does not prove real CRM/customer orchestration, providers, actions or persistence. It is a product/operating design reference for the next backend readiness phase.

---

## 5. M1 — Machine Library foundation completed

M1 added a private `knowledge` schema in staging with four core tables:

- `knowledge_sources`
- `knowledge_versions`
- `knowledge_units`
- `knowledge_sync_state`

The architecture treats Google Drive as the human canonical library and the Machine Library as derived/rebuildable infrastructure.

Security posture:

- RLS enabled and forced;
- no `anon` or `authenticated` access;
- `service_role` only for server-side maintenance/sync;
- private/child-sensitive/`99_private` material is hard-denied;
- no browser Machine Library reader;
- no AI model/provider/vector index;
- no autonomous write action.

M1 remains Draft/unmerged and is a foundation, not a complete Founder AI.

---

## 6. M2 — Drive sync and retrieval work completed so far

### M2A: sync substrate

Implemented:

- canonical Drive root/zone mapping;
- initial crawl and change-token delta sync contracts;
- explicit removal/trashed/access-loss handling;
- shortcut resolution to canonical target;
- unresolved Google Docs suggestion inspection before canonical ingestion;
- SHA-256 evidence;
- deterministic text normalization;
- exact + lexical retrieval using Postgres FTS (`simple` + `unaccent` + GIN);
- controlled file allowlist for staging pilots;
- no traversal of `99_KHO RIÊNG TƯ`.

### M2C: authority retrieval reliability

The retrieval layer was tightened so default current truth cannot be polluted by workspace or stale supporting material.

Verified behaviors include:

- lifecycle `current` alone is not enough for default current truth;
- default current truth requires appropriate usage mode (`current_truth` / governance context);
- stale/superseded supporting evidence stays out by default;
- workspace content requires explicit inclusion;
- historical content requires explicit inclusion;
- bare `FCP` is deterministically `ambiguous_alias` because it maps to both Full Cycle Process and Future Casting Protocol;
- evidence can return `ready`, `ambiguous_alias` or `insufficient_evidence` rather than bluffing certainty.

A 10-case authority/ambiguity Gold Case suite was completed.

---

## 7. M2B — real Google Drive runtime identity

A dedicated staging service account was created under GCP project `essence-knowledge-sync-staging`.

### Permission design

The service account is Reader-only on the six approved top-level library zones individually.

It is **not** shared on:

- the canonical root folder;
- `99_KHO RIÊNG TƯ`.

This is intentional: sharing the root could inherit access into the private vault.

No Domain-Wide Delegation was enabled.

### Runtime evidence already obtained

Earlier identity probe runtime logs proved real server-side requests could reach allowed Drive content.

The first controlled initial-crawl attempts then failed at Google Docs suggestion inspection. Diagnostics were improved so Drive API and Docs API failures are separated and safe error codes are logged.

Observed real runtime error:

`GOOGLE_DOCS_READ_FAILED_403`

Two corrections followed:

1. Google Docs API was enabled for the staging GCP project.
2. The service-account OAuth assertion was updated to request both Drive readonly and Docs readonly scopes.

The OAuth-scope correction was committed, but the exact corrected head could not be runtime-tested immediately because Vercel hit its daily deployment/build quota.

### Current M2B runtime gate

Do **not** run the old Preview and interpret it as evidence for the new OAuth fix.

The next valid sequence must run on a Preview containing the current branch head:

1. `initial` against the disposable fixture;
2. if PASS, edit only the disposable fixture;
3. `edit` delta;
4. delete only the disposable fixture;
5. `removal` delta;
6. verify permission boundaries again.

Raw access tokens/change tokens/secrets must never be pasted into chat or logs.

---

## 8. M2B — real Supabase persistence path prepared

The earlier runtime sync probe used an in-memory repository only. That was useful for Drive/sync-engine diagnosis but could **not** prove Machine Library persistence.

A separate real persistence path has now been added.

### New server-side pieces

- `src/lib/knowledge/supabase-sync-client.ts`
- `src/lib/knowledge/supabase-sync-repository.ts`
- `/api/internal/m2b-drive-supabase-probe`
- service-role-only RPC migrations for ingest, tombstone, checkpoint, status and synthetic cleanup.

The route is Preview-only and exact-branch-only.

### Real staging DB changes already applied

Two M2B persistence migrations were applied to `essence-staging`:

- `20260808095439_ai_knowledge_sync_service_rpc`
- `20260808095710_ai_knowledge_sync_probe_status_rpc`

Verified privilege boundary:

- `anon`: no EXECUTE;
- `authenticated`: no EXECUTE;
- `service_role`: EXECUTE allowed.

### Persistence semantics

For a valid content ingest:

- source metadata is upserted;
- a new content hash creates a new immutable version;
- the previous current version becomes superseded;
- normalized units are attached to the current version;
- checkpoint state is saved;
- runtime use can remain tighter than Drive policy.

For a Drive removal/access loss:

- the source is tombstoned;
- `runtime_enabled=false`;
- `is_removed=true`;
- the current version becomes removed evidence rather than silently disappearing.

Synthetic cleanup can physically delete only rows explicitly marked both `m2b_fixture=true` and `synthetic=true`.

A safety probe confirmed this cleanup path cannot delete a canonical Founder Decision source.

### Transactional staging probe already completed

A synthetic DB-only transaction exercised:

`ingest → version/unit persistence → tombstone → cleanup`

and left zero synthetic residue after rollback/cleanup verification.

This proves the DB persistence boundary itself works. It does **not** yet prove the complete live chain from Drive through Preview runtime into Supabase.

---

## 9. Current staging knowledge data

Before the new live persistence E2E, staging contains nine manually seeded M2B probe sources used for retrieval/authority testing.

These records are explicitly marked as manual/partial probe evidence; they are **not** evidence of automated Drive sync.

The disposable Drive fixture has not yet been persisted into the Machine Library by the final real runtime path.

The knowledge backend remains free of permitted real customer/child/private-vault ingestion by design.

---

## 10. Current external blocker

At this snapshot, Vercel Free-plan daily deployment quota (`api-deployments-free-per-day` / build-rate limit) prevents creation of a new Preview containing the latest M2B changes.

This is an infrastructure blocker, not a reason to weaken the design or run tests against stale code.

Do not:

- disable Deployment Protection;
- change Drive/IAM permissions to work around it;
- elevate the service account;
- touch Production;
- mutate canonical Drive documents for testing.

---

## 11. Exact M2B resume procedure

When a fresh Preview can be created on the current branch:

### Gate A — build/runtime identity

- verify Preview head equals the current PR #150 head;
- verify Preview is READY;
- run controlled `initial` on the disposable fixture;
- inspect safe runtime logs if status is not 200.

### Gate B — real Machine Library persistence

Use `/api/internal/m2b-drive-supabase-probe` on the same fresh Preview:

1. `phase=initial` — expect source exists, runtime disabled, one current version, units > 0, checkpoint present;
2. edit only the synthetic fixture with a known second synthetic line;
3. `phase=edit` — expect version count >= 2 and exactly one current version;
4. delete only the synthetic fixture;
5. `phase=removal` — expect tombstone and removed version evidence;
6. `phase=cleanup` — remove only synthetic Machine Library evidence;
7. verify fixture gone from Drive;
8. verify no synthetic DB residue;
9. recheck service-account allowed read + root/99 denial.

### Gate C — retrieval regression

After the real sync sequence:

- rerun authority Gold Cases;
- verify no private/child-sensitive rows;
- verify no stale/superseded material appears as default current truth;
- verify FCP ambiguity remains deterministic.

Only after Gates A–C may M2B be considered a close candidate.

---

## 12. What is still required before real customers

Even if M2B closes, the backend is not automatically launch-ready. Customer readiness still requires a separate program covering:

- real private Storage and signed-download authorization;
- publication/PDF delivery path;
- transactional email provider and domain authentication;
- booking provider if used;
- payment operational workflow and reconciliation;
- refund/cancel/recovery behavior;
- real deletion E2E;
- support/revision operations;
- monitoring, retry, incident and audit behavior;
- a Golden Customer Journey across the entire staging stack;
- final Security Advisor / RLS review;
- Production secrets and release rehearsal;
- Founder release authorization.

The critical business path is:

`Customer → Order/Application → Payment → Journey/Production → Entitlement/Delivery → Care/Support → Founder Operations`

The AI Knowledge Backend supports Founder intelligence, but it must not become a dependency that blocks or contaminates the customer/private data plane.

---

## 13. What future AI/engineers must never claim without fresh evidence

Do not say:

- “M2B is closed” until the latest-head real Drive + real Supabase E2E passes;
- “Production is using the Machine Library” while PRs #149/#150 remain unmerged/unreleased;
- “WP3 is customer-ready” while provider/storage/deletion/release gates are OFF;
- “WP3.5 is the CRM” while it remains synthetic preview work;
- “manual staging probe rows prove automated sync”;
- “a 200 from a stale Preview proves the latest commit”;
- “AI can read customer/child data” — this is outside the current knowledge architecture and prohibited by current boundaries.

---

## 14. Update rule

Update this document whenever one of these changes:

- PR stack/merge status;
- migration state;
- runtime E2E status;
- provider/storage/payment activation;
- customer data boundary;
- release flag;
- Production activation;
- major failure/root cause;
- Founder Decision affecting backend architecture.

Always preserve failed evidence and label newer evidence separately; never rewrite history to make the current system look more complete than it is.
