-- 20260903 · P07 Care AI Phase B — selective durable relationship memory substrate.
-- BOUNDED STAGING ARTIFACT. Durable real-customer memory activation remains separately gated.
-- Raw transcript is not customer memory. S3/private/child-sensitive general memory is denied.

create table if not exists care.relationship_memories (
  id uuid primary key default gen_random_uuid(),
  person_id uuid references identity.persons(id) on delete restrict,
  channel_identity_id uuid references identity.channel_identities(id) on delete restrict,
  memory_key text not null check (memory_key in (
    'self_stated_current_need',
    'context_family',
    'product_journey_explored',
    'conversation_open_loop',
    'explicit_preference',
    'last_verified_care_action',
    'selected_next_step',
    'inquiry_handoff_state',
    'consent_suppression_scope',
    'compact_safe_summary',
    'verified_journey_fact',
    'provisional_state_signal'
  )),
  value_json jsonb not null,
  purpose_scope text not null check (purpose_scope ~ '^[A-Z][A-Z0-9_]{0,63}$'),
  provenance_kind text not null check (provenance_kind in (
    'CUSTOMER_SELF_STATED', 'VERIFIED_SYSTEM', 'PROVISIONAL_MODEL_SIGNAL'
  )),
  source_ref text not null check (char_length(source_ref) between 1 and 200),
  confidence text not null check (confidence in ('VERIFIED', 'SELF_STATED', 'PROVISIONAL')),
  freshness_state text not null check (freshness_state in ('CURRENT', 'STALE', 'REVIEW_DUE')),
  sensitivity_class text not null check (sensitivity_class in ('S1', 'S2', 'S3')),
  observed_at timestamptz not null,
  last_confirmed_at timestamptz,
  review_after timestamptz,
  expires_at timestamptz,
  memory_contract_version text not null check (char_length(memory_contract_version) between 1 and 100),
  status text not null default 'ACTIVE' check (status in ('ACTIVE', 'SUPERSEDED', 'FORGOTTEN', 'REJECTED')),
  supersedes_memory_id uuid references care.relationship_memories(id) on delete restrict,
  created_at timestamptz not null default now(),
  constraint care_relationship_memory_exactly_one_owner check (
    ((person_id is not null)::int + (channel_identity_id is not null)::int) = 1
  ),
  constraint care_relationship_memory_active_not_s3 check (
    status <> 'ACTIVE' or sensitivity_class in ('S1', 'S2')
  )
);

create unique index if not exists care_relationship_memories_active_person_key_idx
  on care.relationship_memories(person_id, memory_key, purpose_scope)
  where status = 'ACTIVE' and person_id is not null;
create unique index if not exists care_relationship_memories_active_channel_key_idx
  on care.relationship_memories(channel_identity_id, memory_key, purpose_scope)
  where status = 'ACTIVE' and channel_identity_id is not null;
create index if not exists care_relationship_memories_person_read_idx
  on care.relationship_memories(person_id, purpose_scope, status, observed_at desc)
  where person_id is not null;
create index if not exists care_relationship_memories_channel_read_idx
  on care.relationship_memories(channel_identity_id, purpose_scope, status, observed_at desc)
  where channel_identity_id is not null;
create index if not exists care_relationship_memories_expiry_idx
  on care.relationship_memories(expires_at)
  where status = 'ACTIVE' and expires_at is not null;

comment on table care.relationship_memories is
  'Selective, versioned relationship memory only. No raw transcript archive; runtime reads only active purpose-matched fresh S1/S2 items.';

alter table care.relationship_memories enable row level security;
alter table care.relationship_memories force row level security;
revoke all on care.relationship_memories from public, anon, authenticated;
revoke insert, update, delete on care.relationship_memories from service_role;
grant select on care.relationship_memories to service_role;

create or replace function care.care_memory_read(
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
language plpgsql
security definer
set search_path = pg_catalog, identity, care
stable
as $$
begin
  if p_purpose_scope is null or p_purpose_scope !~ '^[A-Z][A-Z0-9_]{0,63}$' then
    raise exception 'CARE_MEMORY_PURPOSE_INVALID';
  end if;
  if p_now is null then raise exception 'CARE_MEMORY_NOW_INVALID'; end if;
  if p_max_items is null or p_max_items < 1 or p_max_items > 20 then
    raise exception 'CARE_MEMORY_MAX_ITEMS_INVALID';
  end if;

  if p_person_id is not null then
    if p_channel is not null or p_account_scope_hash is not null or p_external_subject_hash is not null then
      raise exception 'CARE_MEMORY_OWNER_SCOPE_INVALID';
    end if;
  else
    if p_channel not in ('website', 'facebook_messenger', 'instagram', 'email')
       or p_account_scope_hash !~ '^[0-9a-f]{64}$'
       or p_external_subject_hash !~ '^[0-9a-f]{64}$' then
      raise exception 'CARE_MEMORY_OWNER_SCOPE_INVALID';
    end if;
  end if;

  return query
  select
    m.id, m.memory_key, m.value_json, m.purpose_scope, m.provenance_kind, m.source_ref,
    m.confidence, m.freshness_state, m.sensitivity_class, m.observed_at,
    m.last_confirmed_at, m.review_after, m.expires_at, m.memory_contract_version,
    m.supersedes_memory_id, m.created_at
  from care.relationship_memories m
  where m.status = 'ACTIVE'
    and m.purpose_scope = p_purpose_scope
    and m.sensitivity_class in ('S1', 'S2')
    and m.freshness_state = 'CURRENT'
    and (m.expires_at is null or m.expires_at > p_now)
    and (m.review_after is null or m.review_after > p_now)
    and (
      (p_person_id is not null and m.person_id = p_person_id and m.channel_identity_id is null)
      or
      (p_person_id is null and m.person_id is null and exists (
        select 1
        from identity.channel_identities ci
        where ci.id = m.channel_identity_id
          and ci.channel = p_channel
          and ci.account_scope_hash = p_account_scope_hash
          and ci.external_subject_hash = p_external_subject_hash
          and ci.state = 'active'
      ))
    )
  order by coalesce(m.last_confirmed_at, m.observed_at) desc, m.created_at desc
  limit p_max_items;
end;
$$;

create or replace function care.care_memory_update(
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
language plpgsql
security definer
set search_path = pg_catalog, identity, care
as $$
declare
  v_channel_identity_id uuid;
  v_prior_id uuid;
  v_new_id uuid;
  v_owner_key text;
begin
  if p_memory_key not in (
    'self_stated_current_need','context_family','product_journey_explored',
    'conversation_open_loop','explicit_preference','last_verified_care_action',
    'selected_next_step','inquiry_handoff_state','consent_suppression_scope',
    'compact_safe_summary','verified_journey_fact','provisional_state_signal'
  ) then raise exception 'CARE_MEMORY_KEY_INVALID'; end if;
  if p_purpose_scope is null or p_purpose_scope !~ '^[A-Z][A-Z0-9_]{0,63}$' then
    raise exception 'CARE_MEMORY_PURPOSE_INVALID';
  end if;
  if p_source_ref is null or char_length(p_source_ref) not between 1 and 200 then
    raise exception 'CARE_MEMORY_SOURCE_REF_INVALID';
  end if;
  if p_memory_contract_version is null or char_length(p_memory_contract_version) not between 1 and 100 then
    raise exception 'CARE_MEMORY_CONTRACT_VERSION_INVALID';
  end if;
  if p_value_json is null or char_length(p_value_json::text) > 1200 then
    raise exception 'CARE_MEMORY_VALUE_INVALID';
  end if;
  if p_sensitivity_class not in ('S1', 'S2') then raise exception 'CARE_MEMORY_S3_DENIED'; end if;
  if p_freshness_state <> 'CURRENT' then raise exception 'CARE_MEMORY_FRESHNESS_INVALID'; end if;
  if p_observed_at is null then raise exception 'CARE_MEMORY_OBSERVED_AT_INVALID'; end if;
  if p_expires_at is not null and p_expires_at <= now() then raise exception 'CARE_MEMORY_EXPIRY_INVALID'; end if;

  if (p_provenance_kind = 'CUSTOMER_SELF_STATED' and p_confidence <> 'SELF_STATED')
     or (p_provenance_kind = 'VERIFIED_SYSTEM' and p_confidence <> 'VERIFIED')
     or (p_provenance_kind = 'PROVISIONAL_MODEL_SIGNAL' and (p_confidence <> 'PROVISIONAL' or p_memory_key <> 'provisional_state_signal'))
     or p_provenance_kind not in ('CUSTOMER_SELF_STATED','VERIFIED_SYSTEM','PROVISIONAL_MODEL_SIGNAL') then
    raise exception 'CARE_MEMORY_PROVENANCE_CONFIDENCE_MISMATCH';
  end if;

  if p_person_id is not null then
    if p_channel is not null or p_account_scope_hash is not null or p_external_subject_hash is not null then
      raise exception 'CARE_MEMORY_OWNER_SCOPE_INVALID';
    end if;
    perform 1 from identity.persons where id = p_person_id;
    if not found then raise exception 'CARE_MEMORY_PERSON_NOT_FOUND'; end if;
    v_owner_key := 'person:' || p_person_id::text;
  else
    if p_channel not in ('website', 'facebook_messenger', 'instagram', 'email')
       or p_account_scope_hash !~ '^[0-9a-f]{64}$'
       or p_external_subject_hash !~ '^[0-9a-f]{64}$' then
      raise exception 'CARE_MEMORY_OWNER_SCOPE_INVALID';
    end if;
    select ci.id into v_channel_identity_id
    from identity.channel_identities ci
    where ci.channel = p_channel
      and ci.account_scope_hash = p_account_scope_hash
      and ci.external_subject_hash = p_external_subject_hash
      and ci.state = 'active';
    if v_channel_identity_id is null then raise exception 'CARE_MEMORY_CHANNEL_IDENTITY_NOT_FOUND'; end if;
    v_owner_key := 'channel:' || v_channel_identity_id::text;
  end if;

  perform pg_advisory_xact_lock(hashtextextended(v_owner_key || '|' || p_memory_key || '|' || p_purpose_scope, 0));

  select m.id into v_prior_id
  from care.relationship_memories m
  where m.status = 'ACTIVE'
    and m.memory_key = p_memory_key
    and m.purpose_scope = p_purpose_scope
    and ((p_person_id is not null and m.person_id = p_person_id)
      or (p_person_id is null and m.channel_identity_id = v_channel_identity_id))
  order by m.created_at desc
  limit 1
  for update;

  if v_prior_id is not null then
    update care.relationship_memories set status = 'SUPERSEDED' where id = v_prior_id;
  end if;

  insert into care.relationship_memories (
    person_id, channel_identity_id, memory_key, value_json, purpose_scope,
    provenance_kind, source_ref, confidence, freshness_state, sensitivity_class,
    observed_at, last_confirmed_at, review_after, expires_at, memory_contract_version,
    status, supersedes_memory_id
  ) values (
    p_person_id, v_channel_identity_id, p_memory_key, p_value_json, p_purpose_scope,
    p_provenance_kind, p_source_ref, p_confidence, p_freshness_state, p_sensitivity_class,
    p_observed_at, p_last_confirmed_at, p_review_after, p_expires_at, p_memory_contract_version,
    'ACTIVE', v_prior_id
  ) returning id into v_new_id;

  return v_new_id;
end;
$$;

create or replace function care.care_memory_forget(
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
language plpgsql
security definer
set search_path = pg_catalog, identity, care
as $$
declare
  v_channel_identity_id uuid;
  v_prior_id uuid;
  v_tombstone_id uuid;
  v_owner_key text;
begin
  if p_memory_key not in (
    'self_stated_current_need','context_family','product_journey_explored',
    'conversation_open_loop','explicit_preference','last_verified_care_action',
    'selected_next_step','inquiry_handoff_state','consent_suppression_scope',
    'compact_safe_summary','verified_journey_fact','provisional_state_signal'
  ) then raise exception 'CARE_MEMORY_KEY_INVALID'; end if;
  if p_purpose_scope is null or p_purpose_scope !~ '^[A-Z][A-Z0-9_]{0,63}$' then raise exception 'CARE_MEMORY_PURPOSE_INVALID'; end if;
  if p_source_ref is null or char_length(p_source_ref) not between 1 and 200 then raise exception 'CARE_MEMORY_SOURCE_REF_INVALID'; end if;
  if p_observed_at is null then raise exception 'CARE_MEMORY_OBSERVED_AT_INVALID'; end if;
  if p_memory_contract_version is null or char_length(p_memory_contract_version) not between 1 and 100 then raise exception 'CARE_MEMORY_CONTRACT_VERSION_INVALID'; end if;

  if p_person_id is not null then
    if p_channel is not null or p_account_scope_hash is not null or p_external_subject_hash is not null then raise exception 'CARE_MEMORY_OWNER_SCOPE_INVALID'; end if;
    perform 1 from identity.persons where id = p_person_id;
    if not found then raise exception 'CARE_MEMORY_PERSON_NOT_FOUND'; end if;
    v_owner_key := 'person:' || p_person_id::text;
  else
    if p_channel not in ('website', 'facebook_messenger', 'instagram', 'email')
       or p_account_scope_hash !~ '^[0-9a-f]{64}$'
       or p_external_subject_hash !~ '^[0-9a-f]{64}$' then raise exception 'CARE_MEMORY_OWNER_SCOPE_INVALID'; end if;
    select ci.id into v_channel_identity_id
    from identity.channel_identities ci
    where ci.channel = p_channel
      and ci.account_scope_hash = p_account_scope_hash
      and ci.external_subject_hash = p_external_subject_hash
      and ci.state = 'active';
    if v_channel_identity_id is null then raise exception 'CARE_MEMORY_CHANNEL_IDENTITY_NOT_FOUND'; end if;
    v_owner_key := 'channel:' || v_channel_identity_id::text;
  end if;

  perform pg_advisory_xact_lock(hashtextextended(v_owner_key || '|' || p_memory_key || '|' || p_purpose_scope, 0));

  select m.id into v_prior_id
  from care.relationship_memories m
  where m.status = 'ACTIVE'
    and m.memory_key = p_memory_key
    and m.purpose_scope = p_purpose_scope
    and ((p_person_id is not null and m.person_id = p_person_id)
      or (p_person_id is null and m.channel_identity_id = v_channel_identity_id))
  order by m.created_at desc
  limit 1
  for update;

  if v_prior_id is null then return null; end if;
  update care.relationship_memories set status = 'SUPERSEDED' where id = v_prior_id;

  insert into care.relationship_memories (
    person_id, channel_identity_id, memory_key, value_json, purpose_scope,
    provenance_kind, source_ref, confidence, freshness_state, sensitivity_class,
    observed_at, memory_contract_version, status, supersedes_memory_id
  ) values (
    p_person_id, v_channel_identity_id, p_memory_key, '{"forgotten":true}'::jsonb, p_purpose_scope,
    'VERIFIED_SYSTEM', p_source_ref, 'VERIFIED', 'STALE', 'S1',
    p_observed_at, p_memory_contract_version, 'FORGOTTEN', v_prior_id
  ) returning id into v_tombstone_id;

  return v_tombstone_id;
end;
$$;

revoke all on function care.care_memory_read(uuid,text,text,text,text,timestamptz,integer) from public, anon, authenticated;
revoke all on function care.care_memory_update(uuid,text,text,text,text,jsonb,text,text,text,text,text,text,timestamptz,timestamptz,timestamptz,timestamptz,text) from public, anon, authenticated;
revoke all on function care.care_memory_forget(uuid,text,text,text,text,text,text,timestamptz,text) from public, anon, authenticated;
grant execute on function care.care_memory_read(uuid,text,text,text,text,timestamptz,integer) to service_role;
grant execute on function care.care_memory_update(uuid,text,text,text,text,jsonb,text,text,text,text,text,text,timestamptz,timestamptz,timestamptz,timestamptz,text) to service_role;
grant execute on function care.care_memory_forget(uuid,text,text,text,text,text,text,timestamptz,text) to service_role;
