import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const sql = readFileSync(
  resolve(process.cwd(), 'supabase/migrations/20260814034500_launch_core_production_job_artifact_qa_foundation.sql'),
  'utf8'
);
const rollback = readFileSync(
  resolve(process.cwd(), 'supabase/rollbacks/20260814034500_launch_core_production_job_artifact_qa_foundation_down.sql'),
  'utf8'
);

// SQL escapes a literal single quote inside a string as '' — the naive
// [^']* pattern treats the first ' of that pair as the string terminator
// and then greedily consumes forward, swallowing real SQL in between.
// (?:[^']|'')* correctly treats '' as an escaped quote, not a terminator.
const stripComments = (text: string) =>
  text
    .replace(/comment on [\s\S]*?is\s+'(?:[^']|'')*';/gi, '')
    .split('\n')
    .filter((line) => !line.trim().startsWith('--'))
    .join('\n');

const code = stripComments(sql);
const rollbackCode = stripComments(rollback);

describe('WO-LAUNCH-CORE-04 — schema contract', () => {
  it('creates a dedicated production schema with the core tables and view', () => {
    expect(sql).toMatch(/create schema if not exists production/i);
    expect(sql).toMatch(/create table production\.jobs/i);
    expect(sql).toMatch(/create table production\.job_attempts/i);
    expect(sql).toMatch(/create table production\.job_status_events/i);
    expect(sql).toMatch(/create table production\.artifacts/i);
    expect(sql).toMatch(/create table production\.artifact_versions/i);
    expect(sql).toMatch(/create table production\.artifact_reviews/i);
    expect(sql).toMatch(/create table production\.audit_events/i);
    expect(sql).toMatch(/create view production\.artifact_current_version/i);
  });

  it('does not touch identity, commerce, entitlement, or knowledge tables', () => {
    expect(code).not.toMatch(/create table identity\.|create table commerce\.|create table entitlement\.|create table knowledge\./i);
    expect(code).not.toMatch(/alter table identity\.|alter table commerce\.|alter table entitlement\.|alter table knowledge\./i);
  });

  it('never touches entitlement.entitlements — Artifact/QA must never automatically grant access', () => {
    expect(code).not.toMatch(/entitlement\.entitlements/i);
    expect(code).not.toMatch(/insert into entitlement/i);
  });

  it('does not build a real Generator, storage, PDF, or email provider integration', () => {
    expect(code).not.toMatch(/stripe|s3|cloudinary|sendgrid|resend|openai|anthropic_api|generator_webhook/i);
  });

  it('does not build a publication or delivery concept', () => {
    expect(code).not.toMatch(/publish|published_at|delivery_status|delivered_at/i);
  });
});

describe('(A) Production Job — canonical work request', () => {
  it('requires Person + Product; Version/Journey/Order are optional but coherence-checked', () => {
    expect(sql).toMatch(/person_id uuid not null references identity\.persons\(id\) on delete restrict/i);
    expect(sql).toMatch(/product_id uuid not null references commerce\.products\(id\) on delete restrict/i);
    const jobsBlock = code.split('create table production.jobs')[1].split('comment on table production.jobs')[0];
    expect(jobsBlock).toMatch(/product_version_id uuid references commerce\.product_versions\(id\) on delete restrict/i);
    expect(jobsBlock).toMatch(/journey_anchor_id uuid references commerce\.product_journey_anchors\(id\) on delete restrict/i);
    expect(jobsBlock).toMatch(/order_id uuid references commerce\.orders\(id\) on delete restrict/i);
  });

  it('is idempotent via a unique idempotency_key', () => {
    const jobsBlock = code.split('create table production.jobs')[1].split('comment on table production.jobs')[0];
    expect(jobsBlock).toMatch(/idempotency_key text not null unique/i);
  });

  it('creation is locked to the single non-terminal starting status', () => {
    const fn = code.split('create or replace function production.reject_job_initial_status')[1].split('revoke all on function')[0];
    expect(fn).toMatch(/NEW\.status is distinct from 'pending'/i);
    expect(fn).toMatch(/raise exception 'JOB_MUST_START_PENDING'/i);
    expect(sql).toMatch(
      /create trigger production_jobs_block_bad_initial_status\s*before insert on production\.jobs\s*for each row execute function production\.reject_job_initial_status/i
    );
  });

  it('validates full cross-reference coherence at insert time: Journey, Order, and Journey-vs-Order directly', () => {
    const fn = code.split('create or replace function production.validate_job_scope')[1].split('revoke all on function')[0];
    expect(fn).toMatch(/raise exception 'JOB_JOURNEY_NOT_FOUND'/i);
    expect(fn).toMatch(/raise exception 'JOB_JOURNEY_SCOPE_MISMATCH'/i);
    expect(fn).toMatch(/raise exception 'JOB_JOURNEY_VERSION_MISMATCH'/i);
    expect(fn).toMatch(/raise exception 'JOB_ORDER_NOT_FOUND'/i);
    expect(fn).toMatch(/raise exception 'JOB_ORDER_SCOPE_MISMATCH'/i);
    expect(fn).toMatch(/raise exception 'JOB_ORDER_VERSION_MISMATCH'/i);
    expect(fn).toMatch(/raise exception 'JOB_JOURNEY_ORDER_VERSION_MISMATCH'/i);
  });

  it('locks grant-scope fields immutable and only allows the legal forward status transitions', () => {
    const fn = code.split('create or replace function production.reject_job_rewrite')[1].split('revoke all on function')[0];
    for (const field of ['person_id', 'product_id', 'product_version_id', 'journey_anchor_id', 'order_id', 'idempotency_key']) {
      expect(fn).toMatch(new RegExp(`NEW\\.${field} is distinct from OLD\\.${field}`, 'i'));
    }
    expect(fn).toMatch(/JOB_TERMINAL_STATUS_IMMUTABLE/i);
    expect(fn).toMatch(/JOB_STATUS_TRANSITION_INVALID/i);
  });

  it('requires an actual successful Attempt before a Job may read as succeeded', () => {
    const fn = code.split('create or replace function production.reject_job_rewrite')[1].split('revoke all on function')[0];
    expect(fn).toMatch(/select count\(\*\) into v_succeeded_attempts\s*from production\.job_attempts where job_id = NEW\.id and status = 'succeeded'/i);
    expect(fn).toMatch(/raise exception 'JOB_SUCCEEDED_REQUIRES_SUCCESSFUL_ATTEMPT'/i);
  });

  it('is hard-blocked from delete and audited on insert/update', () => {
    expect(sql).toMatch(/create trigger production_jobs_block_delete\s*before delete on production\.jobs/i);
    expect(sql).toMatch(/create trigger production_jobs_audit\s*after insert or update on production\.jobs/i);
  });
});

describe('Job status history — authoritative, unfabricatable', () => {
  it('logs every real transition via a SECURITY DEFINER trigger', () => {
    const fn = code.split('create or replace function production.log_job_status_event')[1].split('revoke all on function')[0];
    expect(fn).toMatch(/security definer/i);
    expect(fn).toMatch(/NEW\.status is distinct from OLD\.status/i);
    expect(sql).toMatch(
      /create trigger production_jobs_log_status_event\s*after update on production\.jobs\s*for each row execute function production\.log_job_status_event/i
    );
  });

  it('never grants direct INSERT on job_status_events to service_role', () => {
    expect(sql).toMatch(/grant select on production\.job_status_events to service_role/i);
    expect(code).not.toMatch(/grant\s+[\w,\s]*insert[\w,\s]*\s+on production\.job_status_events/i);
  });

  it('is hard-blocked from update and delete', () => {
    expect(sql).toMatch(/create trigger production_job_status_events_block_update/i);
    expect(sql).toMatch(/create trigger production_job_status_events_block_delete/i);
  });
});

describe('(B) Job Attempt — separate canonical truth, safe retries', () => {
  it('is a distinct table with a unique attempt_number per Job and its own idempotency_key', () => {
    const block = code.split('create table production.job_attempts')[1].split('comment on table production.job_attempts')[0];
    expect(block).toMatch(/job_id uuid not null references production\.jobs\(id\) on delete restrict/i);
    expect(block).toMatch(/job_attempts_unique_number unique \(job_id, attempt_number\)/i);
    expect(block).toMatch(/idempotency_key text not null unique/i);
  });

  it('supports a composite FK for artifact_versions via unique(id, job_id)', () => {
    const block = code.split('create table production.job_attempts')[1].split('comment on table production.job_attempts')[0];
    expect(block).toMatch(/job_attempts_unique_id_job unique \(id, job_id\)/i);
  });

  it('cannot start on an already-terminal Job, and must start running', () => {
    const fn = code.split('create or replace function production.validate_job_attempt_creation')[1].split('revoke all on function')[0];
    expect(fn).toMatch(/raise exception 'JOB_ATTEMPT_MUST_START_RUNNING'/i);
    expect(fn).toMatch(/raise exception 'JOB_ATTEMPT_CANNOT_START_ON_TERMINAL_JOB'/i);
  });

  it('locks factual fields and seals terminal status/record', () => {
    const fn = code.split('create or replace function production.reject_job_attempt_rewrite')[1].split('revoke all on function')[0];
    for (const field of ['job_id', 'attempt_number', 'started_at', 'provider_execution_reference', 'idempotency_key']) {
      expect(fn).toMatch(new RegExp(`NEW\\.${field} is distinct from OLD\\.${field}`, 'i'));
    }
    expect(fn).toMatch(/JOB_ATTEMPT_TERMINAL_STATUS_IMMUTABLE/i);
    expect(fn).toMatch(/JOB_ATTEMPT_TERMINAL_RECORD_IMMUTABLE/i);
    expect(fn).toMatch(/JOB_ATTEMPT_STATUS_TRANSITION_INVALID/i);
  });

  it('is hard-blocked from delete', () => {
    expect(sql).toMatch(/create trigger production_job_attempts_block_delete\s*before delete on production\.job_attempts/i);
  });
});

describe('(C) Artifact / Artifact Version — stable thing vs immutable history', () => {
  it('Artifact is fully immutable after creation (no update grant, trigger-blocked)', () => {
    expect(sql).toMatch(/grant select, insert on production\.artifacts to service_role/i);
    expect(code).not.toMatch(/grant\s+[\w,\s]*update[\w,\s]*\s+on production\.artifacts\b/i);
    expect(sql).toMatch(/create trigger production_artifacts_block_rewrite/i);
    expect(sql).toMatch(/create trigger production_artifacts_block_delete/i);
  });

  it('validates Artifact Journey coherence at insert time', () => {
    const fn = code.split('create or replace function production.validate_artifact_scope')[1].split('revoke all on function')[0];
    expect(fn).toMatch(/raise exception 'ARTIFACT_JOURNEY_NOT_FOUND'/i);
    expect(fn).toMatch(/raise exception 'ARTIFACT_JOURNEY_SCOPE_MISMATCH'/i);
    expect(fn).toMatch(/raise exception 'ARTIFACT_JOURNEY_VERSION_MISMATCH'/i);
  });

  it('Artifact Version is insert-only, unique per (artifact_id, version_number), never overwritten', () => {
    const block = code.split('create table production.artifact_versions')[1].split('comment on table production.artifact_versions')[0];
    expect(block).toMatch(/artifact_versions_unique_number unique \(artifact_id, version_number\)/i);
    expect(sql).toMatch(/grant select, insert on production\.artifact_versions to service_role/i);
    expect(code).not.toMatch(/grant\s+[\w,\s]*update[\w,\s]*\s+on production\.artifact_versions\b/i);
    expect(sql).toMatch(/create trigger production_artifact_versions_block_rewrite/i);
    expect(sql).toMatch(/create trigger production_artifact_versions_block_delete/i);
  });

  it('does not store raw generated files — only bounded pointer/digest fields', () => {
    const block = code.split('create table production.artifact_versions')[1].split('comment on table production.artifact_versions')[0];
    expect(block).toMatch(/build_identity text check \(build_identity is null or char_length\(build_identity\) between 1 and 300\)/i);
    expect(block).toMatch(/content_digest text check \(content_digest is null or char_length\(content_digest\) between 1 and 128\)/i);
    expect(code).not.toMatch(/raw_content|file_bytes|binary_data/i);
  });

  it('an Artifact Version must cohere with its own Artifact via the originating Job (Person/Product/Version)', () => {
    const fn = code.split('create or replace function production.validate_artifact_version_scope')[1].split('revoke all on function')[0];
    expect(fn).toMatch(/raise exception 'ARTIFACT_VERSION_ARTIFACT_NOT_FOUND'/i);
    expect(fn).toMatch(/raise exception 'ARTIFACT_VERSION_JOB_NOT_FOUND'/i);
    expect(fn).toMatch(/raise exception 'ARTIFACT_VERSION_JOB_SCOPE_MISMATCH'/i);
    expect(fn).toMatch(/raise exception 'ARTIFACT_VERSION_JOB_VERSION_MISMATCH'/i);
  });

  it('the job_attempt must belong to the same job via a composite FK', () => {
    const block = code.split('create table production.artifact_versions')[1].split('comment on table production.artifact_versions')[0];
    expect(block).toMatch(/artifact_versions_attempt_belongs_to_job\s*foreign key \(job_attempt_id, job_id\) references production\.job_attempts\(id, job_id\)/i);
  });

  it('exposes a read-time current-version view, service_role only', () => {
    const view = code.split('create view production.artifact_current_version')[1].split('revoke all on production.artifact_current_version')[0];
    expect(view).toMatch(/distinct on \(av\.artifact_id\)/i);
    expect(view).toMatch(/order by av\.artifact_id, av\.version_number desc/i);
    expect(sql).toMatch(/grant select on production\.artifact_current_version to service_role/i);
  });
});

describe('(D) QA / Review evidence — factual, not business QA criteria', () => {
  it('is a generic, provider-neutral review-workflow vocabulary, not product-specific QA criteria', () => {
    const block = code.split('create table production.artifact_reviews')[1].split('comment on table production.artifact_reviews')[0];
    expect(block).toMatch(/review_state text not null check \(review_state in \(\s*'pending', 'approved', 'rejected', 'needs_changes'/i);
    expect(code).not.toMatch(/hat_mam|lang_product|coaching_score|methodology/i);
  });

  it('requires review_source — a review can never exist as unexplained history', () => {
    const block = code.split('create table production.artifact_reviews')[1].split('comment on table production.artifact_reviews')[0];
    expect(block).toMatch(/review_source text not null check \(char_length\(review_source\) between 1 and 200\)/i);
  });

  it('is insert-only, immutable, tied to a specific Artifact Version', () => {
    const block = code.split('create table production.artifact_reviews')[1].split('comment on table production.artifact_reviews')[0];
    expect(block).toMatch(/artifact_version_id uuid not null references production\.artifact_versions\(id\) on delete restrict/i);
    expect(sql).toMatch(/grant select, insert on production\.artifact_reviews to service_role/i);
    expect(code).not.toMatch(/grant\s+[\w,\s]*update[\w,\s]*\s+on production\.artifact_reviews\b/i);
    expect(sql).toMatch(/create trigger production_artifact_reviews_block_rewrite/i);
    expect(sql).toMatch(/create trigger production_artifact_reviews_block_delete/i);
  });
});

describe('security contract', () => {
  it('enables and forces RLS on every table', () => {
    for (const table of [
      'production.jobs', 'production.job_attempts', 'production.job_status_events',
      'production.artifacts', 'production.artifact_versions', 'production.artifact_reviews',
      'production.audit_events',
    ]) {
      expect(sql).toMatch(new RegExp(`alter table ${table.replace('.', '\\.')} enable row level security`, 'i'));
      expect(sql).toMatch(new RegExp(`alter table ${table.replace('.', '\\.')} force row level security`, 'i'));
    }
  });

  it('never grants anon or authenticated any privilege in the production schema', () => {
    expect(sql).not.toMatch(/grant\s+(?:select|insert|update|delete|usage|execute)[\s\S]*to\s+(?:anon|authenticated)/i);
    expect(sql).toMatch(/revoke all on schema production from public, anon, authenticated/i);
  });

  it('never grants ordinary DELETE anywhere in this migration', () => {
    expect(code).not.toMatch(/grant[\s\S]{0,200}delete[\s\S]{0,80}to service_role/i);
  });

  it('audit_events is fully insert-only via SECURITY DEFINER, no direct INSERT grant', () => {
    const fn = code.split('create or replace function production.log_audit_event')[1].split('revoke all on function')[0];
    expect(fn).toMatch(/security definer/i);
    expect(sql).toMatch(/grant select on production\.audit_events to service_role/i);
    expect(code).not.toMatch(/grant\s+[\w,\s]*insert[\w,\s]*\s+on production\.audit_events/i);
  });
});

describe('scoped rollback', () => {
  it('drops only the production schema, touching neither identity, commerce, entitlement, nor knowledge', () => {
    expect(rollback).toMatch(/drop schema if exists production cascade/i);
    expect(rollbackCode).not.toMatch(/identity\.\w|commerce\.\w|entitlement\.\w|knowledge\.\w/i);
  });
});
