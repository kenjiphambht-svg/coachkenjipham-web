import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const sql = readFileSync(
  resolve(process.cwd(), 'supabase/migrations/20260813172831_launch_core_payment_evidence_entitlement_scope_cross_check.sql'),
  'utf8'
);
const rollback = readFileSync(
  resolve(process.cwd(), 'supabase/rollbacks/20260813172831_launch_core_payment_evidence_entitlement_scope_cross_check_down.sql'),
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

describe('WO-LAUNCH-CORE-03 second self-review — Journey vs Order direct version agreement', () => {
  it('is a separate, additive file — does not rewrite either previously applied migration', () => {
    expect(sql).toMatch(/create or replace function entitlement\.validate_entitlement_scope/i);
    expect(code).not.toMatch(/create table|drop schema|create schema/i);
  });

  it('rejects a Journey pinned to one Version and an Order pinned to a different Version on the same Entitlement, even when the Entitlement itself claims no version', () => {
    const fn = code.split('create or replace function entitlement.validate_entitlement_scope')[1];
    expect(fn).toMatch(
      /NEW\.journey_anchor_id is not null and NEW\.order_id is not null\s*and v_journey_version is not null and v_order_version is not null\s*and v_journey_version is distinct from v_order_version/i
    );
    expect(fn).toMatch(/raise exception 'ENTITLEMENT_JOURNEY_ORDER_VERSION_MISMATCH'/i);
  });

  it('the new check only fires when both a Journey and an Order are referenced and both pin a Version', () => {
    const fn = code.split('create or replace function entitlement.validate_entitlement_scope')[1];
    const newCheckIndex = fn.indexOf('ENTITLEMENT_JOURNEY_ORDER_VERSION_MISMATCH');
    const guard = fn.slice(0, newCheckIndex);
    expect(guard).toMatch(/NEW\.journey_anchor_id is not null and NEW\.order_id is not null/i);
  });

  it('still rejects every pre-existing scope/version mismatch from the prior hardening pass', () => {
    const fn = code.split('create or replace function entitlement.validate_entitlement_scope')[1];
    expect(fn).toMatch(/ENTITLEMENT_JOURNEY_NOT_FOUND/i);
    expect(fn).toMatch(/ENTITLEMENT_JOURNEY_SCOPE_MISMATCH/i);
    expect(fn).toMatch(/ENTITLEMENT_JOURNEY_VERSION_MISMATCH/i);
    expect(fn).toMatch(/ENTITLEMENT_ORDER_NOT_FOUND/i);
    expect(fn).toMatch(/ENTITLEMENT_ORDER_SCOPE_MISMATCH/i);
    expect(fn).toMatch(/ENTITLEMENT_ORDER_VERSION_MISMATCH/i);
  });

  it('touches neither identity, commerce table structure, nor knowledge — function body only', () => {
    expect(code).not.toMatch(/create table|alter table (?!.*validate_entitlement_scope)/i);
    expect(code).not.toMatch(/identity\.\w|knowledge\.\w/i);
  });
});

describe('scoped rollback', () => {
  it('restores validate_entitlement_scope to a body with no Journey-vs-Order direct comparison', () => {
    expect(rollback).toMatch(/create or replace function entitlement\.validate_entitlement_scope/i);
    expect(rollbackCode).not.toMatch(/ENTITLEMENT_JOURNEY_ORDER_VERSION_MISMATCH/i);
  });

  it('still restores every pre-existing scope/version check', () => {
    expect(rollback).toMatch(/ENTITLEMENT_JOURNEY_NOT_FOUND/i);
    expect(rollback).toMatch(/ENTITLEMENT_JOURNEY_VERSION_MISMATCH/i);
    expect(rollback).toMatch(/ENTITLEMENT_ORDER_NOT_FOUND/i);
    expect(rollback).toMatch(/ENTITLEMENT_ORDER_VERSION_MISMATCH/i);
  });

  it('touches neither identity, commerce table structure, nor knowledge', () => {
    expect(rollbackCode).not.toMatch(/identity\.\w|knowledge\.\w|create table|drop schema/i);
  });
});
