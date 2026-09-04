-- P07 Care AI Messenger/Facebook-comment operability state.
-- APPLY ONLY to the isolated D1 database `care-meta-idempotency` under a separate Founder gate.
-- Stores only SHA-256 event keys, channel/stage flags, timestamps and bounded safe error codes.
-- It intentionally stores NO raw customer identifiers, names, message text, reply text, credentials or memory content.
CREATE TABLE IF NOT EXISTS care_meta_operability_state (
  event_key TEXT PRIMARY KEY CHECK (length(event_key) = 64),
  channel TEXT NOT NULL CHECK (channel IN ('facebook_messenger', 'facebook_comment', 'instagram')),
  customer_mode INTEGER NOT NULL CHECK (customer_mode IN (0, 1)),
  stage TEXT NOT NULL CHECK (stage IN (
    'RECEIVED',
    'MODEL_SUCCESS',
    'MODEL_FAILURE',
    'OUTBOUND_SUCCESS',
    'OUTBOUND_FAILURE',
    'POLICY_NO_AUTO_REPLY',
    'OUTBOUND_GATED'
  )),
  model_failed INTEGER NOT NULL DEFAULT 0 CHECK (model_failed IN (0, 1)),
  outbound_failed INTEGER NOT NULL DEFAULT 0 CHECK (outbound_failed IN (0, 1)),
  last_error_code TEXT CHECK (last_error_code IS NULL OR length(last_error_code) <= 120),
  created_at_ms INTEGER NOT NULL CHECK (created_at_ms > 0),
  updated_at_ms INTEGER NOT NULL CHECK (updated_at_ms > 0)
);

CREATE INDEX IF NOT EXISTS idx_care_meta_operability_updated
  ON care_meta_operability_state(updated_at_ms);

CREATE INDEX IF NOT EXISTS idx_care_meta_operability_stage_updated
  ON care_meta_operability_state(stage, updated_at_ms);
