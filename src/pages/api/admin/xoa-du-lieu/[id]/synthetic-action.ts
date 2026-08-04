import type { NextApiRequest, NextApiResponse } from 'next';

import { requireAdmin } from '@/lib/auth/require-admin';
import { createAdminSupabase, createServerSupabase } from '@/lib/db/client';
import { DomainError, HTTP_STATUS_BY_CODE } from '@/lib/domain/errors';

const actions = ['open', 'confirm', 'retry'] as const;
type Action = (typeof actions)[number];

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: { code: 'METHOD_NOT_ALLOWED', message: 'Chỉ nhận POST.' } });
  }
  const id = req.query.id;
  if (typeof id !== 'string') {
    return res.status(400).json({ ok: false, error: { code: 'VALIDATION_FAILED', message: 'Thiếu mã yêu cầu xóa.' } });
  }
  try {
    const db = createServerSupabase({ req, res });
    const admin = await requireAdmin(db);
    const action = req.body?.action as Action | undefined;
    if (!action || !actions.includes(action)) throw new DomainError('VALIDATION_FAILED', 'Hành động deletion synthetic không hợp lệ.');
    const systemDb = createAdminSupabase();
    const { data, error } = await systemDb.rpc('run_hatmam_synthetic_deletion_action', {
      p_request_id: id,
      p_action: action,
      p_actor: `human:synthetic-deletion (${admin.adminEmail})`,
    });
    if (error) {
      if (error.message === 'SYNTHETIC_ONLY') throw new DomainError('UNAUTHORIZED', 'Chỉ request synthetic mới được thao tác ở đây.');
      throw error;
    }
    return res.status(200).json({ ok: true, data: (data as Array<Record<string, unknown>> | null)?.[0] ?? null });
  } catch (error) {
    if (error instanceof DomainError) return res.status(HTTP_STATUS_BY_CODE[error.code]).json(error.toResponse());
    return res.status(500).json({ ok: false, error: { code: 'INTERNAL', message: 'Workflow deletion synthetic chưa cập nhật được.' } });
  }
}
