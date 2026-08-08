import { GOOGLE_DOC_MIME, GOOGLE_FOLDER_MIME, planDriveSync, type DriveFileSnapshot } from './drive-sync';
import { ESSENCE_DRIVE_ROOT_ID, ESSENCE_DRIVE_ROOTS, getDriveRootPolicy } from './drive-root-map';
import { GOOGLE_SHORTCUT_MIME, type DriveApiFile, type DriveApiChange, GoogleDriveReadClient } from './google-drive-client';
import { normalizeKnowledgeText, type NormalizedKnowledgeUnit } from './normalize';

export type SyncSourceMutation = {
  file: DriveApiFile;
  canonicalFileId: string;
  canonicalPath: string;
  ancestorFolderIds: readonly string[];
  decision: ReturnType<typeof planDriveSync>;
  text?: string;
  units?: readonly NormalizedKnowledgeUnit[];
};

export interface KnowledgeSyncRepository {
  upsertMetadata(input: SyncSourceMutation): Promise<void>;
  ingestContent(input: SyncSourceMutation & { text: string; units: readonly NormalizedKnowledgeUnit[] }): Promise<void>;
  quarantine(input: SyncSourceMutation): Promise<void>;
  purgeByDriveFileId(fileId: string, reasonCode: string): Promise<void>;
  saveCheckpoint(input: {
    connectorKey: string;
    rootFolderId: string;
    changePageToken?: string;
    healthState: 'healthy' | 'degraded' | 'blocked';
    kind: 'full_reconcile' | 'delta';
  }): Promise<void>;
}

export type SyncRunSummary = {
  discovered: number;
  ingested: number;
  metadataOnly: number;
  quarantined: number;
  purged: number;
  ignoredFolders: number;
};

function emptySummary(): SyncRunSummary {
  return { discovered: 0, ingested: 0, metadataOnly: 0, quarantined: 0, purged: 0, ignoredFolders: 0 };
}

function joinPath(parentPath: string, name: string): string {
  return `${parentPath.replace(/\/$/, '')}/${name}`;
}

async function resolveAncestorIds(client: GoogleDriveReadClient, file: DriveApiFile): Promise<string[]> {
  const ancestors: string[] = [];
  const queue = [...(file.parents ?? [])];
  const visited = new Set<string>();

  while (queue.length > 0) {
    const parentId = queue.shift()!;
    if (visited.has(parentId)) continue;
    visited.add(parentId);
    ancestors.push(parentId);
    if (getDriveRootPolicy(parentId)) break;
    const parent = await client.getFile(parentId);
    queue.push(...(parent.parents ?? []));
  }

  return ancestors;
}

async function prepareFile(
  client: GoogleDriveReadClient,
  file: DriveApiFile,
  ancestorFolderIds: readonly string[],
  canonicalPath: string
): Promise<{ file: DriveApiFile; snapshot: DriveFileSnapshot; canonicalFileId: string; canonicalPath: string }> {
  if (file.mimeType !== GOOGLE_SHORTCUT_MIME) {
    const hasUnresolvedSuggestions =
      file.mimeType === GOOGLE_DOC_MIME ? await client.hasUnresolvedSuggestions(file.id) : false;
    return {
      file,
      snapshot: {
        id: file.id,
        name: file.name,
        mimeType: file.mimeType,
        webViewLink: file.webViewLink,
        parentIds: file.parents ?? [],
        ancestorFolderIds,
        createdTime: file.createdTime,
        modifiedTime: file.modifiedTime,
        version: file.version,
        md5Checksum: file.md5Checksum,
        trashed: file.trashed,
        hasUnresolvedSuggestions,
      },
      canonicalFileId: file.id,
      canonicalPath,
    };
  }

  const target = await client.resolveShortcut(file);
  const targetAncestors = await resolveAncestorIds(client, target);
  const hasUnresolvedSuggestions =
    target.mimeType === GOOGLE_DOC_MIME ? await client.hasUnresolvedSuggestions(target.id) : false;

  return {
    file: target,
    snapshot: {
      id: target.id,
      name: target.name,
      mimeType: target.mimeType,
      webViewLink: target.webViewLink,
      parentIds: target.parents ?? [],
      ancestorFolderIds: targetAncestors,
      createdTime: target.createdTime,
      modifiedTime: target.modifiedTime,
      version: target.version,
      md5Checksum: target.md5Checksum,
      trashed: target.trashed,
      hasUnresolvedSuggestions,
    },
    canonicalFileId: target.id,
    canonicalPath: `${canonicalPath} -> ${target.name}`,
  };
}

async function applyPreparedFile(
  client: GoogleDriveReadClient,
  repository: KnowledgeSyncRepository,
  prepared: Awaited<ReturnType<typeof prepareFile>>,
  summary: SyncRunSummary
): Promise<void> {
  summary.discovered += 1;
  const decision = planDriveSync(prepared.snapshot);
  const mutation: SyncSourceMutation = {
    file: prepared.file,
    canonicalFileId: prepared.canonicalFileId,
    canonicalPath: prepared.canonicalPath,
    ancestorFolderIds: prepared.snapshot.ancestorFolderIds,
    decision,
  };

  if (decision.action === 'ignore_folder') {
    summary.ignoredFolders += 1;
    return;
  }
  if (decision.action === 'purge') {
    await repository.purgeByDriveFileId(prepared.canonicalFileId, decision.reasonCode);
    summary.purged += 1;
    return;
  }
  if (decision.action === 'quarantine') {
    await repository.quarantine(mutation);
    summary.quarantined += 1;
    return;
  }
  if (decision.action === 'metadata_only') {
    await repository.upsertMetadata(mutation);
    summary.metadataOnly += 1;
    return;
  }

  const text = await client.readText(prepared.file);
  const units = normalizeKnowledgeText({ documentTitle: prepared.file.name, text });
  await repository.ingestContent({ ...mutation, text, units });
  summary.ingested += 1;
}

export async function runInitialDriveCrawl(input: {
  client: GoogleDriveReadClient;
  repository: KnowledgeSyncRepository;
  connectorKey?: string;
}): Promise<SyncRunSummary> {
  const summary = emptySummary();

  for (const root of ESSENCE_DRIVE_ROOTS) {
    if (root.crawl === 'deny') continue;
    const queue: Array<{ folderId: string; path: string; ancestors: string[] }> = [
      { folderId: root.folderId, path: root.title, ancestors: [root.folderId] },
    ];

    while (queue.length > 0) {
      const current = queue.shift()!;
      let pageToken: string | undefined;
      do {
        const page = await input.client.listChildren(current.folderId, pageToken);
        for (const file of page.items) {
          const path = joinPath(current.path, file.name);
          if (file.mimeType === GOOGLE_FOLDER_MIME) {
            queue.push({
              folderId: file.id,
              path,
              ancestors: [file.id, ...current.ancestors],
            });
            summary.ignoredFolders += 1;
            continue;
          }
          const prepared = await prepareFile(input.client, file, current.ancestors, path);
          await applyPreparedFile(input.client, input.repository, prepared, summary);
        }
        pageToken = page.nextPageToken;
      } while (pageToken);
    }
  }

  const changePageToken = await input.client.getStartPageToken();
  await input.repository.saveCheckpoint({
    connectorKey: input.connectorKey ?? 'google_drive_essence_library',
    rootFolderId: ESSENCE_DRIVE_ROOT_ID,
    changePageToken,
    healthState: 'healthy',
    kind: 'full_reconcile',
  });
  return summary;
}

async function processChange(
  client: GoogleDriveReadClient,
  repository: KnowledgeSyncRepository,
  change: DriveApiChange,
  summary: SyncRunSummary
): Promise<void> {
  if (change.removed || !change.file) {
    await repository.purgeByDriveFileId(change.fileId, 'REMOVED_OR_PERMISSION_LOST');
    summary.purged += 1;
    return;
  }

  const ancestors = await resolveAncestorIds(client, change.file);
  const prepared = await prepareFile(client, change.file, ancestors, change.file.name);
  await applyPreparedFile(client, repository, prepared, summary);
}

export async function runDriveDeltaSync(input: {
  client: GoogleDriveReadClient;
  repository: KnowledgeSyncRepository;
  startPageToken: string;
  connectorKey?: string;
}): Promise<{ summary: SyncRunSummary; newStartPageToken: string }> {
  const summary = emptySummary();
  let pageToken: string | undefined = input.startPageToken;
  let newStartPageToken: string | undefined;

  do {
    const page = await input.client.listChanges(pageToken!);
    for (const change of page.items) {
      await processChange(input.client, input.repository, change, summary);
    }
    if (page.newStartPageToken) newStartPageToken = page.newStartPageToken;
    pageToken = page.nextPageToken;
  } while (pageToken);

  if (!newStartPageToken) throw new Error('GOOGLE_DRIVE_NEW_START_TOKEN_MISSING');
  await input.repository.saveCheckpoint({
    connectorKey: input.connectorKey ?? 'google_drive_essence_library',
    rootFolderId: ESSENCE_DRIVE_ROOT_ID,
    changePageToken: newStartPageToken,
    healthState: 'healthy',
    kind: 'delta',
  });
  return { summary, newStartPageToken };
}
