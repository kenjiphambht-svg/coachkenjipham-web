-- P07 Care AI Messenger customer-mode rate/cost guard.
-- Apply only to the isolated D1 database `care-meta-idempotency`.
-- Stores only hashed scope keys and numeric counters; no PSID, message text, token, or reply text.
CREATE TABLE IF NOT EXISTS care_meta_customer_rate_limits (
  scope_key TEXT PRIMARY KEY,
  window_started_ms INTEGER NOT NULL,
  count INTEGER NOT NULL CHECK (count >= 0),
  expires_at_ms INTEGER NOT NULL
);
