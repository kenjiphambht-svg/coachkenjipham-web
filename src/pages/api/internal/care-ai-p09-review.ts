import type { NextApiRequest, NextApiResponse } from 'next';
import { runCareModel } from '../../../lib/care-ai/provider-neutral-model';
import {
  p09ReviewResponse,
  p09ReviewRunnerEnabled,
  parseP09ReviewRunnerInput,
  resolveP09ReviewModelConfig,
} from '../../../lib/care-ai/p09-review-runner';
import {
  careTestAccessAuthorized,
  cloudflareSyntheticReviewEnabled,
  resolveCareTestRequestHost,
} from '../../../lib/care-ai/test-console-gate';

function requestHost(req: NextApiRequest): string | undefined {
  const host = typeof req.headers.host === 'string' ? req.headers.host : undefined;
  const forwardedHost = req.headers['x-forwarded-host'];
  const forwarded = typeof forwardedHost === 'string' ? forwardedHost : undefined;
  return resolveCareTestRequestHost(host, forwarded);
}

function readinessRequested(req: NextApiRequest): boolean {
  const value = req.query.runtimeSelfTest;
  return (Array.isArray(value) ? value[0] : value) === 'p09-review-runner';
}

function safeError(error: unknown): string {
  if (!(error instanceof Error)) return 'CARE_P09_REVIEW_UNKNOWN_ERROR';
  if (error.message.startsWith('CARE_P09_') || error.message.startsWith('CARE_MODEL_')) {
    return error.message.slice(0, 180);
  }
  return 'CARE_P09_REVIEW_PROVIDER_ERROR';
}

function readiness() {
  const configuredToken = process.env.CARE_AI_TEST_ACCESS_TOKEN || '';
  let modelConfigReady = false;
  let modelSecretAvailable = false;
  try {
    const config = resolveP09ReviewModelConfig();
    modelConfigReady = Boolean(config.provider && config.model);
    modelSecretAvailable = Boolean(config.apiKey);
  } catch (error) {
    if (!(error instanceof Error) || error.message !== 'CARE_P09_REVIEW_MODEL_SECRET_MISSING') {
      return {
        passed: false,
        mode: 'CLOUDFLARE_P09_SYNTHETIC_REVIEW_RUNNER_SELF_TEST',
        runnerEnabled: p09ReviewRunnerEnabled(),
        accessTokenConfigured: Boolean(configuredToken),
        accessTokenAuthorizerReady: careTestAccessAuthorized(configuredToken),
        modelConfigReady: false,
        modelSecretAvailable: false,
        providerInvoked: false,
        secretExposed: false,
        error: safeError(error),
      } as const;
    }
  }

  const runnerEnabled = p09ReviewRunnerEnabled();
  const accessTokenConfigured = Boolean(configuredToken);
  const accessTokenAuthorizerReady = careTestAccessAuthorized(configuredToken);
  return {
    passed: runnerEnabled && accessTokenConfigured && accessTokenAuthorizerReady && modelConfigReady && modelSecretAvailable,
    mode: 'CLOUDFLARE_P09_SYNTHETIC_REVIEW_RUNNER_SELF_TEST',
    runnerEnabled,
    accessTokenConfigured,
    accessTokenAuthorizerReady,
    modelConfigReady,
    modelSecretAvailable,
    providerInvoked: false,
    secretExposed: false,
    productionActionExecuted: false,
    productionWriteExecuted: false,
    metaOutboundExecuted: false,
    paymentBookingDeleteQuoteExecuted: false,
  } as const;
}

function queryBody(req: NextApiRequest): Record<string, unknown> {
  return {
    reviewId: req.query.reviewId,
    channel: req.query.channel,
    message: req.query.message,
  };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Robots-Tag', 'noindex, nofollow, noarchive');

  if (!cloudflareSyntheticReviewEnabled({ host: requestHost(req) })) {
    return res.status(404).json({ error: 'CARE_P09_REVIEW_DISABLED' });
  }
  if (!p09ReviewRunnerEnabled()) {
    return res.status(404).json({ error: 'CARE_P09_REVIEW_DISABLED' });
  }

  if (req.method === 'GET' && readinessRequested(req)) {
    const result = readiness();
    return res.status(result.passed ? 200 : 503).json(result);
  }

  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ error: 'METHOD_NOT_ALLOWED' });
  }

  const configuredToken = process.env.CARE_AI_TEST_ACCESS_TOKEN || '';
  if (!configuredToken || !careTestAccessAuthorized(configuredToken)) {
    return res.status(503).json({ error: 'CARE_P09_REVIEW_ACCESS_RUNTIME_NOT_READY' });
  }

  try {
    const raw = req.method === 'GET' ? queryBody(req) : ((req.body || {}) as Record<string, unknown>);
    const input = parseP09ReviewRunnerInput(raw);
    const config = resolveP09ReviewModelConfig();
    const decision = await runCareModel({
      config,
      channel: input.channel,
      turns: input.turns,
    });

    return res.status(200).json(p09ReviewResponse(input, decision));
  } catch (error) {
    const code = safeError(error);
    if (code === 'CARE_P09_REVIEW_MODEL_SECRET_MISSING') return res.status(503).json({ error: code });
    if (code.startsWith('CARE_P09_REVIEW_') && !code.includes('PROVIDER_ERROR')) return res.status(400).json({ error: code });
    return res.status(502).json({ error: code });
  }
}
