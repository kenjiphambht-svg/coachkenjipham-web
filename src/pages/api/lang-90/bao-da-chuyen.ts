import type { NextApiRequest, NextApiResponse } from 'next';

import { DEFAULT_RATE_LIMIT, getClientIp } from '@/lib/api/guard';
import { createAdminSupabase } from '@/lib/db/client';
import { DomainError, HTTP_STATUS_BY_CODE } from '@/lib/domain/errors';
import { checkPostgresRateLimit } from '@/lib/security/rate-limit';
import { hashPrivateLinkToken } from '@/lib/security/private-link';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: { code: 'METHOD_NOT_ALLOWED', message: 'Chỉ nhận POST.' } });
  }
  try {
    const token = typeof req.body?.token === 'string' ? req.body.token : '';
    const reference = typeof req.body?.reference === 'string' ? req.body.reference.trim().slice(0, 100) : '';
    if (!/^[A-Za-z0-9_-]{43}$/.test(token)) throw new DomainError('NOT_FOUND', 'Link này không còn hợp lệ.');
    const db = createAdminSupabase();
    await checkPostgresRateLimit(db, `lang-payment-report:${getClientIp(req)}`, DEFAULT_RATE_LIMIT);
    const { data: request, error } = await db
      .from('lang_payment_requests')
      .select('id, application_id, expires_at, revoked_at, reported_transfer_at')
      .eq('token_hash', hashPrivateLinkToken(token))
      .maybeSingle();
    if (error) throw error;
    if (!request || request.revoked_at || new Date(request.expires_at).getTime() <= Date.now()) {
      throw new DomainError('NOT_FOUND', 'Link này đã hết hạn hoặc đã được thu hồi.');
    }
    if (!request.reported_transfer_at) {
      const { error: updateError } = await db
        .from('lang_payment_requests')
        .update({ reported_transfer_at: new Date().toISOString(), report_reference: reference || null })
        .eq('id', request.id)
        .is('reported_transfer_at', null);
      if (updateError) throw updateError;
      const { error: auditError } = await db.from('audit_log').insert({
        actor: 'customer:private_payment_link',
        action: 'lang.payment_reported',
        entity_type: 'lang_application',
        entity_id: request.application_id,
      });
      if (auditError) throw auditError;
    }
    return res.status(200).json({ ok: true, data: { alreadyReported: Boolean(request.reported_transfer_at) } });
  } catch (error) {
    if (error instanceof DomainError) return res.status(HTTP_STATUS_BY_CODE[error.code]).json(error.toResponse());
    console.error('[public] payment report failed', { at: new Date().toISOString() });
    return res.status(500).json({ ok: false, error: { code: 'INTERNAL', message: 'Có trục trặc ở phía hệ thống. Thử lại giúp tôi nhé.' } });
  }
}
