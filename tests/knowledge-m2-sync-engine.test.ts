import { describe, expect, it, vi } from 'vitest';
import { ESSENCE_DRIVE_ROOT_ID } from '@/lib/knowledge/drive-root-map';
import { runDriveDeltaSync, runInitialDriveCrawl, type KnowledgeSyncRepository } from '@/lib/knowledge/sync-engine';
import type { DriveApiFile, GoogleDriveReadClient } from '@/lib/knowledge/google-drive-client';

function makeRepository(): KnowledgeSyncRepository {
  return {
    upsertMetadata: vi.fn(async () => undefined),
    ingestContent: vi.fn(async () => undefined),
    quarantine: vi.fn(async () => undefined),
    purgeByDriveFileId: vi.fn(async () => undefined),
    saveCheckpoint: vi.fn(async () => undefined),
  };
}

describe('M2 sync engine', () => {
  it('skips the private root, ingests current text, and stores the canonical root checkpoint', async () => {
    const currentRoot = '1yoB3Cx2h8ysVaFmk5WnpogIAHl0qnCbC';
    const privateRoot = '1IlxV2oS1oVUVfL1NJ_Gx8AjMokCIwaZG';
    const doc: DriveApiFile = {
      id: 'current-doc',
      name: 'Current.md',
      mimeType: 'text/markdown',
      parents: [currentRoot],
    };

    const listChildren = vi.fn(async (folderId: string) => ({
      items: folderId === currentRoot ? [doc] : [],
    }));
    const client = {
      listChildren,
      getStartPageToken: vi.fn(async () => 'start-2'),
      readText: vi.fn(async () => '# Current\n\nApproved truth.'),
      hasUnresolvedSuggestions: vi.fn(async () => false),
    } as unknown as GoogleDriveReadClient;
    const repository = makeRepository();

    const result = await runInitialDriveCrawl({ client, repository });

    expect(result.ingested).toBe(1);
    expect(listChildren.mock.calls.map((call) => call[0])).not.toContain(privateRoot);
    expect(repository.ingestContent).toHaveBeenCalledTimes(1);
    expect(repository.saveCheckpoint).toHaveBeenCalledWith({
      connectorKey: 'google_drive_essence_library',
      rootFolderId: ESSENCE_DRIVE_ROOT_ID,
      changePageToken: 'start-2',
      healthState: 'healthy',
      kind: 'full_reconcile',
    });
  });

  it('reads content only for explicitly allowlisted files during a controlled crawl', async () => {
    const currentRoot = '1yoB3Cx2h8ysVaFmk5WnpogIAHl0qnCbC';
    const allowed: DriveApiFile = {
      id: 'allowed-current-doc',
      name: 'Allowed.md',
      mimeType: 'text/markdown',
      parents: [currentRoot],
    };
    const outsideBatch: DriveApiFile = {
      id: 'other-current-doc',
      name: 'Other.md',
      mimeType: 'text/markdown',
      parents: [currentRoot],
    };
    const client = {
      listChildren: vi.fn(async (folderId: string) => ({
        items: folderId === currentRoot ? [allowed, outsideBatch] : [],
      })),
      getStartPageToken: vi.fn(async () => 'start-controlled'),
      readText: vi.fn(async (file: DriveApiFile) => `# ${file.name}\n\nAllowed truth.`),
      hasUnresolvedSuggestions: vi.fn(async () => false),
    } as unknown as GoogleDriveReadClient;
    const repository = makeRepository();

    const result = await runInitialDriveCrawl({
      client,
      repository,
      connectorKey: 'm2b_controlled',
      allowedFileIds: ['allowed-current-doc'],
    });

    expect(result.ingested).toBe(1);
    expect(result.ignoredByAllowlist).toBe(1);
    expect(client.readText).toHaveBeenCalledTimes(1);
    expect(repository.ingestContent).toHaveBeenCalledTimes(1);
    expect(repository.ingestContent).toHaveBeenCalledWith(
      expect.objectContaining({ canonicalFileId: 'allowed-current-doc' })
    );
  });

  it('purges a removed Drive change and advances the checkpoint only after the page is processed', async () => {
    const client = {
      listChanges: vi.fn(async () => ({
        items: [{ fileId: 'removed-file', removed: true }],
        newStartPageToken: 'stable-3',
      })),
    } as unknown as GoogleDriveReadClient;
    const repository = makeRepository();

    const result = await runDriveDeltaSync({ client, repository, startPageToken: 'stable-2' });

    expect(result.summary.purged).toBe(1);
    expect(result.newStartPageToken).toBe('stable-3');
    expect(repository.purgeByDriveFileId).toHaveBeenCalledWith('removed-file', 'REMOVED_OR_PERMISSION_LOST');
    expect(repository.saveCheckpoint).toHaveBeenCalledWith(expect.objectContaining({
      rootFolderId: ESSENCE_DRIVE_ROOT_ID,
      changePageToken: 'stable-3',
      kind: 'delta',
    }));
  });

  it('ignores out-of-batch delta removals when a controlled allowlist is active', async () => {
    const client = {
      listChanges: vi.fn(async () => ({
        items: [
          { fileId: 'allowed-file', removed: true },
          { fileId: 'outside-batch', removed: true },
        ],
        newStartPageToken: 'stable-controlled',
      })),
    } as unknown as GoogleDriveReadClient;
    const repository = makeRepository();

    const result = await runDriveDeltaSync({
      client,
      repository,
      startPageToken: 'stable-2',
      allowedFileIds: new Set(['allowed-file']),
    });

    expect(result.summary.purged).toBe(1);
    expect(result.summary.ignoredByAllowlist).toBe(1);
    expect(repository.purgeByDriveFileId).toHaveBeenCalledTimes(1);
    expect(repository.purgeByDriveFileId).toHaveBeenCalledWith('allowed-file', 'REMOVED_OR_PERMISSION_LOST');
  });

  it('fails closed when a delta page does not return a new stable start token', async () => {
    const client = {
      listChanges: vi.fn(async () => ({ items: [] })),
    } as unknown as GoogleDriveReadClient;
    const repository = makeRepository();

    await expect(
      runDriveDeltaSync({ client, repository, startPageToken: 'stable-2' })
    ).rejects.toThrow('GOOGLE_DRIVE_NEW_START_TOKEN_MISSING');
    expect(repository.saveCheckpoint).not.toHaveBeenCalled();
  });
});
