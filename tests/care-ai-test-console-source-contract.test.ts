import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

describe('Care AI Founder Test Console source contract', () => {
  it('opens only the exact PR #179 synthetic review window or an explicit environment gate, while retaining token auth', () => {
    const api = readFileSync('src/pages/api/internal/care-ai-test.ts', 'utf8');
    const page = readFileSync('src/pages/care-ai-test.tsx', 'utf8');
    expect(api).toContain("P09_SYNTHETIC_REVIEW_PR = '179'");
    expect(api).toContain("P09_SYNTHETIC_REVIEW_BRANCH = 'backend/p07-care-ai-test-console-meta-sandbox-01'");
    expect(api).toContain("process.env.VERCEL_ENV === 'preview'");
    expect(api).toContain('VERCEL_GIT_PULL_REQUEST_ID');
    expect(api).toContain('VERCEL_GIT_COMMIT_REF');
    expect(api).toContain("createHash('sha256')");
    expect(api).toContain("CARE_AI_TEST_UI_ENABLED === 'true'");
    expect(api).toContain('CARE_AI_TEST_ACCESS_TOKEN');
    expect(api).toContain("'x-care-test-token'");
    expect(api).toContain("2026-09-05T23:59:59+07:00");
    expect(page).toContain("P09_SYNTHETIC_REVIEW_PR = '179'");
    expect(page).toContain("process.env.VERCEL_ENV === 'preview'");
    expect(page).toContain('VERCEL_GIT_PULL_REQUEST_ID');
    expect(page).toContain('CARE_AI_TEST_ACCESS_TOKEN');
    expect(page).toContain('P09 synthetic review gate');
  });

  it('does not persist, log, or echo model/test secrets and clears the browser API-key field after each run', () => {
    const api = readFileSync('src/pages/api/internal/care-ai-test.ts', 'utf8');
    const page = readFileSync('src/pages/care-ai-test.tsx', 'utf8');
    expect(api).toContain('secretPersisted: false');
    expect(api).toContain('productionActionExecuted: false');
    expect(api).toContain('metaOutboundExecuted: false');
    expect(api).not.toContain('console.log');
    expect(page).toContain('type="password"');
    expect(page).toContain("setApiKey('')");
    expect(api).not.toContain('uETVLlkc0grrZETd6qE3K1wnnf2v8Mb1Ru9gGwsfp_U');
    expect(page).not.toContain('uETVLlkc0grrZETd6qE3K1wnnf2v8Mb1Ru9gGwsfp_U');
  });

  it('exposes the canonical 40+10 selector through deterministic fixture guard plus hardened scoring', () => {
    const api = readFileSync('src/pages/api/internal/care-ai-test.ts', 'utf8');
    const evaluator = readFileSync('src/lib/care-ai/model-quality-evaluator.ts', 'utf8');
    const page = readFileSync('src/pages/care-ai-test.tsx', 'utf8');
    expect(page).toContain('40 Scenarios');
    expect(page).toContain('10 Golden Conversations');
    expect(api).toContain('MODEL_QUALITY_CASES');
    expect(api).toContain('WebsiteSyntheticCareRuntime');
    expect(api).toContain('DETERMINISTIC_FIXTURE_GUARD');
    expect(evaluator).toContain('evaluateModelQualityHardBoundaries');
    expect(api).toContain('FAIL_HARD_BOUNDARY');
  });

  it('keeps Meta receipt, live model processing and outbound send behind separate explicit gates', () => {
    const source = readFileSync('src/pages/api/internal/care-ai-meta-webhook.ts', 'utf8');
    expect(source).toContain("CARE_META_SANDBOX_ENABLED === 'true'");
    expect(source).toContain("CARE_META_LIVE_TEST_ENABLED === 'true'");
    expect(source).toContain("CARE_META_OUTBOUND_ENABLED === 'true'");
    expect(source).toContain('CARE_META_TEST_SENDER_IDS');
    expect(source).toContain('CARE_META_TEST_SENDER_ALLOWLIST_MISSING');
    expect(source).toContain('outboundSent: false');
    expect(source).not.toContain("process.env.VERCEL_ENV === 'preview'");
    expect(source).not.toContain('graph.facebook.com');
    expect(source).not.toContain('graph.instagram.com');
  });

  it('requires a server allowlist for custom OpenAI-compatible endpoints', () => {
    const api = readFileSync('src/pages/api/internal/care-ai-test.ts', 'utf8');
    const provider = readFileSync('src/lib/care-ai/provider-neutral-model.ts', 'utf8');
    expect(api).toContain('CARE_MODEL_ALLOWED_COMPATIBLE_HOSTS');
    expect(provider).toContain('CARE_MODEL_BASE_URL_HOST_NOT_ALLOWED');
  });
});
