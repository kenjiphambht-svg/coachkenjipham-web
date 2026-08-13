import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const sql = readFileSync(
  resolve(process.cwd(), 'supabase/migrations/20260813130502_launch_core_product_journey_order_final_hardening.sql'),
  'utf8'
);
const rollback = readFileSync(
  resolve(process.cwd(), 'supabase/rollbacks/20260813130502_launch_core_product_journey_order_final_hardening_down.sql'),
  'utf8'
);

const stripComments = (text: string) =>
  text
    .replace(/comment on [\s\S]*?is\s+'[^']*';/gi, '')
    .split('\n')
    .filter((line) => !line.trim().startsWith('--'))
    .join('\n');

const code = stripComments(sql);

describe('WO-LAUNCH-CORE-02 final hardening — additive-only, single-item fix', () => {
  it('never drops/resets the schema, table, or trigger — only replaces the function body', () => {
    expect(sql).not.toMatch(/drop schema|drop table|drop trigger|truncate/i);
    expect(sql).toMatch(/create or replace function commerce\.reject_journey_anchor_rewrite/i);
  });

  it('does not touch identity, knowledge, or any new product/business field', () => {
    expect(code).not.toMatch(/alter table identity\.|alter table knowledge\.|create table/i);
    expect(code).not.toMatch(/price|refund|payment|provider|entitlement|tax/i);
  });
});

describe('closed Journey closed_at is sealed', () => {
  it('(1/2) does not block the OPEN -> CLOSED transition from setting closed_at', () => {
    // the new check only fires when OLD.status = 'closed'; while OLD.status
    // is 'open' (the transition itself), closed_at may still be set once.
    expect(sql).toMatch(/if OLD\.status = 'closed' and NEW\.closed_at is distinct from OLD\.closed_at then/i);
  });

  it('(3) rejects changing closed_at while already closed', () => {
    expect(sql).toMatch(
      /if OLD\.status = 'closed' and NEW\.closed_at is distinct from OLD\.closed_at then\s*raise exception 'JOURNEY_ANCHOR_CLOSED_AT_IMMUTABLE'/i
    );
  });

  it('(4) the same check also rejects clearing closed_at to NULL after closure', () => {
    // "distinct from" is NULL-safe: OLD.closed_at (a timestamp) IS DISTINCT
    // FROM NULL evaluates true, so the same branch above covers this case
    // without a separate NULL-specific check.
    const fn = code.split('function commerce.reject_journey_anchor_rewrite')[1];
    expect(fn).toMatch(/is distinct from OLD\.closed_at/i);
  });

  it('(5) closed -> open reopening is still rejected, unchanged', () => {
    expect(sql).toMatch(/if OLD\.status = 'closed' and NEW\.status = 'open' then\s*raise exception 'JOURNEY_ANCHOR_CANNOT_REOPEN'/i);
  });

  it('(6) person/product/opened_at rewrite guards are still present, unchanged', () => {
    expect(sql).toMatch(/raise exception 'JOURNEY_ANCHOR_PERSON_IMMUTABLE'/i);
    expect(sql).toMatch(/raise exception 'JOURNEY_ANCHOR_PRODUCT_IMMUTABLE'/i);
    expect(sql).toMatch(/raise exception 'JOURNEY_ANCHOR_OPENED_AT_IMMUTABLE'/i);
  });

  it('(7) pinned Product Version repoint/clear guard is still present, unchanged', () => {
    expect(sql).toMatch(/raise exception 'JOURNEY_ANCHOR_VERSION_PIN_IMMUTABLE'/i);
    expect(sql).toMatch(/raise exception 'JOURNEY_ANCHOR_VERSION_PIN_REQUIRES_OPEN'/i);
  });

  it('never grants the function to a browser role', () => {
    expect(sql).toMatch(/revoke all on function commerce\.reject_journey_anchor_rewrite\(\) from public, anon, authenticated/i);
  });
});

describe('scoped rollback', () => {
  it('restores exactly the immediately-previous guard body, without the closed_at check', () => {
    expect(rollback).toMatch(/create or replace function commerce\.reject_journey_anchor_rewrite/i);
    expect(rollback).not.toMatch(/JOURNEY_ANCHOR_CLOSED_AT_IMMUTABLE/i);
    // every other rule must still be present in the rollback body
    expect(rollback).toMatch(/JOURNEY_ANCHOR_PERSON_IMMUTABLE/i);
    expect(rollback).toMatch(/JOURNEY_ANCHOR_PRODUCT_IMMUTABLE/i);
    expect(rollback).toMatch(/JOURNEY_ANCHOR_OPENED_AT_IMMUTABLE/i);
    expect(rollback).toMatch(/JOURNEY_ANCHOR_CANNOT_REOPEN/i);
    expect(rollback).toMatch(/JOURNEY_ANCHOR_VERSION_PIN_IMMUTABLE/i);
    expect(rollback).toMatch(/JOURNEY_ANCHOR_VERSION_PIN_REQUIRES_OPEN/i);
    expect(rollback).not.toMatch(/drop schema|drop table|drop trigger/i);
  });
});
