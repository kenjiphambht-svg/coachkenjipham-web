-- Manual rollback for M2 Drive Sync & Lexical Retrieval Foundation.
-- Safe only while no later knowledge-schema migration depends on these objects.

drop index if exists knowledge.knowledge_units_search_document_gin_idx;
drop trigger if exists knowledge_units_set_search_document on knowledge.knowledge_units;
drop function if exists knowledge.set_search_document();

alter table knowledge.knowledge_units
  drop column if exists search_document;

drop index if exists knowledge.knowledge_sources_title_lower_idx;
drop index if exists knowledge.knowledge_sources_source_code_lower_idx;

alter table knowledge.knowledge_sources
  drop constraint if exists knowledge_removed_time,
  drop constraint if exists knowledge_removed_not_runtime,
  drop column if exists removed_at,
  drop column if exists is_removed,
  drop column if exists last_seen_at,
  drop column if exists drive_md5_checksum,
  drop column if exists drive_version,
  drop column if exists drive_modified_at,
  drop column if exists drive_created_at;
