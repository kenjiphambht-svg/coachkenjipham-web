\set ON_ERROR_STOP on

-- Assertions for the final canonical state used by the staging rollback-only
-- runner. Unlike local recovery assertions, this fixture intentionally has no
-- pre-correction NULL/duplicate legacy Review rows.

do $$
declare
  v_distinct_job_versions integer;
begin
  if (select count(*) from production.jobs) <> 2
     or (select count(*) from production.job_attempts) <> 2
     or (select count(*) from production.artifacts) <> 1
     or (select count(*) from production.artifact_versions) <> 2
     or (select count(*) from production.artifact_reviews) <> 2 then
    raise exception 'WO04_FINAL_FIXTURE_COUNT_MISMATCH';
  end if;

  if (select product_version_id from production.artifacts
      where id = '00000000-0000-4000-8000-000000000409')
     is distinct from '00000000-0000-4000-8000-000000000403'::uuid then
    raise exception 'WO04_FINAL_LEGACY_PRODUCT_VERSION_MISMATCH';
  end if;

  select count(distinct j.product_version_id) into v_distinct_job_versions
  from production.artifact_versions av
  join production.jobs j on j.id = av.job_id
  where av.artifact_id = '00000000-0000-4000-8000-000000000409';
  if v_distinct_job_versions <> 2 then
    raise exception 'WO04_FINAL_PRODUCT_VERSION_EVOLUTION_MISSING';
  end if;

  if exists (
    select 1 from production.artifact_reviews
    where not review_replay_guarded
  ) then
    raise exception 'WO04_FINAL_NEW_REVIEW_NOT_REPLAY_GUARDED';
  end if;

  if exists (
    select 1 from entitlement.entitlements
    where person_id = '00000000-0000-4000-8000-000000000401'
      and product_id = '00000000-0000-4000-8000-000000000402'
  ) or entitlement.has_active_entitlement(
    '00000000-0000-4000-8000-000000000401',
    '00000000-0000-4000-8000-000000000402'
  ) then
    raise exception 'WO04_FINAL_ARTIFACT_QA_ACCESS_SEPARATION_BROKEN';
  end if;
end;
$$;
