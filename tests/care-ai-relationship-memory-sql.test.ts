import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const migration = fs.readFileSync(path.join(
  process.cwd(), 'supabase/migrations/20260903_p07_care_relationship_memory.sql',
), 'utf8');
const rpc = fs.readFileSync(path.join(
  process.cwd(), 'supabase/migrations/20260903_p07_care_relationship_memory_rpc_surface.sql',
), 'utf8');
const rollback = fs.readFileSync(path.join(
  process.cwd(), 'supabase/rollbacks/20260903_p07_care_relationship_memory_down.sql',
), 'utf8');
const rpcRollback = fs.readFileSync(path.join(
  process.cwd(), 'supabase/rollbacks/20260903_p07_care_relationship_memory_rpc_surface_down.sql',
), 'utf8');

describe('P07 relationship-memory SQL contract', () => {
  it('creates one versioned selective-memory table and no broad transcript store', () => {
    expect(migration).toMatch(/create table if not exists care\.relationship_memories/i);
    expect(migration).toMatch(/supersedes_memory_id uuid references care\.relationship_memories/i);
    expect(migration).not.toMatch(/raw_transcript|full_transcript|customer_story/i);
  });

  it('requires exactly one owner scope and active-key uniqueness per owner', () => {
    expect(migration).toMatch(/care_relationship_memory_exactly_one_owner/i);
    expect(migration).toMatch(/person_id is not null\)::int \+ \(channel_identity_id is not null\)::int/i);
    expect(migration).toMatch(/care_relationship_memories_active_person_key_idx/i);
    expect(migration).toMatch(/care_relationship_memories_active_channel_key_idx/i);
  });

  it('forces RLS, denies browser access and denies direct service-role mutation', () => {
    expect(migration).toMatch(/alter table care\.relationship_memories enable row level security/i);
    expect(migration).toMatch(/alter table care\.relationship_memories force row level security/i);
    expect(migration).toMatch(/revoke all on care\.relationship_memories from public, anon, authenticated/i);
    expect(migration).toMatch(/revoke insert, update, delete on care\.relationship_memories from service_role/i);
  });

  it('implements purpose/freshness/expiry-filtered reads and S3 denial', () => {
    expect(migration).toMatch(/m\.status = 'ACTIVE'/i);
    expect(migration).toMatch(/m\.purpose_scope = p_purpose_scope/i);
    expect(migration).toMatch(/m\.freshness_state = 'CURRENT'/i);
    expect(migration).toMatch(/m\.expires_at is null or m\.expires_at > p_now/i);
    expect(migration).toMatch(/CARE_MEMORY_S3_DENIED/i);
  });

  it('implements append/supersede UPDATE and FORGET tombstone semantics', () => {
    expect(migration).toMatch(/set status = 'SUPERSEDED'/i);
    expect(migration).toMatch(/'ACTIVE', v_prior_id/i);
    expect(migration).toMatch(/'FORGOTTEN', v_prior_id/i);
    expect(migration).toMatch(/\{"forgotten":true\}/i);
  });

  it('exposes only service-role public wrappers for PostgREST', () => {
    for (const name of ['care_memory_read', 'care_memory_update', 'care_memory_forget']) {
      expect(rpc).toMatch(new RegExp(`create or replace function public\\.${name}`, 'i'));
      expect(rpc).toMatch(new RegExp(`revoke all on function public\\.${name}[\\s\\S]*from public, anon, authenticated`, 'i'));
      expect(rpc).toMatch(new RegExp(`grant execute on function public\\.${name}[\\s\\S]*to service_role`, 'i'));
    }
    expect(rpc).toMatch(/care` schema remains private\/unexposed/i);
  });

  it('ships explicit rollback artifacts without authorizing execution', () => {
    expect(rollback).toMatch(/drop table if exists care\.relationship_memories/i);
    expect(rollback).toMatch(/NOT FOR PRODUCTION EXECUTION WITHOUT A SEPARATE FOUNDER GATE/i);
    expect(rpcRollback).toMatch(/drop function if exists public\.care_memory_read/i);
    expect(rpcRollback).toMatch(/NOT FOR PRODUCTION EXECUTION WITHOUT A SEPARATE FOUNDER GATE/i);
  });
});
