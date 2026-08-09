# M2 — Drive Sync & Retrieval Foundation

Date: 2026-08-08  
Status: Founder-approved implementation — Draft PR / staging only — governance patch 2026-08-09  
Branch: `feat/m2-drive-sync-retrieval-foundation`  
Base: `feat/m1-machine-library-foundation` at the stack baseline; current base/head must be queried live before review.

## Founder approval

Founder instructions opened M2 staging work only. They do not authorize M1/M2 merge to production, public activation, AI write actions or Command Layer.

Current authority corrections also include:
- FD-2026-014: bare `FCP` is ambiguous between Full Cycle Process and Future Casting Protocol.
- FD-2026-016: protected/private/child-sensitive is a purpose/access/handling boundary, not a `never read` rule.
- FD-2026-017: 12 Projects; Project != System.

## Goal

Prove a deterministic path from the canonical ESSENCE Google Drive library to the private Machine Library and deterministic exact + lexical retrieval before any AI model or vector retrieval is introduced.

```text
Google Drive Canonical
        ↓
Background-sync root / permission boundary
        ↓
Persistent ingest + safety policy
        ↓
Controlled allowlist / initial crawl / delta feed
        ↓
Version + hash evidence
        ↓
Structure-aware knowledge units
        ↓
Exact identifier + lexical retrieval
```

## Current governed zones for BACKGROUND MACHINE LIBRARY SYNC

- `00_BẮT ĐẦU Ở ĐÂY` → metadata/selective.
- `01_ĐIỀU ĐANG ĐÚNG` → current content.
- `02_CÔNG VIỆC ĐANG LÀM` → workspace content.
- `03_TRI THỨC ĐÃ CHƯNG CẤT` → supporting content.
- `04_NGUỒN VÀ LỊCH SỬ` → conditional / metadata by default.
- `90_QUẢN TRỊ THƯ VIỆN` → selective / conditional.
- `99_KHO RIÊNG TƯ` → **NO BACKGROUND TRAVERSAL / NO PERSISTENT INGEST in M2**.

The final line is a background-sync boundary, not an AI-blind rule. FD-2026-016 allows a separate purpose/access-gated, auditable on-demand canonical-source reader in a later milestone. M2 does not implement that reader.

## M2A — foundation complete

- Exact Drive root-ID policy map for background sync.
- Fail-closed Drive sync planner.
- Token-injected read-only Google Drive REST client; no credentials stored in repo or Machine Library.
- Start-page-token and `changes.list` support with removed items included.
- Deterministic SHA-256 content/version evidence helpers.
- Structure-aware text normalization preserving `heading_path`, `raw_text`, `retrieval_text`.
- Exact source-code + deterministic lexical retrieval foundation.
- Postgres `simple` + `unaccent` FTS vector and GIN index on `knowledge_units`.
- Drive removal/access-loss fields and fail-closed DB constraint.
- Shortcut target resolution before policy evaluation.
- Google Docs unresolved-suggestion inspection before canonical ingest.
- Synthetic contract tests and manual rollback.

## M2B — controlled pilot evidence

A five-source non-sensitive allowlist of current governance documents was used for a controlled staging probe. This test scope intentionally excludes private/customer/child/payment/session-note data; that exclusion is a pilot constraint, not a global ESSENCE data-access rule.

The initial and delta sync engines accept an explicit file allowlist for staging pilots:
- non-allowlisted files are ignored before content read;
- allowlisted files proceed through normal persistent-ingest/safety checks;
- shortcut targets resolve to canonical target identity before allowlist decision;
- out-of-batch delta removals are ignored;
- allowlisted removals still purge;
- 99 is not traversed by the background sync identity.

## Security model after FD-2026-016

Use separate capability boundaries rather than one universal credential:

1. **Background sync identity** — least privilege; no 99 traversal; only approved Machine Library zones; persistent ingest path.
2. **Protected on-demand source reader (future milestone)** — purpose/access-gated and auditable; may read canonical protected sources when the task is authorized; does not imply persistence in Machine Library.
3. **Action/command capabilities** — separate again; read permission never grants send/edit/delete/payment/entitlement/publication/high-risk permission.

## Explicit exclusions remain

- No dedicated unattended background Drive sync identity is configured yet.
- No protected on-demand source-reader implementation yet.
- No unattended automated Drive crawl from the website backend.
- No AI model/provider.
- No embeddings/vector/HNSW/IVFFlat/reranker.
- No browser Machine Library reader.
- No Founder-AI runtime reader yet.
- No real customer or child-sensitive data is persisted in this M2 pilot.
- No AI database write action / Command Layer.
- No merge or production activation.

## Remaining M2B hard gate

Before unattended BACKGROUND sync can be enabled:

1. Create/configure a dedicated least-privilege background Drive sync identity.
2. Grant only approved Machine Library zones and verify that this **background-sync identity** has no physical access to `99_KHO RIÊNG TƯ`.
3. Provide its credential to staging as a server-only secret; never commit or store it in Machine Library rows/logs.
4. Re-run the controlled allowlisted crawl with that identity.
5. Exercise a real delta update and a real removal/move-to-deny case.
6. Reconcile against manual probe and Library Assistant QA.
7. Design the separate protected on-demand reader contract before any real protected-source runtime use.

Until then the system remains Draft PR / staging only.
