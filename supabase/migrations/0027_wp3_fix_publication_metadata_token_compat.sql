-- 0027 · WP3 forward repair for canonical private-publication metadata.
-- Legacy `publications.access_token_hash` remains NOT NULL after 0004. Create
-- an opaque hash only to satisfy that historical metadata constraint; it is
-- never returned, used as authorization, or used as a Reading Room URL.

create or replace function create_hatmam_publication_version(
  p_order_id uuid,
  p_actor text,
  p_template_version text default null
)
returns table (publication_id uuid, publication_version_id uuid, version_number integer, status text)
language plpgsql
security definer
set search_path = public, app_private
as $$
declare
  v_order hatmam_orders%rowtype;
  v_publication_id uuid;
  v_version_id uuid;
  v_version_number integer;
begin
  if nullif(btrim(p_actor), '') is null or p_actor not like 'human:%' then
    raise exception using errcode = 'P0001', message = 'HUMAN_ACTOR_REQUIRED';
  end if;
  select * into v_order from hatmam_orders where id = p_order_id for update;
  if not found then raise exception using errcode = 'P0001', message = 'ORDER_NOT_FOUND'; end if;
  if v_order.status <> 'ready' then raise exception using errcode = 'P0001', message = 'PUBLICATION_NOT_READY'; end if;
  select id into v_publication_id from publications where order_id = p_order_id order by created_at asc limit 1 for update;
  if not found then
    insert into publications(order_id, access_token_hash)
      values (p_order_id, encode(extensions.digest(extensions.gen_random_bytes(32), 'sha256'), 'hex'))
      returning id into v_publication_id;
  end if;
  select coalesce(max(pv.version_number), 0) + 1 into v_version_number
    from publication_versions pv where pv.publication_id = v_publication_id;
  insert into publication_versions(publication_id, version_number, status, template_version)
    values (v_publication_id, v_version_number, 'review_pending', nullif(btrim(p_template_version), ''))
    returning id into v_version_id;
  insert into audit_log(actor, action, entity_type, entity_id, to_state)
    values (p_actor, 'hatmam.publication_version_created', 'publication_version', v_version_id, 'review_pending');
  return query select v_publication_id, v_version_id, v_version_number, 'review_pending'::text;
end;
$$;
