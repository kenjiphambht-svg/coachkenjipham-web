\set ON_ERROR_STOP on

-- Assertions are valid after canonical 112920, after its scoped rollback,
-- and after reapplication. They prove data survival independently from
-- schema recreation.

do $$
declare
  v_legacy_product_version uuid;
  v_artifact_versions integer;
  v_distinct_job_versions integer;
  v_reviews integer;
  v_legacy_null_reviews integer;
  v_legacy_duplicate_reviews integer;
  v_entitlements integer;
  v_access boolean;
begin
  select product_version_id into v_legacy_product_version
  from production.artifacts
  where id = '00000000-0000-4000-8000-000000000409';

  if v_legacy_product_version is distinct from '00000000-0000-4000-8000-000000000403'::uuid then
    raise exception 'WO04_RECOVERY_LOST_LEGACY_PRODUCT_VERSION';
  end if;

  select count(*) into v_artifact_versions
  from production.artifact_versions
  where artifact_id = '00000000-0000-4000-8000-000000000409';
  if v_artifact_versions <> 2 then
    raise exception 'WO04_RECOVERY_ARTIFACT_VERSION_COUNT_MISMATCH: %', v_artifact_versions;
  end if;

  select count(distinct j.product_version_id) into v_distinct_job_versions
  from production.artifact_versions av
  join production.jobs j on j.id = av.job_id
  where av.artifact_id = '00000000-0000-4000-8000-000000000409';
  if v_distinct_job_versions <> 2 then
    raise exception 'WO04_RECOVERY_PRODUCT_VERSION_EVOLUTION_MISSING: %', v_distinct_job_versions;
  end if;

  if exists (
    select 1
    from production.artifact_versions av
    join production.job_attempts ja on ja.id = av.job_attempt_id
    join production.jobs j on j.id = av.job_id
    where av.artifact_id = '00000000-0000-4000-8000-000000000409'
      and (ja.status <> 'succeeded' or j.status <> 'succeeded')
  ) then
    raise exception 'WO04_RECOVERY_SUCCESS_LINEAGE_INCOHERENT';
  end if;

  select count(*) into v_reviews
  from production.artifact_reviews ar
  join production.artifact_versions av on av.id = ar.artifact_version_id
  where av.artifact_id = '00000000-0000-4000-8000-000000000409';
  if v_reviews <> 4 then
    raise exception 'WO04_RECOVERY_REVIEW_HISTORY_COUNT_MISMATCH: %', v_reviews;
  end if;

  select count(*) into v_legacy_null_reviews
  from production.artifact_reviews
  where id = '00000000-0000-4000-8000-000000000421'
    and review_correlation_reference is null;
  if v_legacy_null_reviews <> 1 then
    raise exception 'WO04_RECOVERY_LEGACY_NULL_REVIEW_LOST';
  end if;

  select count(*) into v_legacy_duplicate_reviews
  from production.artifact_reviews
  where artifact_version_id = '00000000-0000-4000-8000-000000000410'
    and review_source = 'synthetic-founder-review'
    and review_correlation_reference = 'wo04-synthetic-review-v1';
  if v_legacy_duplicate_reviews <> 2 then
    raise exception 'WO04_RECOVERY_LEGACY_DUPLICATE_REVIEWS_LOST: %', v_legacy_duplicate_reviews;
  end if;

  select count(*) into v_entitlements
  from entitlement.entitlements
  where person_id = '00000000-0000-4000-8000-000000000401'
    and product_id = '00000000-0000-4000-8000-000000000402';
  if v_entitlements <> 0 then
    raise exception 'WO04_SEPARATION_ARTIFACT_OR_QA_CREATED_ENTITLEMENT';
  end if;

  select entitlement.has_active_entitlement(
    '00000000-0000-4000-8000-000000000401',
    '00000000-0000-4000-8000-000000000402'
  ) into v_access;
  if v_access then
    raise exception 'WO04_SEPARATION_ARTIFACT_OR_QA_GRANTED_ACCESS';
  end if;

  if not exists (
    select 1 from pg_constraint
    where conrelid = 'production.artifacts'::regclass
      and conname = 'artifacts_product_version_id_fkey'
  ) or not exists (
    select 1 from pg_constraint
    where conrelid = 'production.artifacts'::regclass
      and conname = 'artifacts_version_belongs_to_product'
  ) then
    raise exception 'WO04_RECOVERY_PRODUCT_VERSION_FK_MISSING';
  end if;

  if not (
    select relrowsecurity and relforcerowsecurity
    from pg_class where oid = 'production.artifacts'::regclass
  ) then
    raise exception 'WO04_RECOVERY_RLS_NOT_FORCED';
  end if;

  if has_table_privilege('anon', 'production.artifacts', 'select')
     or has_table_privilege('authenticated', 'production.artifacts', 'select') then
    raise exception 'WO04_RECOVERY_BROWSER_ROLE_ACCESS_LEAK';
  end if;
end;
$$;

select
  (select count(*) from production.jobs) as jobs,
  (select count(*) from production.job_attempts) as attempts,
  (select count(*) from production.artifacts) as artifacts,
  (select count(*) from production.artifact_versions) as artifact_versions,
  (select count(*) from production.artifact_reviews) as reviews,
  (select count(*) from production.artifact_reviews
    where review_correlation_reference is null) as preserved_null_reviews,
  (select count(*) from production.artifact_reviews
    where artifact_version_id = '00000000-0000-4000-8000-000000000410'
      and review_source = 'synthetic-founder-review'
      and review_correlation_reference = 'wo04-synthetic-review-v1') as preserved_duplicate_reviews,
  (select count(*) from entitlement.entitlements) as entitlements,
  (select product_version_id from production.artifacts
    where id = '00000000-0000-4000-8000-000000000409') as preserved_legacy_product_version;
