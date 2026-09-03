-- WO-P11-HM-SYNTHETIC-PRIVATE-TEST-01
-- Structural/security assertions for the bounded P07 private-access delta.
-- Run after the candidate migration on a synthetic/local/staging database.
-- No fixture/customer data is required.

do $$
declare
  v_table text;
  v_function regprocedure;
  v_definer boolean;
  v_config text[];
begin
  if not exists (select 1 from pg_namespace where nspname = 'delivery') then
    raise exception 'P11_ACCESS_TEST_FAIL: delivery schema missing';
  end if;

  if has_schema_privilege('anon', 'delivery', 'USAGE')
     or has_schema_privilege('authenticated', 'delivery', 'USAGE') then
    raise exception 'P11_ACCESS_TEST_FAIL: browser role has delivery schema usage';
  end if;

  foreach v_table in array array[
    'private_artifact_access',
    'private_access_events',
    'delivery_succeeded_events',
    'customer_confirmed_events'
  ] loop
    if not exists (
      select 1
      from pg_class c
      join pg_namespace n on n.oid = c.relnamespace
      where n.nspname = 'delivery'
        and c.relname = v_table
        and c.relrowsecurity
        and c.relforcerowsecurity
    ) then
      raise exception 'P11_ACCESS_TEST_FAIL: RLS/FORCE RLS missing on %', v_table;
    end if;

    if has_table_privilege('anon', format('delivery.%I', v_table), 'SELECT')
       or has_table_privilege('authenticated', format('delivery.%I', v_table), 'SELECT')
       or has_table_privilege('anon', format('delivery.%I', v_table), 'INSERT')
       or has_table_privilege('authenticated', format('delivery.%I', v_table), 'INSERT') then
      raise exception 'P11_ACCESS_TEST_FAIL: browser table privilege on %', v_table;
    end if;

    if has_table_privilege('service_role', format('delivery.%I', v_table), 'INSERT')
       or has_table_privilege('service_role', format('delivery.%I', v_table), 'UPDATE')
       or has_table_privilege('service_role', format('delivery.%I', v_table), 'DELETE') then
      raise exception 'P11_ACCESS_TEST_FAIL: service_role direct write privilege on %', v_table;
    end if;

    if not has_table_privilege('service_role', format('delivery.%I', v_table), 'SELECT') then
      raise exception 'P11_ACCESS_TEST_FAIL: service_role read privilege missing on %', v_table;
    end if;
  end loop;

  foreach v_function in array array[
    'delivery.issue_private_artifact_access(uuid,uuid,uuid,text,timestamptz)'::regprocedure,
    'delivery.revoke_private_artifact_access(uuid,text,text,text)'::regprocedure,
    'delivery.authorize_private_artifact_access(uuid,uuid)'::regprocedure,
    'delivery.record_delivery_succeeded(uuid,text)'::regprocedure,
    'delivery.record_customer_confirmed(uuid,uuid,text,text)'::regprocedure,
    'delivery.get_founder_test_trace(uuid)'::regprocedure
  ] loop
    if has_function_privilege('anon', v_function, 'EXECUTE')
       or has_function_privilege('authenticated', v_function, 'EXECUTE') then
      raise exception 'P11_ACCESS_TEST_FAIL: browser execute privilege on %', v_function::text;
    end if;
    if not has_function_privilege('service_role', v_function, 'EXECUTE') then
      raise exception 'P11_ACCESS_TEST_FAIL: service_role execute missing on %', v_function::text;
    end if;

    select p.prosecdef, p.proconfig
      into v_definer, v_config
    from pg_proc p
    where p.oid = v_function::oid;

    if not v_definer then
      raise exception 'P11_ACCESS_TEST_FAIL: entry point is not SECURITY DEFINER: %', v_function::text;
    end if;
    if v_config is null or not ('search_path=pg_catalog' = any(v_config)) then
      raise exception 'P11_ACCESS_TEST_FAIL: locked search_path missing on %', v_function::text;
    end if;
  end loop;

  if has_function_privilege(
       'service_role',
       'delivery._evaluate_deliverable_version(uuid,uuid,uuid)'::regprocedure,
       'EXECUTE'
     )
     or has_function_privilege(
       'service_role',
       'delivery._evaluate_private_access(uuid,uuid)'::regprocedure,
       'EXECUTE'
     ) then
    raise exception 'P11_ACCESS_TEST_FAIL: internal evaluator exposed to service_role';
  end if;

  if not exists (
    select 1
    from pg_constraint con
    join pg_class c on c.oid = con.conrelid
    join pg_namespace n on n.oid = c.relnamespace
    where n.nspname = 'delivery'
      and c.relname = 'private_artifact_access'
      and con.conname = 'private_artifact_access_revocation_complete'
  ) then
    raise exception 'P11_ACCESS_TEST_FAIL: revocation completeness constraint missing';
  end if;

  if not exists (
    select 1
    from pg_indexes
    where schemaname = 'delivery'
      and indexname = 'delivery_private_access_one_active_person_version_idx'
  ) then
    raise exception 'P11_ACCESS_TEST_FAIL: one-active-access partial index missing';
  end if;
end;
$$;

select 'P11_HM_PRIVATE_ACCESS_SECURITY_CONTRACT_PASS' as result;
