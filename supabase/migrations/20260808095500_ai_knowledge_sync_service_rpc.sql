-- M2B · server-side Drive sync persistence boundary.
-- These RPCs are service_role only. The private knowledge schema remains unexposed to
-- browser roles and Google Drive remains the human canonical source of truth.

create or replace function public.knowledge_sync_ingest(
  p_source jsonb,
  p_version jsonb,
  p_units jsonb
)
returns jsonb
language plpgsql
security definer
set search_path = pg_catalog, public, knowledge
as $$
declare
  v_source_id uuid;
  v_version_id uuid;
  v_existing_hash text;
  v_unit jsonb;
begin
  if coalesce(p_source->>'drive_file_id', '') = '' then
    raise exception 'KNOWLEDGE_SYNC_DRIVE_FILE_ID_REQUIRED';
  end if;
  if p_source->>'root_zone' = '99_private' then
    raise exception 'KNOWLEDGE_SYNC_PRIVATE_ZONE_DENIED';
  end if;
  if p_source->>'sensitivity' in ('private', 'child_sensitive') then
    raise exception 'KNOWLEDGE_SYNC_SENSITIVE_SOURCE_DENIED';
  end if;
  if p_source->>'ingest_mode' <> 'content' then
    raise exception 'KNOWLEDGE_SYNC_CONTENT_MODE_REQUIRED';
  end if;
  if coalesce(p_version->>'content_hash_sha256', '') !~ '^[a-f0-9]{64}$' then
    raise exception 'KNOWLEDGE_SYNC_CONTENT_HASH_INVALID';
  end if;
  if jsonb_typeof(p_units) <> 'array' then
    raise exception 'KNOWLEDGE_SYNC_UNITS_ARRAY_REQUIRED';
  end if;

  insert into knowledge.knowledge_sources (
    drive_file_id,
    source_code,
    display_title,
    drive_url,
    canonical_path,
    root_zone,
    mime_type,
    source_kind,
    source_role,
    authority_level,
    authority_scope,
    lifecycle,
    sensitivity,
    usage_mode,
    ingest_mode,
    runtime_enabled,
    permission_fingerprint,
    metadata,
    drive_created_at,
    drive_modified_at,
    drive_version,
    drive_md5_checksum,
    last_seen_at,
    is_removed,
    removed_at
  ) values (
    p_source->>'drive_file_id',
    nullif(p_source->>'source_code', ''),
    p_source->>'display_title',
    p_source->>'drive_url',
    p_source->>'canonical_path',
    p_source->>'root_zone',
    nullif(p_source->>'mime_type', ''),
    p_source->>'source_kind',
    p_source->>'source_role',
    p_source->>'authority_level',
    coalesce(array(select jsonb_array_elements_text(coalesce(p_source->'authority_scope', '[]'::jsonb))), '{}'::text[]),
    p_source->>'lifecycle',
    p_source->>'sensitivity',
    p_source->>'usage_mode',
    p_source->>'ingest_mode',
    coalesce((p_source->>'runtime_enabled')::boolean, false),
    nullif(p_source->>'permission_fingerprint', ''),
    coalesce(p_source->'metadata', '{}'::jsonb),
    nullif(p_source->>'drive_created_at', '')::timestamptz,
    nullif(p_source->>'drive_modified_at', '')::timestamptz,
    nullif(p_source->>'drive_version', ''),
    nullif(p_source->>'drive_md5_checksum', ''),
    now(),
    false,
    null
  )
  on conflict (drive_file_id) do update set
    source_code = excluded.source_code,
    display_title = excluded.display_title,
    drive_url = excluded.drive_url,
    canonical_path = excluded.canonical_path,
    root_zone = excluded.root_zone,
    mime_type = excluded.mime_type,
    source_kind = excluded.source_kind,
    source_role = excluded.source_role,
    authority_level = excluded.authority_level,
    authority_scope = excluded.authority_scope,
    lifecycle = excluded.lifecycle,
    sensitivity = excluded.sensitivity,
    usage_mode = excluded.usage_mode,
    ingest_mode = excluded.ingest_mode,
    runtime_enabled = excluded.runtime_enabled,
    permission_fingerprint = excluded.permission_fingerprint,
    metadata = excluded.metadata,
    drive_created_at = excluded.drive_created_at,
    drive_modified_at = excluded.drive_modified_at,
    drive_version = excluded.drive_version,
    drive_md5_checksum = excluded.drive_md5_checksum,
    last_seen_at = now(),
    is_removed = false,
    removed_at = null
  returning id into v_source_id;

  select content_hash_sha256
  into v_existing_hash
  from knowledge.knowledge_versions
  where source_id = v_source_id and ingest_state = 'current'
  limit 1;

  if v_existing_hash is distinct from p_version->>'content_hash_sha256' then
    update knowledge.knowledge_versions
    set ingest_state = 'superseded', superseded_at = now()
    where source_id = v_source_id and ingest_state = 'current';
  end if;

  insert into knowledge.knowledge_versions (
    source_id,
    drive_revision_id,
    content_hash_sha256,
    normalized_content_hash_sha256,
    parser_version,
    accepted_content_state,
    ingest_state,
    effective_at,
    superseded_at
  ) values (
    v_source_id,
    nullif(p_version->>'drive_revision_id', ''),
    p_version->>'content_hash_sha256',
    p_version->>'normalized_content_hash_sha256',
    p_version->>'parser_version',
    coalesce(nullif(p_version->>'accepted_content_state', ''), 'accepted_without_suggestions'),
    'current',
    coalesce(nullif(p_version->>'effective_at', '')::timestamptz, now()),
    null
  )
  on conflict (source_id, content_hash_sha256) do update set
    drive_revision_id = excluded.drive_revision_id,
    ingest_state = 'current',
    effective_at = excluded.effective_at,
    superseded_at = null
  returning id into v_version_id;

  delete from knowledge.knowledge_units where version_id = v_version_id;

  for v_unit in select value from jsonb_array_elements(p_units)
  loop
    insert into knowledge.knowledge_units (
      version_id,
      parent_unit_id,
      unit_kind,
      sequence,
      heading_path,
      raw_text,
      retrieval_text,
      content_hash_sha256,
      authority_level_override,
      authority_scope_override,
      lifecycle_override,
      sensitivity_override,
      usage_mode_override,
      metadata
    ) values (
      v_version_id,
      null,
      coalesce(nullif(v_unit->>'unit_kind', ''), 'paragraph'),
      (v_unit->>'sequence')::integer,
      coalesce(array(select jsonb_array_elements_text(coalesce(v_unit->'heading_path', '[]'::jsonb))), '{}'::text[]),
      coalesce(v_unit->>'raw_text', ''),
      coalesce(v_unit->>'retrieval_text', ''),
      v_unit->>'content_hash_sha256',
      nullif(v_unit->>'authority_level_override', ''),
      case when v_unit ? 'authority_scope_override' then array(select jsonb_array_elements_text(v_unit->'authority_scope_override')) else null end,
      nullif(v_unit->>'lifecycle_override', ''),
      nullif(v_unit->>'sensitivity_override', ''),
      nullif(v_unit->>'usage_mode_override', ''),
      coalesce(v_unit->'metadata', '{}'::jsonb)
    );
  end loop;

  return jsonb_build_object(
    'source_id', v_source_id,
    'version_id', v_version_id,
    'content_changed', v_existing_hash is distinct from p_version->>'content_hash_sha256'
  );
end;
$$;

create or replace function public.knowledge_sync_tombstone(
  p_drive_file_id text,
  p_reason_code text
)
returns boolean
language plpgsql
security definer
set search_path = pg_catalog, public, knowledge
as $$
declare
  v_source_id uuid;
begin
  if coalesce(p_drive_file_id, '') = '' then
    raise exception 'KNOWLEDGE_SYNC_DRIVE_FILE_ID_REQUIRED';
  end if;

  update knowledge.knowledge_sources
  set runtime_enabled = false,
      is_removed = true,
      removed_at = now(),
      metadata = metadata || jsonb_build_object('removal_reason_code', p_reason_code)
  where drive_file_id = p_drive_file_id
  returning id into v_source_id;

  if v_source_id is null then
    return false;
  end if;

  update knowledge.knowledge_versions
  set ingest_state = 'removed',
      superseded_at = coalesce(superseded_at, now())
  where source_id = v_source_id and ingest_state = 'current';

  return true;
end;
$$;

create or replace function public.knowledge_sync_save_checkpoint(
  p_connector_key text,
  p_root_folder_id text,
  p_change_page_token text,
  p_health_state text,
  p_kind text
)
returns void
language plpgsql
security definer
set search_path = pg_catalog, public, knowledge
as $$
begin
  if p_kind not in ('full_reconcile', 'delta') then
    raise exception 'KNOWLEDGE_SYNC_CHECKPOINT_KIND_INVALID';
  end if;
  if p_health_state not in ('healthy', 'degraded', 'blocked') then
    raise exception 'KNOWLEDGE_SYNC_HEALTH_STATE_INVALID';
  end if;

  insert into knowledge.knowledge_sync_state (
    connector_key,
    root_folder_id,
    change_page_token,
    health_state,
    last_full_reconcile_at,
    last_delta_sync_at,
    last_success_at,
    last_error_code,
    last_error_safe_summary,
    metadata
  ) values (
    p_connector_key,
    p_root_folder_id,
    p_change_page_token,
    p_health_state,
    case when p_kind = 'full_reconcile' then now() else null end,
    case when p_kind = 'delta' then now() else null end,
    case when p_health_state = 'healthy' then now() else null end,
    null,
    null,
    jsonb_build_object('automated_drive_identity', true, 'server_side_only', true)
  )
  on conflict (connector_key) do update set
    root_folder_id = excluded.root_folder_id,
    change_page_token = excluded.change_page_token,
    health_state = excluded.health_state,
    last_full_reconcile_at = case when p_kind = 'full_reconcile' then now() else knowledge.knowledge_sync_state.last_full_reconcile_at end,
    last_delta_sync_at = case when p_kind = 'delta' then now() else knowledge.knowledge_sync_state.last_delta_sync_at end,
    last_success_at = case when p_health_state = 'healthy' then now() else knowledge.knowledge_sync_state.last_success_at end,
    last_error_code = null,
    last_error_safe_summary = null,
    metadata = knowledge.knowledge_sync_state.metadata || jsonb_build_object('automated_drive_identity', true, 'server_side_only', true);
end;
$$;

create or replace function public.knowledge_sync_cleanup_synthetic_fixture(
  p_drive_file_id text
)
returns boolean
language plpgsql
security definer
set search_path = pg_catalog, public, knowledge
as $$
declare
  v_deleted integer;
begin
  delete from knowledge.knowledge_sources
  where drive_file_id = p_drive_file_id
    and metadata->>'m2b_fixture' = 'true'
    and metadata->>'synthetic' = 'true';
  get diagnostics v_deleted = row_count;
  return v_deleted = 1;
end;
$$;

revoke all on function public.knowledge_sync_ingest(jsonb, jsonb, jsonb) from public, anon, authenticated;
revoke all on function public.knowledge_sync_tombstone(text, text) from public, anon, authenticated;
revoke all on function public.knowledge_sync_save_checkpoint(text, text, text, text, text) from public, anon, authenticated;
revoke all on function public.knowledge_sync_cleanup_synthetic_fixture(text) from public, anon, authenticated;

grant execute on function public.knowledge_sync_ingest(jsonb, jsonb, jsonb) to service_role;
grant execute on function public.knowledge_sync_tombstone(text, text) to service_role;
grant execute on function public.knowledge_sync_save_checkpoint(text, text, text, text, text) to service_role;
grant execute on function public.knowledge_sync_cleanup_synthetic_fixture(text) to service_role;

comment on function public.knowledge_sync_ingest(jsonb, jsonb, jsonb) is
  'Service-role-only server sync boundary for controlled Drive ingestion into the private knowledge schema.';
comment on function public.knowledge_sync_tombstone(text, text) is
  'Service-role-only fail-closed tombstone for Drive removal/access loss. Evidence is retained but runtime use is disabled.';
comment on function public.knowledge_sync_cleanup_synthetic_fixture(text) is
  'Deletes only rows explicitly marked as synthetic M2B fixture evidence; canonical sources cannot be removed by this function.';
