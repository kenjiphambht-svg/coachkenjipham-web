\set ON_ERROR_STOP on
-- P07 narrow-repair database concurrency proof.
--
-- Run on a disposable fully-migrated database. The normal runtime component
-- commits a synthetic canonical Version first. dblink then holds one guarded
-- P11 insert open in Session A while this psql connection attempts the same
-- new correlation in Session B. Both triggers initially see no committed row;
-- the P11-specific partial unique index is therefore the decisive backstop.

\ir generator_backend_registration_bridge.sql

reset role;
create extension if not exists dblink with schema extensions;

select extensions.dblink_connect(
  'gbi_p11_session_a',
  'dbname=' || current_database() || ' user=postgres'
);

select extensions.dblink_send_query(
  'gbi_p11_session_a',
  $query$
    /* GBI_P11_CONCURRENCY_SESSION_A */
    with inserted as (
      insert into production.artifact_reviews (
        artifact_version_id, review_state, reviewed_at, review_source,
        review_correlation_reference, acceptance_contract_version,
        production_job_id, job_attempt_id, produced_version_identity,
        review_content_digest, review_build_identity, provenance_status,
        review_reason, check_evidence
      )
      select
        av.id, 'approved', '2026-08-16T08:00:00.000Z'::timestamptz,
        'P11_PRODUCT_ACCEPTANCE', 'gbi-p11-concurrent-correlation', '0.1',
        av.job_id, av.job_attempt_id, av.produced_version_identity,
        av.content_digest, av.build_identity, 'VERIFIED',
        'Synthetic concurrent P11 evidence',
        array['SYNTHETIC_CONCURRENT_P11_EVIDENCE']::text[]
      from production.artifact_versions av
      where av.registration_correlation_reference = 'gbi-registration-primary'
      returning 1
    )
    select pg_sleep(2)::text as slept, count(*)::text as inserted_count
    from inserted
  $query$
);

-- Wait until Session A is sleeping after its INSERT has acquired the unique-
-- index entry, rather than relying on scheduler timing.
do $$
declare
  v_deadline timestamptz := clock_timestamp() + interval '5 seconds';
begin
  loop
    exit when exists (
      select 1
      from pg_stat_activity
      where query like '%GBI_P11_CONCURRENCY_SESSION_A%'
        and wait_event = 'PgSleep'
    );
    if clock_timestamp() >= v_deadline then
      raise exception 'GBI_P11_CONCURRENCY_SESSION_A_NOT_READY';
    end if;
    perform pg_sleep(0.05);
  end loop;
end;
$$;

set role service_role;

do $$
begin
  begin
    insert into production.artifact_reviews (
      artifact_version_id, review_state, reviewed_at, review_source,
      review_correlation_reference, acceptance_contract_version,
      production_job_id, job_attempt_id, produced_version_identity,
      review_content_digest, review_build_identity, provenance_status,
      review_reason, check_evidence
    )
    select
      av.id, 'approved', '2026-08-16T08:00:00.000Z'::timestamptz,
      'P11_PRODUCT_ACCEPTANCE', 'gbi-p11-concurrent-correlation', '0.1',
      av.job_id, av.job_attempt_id, av.produced_version_identity,
      av.content_digest, av.build_identity, 'VERIFIED',
      'Synthetic concurrent P11 evidence',
      array['SYNTHETIC_CONCURRENT_P11_EVIDENCE']::text[]
    from production.artifact_versions av
    where av.registration_correlation_reference = 'gbi-registration-primary';
    raise exception 'GBI_P11_CONCURRENCY_DUPLICATE_COMMITTED';
  exception when unique_violation then
    null;
  end;
end;
$$;

reset role;

select *
from extensions.dblink_get_result('gbi_p11_session_a')
  as session_a_result(slept text, inserted_count text);
select extensions.dblink_disconnect('gbi_p11_session_a');

do $$
begin
  if (select count(*) from production.artifact_reviews
      where review_source = 'P11_PRODUCT_ACCEPTANCE'
        and review_correlation_reference = 'gbi-p11-concurrent-correlation') <> 1 then
    raise exception 'GBI_P11_CONCURRENCY_ROW_COUNT_INVALID';
  end if;
  if not exists (
    select 1 from pg_indexes
    where schemaname = 'production'
      and indexname = 'production_artifact_reviews_unique_guarded_p11_correlation_idx'
  ) then
    raise exception 'GBI_P11_CONCURRENCY_UNIQUE_INDEX_MISSING';
  end if;
end;
$$;

select 'GBI_P11_CONCURRENCY: PASS' as p11_database_concurrency;
