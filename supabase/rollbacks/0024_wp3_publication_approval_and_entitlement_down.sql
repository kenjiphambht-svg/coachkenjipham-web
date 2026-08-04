-- Manual rollback for 0024 only. Do not run automatically.
-- If a publication approval, entitlement or revocation exists, preserve its
-- audit/accounting record and use a reviewed forward repair or a verified
-- staging restore instead of this script.

drop function if exists grant_hatmam_approved_entitlement(uuid, uuid, text, uuid, timestamptz);
drop function if exists review_hatmam_publication_version(uuid, text, text, text, uuid, text);
drop function if exists create_hatmam_publication_version(uuid, text, text);
drop trigger if exists publication_versions_approved_immutable on publication_versions;
drop function if exists app_private.guard_approved_publication_version();
