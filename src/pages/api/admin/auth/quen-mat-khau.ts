import type { NextApiRequest, NextApiResponse } from 'next';

import { isCanonicalFounderEmail, RECOVERY_CONFIRMATION } from '@/lib/auth/founder-recovery';
import { getCanonicalRecoveryRedirect } from '@/lib/auth/founder-recovery-server';
import { getClientIp } from '@/lib/api/guard';
import { createAdminSupabase, createRecoverySupabase } from '@/lib/db/client';
import { checkPostgresRateLimit } from '@/lib/security/rate-limit';

const RECOVERY_LIMIT = { limit: 3, windowMs: 15 * 60 * 1000 };

function genericResponse(res: NextApiResponse) {
  return res.status(200).json({ ok: true, data: { message: RECOVERY_CONFIRMATION } });
}

/**
 * Password recovery intentionally has one indistinguishable response. It never
 * confirms whether an account exists, and only the canonical Founder address
 * can trigger a Supabase email.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Referrer-Policy', 'no-referrer');
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: { code: 'METHOD_NOT_ALLOWED', message: 'Chỉ nhận POST.' } });
  }

  try {
    if (!isCanonicalFounderEmail(req.body?.email)) return genericResponse(res);

    const systemDb = createAdminSupabase();
    await checkPostgresRateLimit(systemDb, `admin-password-recovery:${getClientIp(req)}`, RECOVERY_LIMIT);

    const redirectTo = getCanonicalRecoveryRedirect();
    const db = createRecoverySupabase();
    const { error } = await db.auth.resetPasswordForEmail(req.body.email.trim().toLowerCase(), { redirectTo });
    if (error) return genericResponse(res);
  } catch {
    // Deliberately do not log raw email, IP, recovery state, or provider details.
    // A generic 200 response prevents both account enumeration and rate-limit probing.
  }

  return genericResponse(res);
}
