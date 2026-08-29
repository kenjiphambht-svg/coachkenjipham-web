import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

describe('Care AI Founder Test Console source contract', () => {
  it('uses Cloudflare-only review gating with a late-bound runtime secret and no Vercel bypass', () => {
    const api = readFileSync('src/pages/api/internal/care-ai-test.ts', 'utf8');
    const page = readFileSync('src/pages/care-ai-test.tsx', 'utf8');
    const gate = readFileSync('src/lib/care-ai/test-console-gate.ts', 'utf8');
    const wrangler = readFileSync('wrangler.jsonc', 'utf8');

    expect(api).toContain('cloudflareSyntheticReviewEnabled');
    expect(page).toContain('cloudflareSyntheticReviewEnabled');
    expect(gate).toContain("CARE_AI_TEST_RUNTIME_SURFACE === 'cloudflare-preview'");
    expect(gate).toContain('CARE_AI_TEST_REVIEW_HOST');
    expect(gate).toContain('CARE_AI_TEST_REVIEW_EXPIRES_AT');
    expect(gate).toContain('CARE_AI_TEST_ACCESS_TOKEN');
    expect(gate).toContain('timingSafeEqual');
    expect(gate).toContain('resolveCareTestRequestHost');
    expect(wrangler).toContain('"required": ["CARE_AI_TEST_ACCESS_TOKEN"]');
    expect(wrangler).toContain('"CARE_AI_TEST_RUNTIME_SURFACE": "cloudflare-preview"');
    expect(wrangler).toContain('"CARE_AI_TEST_UI_ENABLED": "true"');
    expect(wrangler).toContain('"WORKER_SELF_REFERENCE"');

    for (const source of [api, page, gate, wrangler]) {
      expect(source).not.toContain('VERCEL_ENV');
      expect(source).not.toContain('VERCEL_GIT_PULL_REQUEST_ID');
      expect(source).not.toContain('VERCEL_GIT_COMMIT_REF');
      expect(source).not.toContain('TOKEN_SHA256');
      expect(source).not.toContain("createHash('sha256')");
    }
  });

  it('self-tests the real Cloudflare credential path without exporting the runtime secret or invoking providers', () => {
    const api = readFileSync('src/pages/api/internal/care-ai-test.ts', 'utf8');
    expect(api).toContain('getCloudflareContext');
    expect(api).toContain('WORKER_SELF_REFERENCE');
    expect(api).toContain('CLOUDFLARE_RUNTIME_CREDENTIAL_PATH_SELF_TEST');
    expect(api).toContain('configuredRuntimeTokenStatus');
    expect(api).toContain('spoofedForwardedHostStatus');
    expect(api).toContain('retiredCredentialFallbackPresent: false');
    expect(api).toContain('secretExposed: false');
    expect(api).toContain('providerInvoked: false');
  });

  it('does not persist, log, or echo model/test secrets and clears the browser API-key field after each run', () => {
    const api = readFileSync('src/pages/api/internal/care-ai-test.ts', 'utf8');
    const page = readFileSync('src/pages/care-ai-test.tsx', 'utf8');
    expect(api).toContain('secretPersisted: false');
    expect(api).toContain('productionActionExecuted: false');
    expect(api).toContain('productionWriteExecuted: false');
    expect(api).toContain('metaOutboundExecuted: false');
    expect(api).toContain('paymentBookingDeleteQuoteExecuted: false');
    expect(api).not.toContain('console.log');
    expect(page).toContain('type="password"');
    expect(page).toContain("setApiKey('')");
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
