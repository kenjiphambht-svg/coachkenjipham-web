# M1 — Machine Library Foundation

Date: 2026-08-07  
Status: Draft implementation work order  
Branch: `feat/m1-machine-library-foundation`  
Base: `feat/wp3-launch-core-backend` at `63649b29d1c152e5e5f7fc2cb31575c3cc0e3c29`

## Scope

Build the smallest private Machine Library foundation behind the canonical Google Drive library.

Current authority inputs:
- Drive `AUTHORITY MAP v1.1`: L0–L6.
- Drive `FD-2026-014`: `FCP` is a shared alias for Full Cycle Process and Future Casting Protocol; bare FCP without enough context is `AMBIGUOUS_ALIAS`.
- ESSENCE AI Knowledge Backend Foundation Contract v1.0.

## Included

- Private `knowledge` schema.
- `knowledge_sources`.
- `knowledge_versions`.
- `knowledge_units`.
- `knowledge_sync_state`.
- Deterministic folder/safety ingest policy.
- Synthetic fixtures only.
- SQL and TypeScript contract tests.
- Manual rollback for migration 0028.

## Access boundary

- No `anon` or `authenticated` access to the knowledge schema.
- No browser reader.
- No real customer or child-sensitive data.
- `service_role` is maintenance/sync-only in M1; a narrower server-side runtime read boundary belongs to a later milestone.

## Not included

- Drive OAuth or sync worker.
- Embeddings/vector/HNSW.
- Search/ranking/reranker.
- AI provider/model.
- Context Builder.
- Operational tools.
- Database write actions by AI.
- Public route, indexing or production activation.

## Acceptance

1. Four approved foundation tables only.
2. Private/child-sensitive and `99_private` fail closed.
3. Managed copies are not duplicate content sources.
4. Accepted-content state is explicit for Google Docs suggestions.
5. One current ingestion version per source.
6. `raw_text` and `retrieval_text` stay separate.
7. Bare FCP is ambiguous in synthetic tests; scoped FCP resolves correctly.
8. No vector/provider infrastructure in M1.
9. Relevant tests and build pass.
10. Keep the PR Draft; merge/production require a separate exact instruction.
