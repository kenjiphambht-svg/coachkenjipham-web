import { NextRequest, NextResponse } from 'next/server';
import { ESSENCE_DRIVE_ROOT_ID } from '@/lib/knowledge/drive-root-map';
import { GoogleDriveReadClient } from '@/lib/knowledge/google-drive-client';
import { getEssenceDriveAccessToken } from '@/lib/knowledge/google-drive-service-account';
import {
  runDriveDeltaSync,
  runInitialDriveCrawl,
  type KnowledgeSyncRepository,
  type SyncSourceMutation,
} from '@/lib/knowledge/sync-engine';

export const dynamic = 'force-dynamic';

const EXPECTED_BRANCH = 'agent/m2-drive-sync-mainline';
const CONNECTOR_KEY = 'm2b_runtime_fixture_probe';

type Checkpoint = {
  rootFolderId: string;
  changePageToken?: string;
  kind: 'full_reconcile' | 'delta';
};

class ProbeRepository implements KnowledgeSyncRepository {
  readonly ingestedFileIds: string[] = [];
  readonly metadataFileIds: string[] = [];
  readonly quarantinedFileIds: string[] = [];
  readonly purgedFileIds: string[] = [];
  checkpoint?: Checkpoint;

  async upsertMetadata(input: SyncSourceMutation): Promise<void> {
    this.metadataFileIds.push(input.canonicalFileId);
  }

  async ingestContent(
    input: SyncSourceMutation & { text: string }
  ): Promise<void> {
    this.ingestedFileIds.push(input.canonicalFileId);
  }

  async quarantine(input: SyncSourceMutation): Promise<void> {
    this.quarantinedFileIds.push(input.canonicalFileId);
  }

  async purgeByDriveFileId(fileId: string): Promise<void> {
    this.purgedFileIds.push(fileId);
  }

  async saveCheckpoint(input: {
    rootFolderId: string;
    changePageToken?: string;
    kind: 'full_reconcile' | 'delta';
  }): Promise<void> {
    this.checkpoint = {
      rootFolderId: input.rootFolderId,
      changePageToken: input.changePageToken,
      kind: input.kind,
    };
  }
}

function isAllowedRuntime(): boolean {
  return (
    process.env.VERCEL_ENV === 'preview' &&
    process.env.VERCEL_GIT_COMMIT_REF === EXPECTED_BRANCH
  );
}

function safeFixtureId(value: string | null): string | null {
  if (!value || !/^[A-Za-z0-9_-]{10,256}$/.test(value)) return null;
  return value;
}

export async function GET(request: NextRequest) {
  if (!isAllowedRuntime()) {
    return NextResponse.json({ status: 'not_found' }, { status: 404 });
  }

  const fixtureId = safeFixtureId(request.nextUrl.searchParams.get('fixtureId'));
  const phase = request.nextUrl.searchParams.get('phase');
  if (!fixtureId || (phase !== 'initial' && phase !== 'edit' && phase !== 'removal')) {
    return NextResponse.json({ status: 'invalid_request' }, { status: 400 });
  }

  const client = new GoogleDriveReadClient(getEssenceDriveAccessToken);
  const repository = new ProbeRepository();

  try {
    if (phase === 'initial') {
      const summary = await runInitialDriveCrawl({
        client,
        repository,
        connectorKey: CONNECTOR_KEY,
        allowedFileIds: [fixtureId],
      });
      const startPageToken = repository.checkpoint?.changePageToken;
      const ok =
        summary.ingested === 1 &&
        repository.ingestedFileIds.length === 1 &&
        repository.ingestedFileIds[0] === fixtureId &&
        repository.checkpoint?.rootFolderId === ESSENCE_DRIVE_ROOT_ID &&
        repository.checkpoint?.kind === 'full_reconcile' &&
        Boolean(startPageToken);

      return NextResponse.json(
        {
          status: ok ? 'PASS' : 'FAIL',
          phase,
          ingested: summary.ingested,
          ignoredByAllowlist: summary.ignoredByAllowlist,
          checkpoint: ok ? 'PASS' : 'FAIL',
          startPageToken: ok ? startPageToken : undefined,
        },
        { status: ok ? 200 : 503 }
      );
    }

    const startPageToken = request.nextUrl.searchParams.get('startPageToken');
    if (!startPageToken || startPageToken.length > 2048) {
      return NextResponse.json({ status: 'invalid_start_token' }, { status: 400 });
    }

    const result = await runDriveDeltaSync({
      client,
      repository,
      startPageToken,
      connectorKey: CONNECTOR_KEY,
      allowedFileIds: [fixtureId],
    });

    const observed =
      phase === 'edit'
        ? result.summary.ingested === 1 &&
          repository.ingestedFileIds.length === 1 &&
          repository.ingestedFileIds[0] === fixtureId
        : result.summary.purged === 1 &&
          repository.purgedFileIds.length === 1 &&
          repository.purgedFileIds[0] === fixtureId;

    const checkpointOk =
      repository.checkpoint?.rootFolderId === ESSENCE_DRIVE_ROOT_ID &&
      repository.checkpoint?.kind === 'delta' &&
      repository.checkpoint?.changePageToken === result.newStartPageToken;

    const ok = observed && checkpointOk;
    return NextResponse.json(
      {
        status: ok ? 'PASS' : 'FAIL',
        phase,
        ingested: result.summary.ingested,
        purged: result.summary.purged,
        ignoredByAllowlist: result.summary.ignoredByAllowlist,
        checkpoint: checkpointOk ? 'PASS' : 'FAIL',
        newStartPageToken: ok ? result.newStartPageToken : undefined,
      },
      { status: ok ? 200 : 503 }
    );
  } catch (error) {
    const code =
      error instanceof Error && /^[A-Z0-9_]+$/.test(error.message)
        ? error.message
        : 'M2B_RUNTIME_PROBE_FAILED';

    // Safe diagnostic only: never log fixture IDs, tokens, Drive content or credentials.
    console.warn(`[M2B_RUNTIME_PROBE] phase=${phase} errorCode=${code}`);

    return NextResponse.json(
      {
        status: 'FAIL',
        phase,
        errorCode: code,
      },
      { status: 503 }
    );
  }
}
