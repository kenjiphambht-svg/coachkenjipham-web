-- 20260813185043 · WO-LAUNCH-CORE-03 lifecycle closure: P07 final
-- acceptance review — creation-time bypass.
-- Corrective, additive-only migration over
-- 20260813183452_launch_core_payment_evidence_entitlement_final_acceptance.
-- Does not reset or drop the entitlement schema; does not edit any
-- previously applied migration file.
--
-- GAP: the controlled transition path built in the prior round
-- (record_payment_evidence_verification, column-level UPDATE revoke on
-- verification_status) only governs how verification_status CHANGES on
-- an EXISTING row. It never governed what verification_status a NEW row
-- is allowed to be born with. A caller with ordinary INSERT privilege on
-- entitlement.payment_evidence could set verification_status = 'verified'
-- or 'invalidated' directly in the INSERT statement — entering canonical
-- verified/invalidated truth with zero corresponding provenance history,
-- completely bypassing the authoritative lifecycle mechanism.
--
-- FIX: every new Payment Evidence row must start life as 'recorded' —
-- the one state that carries no history requirement, since it IS the
-- origin state. A dedicated BEFORE INSERT trigger enforces this
-- regardless of what value is supplied (including an explicit attempt to
-- override the column default). Combined with the existing INSERT
-- default ('recorded') and the existing UPDATE-only controlled path from
-- the prior migration, this closes the lifecycle end-to-end: creation can
-- only ever produce 'recorded'; every later transition can only ever
-- happen through entitlement.record_payment_evidence_verification(),
-- which always creates the matching provenance-carrying history row.

create or replace function entitlement.reject_payment_evidence_initial_status()
returns trigger
language plpgsql
set search_path = pg_catalog, entitlement
as $$
begin
  if NEW.verification_status is distinct from 'recorded' then
    raise exception 'PAYMENT_EVIDENCE_MUST_START_RECORDED';
  end if;
  return NEW;
end;
$$;

comment on function entitlement.reject_payment_evidence_initial_status() is
  'Every new Payment Evidence row must start life as recorded — the only state with no history requirement, since it is the lifecycle origin. Closes the creation-time bypass of the authoritative verification transition path: verified/invalidated can now only ever be reached afterward, through entitlement.record_payment_evidence_verification(), which always creates the matching provenance-carrying history row.';

revoke all on function entitlement.reject_payment_evidence_initial_status() from public, anon, authenticated;

create trigger payment_evidence_block_non_recorded_insert
  before insert on entitlement.payment_evidence
  for each row execute function entitlement.reject_payment_evidence_initial_status();
