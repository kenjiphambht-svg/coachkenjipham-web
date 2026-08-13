import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const sql = readFileSync(
  resolve(process.cwd(), 'supabase/migrations/20260813123721_launch_core_product_journey_order_hardening.sql'),
  'utf8'
);
const rollback = readFileSync(
  resolve(process.cwd(), 'supabase/rollbacks/20260813123721_launch_core_product_journey_order_hardening_down.sql'),
  'utf8'
);

const stripComments = (text: string) =>
  text
    .replace(/comment on [\s\S]*?is\s+'[^']*';/gi, '')
    .split('\n')
    .filter((line) => !line.trim().startsWith('--'))
    .join('\n');

const code = stripComments(sql);
const rollbackCode = stripComments(rollback);

describe('WO-LAUNCH-CORE-02 hardening round 2 — additive-only, narrow fix', () => {
  it('never drops, resets, or rewrites the commerce schema or its tables', () => {
    expect(sql).not.toMatch(/drop schema|drop table|truncate/i);
    expect(sql).not.toMatch(/alter table commerce\.\w+ (add|drop) column/i);
  });

  it('does not touch identity or knowledge, and adds no new product/business field', () => {
    expect(code).not.toMatch(/alter table identity\.|alter table knowledge\.|create table identity\.|create table knowledge\./i);
    expect(code).not.toMatch(/price|refund|payment|provider|entitlement|tax/i);
  });
});

describe('(1) Stable Product Identity — product_key immutable, display_name editable', () => {
  it('adds a fail-closed trigger rejecting any product_key change', () => {
    expect(sql).toMatch(/create or replace function commerce\.reject_product_key_change/i);
    expect(sql).toMatch(/if NEW\.product_key is distinct from OLD\.product_key then/i);
    expect(sql).toMatch(/raise exception 'PRODUCT_KEY_IMMUTABLE'/i);
    expect(sql).toMatch(/create trigger products_block_key_change\s*before update on commerce\.products/i);
  });

  it('does not block display_name changes anywhere in the guard', () => {
    const fn = code.split('function commerce.reject_product_key_change')[1].split('create trigger products_block_key_change')[0];
    expect(fn).not.toMatch(/display_name/i);
  });
});

describe('(2) Journey history must not be rewritten', () => {
  it('blocks person_id, product_id, and opened_at from ever changing', () => {
    expect(sql).toMatch(/if NEW\.person_id is distinct from OLD\.person_id then\s*raise exception 'JOURNEY_ANCHOR_PERSON_IMMUTABLE'/i);
    expect(sql).toMatch(/if NEW\.product_id is distinct from OLD\.product_id then\s*raise exception 'JOURNEY_ANCHOR_PRODUCT_IMMUTABLE'/i);
    expect(sql).toMatch(/if NEW\.opened_at is distinct from OLD\.opened_at then\s*raise exception 'JOURNEY_ANCHOR_OPENED_AT_IMMUTABLE'/i);
  });

  it('blocks a closed journey from reopening, but allows open -> closed', () => {
    expect(sql).toMatch(/if OLD\.status = 'closed' and NEW\.status = 'open' then\s*raise exception 'JOURNEY_ANCHOR_CANNOT_REOPEN'/i);
    // no symmetric rejection exists for the open -> closed direction
    expect(code).not.toMatch(/OLD\.status = 'open' and NEW\.status = 'closed'[\s\S]{0,80}raise exception/i);
  });

  it('blocks repointing or clearing an already-pinned product_version_id', () => {
    expect(sql).toMatch(
      /if OLD\.product_version_id is not null\s*and NEW\.product_version_id is distinct from OLD\.product_version_id then\s*raise exception 'JOURNEY_ANCHOR_VERSION_PIN_IMMUTABLE'/i
    );
  });

  it('allows NULL -> a version exactly once, only while still open beforehand', () => {
    expect(sql).toMatch(
      /if OLD\.product_version_id is null\s*and NEW\.product_version_id is not null\s*and OLD\.status <> 'open' then\s*raise exception 'JOURNEY_ANCHOR_VERSION_PIN_REQUIRES_OPEN'/i
    );
  });

  it('attaches the rewrite guard as a BEFORE UPDATE trigger on product_journey_anchors', () => {
    expect(sql).toMatch(
      /create trigger product_journey_anchors_block_rewrite\s*before update on commerce\.product_journey_anchors/i
    );
  });
});

describe('(3) Every committed Order must have exactly one Snapshot', () => {
  it('uses a deferrable constraint trigger checked at transaction end, not a regular trigger', () => {
    expect(sql).toMatch(/create constraint trigger orders_require_snapshot/i);
    expect(sql).toMatch(/deferrable initially deferred/i);
    expect(sql).toMatch(/after insert on commerce\.orders/i);
  });

  it('rejects commit when the inserted order has no matching snapshot', () => {
    expect(sql).toMatch(/create or replace function commerce\.enforce_order_has_snapshot/i);
    expect(sql).toMatch(
      /if not exists \(\s*select 1 from commerce\.order_snapshots where order_id = NEW\.id\s*\) then/i
    );
    expect(sql).toMatch(/raise exception 'ORDER_SNAPSHOT_REQUIRED/i);
  });

  it('relies on the pre-existing UNIQUE(order_id) for "at most one", not a new mechanism', () => {
    // the hardening migration does not redefine order_snapshots' uniqueness —
    // it only adds the "at least one" half of the invariant.
    expect(sql).not.toMatch(/order_snapshots.*unique/i);
  });
});

describe('scoped rollback', () => {
  it('reverses exactly the three guards and touches nothing else', () => {
    expect(rollback).toMatch(/drop trigger if exists orders_require_snapshot on commerce\.orders/i);
    expect(rollback).toMatch(/drop function if exists commerce\.enforce_order_has_snapshot\(\)/i);
    expect(rollback).toMatch(/drop trigger if exists product_journey_anchors_block_rewrite on commerce\.product_journey_anchors/i);
    expect(rollback).toMatch(/drop function if exists commerce\.reject_journey_anchor_rewrite\(\)/i);
    expect(rollback).toMatch(/drop trigger if exists products_block_key_change on commerce\.products/i);
    expect(rollback).toMatch(/drop function if exists commerce\.reject_product_key_change\(\)/i);
    expect(rollbackCode).not.toMatch(/drop schema|identity\.|knowledge\.|public\.|auth\./i);
  });
});
