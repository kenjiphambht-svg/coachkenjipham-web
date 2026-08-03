-- ============================================================
-- 0005 · Rate limit dùng chung Postgres cho public API.
--
-- Khóa là SHA-256 fingerprint do server tạo; không ghi raw IP vào bảng.
-- Hàm tăng đếm nguyên tử và chỉ service_role gọi được, nên client không
-- thể tự reset/thao túng bucket qua PostgREST.
-- ============================================================

create table rate_limit_buckets (
  key_hash          text primary key check (key_hash ~ '^[a-f0-9]{64}$'),
  request_count     integer not null check (request_count >= 0),
  window_started_at timestamptz not null,
  updated_at        timestamptz not null default now()
);

comment on table rate_limit_buckets is
  'Rate limit server-side. key_hash là SHA-256 fingerprint, không phải IP/raw identifier.';

alter table rate_limit_buckets enable row level security;
revoke all on rate_limit_buckets from anon, authenticated;

create or replace function consume_rate_limit(
  p_key_hash text,
  p_limit integer,
  p_window_seconds integer
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_count integer;
begin
  if p_key_hash !~ '^[a-f0-9]{64}$'
    or p_limit < 1
    or p_window_seconds < 1 then
    raise exception using errcode = 'P0001', message = 'INVALID_RATE_LIMIT_INPUT';
  end if;

  insert into rate_limit_buckets (key_hash, request_count, window_started_at)
    values (p_key_hash, 1, now())
    on conflict (key_hash) do update
      set request_count = case
            when rate_limit_buckets.window_started_at
              <= now() - make_interval(secs => p_window_seconds)
            then 1
            else rate_limit_buckets.request_count + 1
          end,
          window_started_at = case
            when rate_limit_buckets.window_started_at
              <= now() - make_interval(secs => p_window_seconds)
            then now()
            else rate_limit_buckets.window_started_at
          end,
          updated_at = now()
    returning request_count into v_count;

  return v_count <= p_limit;
end;
$$;

revoke all on function consume_rate_limit(text, integer, integer)
  from public, anon, authenticated;
grant execute on function consume_rate_limit(text, integer, integer) to service_role;
