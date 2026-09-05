-- P07 Runtime Quality Hooks v0.1
-- PROPOSAL ONLY in WO 1dhEFzHuplSL0aYQZkHR_C0hf4ZFvdbLFtauaLPCktUk.
-- Do not apply to remote D1 without a separate live activation gate.

CREATE TABLE IF NOT EXISTS care_meta_quality_turns (
  event_key TEXT PRIMARY KEY,
  channel TEXT NOT NULL CHECK(channel IN ('facebook_messenger','facebook_comment','instagram','website','synthetic')),
  surface TEXT NOT NULL CHECK(surface IN ('public','private','synthetic')),
  customer_mode INTEGER NOT NULL CHECK(customer_mode IN (0,1)),
  observed_runtime_release_id TEXT NOT NULL,
  brain_release_id TEXT,
  truth_version TEXT,
  capability_version TEXT,
  guard_version TEXT,
  memory_contract_version TEXT,
  sales_skill_version TEXT,
  retrieval_source_ids_json TEXT NOT NULL DEFAULT '[]',
  guard_hit_codes_json TEXT NOT NULL DEFAULT '[]',
  context_degraded INTEGER NOT NULL DEFAULT 0 CHECK(context_degraded IN (0,1)),
  provider_result_class TEXT NOT NULL CHECK(provider_result_class IN ('SUCCESS','FAILURE','FALLBACK','NOT_CALLED','UNKNOWN')),
  provider_latency_ms INTEGER,
  provider_attempt_count INTEGER NOT NULL DEFAULT 0,
  action_state TEXT NOT NULL CHECK(action_state IN ('NONE','PROPOSED','ATTEMPTED','PROVIDER_ACCEPTED','VERIFIED_SUCCESS','FAILED_UNCONFIRMED','UNKNOWN')),
  runtime_outcome TEXT,
  suppression_active INTEGER NOT NULL DEFAULT 0 CHECK(suppression_active IN (0,1)),
  service_open INTEGER NOT NULL DEFAULT 0 CHECK(service_open IN (0,1)),
  recovery_open INTEGER NOT NULL DEFAULT 0 CHECK(recovery_open IN (0,1)),
  journey_ref TEXT,
  open_loop_ref TEXT,
  review_case_ref TEXT,
  created_at_ms INTEGER NOT NULL,
  updated_at_ms INTEGER NOT NULL,
  expires_at_ms INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_care_meta_quality_turns_updated
  ON care_meta_quality_turns(updated_at_ms);
CREATE INDEX IF NOT EXISTS idx_care_meta_quality_turns_expiry
  ON care_meta_quality_turns(expires_at_ms);
CREATE INDEX IF NOT EXISTS idx_care_meta_quality_turns_review
  ON care_meta_quality_turns(review_case_ref, updated_at_ms);

CREATE TABLE IF NOT EXISTS care_meta_quality_flags (
  flag_id TEXT PRIMARY KEY,
  event_key TEXT NOT NULL,
  check_code TEXT NOT NULL,
  hard_fail_families_json TEXT NOT NULL DEFAULT '[]',
  eligibility TEXT NOT NULL CHECK(eligibility IN ('DET','SEM','HUM')),
  result TEXT NOT NULL CHECK(result IN ('PASS','FAIL','UNKNOWN','INSUFFICIENT_EVIDENCE','NOT_EVALUATED')),
  root_cause_hint TEXT,
  reason_code TEXT NOT NULL,
  created_at_ms INTEGER NOT NULL,
  expires_at_ms INTEGER NOT NULL,
  FOREIGN KEY(event_key) REFERENCES care_meta_quality_turns(event_key)
);

CREATE INDEX IF NOT EXISTS idx_care_meta_quality_flags_event
  ON care_meta_quality_flags(event_key, created_at_ms);
CREATE INDEX IF NOT EXISTS idx_care_meta_quality_flags_result
  ON care_meta_quality_flags(result, created_at_ms);
CREATE INDEX IF NOT EXISTS idx_care_meta_quality_flags_expiry
  ON care_meta_quality_flags(expires_at_ms);
