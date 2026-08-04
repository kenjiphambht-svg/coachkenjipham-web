import type { NextApiRequest, NextApiResponse } from 'next';

import { requireAdmin } from '@/lib/auth/require-admin';
import { createAdminSupabase, createServerSupabase } from '@/lib/db/client';
import { DomainError, HTTP_STATUS_BY_CODE } from '@/lib/domain/errors';
import { getSettingsAuditActor, validateSettingsPayload } from '@/lib/admin/settings';

function assertFrozenReadiness(values: ReturnType<typeof validateSettingsPayload>) {
  if (
    values.hatmam.publicActivationEnabled ||
    values.integrations.privateStorageReady ||
    values.integrations.deletionWorkflowReady ||
    values.integrations.resendReadiness !== 'off' ||
    values.integrations.calcomReadiness !== 'off'
  ) {
    throw new DomainError(
      'VALIDATION_FAILED',
      'Release gates và provider readiness đang bị khóa trong staging. Không thể bật từ màn cài đặt.'
    );
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: { code: 'METHOD_NOT_ALLOWED', message: 'Chỉ nhận POST.' } });
  }

  try {
    const db = createServerSupabase({ req, res });
    const admin = await requireAdmin(db);
    const values = validateSettingsPayload(req.body?.values);
    assertFrozenReadiness(values);

    const systemDb = createAdminSupabase();
    const { data, error } = await systemDb.rpc('save_operational_settings_version', {
      p_values: values,
      p_actor: getSettingsAuditActor(admin.adminEmail),
    });
    if (error) throw error;

    return res.status(200).json({ ok: true, data: (data as Array<Record<string, unknown>> | null)?.[0] ?? null });
  } catch (error) {
    if (error instanceof DomainError) {
      return res.status(HTTP_STATUS_BY_CODE[error.code]).json(error.toResponse());
    }
    console.error('[admin] settings version failed', { at: new Date().toISOString() });
    return res.status(500).json({
      ok: false,
      error: { code: 'INTERNAL', message: 'Chưa lưu được phiên bản mới. Hãy thử lại.' },
    });
  }
}
