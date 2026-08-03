export interface BackupArtifact {
  filename: string;
  sha256: string;
  kind: 'schema' | 'data';
}

export interface BackupManifest {
  environment: 'staging';
  createdAt: string;
  storagePath: string;
  artifacts: BackupArtifact[];
}

export interface RestorePlan {
  target: 'isolated_recovery_environment';
  requiresFounderApproval: true;
  steps: readonly string[];
}

/**
 * Validates evidence only. It cannot invoke psql, Supabase, or a restore;
 * recovery remains an explicit, Founder-approved incident operation.
 */
export function validateBackupManifest(manifest: BackupManifest): void {
  if (manifest.environment !== 'staging') throw new Error('BACKUP_ENVIRONMENT_NOT_ALLOWED');
  if (!manifest.storagePath.startsWith('/Users/macos/Documents/')) throw new Error('BACKUP_MUST_BE_OUTSIDE_REPOSITORY');
  if (manifest.artifacts.length !== 2) throw new Error('BACKUP_ARTIFACT_SET_INCOMPLETE');
  const kinds = new Set(manifest.artifacts.map((artifact) => artifact.kind));
  if (!kinds.has('schema') || !kinds.has('data')) throw new Error('BACKUP_ARTIFACT_SET_INCOMPLETE');
  for (const artifact of manifest.artifacts) {
    if (!/^[a-f0-9]{64}$/.test(artifact.sha256)) throw new Error('INVALID_BACKUP_CHECKSUM');
    if (artifact.filename.includes('/') || !artifact.filename.endsWith('.sql')) throw new Error('INVALID_BACKUP_FILENAME');
  }
}

export function prepareIsolatedRestorePlan(manifest: BackupManifest): RestorePlan {
  validateBackupManifest(manifest);
  return {
    target: 'isolated_recovery_environment',
    requiresFounderApproval: true,
    steps: [
      'Verify both SHA-256 checksums before any restore.',
      'Create an isolated recovery environment; never use production or the live staging database.',
      'Apply schema dump, then data dump, with a database owner under an approved incident runbook.',
      'Run RLS, token, and application smoke checks before considering any controlled recovery action.',
    ],
  };
}
