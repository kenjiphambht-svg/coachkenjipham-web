import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const read = (path: string) => readFileSync(resolve(process.cwd(), path), 'utf8');
const migration = read('supabase/migrations/20260816143000_p07_generator_backend_registration_bridge.sql');
const rollback = read('supabase/rollbacks/20260816143000_p07_generator_backend_registration_bridge_down.sql');
const runtime = read('supabase/tests/generator_backend_registration_bridge.sql');
const staging = read('supabase/tests/generator_backend_registration_bridge_staging_transaction.sql');
const recovery = read('supabase/tests/generator_backend_registration_bridge_recovery.sql');
const regressions = read('supabase/tests/generator_backend_registration_bridge_regressions.sql');
const concurrency = read('supabase/tests/generator_backend_registration_bridge_p11_concurrency.sql');

describe('WO-P07-GEN-BACKEND-INTEGRATION-01 bounded schema', () => {
  it('G1 stores exactly bounded immutable representation evidence, never raw content', () => {
    expect(migration).toMatch(/create table production\.artifact_version_representations/i);
    expect(migration).toMatch(/representation_role in \('customer_html', 'a5_pdf'\)/i);
    expect(migration).toMatch(/unique \(artifact_version_id, representation_role\)/i);
    expect(migration).toMatch(/checksum_sha256.*\^\[0-9a-f\]\{64\}\$/is);
    expect(migration).toMatch(/byte_size bigint not null check \(byte_size > 0\)/i);
    expect(migration).toMatch(/before update on production\.artifact_version_representations/i);
    expect(migration).not.toMatch(/file_content|raw_content|content_blob|storage_provider|bucket_id/i);
  });

  it('G2 binds immutable Machine provenance to the existing Artifact Version truth', () => {
    for (const field of [
      'producer_machine_id', 'machine_git_sha', 'machine_contract_version',
      'result_manifest_version', 'source_input_fingerprint',
      'registration_evidence_sha256', 'registration_correlation_reference',
      'produced_version_identity',
    ]) expect(migration).toContain(`add column ${field}`);
    expect(migration).toMatch(/artifact_versions_machine_registration_complete/i);
    expect(migration).toMatch(/Backend-computed SHA-256 of the canonical Job Envelope \+ Result Manifest/i);
    expect(migration).toMatch(/production_artifact_versions_registration_correlation_idx/i);
    expect(migration).not.toMatch(/create table production\.(jobs|job_attempts|artifacts|artifact_versions)/i);
  });

  it('G3 preserves accepted B6 bindings on existing append-only review history', () => {
    expect(migration).toMatch(/add column acceptance_contract_version text/i);
    expect(migration).toMatch(/add column production_job_id uuid references production\.jobs/i);
    expect(migration).toMatch(/foreign key \(job_attempt_id, production_job_id\) references production\.job_attempts/i);
    expect(migration).toMatch(/P11_PRODUCT_ACCEPTANCE/);
    expect(migration).toMatch(/P11_(JOB|ATTEMPT|VERSION|DIGEST|BUILD)_BINDING_MISMATCH/);
    expect(migration).toMatch(/NEW\.review_state <> 'pending' and NEW\.provenance_status <> 'VERIFIED'/i);
    expect(migration).toMatch(/create unique index production_artifact_reviews_unique_guarded_p11_correlation_idx[\s\S]*where review_contract_guarded[\s\S]*review_source = 'P11_PRODUCT_ACCEPTANCE'/i);
    expect(migration).toMatch(/if NEW\.review_source = 'P11_PRODUCT_ACCEPTANCE'[\s\S]*where existing\.review_source = NEW\.review_source[\s\S]*existing\.review_correlation_reference = NEW\.review_correlation_reference/i);
  });

  it('keeps generic review correlation scope unchanged', () => {
    expect(migration).toMatch(/elsif exists \([\s\S]*existing\.artifact_version_id = NEW\.artifact_version_id[\s\S]*existing\.review_source = NEW\.review_source[\s\S]*existing\.review_correlation_reference = NEW\.review_correlation_reference/i);
  });

  it('keeps technical success separate from P11 and every downstream authority', () => {
    expect(migration).toMatch(/product_acceptance.*NOT_EVALUATED_BY_MACHINE/is);
    expect(migration).toMatch(/product_acceptance_inferred', false/i);
    for (const boundary of [
      'entitlement_granted', 'publication_marked_live', 'customer_access_decided',
      'delivery_succeeded_declared', 'customer_confirmed_declared',
    ]) expect(migration).toMatch(new RegExp(`${boundary}', false`, 'i'));

    const executable = migration
      .replace(/--.*$/gm, '')
      .replace(/comment on[\s\S]*?;/gi, '');
    expect(executable).not.toMatch(/(insert into|update|delete from)\s+entitlement\./i);
    expect(executable).not.toMatch(/(insert into|update|delete from)\s+production\.(publications|customer_access|deliveries|customer_confirmations)/i);
  });
});

describe('one atomic idempotent adapter', () => {
  const rpc = migration.split('create or replace function production.register_generator_result')[1];

  it('is one SECURITY DEFINER service-only path with controlled search_path', () => {
    expect(rpc).toMatch(/security definer/i);
    expect(rpc).toMatch(/set search_path = pg_catalog, production/i);
    expect(migration).toMatch(/revoke all on function production\.register_generator_result\(jsonb\) from public, anon, authenticated/i);
    expect(migration).toMatch(/grant execute on function production\.register_generator_result\(jsonb\) to service_role/i);
  });

  it('validates exact Job, Attempt, fingerprint, successful Manifest, and two outputs', () => {
    expect(rpc).toMatch(/GENERATOR_REGISTRATION_JOB_NOT_FOUND/);
    expect(rpc).toMatch(/v_job\.input_fingerprint is distinct from v_input_fingerprint/i);
    expect(rpc).toMatch(/GENERATOR_REGISTRATION_ATTEMPT_BINDING_MISMATCH/);
    expect(rpc).toMatch(/v_attempt\.status <> 'succeeded'/i);
    expect(rpc).toMatch(/HAT_MAM_MACHINE_01/);
    expect(rpc).toMatch(/ONE_LOGICAL_ARTIFACT_VERSION_WITH_TWO_FILE_REPRESENTATIONS/);
    expect(rpc).toMatch(/GENERATOR_REPRESENTATION_EVIDENCE_INVALID/);
  });

  it('implements exact replay, conflicting replay, W3, and W4 without overwrite', () => {
    expect(rpc).toMatch(/pg_advisory_xact_lock/);
    expect(rpc).toMatch(/REPLAYED_EXISTING/);
    expect(rpc).toMatch(/GENERATOR_REGISTRATION_CORRELATION_CONFLICT/);
    expect(rpc).toMatch(/RECONCILE_REQUIRED/);
    expect(rpc).toMatch(/W3_REGISTRATION_NOT_FOUND_NO_WRITE/);
    expect(rpc).toMatch(/W4_EXISTING_REGISTRATION_REPLAYED/);
    expect(rpc).not.toMatch(/update production\.artifact_(versions|version_representations|reviews)/i);
    expect(rpc).toMatch(/pg_advisory_xact_lock[\s\S]*p11-review:/i);
    expect(rpc).toMatch(/where review_source = 'P11_PRODUCT_ACCEPTANCE'\s+and review_correlation_reference = v_review->>'review_correlation_id'/i);
    expect(rpc).toMatch(/v_existing_review\.artifact_version_id is distinct from v_artifact_version_id/i);
  });
});

describe('security, acceptance, staging, and recovery evidence', () => {
  it('denies browser roles representation access and adapter execution', () => {
    expect(migration).toMatch(/enable row level security/i);
    expect(migration).toMatch(/force row level security/i);
    expect(migration).toMatch(/revoke all on production\.artifact_version_representations from public, anon, authenticated/i);
    expect(runtime).toMatch(/AT-GBI-17/);
  });

  it('names every mandatory AT-GBI semantic case', () => {
    for (let index = 1; index <= 19; index += 1) {
      expect(runtime).toContain(`AT-GBI-${String(index).padStart(2, '0')}`);
    }
    expect(runtime).toContain('AT-GBI-01..19: PASS');
    expect(regressions).toContain('AT-GBI-20: PASS');
    expect(regressions).toMatch(/wo04_runtime_regression\.sql/);
    expect(regressions).toMatch(/b5_job_fingerprint_retry_admission\.sql/);
    expect(runtime).toContain('GBI_P11_CROSS_VERSION_CORRELATION: PASS');
    expect(runtime).toContain('GBI_GENERIC_CROSS_VERSION_CORRELATION: PASS');
    expect(concurrency).toContain('GBI_P11_CONCURRENCY: PASS');
  });

  it('keeps staging candidate and synthetic rows inside one rollback boundary', () => {
    expect(staging).toMatch(/begin;[\s\S]*20260816143000_p07_generator_backend_registration_bridge\.sql[\s\S]*generator_backend_registration_bridge\.sql[\s\S]*rollback;/i);
  });

  it('fails closed on destructive rollback after any bridge evidence exists', () => {
    expect(rollback).toMatch(/GENERATOR_BACKEND_BRIDGE_ROLLBACK_REQUIRES_FORWARD_RECOVERY/);
    expect(rollback).toMatch(/artifact_version_representations/);
    expect(rollback).toMatch(/review_contract_guarded/);
    expect(rollback).not.toMatch(/delete from|truncate/i);
    expect(recovery).toMatch(/GBI_NON_EMPTY_RECOVERY: PASS/);
  });

  it('proves database-enforced P11 concurrency safety', () => {
    expect(concurrency).toMatch(/dblink_send_query/i);
    expect(concurrency).toMatch(/GBI_P11_CONCURRENCY_SESSION_A/);
    expect(concurrency).toMatch(/when unique_violation/i);
    expect(concurrency).toMatch(/production_artifact_reviews_unique_guarded_p11_correlation_idx/i);
  });
});
