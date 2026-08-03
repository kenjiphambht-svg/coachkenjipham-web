import { describe, expect, it } from 'vitest';
import { prepareIsolatedRestorePlan, validateBackupManifest } from '@/lib/recovery/manifest';

const manifest = {
  environment: 'staging' as const,
  createdAt: '2026-08-03T15:00:00Z',
  storagePath: '/Users/macos/Documents/03. RESOURCES/coachkenjipham-backups/essence-staging/2026-08-03-pre-0017-b8',
  artifacts: [
    { filename: 'essence-staging-pre-0017-schema.sql', kind: 'schema' as const, sha256: 'a'.repeat(64) },
    { filename: 'essence-staging-pre-0017-data.sql', kind: 'data' as const, sha256: 'b'.repeat(64) },
  ],
};

describe('B9 backup recovery manifest', () => {
  it('permits only a verified staging snapshot stored outside the repository', () => {
    expect(() => validateBackupManifest(manifest)).not.toThrow();
    expect(prepareIsolatedRestorePlan(manifest)).toMatchObject({
      target: 'isolated_recovery_environment',
      requiresFounderApproval: true,
    });
  });

  it('rejects incomplete, invalid, or repository-local evidence', () => {
    expect(() => validateBackupManifest({ ...manifest, storagePath: '/private/tmp/snapshot' })).toThrow('BACKUP_MUST_BE_OUTSIDE_REPOSITORY');
    expect(() => validateBackupManifest({ ...manifest, artifacts: [manifest.artifacts[0]] })).toThrow('BACKUP_ARTIFACT_SET_INCOMPLETE');
    expect(() => validateBackupManifest({ ...manifest, artifacts: [{ ...manifest.artifacts[0], sha256: 'not-a-sha' }, manifest.artifacts[1]] })).toThrow('INVALID_BACKUP_CHECKSUM');
  });
});
