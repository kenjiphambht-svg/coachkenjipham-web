-- Rollback companion for 20260823233400_p07_advisory_ops_evidence_a2.sql
-- Fail closed if A2 actor/target evidence has been adopted. Once such evidence
-- exists, use a separately reviewed forward-recovery plan instead of dropping it.

do $$
begin
  if to_regclass('crm.advisory_lifecycle_events') is not null
     and exists (
       select 1
       from crm.advisory_lifecycle_events
       where actor_reference is not null or target_reference is not null
       limit 1
     ) then
    raise exception 'ADVISORY_A2_ROLLBACK_ADOPTED_EVIDENCE_FORWARD_RECOVERY_REQUIRED';
  end if;
end;
$$;

drop function if exists public.advisory_intake_list_pending(integer);
drop function if exists public.advisory_intake_append_lifecycle(uuid, text, text, text, text, text);

alter table crm.advisory_lifecycle_events
  drop constraint if exists advisory_lifecycle_handed_off_target_required,
  drop constraint if exists advisory_lifecycle_human_actor_required,
  drop constraint if exists advisory_lifecycle_target_bounded,
  drop constraint if exists advisory_lifecycle_actor_bounded,
  drop column if exists target_reference,
  drop column if exists actor_reference;

create function public.advisory_intake_append_lifecycle(
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

revoke all on function public.advisory_intake_append_lifecycle(uuid, text, text, text)
  from public, anon, authenticated;
grant execute on function public.advisory_intake_append_lifecycle(uuid, text, text, text)
  to service_role;
