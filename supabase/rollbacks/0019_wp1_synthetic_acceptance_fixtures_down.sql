-- Manual rollback only. Never run automatically.
-- Removes only WP1 fixture additions/changes identified by exact synthetic markers.

delete from data_deletion_requests
where idempotency_key_hash = encode(extensions.digest('wp1-synthetic-deletion-request', 'sha256'), 'hex');

delete from hatmam_payment_requests
where token_hash = encode(extensions.digest('wp1-synthetic-hatmam-test01', 'sha256'), 'hex');

delete from consents
where subject = 'hatmam' and consent_version = '2026-08-03-wp1-synthetic';

delete from hatmam_package_snapshots
where package_version = '2026-08-03-wp1-synthetic';

update hatmam_child_profiles
set parent_question = null
where parent_question = 'DỮ LIỆU THỬ — ba mẹ muốn hiểu cách tạo thêm không gian lắng nghe trong sinh hoạt hằng ngày.';

update hatmam_orders
set
  package = case order_code
    when 'HATMAM-TEST02' then 'goi-2'
    else 'goi-1'
  end,
  status = case when order_code = 'HATMAM-TEST01' then 'submitted'::hatmam_status else status end
where order_code in ('HATMAM-TEST01', 'HATMAM-TEST02', 'HATMAM-TEST03')
  and parent_name like '%Test%';
