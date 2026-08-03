import type { NextApiRequest, NextApiResponse } from 'next';

import { requireAdmin } from '@/lib/auth/require-admin';
import { createAdminSupabase, createServerSupabase } from '@/lib/db/client';
import { DomainError, HTTP_STATUS_BY_CODE } from '@/lib/domain/errors';
import { BOOKING_TOKEN_TTL_HOURS } from '@/lib/domain/states';
import { createPrivateLinkSecret } from '@/lib/security/private-link';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: { code: 'METHOD_NOT_ALLOWED', message: 'Chỉ nhận POST.' } });
  }
  const id = req.query.id;
  if (typeof id !== 'string') return res.status(400).json({ ok: false, error: { code: 'VALIDATION_FAILED', message: 'Thiếu mã hồ sơ.' } });

  try {
    const sessionDb = createServerSupabase({ req, res });
    const admin = await requireAdmin(sessionDb);
    const { data: { user } } = await sessionDb.auth.getUser();
    if (!user) throw new DomainError('UNAUTHORIZED', 'Cần đăng nhập.');
    const secret = createPrivateLinkSecret(new Date(), BOOKING_TOKEN_TTL_HOURS);
    const { error } = await createAdminSupabase().rpc('issue_lang_booking_token', {
      p_application_id: id,
      p_actor: `human:${user.id} (${admin.adminEmail})`,
      p_token_hash: secret.tokenHash,
      p_expires_at: secret.expiresAt,
    });
    if (error) {
      if (error.message === 'BOOKING_NOT_AVAILABLE') throw new DomainError('INVALID_TRANSITION', 'Chỉ phát link đặt lịch sau khi đã xác nhận tiền.');
      if (error.message === 'APPLICATION_NOT_FOUND') throw new DomainError('NOT_FOUND', 'Không tìm thấy hồ sơ này.');
      throw error;
    }
    return res.status(200).json({ ok: true, data: { bookingPath: `/lang-90/dat-lich/${secret.rawToken}`, expiresAt: secret.expiresAt } });
  } catch (error) {
    if (error instanceof DomainError) return res.status(HTTP_STATUS_BY_CODE[error.code]).json(error.toResponse());
    console.error('[admin] issue booking link failed', { applicationId: id, at: new Date().toISOString() });
    return res.status(500).json({ ok: false, error: { code: 'INTERNAL', message: 'Có trục trặc ở phía hệ thống. Thử lại giúp tôi nhé.' } });
  }
}
