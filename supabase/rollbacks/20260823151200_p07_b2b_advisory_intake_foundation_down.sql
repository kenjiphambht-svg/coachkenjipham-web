-- Rollback companion for 20260823151200_p07_b2b_advisory_intake_foundation.sql
-- Destructive rollback is allowed only while the new substrate is empty.
-- Once canonical evidence exists, use a separately reviewed forward-recovery plan.

do $$
begin
  if to_regclass('crm.advisory_lifecycle_events') is not null
     and exists (select 1 from crm.advisory_lifecycle_events limit 1) then
    raise exception 'ADVISORY_ROLLBACK_NONEMPTY_FORWARD_RECOVERY_REQUIRED';
  end if;
  if to_regclass('crm.advisory_intake_events') is not null
     and exists (select 1 from crm.advisory_intake_events limit 1) then
    raise exception 'ADVISORY_ROLLBACK_NONEMPTY_FORWARD_RECOVERY_REQUIRED';
  end if;
  if to_regclass('crm.advisory_leads') is not null
     and exists (select 1 from crm.advisory_leads limit 1) then
    raise exception 'ADVISORY_ROLLBACK_NONEMPTY_FORWARD_RECOVERY_REQUIRED';
  end if;
end;
$$;

drop function if exists public.advisory_intake_append_lifecycle(uuid, text, text, text);
drop function if exists public.advisory_intake_register(uuid, text, text, text, text, text, text);
drop table if exists crm.advisory_lifecycle_events;
drop table if exists crm.advisory_intake_events;
drop table if exists crm.advisory_leads;
drop function if exists crm.reject_advisory_immutable_mutation();
drop schema if exists crm;
