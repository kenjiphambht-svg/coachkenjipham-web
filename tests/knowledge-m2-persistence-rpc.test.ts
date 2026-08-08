import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const serviceRpc = readFileSync(
  'supabase/migrations/20260808095439_ai_knowledge_sync_service_rpc.sql',
  'utf8'
);
const statusRpc = readFileSync(
  'supabase/migrations/20260808095710_ai_knowledge_sync_probe_status_rpc.sql',
  'utf8'
);

describe('M2B persistence RPC contract', () => {
  it('keeps the private knowledge schema behind service-role-only functions', () => {
    expect(serviceRpc).toContain('security definer');
    expect(serviceRpc).toContain('knowledge_sync_ingest');
    expect(serviceRpc).toContain('knowledge_sync_tombstone');
    expect(serviceRpc).toContain('knowledge_sync_save_checkpoint');
    expect(serviceRpc).toContain('knowledge_sync_cleanup_synthetic_fixture');
    expect(serviceRpc).toContain('from public, anon, authenticated');
    expect(serviceRpc).toContain('to service_role');
  });

  it('fails closed for private and child-sensitive sources', () => {
    expect(serviceRpc).toContain("p_source->>'root_zone' = '99_private'");
    expect(serviceRpc).toContain("p_source->>'sensitivity' in ('private', 'child_sensitive')");
    expect(serviceRpc).toContain('KNOWLEDGE_SYNC_PRIVATE_ZONE_DENIED');
    expect(serviceRpc).toContain('KNOWLEDGE_SYNC_SENSITIVE_SOURCE_DENIED');
  });

  it('retains removal evidence and disables runtime use', () => {
    expect(serviceRpc).toContain('runtime_enabled = false');
    expect(serviceRpc).toContain('is_removed = true');
    expect(serviceRpc).toContain("ingest_state = 'removed'");
  });

  it('allows destructive cleanup only for explicitly synthetic M2B fixtures', () => {
    expect(serviceRpc).toContain("metadata->>'m2b_fixture'='true'");
    expect(serviceRpc).toContain("metadata->>'synthetic'='true'");
  });

  it('returns only checkpoint metadata and synthetic fixture counts/status', () => {
    expect(statusRpc).toContain('knowledge_sync_get_checkpoint');
    expect(statusRpc).toContain('knowledge_sync_synthetic_fixture_status');
    expect(statusRpc).not.toContain('raw_text');
    expect(statusRpc).not.toContain('retrieval_text');
    expect(statusRpc).toContain('from public, anon, authenticated');
    expect(statusRpc).toContain('to service_role');
  });
});
