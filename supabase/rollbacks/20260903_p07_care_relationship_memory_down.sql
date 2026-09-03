-- P07 Phase B relationship-memory rollback artifact.
-- NOT FOR PRODUCTION EXECUTION WITHOUT A SEPARATE FOUNDER GATE.
-- Run the RPC-surface rollback first.

drop function if exists care.care_memory_forget(uuid,text,text,text,text,text,text,timestamptz,text);
drop function if exists care.care_memory_update(uuid,text,text,text,text,jsonb,text,text,text,text,text,text,timestamptz,timestamptz,timestamptz,timestamptz,text);
drop function if exists care.care_memory_read(uuid,text,text,text,text,timestamptz,integer);
drop table if exists care.relationship_memories;
