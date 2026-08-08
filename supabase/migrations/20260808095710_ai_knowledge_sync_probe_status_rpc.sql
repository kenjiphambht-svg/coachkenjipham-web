-- M2B · service-role-only status helpers for controlled synthetic E2E evidence.
-- No knowledge content is returned. These functions do not expose the private schema
-- to anon/authenticated roles and are restricted to the M2B synthetic fixture marker.

create or replace function public.knowledge_sync_get_checkpoint(p_connector_key text)
returns jsonb language sql security definer
set search_path = pg_catalog, public, knowledge stable
as $$
  select case when s.connector_key is null then null else jsonb_build_object(
    'connector_key', s.connector_key,
    'root_folder_id', s.root_folder_id,
    'change_page_token', s.change_page_token,
    'health_state', s.health_state,
    'last_full_reconcile_at', s.last_full_reconcile_at,
    'last_delta_sync_at', s.last_delta_sync_at
  ) end
  from (select 1) seed
  left join knowledge.knowledge_sync_state s on s.connector_key = p_connector_key;
$$;

create or replace function public.knowledge_sync_synthetic_fixture_status(p_drive_file_id text)
returns jsonb language sql security definer
set search_path = pg_catalog, public, knowledge stable
as $$
  select case when s.id is null then jsonb_build_object('exists', false) else jsonb_build_object(
    'exists', true,
    'runtime_enabled', s.runtime_enabled,
    'is_removed', s.is_removed,
    'version_count', (select count(*) from knowledge.knowledge_versions v where v.source_id=s.id),
    'current_version_count', (select count(*) from knowledge.knowledge_versions v where v.source_id=s.id and v.ingest_state='current'),
    'removed_version_count', (select count(*) from knowledge.knowledge_versions v where v.source_id=s.id and v.ingest_state='removed'),
    'unit_count', (
      select count(*) from knowledge.knowledge_units u
      join knowledge.knowledge_versions v on v.id=u.version_id
      where v.source_id=s.id
    )
  ) end
  from (select 1) seed
  left join knowledge.knowledge_sources s
    on s.drive_file_id=p_drive_file_id
   and s.metadata->>'m2b_fixture'='true'
   and s.metadata->>'synthetic'='true';
$$;

revoke all on function public.knowledge_sync_get_checkpoint(text) from public, anon, authenticated;
revoke all on function public.knowledge_sync_synthetic_fixture_status(text) from public, anon, authenticated;
grant execute on function public.knowledge_sync_get_checkpoint(text) to service_role;
grant execute on function public.knowledge_sync_synthetic_fixture_status(text) to service_role;

comment on function public.knowledge_sync_get_checkpoint(text) is 'Service-role-only Drive cursor read for the controlled server-side sync runner.';
comment on function public.knowledge_sync_synthetic_fixture_status(text) is 'Service-role-only metadata/count status for rows explicitly marked as synthetic M2B fixtures. Returns no document text.';
