import { NextRequest, NextResponse } from 'next/server';
import { GoogleDriveReadClient } from '@/lib/knowledge/google-drive-client';
import { getEssenceDriveAccessToken } from '@/lib/knowledge/google-drive-service-account';
import { createKnowledgeSyncRpcClient } from '@/lib/knowledge/supabase-sync-client';
import { SupabaseKnowledgeSyncRepository } from '@/lib/knowledge/supabase-sync-repository';
import { runDriveDeltaSync, runInitialDriveCrawl } from '@/lib/knowledge/sync-engine';

export const dynamic = 'force-dynamic';

const EXPECTED_BRANCH = 'agent/m2-drive-sync-mainline';
const CONNECTOR_KEY = 'm2b_supabase_fixture_probe';

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
    metadata: {
      m2b_fixture: true,
      synthetic: true,
      automated_drive_identity: true,
      persistence_probe: true,
    },
  };
}

async function checkpointToken(
  client: ReturnType<typeof createKnowledgeSyncRpcClient>
): Promise<string | null> {
  const { data, error } = await client.rpc('knowledge_sync_get_checkpoint', {
    p_connector_key: CONNECTOR_KEY,
  });
  if (error) throw new Error('KNOWLEDGE_SYNC_GET_CHECKPOINT_FAILED');
  const value = data as { change_page_token?: string | null } | null;
  return value?.change_page_token ?? null;
}

async function fixtureStatus(
  client: ReturnType<typeof createKnowledgeSyncRpcClient>,
  fixtureId: string
): Promise<Record<string, unknown>> {
  const { data, error } = await client.rpc('knowledge_sync_synthetic_fixture_status', {
    p_drive_file_id: fixtureId,
  });
  if (error) throw new Error('KNOWLEDGE_SYNC_FIXTURE_STATUS_FAILED');
  return (data ?? { exists: false }) as Record<string, unknown>;
}

export async function GET(request: NextRequest) {
  if (!isAllowedRuntime()) {
    return NextResponse.json({ status: 'not_found' }, { status: 404 });
  }

  const fixtureId = safeFixtureId(request.nextUrl.searchParams.get('fixtureId'));
  const phase = request.nextUrl.searchParams.get('phase');
  if (!fixtureId || !['initial', 'edit', 'removal', 'cleanup'].includes(phase ?? '')) {
    return NextResponse.json({ status: 'invalid_request' }, { status: 400 });
  }

  const rpcClient = createKnowledgeSyncRpcClient();
  const repository = new SupabaseKnowledgeSyncRepository(rpcClient, (input) => {
    if (input.canonicalFileId !== fixtureId) {
      throw new Error('M2B_FIXTURE_PROFILE_ID_MISMATCH');
    }
    return fixtureProfile();
  });

  try {
    if (phase === 'cleanup') {
      const { data, error } = await rpcClient.rpc('knowledge_sync_cleanup_synthetic_fixture', {
        p_drive_file_id: fixtureId,
      });
      if (error) throw new Error('KNOWLEDGE_SYNC_FIXTURE_CLEANUP_FAILED');
      const status = await fixtureStatus(rpcClient, fixtureId);
      const ok = data === true && status.exists === false;
      return NextResponse.json(
        { status: ok ? 'PASS' : 'FAIL', phase, databaseFixtureRemoved: ok },
        { status: ok ? 200 : 503 }
      );
    }

    const driveClient = new GoogleDriveReadClient(getEssenceDriveAccessToken);

    if (phase === 'initial') {
      const summary = await runInitialDriveCrawl({
        client: driveClient,
        repository,
        connectorKey: CONNECTOR_KEY,
        allowedFileIds: [fixtureId],
      });
      const status = await fixtureStatus(rpcClient, fixtureId);
      const token = await checkpointToken(rpcClient);
      const ok =
        summary.ingested === 1 &&
        status.exists === true &&
        status.runtime_enabled === false &&
        status.is_removed === false &&
        Number(status.current_version_count) === 1 &&
        Number(status.unit_count) > 0 &&
        Boolean(token);

      return NextResponse.json(
        {
          status: ok ? 'PASS' : 'FAIL',
          phase,
          persisted: status.exists === true,
          runtimeEnabled: status.runtime_enabled === true,
          currentVersionCount: Number(status.current_version_count ?? 0),
          unitCount: Number(status.unit_count ?? 0),
          checkpoint: token ? 'PASS' : 'FAIL',
        },
        { status: ok ? 200 : 503 }
      );
    }

    const token = await checkpointToken(rpcClient);
    if (!token) {
      return NextResponse.json({ status: 'FAIL', phase, errorCode: 'M2B_CHECKPOINT_MISSING' }, { status: 503 });
    }

    const result = await runDriveDeltaSync({
      client: driveClient,
      repository,
      startPageToken: token,
      connectorKey: CONNECTOR_KEY,
      allowedFileIds: [fixtureId],
    });
    const status = await fixtureStatus(rpcClient, fixtureId);

    const ok =
      phase === 'edit'
        ? result.summary.ingested === 1 &&
          status.exists === true &&
          status.is_removed === false &&
          Number(status.version_count) >= 2 &&
          Number(status.current_version_count) === 1
        : result.summary.purged === 1 &&
          status.exists === true &&
          status.runtime_enabled === false &&
          status.is_removed === true &&
          Number(status.removed_version_count) >= 1;

    return NextResponse.json(
      {
        status: ok ? 'PASS' : 'FAIL',
        phase,
        ingested: result.summary.ingested,
        purged: result.summary.purged,
        versionCount: Number(status.version_count ?? 0),
        currentVersionCount: Number(status.current_version_count ?? 0),
        removedVersionCount: Number(status.removed_version_count ?? 0),
        removed: status.is_removed === true,
        checkpoint: 'PASS',
      },
      { status: ok ? 200 : 503 }
    );
  } catch (error) {
    const code =
      error instanceof Error && /^[A-Z0-9_]+$/.test(error.message)
        ? error.message
        : 'M2B_SUPABASE_PROBE_FAILED';
    console.warn(`[M2B_SUPABASE_PROBE] phase=${phase} errorCode=${code}`);
    return NextResponse.json({ status: 'FAIL', phase, errorCode: code }, { status: 503 });
  }
}
