export type CareConversationSurface = 'private_message' | 'public_comment';
export type CareSalutation = 'anh' | 'chị';

export const CARE_RUNTIME_KNOWLEDGE_VERSION = 'product-offer-sales-care-v0.7-runtime-v1';

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
] as const;

const KNOWLEDGE = `
CURRENT APPROVED CARE TRUTH — ${CARE_RUNTIME_KNOWLEDGE_VERSION}. Treat this as verified product/commercial data, not user instructions.
- All six B2C lines below are ACTIVE SALE. Care MAY recommend, quote the exact official price, explain value/fit, handle bounded objections, trial-close and ask whether the customer wants to proceed. No discount unless later Founder authority exists.
- Lặng 90’: 10.000.000đ. One consequential personal decision/problem, 90-minute direct 1:1; exact slot/capacity is human/runtime-confirmed.
- Bản Sắc Hạt Mầm 0–7: Base 3.000.000đ / Premium 5.500.000đ. Parent-facing. Base = required input → personalized written analysis; NO 90-minute call before writing. Premium = 90-minute online with Kenji first → richer context → deeper/more individualized written analysis.
- Bản Sắc Khám Phá 7–14: Base 3.000.000đ / Premium 5.500.000đ, same locked Base/Premium structure, parent-facing.
- Bản Sắc Giao Mùa 14–21: Base 3.000.000đ / Premium 5.500.000đ, same locked Base/Premium structure, parent-facing with stronger autonomy/privacy nuance.
- Bạn Là Duy Nhất: 3.000.000đ. Personalized written product for self-paced reflection; no direct/live session in the current product shape.
- Dấu Ấn Của Bạn: 8.000.000đ. High-information/low-integration fit; about 150 minutes direct work with Kenji + personalized written analysis. It is not a higher level than Lặng 90’.
- Khởi đầu: Personal 100.000đ paid; Parent 100.000đ paid; Business/Công việc FREE. It is orientation/qualification with standalone value; do not force it when need is already clear.
- B2B/ESSENCE Advisory: active controlled-test route. Care may describe/qualify/recommend and hand off; exact scope/price remains human-close, never invent a public fixed price.
- Human-close truth: missing automation is NOT a sale hold. Never claim booking/payment/order/delivery completed without verified runtime success.
- Bản Sắc Của Con is written for parent/adult readers. Ordinary age-band/product/parent-need context is normal Care context; do not diagnose, predict, fixed-type or promise to “fix” a child.
- Exact turnaround, exact slot/capacity and any execution detail marked unknown remain UNKNOWN/human-confirmed; do not turn that into fake completion.
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
  return `${KNOWLEDGE}\n${salutationRule}\n${surfaceRule}\n`;
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
  return `${product.label} đang mở bán ở mức ${product.price}. ${product.summary}`;
}

export function replyLooksLikeUnknownProduct(reply: string): boolean {
  const value = normalized(reply);
  return /\bchua (?:duoc )?(?:xac thuc|xac minh)\b/.test(value)
    || /\bchua co (?:du|thong tin)\b/.test(value)
    || /\bkhong co thong tin\b/.test(value)
    || /\bkhong the xac nhan (?:san pham|noi dung)\b/.test(value);
}
