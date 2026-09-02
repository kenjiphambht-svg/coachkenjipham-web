import { createClient } from '@supabase/supabase-js';
import type { AdvisoryRpcClient } from './intake';

const URL_ENV = 'SUPABASE_URL';
const SERVICE_ROLE_ENV = 'SUPABASE_SERVICE_ROLE_KEY';

export function createAdvisoryIntakeRpcClient(): AdvisoryRpcClient {
  const url = process.env[URL_ENV];
  const serviceRoleKey = process.env[SERVICE_ROLE_ENV];
  if (!url) throw new Error('ADVISORY_SUPABASE_URL_MISSING');
  if (!serviceRoleKey) throw new Error('ADVISORY_SERVICE_ROLE_KEY_MISSING');

  return createClient(url, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
    global: {
      headers: {
        'x-essence-runtime': 'advisory-intake-server',
      },
    },
  });
}
