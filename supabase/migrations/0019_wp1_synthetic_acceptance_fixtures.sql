-- ============================================================
-- 0019 · WP1 synthetic acceptance fixtures for staging only.
--
-- Scope is deliberately limited to the three pre-existing, clearly marked
-- HATMAM-TEST* seed records. No customer/child data is created or modified.
-- These rows make the Admin UX verifiable with HM-01/HM-02 package snapshots,
-- a synthetic reported payment and a synthetic deletion preview.
-- ============================================================

update hatmam_orders
set
  package = case order_code
    when 'HATMAM-TEST02' then 'HM-02'
    else 'HM-01'
  end,
  status = case when order_code = 'HATMAM-TEST01' then 'awaiting_payment'::hatmam_status else status end,
  submission_validated_at = coalesce(submission_validated_at, now())
where order_code in ('HATMAM-TEST01', 'HATMAM-TEST02', 'HATMAM-TEST03')
  and parent_name like '%Test%';

insert into hatmam_package_snapshots (
  order_id, package_code, package_version, amount_vnd,
  delivery_business_days, revision_window_days,
  raw_intake_retention_months, publication_retention_months
)
select
  id,
  package,
  '2026-08-03-wp1-synthetic',
  case when package = 'HM-02' then 3500000 else 2000000 end,
  5, 7, 12, 24
from hatmam_orders
where order_code in ('HATMAM-TEST01', 'HATMAM-TEST02', 'HATMAM-TEST03')
  and parent_name like '%Test%'
on conflict (order_id) do nothing;

update hatmam_child_profiles
set parent_question = 'DỮ LIỆU THỬ — ba mẹ muốn hiểu cách tạo thêm không gian lắng nghe trong sinh hoạt hằng ngày.'
where order_id in (
  select id from hatmam_orders
  where order_code in ('HATMAM-TEST02', 'HATMAM-TEST03') and parent_name like '%Test%'
);

insert into consents (subject, subject_id, consent_type, consent_version, granted, granted_at, evidence)
select
  'hatmam', id, 'parent_child_data_processing', '2026-08-03-wp1-synthetic', true, now(),
  jsonb_build_object('source', 'wp1-synthetic-fixture')
from hatmam_orders
where order_code in ('HATMAM-TEST01', 'HATMAM-TEST02', 'HATMAM-TEST03')
  and parent_name like '%Test%'
  and not exists (
    select 1 from consents
    where subject = 'hatmam' and subject_id = hatmam_orders.id
      and consent_version = '2026-08-03-wp1-synthetic'
  );

insert into hatmam_payment_requests (
  order_id, token_hash, expires_at, reported_transfer_at, report_reference
)
select
  id,
  encode(extensions.digest('wp1-synthetic-hatmam-test01', 'sha256'), 'hex'),
  now() + interval '7 days',
  now() - interval '10 minutes',
  'HATMAM HATMAM-TEST01'
from hatmam_orders
where order_code = 'HATMAM-TEST01' and parent_name like '%Test%'
on conflict (order_id) do nothing;

insert into data_deletion_requests (
  subject_type, subject_id, requester_contact_hash, reason_code, status,
  idempotency_key_hash, identity_verified_at, execution_evidence
)
select
  'hatmam_order', id,
  encode(extensions.digest('wp1-synthetic-requester', 'sha256'), 'hex'),
  'early_deletion_request', 'identity_verified',
  encode(extensions.digest('wp1-synthetic-deletion-request', 'sha256'), 'hex'),
  now(), jsonb_build_object('source', 'wp1-synthetic-fixture', 'preview_only', true)
from hatmam_orders
where order_code = 'HATMAM-TEST03' and parent_name like '%Test%'
on conflict (idempotency_key_hash) do nothing;
