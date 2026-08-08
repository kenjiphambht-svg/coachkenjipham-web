import { createHash } from 'node:crypto';
import type {
  KnowledgeSensitivity,
  KnowledgeSourceKind,
} from './contracts';
import { resolveKnowledgeIngestPolicy } from './ingest-policy';
import { resolveRootZoneFromAncestors } from './drive-root-map';

export const GOOGLE_FOLDER_MIME = 'application/vnd.google-apps.folder';
export const GOOGLE_DOC_MIME = 'application/vnd.google-apps.document';

export type DriveFileSnapshot = {
  id: string;
  name: string;
  mimeType: string;
  webViewLink?: string | null;
  parentIds: readonly string[];
  ancestorFolderIds: readonly string[];
  createdTime?: string | null;
  modifiedTime?: string | null;
  version?: string | null;
  md5Checksum?: string | null;
  trashed?: boolean;
  removed?: boolean;
  sourceKind?: KnowledgeSourceKind;
  sensitivity?: KnowledgeSensitivity;
  hasUnresolvedSuggestions?: boolean;
  hasSensitiveSignals?: boolean;
};

export type DriveContentSnapshot = DriveFileSnapshot & {
  text: string;
};

export type DriveSyncDecision =
  | {
      action: 'ignore_folder';
      fileId: string;
      reasonCode: 'FOLDER';
    }
  | {
      action: 'purge';
      fileId: string;
      reasonCode: 'REMOVED_OR_TRASHED' | 'DENY_ZONE' | 'PERMISSION_OR_SCOPE_LOST';
    }
  | {
      action: 'metadata_only' | 'quarantine' | 'ingest_content';
      fileId: string;
      rootZone: NonNullable<ReturnType<typeof resolveRootZoneFromAncestors>>['rootZone'];
      usageMode: ReturnType<typeof resolveKnowledgeIngestPolicy>['usageMode'];
      ingestMode: ReturnType<typeof resolveKnowledgeIngestPolicy>['ingestMode'];
      runtimeEnabled: boolean;
      reasonCode: ReturnType<typeof resolveKnowledgeIngestPolicy>['reasonCode'];
    };

export function planDriveSync(snapshot: DriveFileSnapshot): DriveSyncDecision {
  if (snapshot.mimeType === GOOGLE_FOLDER_MIME) {
    return { action: 'ignore_folder', fileId: snapshot.id, reasonCode: 'FOLDER' };
  }

  if (snapshot.removed || snapshot.trashed) {
    return { action: 'purge', fileId: snapshot.id, reasonCode: 'REMOVED_OR_TRASHED' };
  }

  const root = resolveRootZoneFromAncestors(snapshot.ancestorFolderIds);
  if (!root) {
    return { action: 'purge', fileId: snapshot.id, reasonCode: 'PERMISSION_OR_SCOPE_LOST' };
  }

  if (root.rootZone === '99_private' || root.crawl === 'deny') {
    return { action: 'purge', fileId: snapshot.id, reasonCode: 'DENY_ZONE' };
  }

  const policy = resolveKnowledgeIngestPolicy({
    rootZone: root.rootZone,
    sourceKind: snapshot.sourceKind ?? 'canonical',
    sensitivity: snapshot.sensitivity ?? 'internal',
    hasUnresolvedSuggestions: snapshot.hasUnresolvedSuggestions,
    hasSensitiveSignals: snapshot.hasSensitiveSignals,
  });

  if (policy.ingestMode === 'deny') {
    return { action: 'purge', fileId: snapshot.id, reasonCode: 'DENY_ZONE' };
  }

  if (policy.ingestMode === 'metadata_only' || policy.ingestMode === 'conditional') {
    return {
      action: 'metadata_only',
      fileId: snapshot.id,
      rootZone: root.rootZone,
      usageMode: policy.usageMode,
      ingestMode: policy.ingestMode,
      runtimeEnabled: false,
      reasonCode: policy.reasonCode,
    };
  }

  if (policy.ingestMode === 'quarantine') {
    return {
      action: 'quarantine',
      fileId: snapshot.id,
      rootZone: root.rootZone,
      usageMode: policy.usageMode,
      ingestMode: policy.ingestMode,
      runtimeEnabled: false,
      reasonCode: policy.reasonCode,
    };
  }

  return {
    action: 'ingest_content',
    fileId: snapshot.id,
    rootZone: root.rootZone,
    usageMode: policy.usageMode,
    ingestMode: policy.ingestMode,
    runtimeEnabled: policy.runtimeEnabled,
    reasonCode: policy.reasonCode,
  };
}

export function hashUtf8Sha256(text: string): string {
  return createHash('sha256').update(text, 'utf8').digest('hex');
}

export function normalizeTextForHash(text: string): string {
  return text.replace(/\r\n/g, '\n').replace(/[ \t]+$/gm, '').trim();
}

export function driveRevisionEvidence(snapshot: DriveFileSnapshot): string {
  return [snapshot.version, snapshot.modifiedTime, snapshot.md5Checksum]
    .filter(Boolean)
    .join(':');
}
