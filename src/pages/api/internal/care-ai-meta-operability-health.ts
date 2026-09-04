import { timingSafeEqual } from 'node:crypto';
import type { NextApiRequest, NextApiResponse } from 'next';
import { hydrateCareOperabilityProcessEnv } from '../../../lib/care-ai/care-operability-runtime-env';
import type { MetaD1Database } from '../../../lib/care-ai/meta-channel';
import {
  careOperabilityHealthDegraded,
  D1CareOperabilityStore,
  safeCareOperabilityErrorCode,
} from '../../../lib/care-ai/operability';

function enabled(): boolean {
  return process.env.CARE_META_OPERABILITY_HEALTH_ENABLED === 'true';
}

function boundedIntegerEnv(name: string, fallback: number, min: number, max: number): number {
  const raw = process.env[name];
  const value = raw ? Number(raw) : fallback;
  if (!Number.isInteger(value) || value < min || value > max) throw new Error(`${name}_INVALID`);
  return value;
}

function expectedHealthToken(): string {
  const value = process.env.CARE_META_OPERABILITY_HEALTH_TOKEN || '';
  if (value.length < 24 || value.length > 512) throw new Error('CARE_OPERABILITY_HEALTH_TOKEN_INVALID');
  return value;
}

function bearerToken(req: NextApiRequest): string | undefined {
  const raw = Array.isArray(req.headers.authorization) ? req.headers.authorization[0] : req.headers.authorization;
  const match = raw?.match(/^Bearer ([^\s]{1,512})$/);
  return match?.[1];
}

function tokenMatches(actual: string | undefined, expected: string): boolean {
  if (!actual) return false;
  const actualBuffer = Buffer.from(actual, 'utf8');
  const expectedBuffer = Buffer.from(expected, 'utf8');
  if (actualBuffer.length !== expectedBuffer.length) return false;
  return timingSafeEqual(actualBuffer, expectedBuffer);
}

async function metaD1Database(): Promise<MetaD1Database> {
  try {
    const { getCloudflareContext } = await import('@opennextjs/cloudflare');
    const { env } = await getCloudflareContext({ async: true });
    const db = (env as unknown as { CARE_META_IDEMPOTENCY_DB?: MetaD1Database }).CARE_META_IDEMPOTENCY_DB;
    if (!db) throw new Error('CARE_OPERABILITY_STORE_MISSING');
    return db;
  } catch (error) {
    if (error instanceof Error && error.message.startsWith('CARE_')) throw error;
    throw new Error('CARE_OPERABILITY_STORE_UNAVAILABLE');
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Content-Type-Options', 'nosniff');

  try {
    // OpenNext already exposes the authoritative Cloudflare request context. Mirror only
    // the bounded operability runtime bindings into process.env before reading gates.
    await hydrateCareOperabilityProcessEnv();

    if (!enabled()) return res.status(404).json({ status: 'disabled' });
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      return res.status(405).json({ status: 'method_not_allowed' });
    }

    const expectedToken = expectedHealthToken();
    if (!tokenMatches(bearerToken(req), expectedToken)) {
      if (req.method === 'HEAD') return res.status(404).end();
      return res.status(404).json({ status: 'not_found' });
    }

    const lookbackMs = boundedIntegerEnv('CARE_META_OPERABILITY_LOOKBACK_MS', 900_000, 60_000, 86_400_000);
    const pendingAgeMs = boundedIntegerEnv('CARE_META_OPERABILITY_PENDING_AGE_MS', 90_000, 10_000, 600_000);
    const store = new D1CareOperabilityStore(await metaD1Database());
    const health = await store.health({ lookbackMs, pendingAgeMs });
    const degraded = careOperabilityHealthDegraded(health);

    res.setHeader('X-Care-Operability', degraded ? 'degraded' : 'healthy');
    if (req.method === 'HEAD') return res.status(degraded ? 503 : 200).end();

    return res.status(degraded ? 503 : 200).json({
      status: degraded ? 'degraded' : 'healthy',
      reason: degraded ? 'CARE_OPERABILITY_RECENT_FAILURE_OR_PENDING_REPLY' : undefined,
    });
  } catch (error) {
    console.error('CARE_OPERABILITY_HEALTH_FAILURE', {
      safeErrorCode: safeCareOperabilityErrorCode(error),
    });
    res.setHeader('X-Care-Operability', 'unknown');
    if (req.method === 'HEAD') return res.status(503).end();
    return res.status(503).json({ status: 'unknown' });
  }
}
