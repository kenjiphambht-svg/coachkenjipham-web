import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const sql = readFileSync(
  resolve(process.cwd(), 'supabase/migrations/20260813120549_launch_core_product_journey_order_foundation.sql'),
  'utf8'
);
const rollback = readFileSync(
  resolve(process.cwd(), 'supabase/rollbacks/20260813120549_launch_core_product_journey_order_foundation_down.sql'),
  'utf8'
);

// Strips `-- ...` line comments and `comment on ... is '...';` statements so
// negative assertions check actual DDL, not prose that legitimately explains
// what a field is NOT (same technique as the identity foundation tests).
const stripComments = (text: string) =>
  text
    .replace(/comment on [\s\S]*?is\s+'[^']*';/gi, '')
    .split('\n')
    .filter((line) => !line.trim().startsWith('--'))
    .join('\n');

const code = stripComments(sql);
const rollbackCode = stripComments(rollback);

describe('WO-LAUNCH-CORE-02 product/journey/order foundation — schema contract', () => {
  it('creates exactly the six tables and one view in a dedicated commerce schema', () => {
    expect(sql).toMatch(/create schema if not exists commerce/i);
    expect(sql).toMatch(/create table commerce\.audit_events/i);
    expect(sql).toMatch(/create table commerce\.products/i);
    expect(sql).toMatch(/create table commerce\.product_versions/i);
    expect(sql).toMatch(/create table commerce\.product_journey_anchors/i);
    expect(sql).toMatch(/create table commerce\.orders/i);
    expect(sql).toMatch(/create table commerce\.order_snapshots/i);
    expect(sql).toMatch(/create view commerce\.product_summary/i);
  });

  it('(A) keeps Product a generic catalog substrate with a stable key, not a fixed enum of products', () => {
    const productsBlock = code.split('create table commerce.products')[1].split('create trigger products_set_updated_at')[0];
    expect(productsBlock).toMatch(/product_key text not null unique check \(product_key ~ '\^\[a-z\]\[a-z0-9_\]\{1,79\}\$'\)/i);
    expect(productsBlock).not.toMatch(/product_key in \(/i);
    expect(productsBlock).not.toMatch(/price|refund|offer|tax/i);
  });

  it('(B) makes Product Version immutable and tied to Product, with composite-FK reproducibility support', () => {
    expect(sql).toMatch(/product_id uuid not null references commerce\.products\(id\) on delete restrict/i);
    expect(sql).toMatch(/unique \(product_id, version_label\)/i);
    expect(sql).toMatch(/unique \(id, product_id\)/i);
    expect(sql).toMatch(/create trigger product_versions_block_update/i);
    expect(sql).toMatch(/create trigger product_versions_block_delete/i);
    const versionsBlock = code.split('create table commerce.product_versions')[1].split('create index product_versions_product_idx')[0];
    expect(versionsBlock).not.toMatch(/price|refund|offer/i);
  });

  it('(C) anchors Person to Product/Product Version with only generic open/closed lifecycle, no state machine', () => {
    expect(sql).toMatch(/person_id uuid not null references identity\.persons\(id\) on delete restrict/i);
    expect(sql).toMatch(/product_version_id uuid references commerce\.product_versions\(id\) on delete restrict/i);
    expect(sql).toMatch(/status text not null default 'open' check \(status in \('open', 'closed'\)\)/i);
    expect(sql).toMatch(
      /constraint product_journey_anchors_version_belongs_to_product\s*foreign key \(product_version_id, product_id\) references commerce\.product_versions\(id, product_id\)/i
    );
    expect(code).not.toMatch(/lang_|hat_mam|hạt mầm|customer_status/i);
  });

  it('rejects an impossible journey anchor lifecycle and allows only one open anchor per person+product', () => {
    expect(sql).toMatch(/product_journey_anchors_closed_at_requires_status check \(\s*\(status = 'closed' and closed_at is not null and closed_at >= opened_at\)\s*or \(status = 'open' and closed_at is null\)\s*\)/i);
    expect(sql).toMatch(
      /product_journey_anchors_one_open_per_person_product_idx\s*on commerce\.product_journey_anchors\(person_id, product_id\) where status = 'open'/i
    );
  });

  it('(D) makes Order idempotent, immutable, and free of payment/refund/provider/entitlement logic', () => {
    expect(sql).toMatch(/buyer_person_id uuid not null references identity\.persons\(id\) on delete restrict/i);
    expect(sql).toMatch(/idempotency_key text not null unique/i);
    expect(sql).toMatch(
      /constraint orders_version_belongs_to_product\s*foreign key \(product_version_id, product_id\) references commerce\.product_versions\(id, product_id\)/i
    );
    expect(sql).toMatch(/create trigger orders_block_update/i);
    expect(sql).toMatch(/create trigger orders_block_delete/i);
    const ordersBlock = code.split('create table commerce.orders')[1].split('create index orders_buyer_idx')[0];
    expect(ordersBlock).not.toMatch(/price|refund|payment|provider|entitlement|tax/i);
  });

  it('(E) makes Order Snapshot immutable, one-per-order, and bounded/versioned JSON', () => {
    expect(sql).toMatch(/order_id uuid not null unique references commerce\.orders\(id\) on delete restrict/i);
    expect(sql).toMatch(/snapshot_schema_version integer not null default 1 check \(snapshot_schema_version >= 1\)/i);
    expect(sql).toMatch(/snapshot jsonb not null default '\{\}'::jsonb/i);
    expect(sql).toMatch(/order_snapshots_bounded_payload check \(octet_length\(snapshot::text\) <= 8000\)/i);
    expect(sql).toMatch(/create trigger order_snapshots_block_update/i);
    expect(sql).toMatch(/create trigger order_snapshots_block_delete/i);
  });

  it('(F) exposes only order_count/journey_count/open_journey_count, never paid_count/revenue/profit', () => {
    expect(sql).toMatch(/count\(distinct o\.id\) as order_count/i);
    expect(sql).toMatch(/count\(distinct pja\.id\) as journey_count/i);
    expect(sql).toMatch(/filter \(where pja\.status = 'open'\) as open_journey_count/i);
    expect(code).not.toMatch(/paid_count|revenue|profit/i);
  });

  it('never stores secrets or raw tokens anywhere in this migration', () => {
    expect(code).not.toMatch(/api_key|access_token|refresh_token|client_secret|private_key|password/i);
  });
});

describe('WO-LAUNCH-CORE-02 product/journey/order foundation — security contract', () => {
  it('enables and forces RLS on every table', () => {
    const tables = [
      'commerce.products',
      'commerce.product_versions',
      'commerce.product_journey_anchors',
      'commerce.orders',
      'commerce.order_snapshots',
      'commerce.audit_events',
    ];
    for (const table of tables) {
      expect(sql).toMatch(new RegExp(`alter table ${table.replace('.', '\\.')} enable row level security`, 'i'));
      expect(sql).toMatch(new RegExp(`alter table ${table.replace('.', '\\.')} force row level security`, 'i'));
    }
  });

  it('never grants anon or authenticated any privilege in the commerce schema', () => {
    expect(sql).not.toMatch(/grant\s+(?:select|insert|update|delete|usage|execute)[\s\S]*to\s+(?:anon|authenticated)/i);
    expect(sql).toMatch(/revoke all on schema commerce from public, anon, authenticated/i);
  });

  it('never grants ordinary DELETE on any commerce table', () => {
    expect(sql).not.toMatch(/grant[\s\S]{0,200}delete[\s\S]{0,80}to service_role/i);
  });

  it('grants the product_summary view to service_role only, never to a browser role', () => {
    expect(sql).toMatch(/revoke all on commerce\.product_summary from public, anon, authenticated/i);
    expect(sql).toMatch(/grant select on commerce\.product_summary to service_role/i);
  });

  it('audits every sensitive mutation from creation, including Product itself', () => {
    expect(sql).toMatch(/create trigger products_audit\s*after insert or update on commerce\.products/i);
    expect(sql).toMatch(/create trigger product_versions_audit\s*after insert on commerce\.product_versions/i);
    expect(sql).toMatch(/create trigger product_journey_anchors_audit\s*after insert or update on commerce\.product_journey_anchors/i);
    expect(sql).toMatch(/create trigger orders_audit\s*after insert on commerce\.orders/i);
    expect(sql).toMatch(/create trigger order_snapshots_audit\s*after insert on commerce\.order_snapshots/i);
  });

  it('does not modify identity or knowledge schema objects, only references identity.persons', () => {
    expect(code).not.toMatch(/alter table identity\.|alter table knowledge\.|create table identity\.|create table knowledge\./i);
    expect(sql).toMatch(/references identity\.persons\(id\)/i);
  });

  it('has a documented, single-statement rollback that only touches the commerce schema', () => {
    expect(rollback).toMatch(/drop schema if exists commerce cascade/i);
    expect(rollbackCode).not.toMatch(/identity|knowledge|public\.|auth\./i);
  });
});
