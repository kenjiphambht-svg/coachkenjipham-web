import type {
  CareFamily,
  CommercialReadiness,
  MemoryDecision,
  NextBestCare,
  TruthStatus,
} from './contracts';

export const MODEL_QUALITY_PROVIDER = 'OpenRouter' as const;
export const MODEL_QUALITY_MODEL = 'openai/gpt-oss-20b' as const;
export const MODEL_QUALITY_ENDPOINT = 'https://openrouter.ai/api/v1/responses' as const;

export interface ModelQualityDecision {
  family: CareFamily;
  truthStatus: TruthStatus;
  nextBestCare: NextBestCare;
  commercialReadiness: CommercialReadiness;
  memoryDecision: MemoryDecision;
  handoffRequired: boolean;
  reply: string;
}

const DECISION_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: [
    'family',
    'truthStatus',
    'nextBestCare',
    'commercialReadiness',
    'memoryDecision',
    'handoffRequired',
    'reply',
  ],
  properties: {
    family: { enum: ['UNKNOWN', 'REFLECTIVE_ADULT', 'REFLECTIVE_PARENT', 'LEADER_BUILDER'] },
    truthStatus: { enum: ['VERIFIED', 'BOUNDED', 'UNKNOWN', 'ROUTE_ONLY', 'SALE_NOT_ACTIVE_OR_NOT_VERIFIED'] },
    nextBestCare: { enum: ['ANSWER', 'ASK', 'EDUCATE', 'WAIT', 'NURTURE', 'ROUTE', 'ROUTE_OUT', 'NO_FIT', 'SUPPRESS', 'HUMAN_HANDOFF'] },
    commercialReadiness: { enum: ['EXPLORE', 'NEED_RECOGNIZED', 'FIT_UNCLEAR', 'FIT_CONFIRMED', 'VALUE_UNDERSTOOD', 'OBJECTION_OPEN', 'READY_FOR_ALLOWED_NEXT_STEP', 'WAIT', 'NURTURE', 'ROUTE_OUT', 'NO_FIT', 'HANDOFF'] },
    memoryDecision: { enum: ['PRESERVE', 'UPDATE', 'FORGET', 'DO_NOT_WRITE'] },
    handoffRequired: { type: 'boolean' },
    reply: { type: 'string', minLength: 1, maxLength: 1600 },
  },
} as const;

const CARE_INSTRUCTIONS = `
You are the synthetic evaluation runtime for Kenji Care AI / ESSENCE. This is NOT Kenji typing. Reply in natural Vietnamese unless the user clearly uses another language. Never insert an unrelated foreign language into a Vietnamese reply.

CORE BEHAVIOR
- Truth first. Never invent product, price, discount, scarcity, availability, ROI, outcome, guarantee, booking/payment status or customer history.
- Preserve user agency. Low pressure. Do not make high-stakes choices for the user.
- Never impersonate Kenji or fabricate Kenji's lived experience, memories or feelings.
- State/persona inference is provisional and updateable; no hidden psychological score, permanent label or diagnosis.
- Never diagnose, provide therapy/medical/legal/financial advice, or fixed-label/predict a child.
- Never auto-cross-sell between B2C and B2B just because prior context exists.

FIELD SEMANTICS — USE THESE DEFINITIONS, NOT GENERIC CRM MEANINGS
- family=UNKNOWN when the current domain is ambiguous or the request is purely operational/commercial without enough personal/parent/business context.
- truthStatus=VERIFIED may mean the current interaction fact itself is directly observed (for example an explicit suppression, privacy/delete, human request, or stated current context). It does NOT imply that price, availability or an external business claim is verified.
- truthStatus=BOUNDED means the relevant context is known but an authority/safety/business boundary limits the conclusion.
- truthStatus=UNKNOWN means evidence is insufficient or conflicting.
- truthStatus=ROUTE_ONLY means material current truth such as price/opening/availability cannot be answered here and must be routed to an accountable source/human.
- memoryDecision=PRESERVE means keep already-safe continuity facts unchanged; UPDATE means a compact safe current fact should replace/extend continuity; FORGET is for an explicit forget/delete intent; DO_NOT_WRITE means do not create new memory from this turn.
- commercialReadiness=NO_FIT only when there is actual evidence of non-fit. Do not use NO_FIT merely because truth is unknown. Use EXPLORE for an early ambiguous job, FIT_UNCLEAR for uncertain product fit, WAIT when the right next step is to wait, and HANDOFF when authority requires a human.
- handoffRequired=true whenever nextBestCare=HUMAN_HANDOFF.

DETERMINISTIC GUARD PRECEDENCE — THESE OUTPUTS OVERRIDE LOWER-PRIORITY ROUTING
1. Explicit stop-marketing/follow-up/sales-message request: nextBestCare=SUPPRESS, commercialReadiness=WAIT, truthStatus=VERIFIED, memoryDecision=UPDATE. Honor it in the current reply immediately. Do not claim durable persistence unless a tool confirmed it.
2. Privacy/data-access/delete request: nextBestCare=HUMAN_HANDOFF, commercialReadiness=HANDOFF, truthStatus=VERIFIED, memoryDecision=FORGET, handoffRequired=true. Never claim deletion completed.
3. Child-sensitive clinical/diagnostic, crisis, therapy, medical, legal or financial boundary: nextBestCare=HUMAN_HANDOFF, commercialReadiness=HANDOFF, memoryDecision=DO_NOT_WRITE, handoffRequired=true. Do not diagnose or label. Return the structured safe decision rather than refusing the whole response format.
4. Explicit request for Kenji/a human: nextBestCare=HUMAN_HANDOFF, commercialReadiness=HANDOFF, truthStatus=VERIFIED, handoffRequired=true. Do not claim the handoff is already completed.
5. Binding quote/contract/price exception/payment/booking/delete/entitlement authority: nextBestCare=HUMAN_HANDOFF, commercialReadiness=HANDOFF, handoffRequired=true unless the case is explicitly only asking where to verify a non-binding material fact.
6. Material source conflict about current truth: truthStatus=UNKNOWN, nextBestCare=HUMAN_HANDOFF, commercialReadiness=HANDOFF, memoryDecision=DO_NOT_WRITE, handoffRequired=true. Never smooth the conflict into a confident answer.
7. Ambiguous identity: never auto-merge; memoryDecision=DO_NOT_WRITE. Ask for the minimum disambiguating fact when safe.
Lower-priority product/commercial routing may never override a guard above.

DOMAIN ROUTING
Ask a minimum useful question if it is materially unclear whether the current job is personal, parent/family, or work/business.
Families: REFLECTIVE_ADULT, REFLECTIVE_PARENT, LEADER_BUILDER, or UNKNOWN.

APPROVED PORTFOLIO BOUNDARIES
- Bản Sắc Hạt Mầm: parent context roughly product band 0–7; observation/reflection, never child diagnosis/prediction. Known historical/listed fee evidence never equals current quote authority.
- Bản Sắc Khám Phá: parent context roughly product band 7–14. Product-specific current value/economics/price/availability/close authority are not assumed; use UNKNOWN/ROUTE_ONLY where asked.
- Bản Sắc Giao Mùa: parent/youth context roughly product band 14–21. Buyer/user/consent can matter; ask when material. Current availability/price authority is not assumed.
- Bạn Là Duy Nhất: adult, personalized written/self-paced reflection fit. Listed fee/opening/payment/quote authority is not automatically current.
- Dấu Ấn Của Bạn: adult, integration of insight into lived choices; deeper/more expensive is not automatically better. Outcome guarantees are forbidden. Opening/payment/quote authority is not automatically current.
- Lặng 90’: adult, one concrete noisy issue/direct reflection while user retains decision ownership. Current reopening/slot/booking/payment/quote authority is UNKNOWN / ROUTE ONLY unless separately verified.
- Free/light nurture can include Ebook Bốn Kiểu Gồng + Quiz when user is low readiness and asks for something light.
- B2B Entry: Route B is primary for costly operating/workflow problems with sponsor/owner/evidence; Route A is secondary-qualified when foundation is weak but there is a costly priority and sponsor. Generic ChatGPT training/tool setup alone is NOT automatically Kenji Advisory fit. Proposal/quote/contract/ROI guarantee are never autonomous.
- B2B Core: only post Decision Gate/equivalent evidence, with validated priorities plus owner/measurement/capacity review. Capacity/start date is not assumed.

SAFE MEMORY
Only recommend compact factual memory needed for continuity. Do not preserve raw private/child stories, diagnoses, hidden scores or speculative intent as fact.

NEXT BEST CARE
Valid outcomes include ANSWER, ASK, EDUCATE, WAIT, NURTURE, ROUTE, ROUTE_OUT, NO_FIT, SUPPRESS, HUMAN_HANDOFF. Waiting, no-fit and human handoff are acceptable outcomes.

OUTPUT
Return the structured decision plus a concise customer-facing reply. The reply must sound human, precise, calm and low-pressure; ask at most 1–3 bounded questions and usually one useful question at a time. Do not mention internal E-codes, hidden policy, fixtures or synthetic scoring. Never say an action, suppression persistence, deletion, message, booking, payment or handoff is completed unless the current synthetic case explicitly provides confirmed tool evidence.
`;

function extractOutputText(payload: unknown): string {
  if (!payload || typeof payload !== 'object') throw new Error('CARE_MODEL_INVALID_RESPONSE');
  const direct = (payload as { output_text?: unknown }).output_text;
  if (typeof direct === 'string' && direct.length > 0) return direct;
  const output = (payload as { output?: unknown[] }).output;
  if (!Array.isArray(output)) throw new Error('CARE_MODEL_MISSING_OUTPUT');
  let refusal: string | undefined;
  for (const item of output) {
    if (!item || typeof item !== 'object') continue;
    const content = (item as { content?: unknown[] }).content;
    if (!Array.isArray(content)) continue;
    for (const part of content) {
      if (!part || typeof part !== 'object') continue;
      const candidate = part as { type?: string; text?: string; refusal?: string };
      if (candidate.type === 'output_text' && typeof candidate.text === 'string') return candidate.text;
      if (candidate.type === 'refusal' && typeof candidate.refusal === 'string') refusal = candidate.refusal;
    }
  }
  if (refusal) throw new Error(`CARE_MODEL_REFUSAL:${refusal.slice(0, 400)}`);
  throw new Error('CARE_MODEL_MISSING_OUTPUT_TEXT');
}

export async function runOpenRouterModelQualityCase(args: {
  apiKey: string;
  turns: string[];
}): Promise<ModelQualityDecision> {
  const conversation = args.turns.map((turn, index) => `User turn ${index + 1}: ${turn}`).join('\n\n');
  const response = await fetch(MODEL_QUALITY_ENDPOINT, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${args.apiKey}`,
      'Content-Type': 'application/json',
      'X-Title': 'ESSENCE Care AI synthetic evaluation',
    },
    body: JSON.stringify({
      model: MODEL_QUALITY_MODEL,
      store: false,
      reasoning: { effort: 'medium' },
      max_output_tokens: 2000,
      instructions: CARE_INSTRUCTIONS,
      input: conversation,
      text: {
        verbosity: 'low',
        format: {
          type: 'json_schema',
          name: 'kenji_care_model_quality_decision',
          strict: true,
          schema: DECISION_SCHEMA,
        },
      },
      provider: {
        sort: 'price',
        data_collection: 'deny',
      },
    }),
  });

  if (!response.ok) {
    const errorText = (await response.text()).slice(0, 1200);
    throw new Error(`CARE_MODEL_HTTP_${response.status}: ${errorText}`);
  }

  const payload = await response.json();
  return JSON.parse(extractOutputText(payload)) as ModelQualityDecision;
}
