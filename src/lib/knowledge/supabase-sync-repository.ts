import { hashUtf8Sha256, normalizeTextForHash } from './drive-sync';
import type {
  AuthorityLevel,
  KnowledgeLifecycle,
  KnowledgeSensitivity,
  KnowledgeSourceKind,
  KnowledgeSourceRole,
  KnowledgeUsageMode,
} from './contracts';
import type {
  KnowledgeSyncRepository,
  SyncSourceMutation,
} from './sync-engine';

export type KnowledgeSyncRpcError = {
  message: string;
  code?: string;
};

export type KnowledgeSyncRpcClient = {
  rpc(
    functionName: string,
    args: Record<string, unknown>
  ): PromiseLike<{ data: unknown; error: KnowledgeSyncRpcError | null }>;
};

export type KnowledgeSyncSourceProfile = {
  sourceCode?: string;
  sourceKind: KnowledgeSourceKind;
  sourceRole: KnowledgeSourceRole;
  authorityLevel: AuthorityLevel;
  authorityScope: readonly string[];
  lifecycle: KnowledgeLifecycle;
  sensitivity: KnowledgeSensitivity;
  usageMode: KnowledgeUsageMode;
  runtimeEnabled: boolean;
  permissionFingerprint: string;
  metadata?: Record<string, unknown>;
};

export type KnowledgeSyncProfileResolver = (
  input: SyncSourceMutation
) => KnowledgeSyncSourceProfile;

function rpcErrorCode(prefix: string, error: KnowledgeSyncRpcError): Error {
  const safeCode = error.code && /^[A-Z0-9_]+$/i.test(error.code) ? error.code : 'RPC_FAILED';
  return new Error(`${prefix}_${safeCode}`);
}

function sourcePayload(
  input: SyncSourceMutation,
  profile: KnowledgeSyncSourceProfile
): Record<string, unknown> {
  if (input.decision.action !== 'ingest_content') {
    throw new Error('KNOWLEDGE_SYNC_PERSISTENCE_CONTENT_DECISION_REQUIRED');
  }
  if (profile.sensitivity === 'private' || profile.sensitivity === 'child_sensitive') {
    throw new Error('KNOWLEDGE_SYNC_PERSISTENCE_SENSITIVE_PROFILE_DENIED');
  }
  if (input.decision.rootZone === '99_private') {
    throw new Error('KNOWLEDGE_SYNC_PERSISTENCE_PRIVATE_ZONE_DENIED');
  }

  return {
    drive_file_id: input.canonicalFileId,
    source_code: profile.sourceCode ?? null,
    display_title: input.file.name,
    drive_url:
      input.file.webViewLink ??
      `https://drive.google.com/open?id=${encodeURIComponent(input.canonicalFileId)}`,
    canonical_path: input.canonicalPath,
    root_zone: input.decision.rootZone,
    mime_type: input.file.mimeType,
    source_kind: profile.sourceKind,
    source_role: profile.sourceRole,
    authority_level: profile.authorityLevel,
    authority_scope: [...profile.authorityScope],
    lifecycle: profile.lifecycle,
    sensitivity: profile.sensitivity,
    usage_mode: profile.usageMode,
    ingest_mode: 'content',
    // The Drive policy may allow runtime use, but a profile is allowed to tighten that
    // decision. It may never turn a policy-disabled source on.
    runtime_enabled: input.decision.runtimeEnabled && profile.runtimeEnabled,
    permission_fingerprint: profile.permissionFingerprint,
    metadata: {
      automated_drive_identity: true,
      server_side_only: true,
      ...(profile.metadata ?? {}),
    },
    drive_created_at: input.file.createdTime ?? null,
    drive_modified_at: input.file.modifiedTime ?? null,
    drive_version: input.file.version ?? null,
    drive_md5_checksum: input.file.md5Checksum ?? null,
  };
}

export class SupabaseKnowledgeSyncRepository implements KnowledgeSyncRepository {
  constructor(
    private readonly client: KnowledgeSyncRpcClient,
    private readonly resolveProfile: KnowledgeSyncProfileResolver,
    private readonly parserVersion = 'm2b-drive-runtime-v1'
  ) {}

  async upsertMetadata(): Promise<void> {
    throw new Error('KNOWLEDGE_SYNC_PERSISTENCE_METADATA_ONLY_NOT_ENABLED');
  }

  async quarantine(): Promise<void> {
    throw new Error('KNOWLEDGE_SYNC_PERSISTENCE_QUARANTINE_NOT_ENABLED');
  }

  async ingestContent(
    input: SyncSourceMutation & {
      text: string;
      units: readonly {
        sequence: number;
        unitKind: 'document' | 'section' | 'paragraph' | 'list_item';
        headingPath: readonly string[];
        rawText: string;
        retrievalText: string;
        contentHashSha256: string;
      }[];
    }
  ): Promise<void> {
    const profile = this.resolveProfile(input);
    const normalized = normalizeTextForHash(input.text);
    const versionPayload = {
      drive_revision_id: input.file.version ?? input.file.modifiedTime ?? null,
      content_hash_sha256: hashUtf8Sha256(input.text),
      normalized_content_hash_sha256: hashUtf8Sha256(normalized),
      parser_version: this.parserVersion,
      accepted_content_state: 'accepted_without_suggestions',
      effective_at: input.file.modifiedTime ?? null,
    };
    const unitsPayload = input.units.map((unit) => ({
      sequence: unit.sequence,
      unit_kind: unit.unitKind,
      heading_path: [...unit.headingPath],
      raw_text: unit.rawText,
      retrieval_text: unit.retrievalText,
      content_hash_sha256: unit.contentHashSha256,
      metadata: { deterministic_normalization: true },
    }));

    const { error } = await this.client.rpc('knowledge_sync_ingest', {
      p_source: sourcePayload(input, profile),
      p_version: versionPayload,
      p_units: unitsPayload,
    });
    if (error) throw rpcErrorCode('KNOWLEDGE_SYNC_INGEST', error);
  }

  async purgeByDriveFileId(fileId: string, reasonCode: string): Promise<void> {
    const { error } = await this.client.rpc('knowledge_sync_tombstone', {
      p_drive_file_id: fileId,
      p_reason_code: reasonCode,
    });
    if (error) throw rpcErrorCode('KNOWLEDGE_SYNC_TOMBSTONE', error);
  }

  async saveCheckpoint(input: {
    connectorKey: string;
    rootFolderId: string;
    changePageToken?: string;
    healthState: 'healthy' | 'degraded' | 'blocked';
    kind: 'full_reconcile' | 'delta';
  }): Promise<void> {
    const { error } = await this.client.rpc('knowledge_sync_save_checkpoint', {
      p_connector_key: input.connectorKey,
      p_root_folder_id: input.rootFolderId,
      p_change_page_token: input.changePageToken ?? null,
      p_health_state: input.healthState,
      p_kind: input.kind,
    });
    if (error) throw rpcErrorCode('KNOWLEDGE_SYNC_CHECKPOINT', error);
  }

  async cleanupSyntheticFixture(fileId: string): Promise<boolean> {
    const { data, error } = await this.client.rpc(
      'knowledge_sync_cleanup_synthetic_fixture',
      { p_drive_file_id: fileId }
    );
    if (error) throw rpcErrorCode('KNOWLEDGE_SYNC_FIXTURE_CLEANUP', error);
    return data === true;
  }
}
