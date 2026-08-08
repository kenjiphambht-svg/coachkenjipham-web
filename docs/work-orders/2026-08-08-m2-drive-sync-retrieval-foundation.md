# M2 — Drive Sync & Retrieval Foundation

Date: 2026-08-08  
Status: Founder-approved implementation — Draft PR / staging only  
Branch: `feat/m2-drive-sync-retrieval-foundation`  
Base: `feat/m1-machine-library-foundation` at `9393f35360c14477b95b6c6d3fcb650c155e35d5`

## Founder approval

Founder instructions:

- **“Duyệt M1, bắt đầu M2.”**
- **“anh đồng ý em làm tiếp đi… cứ làm những vòng lớn rồi báo anh.”**

This opens M2 staging work only. It does not authorize M1/M2 merge to production, public activation, real customer/child-sensitive data, AI write actions or Command Layer.

## Goal

Prove a deterministic path from the canonical ESSENCE Google Drive library to the private Machine Library and deterministic exact + lexical retrieval before any AI model or vector retrieval is introduced.

```text
Google Drive Canonical
        ↓
Root / permission boundary
        ↓
Ingest + safety policy
        ↓
Controlled allowlist / initial crawl / delta feed
        ↓
Version + hash evidence
        ↓
Structure-aware knowledge units
        ↓
Exact identifier + lexical retrieval
```

## Current governed zones

- `00_BẮT ĐẦU Ở ĐÂY` → metadata/selective.
- `01_ĐIỀU ĐANG ĐÚNG` → current content.
- `02_CÔNG VIỆC ĐANG LÀM` → workspace content.
- `03_TRI THỨC ĐÃ CHƯNG CẤT` → supporting content.
- `04_NGUỒN VÀ LỊCH SỬ` → conditional / metadata by default.
- `90_QUẢN TRỊ THƯ VIỆN` → selective / conditional.
- `99_KHO RIÊNG TƯ` → HARD DENY and never traversed by the M2 initial crawler.

## M2A — foundation complete

- Exact Drive root-ID policy map.
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

## M2B — controlled pilot now completed to the credential boundary

### Real non-sensitive staging probe

A five-source allowlist of current governance documents was manually read through the connected Drive tooling and persisted into `essence-staging` as explicitly marked **partial manual probe evidence**.

Result:

- 5 Machine Library sources.
- 5 current version-evidence rows.
- 5 selected knowledge units.
- 0 private-zone / child-sensitive rows.

The staged rows explicitly state that this was a manual connected-tool probe, not an automated Drive runtime identity.

### Retrieval evidence

- Lexical `FCP` lookup surfaced the current Founder Decision Register at L0 and the resolved Conflict Register entry at L1.
- Lexical `thẩm quyền` lookup surfaced the current Authority Map.
- Exact source-code lookup returned the Founder Decision Register as L0 / current / current-truth.

This proves the exact + lexical substrate surfaces the intended current authority evidence. It does not yet claim end-to-end AI answering; authority-aware context construction remains a later layer.

### Controlled file allowlist

The initial and delta sync engines now accept an explicit file allowlist for staging pilots:

- non-allowlisted files are ignored before content read;
- allowlisted files proceed through normal policy/safety checks;
- shortcut targets are resolved to canonical target identity before the allowlist decision;
- out-of-batch delta removals are ignored;
- allowlisted removals still purge;
- the hard-deny private root is still never traversed.

### Manual Library Assistant coordination

A short manual-test request was placed in the Library Review Inbox asking the Library Assistant to select/check non-sensitive canonical sources and report PASS / FAIL / CONFLICT / UNKNOWN for shortcut, unresolved suggestions, deletion/move/access loss, duplicate/derived copy and ambiguous alias cases. It explicitly forbids private-vault, customer, child, payment and session-note data.

## Test/build evidence

Latest M2B targeted Vercel test gate:

- 6 test files passed.
- **57 / 57 tests passed**.
- Controlled initial-crawl allowlist behavior passed.
- Controlled delta-removal allowlist behavior passed.
- Existing M1/M2 safety, FCP, Drive, normalization, SQL and lexical tests remained green.
- Next.js type/build compiled successfully.
- The temporary test-gated build command was restored to the repository-standard `next build` afterward.

## Explicit exclusions remain

- No dedicated runtime Drive OAuth/sync identity is configured yet.
- Physical inability of that future identity to read `99_KHO RIÊNG TƯ` is therefore **not yet proven**.
- No unattended automated Drive crawl from the website backend.
- No AI model/provider.
- No embeddings/vector/HNSW/IVFFlat/reranker.
- No browser Machine Library reader.
- No Founder-AI runtime reader yet.
- No real customer or child-sensitive data.
- No AI database write action / Command Layer.
- No merge or production activation.

## Remaining M2B hard gate

Before unattended automated sync can be enabled:

1. Create/configure a dedicated least-privilege Drive sync identity outside the current code-only tool boundary.
2. Grant that identity only the approved library zones and verify it has no physical access to `99_KHO RIÊNG TƯ`.
3. Provide the credential to staging as a server-only secret; never commit or store it in Machine Library rows/logs.
4. Re-run the controlled allowlisted crawl with that identity.
5. Exercise a real delta update and a real removal/move-to-deny case.
6. Reconcile against the manual probe and Library Assistant manual-test results.

Until then the system remains Draft PR / staging only.
