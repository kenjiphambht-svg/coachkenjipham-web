-- 20260823233400 · Founder-approved Option A2
-- Narrow Advisory operator/evidence delta only.
-- CODE/SYNTHETIC scope: no Production apply/write, provider/email activation,
-- real customer data, public-form change, merge/deploy/release, or new care authority.

alter table crm.advisory_lifecycle_events
  add column actor_reference text,
  add column target_reference text;

alter table crm.advisory_lifecycle_events
  add constraint advisory_lifecycle_actor_bounded
    check (
      actor_reference is null
      or char_length(btrim(actor_reference)) between 1 and 200
    ),
  add constraint advisory_lifecycle_target_bounded
    check (
      target_reference is null
      or char_length(btrim(target_reference)) between 1 and 300
    ),
  add constraint advisory_lifecycle_human_actor_required
    check (
      event_type not in (
        'ACK_SENT', 'ACK_ERROR', 'REVIEWED', 'QUALIFIED',
        'HANDOFF_READY', 'HANDOFF_ERROR', 'HANDED_OFF', 'FOLLOWUP_SUPPRESSED'
      )
      or actor_reference is not null
    ),
  add constraint advisory_lifecycle_handed_off_target_required
    check (event_type <> 'HANDED_OFF' or target_reference is not null);

comment on column crm.advisory_lifecycle_events.actor_reference is
  'Bounded internal actor reference for human/care lifecycle evidence. Not an auth token, secret, email-provider credential, or independent business authority.';
comment on column crm.advisory_lifecycle_events.target_reference is
  'Bounded handoff target reference. Required for HANDED_OFF evidence so completion cannot be asserted without an explicit destination.';

drop function if exists public.advisory_intake_append_lifecycle(uuid, text, text, text);

create function public.advisory_intake_append_lifecycle(
  p_intake_event_id uuid,
  p_event_type text,
  p_correlation_reference text,
  p_event_code text default null,
  p_actor_reference text default null,
  p_target_reference text default null
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
  v_actor text := case when p_actor_reference is null then null else btrim(p_actor_reference) end;
  v_target text := case when p_target_reference is null then null else btrim(p_target_reference) end;
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
  if v_actor is not null and char_length(v_actor) not between 1 and 200 then
    raise exception 'ADVISORY_LIFECYCLE_ACTOR_INVALID';
  end if;
  if v_target is not null and char_length(v_target) not between 1 and 300 then
    raise exception 'ADVISORY_LIFECYCLE_TARGET_INVALID';
  end if;
  if p_event_type in (
       'ACK_SENT', 'ACK_ERROR', 'REVIEWED', 'QUALIFIED',
       'HANDOFF_READY', 'HANDOFF_ERROR', 'HANDED_OFF', 'FOLLOWUP_SUPPRESSED'
     ) and v_actor is null then
    raise exception 'ADVISORY_LIFECYCLE_ACTOR_REQUIRED';
  end if;
  if p_event_type = 'HANDED_OFF' and v_target is null then
    raise exception 'ADVISORY_HANDOFF_TARGET_REQUIRED';
  end if;

  select e.* into v_existing
  from crm.advisory_lifecycle_events e
  where e.correlation_reference = btrim(p_correlation_reference);

  if found then
    if v_existing.intake_event_id is distinct from p_intake_event_id
       or v_existing.event_type is distinct from p_event_type
       or v_existing.event_code is distinct from p_event_code
       or v_existing.actor_reference is distinct from v_actor
       or v_existing.target_reference is distinct from v_target then
      raise exception 'ADVISORY_LIFECYCLE_CORRELATION_CONFLICT';
    end if;
    return query select v_existing.id, true;
    return;
  end if;

  insert into crm.advisory_lifecycle_events (
    intake_event_id,
    event_type,
    correlation_reference,
    event_code,
    actor_reference,
    target_reference
  ) values (
    p_intake_event_id,
    p_event_type,
    btrim(p_correlation_reference),
    p_event_code,
    v_actor,
    v_target
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
       or v_existing.event_code is distinct from p_event_code
       or v_existing.actor_reference is distinct from v_actor
       or v_existing.target_reference is distinct from v_target then
      raise exception 'ADVISORY_LIFECYCLE_CORRELATION_CONFLICT';
    end if;
    return query select v_existing.id, true;
    return;
  end if;

  return query select v_id, false;
end;
$$;

comment on function public.advisory_intake_append_lifecycle(uuid, text, text, text, text, text) is
  'Server-only append interface for P09-owned lifecycle outcomes. Human/care evidence requires an explicit bounded actor reference; HANDED_OFF additionally requires an explicit target reference. Evidence storage itself grants no care/commercial authority.';

revoke all on function public.advisory_intake_append_lifecycle(uuid, text, text, text, text, text)
  from public, anon, authenticated;
grant execute on function public.advisory_intake_append_lifecycle(uuid, text, text, text, text, text)
  to service_role;

create function public.advisory_intake_list_pending(p_limit integer default 50)
returns table (
  intake_event_id uuid,
  lead_id uuid,
  contact_name text,
  contact_email text,
  role_org_context text,
  business_problem text,
  ai_current_state text,
  why_now text,
  received_at timestamptz,
  latest_event_type text,
  latest_event_at timestamptz
)
language sql
stable
security definer
set search_path = pg_catalog, public, crm
as $$
  select
    i.id as intake_event_id,
    i.lead_id,
    i.contact_name,
    i.contact_email_normalized as contact_email,
    i.role_org_context,
    i.business_problem,
    i.ai_current_state,
    i.why_now,
    i.received_at,
    latest.event_type as latest_event_type,
    latest.occurred_at as latest_event_at
  from crm.advisory_intake_events i
  left join lateral (
    select e.event_type, e.occurred_at
    from crm.advisory_lifecycle_events e
    where e.intake_event_id = i.id
    order by
      e.occurred_at desc,
      case e.event_type
        when 'FOLLOWUP_SUPPRESSED' then 110
        when 'HANDED_OFF' then 100
        when 'HANDOFF_ERROR' then 90
        when 'HANDOFF_READY' then 80
        when 'QUALIFIED' then 70
        when 'REVIEWED' then 60
        when 'ACK_SENT' then 50
        when 'ACK_ERROR' then 40
        when 'ACK_PENDING' then 30
        when 'CRM_WRITTEN' then 20
        when 'RECEIVED' then 10
        else 0
      end desc,
      e.id desc
    limit 1
  ) latest on true
  where coalesce(latest.event_type, '') not in ('HANDED_OFF', 'FOLLOWUP_SUPPRESSED')
  order by i.received_at asc, i.id asc
  limit greatest(1, least(coalesce(p_limit, 50), 100));
$$;

comment on function public.advisory_intake_list_pending(integer) is
  'Service-role-only minimum pending Advisory intake read model for manual-first P09 operations. Equal occurred_at timestamps are tie-broken deterministically using the existing lifecycle vocabulary only; this read ordering creates no new care authority. Returns only the locked contact/context fields plus bounded lifecycle state; no secrets, raw request metadata, provider credentials, or hidden scoring.';

revoke all on function public.advisory_intake_list_pending(integer)
  from public, anon, authenticated;
grant execute on function public.advisory_intake_list_pending(integer)
  to service_role;
