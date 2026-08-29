import type { NextApiRequest, NextApiResponse } from 'next';
import type { CareChannel } from '../../../lib/care-ai/contracts';
import { MODEL_QUALITY_CASES } from '../../../lib/care-ai/model-quality-corpus';
import { ALL_CARE_SYNTHETIC_FIXTURES } from '../../../lib/care-ai/synthetic-fixtures';
import { WebsiteSyntheticCareRuntime } from '../../../lib/care-ai/synthetic-runtime';
import { evaluateModelQuality } from '../../../lib/care-ai/model-quality-evaluator';
import {
  CARE_MODEL_PROVIDERS,
  runCareModel,
  type CareAuthorityGuard,
  type CareModelConfig,
  type CareModelDecision,
  type CareModelProvider,
} from '../../../lib/care-ai/provider-neutral-model';
import { syntheticChannelInbound } from '../../../lib/care-ai/meta-channel';
import {
  careTestAccessAuthorized,
  careTestReviewExpiresAt,
  cloudflareSyntheticReviewEnabled,
  resolveCareTestRequestHost,
} from '../../../lib/care-ai/test-console-gate';

const P09_REVIEW_SLOT_LIMITS: Record<CareChannel, number> = {
  website: 6,
  facebook_messenger: 12,
  instagram: 5,
};

const P09_REVIEW_SLOT_PREFIX: Record<CareChannel, string> = {
  website: 'website',
  facebook_messenger: 'messenger',
  instagram: 'instagram',
};

interface P09ReviewRunnerEnv {
  CARE_P09_REVIEW_RUNNER_ENABLED?: string;
  CARE_P09_REVIEW_MODEL_PROVIDER?: string;
  CARE_P09_REVIEW_MODEL_NAME?: string;
  CARE_P09_REVIEW_MODEL_BASE_URL?: string;
  CARE_P09_REVIEW_MODEL_API_KEY?: string;
  CARE_MODEL_API_KEY?: string;
  CARE_MODEL_ALLOWED_COMPATIBLE_HOSTS?: string;
  OPENROUTER_API_KEY?: string;
  OPENAI_API_KEY?: string;
  ANTHROPIC_API_KEY?: string;
  GEMINI_API_KEY?: string;
  GOOGLE_API_KEY?: string;
}

export interface P09ReviewRunnerInput {
  reviewId: string;
  channel: CareChannel;
  turns: string[];
}

function requestHost(req: NextApiRequest): string | undefined {
  const host = typeof req.headers.host === 'string' ? req.headers.host : undefined;
  const forwardedHost = req.headers['x-forwarded-host'];
  const forwarded = typeof forwardedHost === 'string' ? forwardedHost : undefined;
  return resolveCareTestRequestHost(host, forwarded);
}

function runtimeSelfTestMode(req: NextApiRequest): string {
  const value = req.query.runtimeSelfTest;
  return String(Array.isArray(value) ? value[0] || '' : value || '');
}

function p09ReviewRequested(req: NextApiRequest): boolean {
  const value = req.query.p09Review;
  return String(Array.isArray(value) ? value[0] || '' : value || '') === '1';
}

function allowedCompatibleHosts(): string[] {
  return (process.env.CARE_MODEL_ALLOWED_COMPATIBLE_HOSTS || '')
    .split(',')
    .map((host) => host.trim().toLowerCase())
    .filter(Boolean);
}

function authorityGuardForFixture(fixtureId?: string): CareAuthorityGuard | undefined {
  if (!fixtureId) return undefined;
  const fixture = ALL_CARE_SYNTHETIC_FIXTURES.find((item) => item.id === fixtureId);
  if (!fixture) return undefined;
  const trace = new WebsiteSyntheticCareRuntime().run(fixture).trace;
  return {
    family: trace.family.value,
    truthStatus: trace.truthStatus,
    nextBestCare: trace.nextBestCare,
    commercialReadiness: trace.commercialReadiness,
    memoryDecision: trace.memoryDecision,
    handoffRequired: trace.handoffRequired,
  };
}

function safeError(error: unknown): string {
  if (!(error instanceof Error)) return 'CARE_TEST_UNKNOWN_ERROR';
  if (
    error.message.startsWith('CARE_MODEL_') ||
    error.message.startsWith('CARE_TEST_') ||
    error.message.startsWith('CARE_P09_REVIEW_')
  ) {
    return error.message.slice(0, 180);
  }
  return 'CARE_TEST_PROVIDER_ERROR';
}

function runCloudflareCredentialPathSelfTest(req: NextApiRequest) {
  const reviewHost = requestHost(req) || '';
  const configuredToken = process.env.CARE_AI_TEST_ACCESS_TOKEN || '';
  const invalidProbe = 'p07-runtime-invalid-credential-probe';

  const noTokenStatus = careTestAccessAuthorized(undefined) ? 200 : 401;
  const invalidTokenStatus = careTestAccessAuthorized(invalidProbe) ? 200 : 401;
  const configuredRuntimeTokenStatus = careTestAccessAuthorized(configuredToken) ? 200 : 401;
  const spoofedForwardedHostStatus = cloudflareSyntheticReviewEnabled({ host: 'not-authorized.invalid' }) ? 200 : 404;

  const passed =
    Boolean(reviewHost) &&
    noTokenStatus === 401 &&
    invalidTokenStatus === 401 &&
    configuredRuntimeTokenStatus === 200 &&
    spoofedForwardedHostStatus === 404;

  return {
    passed,
    mode: 'CLOUDFLARE_RUNTIME_CREDENTIAL_PATH_SELF_TEST',
    method: 'IN_PROCESS_CURRENT_RUNTIME_SECRET_NO_EXPORT',
    checks: { noTokenStatus, invalidTokenStatus, configuredRuntimeTokenStatus, spoofedForwardedHostStatus },
    retiredCredentialFallbackPresent: false,
    secretExposed: false,
    providerInvoked: false,
    productionActionExecuted: false,
    productionWriteExecuted: false,
    metaOutboundExecuted: false,
    paymentBookingDeleteQuoteExecuted: false,
  } as const;
}

function runnerEnv(env?: P09ReviewRunnerEnv): P09ReviewRunnerEnv {
  return env ?? (process.env as P09ReviewRunnerEnv);
}

export function p09ReviewRunnerEnabled(env?: P09ReviewRunnerEnv): boolean {
  return runnerEnv(env).CARE_P09_REVIEW_RUNNER_ENABLED === 'true';
}

function p09ModelSecret(provider: CareModelProvider, env: P09ReviewRunnerEnv): string {
  const common = env.CARE_P09_REVIEW_MODEL_API_KEY || env.CARE_MODEL_API_KEY || '';
  if (common) return common;
  if (provider === 'openai_compatible_chat') return env.OPENROUTER_API_KEY || '';
  if (provider === 'openai_responses') return env.OPENAI_API_KEY || '';
  if (provider === 'anthropic_messages') return env.ANTHROPIC_API_KEY || '';
  if (provider === 'google_gemini') return env.GEMINI_API_KEY || env.GOOGLE_API_KEY || '';
  return '';
}

export function resolveP09ReviewModelConfig(env?: P09ReviewRunnerEnv): CareModelConfig {
  const current = runnerEnv(env);
  const provider = (current.CARE_P09_REVIEW_MODEL_PROVIDER || 'openai_compatible_chat') as CareModelProvider;
  if (!CARE_MODEL_PROVIDERS.some((item) => item.id === provider)) {
    throw new Error('CARE_P09_REVIEW_PROVIDER_UNSUPPORTED');
  }

  const model = (current.CARE_P09_REVIEW_MODEL_NAME || 'openai/gpt-4.1-mini').trim();
  if (!model || model.length > 160) throw new Error('CARE_P09_REVIEW_MODEL_INVALID');

  const apiKey = p09ModelSecret(provider, current);
  if (!apiKey) throw new Error('CARE_P09_REVIEW_MODEL_SECRET_MISSING');

  const baseUrl =
    provider === 'openai_compatible_chat'
      ? (current.CARE_P09_REVIEW_MODEL_BASE_URL || 'https://openrouter.ai/api/v1/chat/completions').trim()
      : undefined;
  const allowedHosts = (current.CARE_MODEL_ALLOWED_COMPATIBLE_HOSTS || 'openrouter.ai')
    .split(',')
    .map((host) => host.trim().toLowerCase())
    .filter(Boolean);

  return { provider, model, apiKey, baseUrl, allowedCompatibleHosts: allowedHosts };
}

function singleString(value: unknown): string {
  if (Array.isArray(value)) return typeof value[0] === 'string' ? value[0] : '';
  return typeof value === 'string' ? value : '';
}

export function parseP09ReviewRunnerInput(raw: Record<string, unknown>): P09ReviewRunnerInput {
  for (const forbidden of ['apiKey', 'provider', 'model', 'baseUrl', 'fixtureId']) {
    if (raw[forbidden] !== undefined) throw new Error('CARE_P09_REVIEW_CLIENT_CONFIG_FORBIDDEN');
  }

  const reviewId = singleString(raw.reviewId).trim().toLowerCase();
  const channel = singleString(raw.channel).trim() as CareChannel;
  if (!Object.prototype.hasOwnProperty.call(P09_REVIEW_SLOT_LIMITS, channel)) {
    throw new Error('CARE_P09_REVIEW_CHANNEL_UNSUPPORTED');
  }

  const match = reviewId.match(/^([a-z]+)-(\d{1,2})$/);
  const slot = match ? Number(match[2]) : Number.NaN;
  if (
    !match ||
    match[1] !== P09_REVIEW_SLOT_PREFIX[channel] ||
    !Number.isInteger(slot) ||
    slot < 1 ||
    slot > P09_REVIEW_SLOT_LIMITS[channel]
  ) {
    throw new Error('CARE_P09_REVIEW_SLOT_INVALID');
  }

  let turns: string[] = [];
  if (Array.isArray(raw.turns)) {
    turns = raw.turns.filter((turn): turn is string => typeof turn === 'string').map((turn) => turn.trim()).filter(Boolean);
  } else {
    const message = singleString(raw.message).trim();
    if (message) turns = [message];
  }

  if (!turns.length || turns.length > 4) throw new Error('CARE_P09_REVIEW_TURNS_INVALID');
  if (turns.some((turn) => turn.length > 900) || turns.join('\n').length > 2400) {
    throw new Error('CARE_P09_REVIEW_INPUT_TOO_LARGE');
  }
  return { reviewId, channel, turns };
}

function redactP09Reply(reply: string): string {
  return reply
    .replace(/\bsk-[A-Za-z0-9_-]{12,}\b/g, '[REDACTED_CREDENTIAL]')
    .replace(/\bBearer\s+[A-Za-z0-9._~+\/-]{12,}/gi, 'Bearer [REDACTED_CREDENTIAL]')
    .slice(0, 1600);
}

export function p09ReviewResponse(input: P09ReviewRunnerInput, decision: CareModelDecision) {
  return {
    reviewId: input.reviewId,
    channel: input.channel,
    modelReply: redactP09Reply(decision.reply),
    semanticDecision: {
      family: decision.family,
      truthStatus: decision.truthStatus,
      nextBestCare: decision.nextBestCare,
      commercialReadiness: decision.commercialReadiness,
      memoryDecision: decision.memoryDecision,
      handoffRequired: decision.handoffRequired,
    },
    evaluation: {
      mode: 'P09_FREEFORM_BOUNDARY_REVIEW',
      autoVerdict: 'P09_REVIEW_REQUIRED',
      note: 'Freeform output is review evidence only; P09 owns qualitative Voice/behavior acceptance.',
    },
    inputEchoed: false,
    secretExposed: false,
    secretPersisted: false,
    providerConfigExposed: false,
    productionActionExecuted: false,
    productionWriteExecuted: false,
    metaOutboundExecuted: false,
    paymentBookingDeleteQuoteExecuted: false,
  } as const;
}

function p09RunnerSelfTest() {
  const configuredToken = process.env.CARE_AI_TEST_ACCESS_TOKEN || '';
  let modelSecretAvailable = false;
  let modelConfigReady = false;
  try {
    const config = resolveP09ReviewModelConfig();
    modelSecretAvailable = Boolean(config.apiKey);
    modelConfigReady = Boolean(config.provider && config.model);
  } catch (error) {
    if (!(error instanceof Error) || error.message !== 'CARE_P09_REVIEW_MODEL_SECRET_MISSING') {
      return {
        passed: false,
        mode: 'CLOUDFLARE_P09_SYNTHETIC_REVIEW_RUNNER_SELF_TEST',
        error: safeError(error),
        runnerEnabled: p09ReviewRunnerEnabled(),
        accessTokenAuthorizerReady: careTestAccessAuthorized(configuredToken),
        modelConfigReady: false,
        modelSecretAvailable: false,
        providerInvoked: false,
        secretExposed: false,
      } as const;
    }
  }

  const runnerEnabled = p09ReviewRunnerEnabled();
  const accessTokenAuthorizerReady = Boolean(configuredToken) && careTestAccessAuthorized(configuredToken);
  return {
    passed: runnerEnabled && accessTokenAuthorizerReady && modelConfigReady && modelSecretAvailable,
    mode: 'CLOUDFLARE_P09_SYNTHETIC_REVIEW_RUNNER_SELF_TEST',
    runnerEnabled,
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

function p09RunnerRawInput(req: NextApiRequest): Record<string, unknown> {
  if (req.method === 'POST') return (req.body || {}) as Record<string, unknown>;
  return { reviewId: req.query.reviewId, channel: req.query.channel, message: req.query.message };
}

async function runP09Review(req: NextApiRequest, res: NextApiResponse) {
  if (!p09ReviewRunnerEnabled()) return res.status(404).json({ error: 'CARE_P09_REVIEW_DISABLED' });
  if (req.method !== 'GET' && req.method !== 'POST') return res.status(405).json({ error: 'METHOD_NOT_ALLOWED' });

  const configuredToken = process.env.CARE_AI_TEST_ACCESS_TOKEN || '';
  if (!configuredToken || !careTestAccessAuthorized(configuredToken)) {
    return res.status(503).json({ error: 'CARE_P09_REVIEW_ACCESS_RUNTIME_NOT_READY' });
  }

  try {
    const input = parseP09ReviewRunnerInput(p09RunnerRawInput(req));
    const config = resolveP09ReviewModelConfig();
    const decision = await runCareModel({ config, channel: input.channel, turns: input.turns });
    return res.status(200).json(p09ReviewResponse(input, decision));
  } catch (error) {
    const code = safeError(error);
    if (code === 'CARE_P09_REVIEW_MODEL_SECRET_MISSING') return res.status(503).json({ error: code });
    if (code.startsWith('CARE_P09_REVIEW_')) return res.status(400).json({ error: code });
    return res.status(502).json({ error: code });
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Robots-Tag', 'noindex, nofollow, noarchive');

  if (!cloudflareSyntheticReviewEnabled({ host: requestHost(req) })) {
    return res.status(404).json({ error: 'CARE_TEST_DISABLED' });
  }

  const selfTestMode = runtimeSelfTestMode(req);
  if (req.method === 'GET' && selfTestMode === 'credential-path') {
    const selfTest = runCloudflareCredentialPathSelfTest(req);
    return res.status(selfTest.passed ? 200 : 503).json(selfTest);
  }
  if (req.method === 'GET' && selfTestMode === 'p09-review-runner') {
    const selfTest = p09RunnerSelfTest();
    return res.status(selfTest.passed ? 200 : 503).json(selfTest);
  }
  if (p09ReviewRequested(req)) return runP09Review(req, res);

  const provided = req.headers['x-care-test-token'];
  const token = typeof provided === 'string' ? provided : undefined;
  if (!careTestAccessAuthorized(token)) {
    return res.status(401).json({ error: 'CARE_TEST_UNAUTHORIZED' });
  }

  if (req.method === 'GET') {
    return res.status(200).json({
      enabled: true,
      mode: 'CLOUDFLARE_P09_SYNTHETIC_REVIEW',
      providers: CARE_MODEL_PROVIDERS.map(({ id, label, defaultBaseUrl }) => ({ id, label, defaultBaseUrl })),
      channels: ['website', 'facebook_messenger', 'instagram'],
      fixtureCount: MODEL_QUALITY_CASES.length,
      credentialMode: process.env.CARE_MODEL_API_KEY ? 'SERVER_SECRET_AVAILABLE' : 'EPHEMERAL_KEY_REQUIRED',
      accessTokenRequired: true,
      p09ServerSideRunnerEnabled: p09ReviewRunnerEnabled(),
      compatibleHostAllowlistConfigured: allowedCompatibleHosts().length > 0,
      reviewExpiresAt: careTestReviewExpiresAt(),
      realMetaTrafficEnabled: false,
      customerDataAllowed: false,
      productionWriteEnabled: false,
      paymentBookingDeleteQuoteAuthority: false,
    });
  }

  if (req.method !== 'POST') return res.status(405).json({ error: 'METHOD_NOT_ALLOWED' });

  const body = req.body || {};
  const provider = body.provider as CareModelProvider;
  const channel = body.channel as CareChannel;
  const model = typeof body.model === 'string' ? body.model.trim() : '';
  const baseUrl = typeof body.baseUrl === 'string' && body.baseUrl.trim() ? body.baseUrl.trim() : undefined;
  const apiKey =
    typeof body.apiKey === 'string' && body.apiKey.trim()
      ? body.apiKey.trim()
      : process.env.CARE_MODEL_API_KEY || '';
  const fixtureId = typeof body.fixtureId === 'string' && body.fixtureId.trim() ? body.fixtureId.trim() : undefined;
  const canonicalCase = fixtureId ? MODEL_QUALITY_CASES.find((item) => item.id === fixtureId) : undefined;
  if (fixtureId && !canonicalCase) return res.status(400).json({ error: 'CARE_TEST_FIXTURE_NOT_FOUND' });

  const turns = canonicalCase
    ? canonicalCase.turns
    : Array.isArray(body.turns)
      ? body.turns.filter((turn: unknown): turn is string => typeof turn === 'string' && Boolean(turn.trim())).slice(-12)
      : typeof body.message === 'string' && body.message.trim()
        ? [body.message.trim()]
        : [];

  if (!CARE_MODEL_PROVIDERS.some((item) => item.id === provider)) {
    return res.status(400).json({ error: 'CARE_MODEL_PROVIDER_UNSUPPORTED' });
  }
  if (!['website', 'facebook_messenger', 'instagram'].includes(channel)) {
    return res.status(400).json({ error: 'CARE_CHANNEL_UNSUPPORTED' });
  }
  if (!model) return res.status(400).json({ error: 'CARE_MODEL_NAME_REQUIRED' });
  if (!turns.length) return res.status(400).json({ error: 'CARE_TEST_MESSAGE_REQUIRED' });
  if (!apiKey) return res.status(400).json({ error: 'CARE_MODEL_CREDENTIAL_MISSING' });

  try {
    const inbound = syntheticChannelInbound(channel, turns[turns.length - 1]);
    const fixture = fixtureId ? ALL_CARE_SYNTHETIC_FIXTURES.find((item) => item.id === fixtureId) : undefined;
    if (fixtureId && !fixture) throw new Error('CARE_TEST_EXPECTED_FIXTURE_NOT_FOUND');
    const authorityGuard = authorityGuardForFixture(fixtureId);
    const decision = await runCareModel({
      config: { provider, model, apiKey, baseUrl, allowedCompatibleHosts: allowedCompatibleHosts() },
      channel,
      turns,
      authorityGuard,
    });
    const evaluation = fixture ? evaluateModelQuality(fixture, decision) : undefined;

    return res.status(200).json({
      fixtureId: fixtureId || null,
      turns,
      inbound: { channel: inbound.channel, sender: inbound.externalSenderId, rawKind: inbound.rawKind },
      config: { provider, model, baseUrl: baseUrl || null },
      guardMode: authorityGuard ? 'DETERMINISTIC_FIXTURE_GUARD' : 'MODEL_ONLY_FREEFORM_SYNTHETIC',
      decision,
      evaluation: evaluation
        ? {
            hardFails: evaluation.hardFails,
            comparisonNotes: evaluation.comparisonNotes,
            expected: evaluation.expected,
            autoVerdict: evaluation.hardFails.length ? 'FAIL_HARD_BOUNDARY' : 'NO_AUTO_HARD_FAIL',
            note: 'Canonical fixture decisions are deterministic-guarded. Semantic differences and actual Voice/E06 still require P09 review.',
          }
        : null,
      secretPersisted: false,
      productionActionExecuted: false,
      productionWriteExecuted: false,
      metaOutboundExecuted: false,
      paymentBookingDeleteQuoteExecuted: false,
    });
  } catch (error) {
    return res.status(502).json({ error: safeError(error) });
  }
}
