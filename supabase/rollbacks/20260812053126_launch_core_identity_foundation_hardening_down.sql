-- Manual rollback for the WO-LAUNCH-CORE-01 hardening fixes only.
-- Safe only before a later migration depends on these changes. Restores the
-- exact state produced by 20260812044335_launch_core_identity_foundation.
-- Does not drop the identity schema and does not touch knowledge/public.

drop index if exists identity.consent_records_subject_idx;

alter table identity.consent_records
  drop column if exists subject_person_id;

drop index if exists identity.person_relationships_one_active_per_triple_idx;
alter table identity.person_relationships
  add constraint person_relationships_from_person_id_to_person_id_relationsh_key
  unique (from_person_id, to_person_id, relationship_kind);

drop trigger if exists persons_audit on identity.persons;

grant delete on identity.persons, identity.account_links,
  identity.customer_relationships, identity.person_relationships,
  identity.consent_records
  to service_role;

alter table identity.account_links
  drop constraint account_links_auth_user_id_fkey;
alter table identity.account_links
  add constraint account_links_auth_user_id_fkey
  foreign key (auth_user_id) references auth.users(id) on delete cascade;
