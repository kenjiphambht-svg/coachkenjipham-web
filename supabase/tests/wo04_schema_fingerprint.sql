\set ON_ERROR_STOP on
\pset tuples_only on
\pset format unaligned

-- Stable structural fingerprint used to compare a fresh canonical install
-- with the Founder-approved essence-staging reconciliation. It includes
-- columns/defaults, constraints, indexes, functions, triggers, views, RLS,
-- comments, and table/routine grants for canonical schemas.

with object_lines as (
  select c.table_schema as schema_name,
         format('column|%s|%s|%s|%s|%s|%s',
           c.table_name, lpad(c.ordinal_position::text, 4, '0'), c.column_name,
           c.data_type, c.is_nullable, coalesce(c.column_default, '')) as line
  from information_schema.columns c
  where c.table_schema in ('identity', 'commerce', 'entitlement', 'knowledge', 'production')

  union all

  select n.nspname,
         format('constraint|%s|%s|%s|%s', cl.relname, con.conname, con.contype,
           pg_get_constraintdef(con.oid, true))
  from pg_constraint con
  join pg_class cl on cl.oid = con.conrelid
  join pg_namespace n on n.oid = cl.relnamespace
  where n.nspname in ('identity', 'commerce', 'entitlement', 'knowledge', 'production')

  union all

  select schemaname, format('index|%s|%s|%s', tablename, indexname, indexdef)
  from pg_indexes
  where schemaname in ('identity', 'commerce', 'entitlement', 'knowledge', 'production')

  union all

  select n.nspname,
         format('function|%s|%s', p.oid::regprocedure::text, pg_get_functiondef(p.oid))
  from pg_proc p
  join pg_namespace n on n.oid = p.pronamespace
  where n.nspname in ('identity', 'commerce', 'entitlement', 'knowledge', 'production')

  union all

  select n.nspname,
         format('trigger|%s|%s|%s', c.relname, t.tgname, pg_get_triggerdef(t.oid, true))
  from pg_trigger t
  join pg_class c on c.oid = t.tgrelid
  join pg_namespace n on n.oid = c.relnamespace
  where not t.tgisinternal
    and n.nspname in ('identity', 'commerce', 'entitlement', 'knowledge', 'production')

  union all

  select v.schemaname, format('view|%s|%s', v.viewname, v.definition)
  from pg_views v
  where v.schemaname in ('identity', 'commerce', 'entitlement', 'knowledge', 'production')

  union all

  select n.nspname,
         format('rls|%s|enabled=%s|forced=%s', c.relname, c.relrowsecurity, c.relforcerowsecurity)
  from pg_class c
  join pg_namespace n on n.oid = c.relnamespace
  where c.relkind in ('r', 'p')
    and n.nspname in ('identity', 'commerce', 'entitlement', 'knowledge', 'production')

  union all

  select n.nspname,
         format('table-comment|%s|%s', c.relname, coalesce(obj_description(c.oid, 'pg_class'), ''))
  from pg_class c
  join pg_namespace n on n.oid = c.relnamespace
  where c.relkind in ('r', 'p', 'v')
    and n.nspname in ('identity', 'commerce', 'entitlement', 'knowledge', 'production')

  union all

  select n.nspname,
         format('column-comment|%s|%s|%s', c.relname, a.attname,
           coalesce(col_description(c.oid, a.attnum), ''))
  from pg_attribute a
  join pg_class c on c.oid = a.attrelid
  join pg_namespace n on n.oid = c.relnamespace
  where a.attnum > 0 and not a.attisdropped
    and c.relkind in ('r', 'p', 'v')
    and n.nspname in ('identity', 'commerce', 'entitlement', 'knowledge', 'production')

  union all

  select g.table_schema,
         format('grant|table|%s|%s|%s', g.table_name, g.grantee, g.privilege_type)
  from information_schema.role_table_grants g
  where g.table_schema in ('identity', 'commerce', 'entitlement', 'knowledge', 'production')

  union all

  select r.routine_schema,
         format('grant|routine|%s|%s|%s', r.routine_name, r.grantee, r.privilege_type)
  from information_schema.routine_privileges r
  where r.routine_schema in ('identity', 'commerce', 'entitlement', 'knowledge', 'production')
)
select schema_name || '|' || md5(string_agg(line, E'\n' order by line)) || '|' || count(*)
from object_lines
group by schema_name
order by schema_name;
