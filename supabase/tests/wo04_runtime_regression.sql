\set ON_ERROR_STOP on

-- Live behavioral regression over the non-empty FD-2026-027 fixture.
-- Transaction-neutral component. The staging runner owns one explicit outer
-- BEGIN/ROLLBACK so every synthetic write is guaranteed to disappear.
set role service_role;

do $$
begin
  if exists (
    select 1 from production.job_attempts ja
    join production.jobs j on j.id = ja.job_id
    where ja.id = j.id
  ) then
    raise exception 'WO04_JOB_ATTEMPT_IDENTITY_COLLAPSED';
  end if;
end;
$$;

-- A running Attempt prevents an incompatible terminal Job claim.
insert into production.jobs (
  id, person_id, product_id, product_version_id, idempotency_key,
  input_fingerprint
)
values (
  '00000000-0000-4000-8000-000000000416',
  '00000000-0000-4000-8000-000000000401',
  '00000000-0000-4000-8000-000000000402',
  '00000000-0000-4000-8000-000000000404',
  'wo04-synthetic-running-guard',
  repeat('6', 64)
);

insert into production.job_attempts (
  id, job_id, attempt_number, idempotency_key
)
values (
  '00000000-0000-4000-8000-000000000417',
  '00000000-0000-4000-8000-000000000416',
  1,
  'wo04-synthetic-running-guard-attempt'
);

do $$
begin
  begin
    update production.jobs
    set status = 'failed'
    where id = '00000000-0000-4000-8000-000000000416';
    raise exception 'WO04_EXPECTED_RUNNING_ATTEMPT_GUARD_MISSING';
  exception when others then
    if position('JOB_CANNOT_TERMINATE_WHILE_ATTEMPT_RUNNING' in sqlerrm) = 0 then
      raise;
    end if;
  end;
end;
$$;

update production.job_attempts
set status = 'failed', finished_at = clock_timestamp(), failure_reason = 'synthetic expected failure'
where id = '00000000-0000-4000-8000-000000000417';

update production.jobs
set status = 'failed'
where id = '00000000-0000-4000-8000-000000000416';

-- A Job cannot claim success without compatible successful Attempt evidence.
insert into production.jobs (
  id, person_id, product_id, product_version_id, idempotency_key,
  input_fingerprint
)
values (
  '00000000-0000-4000-8000-000000000418',
  '00000000-0000-4000-8000-000000000401',
  '00000000-0000-4000-8000-000000000402',
  '00000000-0000-4000-8000-000000000404',
  'wo04-synthetic-success-guard',
  repeat('8', 64)
);

update production.jobs
set status = 'running'
where id = '00000000-0000-4000-8000-000000000418';

do $$
begin
  begin
    update production.jobs
    set status = 'succeeded'
    where id = '00000000-0000-4000-8000-000000000418';
    raise exception 'WO04_EXPECTED_SUCCESS_EVIDENCE_GUARD_MISSING';
  exception when others then
    if position('JOB_SUCCEEDED_REQUIRES_SUCCESSFUL_ATTEMPT' in sqlerrm) = 0 then
      raise;
    end if;
  end;
end;
$$;

-- Retry after canonical success is blocked.
do $$
begin
  begin
    insert into production.job_attempts (
      id, job_id, attempt_number, idempotency_key
    ) values (
      '00000000-0000-4000-8000-000000000419',
      '00000000-0000-4000-8000-000000000407',
      2,
      'wo04-synthetic-retry-after-success'
    );
    raise exception 'WO04_EXPECTED_RETRY_AFTER_SUCCESS_GUARD_MISSING';
  exception when others then
    if position('JOB_ATTEMPT_CANNOT_START_ON_TERMINAL_JOB' in sqlerrm) = 0
       and position('JOB_ATTEMPT_CANNOT_START_AFTER_SUCCESS' in sqlerrm) = 0 then
      raise;
    end if;
  end;
end;
$$;

-- Failed execution cannot originate canonical Artifact Version history.
do $$
begin
  begin
    insert into production.artifact_versions (
      artifact_id, version_number, job_id, job_attempt_id, output_kind
    ) values (
      '00000000-0000-4000-8000-000000000409',
      99,
      '00000000-0000-4000-8000-000000000416',
      '00000000-0000-4000-8000-000000000417',
      'report'
    );
    raise exception 'WO04_EXPECTED_FAILED_ATTEMPT_OUTPUT_GUARD_MISSING';
  exception when others then
    if position('ARTIFACT_VERSION_REQUIRES_SUCCESSFUL_ATTEMPT' in sqlerrm) = 0 then
      raise;
    end if;
  end;
end;
$$;

-- Replaying one logical output cannot create a second canonical Version.
do $$
begin
  begin
    insert into production.artifact_versions (
      artifact_id, version_number, job_id, job_attempt_id, output_kind
    ) values (
      '00000000-0000-4000-8000-000000000409',
      98,
      '00000000-0000-4000-8000-000000000407',
      '00000000-0000-4000-8000-000000000408',
      'report'
    );
    raise exception 'WO04_EXPECTED_OUTPUT_REPLAY_GUARD_MISSING';
  exception when unique_violation then
    null;
  end;
end;
$$;

-- Review replay is blocked, while a genuinely new event remains legal.
do $$
begin
  begin
    insert into production.artifact_reviews (
      artifact_version_id, review_state, review_source, review_correlation_reference
    ) values (
      '00000000-0000-4000-8000-000000000410',
      'approved',
      'synthetic-founder-review',
      'wo04-synthetic-review-v1'
    );
    raise exception 'WO04_EXPECTED_REVIEW_REPLAY_GUARD_MISSING';
  exception when others then
    if position('REVIEW_EVENT_REPLAY' in sqlerrm) = 0
       and sqlstate <> '23505' then
      raise;
    end if;
  end;
end;
$$;

insert into production.artifact_reviews (
  id, artifact_version_id, review_state, review_source,
  review_correlation_reference
)
values (
  '00000000-0000-4000-8000-000000000420',
  '00000000-0000-4000-8000-000000000410',
  'pending',
  'synthetic-founder-review',
  'wo04-synthetic-review-v1-follow-up'
);

-- Immutable history cannot be rewritten.
do $$
begin
  begin
    update production.artifact_versions
    set content_digest = 'synthetic-rewrite-forbidden'
    where id = '00000000-0000-4000-8000-000000000410';
    raise exception 'WO04_EXPECTED_ARTIFACT_VERSION_IMMUTABILITY_MISSING';
  exception when insufficient_privilege then
    null;
  when others then
    if position('PRODUCTION_ROW_IMMUTABLE' in sqlerrm) = 0 then
      raise;
    end if;
  end;
end;
$$;

-- Derived history remains trigger-only for the genuine restricted role.
do $$
begin
  begin
    insert into production.audit_events (event_type, entity_type, actor_type)
    values ('synthetic.fabrication', 'artifact_versions', 'service');
    raise exception 'WO04_EXPECTED_AUDIT_INSERT_DENIAL_MISSING';
  exception when insufficient_privilege then
    null;
  end;

  begin
    insert into production.job_status_events (job_id, from_status, to_status)
    values (
      '00000000-0000-4000-8000-000000000407',
      'pending',
      'succeeded'
    );
    raise exception 'WO04_EXPECTED_STATUS_HISTORY_INSERT_DENIAL_MISSING';
  exception when insufficient_privilege then
    null;
  end;
end;
$$;

-- Artifact and QA evidence never grant Entitlement or Access.
do $$
begin
  if exists (
    select 1 from entitlement.entitlements
    where person_id = '00000000-0000-4000-8000-000000000401'
      and product_id = '00000000-0000-4000-8000-000000000402'
  ) or entitlement.has_active_entitlement(
    '00000000-0000-4000-8000-000000000401',
    '00000000-0000-4000-8000-000000000402'
  ) then
    raise exception 'WO04_ARTIFACT_QA_ACCESS_SEPARATION_BROKEN';
  end if;
end;
$$;

reset role;

-- Even a privileged maintenance path is stopped by the immutable trigger.
do $$
begin
  begin
    update production.artifact_versions
    set content_digest = 'synthetic-privileged-rewrite-forbidden'
    where id = '00000000-0000-4000-8000-000000000410';
    raise exception 'WO04_EXPECTED_TRIGGER_IMMUTABILITY_MISSING';
  exception when others then
    if position('PRODUCTION_ROW_IMMUTABLE' in sqlerrm) = 0 then
      raise;
    end if;
  end;
end;
$$;

-- Every browser role remains denied by actual execution, not naming alone.
set local role anon;
do $$
begin
  begin
    perform count(*) from production.artifacts;
    raise exception 'WO04_EXPECTED_ANON_DENIAL_MISSING';
  exception when insufficient_privilege then
    null;
  end;
end;
$$;
reset role;

set local role authenticated;
do $$
begin
  begin
    perform count(*) from production.artifacts;
    raise exception 'WO04_EXPECTED_AUTHENTICATED_DENIAL_MISSING';
  exception when insufficient_privilege then
    null;
  end;
end;
$$;
reset role;

do $$
begin
  if has_function_privilege('anon', 'production.log_audit_event()', 'execute')
     or has_function_privilege('authenticated', 'production.log_audit_event()', 'execute')
     or has_function_privilege('anon', 'production.log_job_status_event()', 'execute')
     or has_function_privilege('authenticated', 'production.log_job_status_event()', 'execute') then
    raise exception 'WO04_SECURITY_DEFINER_EXECUTE_LEAK';
  end if;

  if exists (
    select 1
    from pg_proc p
    join pg_namespace n on n.oid = p.pronamespace
    where n.nspname = 'production'
      and p.prosecdef
      and not ('search_path=pg_catalog, production' = any(p.proconfig))
  ) then
    raise exception 'WO04_SECURITY_DEFINER_UNSAFE_SEARCH_PATH';
  end if;
end;
$$;
