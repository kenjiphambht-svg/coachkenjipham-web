-- M2 · ESSENCE AI Knowledge Backend — Drive Sync & Lexical Retrieval Foundation
-- Staging/read-only retrieval foundation only. No AI provider, embedding/vector index,
-- customer/child data, browser access or autonomous write action is introduced here.

create extension if not exists unaccent with schema extensions;

alter table knowledge.knowledge_sources
  add column if not exists drive_created_at timestamptz,
  add column if not exists drive_modified_at timestamptz,
  add column if not exists drive_version text,
  add column if not exists drive_md5_checksum text,
  add column if not exists last_seen_at timestamptz,
  add column if not exists is_removed boolean not null default false,
  add column if not exists removed_at timestamptz;

alter table knowledge.knowledge_sources
  add constraint knowledge_removed_not_runtime check (
    is_removed = false or runtime_enabled = false
  ),
  add constraint knowledge_removed_time check (
    (is_removed = false and removed_at is null)
    or (is_removed = true and removed_at is not null)
  );

create index if not exists knowledge_sources_source_code_lower_idx
  on knowledge.knowledge_sources (lower(source_code))
  where source_code is not null;

create index if not exists knowledge_sources_title_lower_idx
  on knowledge.knowledge_sources (lower(display_title));

alter table knowledge.knowledge_units
  add column if not exists search_document tsvector not null default ''::tsvector;

create or replace function knowledge.set_search_document()
returns trigger
language plpgsql
set search_path = pg_catalog, knowledge, extensions
as $$
begin
  new.search_document := to_tsvector(
    'simple',
    extensions.unaccent(coalesce(new.retrieval_text, ''))
  );
  return new;
end;
$$;

revoke all on function knowledge.set_search_document() from public, anon, authenticated;
grant execute on function knowledge.set_search_document() to service_role;

drop trigger if exists knowledge_units_set_search_document on knowledge.knowledge_units;
create trigger knowledge_units_set_search_document
  before insert or update of retrieval_text on knowledge.knowledge_units
  for each row execute function knowledge.set_search_document();

update knowledge.knowledge_units
set search_document = to_tsvector(
  'simple',
  extensions.unaccent(coalesce(retrieval_text, ''))
)
where search_document = ''::tsvector;

create index if not exists knowledge_units_search_document_gin_idx
  on knowledge.knowledge_units using gin (search_document);

comment on column knowledge.knowledge_units.search_document is
  'Deterministic lexical search vector derived from retrieval_text using simple dictionary + unaccent. Vector embeddings are intentionally absent in M2.';

comment on column knowledge.knowledge_sources.is_removed is
  'Fail-closed Drive removal/access-loss marker. Removed sources cannot remain runtime-enabled.';
