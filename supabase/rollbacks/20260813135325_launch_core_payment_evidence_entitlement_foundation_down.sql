-- Manual rollback for 20260813135325 · WO-LAUNCH-CORE-03 Payment Evidence +
-- Entitlement Foundation.
-- Safe only while no later migration depends on the entitlement schema.
-- Restores commerce.product_summary to its exact pre-WO-03 (WO-02)
-- definition FIRST, so the view never references the entitlement schema
-- once it is dropped, then drops the entitlement schema and everything in
-- it. Does not touch identity or knowledge.

create or replace view commerce.product_summary as
select
  p.id as product_id,
  p.product_key,
  p.display_name,
  count(distinct o.id) as order_count,
  count(distinct pja.id) as journey_count,
  count(distinct pja.id) filter (where pja.status = 'open') as open_journey_count
from commerce.products p
left join commerce.orders o on o.product_id = p.id
left join commerce.product_journey_anchors pja on pja.product_id = p.id
group by p.id, p.product_key, p.display_name;

comment on view commerce.product_summary is
  'Backend read model for the future Founder Product & Services View: identity/name, order_count, journey_count, open_journey_count only. Deliberately excludes paid_count/revenue/profit, which require Payment Evidence from WO-03. service_role only; not exposed to any browser role.';

revoke all on commerce.product_summary from public, anon, authenticated;
grant select on commerce.product_summary to service_role;

revoke all on schema entitlement from service_role;
drop schema if exists entitlement cascade;
