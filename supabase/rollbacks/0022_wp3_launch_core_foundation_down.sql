-- Manual, staging-only rollback for 0022. Never run automatically.
-- Run only against an empty WP3 foundation after disabling its routes; otherwise
-- restore the verified pre-migration snapshot or apply a reviewed forward repair.
drop table if exists support_requests;
drop table if exists payment_confirmations;
drop table if exists lang_payment_evidence;
drop table if exists entitlement_status_history;
drop table if exists product_entitlements;
drop table if exists revision_requests;
drop table if exists publication_reviews;
drop table if exists publication_versions;
drop table if exists customer_identity_links;
drop table if exists customer_identities;
drop table if exists release_flags;
