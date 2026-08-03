-- B5 · Versioned operational settings. Only AAL2 admins may read/write.
create table operational_settings_versions (
  id uuid primary key default gen_random_uuid(),
  version integer not null unique,
  values jsonb not null,
  active boolean not null default false,
  created_by text not null,
  created_at timestamptz not null default now(),
  activated_at timestamptz
);
create unique index operational_settings_one_active_idx on operational_settings_versions (active) where active;
comment on table operational_settings_versions is 'Versioned business settings: packages, capacity, timelines, retention and integration readiness. Historical order snapshots never change.';
alter table operational_settings_versions enable row level security;
alter table operational_settings_versions force row level security;
revoke all on operational_settings_versions from anon, authenticated;
grant select on operational_settings_versions to authenticated;
create policy operational_settings_select_admin_aal2 on operational_settings_versions for select to authenticated using (app_private.is_admin() and (select auth.jwt()->>'aal') = 'aal2');

insert into operational_settings_versions (version, values, active, created_by, activated_at) values (
  1,
  jsonb_build_object(
    'hatmam', jsonb_build_object('hm01_price_vnd',2000000,'hm02_price_vnd',3500000,'capacity_month',10,'delivery_business_days',5,'revision_window_days',7,'raw_intake_retention_months',12,'publication_retention_months',24,'public_activation_enabled',false,'private_storage_ready',false),
    'lang', jsonb_build_object('raw_intake_retention_months',24,'summary_retention_months',36),
    'integrations', jsonb_build_object('resend','waiting_for_kenji','calcom','waiting_for_kenji')
  ), true, 'system:migration-0014', now()
);
