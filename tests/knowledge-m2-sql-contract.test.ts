import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const sql = readFileSync(
  resolve(process.cwd(), 'supabase/migrations/20260808042208_ai_knowledge_sync_retrieval_foundation.sql'),
  'utf8'
);
const rollback = readFileSync(
  resolve(process.cwd(), 'supabase/rollbacks/20260808042208_ai_knowledge_sync_retrieval_foundation_down.sql'),
  'utf8'
);

describe('ESSENCE AI Knowledge Backend M2 SQL contract', () => {
  it('adds Drive sync evidence without storing credentials', () => {
    expect(sql).toMatch(/drive_created_at timestamptz/i);
    expect(sql).toMatch(/drive_modified_at timestamptz/i);
    expect(sql).toMatch(/drive_version text/i);
    expect(sql).toMatch(/last_seen_at timestamptz/i);
    expect(sql).not.toMatch(/access_token|refresh_token|client_secret|private_key|api_key/i);
  });

  it('fails closed when a Drive source is removed', () => {
    expect(sql).toMatch(/knowledge_removed_not_runtime/i);
    expect(sql).toMatch(/is_removed = false or runtime_enabled = false/i);
    expect(sql).toMatch(/knowledge_removed_time/i);
  });

  it('adds simple + unaccent lexical search, not vector infrastructure', () => {
    expect(sql).toMatch(/create extension if not exists unaccent/i);
    expect(sql).toMatch(/search_document tsvector/i);
    expect(sql).toMatch(/to_tsvector\(\s*'simple'/i);
    expect(sql).toMatch(/extensions\.unaccent/i);
    expect(sql).toMatch(/using gin \(search_document\)/i);
    expect(sql).not.toMatch(/vector\s*\(/i);
    expect(sql).not.toMatch(/hnsw|ivfflat/i);
  });

  it('does not open browser roles', () => {
    expect(sql).not.toMatch(/grant\s+(?:select|usage|execute)[\s\S]*to\s+(?:anon|authenticated)/i);
  });

  it('has a manual rollback for every M2 schema addition', () => {
    expect(rollback).toMatch(/drop column if exists search_document/i);
    expect(rollback).toMatch(/drop column if exists is_removed/i);
    expect(rollback).toMatch(/drop function if exists knowledge\.set_search_document/i);
    expect(rollback).not.toMatch(/drop schema if exists knowledge cascade/i);
  });
});
