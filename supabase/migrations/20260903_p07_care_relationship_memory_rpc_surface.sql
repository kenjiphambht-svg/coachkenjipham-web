-- 20260903 · P07 Care AI Phase B — PostgREST-safe relationship-memory RPC surface.
-- The `care` schema remains private/unexposed. Public wrappers are service_role-only.
-- Durable real-customer memory activation remains separately gated.

create or replace function public.care_memory_read(
  p_person_id uuid,
  p_channel text,
  p_account_scope_hash text,
  p_external_subject_hash text,
  p_purpose_scope text,
  p_now timestamptz,
  p_max_items integer
)
returns table (
  id uuid,
  memory_key text,
  value_json jsonb,
  purpose_scope text,
  provenance_kind text,
  source_ref text,
  confidence text,
  freshness_state text,
  sensitivity_class text,
  observed_at timestamptz,
  last_confirmed_at timestamptz,
  review_after timestamptz,
  expires_at timestamptz,
  memory_contract_version text,
  supersedes_memory_id uuid,
  created_at timestamptz
)
language sql
stable
security definer
set search_path = pg_catalog, public, care
as $$
  select * from care.care_memory_read(
    p_person_id,p_channel,p_account_scope_hash,p_external_subject_hash,
    p_purpose_scope,p_now,p_max_items
  );
$$;

create or replace function public.care_memory_update(
  p_person_id uuid,
  p_channel text,
  p_account_scope_hash text,
  p_external_subject_hash text,
  p_memory_key text,
  p_value_json jsonb,
  p_purpose_scope text,
  p_provenance_kind text,
  p_source_ref text,
  p_confidence text,
  p_freshness_state text,
  p_sensitivity_class text,
  p_observed_at timestamptz,
  p_last_confirmed_at timestamptz,
  p_review_after timestamptz,
  p_expires_at timestamptz,
  p_memory_contract_version text
)
returns uuid
language sql
security definer
set search_path = pg_catalog, public, care
as $$
  select care.care_memory_update(
    p_person_id,p_channel,p_account_scope_hash,p_external_subject_hash,
    p_memory_key,p_value_json,p_purpose_scope,p_provenance_kind,p_source_ref,
    p_confidence,p_freshness_state,p_sensitivity_class,p_observed_at,
    p_last_confirmed_at,p_review_after,p_expires_at,p_memory_contract_version
  );
$$;

create or replace function public.care_memory_forget(
  p_person_id uuid,
  p_channel text,
  p_account_scope_hash text,
  p_external_subject_hash text,
  p_memory_key text,
  p_purpose_scope text,
  p_source_ref text,
  p_observed_at timestamptz,
  p_memory_contract_version text
)
returns uuid
language sql
security definer
set search_path = pg_catalog, public, care
as $$
  select care.care_memory_forget(
    p_person_id,p_channel,p_account_scope_hash,p_external_subject_hash,
    p_memory_key,p_purpose_scope,p_source_ref,p_observed_at,p_memory_contract_version
  );
$$;

revoke all on function public.care_memory_read(uuid,text,text,text,text,timestamptz,integer) from public, anon, authenticated;
revoke all on function public.care_memory_update(uuid,text,text,text,text,jsonb,text,text,text,text,text,text,timestamptz,timestamptz,timestamptz,timestamptz,text) from public, anon, authenticated;
revoke all on function public.care_memory_forget(uuid,text,text,text,text,text,text,timestamptz,text) from public, anon, authenticated;
grant execute on function public.care_memory_read(uuid,text,text,text,text,timestamptz,integer) to service_role;
grant execute on function public.care_memory_update(uuid,text,text,text,text,jsonb,text,text,text,text,text,text,timestamptz,timestamptz,timestamptz,timestamptz,text) to service_role;
grant execute on function public.care_memory_forget(uuid,text,text,text,text,text,text,timestamptz,text) to service_role;
