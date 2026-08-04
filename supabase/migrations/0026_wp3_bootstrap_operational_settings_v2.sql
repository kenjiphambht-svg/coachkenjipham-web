-- 0026 · WP3 compatibility bootstrap for the active settings contract.
-- The original staging v1 only held legacy retention fields for Lặng. Create
-- one complete, versioned v2 from the already-approved Working Defaults so a
-- new Lặng payment can snapshot its own price. Existing order snapshots stay
-- untouched; every release/provider readiness remains OFF.

do $$
declare
  v_active operational_settings_versions%rowtype;
  v_next_version integer;
  v_values jsonb;
begin
  select * into v_active from operational_settings_versions where active = true for update;
  if not found then raise exception using errcode = 'P0001', message = 'SETTINGS_REQUIRED'; end if;
  if coalesce(v_active.values#>>'{lang,priceVnd}', '') ~ '^\d+$' then
    -- A complete version was already saved by an Admin; never overwrite it.
    return;
  end if;

  v_values := jsonb_build_object(
    'lang', jsonb_build_object(
      'priceVnd', 10000000,
      'capacityMonth', 5,
      'responseSlaMinutes', 60,
      'paymentConfirmationSlaMinutes', 60,
      'sessionDurationMinutes', 90,
      'publicLocationLabel', 'Lê Hồng Phong, Sài Gòn',
      'rawIntakeRetentionMonths', 24,
      'summaryRetentionMonths', 36,
      'bookingDefaults', jsonb_build_object(
        'tuesday0930', true, 'thursday1430', true,
        'postSessionBufferMinutes', 60, 'minNoticeHours', 48,
        'bookingHorizonDays', 21, 'rescheduleDeadlineHours', 24,
        'maxBookingsPerWeek', 2, 'hardMonthlyCapacity', 5
      )
    ),
    'hatmam', jsonb_build_object(
      'hm01Name', 'Ấn phẩm Bản Sắc', 'hm01LaunchPriceVnd', 2000000,
      'hm01ReferencePriceVnd', 3000000, 'hm02Name', 'Trò Chuyện Cùng Kenji',
      'hm02LaunchPriceVnd', 3500000, 'hm02ReferencePriceVnd', 5500000,
      'capacityMonth', 10, 'deliveryBusinessDays', 5, 'revisionWindowDays', 7,
      'rawIntakeRetentionMonths', 12, 'publicationRetentionMonths', 24,
      'publicActivationEnabled', false
    ),
    'integrations', jsonb_build_object(
      'privateStorageReady', false, 'deletionWorkflowReady', false,
      'resendReadiness', 'off', 'calcomReadiness', 'off'
    )
  );
  perform app_private.assert_operational_settings_values(v_values);
  perform pg_advisory_xact_lock(hashtext('operational_settings_versions'));
  select coalesce(max(version), 0) + 1 into v_next_version from operational_settings_versions;
  update operational_settings_versions set active = false where active = true;
  insert into operational_settings_versions(version, values, active, created_by, activated_at)
    values (v_next_version, v_values, true, 'system:migration-0026-wp3-settings-compat', now());
  insert into audit_log(actor, action, entity_type)
    values ('system:migration-0026', 'settings.version_bootstrapped_for_wp3', 'operational_settings_version');
end;
$$;
