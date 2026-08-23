-- Synthetic acceptance matrix for WO-P07-B2B-INTAKE-IMPLEMENTATION-01.
-- Run only on an isolated/local or explicitly authorized staging transaction.

begin;

do $$
declare
  v_submission_1 uuid := '11111111-1111-4111-8111-111111111111';
  v_submission_2 uuid := '22222222-2222-4222-8222-222222222222';
  v_lead_1 uuid;
  v_lead_replay uuid;
  v_lead_2 uuid;
  v_intake_1 uuid;
  v_intake_replay uuid;
  v_intake_2 uuid;
  v_replayed boolean;
  v_count bigint;
  v_failed boolean;
begin
  -- AT-01: valid new submission persists one lead + one immutable intake.
  select lead_id, intake_event_id, replayed
    into v_lead_1, v_intake_1, v_replayed
  from public.advisory_intake_register(
    v_submission_1,
    'Founder tại doanh nghiệp dịch vụ',
    'Quy trình ra quyết định đang phân tán',
    'Đã thử AI nhưng chưa có hệ thống',
    'Cần chuẩn hoá trước giai đoạn tăng trưởng',
    'Nguyen Van A',
    ' Founder@Example.COM '
  );

  if v_replayed or v_lead_1 is null or v_intake_1 is null then
    raise exception 'AT_01_NEW_INTAKE_FAILED';
  end if;

  select count(*) into v_count
  from crm.advisory_leads
  where contact_email_normalized = 'founder@example.com';
  if v_count <> 1 then raise exception 'AT_01_LEAD_COUNT_FAILED'; end if;

  select count(*) into v_count
  from crm.advisory_lifecycle_events
  where intake_event_id = v_intake_1
    and event_type in ('RECEIVED', 'CRM_WRITTEN', 'ACK_PENDING');
  if v_count <> 3 then raise exception 'AT_01_LIFECYCLE_SEED_FAILED'; end if;

  -- AT-02: same submission + same normalized payload is an idempotent replay.
  select lead_id, intake_event_id, replayed
    into v_lead_replay, v_intake_replay, v_replayed
  from public.advisory_intake_register(
    v_submission_1,
    'Founder tại doanh nghiệp dịch vụ',
    'Quy trình ra quyết định đang phân tán',
    'Đã thử AI nhưng chưa có hệ thống',
    'Cần chuẩn hoá trước giai đoạn tăng trưởng',
    'Nguyen Van A',
    'founder@example.com'
  );

  if not v_replayed or v_lead_replay <> v_lead_1 or v_intake_replay <> v_intake_1 then
    raise exception 'AT_02_REPLAY_IDENTITY_FAILED';
  end if;

  select count(*) into v_count
  from crm.advisory_intake_events
  where submission_id = v_submission_1;
  if v_count <> 1 then raise exception 'AT_02_DUPLICATE_INTAKE_CREATED'; end if;

  select count(*) into v_count
  from crm.advisory_lifecycle_events
  where intake_event_id = v_intake_1;
  if v_count <> 3 then raise exception 'AT_02_DUPLICATE_LIFECYCLE_CREATED'; end if;

  -- AT-03: same submission + changed material fails closed.
  v_failed := false;
  begin
    perform * from public.advisory_intake_register(
      v_submission_1,
      'Founder tại doanh nghiệp dịch vụ',
      'MATERIAL CONFLICT',
      'Đã thử AI nhưng chưa có hệ thống',
      'Cần chuẩn hoá trước giai đoạn tăng trưởng',
      'Nguyen Van A',
      'founder@example.com'
    );
  exception when others then
    if sqlerrm like '%ADVISORY_SUBMISSION_CONFLICT%' then
      v_failed := true;
    else
      raise;
    end if;
  end;
  if not v_failed then raise exception 'AT_03_CONFLICT_NOT_REJECTED'; end if;

  -- AT-04: same normalized email + new submission = same lead, new history row.
  select lead_id, intake_event_id, replayed
    into v_lead_2, v_intake_2, v_replayed
  from public.advisory_intake_register(
    v_submission_2,
    'Founder tại doanh nghiệp dịch vụ',
    'Vấn đề mới sau vòng thử nghiệm đầu tiên',
    'Đã có pilot nhỏ',
    'Cần quyết định bước triển khai tiếp theo',
    'Nguyen Van A',
    'FOUNDER@example.com'
  );

  if v_replayed or v_lead_2 <> v_lead_1 or v_intake_2 = v_intake_1 then
    raise exception 'AT_04_SAME_LEAD_NEW_HISTORY_FAILED';
  end if;

  select count(*) into v_count
  from crm.advisory_intake_events
  where lead_id = v_lead_1;
  if v_count <> 2 then raise exception 'AT_04_HISTORY_COUNT_FAILED'; end if;

  -- AT-05: intake rows are immutable.
  v_failed := false;
  begin
    update crm.advisory_intake_events
      set business_problem = 'forbidden mutation'
    where id = v_intake_1;
  exception when others then
    if sqlerrm like '%ADVISORY_IMMUTABLE_RECORD%' then
      v_failed := true;
    else
      raise;
    end if;
  end;
  if not v_failed then raise exception 'AT_05_INTAKE_MUTATION_ALLOWED'; end if;

  -- AT-06: lifecycle append is idempotent for same correlation.
  perform * from public.advisory_intake_append_lifecycle(
    v_intake_1,
    'ACK_ERROR',
    'synthetic:ack-attempt:1',
    'SYNTHETIC_PROVIDER_UNAVAILABLE'
  );
  select replayed into v_replayed
  from public.advisory_intake_append_lifecycle(
    v_intake_1,
    'ACK_ERROR',
    'synthetic:ack-attempt:1',
    'SYNTHETIC_PROVIDER_UNAVAILABLE'
  );
  if not v_replayed then raise exception 'AT_06_LIFECYCLE_REPLAY_FAILED'; end if;

  -- AT-07: same lifecycle correlation cannot bind to a different truth.
  v_failed := false;
  begin
    perform * from public.advisory_intake_append_lifecycle(
      v_intake_1,
      'ACK_SENT',
      'synthetic:ack-attempt:1',
      null
    );
  exception when others then
    if sqlerrm like '%ADVISORY_LIFECYCLE_CORRELATION_CONFLICT%' then
      v_failed := true;
    else
      raise;
    end if;
  end;
  if not v_failed then raise exception 'AT_07_LIFECYCLE_CONFLICT_ALLOWED'; end if;

  -- AT-08: browser roles have no direct table privileges or RPC execution.
  if has_table_privilege('anon', 'crm.advisory_leads', 'INSERT')
     or has_table_privilege('anon', 'crm.advisory_intake_events', 'INSERT')
     or has_table_privilege('authenticated', 'crm.advisory_intake_events', 'INSERT') then
    raise exception 'AT_08_BROWSER_DIRECT_TABLE_WRITE_ALLOWED';
  end if;

  if has_function_privilege(
       'anon',
       'public.advisory_intake_register(uuid,text,text,text,text,text,text)',
       'EXECUTE'
     )
     or has_function_privilege(
       'authenticated',
       'public.advisory_intake_register(uuid,text,text,text,text,text,text)',
       'EXECUTE'
     ) then
    raise exception 'AT_08_BROWSER_DIRECT_RPC_ALLOWED';
  end if;

  raise notice 'P07_ADVISORY_INTAKE_AT_01_08_PASS';
end;
$$;

rollback;
