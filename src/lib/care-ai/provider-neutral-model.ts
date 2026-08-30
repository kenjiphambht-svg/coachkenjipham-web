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
- Missing/conflicting material truth stays UNKNOWN. HUMAN_HANDOFF may mark that human authority is required, but it is NOT proof that a person, team, channel or transfer route exists.
- Preserve user agency. No diagnosis, therapy, medical/legal/financial advice, fixed child labels/predictions, hidden psychological scoring or permanent persona claims.
- No tool / no verified route is the default in this freeform layer. Never say an action was recorded, transferred, connected, queued, started, completed, promised, will receive a response, durably suppressed, deleted, booked or sent unless separate verified execution evidence exists.
- Explicit stop-contact => SUPPRESS the current interaction only. Never claim durable persistence or future-message suppression unless a tool confirmed it.
- Privacy/delete or explicit human/Kenji request => HUMAN_HANDOFF + DO_NOT_WRITE. Never claim deletion happened and never invent a person/team/channel route.
- Child-sensitive concern => no diagnosis/fixed label and no invented specialist/support route.
- Ambiguous identity must never auto-merge. Unconfirmed actions must never be described as completed, underway, queued or promised.
- Never auto-cross-sell B2C/B2B. Mixed B2B + personal needs must remain separate; never claim proposal, booking, transfer or cross-sell action.
- Lặng 90 current sale/booking/price/availability truth stays UNKNOWN unless separately verified. UNKNOWN must not be converted into a named person/team route.
- Khám Phá/Giao Mùa product-specific current price/availability/close truth stays UNKNOWN unless separately verified.
- B2B Entry/Core never autonomously promise proposal, ROI, quote, contract or start date.
- Memory is compact factual continuity only; never preserve raw private/child story, diagnosis, hidden score or speculative intent as fact.
- Voice is truth-first, precise and low-pressure. Do not open with generic service empathy such as “Chào bạn” or “Cảm ơn bạn đã chia sẻ”. Do not invent an unnamed support route. For Messenger/Instagram prefer 1–3 short sentences; say enough then stop.

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

function normalizedBoundaryText(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
}

function includesAny(text: string, patterns: RegExp[]): boolean {
  return patterns.some((pattern) => pattern.test(text));
}

function userBoundaryText(turns: string[]): string {
  return normalizedBoundaryText(turns.join(' '));
}

function isStopContact(text: string): boolean {
  return includesAny(text, [
    /\bdung nhan\b/,
    /\bngung nhan\b/,
    /\bdung lien he\b/,
    /\bngung lien he\b/,
    /\bdung nhan tin\b/,
    /\bngung nhan tin\b/,
    /\bdung o day\b/,
    /\bdo not contact\b/,
    /\bstop contact\b/,
    /\bunsubscribe\b/,
  ]);
}

function isPrivacyDelete(text: string): boolean {
  return includesAny(text, [
    /\bxoa (?:du lieu|thong tin)\b/,
    /\b(?:du lieu|thong tin).*\bxoa\b/,
    /\bquyen rieng tu\b/,
    /\bprivacy\b/,
    /\bdelete (?:my )?(?:data|information)\b/,
  ]);
}

function isExplicitHumanRequest(text: string): boolean {
  return includesAny(text, [
    /\bkenji\b/,
    /\bnguoi that\b/,
    /\bnguoi phu trach\b/,
    /\bnguoi co tham quyen\b/,
    /\bnhan vien\b/,
    /\bhuman\b/,
  ]);
}

function isChildSensitive(text: string): boolean {
  const child = includesAny(text, [
    /\bcon minh\b/,
    /\bcon toi\b/,
    /\bdua tre\b/,
    /\btre em\b/,
    /\bbe nha\b/,
    /\bchau nha\b/,
  ]);
  const sensitive = includesAny(text, [
    /\btam ly\b/,
    /\bthu minh\b/,
    /\bit noi\b/,
    /\blo au\b/,
    /\btram cam\b/,
    /\broi loan\b/,
    /\bchan doan\b/,
    /\bbi gi\b/,
  ]);
  return child && sensitive;
}

function isMixedB2bB2c(text: string): boolean {
  const b2b = includesAny(text, [
    /\bdoanh nghiep\b/,
    /\bcong ty\b/,
    /\bb2b\b/,
    /\bproposal\b/,
    /\bbao gia\b/,
    /\bhop dong\b/,
  ]);
  const personal = includesAny(text, [
    /\bca nhan\b/,
    /\bb2c\b/,
    /\bbuoi rieng\b/,
    /\bdat lich.*\bcho minh\b/,
    /\bcho minh.*\bdat lich\b/,
  ]);
  return b2b && personal;
}

function isLang90PriceAvailability(text: string): boolean {
  if (!/\blang 90\b/.test(text)) return false;
  return includesAny(text, [
    /\bgia\b/,
    /\bmuc phi\b/,
    /\bbao nhieu\b/,
    /\blich\b/,
    /\bcon cho\b/,
    /\bcho trong\b/,
    /\bcon lich\b/,
    /\bavailability\b/,
  ]);
}

function hasUnverifiedActionOrRouteClaim(reply: string): boolean {
  const text = normalizedBoundaryText(reply);
  return includesAny(text, [
    /\bda ghi nhan\b/,
    /\bda tiep nhan\b/,
    /\bse ngung (?:nhan tin|lien he)\b/,
    /\bse dung (?:nhan tin|lien he)\b/,
    /\bda chuyen\b/,
    /\bse chuyen\b/,
    /\bxin chuyen\b/,
    /\bchuyen .*\b(?:bo phan|kenji|chuyen gia|nguoi phu trach)\b/,
    /\bdang ket noi\b/,
    /\bse ket noi\b/,
    /\bket noi (?:truc tiep )?(?:voi|sang)\b/,
    /\bbo phan (?:phu trach|ho tro)\b/,
    /\bse phan hoi\b/,
    /\bphan hoi (?:lai|cho ban|chinh xac)\b/,
    /\bdang xu ly\b/,
    /\bda xu ly\b/,
    /\bse xu ly\b/,
    /\bda xoa\b/,
    /\bse xoa\b/,
    /\bdang xoa\b/,
    /\bqueued\b/,
  ]);
}

function stopContactDecision(decision: CareModelDecision): CareModelDecision {
  return {
    ...decision,
    truthStatus: 'BOUNDED',
    nextBestCare: 'SUPPRESS',
    commercialReadiness: 'WAIT',
    memoryDecision: 'DO_NOT_WRITE',
    handoffRequired: false,
    reply: 'Được, mình dừng ở đây.',
  };
}

function privacyDeleteDecision(decision: CareModelDecision): CareModelDecision {
  return {
    ...decision,
    truthStatus: 'UNKNOWN',
    nextBestCare: 'HUMAN_HANDOFF',
    commercialReadiness: 'HANDOFF',
    memoryDecision: 'DO_NOT_WRITE',
    handoffRequired: true,
    reply: 'Mình không thể tự xóa hoặc xác nhận đã xóa dữ liệu tại đây. Yêu cầu này cần người có thẩm quyền xử lý; mình chưa có dữ kiện để xác nhận ai hoặc kênh nào.',
  };
}

function childSensitiveDecision(decision: CareModelDecision): CareModelDecision {
  return {
    ...decision,
    truthStatus: 'UNKNOWN',
    nextBestCare: 'HUMAN_HANDOFF',
    commercialReadiness: 'HANDOFF',
    memoryDecision: 'DO_NOT_WRITE',
    handoffRequired: true,
    reply: 'Chỉ từ những dấu hiệu này mình không thể kết luận con bạn “bị gì” hay gắn nhãn tâm lý. Mình có thể giúp bạn tách điều đang quan sát được khỏi suy đoán và xem điều gì cần làm rõ thêm.',
  };
}

function mixedB2bB2cDecision(decision: CareModelDecision): CareModelDecision {
  return {
    ...decision,
    truthStatus: 'UNKNOWN',
    nextBestCare: 'HUMAN_HANDOFF',
    commercialReadiness: 'HANDOFF',
    memoryDecision: 'DO_NOT_WRITE',
    handoffRequired: true,
    reply: 'Mình không thể tự gửi proposal hay đặt lịch từ cuộc trò chuyện này. Mình cũng không gộp yêu cầu doanh nghiệp và nhu cầu cá nhân thành một bước bán hàng khi chưa có xác nhận riêng cho từng việc.',
  };
}

function lang90UnknownDecision(request: Pick<CareModelRequest, 'channel'>, decision: CareModelDecision): CareModelDecision {
  return {
    ...decision,
    truthStatus: 'UNKNOWN',
    nextBestCare: 'ANSWER',
    commercialReadiness: 'EXPLORE',
    memoryDecision: 'DO_NOT_WRITE',
    handoffRequired: false,
    reply: request.channel === 'instagram'
      ? 'Mình chưa có dữ kiện đã xác minh về giá hay chỗ trống của Lặng 90, nên không thể khẳng định.'
      : 'Mình chưa có dữ kiện đã xác minh về giá hoặc lịch còn trống của Lặng 90, nên không thể khẳng định ở đây.',
  };
}

function explicitHumanDecision(decision: CareModelDecision): CareModelDecision {
  return {
    ...decision,
    truthStatus: 'UNKNOWN',
    nextBestCare: 'HUMAN_HANDOFF',
    commercialReadiness: 'HANDOFF',
    memoryDecision: 'DO_NOT_WRITE',
    handoffRequired: true,
    reply: 'Bạn đang muốn nói với người thật. Mình chưa có dữ kiện để xác nhận người hoặc kênh cụ thể cho yêu cầu này.',
  };
}

function genericUnverifiedActionDecision(decision: CareModelDecision): CareModelDecision {
  const humanRequired = decision.nextBestCare === 'HUMAN_HANDOFF' || decision.handoffRequired;
  const suppressCurrent = decision.nextBestCare === 'SUPPRESS';
  return {
    ...decision,
    truthStatus: suppressCurrent ? 'BOUNDED' : 'UNKNOWN',
    nextBestCare: suppressCurrent ? 'SUPPRESS' : humanRequired ? 'HUMAN_HANDOFF' : 'ANSWER',
    commercialReadiness: suppressCurrent ? 'WAIT' : humanRequired ? 'HANDOFF' : 'EXPLORE',
    memoryDecision: 'DO_NOT_WRITE',
    handoffRequired: suppressCurrent ? false : humanRequired,
    reply: 'Mình chưa có xác nhận cho bất kỳ hành động hay kênh chuyển tiếp nào trong cuộc trò chuyện này. Mình chỉ có thể trả lời trong phạm vi thông tin hiện có.',
  };
}

export function enforceFreeformActionRouteTruth(
  request: Pick<CareModelRequest, 'channel' | 'turns' | 'authorityGuard'>,
  decision: CareModelDecision,
): CareModelDecision {
  // Canonical fixture authority is enforced elsewhere and must not be reclassified here.
  if (request.authorityGuard) return decision;

  // The current freeform provider request has no tool/action proof and no verified route field.
  // Therefore any narrated action/route/persistence is unverified unless a future contract adds explicit evidence.
  const text = userBoundaryText(request.turns);
  if (isStopContact(text)) return stopContactDecision(decision);
  if (isPrivacyDelete(text)) return privacyDeleteDecision(decision);
  if (isChildSensitive(text)) return childSensitiveDecision(decision);
  if (isMixedB2bB2c(text)) return mixedB2bB2cDecision(decision);
  if (isLang90PriceAvailability(text)) return lang90UnknownDecision(request, decision);
  if (isExplicitHumanRequest(text)) return explicitHumanDecision(decision);
  if (hasUnverifiedActionOrRouteClaim(decision.reply)) return genericUnverifiedActionDecision(decision);
  return decision;
}

function finalizeDecision(request: CareModelRequest, decision: CareModelDecision): CareModelDecision {
  return enforceFreeformActionRouteTruth(request, enforceAuthorityGuard(decision, request.authorityGuard));
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

  if (payload.output_text) return finalizeDecision(request, parseDecision(payload.output_text));
  for (const item of payload.output || []) {
    for (const part of item.content || []) {
      if (part.type === 'output_text' && part.text) return finalizeDecision(request, parseDecision(part.text));
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
  return finalizeDecision(
    request,
    parseDecision(requireText(payload.choices?.[0]?.message?.content, 'CARE_MODEL_MISSING_CHOICE_TEXT')),
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
  return finalizeDecision(request, parseDecision(requireText(text, 'CARE_MODEL_MISSING_ANTHROPIC_TEXT')));
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
  return finalizeDecision(
    request,
    parseDecision(requireText(payload.candidates?.[0]?.content?.parts?.[0]?.text, 'CARE_MODEL_MISSING_GEMINI_TEXT')),
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
