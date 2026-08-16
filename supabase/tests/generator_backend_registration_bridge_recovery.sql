\set ON_ERROR_STOP on
-- Non-empty recovery policy proof. The actual down file contains this same
-- fail-closed predicate; this rollback-only runtime check proves adopted
-- evidence selects forward recovery without destroying it.
begin;
\ir generator_backend_registration_bridge.sql
do $$
begin
  begin
    if exists (
      select 1 from production.artifact_versions
      where registration_correlation_reference is not null
    ) or exists (
      select 1 from production.artifact_version_representations
    ) or exists (
      select 1 from production.artifact_reviews where review_contract_guarded
    ) then
      raise exception 'GENERATOR_BACKEND_BRIDGE_ROLLBACK_REQUIRES_FORWARD_RECOVERY';
    end if;
    raise exception 'GBI_RECOVERY_GUARD_MISSING';
  exception when others then
    if position('GENERATOR_BACKEND_BRIDGE_ROLLBACK_REQUIRES_FORWARD_RECOVERY' in sqlerrm) = 0 then
      raise;
    end if;
  end;
end;
$$;
rollback;
select 'GBI_NON_EMPTY_RECOVERY: PASS' as generator_backend_registration_bridge_recovery;
