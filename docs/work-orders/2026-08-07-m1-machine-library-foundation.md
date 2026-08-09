# M1 — Machine Library Foundation

Date: 2026-08-07  
Status: Draft implementation work order — patched 2026-08-09 for FD-2026-016  
Branch: `feat/m1-machine-library-foundation`  
Base: `feat/wp3-launch-core-backend` at `63649b29d1c152e5e5f7fc2cb31575c3cc0e3c29`

## Scope

Build the smallest private Machine Library foundation behind the canonical Google Drive library.

Current authority inputs:
- Drive `AUTHORITY MAP v1.1`: L0–L6.
- Drive `FD-2026-014`: `FCP` is a shared alias for Full Cycle Process and Future Casting Protocol; bare FCP without enough context is `AMBIGUOUS_ALIAS`.
- Drive `FD-2026-016`: private/restricted/child-sensitive is a purpose/access/handling boundary, not an AI-blind rule.
- Drive `FD-2026-017`: 12 Projects; Project != System.
- ESSENCE AI Knowledge Backend Foundation Contract v1.0.

## Included

- Private `knowledge` schema.
- `knowledge_sources`.
- `knowledge_versions`.
- `knowledge_units`.
- `knowledge_sync_state`.
- Deterministic folder/safety ingest policy for **persistent/background Machine Library ingest**.
- Explicit distinction between background ingest and protected on-demand canonical-source reading.
- Synthetic fixtures only.
- SQL and TypeScript contract tests.
- Manual rollback for staging migration `20260807133314_ai_knowledge_library_foundation`.

## Access boundary

- No `anon` or `authenticated` access to the knowledge schema.
- No browser reader.
- M1 does not persist real customer or child-sensitive content in the Machine Library.
- Private/child-sensitive/`99_private` sources fail closed for **background/persistent ingest** and default Machine Library runtime retrieval.
- This is not a `never read` rule. Under FD-2026-016, a separate purpose/access-gated on-demand canonical-source reader may READ/SYNTHESIZE/ANALYZE protected data when the task is authorized and auditable.
- `service_role` is maintenance/sync-only in M1; it is not the future routine protected-source reader credential.
- Knowledge != Permission: read access does not authorize send/edit/delete/pay/entitlement/publication/high-risk actions.

## Not included

- Drive OAuth or sync worker.
- Protected on-demand source-reader implementation.
- Embeddings/vector/HNSW.
- Search/ranking/reranker.
- AI provider/model.
- Context Builder.
- Operational tools.
- Database write actions by AI.
- Public route, indexing or production activation.

## Acceptance

1. Four approved foundation tables only.
2. Private/child-sensitive and `99_private` fail closed for persistent/background ingest, while the policy does not misstate them as `usage never`.
3. Managed copies are not duplicate content sources.
4. Accepted-content state is explicit for Google Docs suggestions.
5. One current ingestion version per source.
6. `raw_text` and `retrieval_text` stay separate.
7. Bare FCP is ambiguous in synthetic tests; scoped FCP resolves correctly.
8. No vector/provider infrastructure in M1.
9. Relevant tests and build pass.
10. Local migration filename and staging migration history use the same version id.
11. Keep the PR Draft; merge/production require a separate exact instruction.
