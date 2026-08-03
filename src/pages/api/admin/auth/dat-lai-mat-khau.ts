import type { NextApiRequest, NextApiResponse } from 'next';

import { isCanonicalFounderEmail, passwordPolicyError } from '@/lib/auth/founder-recovery';
import { createAdminSupabase, createServerSupabase } from '@/lib/db/client';

const INVALID_LINK = 'Liên kết đặt lại mật khẩu không hợp lệ hoặc đã hết hạn.';

function invalidLink(res: NextApiResponse) {
  return res.status(401).json({ ok: false, error: { code: 'UNAUTHORIZED', message: INVALID_LINK } });
}

/** Update only the currently authenticated recovery session; never creates a role or MFA factor. */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: { code: 'METHOD_NOT_ALLOWED', message: 'Chỉ nhận POST.' } });
  }

  const password = typeof req.body?.password === 'string' ? req.body.password : '';
  const confirmation = typeof req.body?.confirmation === 'string' ? req.body.confirmation : '';
  const policyError = passwordPolicyError(password, confirmation);
  if (policyError) {
    return res.status(400).json({ ok: false, error: { code: 'VALIDATION_FAILED', message: policyError } });
  }

  try {
    const db = createServerSupabase({ req, res });
    const { data: userData, error: userError } = await db.auth.getUser();
    const user = userData.user;
    if (userError || !user || !isCanonicalFounderEmail(user.email)) return invalidLink(res);

    // An Auth recovery session alone is insufficient: the user must remain an active admin.
    const systemDb = createAdminSupabase();
    const { data: admin, error: adminError } = await systemDb
      .from('admin_users')
      .select('is_active')
      .eq('user_id', user.id)
      .maybeSingle();
    if (adminError || !admin?.is_active) return invalidLink(res);

    const { error: updateError } = await db.auth.updateUser({ password });
    if (updateError) return invalidLink(res);

    return res.status(200).json({ ok: true, data: { reauthRequired: true } });
  } catch {
    // Do not disclose or log recovery session details, password, or account state.
    return invalidLink(res);
  }
}
