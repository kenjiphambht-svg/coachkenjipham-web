-- 20260813130502 · WO-LAUNCH-CORE-02 final hardening: closed_at seal.
-- Corrective, additive-only migration over
-- 20260813123721_launch_core_product_journey_order_hardening. Does not
-- reset or drop the commerce schema; does not edit either previously
-- applied migration file. Replaces only the body of
-- commerce.reject_journey_anchor_rewrite() — the existing trigger already
-- points at this function name, so no trigger drop/recreate is needed.
--
-- Single remaining history-preservation gap: after a Journey is CLOSED,
-- closed_at could still be rewritten to a different timestamp or cleared
-- to NULL. A closed Journey is a sealed historical page — the system must
-- not reopen it (already enforced) and must not rewrite when it was sealed
-- (this migration). The OPEN -> CLOSED transition itself is unaffected and
-- may still set closed_at exactly once.

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
  if OLD.status = 'closed' and NEW.closed_at is distinct from OLD.closed_at then
    raise exception 'JOURNEY_ANCHOR_CLOSED_AT_IMMUTABLE';
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
