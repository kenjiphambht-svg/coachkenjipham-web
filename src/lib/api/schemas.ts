// ============================================================
// Schema kiểm tra dữ liệu vào (zod).
//
// Thông điệp lỗi viết bằng tiếng Việt, giọng Essence: chỉ ra thiếu gì,
// KHÔNG đổ lỗi người dùng. Không dùng "bạn đã nhập sai".
//
// B0: các schema này CHƯA được nối vào form công khai nào. Chúng là lớp
// cửa nhận sẵn sàng cho vòng sau.
// ============================================================

import { z } from 'zod';

/**
 * Honeypot: trường ẩn mà người thật không bao giờ thấy nên luôn để trống.
 * Bot tự điền mọi input trong DOM. Có giá trị = nghi là bot.
 * Cùng tên "company" với form /lien-he đang chạy, để nhất quán.
 */
export const honeypotField = z
  .string()
  .max(0, 'Trường này phải để trống.')
  .optional()
  .or(z.literal(''));

const requiredText = (label: string, max = 5000) =>
  z
    .string({ error: `Còn thiếu ${label}.` })
    .trim()
    .min(1, `Còn thiếu ${label}.`)
    .max(max, `${label} dài quá ${max} ký tự — rút ngắn giúp tôi một chút nhé.`);

export const contactMessageSchema = z.object({
  name: requiredText('tên gọi', 200),
  contact: requiredText('một cách liên hệ', 200),
  message: requiredText('lời nhắn', 5000),
  company: honeypotField,
});
export type ContactMessageInput = z.infer<typeof contactMessageSchema>;

/**
 * Sáu câu Lặng. Giữ đúng cấu trúc và ý nghĩa của form đang chạy tại
 * /lang-90/dat-phien.
 *
 * MÀN HÌNH CHẶN AN TOÀN (FD-2026-08-02 FD-C — bắt buộc mang sang hệ mới
 * nguyên vẹn): câu 2 chọn "C" nghĩa là người gửi đang có ý nghĩ tự làm hại
 * bản thân hoặc người khác. Trường hợp đó KHÔNG được tạo hồ sơ, KHÔNG thu
 * thêm dữ liệu — xem CRISIS_ANSWER và assertNotCrisis() bên dưới.
 */
export const LANG_Q2_CRISIS_ANSWER = 'C' as const;

export const langApplicationSchema = z.object({
  q1_situation: requiredText('câu trả lời cho câu 1'),
  q2_level: z.enum(['A', 'B', 'C', 'D'], { error: 'Chọn giúp một mục ở câu 2.' }),
  q3_prior_help: z.enum(['A', 'B', 'C'], { error: 'Chọn giúp một mục ở câu 3.' }),
  q4_want: requiredText('câu trả lời cho câu 4'),
  q5_openness: z.enum(['A', 'B', 'C'], { error: 'Chọn giúp một mục ở câu 5.' }),
  q6_extra: z.string().trim().max(5000).optional().or(z.literal('')),
  applicant_name: requiredText('tên gọi', 200),
  applicant_contact: requiredText('một cách liên hệ', 200),
  consent: z.literal(true, {
    error: 'Cần bạn xác nhận đồng ý trước khi tiếp tục.',
  }),
  company: honeypotField,
});
export type LangApplicationInput = z.infer<typeof langApplicationSchema>;

export const hatMamOrderSchema = z.object({
  package: z.enum(['goi-1', 'goi-2'], { error: 'Chọn giúp một gói.' }),
  parent_name: requiredText('tên ba mẹ', 200),
  parent_contact: requiredText('một cách liên hệ', 200),
  company: honeypotField,
});
export type HatMamOrderInput = z.infer<typeof hatMamOrderSchema>;

/**
 * Dữ liệu trẻ em — schema TÁCH RIÊNG, đúng như bảng tách riêng trong CSDL.
 * Không gộp vào hatMamOrderSchema, để không có chỗ nào trong code coi
 * "đơn hàng" và "hồ sơ trẻ" là một khối dữ liệu.
 */
export const childProfileSchema = z.object({
  child_name: z.string().trim().max(200).optional().or(z.literal('')),
  birth_date: z.string().trim().min(1, 'Còn thiếu ngày sinh của bé.'),
  birth_time: z.string().trim().optional().or(z.literal('')),
  birth_time_known: z.boolean().default(false),
  birth_place: z.string().trim().max(300).optional().or(z.literal('')),
  family_context: z.string().trim().max(5000).optional().or(z.literal('')),
});
export type ChildProfileInput = z.infer<typeof childProfileSchema>;

/** Tháng dự kiến diễn ra phiên — Kenji chọn khi bấm "Nhận". */
export const acceptLangSchema = z.object({
  target_session_month: z
    .string()
    .regex(/^\d{4}-\d{2}$/, 'Chọn giúp một tháng (dạng YYYY-MM).'),
});

export const declineLangSchema = z.object({
  reason: requiredText('lý do', 1000),
});
