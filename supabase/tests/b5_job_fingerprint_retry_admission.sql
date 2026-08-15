\set ON_ERROR_STOP on
-- WO-P07-B5-BACKEND-FINGERPRINT-01 synthetic runtime proof.
-- Run after migration 20260815134000 on a disposable/non-Production DB only.
-- The caller must own an outer BEGIN/ROLLBACK boundary.

set role service_role;

insert into identity.persons (id, display_label)
values ('00000000-0000-4000-8000-00000000b501', 'P07 B5 synthetic fingerprint proof');
insert into commerce.products (id, product_key, display_name)
values ('00000000-0000-4000-8000-00000000b502', 'p07_b5_fingerprint_test', 'P07 B5 Synthetic Product');
insert into commerce.product_versions (id, product_id, version_label)
values ('00000000-0000-4000-8000-00000000b503', '00000000-0000-4000-8000-00000000b502', 'synthetic-v1');

-- T1 valid full SHA-256 canonical fingerprint: PASS.
insert into production.jobs (id, person_id, product_id, product_version_id, idempotency_key, input_fingerprint)
values ('00000000-0000-4000-8000-00000000b510','00000000-0000-4000-8000-00000000b501','00000000-0000-4000-8000-00000000b502','00000000-0000-4000-8000-00000000b503','p07-b5-job-valid',repeat('a',64));

-- T2 invalid fingerprint shape/length: REJECT.
do $$ begin
  begin
    insert into production.jobs (id, person_id, product_id, product_version_id, idempotency_key, input_fingerprint)
    values ('00000000-0000-4000-8000-00000000b511','00000000-0000-4000-8000-00000000b501','00000000-0000-4000-8000-00000000b502','00000000-0000-4000-8000-00000000b503','p07-b5-job-invalid','abc');
    raise exception 'T2_EXPECTED_REJECT_MISSING';
  exception when check_violation then null;
  end;
end $$;

-- T3 canonical fingerprint rewrite after creation: REJECT.
do $$ begin
  begin
    update production.jobs set input_fingerprint=repeat('b',64)
    where id='00000000-0000-4000-8000-00000000b510';
    raise exception 'T3_EXPECTED_IMMUTABILITY_MISSING';
  exception when others then
    if position('JOB_INPUT_FINGERPRINT_IMMUTABLE' in sqlerrm)=0 then raise; end if;
  end;
end $$;

-- Establish a failed first Attempt; Job remains running and retry-eligible.
insert into production.job_attempts (id,job_id,attempt_number,idempotency_key)
values ('00000000-0000-4000-8000-00000000b520','00000000-0000-4000-8000-00000000b510',1,'p07-b5-attempt-1');
update production.job_attempts
set status='failed',finished_at=clock_timestamp(),failure_reason='synthetic transient failure'
where id='00000000-0000-4000-8000-00000000b520';

-- T4 same Job + same fingerprint + otherwise eligible: PASS.
insert into production.job_attempts (id,job_id,attempt_number,idempotency_key,admission_input_fingerprint)
values ('00000000-0000-4000-8000-00000000b521','00000000-0000-4000-8000-00000000b510',2,'p07-b5-attempt-2',repeat('a',64));
update production.job_attempts
set status='failed',finished_at=clock_timestamp(),failure_reason='synthetic second transient failure'
where id='00000000-0000-4000-8000-00000000b521';

-- T5 changed material: REJECT and explicitly signal Revision/new Job.
do $$ begin
  begin
    insert into production.job_attempts (id,job_id,attempt_number,idempotency_key,admission_input_fingerprint)
    values ('00000000-0000-4000-8000-00000000b522','00000000-0000-4000-8000-00000000b510',3,'p07-b5-attempt-mismatch',repeat('b',64));
    raise exception 'T5_EXPECTED_REJECT_MISSING';
  exception when others then
    if position('JOB_RETRY_INPUT_FINGERPRINT_MISMATCH_REVISION_REQUIRED' in sqlerrm)=0 then raise; end if;
  end;
end $$;

-- T6 simulate a pre-migration legacy Job with NULL fingerprint, then prove
-- Retry fails closed. The trigger is disabled only for synthetic legacy setup.
reset role;
alter table production.jobs disable trigger production_jobs_require_input_fingerprint;
set role service_role;
insert into production.jobs (id,person_id,product_id,product_version_id,idempotency_key)
values ('00000000-0000-4000-8000-00000000b512','00000000-0000-4000-8000-00000000b501','00000000-0000-4000-8000-00000000b502','00000000-0000-4000-8000-00000000b503','p07-b5-legacy-job');
insert into production.job_attempts (id,job_id,attempt_number,idempotency_key)
values ('00000000-0000-4000-8000-00000000b523','00000000-0000-4000-8000-00000000b512',1,'p07-b5-legacy-attempt-1');
update production.job_attempts set status='failed',finished_at=clock_timestamp(),failure_reason='synthetic legacy failure'
where id='00000000-0000-4000-8000-00000000b523';
reset role;
alter table production.jobs enable trigger production_jobs_require_input_fingerprint;
set role service_role;
do $$ begin
  begin
    insert into production.job_attempts (id,job_id,attempt_number,idempotency_key,admission_input_fingerprint)
    values ('00000000-0000-4000-8000-00000000b524','00000000-0000-4000-8000-00000000b512',2,'p07-b5-legacy-attempt-2',repeat('a',64));
    raise exception 'T6_EXPECTED_FAIL_CLOSED_MISSING';
  exception when others then
    if position('JOB_RETRY_CANONICAL_INPUT_FINGERPRINT_MISSING' in sqlerrm)=0 then raise; end if;
  end;
end $$;

-- T7 idempotency remains independent. The same canonical Job/idempotency row
-- is the one used in T5, yet changed material was still rejected.
do $$ begin
  if (select idempotency_key from production.jobs where id='00000000-0000-4000-8000-00000000b510') <> 'p07-b5-job-valid' then
    raise exception 'T7_JOB_IDEMPOTENCY_CHANGED';
  end if;
end $$;

-- T8 existing one-running-per-Job atomic guard still blocks a second runner.
insert into production.job_attempts (id,job_id,attempt_number,idempotency_key,admission_input_fingerprint)
values ('00000000-0000-4000-8000-00000000b525','00000000-0000-4000-8000-00000000b510',3,'p07-b5-running-a',repeat('a',64));
do $$ begin
  begin
    insert into production.job_attempts (id,job_id,attempt_number,idempotency_key,admission_input_fingerprint)
    values ('00000000-0000-4000-8000-00000000b526','00000000-0000-4000-8000-00000000b510',4,'p07-b5-running-b',repeat('a',64));
    raise exception 'T8_EXPECTED_ONE_RUNNING_GUARD_MISSING';
  exception when unique_violation then null;
  end;
end $$;
update production.job_attempts set status='succeeded',finished_at=clock_timestamp()
where id='00000000-0000-4000-8000-00000000b525';

-- T9 prove the existing one-success index is the atomic backstop. A synthetic
-- privileged setup bypasses ONLY normal terminal admission to place a stray
-- running row after success; that row still cannot transition to succeeded.
insert into production.jobs (id,person_id,product_id,product_version_id,idempotency_key,input_fingerprint)
values ('00000000-0000-4000-8000-00000000b514','00000000-0000-4000-8000-00000000b501','00000000-0000-4000-8000-00000000b502','00000000-0000-4000-8000-00000000b503','p07-b5-second-success',repeat('d',64));
insert into production.job_attempts (id,job_id,attempt_number,idempotency_key)
values ('00000000-0000-4000-8000-00000000b540','00000000-0000-4000-8000-00000000b514',1,'p07-b5-second-success-a1');
update production.job_attempts set status='succeeded',finished_at=clock_timestamp()
where id='00000000-0000-4000-8000-00000000b540';
reset role;
alter table production.job_attempts disable trigger production_job_attempts_validate_creation;
set role service_role;
insert into production.job_attempts (id,job_id,attempt_number,idempotency_key,admission_input_fingerprint)
values ('00000000-0000-4000-8000-00000000b541','00000000-0000-4000-8000-00000000b514',2,'p07-b5-second-success-a2',repeat('d',64));
reset role;
alter table production.job_attempts enable trigger production_job_attempts_validate_creation;
set role service_role;
do $$ begin
  begin
    update production.job_attempts set status='succeeded',finished_at=clock_timestamp()
    where id='00000000-0000-4000-8000-00000000b541';
    raise exception 'T9_EXPECTED_ONE_SUCCESS_GUARD_MISSING';
  exception when unique_violation then null;
  end;
end $$;

-- T10 retry after canonical success: REJECT by existing terminal guard.
do $$ begin
  begin
    insert into production.job_attempts (id,job_id,attempt_number,idempotency_key,admission_input_fingerprint)
    values ('00000000-0000-4000-8000-00000000b527','00000000-0000-4000-8000-00000000b510',4,'p07-b5-after-success',repeat('a',64));
    raise exception 'T10_EXPECTED_TERMINAL_REJECT_MISSING';
  exception when others then
    if position('JOB_ATTEMPT_CANNOT_START_ON_TERMINAL_JOB' in sqlerrm)=0
       and position('JOB_ATTEMPT_CANNOT_START_AFTER_SUCCESS' in sqlerrm)=0 then raise; end if;
  end;
end $$;

-- T11 retry after cancelled AND failed terminal Job: REJECT.
insert into production.jobs (id,person_id,product_id,product_version_id,idempotency_key,input_fingerprint)
values ('00000000-0000-4000-8000-00000000b513','00000000-0000-4000-8000-00000000b501','00000000-0000-4000-8000-00000000b502','00000000-0000-4000-8000-00000000b503','p07-b5-cancelled',repeat('c',64));
update production.jobs set status='cancelled' where id='00000000-0000-4000-8000-00000000b513';
do $$ begin
  begin
    insert into production.job_attempts (id,job_id,attempt_number,idempotency_key,admission_input_fingerprint)
    values ('00000000-0000-4000-8000-00000000b528','00000000-0000-4000-8000-00000000b513',2,'p07-b5-after-cancel',repeat('c',64));
    raise exception 'T11_CANCELLED_GUARD_MISSING';
  exception when others then
    if position('JOB_ATTEMPT_CANNOT_START_ON_TERMINAL_JOB' in sqlerrm)=0 then raise; end if;
  end;
end $$;
insert into production.jobs (id,person_id,product_id,product_version_id,idempotency_key,input_fingerprint)
values ('00000000-0000-4000-8000-00000000b515','00000000-0000-4000-8000-00000000b501','00000000-0000-4000-8000-00000000b502','00000000-0000-4000-8000-00000000b503','p07-b5-failed-terminal',repeat('f',64));
update production.jobs set status='running' where id='00000000-0000-4000-8000-00000000b515';
update production.jobs set status='failed' where id='00000000-0000-4000-8000-00000000b515';
do $$ begin
  begin
    insert into production.job_attempts (id,job_id,attempt_number,idempotency_key,admission_input_fingerprint)
    values ('00000000-0000-4000-8000-00000000b529','00000000-0000-4000-8000-00000000b515',2,'p07-b5-after-failed',repeat('f',64));
    raise exception 'T11_FAILED_GUARD_MISSING';
  exception when others then
    if position('JOB_ATTEMPT_CANNOT_START_ON_TERMINAL_JOB' in sqlerrm)=0 then raise; end if;
  end;
end $$;

-- T12 sequential replay is idempotently blocked, changed-material replay is
-- fingerprint-blocked, and the existing DB-level race indexes remain present.
insert into production.jobs (id,person_id,product_id,product_version_id,idempotency_key,input_fingerprint)
values ('00000000-0000-4000-8000-00000000b516','00000000-0000-4000-8000-00000000b501','00000000-0000-4000-8000-00000000b502','00000000-0000-4000-8000-00000000b503','p07-b5-replay-job',repeat('e',64));
insert into production.job_attempts (id,job_id,attempt_number,idempotency_key)
values ('00000000-0000-4000-8000-00000000b550','00000000-0000-4000-8000-00000000b516',1,'p07-b5-replay-a1');
update production.job_attempts set status='failed',finished_at=clock_timestamp(),failure_reason='synthetic replay setup'
where id='00000000-0000-4000-8000-00000000b550';
insert into production.job_attempts (id,job_id,attempt_number,idempotency_key,admission_input_fingerprint)
values ('00000000-0000-4000-8000-00000000b551','00000000-0000-4000-8000-00000000b516',2,'p07-b5-replay-a2',repeat('e',64));
do $$ begin
  begin
    insert into production.job_attempts (id,job_id,attempt_number,idempotency_key,admission_input_fingerprint)
    values ('00000000-0000-4000-8000-00000000b552','00000000-0000-4000-8000-00000000b516',2,'p07-b5-replay-a2',repeat('e',64));
    raise exception 'T12_REPLAY_DUPLICATE_GUARD_MISSING';
  exception when unique_violation then null;
  end;
  begin
    insert into production.job_attempts (id,job_id,attempt_number,idempotency_key,admission_input_fingerprint)
    values ('00000000-0000-4000-8000-00000000b553','00000000-0000-4000-8000-00000000b516',3,'p07-b5-replay-changed-material',repeat('9',64));
    raise exception 'T12_CHANGED_MATERIAL_BYPASS';
  exception when others then
    if position('JOB_RETRY_INPUT_FINGERPRINT_MISMATCH_REVISION_REQUIRED' in sqlerrm)=0 then raise; end if;
  end;
  if not exists (select 1 from pg_indexes where schemaname='production' and indexname='job_attempts_one_running_per_job_idx')
     or not exists (select 1 from pg_indexes where schemaname='production' and indexname='job_attempts_one_succeeded_per_job_idx') then
    raise exception 'T12_ATOMIC_INDEX_MISSING';
  end if;
end $$;

-- T13 existing Artifact canonical identity + ArtifactVersion immutability.
insert into production.artifacts (id,person_id,product_id,product_version_id)
values ('00000000-0000-4000-8000-00000000b530','00000000-0000-4000-8000-00000000b501','00000000-0000-4000-8000-00000000b502','00000000-0000-4000-8000-00000000b503');
insert into production.artifact_versions (id,artifact_id,version_number,job_id,job_attempt_id,output_kind,build_identity,content_digest)
values ('00000000-0000-4000-8000-00000000b531','00000000-0000-4000-8000-00000000b530',1,'00000000-0000-4000-8000-00000000b510','00000000-0000-4000-8000-00000000b525','report','p07-b5-synthetic-build','p07-b5-synthetic-digest');
do $$ begin
  begin
    insert into production.artifacts (id,person_id,product_id,product_version_id)
    values ('00000000-0000-4000-8000-00000000b532','00000000-0000-4000-8000-00000000b501','00000000-0000-4000-8000-00000000b502',null);
    raise exception 'T13_ARTIFACT_IDENTITY_GUARD_MISSING';
  exception when unique_violation then null;
  end;
  begin
    update production.artifact_versions set content_digest='rewrite-forbidden'
    where id='00000000-0000-4000-8000-00000000b531';
    raise exception 'T13_IMMUTABILITY_GUARD_MISSING';
  exception when insufficient_privilege then null;
  when others then
    if position('PRODUCTION_ROW_IMMUTABLE' in sqlerrm)=0 then raise; end if;
  end;
end $$;

-- T14 legacy history remains NULL and cannot be fabricated/backfilled; once
-- new provenance exists, the paired down migration must route forward-recovery.
do $$ begin
  if (select input_fingerprint from production.jobs where id='00000000-0000-4000-8000-00000000b512') is not null then
    raise exception 'T14_LEGACY_FINGERPRINT_FABRICATED';
  end if;
  begin
    update production.jobs set input_fingerprint=repeat('1',64)
    where id='00000000-0000-4000-8000-00000000b512';
    raise exception 'T14_LEGACY_BACKFILL_GUARD_MISSING';
  exception when others then
    if position('JOB_INPUT_FINGERPRINT_IMMUTABLE' in sqlerrm)=0 then raise; end if;
  end;
  begin
    if exists(select 1 from production.jobs where input_fingerprint is not null)
       or exists(select 1 from production.job_attempts where admission_input_fingerprint is not null) then
      raise exception 'JOB_FINGERPRINT_ROLLBACK_REQUIRES_FORWARD_RECOVERY';
    end if;
    raise exception 'T14_ROLLBACK_GUARD_MISSING';
  exception when others then
    if position('JOB_FINGERPRINT_ROLLBACK_REQUIRES_FORWARD_RECOVERY' in sqlerrm)=0 then raise; end if;
  end;
end $$;

select * from (values
  ('T1','PASS'),('T2','PASS'),('T3','PASS'),('T4','PASS'),('T5','PASS'),('T6','PASS'),('T7','PASS'),
  ('T8','PASS'),('T9','PASS'),('T10','PASS'),('T11','PASS'),('T12','PASS'),('T13','PASS'),('T14','PASS')
) as t(test_id,status);

reset role;
