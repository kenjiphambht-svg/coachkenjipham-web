import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const migrationPath = path.join(
  process.cwd(),
  'supabase/migrations/20260903_p07_care_conversation_context.sql',
);
const rpcMigrationPath = path.join(
  process.cwd(),
  'supabase/migrations/20260903_p07_care_conversation_context_rpc_surface.sql',
);
const rollbackPath = path.join(
  process.cwd(),
  'supabase/rollbacks/20260903_p07_care_conversation_context_down.sql',
);
const rpcRollbackPath = path.join(
  process.cwd(),
  'supabase/rollbacks/20260903_p07_care_conversation_context_rpc_surface_down.sql',
);
const sql = fs.readFileSync(migrationPath, 'utf8');
const rpcSql = fs.readFileSync(rpcMigrationPath, 'utf8');
const rollback = fs.readFileSync(rollbackPath, 'utf8');
const rpcRollback = fs.readFileSync(rpcRollbackPath, 'utf8');

describe('P07 Care conversation context SQL contract', () => {
  it('creates only the Phase-A identity/conversation/message substrate', () => {
    expect(sql).toMatch(/create table if not exists identity\.channel_identities/i);
    expect(sql).toMatch(/create table if not exists care\.conversations/i);
    expect(sql).toMatch(/create table if not exists care\.conversation_messages/i);
    expect(sql).not.toMatch(/relationship_memor/i);
    expect(sql).not.toMatch(/learning_candidates/i);
  });

  it('stores channel identity hashes instead of raw external IDs', () => {
    expect(sql).toMatch(/account_scope_hash text not null/i);
    expect(sql).toMatch(/external_subject_hash text not null/i);
    expect(sql).not.toMatch(/\bpsid\b/i);
    expect(sql).not.toMatch(/raw_sender/i);
  });

  it('requires bounded message expiry and denies browser access', () => {
    expect(sql).toMatch(/expires_at timestamptz not null/i);
    expect(sql).toMatch(/alter table care\.conversation_messages enable row level security/i);
    expect(sql).toMatch(/alter table care\.conversation_messages force row level security/i);
    expect(sql).toMatch(/revoke all on identity\.channel_identities, care\.conversations, care\.conversation_messages\s+from public, anon, authenticated/i);
    expect(sql).toMatch(/revoke delete on identity\.channel_identities, care\.conversations, care\.conversation_messages\s+from service_role/i);
  });

  it('keeps private care functions bounded', () => {
    expect(sql).toMatch(/create or replace function care\.care_context_append_turn/i);
    expect(sql).toMatch(/create or replace function care\.care_context_load_recent/i);
    expect(sql).toMatch(/create or replace function care\.care_context_purge_expired/i);
    expect(sql).toMatch(/p_max_messages between 1 and 32/i);
    expect(sql).toMatch(/char_length\(p_content\) > 8000/i);
    expect(sql).toMatch(/p_expires_at <= v_now/i);
  });

  it('exposes only service-role public wrappers for PostgREST runtime access', () => {
    for (const name of [
      'care_context_append_turn',
      'care_context_load_recent',
      'care_context_purge_expired',
    ]) {
      expect(rpcSql).toMatch(new RegExp(`create or replace function public\\.${name}`, 'i'));
      expect(rpcSql).toMatch(new RegExp(`revoke all on function public\\.${name}[\\s\\S]*from public, anon, authenticated`, 'i'));
      expect(rpcSql).toMatch(new RegExp(`grant execute on function public\\.${name}[\\s\\S]*to service_role`, 'i'));
    }
    expect(rpcSql).toMatch(/The `care` schema remains private\/unexposed/i);
  });

  it('ships bounded rollback artifacts but does not execute them', () => {
    expect(rollback).toMatch(/drop table if exists care\.conversation_messages/i);
    expect(rollback).toMatch(/drop table if exists care\.conversations/i);
    expect(rollback).toMatch(/drop table if exists identity\.channel_identities/i);
    expect(rollback).toMatch(/NOT FOR PRODUCTION EXECUTION WITHOUT A SEPARATE FOUNDER GATE/i);
    expect(rpcRollback).toMatch(/drop function if exists public\.care_context_load_recent/i);
    expect(rpcRollback).toMatch(/drop function if exists public\.care_context_append_turn/i);
    expect(rpcRollback).toMatch(/NOT FOR PRODUCTION EXECUTION WITHOUT A SEPARATE FOUNDER GATE/i);
  });
});
