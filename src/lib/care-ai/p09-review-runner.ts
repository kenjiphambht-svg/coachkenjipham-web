import type { CareChannel } from './contracts';
import type { CareModelConfig, CareModelDecision, CareModelProvider } from './provider-neutral-model';

const ALLOWED_PROVIDERS = new Set<CareModelProvider>([
  'openai_responses',
  'openai_compatible_chat',
  'anthropic_messages',
  'google_gemini',
]);

const SLOT_LIMITS: Record<CareChannel, number> = {
  website: 6,
  facebook_messenger: 12,
  instagram: 5,
};

const SLOT_PREFIX: Record<CareChannel, string> = {
  website: 'website',
  facebook_messenger: 'messenger',
  instagram: 'instagram',
};

export interface P09ReviewRunnerInput {
  reviewId: string;
  channel: CareChannel;
  turns: string[];
}

export interface P09ReviewRunnerEnv {
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

function runtimeEnv(env?: P09ReviewRunnerEnv): P09ReviewRunnerEnv {
  return env ?? (process.env as P09ReviewRunnerEnv);
}

export function p09ReviewRunnerEnabled(env?: P09ReviewRunnerEnv): boolean {
  return runtimeEnv(env).CARE_P09_REVIEW_RUNNER_ENABLED === 'true';
}

function modelSecret(provider: CareModelProvider, env: P09ReviewRunnerEnv): string {
  const common = env.CARE_P09_REVIEW_MODEL_API_KEY || env.CARE_MODEL_API_KEY || '';
  if (common) return common;
  switch (provider) {
    case 'openai_compatible_chat':
      return env.OPENROUTER_API_KEY || '';
    case 'openai_responses':
      return env.OPENAI_API_KEY || '';
    case 'anthropic_messages':
      return env.ANTHROPIC_API_KEY || '';
    case 'google_gemini':
      return env.GEMINI_API_KEY || env.GOOGLE_API_KEY || '';
    default:
      return '';
  }
}

export function resolveP09ReviewModelConfig(env?: P09ReviewRunnerEnv): CareModelConfig {
  const current = runtimeEnv(env);
  const provider = (current.CARE_P09_REVIEW_MODEL_PROVIDER || 'openai_compatible_chat') as CareModelProvider;
  if (!ALLOWED_PROVIDERS.has(provider)) throw new Error('CARE_P09_REVIEW_PROVIDER_UNSUPPORTED');

  const model = (current.CARE_P09_REVIEW_MODEL_NAME || 'openai/gpt-4.1-mini').trim();
  if (!model || model.length > 160) throw new Error('CARE_P09_REVIEW_MODEL_INVALID');

  const apiKey = modelSecret(provider, current);
  if (!apiKey) throw new Error('CARE_P09_REVIEW_MODEL_SECRET_MISSING');

  const baseUrl =
    provider === 'openai_compatible_chat'
      ? (current.CARE_P09_REVIEW_MODEL_BASE_URL || 'https://openrouter.ai/api/v1/chat/completions').trim()
      : undefined;
  const allowedCompatibleHosts = (current.CARE_MODEL_ALLOWED_COMPATIBLE_HOSTS || 'openrouter.ai')
    .split(',')
    .map((host) => host.trim().toLowerCase())
    .filter(Boolean);

  return { provider, model, apiKey, baseUrl, allowedCompatibleHosts };
}

function singleString(value: unknown): string {
  return Array.isArray(value) ? String(value[0] ?? '') : typeof value === 'string' ? value : '';
}

export function parseP09ReviewRunnerInput(raw: Record<string, unknown>): P09ReviewRunnerInput {
  for (const forbidden of ['apiKey', 'provider', 'model', 'baseUrl', 'fixtureId']) {
    if (raw[forbidden] !== undefined) throw new Error('CARE_P09_REVIEW_CLIENT_CONFIG_FORBIDDEN');
  }

  const reviewId = singleString(raw.reviewId).trim().toLowerCase();
  const channel = singleString(raw.channel).trim() as CareChannel;
  if (!Object.prototype.hasOwnProperty.call(SLOT_LIMITS, channel)) {
    throw new Error('CARE_P09_REVIEW_CHANNEL_UNSUPPORTED');
  }

  const slotMatch = reviewId.match(/^([a-z]+)-(\d{1,2})$/);
  const slot = slotMatch ? Number(slotMatch[2]) : Number.NaN;
  if (
    !slotMatch ||
    slotMatch[1] !== SLOT_PREFIX[channel] ||
    !Number.isInteger(slot) ||
    slot < 1 ||
    slot > SLOT_LIMITS[channel]
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

export function redactP09ModelReply(reply: string): string {
  return reply
    .replace(/\bsk-[A-Za-z0-9_-]{12,}\b/g, '[REDACTED_CREDENTIAL]')
    .replace(/\bBearer\s+[A-Za-z0-9._~+\/-]{12,}/gi, 'Bearer [REDACTED_CREDENTIAL]')
    .slice(0, 1600);
}

export function p09ReviewResponse(input: P09ReviewRunnerInput, decision: CareModelDecision) {
  return {
    reviewId: input.reviewId,
    channel: input.channel,
    modelReply: redactP09ModelReply(decision.reply),
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
      note: 'Freeform output is not auto-promoted to canonical Care truth. P09 owns qualitative Voice/behavior acceptance.',
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
