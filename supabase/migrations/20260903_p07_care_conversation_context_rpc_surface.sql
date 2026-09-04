-- 20260903 · P07 Care AI Phase A — PostgREST-safe service RPC surface.
-- Companion to 20260903_p07_care_conversation_context.sql.
-- The `care` schema remains private/unexposed. Runtime reaches it only through
-- public SECURITY DEFINER wrappers executable by service_role, matching the
-- repository's existing private-schema + public-RPC pattern.
-- NOT FOR PRODUCTION APPLY WITHOUT A SEPARATE FOUNDER GATE.

create or replace function public.care_context_append_turn(
  p_channel text,
  p_account_scope_hash text,
  p_external_subject_hash text,
  p_direction text,
  p_content text,
  p_external_message_hash text,
  p_expires_at timestamptz,
  p_context_policy_version text,
  p_idle_cutoff_at timestamptz
)
returns uuid
language sql
security definer
set search_path = pg_catalog, public, care
as $$
  select care.care_context_append_turn(
    p_channel,
    p_account_scope_hash,
    p_external_subject_hash,
    p_direction,
    p_content,
    p_external_message_hash,
    p_expires_at,
    p_context_policy_version,
    p_idle_cutoff_at
  );
$$;

revoke all on function public.care_context_append_turn(
  text, text, text, text, text, text, timestamptz, text, timestamptz
) from public, anon, authenticated;
grant execute on function public.care_context_append_turn(
  text, text, text, text, text, text, timestamptz, text, timestamptz
) to service_role;

create or replace function public.care_context_load_recent(
  p_channel text,
  p_account_scope_hash text,
  p_external_subject_hash text,
  p_now timestamptz,
  p_max_messages integer
)
returns table (
  direction text,
  content_server_only text,
  created_at timestamptz
)
language sql
security definer
set search_path = pg_catalog, public, care
stable
as $$
  select x.direction, x.content_server_only, x.created_at
  from care.care_context_load_recent(
    p_channel,
    p_account_scope_hash,
    p_external_subject_hash,
    p_now,
    p_max_messages
  ) x;
$$;

revoke all on function public.care_context_load_recent(
  text, text, text, timestamptz, integer
) from public, anon, authenticated;
grant execute on function public.care_context_load_recent(
  text, text, text, timestamptz, integer
) to service_role;

create or replace function public.care_context_purge_expired(
  p_now timestamptz
)
returns integer
language sql
security definer
set search_path = pg_catalog, public, care
as $$
  select care.care_context_purge_expired(p_now);
$$;

revoke all on function public.care_context_purge_expired(timestamptz)
  from public, anon, authenticated;
grant execute on function public.care_context_purge_expired(timestamptz)
  to service_role;
