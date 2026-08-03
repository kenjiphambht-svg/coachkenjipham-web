import type { NextApiRequest, NextApiResponse } from 'next';

import { getTrustedRecoveryRedirect, isCanonicalFounderEmail, RECOVERY_CONFIRMATION } from '@/lib/auth/founder-recovery';
import { getClientIp } from '@/lib/api/guard';
import { createAdminSupabase, createServerSupabase } from '@/lib/db/client';
import { checkPostgresRateLimit } from '@/lib/security/rate-limit';

const RECOVERY_LIMIT = { limit: 3, windowMs: 15 * 60 * 1000 };

function genericResponse(res: NextApiResponse) {
  return res.status(200).json({ ok: true, data: { message: RECOVERY_CONFIRMATION } });
}

function forwardedHost(req: NextApiRequest) {
  const host = req.headers['x-forwarded-host'];
  return Array.isArray(host) ? host[0] : host ?? req.headers.host;
}

/**
 * Password recovery intentionally has one indistinguishable response. It never
 * confirms whether an account exists, and only the canonical Founder address
 * can trigger a Supabase email.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: { code: 'METHOD_NOT_ALLOWED', message: 'Chỉ nhận POST.' } });
  }

  try {
    if (!isCanonicalFounderEmail(req.body?.email)) return genericResponse(res);

    const systemDb = createAdminSupabase();
    await checkPostgresRateLimit(systemDb, `admin-password-recovery:${getClientIp(req)}`, RECOVERY_LIMIT);

    const redirectTo = getTrustedRecoveryRedirect(forwardedHost(req));
    const db = createServerSupabase({ req, res });
    const { error } = await db.auth.resetPasswordForEmail(req.body.email.trim().toLowerCase(), { redirectTo });
    if (error) return genericResponse(res);
  } catch {
    // Deliberately do not log raw email, IP, recovery state, or provider details.
    // A generic 200 response prevents both account enumeration and rate-limit probing.
  }

  return genericResponse(res);
}
