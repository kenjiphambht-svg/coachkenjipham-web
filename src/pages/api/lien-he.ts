// ============================================================
// POST /api/lien-he
//
// Ghi inbox nội bộ, không tự gửi email. Email/notification là adapter riêng
// và chỉ được bật sau khi có cấu hình/vận hành được Founder chấp thuận.
// ============================================================

import type { NextApiRequest, NextApiResponse } from 'next';

import {
  assertNotBot,
  DEFAULT_RATE_LIMIT,
  getClientIp,
  parseBody,
} from '@/lib/api/guard';
import { contactMessageSchema } from '@/lib/api/schemas';
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
    await checkPostgresRateLimit(db, `contact:${getClientIp(req)}`, DEFAULT_RATE_LIMIT);

    const input = parseBody(contactMessageSchema, req.body);
    assertNotBot(input);

    const idempotencyKey = requireIdempotencyKey(req.headers['idempotency-key']);
    const { data, error } = await db.rpc('create_contact_message_from_public_form', {
      p_name: input.name,
      p_contact: input.contact,
      p_message: input.message,
      p_idempotency_key_hash: hashIdempotencyKey(idempotencyKey),
      p_request_hash: hashRequestPayload({
        name: input.name,
        contact: input.contact,
        message: input.message,
      }),
    });
    if (error) rpcErrorToDomain(error);

    const created = (data as { message_id: string }[] | null)?.[0];
    if (!created) throw new Error('Contact intake RPC returned no record.');

    return res.status(201).json({ ok: true, data: { messageId: created.message_id } });
  } catch (error) {
    if (error instanceof DomainError) {
      if (error.code === 'SPAM_SUSPECTED') return res.status(202).json({ ok: true, data: {} });
      return res.status(HTTP_STATUS_BY_CODE[error.code]).json(error.toResponse());
    }
    console.error('[public] contact intake failed', { at: new Date().toISOString() });
    return res.status(500).json({
      ok: false,
      error: { code: 'INTERNAL', message: 'Có trục trặc ở phía hệ thống. Thử lại giúp tôi nhé.' },
    });
  }
}
