-- Synthetic acceptance matrix for Founder-approved Option A2.
-- Run only on isolated/local or explicitly authorized staging data.

begin;

do $$
declare
  v_submission uuid := '33333333-3333-4333-8333-333333333333';
  v_intake uuid;
  v_replayed boolean;
  v_count bigint;
  v_failed boolean;
  v_actor text := 'operator:p09-synthetic';
  v_target text := 'kenji:synthetic-handoff-target';
begin
  select intake_event_id
    into v_intake
  from public.advisory_intake_register(
    v_submission,
    'Synthetic founder/operator context',
    'Synthetic advisory care evidence test',
    'Synthetic AI state',
    'Synthetic why now',
    'Synthetic Operator Test',
    'synthetic-a2@example.com'
  );

  if v_intake is null then
    raise exception 'A2_AT_01_INTAKE_MISSING';
  end if;

  -- A2-01: service-role-only pending read exposes the minimum locked context.
  select count(*) into v_count
  from public.advisory_intake_list_pending(10)
  where intake_event_id = v_intake
    and contact_email = 'synthetic-a2@example.com'
    and latest_event_type = 'ACK_PENDING';
  if v_count <> 1 then raise exception 'A2_AT_01_PENDING_READ_FAILED'; end if;

  if has_function_privilege('anon', 'public.advisory_intake_list_pending(integer)', 'EXECUTE')
     or has_function_privilege('authenticated', 'public.advisory_intake_list_pending(integer)', 'EXECUTE')
     or has_function_privilege(
       'anon',
       'public.advisory_intake_append_lifecycle(uuid,text,text,text,text,text)',
       'EXECUTE'
     )
     or has_function_privilege(
       'authenticated',
       'public.advisory_intake_append_lifecycle(uuid,text,text,text,text,text)',
       'EXECUTE'
     ) then
    raise exception 'A2_AT_02_BROWSER_RPC_ACCESS_ALLOWED';
  end if;

  -- A2-03: human/care lifecycle evidence cannot omit actor.
  v_failed := false;
  begin
    perform * from public.advisory_intake_append_lifecycle(
      v_intake,
      'REVIEWED',
      'a2:review:missing-actor',
      'SYNTHETIC_REVIEW'
    );
  exception when others then
    if sqlerrm like '%ADVISORY_LIFECYCLE_ACTOR_REQUIRED%' then
      v_failed := true;
    else
      raise;
    end if;
  end;
  if not v_failed then raise exception 'A2_AT_03_MISSING_ACTOR_ALLOWED'; end if;

  -- A2-04: append is idempotent when correlation + evidence binding are identical.
  select replayed into v_replayed
  from public.advisory_intake_append_lifecycle(
    v_intake,
    'ACK_ERROR',
    'a2:ack-attempt:1',
    'SYNTHETIC_ACK_CHANNEL_UNAVAILABLE',
    v_actor,
    null
  );
  if v_replayed then raise exception 'A2_AT_04_FIRST_APPEND_REPLAYED'; end if;

  select replayed into v_replayed
  from public.advisory_intake_append_lifecycle(
    v_intake,
    'ACK_ERROR',
    'a2:ack-attempt:1',
    'SYNTHETIC_ACK_CHANNEL_UNAVAILABLE',
    v_actor,
    null
  );
  if not v_replayed then raise exception 'A2_AT_04_REPLAY_NOT_IDEMPOTENT'; end if;

  -- A2-05: same correlation cannot be rebound to a different actor/truth.
  v_failed := false;
  begin
    perform * from public.advisory_intake_append_lifecycle(
      v_intake,
      'ACK_ERROR',
      'a2:ack-attempt:1',
      'SYNTHETIC_ACK_CHANNEL_UNAVAILABLE',
      'operator:conflicting-actor',
      null
    );
  exception when others then
    if sqlerrm like '%ADVISORY_LIFECYCLE_CORRELATION_CONFLICT%' then
      v_failed := true;
    else
      raise;
    end if;
  end;
  if not v_failed then raise exception 'A2_AT_05_CORRELATION_REBIND_ALLOWED'; end if;

  -- A2-06: manual-first care sequence can be evidenced without inventing new event types.
  perform * from public.advisory_intake_append_lifecycle(
    v_intake, 'ACK_SENT', 'a2:ack-sent:1', 'SYNTHETIC_MANUAL_ACK', v_actor, null
  );
  perform * from public.advisory_intake_append_lifecycle(
    v_intake, 'REVIEWED', 'a2:reviewed:1', 'SYNTHETIC_HUMAN_REVIEW', v_actor, null
  );
  perform * from public.advisory_intake_append_lifecycle(
    v_intake, 'QUALIFIED', 'a2:qualified:1', 'SYNTHETIC_QUALIFIED', v_actor, null
  );
  perform * from public.advisory_intake_append_lifecycle(
    v_intake, 'HANDOFF_READY', 'a2:handoff-ready:1', 'SYNTHETIC_READY', v_actor, null
  );

  -- A2-07: HANDED_OFF cannot be asserted without explicit actor + target.
  v_failed := false;
  begin
    perform * from public.advisory_intake_append_lifecycle(
      v_intake,
      'HANDED_OFF',
      'a2:handed-off:missing-target',
      'SYNTHETIC_TRANSFER',
      v_actor,
      null
    );
  exception when others then
    if sqlerrm like '%ADVISORY_HANDOFF_TARGET_REQUIRED%' then
      v_failed := true;
    else
      raise;
    end if;
  end;
  if not v_failed then raise exception 'A2_AT_07_MISSING_HANDOFF_TARGET_ALLOWED'; end if;

  perform * from public.advisory_intake_append_lifecycle(
    v_intake,
    'HANDED_OFF',
    'a2:handed-off:1',
    'SYNTHETIC_TRANSFER',
    v_actor,
    v_target
  );

  select count(*) into v_count
  from crm.advisory_lifecycle_events
  where intake_event_id = v_intake
    and event_type = 'HANDED_OFF'
    and actor_reference = v_actor
    and target_reference = v_target
    and occurred_at is not null;
  if v_count <> 1 then raise exception 'A2_AT_07_HANDOFF_PROOF_MISSING'; end if;

  -- A2-08: completed/suppressed items are not returned by pending-read surface.
  select count(*) into v_count
  from public.advisory_intake_list_pending(10)
  where intake_event_id = v_intake;
  if v_count <> 0 then raise exception 'A2_AT_08_COMPLETED_ITEM_STILL_PENDING'; end if;

  -- A2-09: direct browser table writes remain denied.
  if has_table_privilege('anon', 'crm.advisory_lifecycle_events', 'INSERT')
     or has_table_privilege('authenticated', 'crm.advisory_lifecycle_events', 'INSERT') then
    raise exception 'A2_AT_09_BROWSER_TABLE_WRITE_ALLOWED';
  end if;

  raise notice 'P07_ADVISORY_A2_AT_01_09_PASS';
end;
$$;

rollback;
