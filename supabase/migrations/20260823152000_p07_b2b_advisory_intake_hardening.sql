-- 20260823152000 · Independent P07 hardening for Advisory intake foundation.
-- Keeps the approved contract unchanged: explicit NULL rejection and immutable
-- stable lead identity before any staging/Production application exists.

create trigger advisory_leads_block_update
  before update on crm.advisory_leads
  for each row execute function crm.reject_advisory_immutable_mutation();
create trigger advisory_leads_block_delete
  before delete on crm.advisory_leads
  for each row execute function crm.reject_advisory_immutable_mutation();

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
  if p_contact_name is null or char_length(v_name) not between 1 and 200 then
    raise exception 'ADVISORY_CONTACT_NAME_INVALID';
  end if;
  if p_contact_email is null
     or char_length(v_email) not between 3 and 320
     or v_email !~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$' then
    raise exception 'ADVISORY_CONTACT_EMAIL_INVALID';
  end if;
  if p_role_org_context is null
     or p_business_problem is null
     or p_ai_current_state is null
     or p_why_now is null
     or char_length(v_role_org) not between 1 and 12000
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
  if p_intake_event_id is null then
    raise exception 'ADVISORY_INTAKE_REQUIRED';
  end if;
  if not exists (
    select 1 from crm.advisory_intake_events where id = p_intake_event_id
  ) then
    raise exception 'ADVISORY_INTAKE_NOT_FOUND';
  end if;
  if p_event_type is null or p_event_type not in (
    'RECEIVED', 'CRM_WRITTEN', 'ACK_PENDING', 'ACK_SENT', 'ACK_ERROR',
    'REVIEWED', 'QUALIFIED', 'HANDOFF_READY', 'HANDOFF_ERROR', 'HANDED_OFF',
    'FOLLOWUP_SUPPRESSED'
  ) then
    raise exception 'ADVISORY_LIFECYCLE_EVENT_INVALID';
  end if;
  if p_correlation_reference is null
     or char_length(btrim(p_correlation_reference)) not between 1 and 300 then
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
