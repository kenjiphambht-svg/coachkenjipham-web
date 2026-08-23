-- 20260823151200 · WO-P07-B2B-INTAKE-IMPLEMENTATION-01
-- Founder-approved Option A: bounded additive CRM/advisory intake substrate.
-- BUILD/SYNTHETIC-STAGING scope only. This migration does not activate a
-- provider, Production data, payment/booking, public offer changes, or any
-- automatic commercial/care authority.

create schema if not exists crm;
revoke all on schema crm from public;
grant usage on schema crm to service_role;

create table crm.advisory_leads (
  id uuid primary key default gen_random_uuid(),
  contact_email_normalized text not null,
  initial_contact_name text not null,
  created_at timestamptz not null default now(),
  constraint advisory_leads_email_normalized
    check (
      contact_email_normalized = lower(btrim(contact_email_normalized))
      and char_length(contact_email_normalized) between 3 and 320
      and contact_email_normalized ~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'
    ),
  constraint advisory_leads_name_bounded
    check (char_length(btrim(initial_contact_name)) between 1 and 200),
  constraint advisory_leads_email_unique unique (contact_email_normalized)
);

comment on table crm.advisory_leads is
  'Stable Advisory lead identity keyed only by trim+lowercase email. Initial name is provenance from first accepted intake; later intake history is stored on immutable events and is never overwritten here.';

create table crm.advisory_intake_events (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references crm.advisory_leads(id) on delete restrict,
  submission_id uuid not null,
  source_route text not null default '/advisory',
  role_org_context text not null,
  business_problem text not null,
  ai_current_state text not null,
  why_now text not null,
  contact_name text not null,
  contact_email_normalized text not null,
  received_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  constraint advisory_intake_submission_unique unique (submission_id),
  constraint advisory_intake_source_route check (source_route = '/advisory'),
  constraint advisory_intake_name_bounded
    check (char_length(btrim(contact_name)) between 1 and 200),
  constraint advisory_intake_email_normalized
    check (
      contact_email_normalized = lower(btrim(contact_email_normalized))
      and char_length(contact_email_normalized) between 3 and 320
      and contact_email_normalized ~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'
    ),
  constraint advisory_intake_role_org_bounded
    check (char_length(btrim(role_org_context)) between 1 and 12000),
  constraint advisory_intake_problem_bounded
    check (char_length(btrim(business_problem)) between 1 and 12000),
  constraint advisory_intake_ai_state_bounded
    check (char_length(btrim(ai_current_state)) between 1 and 12000),
  constraint advisory_intake_why_now_bounded
    check (char_length(btrim(why_now)) between 1 and 12000)
);

create index advisory_intake_events_lead_received_idx
  on crm.advisory_intake_events (lead_id, received_at desc);

comment on table crm.advisory_intake_events is
  'Immutable Advisory intake history. Same normalized email may have multiple materially distinct intake events; submission_id is the technical idempotency identity. No raw IP, user-agent, device fingerprint, payment data, phone, budget, or company-size field is stored.';

create table crm.advisory_lifecycle_events (
  id uuid primary key default gen_random_uuid(),
  intake_event_id uuid not null references crm.advisory_intake_events(id) on delete restrict,
  event_type text not null,
  correlation_reference text not null,
  event_code text,
  occurred_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  constraint advisory_lifecycle_event_type
    check (event_type in (
      'RECEIVED',
      'CRM_WRITTEN',
      'ACK_PENDING',
      'ACK_SENT',
      'ACK_ERROR',
      'REVIEWED',
      'QUALIFIED',
      'HANDOFF_READY',
      'HANDOFF_ERROR',
      'HANDED_OFF',
      'FOLLOWUP_SUPPRESSED'
    )),
  constraint advisory_lifecycle_correlation_bounded
    check (char_length(btrim(correlation_reference)) between 1 and 300),
  constraint advisory_lifecycle_code_bounded
    check (event_code is null or char_length(event_code) between 1 and 120),
  constraint advisory_lifecycle_correlation_unique unique (correlation_reference)
);

create index advisory_lifecycle_events_intake_time_idx
  on crm.advisory_lifecycle_events (intake_event_id, occurred_at, id);

comment on table crm.advisory_lifecycle_events is
  'Append-only technical evidence for Advisory intake/CRM/acknowledgement/review/qualification/handoff outcomes. Event creation itself grants no commercial, care, booking, payment, or delivery authority.';

create or replace function crm.reject_advisory_immutable_mutation()
returns trigger
language plpgsql
set search_path = pg_catalog, crm
as $$
begin
  raise exception 'ADVISORY_IMMUTABLE_RECORD';
end;
$$;

create trigger advisory_intake_events_block_update
  before update on crm.advisory_intake_events
  for each row execute function crm.reject_advisory_immutable_mutation();
create trigger advisory_intake_events_block_delete
  before delete on crm.advisory_intake_events
  for each row execute function crm.reject_advisory_immutable_mutation();
create trigger advisory_lifecycle_events_block_update
  before update on crm.advisory_lifecycle_events
  for each row execute function crm.reject_advisory_immutable_mutation();
create trigger advisory_lifecycle_events_block_delete
  before delete on crm.advisory_lifecycle_events
  for each row execute function crm.reject_advisory_immutable_mutation();

alter table crm.advisory_leads enable row level security;
alter table crm.advisory_intake_events enable row level security;
alter table crm.advisory_lifecycle_events enable row level security;

revoke all on crm.advisory_leads from public, anon, authenticated;
revoke all on crm.advisory_intake_events from public, anon, authenticated;
revoke all on crm.advisory_lifecycle_events from public, anon, authenticated;

grant select on crm.advisory_leads to service_role;
grant select on crm.advisory_intake_events to service_role;
grant select on crm.advisory_lifecycle_events to service_role;

create or replace function public.advisory_intake_register(
  p_submission_id uuid,
  p_role_org_context text,
  p_business_problem text,
  p_ai_current_state text,
  p_why_now text,
  p_contact_name text,
  p_contact_email text
)
returns table (
  lead_id uuid,
  intake_event_id uuid,
  submission_id uuid,
  replayed boolean,
  received_at timestamptz
)
language plpgsql
security definer
set search_path = pg_catalog, public, crm
as $$
declare
  v_email text := lower(btrim(p_contact_email));
  v_name text := btrim(p_contact_name);
  v_role_org text := btrim(p_role_org_context);
  v_problem text := btrim(p_business_problem);
  v_ai_state text := btrim(p_ai_current_state);
  v_why_now text := btrim(p_why_now);
  v_lead_id uuid;
  v_intake_id uuid;
  v_received_at timestamptz;
  v_existing crm.advisory_intake_events%rowtype;
begin
  if p_submission_id is null then
    raise exception 'ADVISORY_SUBMISSION_ID_REQUIRED';
  end if;
  if char_length(v_name) not between 1 and 200 then
    raise exception 'ADVISORY_CONTACT_NAME_INVALID';
  end if;
  if char_length(v_email) not between 3 and 320
     or v_email !~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$' then
    raise exception 'ADVISORY_CONTACT_EMAIL_INVALID';
  end if;
  if char_length(v_role_org) not between 1 and 12000
     or char_length(v_problem) not between 1 and 12000
     or char_length(v_ai_state) not between 1 and 12000
     or char_length(v_why_now) not between 1 and 12000 then
    raise exception 'ADVISORY_CONTEXT_INVALID';
  end if;

  select e.* into v_existing
  from crm.advisory_intake_events e
  where e.submission_id = p_submission_id;

  if found then
    if v_existing.role_org_context is distinct from v_role_org
       or v_existing.business_problem is distinct from v_problem
       or v_existing.ai_current_state is distinct from v_ai_state
       or v_existing.why_now is distinct from v_why_now
       or v_existing.contact_name is distinct from v_name
       or v_existing.contact_email_normalized is distinct from v_email then
      raise exception 'ADVISORY_SUBMISSION_CONFLICT';
    end if;

    return query
      select v_existing.lead_id, v_existing.id, v_existing.submission_id, true, v_existing.received_at;
    return;
  end if;

  insert into crm.advisory_leads (contact_email_normalized, initial_contact_name)
  values (v_email, v_name)
  on conflict (contact_email_normalized) do nothing;

  select l.id into v_lead_id
  from crm.advisory_leads l
  where l.contact_email_normalized = v_email;

  if v_lead_id is null then
    raise exception 'ADVISORY_LEAD_RESOLUTION_FAILED';
  end if;

  insert into crm.advisory_intake_events (
    lead_id,
    submission_id,
    role_org_context,
    business_problem,
    ai_current_state,
    why_now,
    contact_name,
    contact_email_normalized
  ) values (
    v_lead_id,
    p_submission_id,
    v_role_org,
    v_problem,
    v_ai_state,
    v_why_now,
    v_name,
    v_email
  )
  on conflict (submission_id) do nothing
  returning id, received_at into v_intake_id, v_received_at;

  if v_intake_id is null then
    select e.* into v_existing
    from crm.advisory_intake_events e
    where e.submission_id = p_submission_id;

    if not found then
      raise exception 'ADVISORY_SUBMISSION_RESOLUTION_FAILED';
    end if;
    if v_existing.role_org_context is distinct from v_role_org
       or v_existing.business_problem is distinct from v_problem
       or v_existing.ai_current_state is distinct from v_ai_state
       or v_existing.why_now is distinct from v_why_now
       or v_existing.contact_name is distinct from v_name
       or v_existing.contact_email_normalized is distinct from v_email then
      raise exception 'ADVISORY_SUBMISSION_CONFLICT';
    end if;

    return query
      select v_existing.lead_id, v_existing.id, v_existing.submission_id, true, v_existing.received_at;
    return;
  end if;

  insert into crm.advisory_lifecycle_events (
    intake_event_id, event_type, correlation_reference
  ) values
    (v_intake_id, 'RECEIVED', 'submission:' || p_submission_id::text || ':received'),
    (v_intake_id, 'CRM_WRITTEN', 'submission:' || p_submission_id::text || ':crm_written'),
    (v_intake_id, 'ACK_PENDING', 'submission:' || p_submission_id::text || ':ack_pending');

  return query
    select v_lead_id, v_intake_id, p_submission_id, false, v_received_at;
end;
$$;

comment on function public.advisory_intake_register(uuid, text, text, text, text, text, text) is
  'Server-only atomic Advisory intake registration. Same submission+same payload replays existing canonical evidence; same submission+different material fails closed. Same normalized email with new submission creates a new immutable intake on the same lead.';

revoke all on function public.advisory_intake_register(uuid, text, text, text, text, text, text) from public, anon, authenticated;
grant execute on function public.advisory_intake_register(uuid, text, text, text, text, text, text) to service_role;

create or replace function public.advisory_intake_append_lifecycle(
  p_intake_event_id uuid,
  p_event_type text,
  p_correlation_reference text,
  p_event_code text default null
)
returns table (
  lifecycle_event_id uuid,
  replayed boolean
)
language plpgsql
security definer
set search_path = pg_catalog, public, crm
as $$
declare
  v_existing crm.advisory_lifecycle_events%rowtype;
  v_id uuid;
begin
  if not exists (
    select 1 from crm.advisory_intake_events where id = p_intake_event_id
  ) then
    raise exception 'ADVISORY_INTAKE_NOT_FOUND';
  end if;
  if p_event_type not in (
    'RECEIVED', 'CRM_WRITTEN', 'ACK_PENDING', 'ACK_SENT', 'ACK_ERROR',
    'REVIEWED', 'QUALIFIED', 'HANDOFF_READY', 'HANDOFF_ERROR', 'HANDED_OFF',
    'FOLLOWUP_SUPPRESSED'
  ) then
    raise exception 'ADVISORY_LIFECYCLE_EVENT_INVALID';
  end if;
  if char_length(btrim(p_correlation_reference)) not between 1 and 300 then
    raise exception 'ADVISORY_LIFECYCLE_CORRELATION_INVALID';
  end if;
  if p_event_code is not null and char_length(p_event_code) not between 1 and 120 then
    raise exception 'ADVISORY_LIFECYCLE_CODE_INVALID';
  end if;

  select e.* into v_existing
  from crm.advisory_lifecycle_events e
  where e.correlation_reference = btrim(p_correlation_reference);

  if found then
    if v_existing.intake_event_id is distinct from p_intake_event_id
       or v_existing.event_type is distinct from p_event_type
       or v_existing.event_code is distinct from p_event_code then
      raise exception 'ADVISORY_LIFECYCLE_CORRELATION_CONFLICT';
    end if;
    return query select v_existing.id, true;
    return;
  end if;

  insert into crm.advisory_lifecycle_events (
    intake_event_id, event_type, correlation_reference, event_code
  ) values (
    p_intake_event_id, p_event_type, btrim(p_correlation_reference), p_event_code
  )
  on conflict (correlation_reference) do nothing
  returning id into v_id;

  if v_id is null then
    select e.* into v_existing
    from crm.advisory_lifecycle_events e
    where e.correlation_reference = btrim(p_correlation_reference);
    if not found
       or v_existing.intake_event_id is distinct from p_intake_event_id
       or v_existing.event_type is distinct from p_event_type
       or v_existing.event_code is distinct from p_event_code then
      raise exception 'ADVISORY_LIFECYCLE_CORRELATION_CONFLICT';
    end if;
    return query select v_existing.id, true;
    return;
  end if;

  return query select v_id, false;
end;
$$;

comment on function public.advisory_intake_append_lifecycle(uuid, text, text, text) is
  'Server-only append interface for P09-owned lifecycle outcomes. It records evidence only and does not independently decide care, commercial, booking, payment, or handoff truth.';

revoke all on function public.advisory_intake_append_lifecycle(uuid, text, text, text) from public, anon, authenticated;
grant execute on function public.advisory_intake_append_lifecycle(uuid, text, text, text) to service_role;
