-- Rollback for 20260817021500_p11_hm_private_access_foundation.sql
--
-- Safe only before any synthetic/staging evidence has been recorded.
-- Once access/delivery/confirmation history exists, destructive rollback is
-- intentionally refused and recovery must be forward-only so evidence is not lost.

do $$
begin
  if to_regclass('delivery.private_artifact_access') is not null and exists (
    select 1 from delivery.private_artifact_access limit 1
  ) then
    raise exception 'P11_PRIVATE_ACCESS_FORWARD_RECOVERY_REQUIRED: private access evidence exists';
  end if;

  if to_regclass('delivery.private_access_events') is not null and exists (
    select 1 from delivery.private_access_events limit 1
  ) then
    raise exception 'P11_PRIVATE_ACCESS_FORWARD_RECOVERY_REQUIRED: access event evidence exists';
  end if;

  if to_regclass('delivery.delivery_succeeded_events') is not null and exists (
    select 1 from delivery.delivery_succeeded_events limit 1
  ) then
    raise exception 'P11_PRIVATE_ACCESS_FORWARD_RECOVERY_REQUIRED: delivery evidence exists';
  end if;

  if to_regclass('delivery.customer_confirmed_events') is not null and exists (
    select 1 from delivery.customer_confirmed_events limit 1
  ) then
    raise exception 'P11_PRIVATE_ACCESS_FORWARD_RECOVERY_REQUIRED: confirmation evidence exists';
  end if;
end;
$$;

drop schema if exists delivery cascade;
