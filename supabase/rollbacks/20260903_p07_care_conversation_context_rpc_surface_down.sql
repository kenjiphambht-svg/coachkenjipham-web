-- Rollback for 20260903_p07_care_conversation_context_rpc_surface.sql.
-- NOT FOR PRODUCTION EXECUTION WITHOUT A SEPARATE FOUNDER GATE.

revoke execute on function public.care_context_purge_expired(timestamptz) from service_role;
drop function if exists public.care_context_purge_expired(timestamptz);

revoke execute on function public.care_context_load_recent(text, text, text, timestamptz, integer) from service_role;
drop function if exists public.care_context_load_recent(text, text, text, timestamptz, integer);

revoke execute on function public.care_context_append_turn(
  text, text, text, text, text, text, timestamptz, text, timestamptz
) from service_role;
drop function if exists public.care_context_append_turn(
  text, text, text, text, text, text, timestamptz, text, timestamptz
);
