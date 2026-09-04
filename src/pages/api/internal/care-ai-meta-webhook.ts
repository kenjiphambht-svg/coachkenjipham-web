import type { NextApiRequest, NextApiResponse } from 'next';
import { hydrateCareOperabilityProcessEnv } from '../../../lib/care-ai/care-operability-runtime-env';
import handler from './care-ai-meta-operability-wrapper';

export const config = { api: { bodyParser: false } };

export default async function careMetaWebhook(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Keep customer handling fail-open: if telemetry runtime-env hydration fails, the
    // existing router still handles the request and operability remains non-blocking.
    await hydrateCareOperabilityProcessEnv();
  } catch {
    console.error('CARE_OPERABILITY_RUNTIME_ENV_DEGRADED');
  }
  return handler(req, res);
}
