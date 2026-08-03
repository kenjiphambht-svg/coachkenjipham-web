// ============================================================
// POST /api/lang-90/dang-ky
//
// Cửa nhận riêng tư cho Lặng. Không gửi email và không log nội dung form.
// Crisis/honeypot/rate limit/validation xảy ra trước khi ghi CSDL.
// ============================================================

import type { NextApiRequest, NextApiResponse } from 'next';

import {
  assertNotBot,
  assertNotCrisis,
  DEFAULT_RATE_LIMIT,
  getClientIp,
  parseBody,
} from '@/lib/api/guard';
import { langApplicationSchema } from '@/lib/api/schemas';
import { createAdminSupabase } from '@/lib/db/client';
import { DomainError, HTTP_STATUS_BY_CODE } from '@/lib/domain/errors';
import {
  hashIdempotencyKey,
  hashRequestPayload,
  requireIdempotencyKey,
} from '@/lib/security/idempotency';
import { checkPostgresRateLimit } from '@/lib/security/rate-limit';

function rpcErrorToDomain(error: { message?: string }): never {
  if (error.message === 'IDEMPOTENCY_KEY_REUSED') {
    throw new DomainError(
      'VALIDATION_FAILED',
      'Lần gửi này không khớp với yêu cầu trước đó. Tải lại trang rồi thử lại giúp tôi nhé.'
    );
  }
  throw error;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: { code: 'METHOD_NOT_ALLOWED', message: 'Chỉ nhận POST.' } });
  }

  try {
    const db = createAdminSupabase();
    await checkPostgresRateLimit(db, `lang-intake:${getClientIp(req)}`, DEFAULT_RATE_LIMIT);

    const input = parseBody(langApplicationSchema, req.body);
    assertNotBot(input);
    // Câu 2 = C phải dừng trước khi idempotency/database nhận bất kỳ câu trả lời nào.
    assertNotCrisis(input);

    const idempotencyKey = requireIdempotencyKey(req.headers['idempotency-key']);
    const { data, error } = await db.rpc('create_lang_application_from_intake', {
      p_q1_situation: input.q1_situation,
      p_q2_level: input.q2_level,
      p_q3_prior_help: input.q3_prior_help,
      p_q4_want: input.q4_want,
      p_q5_openness: input.q5_openness,
      p_q6_extra: input.q6_extra || '',
      p_applicant_name: input.applicant_name,
      p_applicant_contact: input.applicant_contact,
      p_idempotency_key_hash: hashIdempotencyKey(idempotencyKey),
      p_request_hash: hashRequestPayload({
        q1_situation: input.q1_situation,
        q2_level: input.q2_level,
        q3_prior_help: input.q3_prior_help,
        q4_want: input.q4_want,
        q5_openness: input.q5_openness,
        q6_extra: input.q6_extra || '',
        applicant_name: input.applicant_name,
        applicant_contact: input.applicant_contact,
        consent: input.consent,
      }),
    });
    if (error) rpcErrorToDomain(error);

    const created = (data as { application_id: string; order_code: string }[] | null)?.[0];
    if (!created) throw new Error('Lặng intake RPC returned no record.');

    return res.status(201).json({
      ok: true,
      data: { applicationId: created.application_id, orderCode: created.order_code },
    });
  } catch (error) {
    if (error instanceof DomainError) {
      // Honeypot không được biết nó đã bị phát hiện. Không tạo record nào.
      if (error.code === 'SPAM_SUSPECTED') return res.status(202).json({ ok: true, data: {} });
      return res.status(HTTP_STATUS_BY_CODE[error.code]).json(error.toResponse());
    }
    console.error('[public] lang intake failed', { at: new Date().toISOString() });
    return res.status(500).json({
      ok: false,
      error: { code: 'INTERNAL', message: 'Có trục trặc ở phía hệ thống. Thử lại giúp tôi nhé.' },
    });
  }
}
