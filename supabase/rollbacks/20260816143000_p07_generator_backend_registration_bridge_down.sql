-- Recovery for WO-P07-GEN-BACKEND-INTEGRATION-01.
--
-- This down path is intentionally fail-closed after the new contract has
-- recorded any evidence. Removing Machine provenance, representations, or
-- guarded P11 history would destroy canonical facts; use forward recovery.

do $$
begin
  if exists (
    select 1 from production.artifact_versions
    where registration_correlation_reference is not null
       or producer_machine_id is not null
       or machine_git_sha is not null
       or machine_contract_version is not null
       or result_manifest_version is not null
       or source_input_fingerprint is not null
       or registration_evidence_sha256 is not null
       or produced_version_identity is not null
  )
  or exists (select 1 from production.artifact_version_representations)
  or exists (select 1 from production.artifact_reviews where review_contract_guarded) then
    raise exception 'GENERATOR_BACKEND_BRIDGE_ROLLBACK_REQUIRES_FORWARD_RECOVERY';
  end if;
end;
$$;

drop function if exists production.register_generator_result(jsonb);

drop table production.artifact_version_representations;

-- Restore the exact pre-bridge global replay guard before removing the
-- additive review columns it no longer references.
create or replace function production.validate_artifact_review_replay()
returns trigger
language plpgsql
set search_path = pg_catalog, production
as $$
begin
  if NEW.review_correlation_reference is null then
    raise exception 'REVIEW_CORRELATION_REFERENCE_REQUIRED';
  end if;

  NEW.review_replay_guarded := true;

  if exists (
    select 1
    from production.artifact_reviews existing
    where existing.artifact_version_id = NEW.artifact_version_id
      and existing.review_source = NEW.review_source
      and existing.review_correlation_reference = NEW.review_correlation_reference
  ) then
    raise exception 'REVIEW_EVENT_REPLAY';
  end if;

  return NEW;
end;
$$;

revoke all on function production.validate_artifact_review_replay() from public, anon, authenticated;

alter table production.artifact_reviews
  drop constraint artifact_reviews_p11_contract_complete,
  drop constraint artifact_reviews_check_evidence_bounded,
  drop constraint artifact_reviews_reason_bounded,
  drop constraint artifact_reviews_provenance_state,
  drop constraint artifact_reviews_build_identity_bounded,
  drop constraint artifact_reviews_content_digest_sha256,
  drop constraint artifact_reviews_produced_identity_b6,
  drop constraint artifact_reviews_acceptance_contract_bounded,
  drop constraint artifact_reviews_attempt_belongs_to_job,
  drop column review_contract_guarded,
  drop column check_evidence,
  drop column review_reason,
  drop column provenance_status,
  drop column review_build_identity,
  drop column review_content_digest,
  drop column produced_version_identity,
  drop column job_attempt_id,
  drop column production_job_id,
  drop column acceptance_contract_version;

drop index production.production_artifact_versions_registration_correlation_idx;

alter table production.artifact_versions
  drop constraint artifact_versions_machine_registration_complete,
  drop constraint artifact_versions_produced_identity_b6,
  drop constraint artifact_versions_registration_correlation_bounded,
  drop constraint artifact_versions_registration_evidence_sha256,
  drop constraint artifact_versions_source_fingerprint_sha256,
  drop constraint artifact_versions_manifest_contract_bounded,
  drop constraint artifact_versions_machine_contract_bounded,
  drop constraint artifact_versions_machine_git_sha_full,
  drop constraint artifact_versions_machine_id_bounded,
  drop column produced_version_identity,
  drop column registration_correlation_reference,
  drop column registration_evidence_sha256,
  drop column source_input_fingerprint,
  drop column result_manifest_version,
  drop column machine_contract_version,
  drop column machine_git_sha,
  drop column producer_machine_id;
