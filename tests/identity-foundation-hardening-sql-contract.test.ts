import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const sql = readFileSync(
  resolve(process.cwd(), 'supabase/migrations/20260812053126_launch_core_identity_foundation_hardening.sql'),
  'utf8'
);
const rollback = readFileSync(
  resolve(process.cwd(), 'supabase/rollbacks/20260812053126_launch_core_identity_foundation_hardening_down.sql'),
  'utf8'
);
const baseSql = readFileSync(
  resolve(process.cwd(), 'supabase/migrations/20260812044335_launch_core_identity_foundation.sql'),
  'utf8'
);

describe('WO-LAUNCH-CORE-01 hardening — first architecture/security review fixes', () => {
  it('is additive-only: never drops or resets the identity schema', () => {
    expect(sql).not.toMatch(/drop schema/i);
    expect(sql).not.toMatch(/truncate/i);
  });

  it('(2) replaces the cascading auth.users FK with a history-preserving, fail-closed one', () => {
    expect(sql).toMatch(/drop constraint account_links_auth_user_id_fkey/i);
    expect(sql).toMatch(/foreign key \(auth_user_id\) references auth\.users\(id\) on delete restrict/i);
    expect(sql).not.toMatch(/references auth\.users\(id\) on delete cascade/i);
    // the base migration is left untouched as an accurate historical record
    expect(baseSql).toMatch(/references auth\.users\(id\) on delete cascade/i);
  });

  it('(3) revokes ordinary service_role DELETE on every identity history table', () => {
    expect(sql).toMatch(
      /revoke delete on identity\.persons, identity\.account_links,\s*identity\.customer_relationships, identity\.person_relationships,\s*identity\.consent_records\s*from service_role/i
    );
  });

  it('(4) audits Person insert/update; no remaining unaudited mutation path', () => {
    expect(sql).toMatch(/create trigger persons_audit\s*after insert or update on identity\.persons/i);
    // DELETE is revoked (see above) so insert/update are the only remaining
    // service_role paths on identity.persons, and both are now audited.
  });

  it('(5) replaces permanent person_relationships uniqueness with active-only uniqueness', () => {
    expect(sql).toMatch(
      /drop constraint person_relationships_from_person_id_to_person_id_relationsh_key/i
    );
    expect(sql).toMatch(
      /create unique index person_relationships_one_active_per_triple_idx\s*on identity\.person_relationships\(from_person_id, to_person_id, relationship_kind\)\s*where status = 'active'/i
    );
  });

  it('(6) gives consent_records a typed, canonical subject reference without inventing business fields', () => {
    expect(sql).toMatch(
      /add column subject_person_id uuid references identity\.persons\(id\) on delete restrict/i
    );
    expect(sql).not.toMatch(/hat[_ ]?mam|hạt mầm|safe[_ ]form/i);
  });

  it('does not touch knowledge, public, or auth schema objects beyond the referenced FK', () => {
    expect(sql).not.toMatch(/create table|alter table knowledge\.|create table public\./i);
  });

  it('has a scoped rollback that restores exactly the pre-hardening state', () => {
    expect(rollback).toMatch(/drop column if exists subject_person_id/i);
    expect(rollback).toMatch(
      /add constraint person_relationships_from_person_id_to_person_id_relationsh_key\s*unique \(from_person_id, to_person_id, relationship_kind\)/i
    );
    expect(rollback).toMatch(/drop trigger if exists persons_audit on identity\.persons/i);
    expect(rollback).toMatch(
      /grant delete on identity\.persons, identity\.account_links,\s*identity\.customer_relationships, identity\.person_relationships,\s*identity\.consent_records\s*to service_role/i
    );
    expect(rollback).toMatch(/references auth\.users\(id\) on delete cascade/i);
    expect(rollback).not.toMatch(/drop schema/i);
  });
});
