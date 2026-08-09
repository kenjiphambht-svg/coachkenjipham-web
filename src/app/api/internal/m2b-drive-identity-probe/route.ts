import { NextResponse } from 'next/server';
import { GOOGLE_DOC_MIME, GOOGLE_FOLDER_MIME } from '@/lib/knowledge/drive-sync';
import { ESSENCE_DRIVE_ROOTS } from '@/lib/knowledge/drive-root-map';
import {
  GoogleDriveReadClient,
  type DriveApiFile,
} from '@/lib/knowledge/google-drive-client';
import { getEssenceDriveAccessToken } from '@/lib/knowledge/google-drive-service-account';

export const dynamic = 'force-dynamic';

const EXPECTED_BRANCH = 'agent/m2-drive-sync-mainline';
const READABLE_TEXT_MIMES = new Set([
  GOOGLE_DOC_MIME,
  'text/plain',
  'text/markdown',
  'text/html',
  'application/json',
]);

function rootId(zone: '01_current' | '99_private'): string {
  const root = ESSENCE_DRIVE_ROOTS.find((item) => item.rootZone === zone);
  if (!root) throw new Error('M2B_PROBE_ROOT_MISSING');
  return root.folderId;
}

async function findReadableFile(
  client: GoogleDriveReadClient,
  folderId: string
): Promise<DriveApiFile | null> {
  const queue = [folderId];
  const visited = new Set<string>();

  while (queue.length > 0) {
    const current = queue.shift();
    if (!current || visited.has(current)) continue;
    visited.add(current);

    let pageToken: string | undefined;
    do {
      const page = await client.listChildren(current, pageToken);
      for (const file of page.items) {
        if (file.mimeType === GOOGLE_FOLDER_MIME) {
          queue.push(file.id);
          continue;
        }
        if (READABLE_TEXT_MIMES.has(file.mimeType)) return file;
      }
      pageToken = page.nextPageToken;
    } while (pageToken);
  }

  return null;
}

export async function GET() {
  if (
    process.env.VERCEL_ENV !== 'preview' ||
    process.env.VERCEL_GIT_COMMIT_REF !== EXPECTED_BRANCH
  ) {
    return NextResponse.json({ status: 'not_found' }, { status: 404 });
  }

  const client = new GoogleDriveReadClient(getEssenceDriveAccessToken);

  let allowedFileRead: 'PASS' | 'FAIL' = 'FAIL';
  try {
    const file = await findReadableFile(client, rootId('01_current'));
    if (file) {
      await client.readText(file);
      allowedFileRead = 'PASS';
    }
  } catch {
    allowedFileRead = 'FAIL';
  }

  let privateVaultAccess: 'DENIED' | 'PASS' | 'UNKNOWN' = 'UNKNOWN';
  try {
    await client.getFile(rootId('99_private'));
    privateVaultAccess = 'PASS';
  } catch (error) {
    const message = error instanceof Error ? error.message : '';
    if (
      message === 'GOOGLE_DRIVE_READ_FAILED_403' ||
      message === 'GOOGLE_DRIVE_READ_FAILED_404'
    ) {
      privateVaultAccess = 'DENIED';
    }
  }

  const ok = allowedFileRead === 'PASS' && privateVaultAccess === 'DENIED';
  return NextResponse.json(
    {
      status: ok ? 'PASS' : 'FAIL',
      allowedFileRead,
      privateVaultAccess,
      environment: 'preview',
    },
    { status: ok ? 200 : 503 }
  );
}
