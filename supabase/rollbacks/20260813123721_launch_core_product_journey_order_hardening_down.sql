-- Manual rollback for the WO-LAUNCH-CORE-02 second hardening round only.
-- Safe only before a later migration depends on these guards. Restores the
-- exact state produced by 20260813120549_launch_core_product_journey_order_foundation.
-- Does not drop the commerce schema and does not touch identity/knowledge.

drop trigger if exists orders_require_snapshot on commerce.orders;
drop function if exists commerce.enforce_order_has_snapshot();

drop trigger if exists product_journey_anchors_block_rewrite on commerce.product_journey_anchors;
drop function if exists commerce.reject_journey_anchor_rewrite();

drop trigger if exists products_block_key_change on commerce.products;
drop function if exists commerce.reject_product_key_change();
