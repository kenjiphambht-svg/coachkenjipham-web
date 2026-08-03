-- ============================================================
-- 0017 · B8 data-deletion and retention workflow.
--
-- This is an approval ledger, not an automatic eraser. It keeps no raw
-- requester contact or child data, and intentionally leaves the B3 release
-- gate OFF until a controlled, authenticated Storage/metadata drill exists.
-- ============================================================

create table data_retention_rules (
  subject_type text primary key check (subject_type in ('hatmam_raw_intake', 'hatmam_private_publication', 'lang_private_room')),
  retention_months integer not null check (retention_months > 0),
  early_deletion_available boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
comment on table data_retention_rules is
  'B8 canonical retention rules. Changes require a new forward migration or an audited AAL2 admin workflow.';

insert into data_retention_rules (subject_type, retention_months, early_deletion_available) values
  ('hatmam_raw_intake', 12, true),
  ('hatmam_private_publication', 24, true),
  ('lang_private_room', 24, true);

create table data_deletion_requests (
  id uuid primary key default gen_random_uuid(),
  subject_type text not null check (subject_type in ('hatmam_order', 'hatmam_publication', 'lang_lead')),
  subject_id uuid not null,
  requester_contact_hash text not null check (requester_contact_hash ~ '^[a-f0-9]{64}$'),
  reason_code text not null default 'early_deletion_request'
    check (reason_code in ('early_deletion_request', 'retention_expired', 'legal_request')),
  status text not null default 'received'
    check (status in ('received', 'identity_verified', 'approved', 'executing', 'completed', 'failed', 'rejected')),
  idempotency_key_hash text not null unique check (idempotency_key_hash ~ '^[a-f0-9]{64}$'),
  requested_at timestamptz not null default now(),
  identity_verified_at timestamptz,
  approved_at timestamptz,
  approved_by uuid,
  execution_attempts integer not null default 0 check (execution_attempts >= 0),
  execution_evidence jsonb not null default '{}'::jsonb,
  last_error_code text,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint data_deletion_request_completion_is_terminal check (
    (status = 'completed' and completed_at is not null)
    or (status <> 'completed' and completed_at is null)
  )
);
comment on table data_deletion_requests is
  'B8 approval and execution ledger. Requester contact and child PII are never stored here; only SHA-256 contact and idempotency hashes are retained.';
create index data_deletion_requests_subject_idx on data_deletion_requests (subject_type, subject_id, status);

create trigger set_updated_at before update on data_retention_rules
  for each row execute function set_updated_at();
create trigger set_updated_at before update on data_deletion_requests
  for each row execute function set_updated_at();

alter table data_retention_rules enable row level security;
alter table data_retention_rules force row level security;
alter table data_deletion_requests enable row level security;
alter table data_deletion_requests force row level security;
revoke all on data_retention_rules, data_deletion_requests from anon, authenticated;
grant select on data_retention_rules, data_deletion_requests to authenticated;
create policy data_retention_rules_select_admin_aal2 on data_retention_rules
  for select to authenticated using (app_private.is_admin() and (select auth.jwt()->>'aal') = 'aal2');
create policy data_deletion_requests_select_admin_aal2 on data_deletion_requests
  for select to authenticated using (app_private.is_admin() and (select auth.jwt()->>'aal') = 'aal2');

-- There is deliberately no client insert/update/delete policy. A future
-- server-side workflow must verify the requester, record an admin approval,
-- delete the private object first, then delete metadata, and retain only the
-- non-PII execution evidence. Until that drill passes, deletion_workflow_ready
-- stays false and no child intake may be publicly activated.
