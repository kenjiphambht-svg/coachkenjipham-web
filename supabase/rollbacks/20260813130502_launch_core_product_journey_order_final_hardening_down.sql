-- Manual rollback for the WO-LAUNCH-CORE-02 final hardening (closed_at seal) only.
-- Safe only before a later migration depends on this behavior. Restores the
-- exact guard body produced by
-- 20260813123721_launch_core_product_journey_order_hardening (i.e. removes
-- only the closed_at-after-closure check; every other rule is unchanged).
-- Does not touch the trigger, the table, the schema, or identity/knowledge.

create or replace function commerce.reject_journey_anchor_rewrite()
returns trigger
language plpgsql
set search_path = pg_catalog, commerce
as $$
begin
  if NEW.person_id is distinct from OLD.person_id then
    raise exception 'JOURNEY_ANCHOR_PERSON_IMMUTABLE';
  end if;
  if NEW.product_id is distinct from OLD.product_id then
    raise exception 'JOURNEY_ANCHOR_PRODUCT_IMMUTABLE';
  end if;
  if NEW.opened_at is distinct from OLD.opened_at then
    raise exception 'JOURNEY_ANCHOR_OPENED_AT_IMMUTABLE';
  end if;
  if OLD.status = 'closed' and NEW.status = 'open' then
    raise exception 'JOURNEY_ANCHOR_CANNOT_REOPEN';
  end if;
  if OLD.product_version_id is not null
     and NEW.product_version_id is distinct from OLD.product_version_id then
    raise exception 'JOURNEY_ANCHOR_VERSION_PIN_IMMUTABLE';
  end if;
  if OLD.product_version_id is null
     and NEW.product_version_id is not null
     and OLD.status <> 'open' then
    raise exception 'JOURNEY_ANCHOR_VERSION_PIN_REQUIRES_OPEN';
  end if;
  return NEW;
end;
$$;

revoke all on function commerce.reject_journey_anchor_rewrite() from public, anon, authenticated;
