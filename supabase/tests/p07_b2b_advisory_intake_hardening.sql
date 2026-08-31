-- Supplemental synthetic hardening checks for WO-P07-B2B-INTAKE-IMPLEMENTATION-01.
-- Run after both Advisory intake migrations, inside isolated/local or explicitly
-- authorized staging only.

begin;

do $$
declare
  v_submission uuid := '33333333-3333-4333-8333-333333333333';
  v_lead uuid;
  v_failed boolean;
begin
  -- AT-09: explicit NULL email fails with a bounded contract error.
  v_failed := false;
  begin
    perform * from public.advisory_intake_register(
      v_submission,
      'Synthetic role',
      'Synthetic problem',
      'Synthetic AI state',
      'Synthetic why now',
      'Synthetic Name',
      null
    );
  exception when others then
    if sqlerrm like '%ADVISORY_CONTACT_EMAIL_INVALID%' then
      v_failed := true;
    else
      raise;
    end if;
  end;
  if not v_failed then raise exception 'AT_09_NULL_EMAIL_NOT_REJECTED'; end if;

  -- Create one valid lead to prove stable lead identity is immutable.
  select lead_id into v_lead
  from public.advisory_intake_register(
    v_submission,
    'Synthetic role',
    'Synthetic problem',
    'Synthetic AI state',
    'Synthetic why now',
    'Synthetic Name',
    'synthetic-hardening@example.com'
  );

  -- AT-10: lead identity/provenance cannot be updated in place.
  v_failed := false;
  begin
    update crm.advisory_leads
      set contact_email_normalized = 'changed@example.com'
    where id = v_lead;
  exception when others then
    if sqlerrm like '%ADVISORY_IMMUTABLE_RECORD%' then
      v_failed := true;
    else
      raise;
    end if;
  end;
  if not v_failed then raise exception 'AT_10_LEAD_MUTATION_ALLOWED'; end if;

  raise notice 'P07_ADVISORY_INTAKE_AT_09_10_PASS';
end;
$$;

rollback;
