-- 20260903 · P07 Care AI Phase A — bounded multi-turn conversation context.
-- DESIGN/IMPLEMENTATION ARTIFACT ONLY until a separate Founder Production apply gate.
-- This migration intentionally does NOT create durable relationship memory, broad CRM
-- transcript retention, proactive messaging, cross-channel person merge, or learning.
--
-- Privacy shape:
-- - raw Meta sender/account IDs are NOT persisted; server sends HMAC-SHA256 hashes.
-- - message content is server-only and MUST carry expires_at.
-- - browser roles receive no schema/table/function access.
-- - conversation history is short-term context, not canonical customer profile.

create schema if not exists care;

revoke all on schema care from public, anon, authenticated;
grant usage on schema care to service_role;

create table if not exists identity.channel_identities (
  id uuid primary key default gen_random_uuid(),
  channel text not null check (channel in ('website', 'facebook_messenger', 'instagram', 'email')),
  account_scope_hash text not null check (account_scope_hash ~ '^[0-9a-f]{64}$'),
  external_subject_hash text not null check (external_subject_hash ~ '^[0-9a-f]{64}$'),
  state text not null default 'active' check (state in ('active', 'revoked')),
  created_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (channel, account_scope_hash, external_subject_hash)
);

comment on table identity.channel_identities is
  'Pseudonymous channel-scoped identity for Care continuity. Stores HMAC hashes only; no raw Meta sender/account ID. Cross-channel person linking is intentionally out of scope for Phase A.';

create trigger channel_identities_set_updated_at
  before update on identity.channel_identities
  for each row execute function identity.set_updated_at();

create table if not exists care.conversations (
  id uuid primary key default gen_random_uuid(),
  channel_identity_id uuid not null references identity.channel_identities(id) on delete restrict,
  channel text not null check (channel in ('website', 'facebook_messenger', 'instagram', 'email')),
  state text not null default 'active' check (state in ('active', 'closed', 'expired')),
  context_policy_version text not null check (char_length(context_policy_version) between 1 and 100),
  started_at timestamptz not null default now(),
  last_activity_at timestamptz not null default now(),
  ended_at timestamptz,
  created_at timestamptz not null default now(),
  constraint care_conversations_end_state_check check (
    (state = 'active' and ended_at is null)
    or (state in ('closed', 'expired') and ended_at is not null)
  )
);

create unique index if not exists care_conversations_one_active_per_identity_idx
  on care.conversations(channel_identity_id) where state = 'active';
create index if not exists care_conversations_identity_activity_idx
  on care.conversations(channel_identity_id, last_activity_at desc);

comment on table care.conversations is
  'Short-term Care dialogue/session boundary. This row contains no customer story; it scopes bounded recent-turn retrieval.';

create table if not exists care.conversation_messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references care.conversations(id) on delete restrict,
  direction text not null check (direction in ('INBOUND', 'OUTBOUND')),
  external_message_hash text check (
    external_message_hash is null or external_message_hash ~ '^[0-9a-f]{64}$'
  ),
  content_server_only text not null check (
    char_length(content_server_only) between 1 and 8000
  ),
  content_class text not null default 'conversation_context'
    check (content_class in ('conversation_context', 'restricted_transient')),
  created_at timestamptz not null default now(),
  expires_at timestamptz not null,
  deletion_state text not null default 'active'
    check (deletion_state in ('active', 'expired_purged', 'privacy_purged')),
  turn_sequence bigint generated always as identity,
  constraint care_conversation_messages_expiry_check check (expires_at > created_at),
  unique (conversation_id, direction, external_message_hash)
);

create index if not exists care_conversation_messages_recent_idx
  on care.conversation_messages(conversation_id, created_at desc, turn_sequence desc);
create index if not exists care_conversation_messages_expiry_idx
  on care.conversation_messages(expires_at)
  where deletion_state = 'active';

comment on table care.conversation_messages is
  'Bounded server-only recent-turn context. Every row requires expires_at. Not a durable customer profile or learning corpus; browser roles have no access.';

alter table identity.channel_identities enable row level security;
alter table identity.channel_identities force row level security;
alter table care.conversations enable row level security;
alter table care.conversations force row level security;
alter table care.conversation_messages enable row level security;
alter table care.conversation_messages force row level security;

revoke all on identity.channel_identities, care.conversations, care.conversation_messages
  from public, anon, authenticated;

grant select, insert, update on identity.channel_identities, care.conversations, care.conversation_messages
  to service_role;

revoke delete on identity.channel_identities, care.conversations, care.conversation_messages
  from service_role;

create or replace function care.care_context_append_turn(
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
language plpgsql
security definer
set search_path = pg_catalog, identity, care
as $$
declare
  v_identity_id uuid;
  v_conversation_id uuid;
  v_now timestamptz := now();
begin
  if p_channel not in ('website', 'facebook_messenger', 'instagram', 'email') then
    raise exception 'CARE_CONTEXT_CHANNEL_INVALID';
  end if;
  if p_account_scope_hash !~ '^[0-9a-f]{64}$'
     or p_external_subject_hash !~ '^[0-9a-f]{64}$' then
    raise exception 'CARE_CONTEXT_IDENTITY_HASH_INVALID';
  end if;
  if p_direction not in ('INBOUND', 'OUTBOUND') then
    raise exception 'CARE_CONTEXT_DIRECTION_INVALID';
  end if;
  if p_content is null or char_length(btrim(p_content)) < 1 or char_length(p_content) > 8000 then
    raise exception 'CARE_CONTEXT_CONTENT_INVALID';
  end if;
  if p_external_message_hash is not null and p_external_message_hash !~ '^[0-9a-f]{64}$' then
    raise exception 'CARE_CONTEXT_EXTERNAL_MESSAGE_HASH_INVALID';
  end if;
  if p_expires_at is null or p_expires_at <= v_now then
    raise exception 'CARE_CONTEXT_EXPIRY_INVALID';
  end if;
  if p_context_policy_version is null or char_length(btrim(p_context_policy_version)) not between 1 and 100 then
    raise exception 'CARE_CONTEXT_POLICY_VERSION_INVALID';
  end if;
  if p_idle_cutoff_at is null or p_idle_cutoff_at >= v_now then
    raise exception 'CARE_CONTEXT_IDLE_CUTOFF_INVALID';
  end if;

  insert into identity.channel_identities (
    channel, account_scope_hash, external_subject_hash, state, last_seen_at
  )
  values (
    p_channel, p_account_scope_hash, p_external_subject_hash, 'active', v_now
  )
  on conflict (channel, account_scope_hash, external_subject_hash)
  do update set last_seen_at = excluded.last_seen_at
  returning id into v_identity_id;

  perform pg_advisory_xact_lock(hashtextextended(v_identity_id::text, 0));

  select c.id
    into v_conversation_id
  from care.conversations c
  where c.channel_identity_id = v_identity_id
    and c.state = 'active'
  order by c.last_activity_at desc
  limit 1
  for update;

  if v_conversation_id is not null then
    if exists (
      select 1 from care.conversations c
      where c.id = v_conversation_id
        and c.last_activity_at < p_idle_cutoff_at
    ) then
      update care.conversations
      set state = 'expired', ended_at = v_now
      where id = v_conversation_id;
      v_conversation_id := null;
    end if;
  end if;

  if v_conversation_id is null then
    insert into care.conversations (
      channel_identity_id, channel, state, context_policy_version, started_at, last_activity_at
    )
    values (
      v_identity_id, p_channel, 'active', p_context_policy_version, v_now, v_now
    )
    returning id into v_conversation_id;
  else
    update care.conversations
    set last_activity_at = v_now,
        context_policy_version = p_context_policy_version
    where id = v_conversation_id;
  end if;

  insert into care.conversation_messages (
    conversation_id,
    direction,
    external_message_hash,
    content_server_only,
    expires_at
  )
  values (
    v_conversation_id,
    p_direction,
    p_external_message_hash,
    p_content,
    p_expires_at
  )
  on conflict (conversation_id, direction, external_message_hash)
  do nothing;

  return v_conversation_id;
end;
$$;

revoke all on function care.care_context_append_turn(
  text, text, text, text, text, text, timestamptz, text, timestamptz
) from public, anon, authenticated;
grant execute on function care.care_context_append_turn(
  text, text, text, text, text, text, timestamptz, text, timestamptz
) to service_role;

create or replace function care.care_context_load_recent(
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
set search_path = pg_catalog, identity, care
stable
as $$
  select q.direction, q.content_server_only, q.created_at
  from (
    select
      m.direction,
      m.content_server_only,
      m.created_at,
      m.turn_sequence
    from identity.channel_identities ci
    join care.conversations c
      on c.channel_identity_id = ci.id
     and c.state = 'active'
    join care.conversation_messages m
      on m.conversation_id = c.id
    where ci.channel = p_channel
      and ci.account_scope_hash = p_account_scope_hash
      and ci.external_subject_hash = p_external_subject_hash
      and ci.state = 'active'
      and m.deletion_state = 'active'
      and m.expires_at > p_now
      and p_max_messages between 1 and 32
    order by m.created_at desc, m.turn_sequence desc
    limit least(greatest(p_max_messages, 1), 32)
  ) q
  order by q.created_at asc, q.turn_sequence asc;
$$;

revoke all on function care.care_context_load_recent(
  text, text, text, timestamptz, integer
) from public, anon, authenticated;
grant execute on function care.care_context_load_recent(
  text, text, text, timestamptz, integer
) to service_role;

create or replace function care.care_context_purge_expired(
  p_now timestamptz
)
returns integer
language plpgsql
security definer
set search_path = pg_catalog, care
as $$
declare
  v_count integer;
begin
  update care.conversation_messages
  set content_server_only = '[PURGED]',
      deletion_state = 'expired_purged'
  where deletion_state = 'active'
    and expires_at <= p_now;

  get diagnostics v_count = row_count;
  return v_count;
end;
$$;

revoke all on function care.care_context_purge_expired(timestamptz)
  from public, anon, authenticated;
grant execute on function care.care_context_purge_expired(timestamptz)
  to service_role;
