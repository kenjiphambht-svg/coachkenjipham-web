# M2 — Drive Sync & Retrieval Foundation

Date: 2026-08-08  
Status: Founder-approved implementation — Draft PR / staging only  
Branch: `feat/m2-drive-sync-retrieval-foundation`  
Base: `feat/m1-machine-library-foundation` at `9393f35360c14477b95b6c6d3fcb650c155e35d5`

## Founder approval

Founder instruction: **“Duyệt M1, bắt đầu M2.”**

This opens M2 only. It does not authorize M1/M2 merge to production, public activation, real customer/child-sensitive data, AI write actions or Command Layer.

## Goal

Prove a deterministic path from the canonical ESSENCE Google Drive library to the private Machine Library and deterministic exact + lexical retrieval before any AI model or vector retrieval is introduced.

```text
Google Drive Canonical
        ↓
Root / permission boundary
        ↓
Ingest + safety policy
        ↓
Initial crawl / delta change feed
        ↓
Version + hash evidence
        ↓
Structure-aware knowledge units
        ↓
Exact identifier + lexical retrieval
```

## Current Drive root verified 2026-08-08

Canonical root: `1bBKDZR-HTAr1bSgnex-DfvLUspMcfawY`

- `00_BẮT ĐẦU Ở ĐÂY` → `19W24RzG0ZUQy2kUrwiaUqLOJwR8PjgYJ` → metadata/selective.
- `01_ĐIỀU ĐANG ĐÚNG` → `1yoB3Cx2h8ysVaFmk5WnpogIAHl0qnCbC` → current content.
- `02_CÔNG VIỆC ĐANG LÀM` → `19_XFMNtqRd4k_KQhj9x01tTaKxi_YPHq` → workspace content.
- `03_TRI THỨC ĐÃ CHƯNG CẤT` → `1cJZ2LA9wvQPOc7ik4whiZgiWpI6kVHZ5` → supporting content.
- `04_NGUỒN VÀ LỊCH SỬ` → `1wBXJcUZeSDBfKx4d_kNPTe3gLBvnqviS` → conditional / metadata by default.
- `90_QUẢN TRỊ THƯ VIỆN` → `1mKF2nDA3kQOcnROy45Tpah_5bDvdEeCm` → selective / conditional.
- `99_KHO RIÊNG TƯ` → `1IlxV2oS1oVUVfL1NJ_Gx8AjMokCIwaZG` → HARD DENY.

## M2A — included now

- Exact Drive root-ID policy map.
- Fail-closed Drive sync planner.
- Token-injected read-only Google Drive REST client; no credentials stored in repo or Machine Library.
- Start-page-token and `changes.list` support with removed items included.
- Deterministic SHA-256 content/version evidence helpers.
- Structure-aware text normalization preserving `heading_path`, `raw_text`, `retrieval_text`.
- Exact source-code + deterministic lexical retrieval foundation.
- Postgres `simple` + `unaccent` FTS vector and GIN index on `knowledge_units`.
- Drive removal/access-loss fields and fail-closed DB constraint.
- Synthetic tests only.

## M2A — explicit exclusions

- No AI model/provider.
- No embeddings/vector/HNSW/IVFFlat/reranker.
- No browser Machine Library reader.
- No autonomous AI database write.
- No real customer data or child-sensitive data.
- No crawl of `99_KHO RIÊNG TƯ`.
- No production deploy or merge.
- No persistent real Drive content until a dedicated least-privilege sync identity is configured and verified against the deny boundary.

## M2B — next gate inside M2

After M2A tests and staging migration pass:

1. Configure a dedicated Drive sync identity with access only to allowed library zones; ideally no physical access to `99_KHO RIÊNG TƯ`.
2. Run a controlled initial crawl on a small allowlisted set of non-sensitive canonical sources.
3. Verify source/version/unit rows and citations.
4. Save a Drive start page token only after the initial crawl reaches a consistent point.
5. Exercise delta changes, deletion/move-to-deny and periodic reconciliation.
6. Build 30–50 Founder-reviewed Gold Questions before adding semantic vector retrieval.

M2B requires a separate explicit staging credential/configuration step. It still does not authorize customer/child data or production activation.

## Acceptance for M2A

1. `99_private`, removed, trashed and outside-root files fail closed.
2. 01/02/03 retain distinct usage modes; 04/90 do not silently become current runtime truth.
3. Unresolved suggestions and sensitive signals quarantine before content ingestion.
4. Derived copies do not become duplicate content sources.
5. Text normalization is deterministic and evidence text remains separate from retrieval text.
6. Exact IDs outrank lexical matches.
7. Workspace/historical content is opt-in, not default current retrieval.
8. Postgres FTS uses `simple` + `unaccent`; no vector infrastructure.
9. No Drive or Supabase credential appears in code, schema, logs or fixtures.
10. Tests, staging migration and standard build pass before M2B credential/configuration gate.
