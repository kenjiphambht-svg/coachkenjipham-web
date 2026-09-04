-- Rollback for 20260903_p07_care_conversation_context.sql.
-- NOT FOR PRODUCTION EXECUTION WITHOUT A SEPARATE FOUNDER GATE.

revoke execute on function care.care_context_purge_expired(timestamptz) from service_role;
drop function if exists care.care_context_purge_expired(timestamptz);

revoke execute on function care.care_context_load_recent(text, text, text, timestamptz, integer) from service_role;
drop function if exists care.care_context_load_recent(text, text, text, timestamptz, integer);

revoke execute on function care.care_context_append_turn(
  text, text, text, text, text, text, timestamptz, text, timestamptz
) from service_role;
drop function if exists care.care_context_append_turn(
  text, text, text, text, text, text, timestamptz, text, timestamptz
);

drop table if exists care.conversation_messages;
drop table if exists care.conversations;

drop trigger if exists channel_identities_set_updated_at on identity.channel_identities;
drop table if exists identity.channel_identities;

drop schema if exists care;
