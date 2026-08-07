import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const sql = readFileSync(
  resolve(process.cwd(), 'supabase/migrations/0028_ai_knowledge_library_foundation.sql'),
  'utf8'
);
const rollback = readFileSync(
  resolve(process.cwd(), 'supabase/rollbacks/0028_ai_knowledge_library_foundation_down.sql'),
  'utf8'
);

describe('ESSENCE AI Knowledge Backend M1 SQL contract', () => {
  it('creates only the four approved Machine Library foundation tables in a private schema', () => {
    expect(sql).toMatch(/create schema if not exists knowledge/i);
    expect(sql).toMatch(/create table knowledge\.knowledge_sources/i);
    expect(sql).toMatch(/create table knowledge\.knowledge_versions/i);
    expect(sql).toMatch(/create table knowledge\.knowledge_units/i);
    expect(sql).toMatch(/create table knowledge\.knowledge_sync_state/i);
  });

  it('keeps the authority model L0 through L6 and stores scope separately', () => {
    expect(sql).toMatch(/authority_level in \('L0','L1','L2','L3','L4','L5','L6'\)/i);
    expect(sql).toMatch(/authority_scope text\[\]/i);
    expect(sql).toMatch(/lifecycle text not null/i);
    expect(sql).toMatch(/sensitivity text not null/i);
    expect(sql).toMatch(/usage_mode text not null/i);
  });

  it('hard denies private and child-sensitive sources and the 99 private zone', () => {
    expect(sql).toMatch(/knowledge_private_hard_deny/i);
    expect(sql).toMatch(/'private','child_sensitive'/i);
    expect(sql).toMatch(/knowledge_private_zone_hard_deny/i);
    expect(sql).toMatch(/root_zone <> '99_private'/i);
  });

  it('keeps derived copies out of duplicate content ingestion', () => {
    expect(sql).toMatch(/knowledge_derived_copy_not_content/i);
    expect(sql).toMatch(/'managed_copy','export','interface','navigation'/i);
  });

  it('records immutable ingestion evidence and permits only one current version per source', () => {
    expect(sql).toMatch(/content_hash_sha256 text not null/i);
    expect(sql).toMatch(/drive_revision_id text/i);
    expect(sql).toMatch(/knowledge_one_current_version_per_source_idx/i);
    expect(sql).toMatch(/where ingest_state = 'current'/i);
    expect(sql).toMatch(/accepted_without_suggestions/i);
  });

  it('stores structure-aware raw and retrieval text without adding vector infrastructure in M1', () => {
    expect(sql).toMatch(/parent_unit_id uuid references knowledge\.knowledge_units/i);
    expect(sql).toMatch(/heading_path text\[\]/i);
    expect(sql).toMatch(/raw_text text not null/i);
    expect(sql).toMatch(/retrieval_text text not null/i);
    expect(sql).not.toMatch(/vector\s*\(/i);
    expect(sql).not.toMatch(/hnsw/i);
    expect(sql).not.toMatch(/ivfflat/i);
  });

  it('has no browser/runtime grant and reserves service_role for maintenance only', () => {
    expect(sql).toMatch(/revoke all on schema knowledge from public, anon, authenticated/i);
    expect(sql).toMatch(/revoke all on knowledge\.knowledge_sources[\s\S]*from public, anon, authenticated/i);
    expect(sql).toMatch(/service_role is maintenance\/sync only/i);
    expect(sql).not.toMatch(/grant select[\s\S]*to authenticated/i);
  });

  it('stores sync health and cursor metadata but no secret field', () => {
    expect(sql).toMatch(/change_page_token text/i);
    expect(sql).toMatch(/last_full_reconcile_at/i);
    expect(sql).toMatch(/last_delta_sync_at/i);
    expect(sql).toMatch(/last_success_at/i);
    expect(sql).not.toMatch(/api_key|access_token|refresh_token|client_secret|private_key/i);
  });

  it('provides an explicit manual rollback for the isolated M1 schema', () => {
    expect(rollback).toMatch(/drop schema if exists knowledge cascade/i);
  });
});
