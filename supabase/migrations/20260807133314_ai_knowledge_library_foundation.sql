-- 20260807133314 · ESSENCE AI Knowledge Backend M1
-- Machine Library foundation only: source identity, immutable ingestion versions,
-- structure-aware units and Drive sync state. No provider, embedding, vector index,
-- customer data, child data, public route or autonomous write is introduced here.

create schema if not exists knowledge;

revoke all on schema knowledge from public, anon, authenticated;
grant usage on schema knowledge to service_role;

create or replace function knowledge.set_updated_at()
returns trigger
language plpgsql
set search_path = pg_catalog, knowledge
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

revoke all on function knowledge.set_updated_at() from public, anon, authenticated;

create table knowledge.knowledge_sources (
  id uuid primary key default gen_random_uuid(),
  drive_file_id text not null unique check (char_length(drive_file_id) between 8 and 256),
  source_code text unique,
  display_title text not null check (char_length(display_title) between 1 and 500),
  drive_url text not null check (drive_url ~ '^https://'),
  canonical_path text not null,
  root_zone text not null check (root_zone in (
    '00_start','01_current','02_work','03_distilled','04_history','90_governance','99_private','external'
  )),
  mime_type text,
  source_kind text not null default 'canonical' check (source_kind in (
    'canonical','managed_copy','export','interface','navigation','external_source'
  )),
  source_role text not null check (source_role in (
    'ruling','current_truth','contract','canonical','supporting','workspace',
    'implementation_evidence','historical','governance'
  )),
  authority_level text not null check (authority_level in ('L0','L1','L2','L3','L4','L5','L6')),
  authority_scope text[] not null default '{}',
  lifecycle text not null check (lifecycle in (
    'current','approved','draft','proposal','reference','snapshot','superseded','historical','conflict'
  )),
  sensitivity text not null default 'internal' check (sensitivity in (
    'public','internal','restricted','private','child_sensitive'
  )),
  usage_mode text not null check (usage_mode in (
    'current_truth','workspace','supporting','historical','governance','never'
  )),
  ingest_mode text not null check (ingest_mode in (
    'content','metadata_only','conditional','deny','quarantine'
  )),
  runtime_enabled boolean not null default false,
  permission_fingerprint text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint knowledge_private_hard_deny check (
    sensitivity not in ('private','child_sensitive') or (ingest_mode = 'deny' and runtime_enabled = false)
  ),
  constraint knowledge_private_zone_hard_deny check (
    root_zone <> '99_private' or (ingest_mode = 'deny' and runtime_enabled = false)
  ),
  constraint knowledge_runtime_requires_content check (
    runtime_enabled = false or ingest_mode = 'content'
  ),
  constraint knowledge_derived_copy_not_content check (
    source_kind not in ('managed_copy','export','interface','navigation') or ingest_mode <> 'content'
  )
);

comment on table knowledge.knowledge_sources is
  'Derived Machine Library source registry. Google Drive remains human canonical; private/child-sensitive sources are hard denied.';

create table knowledge.knowledge_versions (
  id uuid primary key default gen_random_uuid(),
  source_id uuid not null references knowledge.knowledge_sources(id) on delete cascade,
  drive_revision_id text,
  content_hash_sha256 text not null check (content_hash_sha256 ~ '^[a-f0-9]{64}$'),
  normalized_content_hash_sha256 text not null check (normalized_content_hash_sha256 ~ '^[a-f0-9]{64}$'),
  parser_version text not null,
  accepted_content_state text not null default 'accepted_without_suggestions' check (accepted_content_state in (
    'accepted_without_suggestions','accepted_snapshot','raw_file'
  )),
  ingest_state text not null default 'staged' check (ingest_state in (
    'staged','current','superseded','quarantined','removed'
  )),
  effective_at timestamptz,
  superseded_at timestamptz,
  ingested_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  unique(source_id, content_hash_sha256),
  constraint knowledge_version_supersession_time check (
    superseded_at is null or superseded_at >= ingested_at
  )
);

comment on table knowledge.knowledge_versions is
  'Immutable ingestion evidence for reproducible retrieval/citations; not a replacement for Google Drive revision history.';

create unique index knowledge_one_current_version_per_source_idx
  on knowledge.knowledge_versions(source_id)
  where ingest_state = 'current';

create index knowledge_versions_source_ingested_idx
  on knowledge.knowledge_versions(source_id, ingested_at desc);

create table knowledge.knowledge_units (
  id uuid primary key default gen_random_uuid(),
  version_id uuid not null references knowledge.knowledge_versions(id) on delete cascade,
  parent_unit_id uuid references knowledge.knowledge_units(id) on delete cascade,
  unit_kind text not null check (unit_kind in (
    'document','section','clause','paragraph','list_item','table','table_row'
  )),
  sequence integer not null check (sequence >= 0),
  heading_path text[] not null default '{}',
  raw_text text not null,
  retrieval_text text not null,
  content_hash_sha256 text not null check (content_hash_sha256 ~ '^[a-f0-9]{64}$'),
  authority_level_override text check (authority_level_override is null or authority_level_override in ('L0','L1','L2','L3','L4','L5','L6')),
  authority_scope_override text[],
  lifecycle_override text check (lifecycle_override is null or lifecycle_override in (
    'current','approved','draft','proposal','reference','snapshot','superseded','historical','conflict'
  )),
  sensitivity_override text check (sensitivity_override is null or sensitivity_override in (
    'public','internal','restricted','private','child_sensitive'
  )),
  usage_mode_override text check (usage_mode_override is null or usage_mode_override in (
    'current_truth','workspace','supporting','historical','governance','never'
  )),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique(version_id, sequence, content_hash_sha256)
);

comment on table knowledge.knowledge_units is
  'Structure-aware retrieval units. raw_text is evidence; retrieval_text may add deterministic retrieval context. No embedding column exists in M1.';

create index knowledge_units_version_sequence_idx
  on knowledge.knowledge_units(version_id, sequence);
create index knowledge_units_parent_idx
  on knowledge.knowledge_units(parent_unit_id);

create table knowledge.knowledge_sync_state (
  connector_key text primary key,
  root_folder_id text not null,
  change_page_token text,
  health_state text not null default 'never_run' check (health_state in ('never_run','healthy','degraded','blocked')),
  last_full_reconcile_at timestamptz,
  last_delta_sync_at timestamptz,
  last_success_at timestamptz,
  last_error_code text,
  last_error_safe_summary text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint knowledge_sync_error_pair check (
    (last_error_code is null and last_error_safe_summary is null)
    or last_error_code is not null
  )
);

comment on table knowledge.knowledge_sync_state is
  'Drive sync cursor and health metadata only. Credentials and secrets must never be stored here.';

create trigger knowledge_sources_set_updated_at
  before update on knowledge.knowledge_sources
  for each row execute function knowledge.set_updated_at();

create trigger knowledge_sync_state_set_updated_at
  before update on knowledge.knowledge_sync_state
  for each row execute function knowledge.set_updated_at();

alter table knowledge.knowledge_sources enable row level security;
alter table knowledge.knowledge_sources force row level security;
alter table knowledge.knowledge_versions enable row level security;
alter table knowledge.knowledge_versions force row level security;
alter table knowledge.knowledge_units enable row level security;
alter table knowledge.knowledge_units force row level security;
alter table knowledge.knowledge_sync_state enable row level security;
alter table knowledge.knowledge_sync_state force row level security;

revoke all on knowledge.knowledge_sources, knowledge.knowledge_versions,
  knowledge.knowledge_units, knowledge.knowledge_sync_state from public, anon, authenticated;

-- M1 has no browser/runtime reader. service_role is maintenance/sync only and
-- must never be exposed to the browser or used as the future routine Founder-AI
-- runtime credential. M2+ must add a narrower server-side read boundary.
grant select, insert, update, delete on knowledge.knowledge_sources,
  knowledge.knowledge_versions, knowledge.knowledge_units,
  knowledge.knowledge_sync_state to service_role;
