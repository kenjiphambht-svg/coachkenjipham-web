-- 20260813123721 · WO-LAUNCH-CORE-02 hardening: second-round P07 review fixes.
-- Corrective, additive-only migration over
-- 20260813120549_launch_core_product_journey_order_foundation. Does not
-- reset or drop the commerce schema; patches the already-applied tables in
-- place. No redesign, no new product/business scope — exactly the three
-- blocking items from review.

-- =========================================================================
-- 1) STABLE PRODUCT IDENTITY
-- product_key must be immutable after Product creation. display_name stays
-- editable. Fail-closed guard via trigger (defense in depth alongside the
-- existing table-level grants).
-- =========================================================================

create or replace function commerce.reject_product_key_change()
returns trigger
language plpgsql
set search_path = pg_catalog, commerce
as $$
begin
  if NEW.product_key is distinct from OLD.product_key then
    raise exception 'PRODUCT_KEY_IMMUTABLE';
  end if;
  return NEW;
end;
$$;

revoke all on function commerce.reject_product_key_change() from public, anon, authenticated;

create trigger products_block_key_change
  before update on commerce.products
  for each row execute function commerce.reject_product_key_change();

-- =========================================================================
-- 2) JOURNEY HISTORY MUST NOT BE REWRITTEN
-- After creation: person_id, product_id, opened_at never change; a closed
-- journey never reopens; an already-pinned product_version_id never
-- repoints or clears. NULL -> a valid version is allowed exactly once,
-- only while the journey was still open before that update.
-- =========================================================================

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

create trigger product_journey_anchors_block_rewrite
  before update on commerce.product_journey_anchors
  for each row execute function commerce.reject_journey_anchor_rewrite();

-- =========================================================================
-- 3) EVERY COMMITTED ORDER MUST HAVE EXACTLY ONE SNAPSHOT
-- UNIQUE(order_id) on order_snapshots already proves "at most one". A
-- deferrable constraint trigger, checked at transaction end, proves "at
-- least one": an Order and its Snapshot may be inserted as two statements
-- in the same transaction, but COMMIT fails if the Order still has no
-- Snapshot when constraints are checked.
-- =========================================================================

create or replace function commerce.enforce_order_has_snapshot()
returns trigger
language plpgsql
set search_path = pg_catalog, commerce
as $$
begin
  if not exists (
    select 1 from commerce.order_snapshots where order_id = NEW.id
  ) then
    raise exception 'ORDER_SNAPSHOT_REQUIRED: order % has no snapshot at commit', NEW.id;
  end if;
  return NEW;
end;
$$;

revoke all on function commerce.enforce_order_has_snapshot() from public, anon, authenticated;

create constraint trigger orders_require_snapshot
  after insert on commerce.orders
  deferrable initially deferred
  for each row execute function commerce.enforce_order_has_snapshot();
