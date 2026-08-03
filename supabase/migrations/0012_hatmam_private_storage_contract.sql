-- ============================================================
-- 0012 · B4 private Storage contract.
--
-- Private bucket only. No object is inserted by this migration and release
-- gates stay OFF until a controlled dummy upload/download/deletion test.
-- ============================================================

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
  values (
    'hatmam-publications-private',
    'hatmam-publications-private',
    false,
    10485760,
    array['application/pdf']::text[]
  )
  on conflict (id) do nothing;

create table hatmam_publication_assets (
  id uuid primary key default gen_random_uuid(),
  publication_id uuid not null unique references publications(id) on delete cascade,
  storage_bucket text not null default 'hatmam-publications-private'
    check (storage_bucket = 'hatmam-publications-private'),
  storage_object_path text not null unique check (storage_object_path !~ '(^/|\\.\\.|[?&#])'),
  content_sha256 text not null check (content_sha256 ~ '^[a-f0-9]{64}$'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
comment on table hatmam_publication_assets is
  'Metadata only for a private PDF asset. Object path contains publication UUID only, never child PII. No signed URL is persisted.';

create trigger set_updated_at before update on hatmam_publication_assets
  for each row execute function set_updated_at();
alter table hatmam_publication_assets enable row level security;
alter table hatmam_publication_assets force row level security;
revoke all on hatmam_publication_assets from anon, authenticated;
grant select on hatmam_publication_assets to authenticated;
create policy hatmam_publication_assets_select_admin on hatmam_publication_assets
  for select to authenticated using (is_admin());
create policy hatmam_publication_assets_require_aal2 on hatmam_publication_assets
  as restrictive for select to authenticated using ((select auth.jwt()->>'aal') = 'aal2');

-- No storage.objects policy is granted to anon/authenticated. Server-side
-- service_role will later create short-lived signed URLs only after validating
-- the hashed private publication token. B4 must prove that flow with dummy
-- data before private_storage_ready can ever be set true.
