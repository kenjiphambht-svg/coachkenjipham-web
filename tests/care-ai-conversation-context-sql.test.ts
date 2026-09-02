import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const migrationPath = path.join(
  process.cwd(),
  'supabase/migrations/20260903_p07_care_conversation_context.sql',
);
const rollbackPath = path.join(
  process.cwd(),
  'supabase/rollbacks/20260903_p07_care_conversation_context_down.sql',
);
const sql = fs.readFileSync(migrationPath, 'utf8');
const rollback = fs.readFileSync(rollbackPath, 'utf8');

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

  it('exposes server-only append/load/purge RPCs with bounded inputs', () => {
    expect(sql).toMatch(/create or replace function care\.care_context_append_turn/i);
    expect(sql).toMatch(/create or replace function care\.care_context_load_recent/i);
    expect(sql).toMatch(/create or replace function care\.care_context_purge_expired/i);
    expect(sql).toMatch(/p_max_messages between 1 and 32/i);
    expect(sql).toMatch(/char_length\(p_content\) > 8000/i);
    expect(sql).toMatch(/p_expires_at <= v_now/i);
  });

  it('ships a bounded rollback artifact but does not execute it', () => {
    expect(rollback).toMatch(/drop table if exists care\.conversation_messages/i);
    expect(rollback).toMatch(/drop table if exists care\.conversations/i);
    expect(rollback).toMatch(/drop table if exists identity\.channel_identities/i);
    expect(rollback).toMatch(/NOT FOR PRODUCTION EXECUTION WITHOUT A SEPARATE FOUNDER GATE/i);
  });
});
