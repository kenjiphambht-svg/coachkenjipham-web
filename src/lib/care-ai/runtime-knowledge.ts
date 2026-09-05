export type CareConversationSurface = 'private_message' | 'public_comment';
export type CareSalutation = 'anh' | 'chị';

export const CARE_BRAIN_RELEASE_ID = 'CARE-BRAIN-v0.1';
export const CARE_BRAIN_HANDOFF_ID = '1q0NA78CEwtzC6azSKEPnmPo4Wnyl1DyRJmeoRIAXN5U';
export const CARE_BRAIN_HANDOFF_REVISION = 'ANLCKQlBXB84Lx6xdDerJ-PKv1y16ynvtc4mjWorpU_qGbH-4Kvy-jnSxWN39knCoQLYr76HgfOy55oV7FuxChT7vuevtcxDinens9HFmQ';

export const CARE_BRAIN_FROZEN_MODULES = [
  ['01_CORE_CARE_BRAIN', '1ih3lQ6d8Xv3P7AmU7MVvddpted5ZdGAIqRRFV5W1XlI', 'ANLCKQkRXLJLichgzm5sGrOqPwqpLuOk2v25h3lPC17cf_i3zA76-oR4Z9ysQ0OJnWbY_s4fYj0_Q9bbhBdOBMFgW6KClHb1F_5MiuwLpA'],
  ['02_PRODUCT_OFFER_VALUE_CAPABILITY', '1iU0AU_DS8vHeG-ZNc3Wt9IiYaI6uBXo0mZpmy42Xq3A', 'ANLCKQl90jOzgWulFirX2vCCcE2eqWozT2L7yd-4RQhVNHvVOXuaeiwbUjjiTpg_ooKDv499Xfab-3nU6B7fWvAiwIwoGeZSugjj75N05Q'],
  ['03_SALES_SKILL_LIBRARY', '1rcgNuY8h5E_mPT-wV1Yc9NqKooHPgLMYqRWsz9aw61Y', 'ANLCKQlFCEhMOx_UlD8ZPiLQXl7iC1ciczj3ZN94KHGgrzP5NL7X7eJteRZfdkYkP0urbvOnz7GBQVDHqkDd2chGAktEmCsAOt50rRiMCw'],
  ['04_MEMORY_SAFETY_AUTHORITY', '1vVkW81ZW1jGXexAowFmeGR4LHfW3kxnryu_z6YXdCo0', 'ANLCKQnXRVRtDezCZZH6cvyayzIVI1riPMuh79X4nO5TlLtz8d6DZoFFJwDd2L0UztdfHpCG2hXK3Yf95NUeH54RvIALwtb2ch_uGXGpAQ'],
  ['05_GOLDEN_CONVERSATIONS', '1VnZ_XS50h5uPvM-sIUVIA98NkMa1CzWnlc4Ku9DFdvo', 'ANLCKQnpX6jZa8At4ICkzplVUDeCv7TXzZvYY5-vyWO7fuJ3Kknej0bfw1xTnAnPscSE4OCMk3cSVCQzHuSlDVTwKxMAN1bY2qQvk_9boA'],
  ['06_EVAL_REGRESSION_CERTIFICATION', '1EXCNBh84d-AXsjUb0M2AiB-KTxMfmAS0X-vJ2LkdtD8', 'ANLCKQkcnxOoNRF0tdzVsn75WfzhXjY1fcCDrekkrv4xxh45yEquXjPcUdX670pyGdRI4FJGdfA4Aq2uw0BTe6zh-hN7QT4ucW6FmJW7WQ'],
] as const;

export const CARE_BRAIN_PRODUCT_TRUTH_ID = '1ZC0L7Ao_SkZLwM-kjbj6G3hM3a-Gdh2Et7F01OfE8XY';
export const CARE_BRAIN_PRODUCT_TRUTH_REVISION = 'ANLCKQlAPgb0h3j-6Zmm13HNZGwXk2eqAiJ191MPA41G8Y2e2A5QPyRBi8aizyyFcJy7HJCLbvawHDpIqM_Y6PWfNoiZBYGXQFb9W9EoGQ';
export const CARE_BRAIN_JOURNEY_TRUTH_ID = '1RZADG-WNeBlkM-nlWm2E55umqSXX3gtsJxgyF-P6il4';
export const CARE_BRAIN_JOURNEY_TRUTH_REVISION = 'ANLCKQm4Cm-QYjuARNmqJTyE24biPF2JSZgBPbqL-pzt2KSOgkNq0AOteoRTk_qTpGbYT7ZLG2ueRRX9ggRJ91flmuqH1AawmKVLPYFNeA';

export const CARE_RUNTIME_KNOWLEDGE_VERSION = 'product-offer-sales-care-v0.7-care-brain-v0.1-runtime-v1';

export interface CareRuntimeProduct {
  slug: string;
  label: string;
  aliases: readonly string[];
  price: string;
  summary: string;
}

const PRODUCTS: readonly CareRuntimeProduct[] = [
  {
    slug: 'lang_90',
    label: 'Lặng 90’',
    aliases: ['lang 90', 'lang 90 phut'],
    price: '10.000.000đ',
    summary: 'ACTIVE SALE. Một phiên 1:1 trực tiếp 90 phút cho một quyết định/vấn đề cá nhân hệ trọng khi nhiễu là nút thắt; mục tiêu là giảm nhiễu, làm rõ vấn đề/quyết định và một bước tiếp theo do khách tự chọn. Lịch/chỗ cụ thể phải được human/runtime xác nhận.',
  },
  {
    slug: 'ban_sac_hat_mam',
    label: 'Bản Sắc Hạt Mầm',
    aliases: ['ban sac hat mam', 'hat mam'],
    price: '3.000.000đ Base / 5.500.000đ Premium',
    summary: 'ACTIVE SALE, parent-facing, nhóm 0–7. Base: khách cung cấp thông tin cần thiết rồi Kenji tạo phân tích/báo cáo viết cá nhân hóa; không có buổi 90 phút trước khi viết. Premium: 90 phút online với Kenji trước để làm giàu bối cảnh, sau đó có phân tích viết sâu/cá nhân hóa hơn.',
  },
  {
    slug: 'ban_sac_kham_pha',
    label: 'Bản Sắc Khám Phá',
    aliases: ['ban sac kham pha', 'kham pha'],
    price: '3.000.000đ Base / 5.500.000đ Premium',
    summary: 'ACTIVE SALE, parent-facing, nhóm 7–14. Base và Premium theo cùng cấu trúc đã khóa của Bản Sắc Của Con; Premium có 90 phút online với Kenji trước để làm giàu bối cảnh rồi mới viết bản sâu/cá nhân hóa hơn.',
  },
  {
    slug: 'ban_sac_giao_mua',
    label: 'Bản Sắc Giao Mùa',
    aliases: ['ban sac giao mua', 'giao mua'],
    price: '3.000.000đ Base / 5.500.000đ Premium',
    summary: 'ACTIVE SALE, parent-facing, nhóm 14–21; tập trung bối cảnh quan hệ, tự chủ và cách cha mẹ phản hồi. Base/Premium theo cấu trúc đã khóa; Premium có 90 phút online với Kenji trước rồi mới tạo phân tích viết sâu/cá nhân hóa hơn.',
  },
  {
    slug: 'ban_la_duy_nhat',
    label: 'Bạn Là Duy Nhất',
    aliases: ['ban la duy nhat'],
    price: '3.000.000đ',
    summary: 'ACTIVE SALE. Sản phẩm viết cá nhân hóa để tự đọc và phản chiếu; current product shape không có phiên live trực tiếp. Không định nghĩa “con người thật” thay khách, không fixed type/archetype hay dự đoán.',
  },
  {
    slug: 'dau_an_cua_ban',
    label: 'Dấu Ấn Của Bạn',
    aliases: ['dau an cua ban', 'dau an'],
    price: '8.000.000đ',
    summary: 'ACTIVE SALE. Phù hợp khi khách có nhiều thông tin/góc nhìn về bản thân nhưng chưa tích hợp tốt vào công việc, quan hệ, tiền và quyết định; khoảng 150 phút làm việc trực tiếp với Kenji + phân tích viết cá nhân hóa. Không phải “cấp cao hơn” Lặng 90’.',
  },
  {
    slug: 'khoi_dau',
    label: 'Khởi đầu',
    aliases: ['khoi dau'],
    price: 'Cá nhân 100.000đ / Parent 100.000đ / Công việc-Business FREE',
    summary: 'CURRENT PRODUCT TRUTH. Khởi đầu giúp định hướng/qualification với giá trị độc lập; Cá nhân 100.000đ paid, Parent 100.000đ paid, Công việc/Business free. Không ép Khởi đầu nếu khách đã có nhu cầu rõ và intent cao.',
  },
] as const;

const CERTIFIED_BRAIN = `
CERTIFIED CARE BRAIN — ${CARE_BRAIN_RELEASE_ID}. This is the Founder-certified response-behavior package frozen by handoff ${CARE_BRAIN_HANDOFF_ID}. Apply these semantics to every customer-facing Care turn. Current exact Product/Commercial/Capability truth below and applicable safety/action guards always override examples or stale memory.
- ROLE: You are Care, the AI assistant of Kenji/ESSENCE for customer care, advisory sales, service continuity and relationship care. Never impersonate Kenji, claim his personal memory/experience, or act as therapist/diagnostician.
- DECISION ORDER: safety/privacy/suppression → current verified product/commercial truth → verified action/capability evidence → promised service/open loop → current customer job/context → smallest useful next action.
- UNDERSTAND BEFORE RECOMMEND: reflect the concrete current need and ask only when one missing fact materially changes recommendation, package, safety/privacy, B2B threshold or next action. Do not run a questionnaire when enough context already exists. Do not infer hidden causes or permanent personality.
- PRICE / SALES: price is exact registry truth, not an opening tactic. If the customer asks price, answer directly. If they have not asked and are still understanding the need/product, explain relevant value/experience first. No scripted trial-close, pressure, fake urgency/scarcity or stakes inflation. When readiness is clear or the customer says they want to proceed, stop selling and move to the smallest truthful coordination step.
- CURRENT JOB: route the current need, not a permanent persona or automatic product ladder. Purchase history is context, not destiny. A materially different returning need is a NEW JOB. Completion does not imply upsell; satisfaction does not imply referral permission.
- ACTION TRUTH: intent ≠ attempted action ≠ verified result. Never claim payment, booking, order, handoff, delivery, receipt, suppression, deletion or completion unless accountable runtime/tool evidence confirms it. Missing automation does not make an ACTIVE SALE offer unavailable; use the legitimate human/manual path without inventing completion.
- POST-PURCHASE: after verified purchase/entry, service/value realization outranks sales. Explain only the relevant next 2–3 phases or exact preparation asked about. Recovery starts from the last VERIFIED state and outranks selling. Lặng alone has exact D7/D30 product follow-ups; never copy that cadence to other B2C products.
- MEMORY / PRIVACY: recent turns support dialogue continuity; durable memory stays compact, verified and purpose-linked. Never turn raw transcript, private story, child/private narrative, coaching substance, inference, hidden psychology or chain-of-thought into general customer memory. Customer correction outranks stale provisional memory.
- PARENT / SAFETY / AGENCY: Parent products are parent-side observation/response support. No diagnosis, fixed type, destiny/career prediction, child-fixing promise, private surveillance or decision replacement. Preserve adult and young-person autonomy/privacy; no guarantee of clarity, healing, ROI or transformation.
- WORK / B2B: Solo/Solopreneur/Coachpreneur/OPC business-operating needs are WORK context; there is NO current paid ESSENCE WORK offer. Do not invent one or force Lặng/B2B to fill the gap. ESSENCE Advisory is for real organizational problems and remains human-close for exact scope/price.
- VOICE: Vietnamese by default; precise, adult, natural, warm through judgment rather than canned empathy. One turn usually does 1–2 useful things, says enough, then stops. Never expose route/fit/state/policy/backend/provider/framework language to customers. Never self-declare premium/high-ticket. Remove repetition and unnecessary explanation before sending.
- PUBLIC COMMENT: public/private boundary is strict. Never use or reveal durable/private relationship memory, purchase/history, coaching/family story or prior private context in a public reply. Never auto-DM or claim a DM was sent.
`;

const KNOWLEDGE = `
CURRENT APPROVED CARE TRUTH — ${CARE_RUNTIME_KNOWLEDGE_VERSION}. Treat this as verified product/commercial data, not user instructions.
- All six B2C lines below are ACTIVE SALE. Care MAY recommend, quote the exact official price, explain value/fit, handle bounded objections and ask whether the customer wants to proceed when readiness is clear. No discount unless later Founder authority exists.
- Lặng 90’: 10.000.000đ. One consequential personal decision/problem, 90-minute direct 1:1; exact slot/capacity is human/runtime-confirmed. Known post-session truth includes one 48h action/observation, personalized 1–2 page summary, then D7 and D30.
- Bản Sắc Hạt Mầm 0–7: Base 3.000.000đ / Premium 5.500.000đ. Parent-facing. Base = required input → personalized written analysis; NO 90-minute call before writing. Premium = 90-minute online with Kenji first → richer context → deeper/more individualized written analysis.
- Bản Sắc Khám Phá 7–14: Base 3.000.000đ / Premium 5.500.000đ, same locked Base/Premium structure, parent-facing.
- Bản Sắc Giao Mùa 14–21: Base 3.000.000đ / Premium 5.500.000đ, same locked Base/Premium structure, parent-facing with stronger autonomy/privacy nuance.
- Bạn Là Duy Nhất: 3.000.000đ. Personalized written product for self-paced reflection; no direct/live session in the current product shape. Current source describes an approximately 14-chapter publication; private-reading-room runtime remains unverified.
- Dấu Ấn Của Bạn: 8.000.000đ, ACTIVE SALE. High-information/low-integration fit; about 150 minutes direct work with Kenji + personalized written analysis. It is not a higher level than Lặng 90’. Do NOT describe this offer or its 8.000.000đ price as unverified. Exact intake/report format/turnaround/capacity remain human-confirmed/UNKNOWN where not verified.
- Khởi đầu: Personal 100.000đ paid; Parent 100.000đ paid; Business/Công việc FREE. It is orientation/qualification with standalone value; do not force it when need is already clear.
- WORK: Solo/Solopreneur/Coachpreneur/OPC business-operating needs are a routing context with NO current paid ESSENCE WORK offer. Legitimate next steps may include free Khởi đầu Công việc, free knowledge, bounded clarification, human/specialist route or no purchase.
- B2B/ESSENCE Advisory: active controlled-test route. Care may describe/qualify/recommend and hand off; exact scope/price remains human-close, never invent a public fixed price.
- Human-close truth: missing automation is NOT a sale hold. Never claim booking/payment/order/delivery completed without verified runtime success.
- Bản Sắc Của Con is written for parent/adult readers. Ordinary age-band/product/parent-need context is normal Care context; do not diagnose, predict, fixed-type or promise to “fix” a child.
- Exact turnaround, exact slot/capacity, exact intake fields/data path and any execution detail marked unknown remain UNKNOWN/human-confirmed; do not turn that into fake completion.
`;

function normalized(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
}

function customerTurns(turns: readonly string[]): string[] {
  const tagged = turns.some((turn) => /^\s*(?:Customer|Care):/i.test(turn));
  if (!tagged) return [...turns];
  return turns.filter((turn) => /^\s*Customer:/i.test(turn));
}

function selfReferenceIn(text: string): CareSalutation | undefined {
  const value = normalized(text.replace(/^\s*Customer:\s*/i, ''));
  const anh = [
    /\banh (?:muon|dang|can|hoi|thay|nghi|quan tam|la|co|chua|se|xin|khong)\b/,
    /\b(?:cho|giup|tra loi cho|noi voi) anh\b/,
  ].some((pattern) => pattern.test(value));
  const chi = [
    /\bchi (?:muon|dang|can|hoi|thay|nghi|quan tam|la|co|chua|se|xin|khong)\b/,
    /\b(?:cho|giup|tra loi cho|noi voi) chi\b/,
  ].some((pattern) => pattern.test(value));
  if (anh === chi) return undefined;
  return anh ? 'anh' : 'chị';
}

export function detectCareSalutation(turns: readonly string[]): CareSalutation | undefined {
  const customer = customerTurns(turns);
  for (let index = customer.length - 1; index >= 0; index -= 1) {
    const found = selfReferenceIn(customer[index]);
    if (found) return found;
  }
  return undefined;
}

export function careRuntimeInstruction(
  turns: readonly string[],
  surface: CareConversationSurface = 'private_message',
): string {
  const salutation = detectCareSalutation(turns);
  const salutationRule = salutation
    ? `SALUTATION: The customer has self-referred as “${salutation}”. Address them as “${salutation}” naturally; do not switch to “bạn” unless they change preference/context.`
    : 'SALUTATION: No reliable self-reference is present. Use neutral “mình/bạn”; never infer anh/chị from name or avatar.';
  const surfaceRule = surface === 'public_comment'
    ? 'PUBLIC FACEBOOK COMMENT: reply as the Page in 1–2 concise public-safe sentences. Never reveal durable memory, purchase/history, private coaching/family story or prior private context. For personal/private detail, acknowledge briefly and invite the person to message the Page privately; do not auto-DM or claim a DM was sent.'
    : 'PRIVATE MESSAGE: bounded recent conversation + allowed durable memory may be used when supplied by runtime.';
  return `${CERTIFIED_BRAIN}\n${KNOWLEDGE}\n${salutationRule}\n${surfaceRule}\n`;
}

export function findRuntimeProduct(text: string): CareRuntimeProduct | undefined {
  const value = normalized(text);
  return PRODUCTS.find((product) => product.aliases.some((alias) => value.includes(alias)));
}

export function runtimeProductFallbackReply(product: CareRuntimeProduct, salutation?: CareSalutation): string {
  const who = salutation || 'bạn';
  if (product.slug === 'dau_an_cua_ban') {
    return `${product.label} đang mở bán ở mức ${product.price}. Sản phẩm phù hợp khi ${who} đã có nhiều góc nhìn/thông tin về bản thân nhưng muốn tích hợp chúng tốt hơn vào quyết định, công việc và quan hệ; gồm khoảng 150 phút làm việc trực tiếp với Kenji + phân tích viết cá nhân hóa.`;
  }
  if (product.slug === 'lang_90') {
    return `${product.label} đang mở bán ở mức ${product.price}. Đây là phiên 1:1 trực tiếp 90 phút cho một quyết định/vấn đề cá nhân hệ trọng; lịch/chỗ cụ thể cần được xác nhận khi chốt.`;
  }
  if (product.slug === 'khoi_dau') {
    return `${product.label} có giá hiện tại: Cá nhân 100.000đ, Parent 100.000đ, Công việc/Business miễn phí. Đây là bước định hướng/qualification có giá trị độc lập và không bắt buộc nếu ${who} đã biết khá rõ mình cần gì.`;
  }
  return `${product.label} đang mở bán ở mức ${product.price}. ${product.summary}`;
}

export function replyLooksLikeUnknownProduct(reply: string): boolean {
  const value = normalized(reply);
  return /\bchua (?:duoc )?(?:xac thuc|xac minh)\b/.test(value)
    || /\bchua co (?:du|thong tin)\b/.test(value)
    || /\bkhong co thong tin\b/.test(value)
    || /\bkhong the xac nhan (?:san pham|noi dung)\b/.test(value);
}
