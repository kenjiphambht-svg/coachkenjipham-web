-- 20260812053126 · WO-LAUNCH-CORE-01 hardening: first architecture/security review fixes.
-- Corrective, additive-only migration over 20260812044335_launch_core_identity_foundation.
-- Does not reset or drop the identity schema; patches the already-applied tables in place.
-- Does not touch knowledge, public, or auth schemas beyond the FK reference already in use.

-- (2) account_links.auth_user_id: history-preserving, fail-closed FK.
-- ON DELETE CASCADE silently destroyed link history (and its audit trail) the
-- moment an auth.users row was removed. ON DELETE RESTRICT instead blocks the
-- auth user deletion outright while any link row (including revoked ones)
-- still references it — history is never silently lost.
alter table identity.account_links
  drop constraint account_links_auth_user_id_fkey;
alter table identity.account_links
  add constraint account_links_auth_user_id_fkey
  foreign key (auth_user_id) references auth.users(id) on delete restrict;

-- (3) Remove ordinary service_role DELETE on every identity history table.
-- Hard deletion/privacy workflow is explicit out-of-scope for this WO and must
-- stay closed until a dedicated, audited deletion workflow exists.
revoke delete on identity.persons, identity.account_links,
  identity.customer_relationships, identity.person_relationships,
  identity.consent_records
  from service_role;

-- (4) Person mutations were not audited. Add the same audit trigger already
-- used by the other four sensitive tables. With DELETE revoked above, insert
-- and update are the only remaining service_role paths on identity.persons,
-- and both are now covered.
create trigger persons_audit
  after insert or update on identity.persons
  for each row execute function identity.log_audit_event();

-- (5) person_relationships uniqueness was permanent, so an ended relationship
-- could never be re-established as a new historical record. Replace the
-- table-level unique constraint with an active-only partial unique index,
-- matching the account_links/customer_relationships pattern.
alter table identity.person_relationships
  drop constraint person_relationships_from_person_id_to_person_id_relationsh_key;
create unique index person_relationships_one_active_per_triple_idx
  on identity.person_relationships(from_person_id, to_person_id, relationship_kind)
  where status = 'active';

-- (6) consent_records can now canonically identify the subject the consent is
-- about (e.g. a guardian consenting on behalf of a child/subject Person) via a
-- typed FK to identity.persons, instead of only a free-text scope_reference.
-- No product-specific consent wording or business fields are added: this is a
-- structural reference column only, nullable because not every consent scope
-- has a subject distinct from the person giving consent.
alter table identity.consent_records
  add column subject_person_id uuid references identity.persons(id) on delete restrict;

comment on column identity.consent_records.subject_person_id is
  'Optional canonical reference to the Person this consent is about (e.g. the subject a guardian consents for). Null when the consent has no subject distinct from person_id.';

create index consent_records_subject_idx on identity.consent_records(subject_person_id);
