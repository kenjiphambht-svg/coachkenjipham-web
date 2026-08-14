import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const sql = readFileSync(
  resolve(process.cwd(), 'supabase/migrations/20260814051819_launch_core_production_artifact_canonical_identity.sql'),
  'utf8'
);
const rollback = readFileSync(
  resolve(process.cwd(), 'supabase/rollbacks/20260814051819_launch_core_production_artifact_canonical_identity_down.sql'),
  'utf8'
);

const stripComments = (text: string) =>
  text
    .replace(/comment on [\s\S]*?is\s+'(?:[^']|'')*';/gi, '')
    .split('\n')
    .filter((line) => !line.trim().startsWith('--'))
    .join('\n');

const code = stripComments(sql);
const rollbackCode = stripComments(rollback);

describe('WO-LAUNCH-CORE-04 fresh-evaluator finding — Artifact canonical identity', () => {
  it('is additive-only: only a new unique index, no new table/trigger/function', () => {
    expect(code).not.toMatch(/create table|drop table|create schema|drop schema|create trigger|create or replace function/i);
  });

  it('adds a unique index on the full declared scope, coalescing nullable columns so unscoped rows still collide', () => {
    expect(sql).toMatch(
      /create unique index artifacts_unique_canonical_scope_idx\s*on production\.artifacts \(\s*person_id,\s*product_id,\s*coalesce\(product_version_id, '00000000-0000-0000-0000-000000000000'::uuid\),\s*coalesce\(journey_anchor_id, '00000000-0000-0000-0000-000000000000'::uuid\)\s*\)/i
    );
  });
});

describe('scoped rollback', () => {
  it('drops only the new index', () => {
    expect(rollback).toMatch(/drop index if exists production\.artifacts_unique_canonical_scope_idx/i);
    expect(rollbackCode.trim().split('\n').filter((l) => l.trim().length > 0)).toHaveLength(1);
  });

  it('touches neither identity, commerce, entitlement, nor knowledge', () => {
    expect(rollbackCode).not.toMatch(/identity\.\w|commerce\.\w|entitlement\.\w|knowledge\.\w|create table|drop schema/i);
  });
});
