import { describe, expect, it } from 'vitest';
import { normalizeKnowledgeText } from '@/lib/knowledge/normalize';
import { SupabaseKnowledgeSyncRepository } from '@/lib/knowledge/supabase-sync-repository';
import type { SyncSourceMutation } from '@/lib/knowledge/sync-engine';

function mutation(overrides: Partial<SyncSourceMutation> = {}): SyncSourceMutation {
  return {
    file: {
      id: 'fixture-1234567890',
      name: 'M2B STAGING FIXTURE — SAFE TO DELETE',
      mimeType: 'application/vnd.google-apps.document',
      parents: ['01-current'],
      webViewLink: 'https://docs.google.com/document/d/fixture-1234567890',
      createdTime: '2026-08-08T08:52:13.992Z',
      modifiedTime: '2026-08-08T08:52:28.647Z',
      version: '7',
    },
    canonicalFileId: 'fixture-1234567890',
    canonicalPath: '01_ĐIỀU ĐANG ĐÚNG/M2B STAGING FIXTURE — SAFE TO DELETE',
    ancestorFolderIds: ['01-current'],
    decision: {
      action: 'ingest_content',
      fileId: 'fixture-1234567890',
      rootZone: '01_current',
      usageMode: 'current_truth',
      ingestMode: 'content',
      runtimeEnabled: true,
      reasonCode: 'CURRENT_CONTENT',
    },
    ...overrides,
  };
}

function fixtureProfile() {
  return {
    sourceKind: 'canonical' as const,
    sourceRole: 'implementation_evidence' as const,
    authorityLevel: 'L6' as const,
    authorityScope: ['m2b_staging_fixture'] as const,
    lifecycle: 'reference' as const,
    sensitivity: 'internal' as const,
    usageMode: 'workspace' as const,
    runtimeEnabled: false,
    permissionFingerprint: 'm2b_service_account_readonly',
    metadata: { m2b_fixture: true, synthetic: true },
  };
}

describe('SupabaseKnowledgeSyncRepository', () => {
  it('persists deterministic source/version/unit payloads without enabling fixture retrieval', async () => {
    const calls: Array<{ fn: string; args: Record<string, unknown> }> = [];
    const client = {
      async rpc(fn: string, args: Record<string, unknown>) {
        calls.push({ fn, args });
        return { data: { ok: true }, error: null };
      },
    };
    const repository = new SupabaseKnowledgeSyncRepository(client, fixtureProfile);
    const input = mutation();
    const text = 'M2B staging fixture v1\nSynthetic non-sensitive content.';
    const units = normalizeKnowledgeText({ documentTitle: input.file.name, text });

    await repository.ingestContent({ ...input, text, units });

    expect(calls).toHaveLength(1);
    expect(calls[0].fn).toBe('knowledge_sync_ingest');
    const source = calls[0].args.p_source as Record<string, unknown>;
    const version = calls[0].args.p_version as Record<string, unknown>;
    const unitPayload = calls[0].args.p_units as Array<Record<string, unknown>>;
    expect(source).toMatchObject({
      drive_file_id: 'fixture-1234567890',
      root_zone: '01_current',
      authority_level: 'L6',
      source_role: 'implementation_evidence',
      lifecycle: 'reference',
      usage_mode: 'workspace',
      runtime_enabled: false,
      sensitivity: 'internal',
    });
    expect(source.metadata).toMatchObject({
      automated_drive_identity: true,
      server_side_only: true,
      m2b_fixture: true,
      synthetic: true,
    });
    expect(version.content_hash_sha256).toMatch(/^[a-f0-9]{64}$/);
    expect(version.normalized_content_hash_sha256).toMatch(/^[a-f0-9]{64}$/);
    expect(unitPayload.length).toBeGreaterThan(0);
    expect(unitPayload[0].content_hash_sha256).toMatch(/^[a-f0-9]{64}$/);
  });

  it('fails closed when a profile attempts private sensitivity', async () => {
    let called = false;
    const client = {
      async rpc() {
        called = true;
        return { data: null, error: null };
      },
    };
    const repository = new SupabaseKnowledgeSyncRepository(client, () => ({
      ...fixtureProfile(),
      sensitivity: 'private',
    }));
    const input = mutation();
    const text = 'synthetic';
    const units = normalizeKnowledgeText({ documentTitle: input.file.name, text });

    await expect(repository.ingestContent({ ...input, text, units })).rejects.toThrow(
      'KNOWLEDGE_SYNC_PERSISTENCE_SENSITIVE_PROFILE_DENIED'
    );
    expect(called).toBe(false);
  });

  it('tombstones removals instead of deleting evidence', async () => {
    const calls: Array<{ fn: string; args: Record<string, unknown> }> = [];
    const client = {
      async rpc(fn: string, args: Record<string, unknown>) {
        calls.push({ fn, args });
        return { data: true, error: null };
      },
    };
    const repository = new SupabaseKnowledgeSyncRepository(client, fixtureProfile);

    await repository.purgeByDriveFileId('fixture-1234567890', 'REMOVED_OR_PERMISSION_LOST');

    expect(calls[0]).toEqual({
      fn: 'knowledge_sync_tombstone',
      args: {
        p_drive_file_id: 'fixture-1234567890',
        p_reason_code: 'REMOVED_OR_PERMISSION_LOST',
      },
    });
  });

  it('persists Drive checkpoints through the narrow service-role RPC', async () => {
    const calls: Array<{ fn: string; args: Record<string, unknown> }> = [];
    const client = {
      async rpc(fn: string, args: Record<string, unknown>) {
        calls.push({ fn, args });
        return { data: null, error: null };
      },
    };
    const repository = new SupabaseKnowledgeSyncRepository(client, fixtureProfile);

    await repository.saveCheckpoint({
      connectorKey: 'm2b_runtime_fixture_probe',
      rootFolderId: 'root-1234567890',
      changePageToken: 'opaque-token',
      healthState: 'healthy',
      kind: 'full_reconcile',
    });

    expect(calls[0].fn).toBe('knowledge_sync_save_checkpoint');
    expect(calls[0].args).toMatchObject({
      p_connector_key: 'm2b_runtime_fixture_probe',
      p_root_folder_id: 'root-1234567890',
      p_health_state: 'healthy',
      p_kind: 'full_reconcile',
    });
  });

  it('allows cleanup only through the synthetic-fixture-specific RPC', async () => {
    const client = {
      async rpc(fn: string) {
        expect(fn).toBe('knowledge_sync_cleanup_synthetic_fixture');
        return { data: true, error: null };
      },
    };
    const repository = new SupabaseKnowledgeSyncRepository(client, fixtureProfile);
    await expect(repository.cleanupSyntheticFixture('fixture-1234567890')).resolves.toBe(true);
  });
});
