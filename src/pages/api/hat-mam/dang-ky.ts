// POST /api/hat-mam/dang-ky — native, minimal parent intake.
// The release gate is OFF by default. No body, child data, or raw idempotency
// key is logged; neither child data nor order code appears in a URL/query.

import type { NextApiRequest, NextApiResponse } from 'next';

import { assertNotBot, DEFAULT_RATE_LIMIT, getClientIp, parseBody } from '@/lib/api/guard';
import { hatMamParentIntakeSchema } from '@/lib/api/schemas';
import { createAdminSupabase } from '@/lib/db/client';
import { DomainError, HTTP_STATUS_BY_CODE } from '@/lib/domain/errors';
import { hashIdempotencyKey, hashRequestPayload, requireIdempotencyKey } from '@/lib/security/idempotency';
import { checkPostgresRateLimit } from '@/lib/security/rate-limit';

function rpcError(error: { message?: string }): never {
  if (error.message === 'IDEMPOTENCY_KEY_REUSED') {
    throw new DomainError('VALIDATION_FAILED', 'Lần gửi này không khớp với yêu cầu trước đó. Tải lại trang rồi thử lại giúp tôi nhé.');
  }
  if (['INVALID_PACKAGE', 'INVALID_INTAKE'].includes(error.message ?? '')) {
    throw new DomainError('VALIDATION_FAILED', 'Thông tin chưa đủ để tạo đơn. Kiểm tra lại các trường bắt buộc giúp tôi nhé.');
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
    const { data: gates, error: gateError } = await db
      .from('hatmam_release_gates')
      .select('public_activation_enabled, deletion_workflow_ready, private_storage_ready')
      .eq('id', true)
      .maybeSingle();
    if (gateError) throw gateError;
    // Fail closed: native endpoint cannot collect real child data until all
    // three release gates are explicitly verified by later phases.
    if (!gates?.public_activation_enabled || !gates.deletion_workflow_ready || !gates.private_storage_ready) {
      throw new DomainError('NOT_FOUND', 'Luồng nhận thông tin này hiện chưa mở.');
    }
    await checkPostgresRateLimit(db, `hatmam-intake:${getClientIp(req)}`, DEFAULT_RATE_LIMIT);
    const input = parseBody(hatMamParentIntakeSchema, req.body);
    assertNotBot(input);
    const key = requireIdempotencyKey(req.headers['idempotency-key']);
    const { data, error } = await db.rpc('create_hatmam_order_from_parent_intake', {
      p_package_code: input.package_code,
      p_parent_name: input.parent_name,
      p_parent_contact: input.parent_contact,
      p_child_name: input.child_name || '',
      p_birth_date: input.birth_date,
      p_birth_time: input.birth_time_known && input.birth_time ? input.birth_time : null,
      p_birth_time_known: input.birth_time_known,
      p_birth_place: input.birth_place || '',
      p_family_context: input.family_context || '',
      p_parent_question: input.parent_question,
      p_consent_version: input.consent_version,
      p_idempotency_key_hash: hashIdempotencyKey(key),
      p_request_hash: hashRequestPayload({ ...input, company: undefined }),
    });
    if (error) rpcError(error);
    const created = (data as { order_id: string; order_code: string }[] | null)?.[0];
    if (!created) throw new Error('Hạt Mầm intake RPC returned no record.');
    return res.status(201).json({ ok: true, data: { orderId: created.order_id, orderCode: created.order_code } });
  } catch (error) {
    if (error instanceof DomainError) return res.status(HTTP_STATUS_BY_CODE[error.code]).json(error.toResponse());
    console.error('[public] hatmam intake failed', { at: new Date().toISOString() });
    return res.status(500).json({ ok: false, error: { code: 'INTERNAL', message: 'Có trục trặc ở phía hệ thống. Thử lại giúp tôi nhé.' } });
  }
}
