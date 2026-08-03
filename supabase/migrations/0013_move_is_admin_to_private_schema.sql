-- 0013 · Security Advisor remediation: remove SECURITY DEFINER RPC from
-- exposed public schema while preserving existing RLS policy dependencies.

create schema if not exists app_private;
revoke all on schema app_private from public;
grant usage on schema app_private to authenticated;

alter function public.is_admin() set schema app_private;
revoke execute on function app_private.is_admin() from public, anon;
grant execute on function app_private.is_admin() to authenticated;

comment on function app_private.is_admin() is
  'Internal RLS helper. SECURITY DEFINER; fixed search_path public; stable safe boolean only. Not exposed as a PostgREST RPC.';
