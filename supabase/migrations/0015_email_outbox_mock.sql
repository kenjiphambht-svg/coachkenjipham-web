create table email_outbox (
  id uuid primary key default gen_random_uuid(),
  idempotency_key text not null unique,
  template_version text not null,
  recipient_hash text not null check (recipient_hash ~ '^[a-f0-9]{64}$'),
  subject text not null,
  status text not null check (status in ('queued','sent','failed','retrying','mocked')),
  provider_message_id text,
  attempts integer not null default 0 check (attempts >= 0),
  last_error_code text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table email_outbox enable row level security;
revoke all on email_outbox from anon, authenticated;
grant select on email_outbox to authenticated;
create policy email_outbox_admin_aal2 on email_outbox for select to authenticated using (app_private.is_admin() and (select auth.jwt()->>'aal') = 'aal2');
create trigger set_updated_at before update on email_outbox for each row execute function set_updated_at();
comment on table email_outbox is 'B6 delivery ledger. No recipient raw address or sensitive intake content is stored.';
