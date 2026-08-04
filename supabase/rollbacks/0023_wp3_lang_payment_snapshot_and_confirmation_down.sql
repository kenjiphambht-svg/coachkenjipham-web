-- Manual rollback for 0023 only. Do not run automatically.
-- Preconditions: this migration contains no payment confirmation or Lặng
-- snapshot that must be preserved. If it has been used, restore the recorded
-- staging snapshot or apply a forward repair; never delete accounting evidence.

drop function if exists confirm_lang_payment_with_evidence(uuid, lang_status, text, uuid);
drop function if exists issue_lang_payment_request_wp3(uuid, lang_status, text, text, timestamptz);
drop trigger if exists lang_order_snapshots_immutable on lang_order_snapshots;
drop function if exists app_private.reject_lang_order_snapshot_update();
drop table if exists lang_order_snapshots;
