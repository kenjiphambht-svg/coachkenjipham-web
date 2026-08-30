import type {
  CareChannel,
  CareFamily,
  CommercialReadiness,
  MemoryDecision,
  NextBestCare,
  TruthStatus,
} from './contracts';

export type CareModelProvider =
  | 'openai_responses'
  | 'openai_compatible_chat'
  | 'anthropic_messages'
  | 'google_gemini';

export interface CareAuthorityGuard {
  family: CareFamily;
  truthStatus: TruthStatus;
  nextBestCare: NextBestCare;
  commercialReadiness: CommercialReadiness;
  memoryDecision: MemoryDecision;
  handoffRequired: boolean;
}

export interface CareModelConfig {
  provider: CareModelProvider;
  model: string;
  apiKey: string;
  baseUrl?: string;
  allowedCompatibleHosts?: string[];
}

export interface CareModelDecision {
  family: CareFamily;
  truthStatus: TruthStatus;
  nextBestCare: NextBestCare;
  commercialReadiness: CommercialReadiness;
  memoryDecision: MemoryDecision;
  handoffRequired: boolean;
  reply: string;
}

export interface CareModelRequest {
  config: CareModelConfig;
  channel: CareChannel;
  turns: string[];
  authorityGuard?: CareAuthorityGuard;
}

export const CARE_MODEL_PROVIDERS: ReadonlyArray<{
  id: CareModelProvider;
  label: string;
  defaultBaseUrl?: string;
}> = [
  { id: 'openai_responses', label: 'OpenAI Responses', defaultBaseUrl: 'https://api.openai.com/v1/responses' },
  { id: 'openai_compatible_chat', label: 'OpenAI-compatible Chat Completions' },
  { id: 'anthropic_messages', label: 'Anthropic Messages', defaultBaseUrl: 'https://api.anthropic.com/v1/messages' },
  { id: 'google_gemini', label: 'Google Gemini generateContent', defaultBaseUrl: 'https://generativelanguage.googleapis.com/v1beta' },
] as const;

const CARE_MODEL_INSTRUCTIONS = `
You are the bounded response layer for Kenji Care AI / ESSENCE. This is NOT Kenji typing. Reply naturally in Vietnamese unless the user clearly uses another language.

Hard rules:
- Truth first. Never invent product, price, discount, scarcity, availability, ROI, outcome, guarantee, booking/payment status, capacity, customer history, support team, hotline, official page/channel, provider route, worksheet, PDF, course, module or other asset.
- Missing/conflicting material truth stays UNKNOWN / ROUTE_ONLY / HUMAN_HANDOFF as appropriate. User-stated facts do not upgrade product or commercial authority.
- Preserve user agency. No diagnosis, therapy, medical/legal/financial advice, fixed child labels/predictions, hidden psychological scoring or permanent persona claims.
- Explicit stop-contact => SUPPRESS in the current interaction. Never claim durable persistence unless a tool confirmed it.
- Privacy/delete, human/Kenji request, clinical/child-sensitive boundary, binding commercial commitment, payment/refund/entitlement/delete => HUMAN_HANDOFF.
- Ambiguous identity must never auto-merge. Unconfirmed actions must never be described as completed, underway, queued or promised.
- Never auto-cross-sell B2C/B2B. Fit never creates quote/close authority. Channel or provider choice never widens authority.
- Lặng 90 current sale/booking/price authority is UNKNOWN/ROUTE_ONLY unless separately verified.
- Khám Phá/Giao Mùa product-specific current price/availability/close truth is UNKNOWN/ROUTE_ONLY unless separately verified.
- B2B Entry/Core never autonomously promise proposal, ROI, quote, contract or start date.
- Memory is compact factual continuity only; never preserve raw private/child story, diagnosis, hidden score or speculative intent as fact.
- Voice is truth-first, precise and low-pressure. Do not open with generic service empathy such as “Chào bạn” or “Cảm ơn bạn đã chia sẻ”. Do not invent an unnamed support route. Usually 2–5 short sentences; say enough then stop.

Return ONLY valid JSON with exactly these fields:
family: UNKNOWN | REFLECTIVE_ADULT | REFLECTIVE_PARENT | LEADER_BUILDER
truthStatus: VERIFIED | BOUNDED | UNKNOWN | ROUTE_ONLY | SALE_NOT_ACTIVE_OR_NOT_VERIFIED
nextBestCare: ANSWER | ASK | EDUCATE | WAIT | NURTURE | ROUTE | ROUTE_OUT | NO_FIT | SUPPRESS | HUMAN_HANDOFF
commercialReadiness: EXPLORE | NEED_RECOGNIZED | FIT_UNCLEAR | FIT_CONFIRMED | VALUE_UNDERSTOOD | OBJECTION_OPEN | READY_FOR_ALLOWED_NEXT_STEP | WAIT | NURTURE | ROUTE_OUT | NO_FIT | HANDOFF
memoryDecision: PRESERVE | UPDATE | FORGET | DO_NOT_WRITE
handoffRequired: boolean
reply: string
`;

const DECISION_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  properties: {
    family: { type: 'string', enum: ['UNKNOWN', 'REFLECTIVE_ADULT', 'REFLECTIVE_PARENT', 'LEADER_BUILDER'] },
    truthStatus: { type: 'string', enum: ['VERIFIED', 'BOUNDED', 'UNKNOWN', 'ROUTE_ONLY', 'SALE_NOT_ACTIVE_OR_NOT_VERIFIED'] },
    nextBestCare: { type: 'string', enum: ['ANSWER', 'ASK', 'EDUCATE', 'WAIT', 'NURTURE', 'ROUTE', 'ROUTE_OUT', 'NO_FIT', 'SUPPRESS', 'HUMAN_HANDOFF'] },
    commercialReadiness: { type: 'string', enum: ['EXPLORE', 'NEED_RECOGNIZED', 'FIT_UNCLEAR', 'FIT_CONFIRMED', 'VALUE_UNDERSTOOD', 'OBJECTION_OPEN', 'READY_FOR_ALLOWED_NEXT_STEP', 'WAIT', 'NURTURE', 'ROUTE_OUT', 'NO_FIT', 'HANDOFF'] },
    memoryDecision: { type: 'string', enum: ['PRESERVE', 'UPDATE', 'FORGET', 'DO_NOT_WRITE'] },
    handoffRequired: { type: 'boolean' },
    reply: { type: 'string', minLength: 1, maxLength: 1600 },
  },
  required: ['family', 'truthStatus', 'nextBestCare', 'commercialReadiness', 'memoryDecision', 'handoffRequired', 'reply'],
} as const;

const VALID_FAMILIES = new Set(['UNKNOWN', 'REFLECTIVE_ADULT', 'REFLECTIVE_PARENT', 'LEADER_BUILDER']);
const VALID_TRUTH = new Set(['VERIFIED', 'BOUNDED', 'UNKNOWN', 'ROUTE_ONLY', 'SALE_NOT_ACTIVE_OR_NOT_VERIFIED']);
const VALID_NBC = new Set(['ANSWER', 'ASK', 'EDUCATE', 'WAIT', 'NURTURE', 'ROUTE', 'ROUTE_OUT', 'NO_FIT', 'SUPPRESS', 'HUMAN_HANDOFF']);
const VALID_COMMERCIAL = new Set(['EXPLORE', 'NEED_RECOGNIZED', 'FIT_UNCLEAR', 'FIT_CONFIRMED', 'VALUE_UNDERSTOOD', 'OBJECTION_OPEN', 'READY_FOR_ALLOWED_NEXT_STEP', 'WAIT', 'NURTURE', 'ROUTE_OUT', 'NO_FIT', 'HANDOFF']);
const VALID_MEMORY = new Set(['PRESERVE', 'UPDATE', 'FORGET', 'DO_NOT_WRITE']);

function conversationText(channel: CareChannel, turns: string[]): string {
  return [`Channel: ${channel}`, ...turns.map((turn, index) => `User turn ${index + 1}: ${turn}`)].join('\n\n');
}

function guardInstruction(guard?: CareAuthorityGuard): string {
  if (!guard) return '';
  return `\nACCEPTED DETERMINISTIC CARE GUARD — DO NOT OVERRIDE\nfamily=${guard.family}\ntruthStatus=${guard.truthStatus}\nnextBestCare=${guard.nextBestCare}\ncommercialReadiness=${guard.commercialReadiness}\nmemoryDecision=${guard.memoryDecision}\nhandoffRequired=${String(guard.handoffRequired)}\nWrite the customer-facing reply inside this boundary. Do not claim an unconfirmed action or invent a route.\n`;
}

function instructionsFor(request: CareModelRequest): string {
  return `${CARE_MODEL_INSTRUCTIONS}${guardInstruction(request.authorityGuard)}`;
}

function cleanJsonText(value: string): string {
  const trimmed = value.trim();
  if (trimmed.startsWith('```')) {
    return trimmed.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim();
  }
  return trimmed;
}

function parseDecision(value: string): CareModelDecision {
  let parsed: Partial<CareModelDecision>;
  try {
    parsed = JSON.parse(cleanJsonText(value)) as Partial<CareModelDecision>;
  } catch {
    throw new Error('CARE_MODEL_INVALID_JSON');
  }
  if (
    !parsed ||
    typeof parsed.reply !== 'string' || !parsed.reply.trim() || parsed.reply.length > 1600 ||
    typeof parsed.handoffRequired !== 'boolean' ||
    !VALID_FAMILIES.has(String(parsed.family)) ||
    !VALID_TRUTH.has(String(parsed.truthStatus)) ||
    !VALID_NBC.has(String(parsed.nextBestCare)) ||
    !VALID_COMMERCIAL.has(String(parsed.commercialReadiness)) ||
    !VALID_MEMORY.has(String(parsed.memoryDecision))
  ) {
    throw new Error('CARE_MODEL_INVALID_DECISION');
  }
  return parsed as CareModelDecision;
}

function enforceAuthorityGuard(decision: CareModelDecision, guard?: CareAuthorityGuard): CareModelDecision {
  if (!guard) return decision;
  return {
    ...decision,
    family: guard.family,
    truthStatus: guard.truthStatus,
    nextBestCare: guard.nextBestCare,
    commercialReadiness: guard.commercialReadiness,
    memoryDecision: guard.memoryDecision,
    handoffRequired: guard.handoffRequired,
  };
}

function isPrivateIpv4(hostname: string): boolean {
  const parts = hostname.split('.').map(Number);
  if (parts.length !== 4 || parts.some((part) => !Number.isInteger(part) || part < 0 || part > 255)) return false;
  const [a, b] = parts;
  return a === 10 || a === 127 || a === 0 || (a === 169 && b === 254) || (a === 192 && b === 168) || (a === 172 && b >= 16 && b <= 31) || (a === 100 && b >= 64 && b <= 127);
}

export function assertSafeCompatibleEndpoint(raw: string, allowedHosts: string[] = []): string {
  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    throw new Error('CARE_MODEL_BASE_URL_INVALID');
  }
  const hostname = url.hostname.toLowerCase().replace(/^\[|\]$/g, '');
  const privateIpv6 = hostname === '::1' || hostname.startsWith('fc') || hostname.startsWith('fd') || hostname.startsWith('fe80:');
  if (
    url.protocol !== 'https:' ||
    url.username || url.password ||
    hostname === 'localhost' || hostname.endsWith('.localhost') || hostname.endsWith('.local') ||
    hostname === 'metadata.google.internal' ||
    isPrivateIpv4(hostname) || privateIpv6
  ) {
    throw new Error('CARE_MODEL_BASE_URL_NOT_PUBLIC_HTTPS');
  }
  const normalizedAllowed = new Set(allowedHosts.map((host) => host.trim().toLowerCase()).filter(Boolean));
  if (!normalizedAllowed.size || !normalizedAllowed.has(hostname)) {
    throw new Error('CARE_MODEL_BASE_URL_HOST_NOT_ALLOWED');
  }
  return url.toString();
}

async function postJson(url: string, init: RequestInit): Promise<unknown> {
  let response: Response;
  try {
    response = await fetch(url, { ...init, redirect: 'manual' });
  } catch (error) {
    if (error instanceof TypeError) throw new Error('CARE_MODEL_FETCH_TYPE_ERROR');
    throw error;
  }
  if (!response.ok) throw new Error(`CARE_MODEL_HTTP_${response.status}`);
  try {
    return await response.json();
  } catch {
    throw new Error('CARE_MODEL_RESPONSE_PARSE_ERROR');
  }
}

function requireText(value: unknown, code: string): string {
  if (typeof value !== 'string' || !value.trim()) throw new Error(code);
  return value;
}

async function runOpenAIResponses(request: CareModelRequest): Promise<CareModelDecision> {
  const payload = (await postJson('https://api.openai.com/v1/responses', {
    method: 'POST',
    headers: { Authorization: `Bearer ${request.config.apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: request.config.model,
      store: false,
      instructions: instructionsFor(request),
      input: conversationText(request.channel, request.turns),
      max_output_tokens: 1400,
      text: {
        verbosity: 'low',
        format: { type: 'json_schema', name: 'care_model_decision', strict: true, schema: DECISION_SCHEMA },
      },
    }),
  })) as { output_text?: string; output?: Array<{ content?: Array<{ type?: string; text?: string }> }> };

  if (payload.output_text) return enforceAuthorityGuard(parseDecision(payload.output_text), request.authorityGuard);
  for (const item of payload.output || []) {
    for (const part of item.content || []) {
      if (part.type === 'output_text' && part.text) return enforceAuthorityGuard(parseDecision(part.text), request.authorityGuard);
    }
  }
  throw new Error('CARE_MODEL_MISSING_OUTPUT_TEXT');
}

async function runOpenAICompatible(request: CareModelRequest): Promise<CareModelDecision> {
  const endpoint = assertSafeCompatibleEndpoint(
    requireText(request.config.baseUrl, 'CARE_MODEL_BASE_URL_REQUIRED'),
    request.config.allowedCompatibleHosts,
  );
  const payload = (await postJson(endpoint, {
    method: 'POST',
    headers: { Authorization: `Bearer ${request.config.apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: request.config.model,
      messages: [
        { role: 'system', content: instructionsFor(request) },
        { role: 'user', content: conversationText(request.channel, request.turns) },
      ],
      temperature: 0.2,
      max_tokens: 1400,
      response_format: {
        type: 'json_schema',
        json_schema: {
          name: 'care_model_decision',
          strict: true,
          schema: DECISION_SCHEMA,
        },
      },
    }),
  })) as { choices?: Array<{ message?: { content?: string } }> };
  return enforceAuthorityGuard(
    parseDecision(requireText(payload.choices?.[0]?.message?.content, 'CARE_MODEL_MISSING_CHOICE_TEXT')),
    request.authorityGuard,
  );
}

async function runAnthropic(request: CareModelRequest): Promise<CareModelDecision> {
  const payload = (await postJson('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': request.config.apiKey,
      'anthropic-version': '2023-06-01',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: request.config.model,
      max_tokens: 1400,
      system: instructionsFor(request),
      messages: [{ role: 'user', content: conversationText(request.channel, request.turns) }],
    }),
  })) as { content?: Array<{ type?: string; text?: string }> };
  const text = payload.content?.find((part) => part.type === 'text')?.text;
  return enforceAuthorityGuard(parseDecision(requireText(text, 'CARE_MODEL_MISSING_ANTHROPIC_TEXT')), request.authorityGuard);
}

async function runGemini(request: CareModelRequest): Promise<CareModelDecision> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(request.config.model)}:generateContent`;
  const apiKey = request.config.apiKey.trim();
  if (!apiKey || /[\u0000-\u001F\u007F]/.test(apiKey)) throw new Error('CARE_MODEL_CREDENTIAL_INVALID_FORMAT');
  const payload = (await postJson(url, {
    method: 'POST',
    headers: { 'x-goog-api-key': apiKey, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: instructionsFor(request) }] },
      contents: [{ role: 'user', parts: [{ text: conversationText(request.channel, request.turns) }] }],
      generationConfig: { responseMimeType: 'application/json', temperature: 0.2, maxOutputTokens: 1400 },
    }),
  })) as { candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }> };
  return enforceAuthorityGuard(
    parseDecision(requireText(payload.candidates?.[0]?.content?.parts?.[0]?.text, 'CARE_MODEL_MISSING_GEMINI_TEXT')),
    request.authorityGuard,
  );
}

export async function runCareModel(request: CareModelRequest): Promise<CareModelDecision> {
  if (!request.config.apiKey) throw new Error('CARE_MODEL_CREDENTIAL_MISSING');
  if (!request.config.model) throw new Error('CARE_MODEL_NAME_REQUIRED');
  switch (request.config.provider) {
    case 'openai_responses':
      return runOpenAIResponses(request);
    case 'openai_compatible_chat':
      return runOpenAICompatible(request);
    case 'anthropic_messages':
      return runAnthropic(request);
    case 'google_gemini':
      return runGemini(request);
    default:
      throw new Error('CARE_MODEL_PROVIDER_UNSUPPORTED');
  }
}