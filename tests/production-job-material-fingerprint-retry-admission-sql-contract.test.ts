import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const migration = readFileSync(
  resolve(process.cwd(), 'supabase/migrations/20260815134000_launch_core_job_material_fingerprint_retry_admission.sql'),
  'utf8'
);
const rollback = readFileSync(
  resolve(process.cwd(), 'supabase/rollbacks/20260815134000_launch_core_job_material_fingerprint_retry_admission_down.sql'),
  'utf8'
);

const unchangedConcurrency = readFileSync(
  resolve(process.cwd(), 'supabase/migrations/20260814035042_launch_core_production_job_attempt_concurrency_guard.sql'),
  'utf8'
);
const unchangedSingleSuccess = readFileSync(
  resolve(process.cwd(), 'supabase/migrations/20260814035327_launch_core_production_job_single_success_guard.sql'),
  'utf8'
);
const unchangedLineage = readFileSync(
  resolve(process.cwd(), 'supabase/migrations/20260814050321_launch_core_production_lineage_closure.sql'),
  'utf8'
);

describe('WO-P07-B5 canonical Job material fingerprint', () => {
  it('stores canonical evidence directly on Job and validates full lowercase SHA-256 without backfill', () => {
    expect(migration).toMatch(/alter table production\.jobs\s+add column input_fingerprint text/i);
    expect(migration).toMatch(/input_fingerprint is null or input_fingerprint ~ '\^\[0-9a-f\]\{64\}\$'/i);
    expect(migration).toMatch(/JOB_INPUT_FINGERPRINT_REQUIRED/);
    expect(migration).not.toMatch(/update\s+production\.jobs\s+set\s+input_fingerprint/i);
  });

  it('makes canonical Job fingerprint immutable, including legacy NULL -> value rewrites', () => {
    expect(migration).toMatch(/NEW\.input_fingerprint is distinct from OLD\.input_fingerprint/i);
    expect(migration).toMatch(/JOB_INPUT_FINGERPRINT_IMMUTABLE/);
  });

  it('requires retry admission evidence and exact equality to canonical Job fingerprint', () => {
    expect(migration).toMatch(/add column admission_input_fingerprint text/i);
    expect(migration).toMatch(/if NEW\.attempt_number <= 1 then\s+return NEW/i);
    expect(migration).toMatch(/JOB_RETRY_CANONICAL_INPUT_FINGERPRINT_MISSING/);
    expect(migration).toMatch(/JOB_RETRY_INPUT_FINGERPRINT_REQUIRED/);
    expect(migration).toMatch(/NEW\.admission_input_fingerprint is distinct from v_canonical_fingerprint/i);
    expect(migration).toMatch(/JOB_RETRY_INPUT_FINGERPRINT_MISMATCH_REVISION_REQUIRED/);
  });

  it('does not overload other authority fields or alter canonical identity keys', () => {
    const ddlWithoutComments = migration.replace(/--.*$/gm, '').replace(/comment on[\s\S]*?;/gi, '');
    expect(ddlWithoutComments).not.toMatch(/alter\s+column\s+idempotency_key|set\s+idempotency_key|provider_execution_reference\s*=|failure_reason\s*=|content_digest\s*=/i);
    expect(ddlWithoutComments).not.toMatch(/create\s+table|drop\s+(table|constraint|index)|alter\s+table\s+production\.(artifacts|artifact_versions)/i);
  });
});

describe('existing atomic and immutable-history guards remain unchanged', () => {
  it('keeps one-running and one-success partial unique indexes', () => {
    expect(unchangedConcurrency).toMatch(/create unique index job_attempts_one_running_per_job_idx[\s\S]*where status = 'running'/i);
    expect(unchangedSingleSuccess).toMatch(/create unique index job_attempts_one_succeeded_per_job_idx[\s\S]*where status = 'succeeded'/i);
  });

  it('keeps output-registration replay guard and successful-origin requirement', () => {
    expect(unchangedLineage).toMatch(/artifact_versions_unique_artifact_attempt unique \(artifact_id, job_attempt_id\)/i);
    expect(unchangedLineage).toMatch(/ARTIFACT_VERSION_REQUIRES_SUCCESSFUL_ATTEMPT/);
  });
});

describe('rollback / forward recovery', () => {
  it('refuses destructive rollback after provenance has been adopted', () => {
    expect(rollback).toMatch(/production\.jobs where input_fingerprint is not null/i);
    expect(rollback).toMatch(/production\.job_attempts where admission_input_fingerprint is not null/i);
    expect(rollback).toMatch(/JOB_FINGERPRINT_ROLLBACK_REQUIRES_FORWARD_RECOVERY/);
  });

  it('contains no fabricated or inferred backfill', () => {
    expect(rollback).not.toMatch(/update\s+production\.(jobs|job_attempts)/i);
    expect(migration).not.toMatch(/digest\s*\(|md5\s*\(|idempotency_key\s*\|\||metadata\s*->/i);
  });
});
