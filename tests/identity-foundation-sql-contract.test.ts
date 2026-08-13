import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const sql = readFileSync(
  resolve(process.cwd(), 'supabase/migrations/20260812044335_launch_core_identity_foundation.sql'),
  'utf8'
);
const rollback = readFileSync(
  resolve(process.cwd(), 'supabase/rollbacks/20260812044335_launch_core_identity_foundation_down.sql'),
  'utf8'
);

// Strips `-- ...` line comments and `comment on ... is '...';` statements so
// negative assertions check actual DDL, not prose that legitimately explains
// what a field is NOT (e.g. "no child-sensitive content" mentions "child").
const stripComments = (text: string) =>
  text
    .replace(/comment on [\s\S]*?;/gi, '')
    .split('\n')
    .filter((line) => !line.trim().startsWith('--'))
    .join('\n');

const code = stripComments(sql);
const rollbackCode = stripComments(rollback);

describe('WO-LAUNCH-CORE-01 identity foundation — schema contract', () => {
  it('creates exactly the six required entities in a dedicated identity schema', () => {
    expect(sql).toMatch(/create schema if not exists identity/i);
    expect(sql).toMatch(/create table identity\.persons/i);
    expect(sql).toMatch(/create table identity\.account_links/i);
    expect(sql).toMatch(/create table identity\.customer_relationships/i);
    expect(sql).toMatch(/create table identity\.person_relationships/i);
    expect(sql).toMatch(/create table identity\.consent_records/i);
    expect(sql).toMatch(/create table identity\.audit_events/i);
  });

  it('keeps Person minimal: no auth coupling, no product/customer state, no child payload', () => {
    const personsBlock = code.split('create table identity.persons')[1].split('create trigger persons_set_updated_at')[0];
    expect(personsBlock).not.toMatch(/auth\.users/i);
    expect(personsBlock).not.toMatch(/is_customer/i);
    expect(personsBlock).not.toMatch(/email/i);
    expect(personsBlock).not.toMatch(/child/i);
  });

  it('links auth.users to Person without treating auth.users.id as the Person primary key', () => {
    expect(sql).toMatch(/auth_user_id uuid not null references auth\.users\(id\)/i);
    expect(sql).toMatch(/person_id uuid not null references identity\.persons\(id\)/i);
    // the Person primary key stays its own generated uuid, never auth.users.id
    expect(sql).toMatch(/create table identity\.persons \(\s*id uuid primary key default gen_random_uuid\(\)/i);
  });

  it('prevents duplicate active account<->person linkage', () => {
    expect(sql).toMatch(/account_links_one_active_per_auth_user_idx[\s\S]*on identity\.account_links\(auth_user_id\) where status = 'active'/i);
    expect(sql).toMatch(/account_links_one_active_per_person_idx[\s\S]*on identity\.account_links\(person_id\) where status = 'active'/i);
  });

  it('represents customer status as history-aware relationship rows, not a boolean on Person', () => {
    expect(code).not.toMatch(/is_customer/i);
    expect(sql).toMatch(/create table identity\.customer_relationships/i);
    expect(sql).toMatch(/status text not null default 'active' check \(status in \('active', 'ended'\)\)/i);
    expect(sql).toMatch(/customer_relationships_one_active_per_person_idx/i);
  });

  it('rejects an impossible customer relationship lifecycle', () => {
    expect(sql).toMatch(/customer_relationships_ended_at_requires_status check \(\s*\(status = 'ended' and ended_at is not null and ended_at >= started_at\)\s*or \(status = 'active' and ended_at is null\)\s*\)/i);
  });

  it('constrains person relationships to an explicit, directional, enumerated kind', () => {
    expect(sql).toMatch(/relationship_kind text not null check \(relationship_kind in \('parent_or_guardian'\)\)/i);
    expect(sql).toMatch(/from_person_id uuid not null references identity\.persons\(id\)/i);
    expect(sql).toMatch(/to_person_id uuid not null references identity\.persons\(id\)/i);
  });

  it('rejects a self relationship', () => {
    expect(sql).toMatch(/person_relationships_no_self_relation check \(from_person_id <> to_person_id\)/i);
  });

  it('records consent evidence without inventing business consent wording', () => {
    expect(sql).toMatch(/create table identity\.consent_records/i);
    expect(sql).toMatch(/person_id uuid not null references identity\.persons\(id\)/i);
    expect(sql).toMatch(/evidence_kind text not null check \(evidence_kind in \(\s*'form_submission', 'verbal_recorded', 'written_record', 'system_generated'/i);
    expect(code).not.toMatch(/hat[_ ]?mam|hạt mầm|safe[_ ]form/i);
  });

  it('keeps audit events insert-only and blocks mutation by trigger', () => {
    expect(sql).toMatch(/create table identity\.audit_events/i);
    expect(sql).toMatch(/create or replace function identity\.reject_audit_mutation/i);
    expect(sql).toMatch(/raise exception 'AUDIT_EVENTS_IMMUTABLE'/i);
    expect(sql).toMatch(/create trigger audit_events_block_update/i);
    expect(sql).toMatch(/create trigger audit_events_block_delete/i);
    expect(sql).toMatch(/grant select, insert on identity\.audit_events to service_role/i);
    expect(sql).not.toMatch(/grant[\s\S]{0,120}update[\s\S]{0,40}identity\.audit_events/i);
    expect(sql).not.toMatch(/grant[\s\S]{0,120}delete[\s\S]{0,40}identity\.audit_events/i);
  });

  it('never stores secrets or raw tokens in audit metadata', () => {
    expect(code).not.toMatch(/api_key|access_token|refresh_token|client_secret|private_key|password/i);
  });
});

describe('WO-LAUNCH-CORE-01 identity foundation — security contract', () => {
  it('enables and forces RLS on every table', () => {
    const tables = [
      'identity.persons',
      'identity.account_links',
      'identity.customer_relationships',
      'identity.person_relationships',
      'identity.consent_records',
      'identity.audit_events',
    ];
    for (const table of tables) {
      expect(sql).toMatch(new RegExp(`alter table ${table.replace('.', '\\.')} enable row level security`, 'i'));
      expect(sql).toMatch(new RegExp(`alter table ${table.replace('.', '\\.')} force row level security`, 'i'));
    }
  });

  it('never grants anon or authenticated any privilege on the identity schema', () => {
    expect(sql).not.toMatch(/grant\s+(?:select|insert|update|delete|usage|execute)[\s\S]*to\s+(?:anon|authenticated)/i);
    expect(sql).toMatch(/revoke all on schema identity from public, anon, authenticated/i);
  });

  it('grants schema usage and table privileges to service_role only', () => {
    expect(sql).toMatch(/grant usage on schema identity to service_role/i);
    expect(sql).toMatch(/grant select, insert, update, delete on identity\.persons, identity\.account_links,\s*identity\.customer_relationships, identity\.person_relationships, identity\.consent_records\s*to service_role/i);
  });

  it('has a documented, single-statement rollback that only touches the identity schema', () => {
    expect(rollback).toMatch(/drop schema if exists identity cascade/i);
    expect(rollbackCode).not.toMatch(/knowledge|public\.|auth\./i);
  });
});
