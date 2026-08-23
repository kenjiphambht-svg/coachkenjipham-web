-- 20260823152500 · Independent runtime hardening.
-- PL/pgSQL RETURNS TABLE exposes output variables named `submission_id` and
-- `received_at`; qualify INSERT conflict/RETURNING targets so runtime column
-- resolution cannot collide with those output variables.

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

  insert into crm.advisory_intake_events as intake (
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
  on conflict on constraint advisory_intake_submission_unique do nothing
  returning intake.id, intake.received_at into v_intake_id, v_received_at;

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
