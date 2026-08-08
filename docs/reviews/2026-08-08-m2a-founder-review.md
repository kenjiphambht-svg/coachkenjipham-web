# M2A — Founder Review Evidence

Date: 2026-08-08  
Status: READY FOR FOUNDER REVIEW — M2B not opened  
Branch: `feat/m2-drive-sync-retrieval-foundation`  
Base: `feat/m1-machine-library-foundation` at `9393f35360c14477b95b6c6d3fcb650c155e35d5`

## What M2A proves

- Canonical Drive root and all seven top-level zones are pinned by folder ID.
- `99_KHO RIÊNG TƯ` is never crawled by the initial crawl path.
- Removed, trashed, permission-lost, outside-root and deny-zone files fail closed.
- Drive shortcuts are resolved to their target before policy evaluation; target ancestry wins.
- Google Docs are inspected for unresolved suggestion markers before canonical content ingestion.
- Initial crawl and Drive change-token delta contracts are deterministic and checkpoint only after successful processing.
- Text normalization preserves heading path and keeps `raw_text` separate from deterministic `retrieval_text`.
- Retrieval foundation supports exact IDs + lexical matching with authority-scope/lifecycle filters.
- Postgres lexical FTS uses `simple` + `unaccent` + GIN. No pgvector/HNSW/IVFFlat/provider is present.

## Staging evidence

Supabase project: `essence-staging`.

Applied migration:
- `20260808042208_ai_knowledge_sync_retrieval_foundation`

Verified after migration:
- Drive evidence/removal columns exist on `knowledge_sources`.
- `knowledge_units.search_document` exists as `tsvector`.
- lower-case exact lookup indexes exist for source code/title.
- GIN index exists for `search_document`.
- synthetic database probe populated lexical `search_document` and confirmed the removed-source runtime guard fires.
- synthetic probe cleaned up successfully; `knowledge_sources`, `knowledge_versions`, `knowledge_units`, `knowledge_sync_state` all remain at 0 persisted rows.

Security Advisor:
- four `knowledge` tables remain fail-closed with RLS enabled and no browser policies; the `rls_enabled_no_policy` notices are INFO and intentional until a narrow server-side runtime reader is introduced.
- pre-existing project Auth warning about leaked-password protection is outside M2 scope.

Performance Advisor:
- new M2 indexes are reported as unused because the Machine Library contains 0 persisted rows and no runtime reader has been enabled yet; this is expected at M2A.
- unrelated pre-existing public-schema notices are outside M2 scope.

## Verification

Targeted Vercel test-gated build on commit `69c9a2c83bad8f2458c69b14ba1cfd07c1998dd5`:
- 6 test files passed.
- 55 tests passed.
- Type/lint phase completed; only project baseline warnings plus three non-null-assertion warnings in the new sync engine were reported.
- Next.js compiled successfully and generated all pages.
- Deployment reached READY.

The temporary test-gated `package.json` build command was then restored to the repository-standard `next build`; `package.json` is not intended to remain changed in the final M2 diff.

## What M2A deliberately does NOT prove

- No dedicated Google Drive sync identity has been configured in the application runtime.
- No real automated Drive crawl has been run from the website backend.
- No real Drive document has been persisted to Machine Library.
- No Founder-AI runtime reader exists yet.
- No embeddings/vector search/model/provider exists.
- No customer/child-sensitive data is authorized.
- No merge or production activation is authorized.

## Gate to M2B

M2B is a separate staging configuration gate inside M2. It would configure a dedicated least-privilege Drive sync identity, verify that it cannot access `99_KHO RIÊNG TƯ`, and run a small allowlisted non-sensitive canonical crawl before expanding coverage.
