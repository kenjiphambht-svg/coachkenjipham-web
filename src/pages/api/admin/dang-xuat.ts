import type { NextApiRequest, NextApiResponse } from 'next';

import { createServerSupabase } from '@/lib/db/client';
import { ADMIN_LOGIN_PATH } from '@/lib/auth/admin-gate';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end();
  }
  try {
    const db = createServerSupabase({ req, res });
    await db.auth.signOut();
  } catch {
    // Không cấu hình được thì vẫn đẩy về trang đăng nhập.
  }
  return res.redirect(303, ADMIN_LOGIN_PATH);
}
