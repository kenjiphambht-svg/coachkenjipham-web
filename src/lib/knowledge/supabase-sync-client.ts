import { createClient } from '@supabase/supabase-js';
import type { KnowledgeSyncRpcClient } from './supabase-sync-repository';

const URL_ENV = 'NEXT_PUBLIC_SUPABASE_URL';
const SERVICE_ROLE_ENV = 'SUPABASE_SERVICE_ROLE_KEY';

export function createKnowledgeSyncRpcClient(): KnowledgeSyncRpcClient {
  const url = process.env[URL_ENV];
  const serviceRoleKey = process.env[SERVICE_ROLE_ENV];
  if (!url) throw new Error('KNOWLEDGE_SYNC_SUPABASE_URL_MISSING');
  if (!serviceRoleKey) throw new Error('KNOWLEDGE_SYNC_SERVICE_ROLE_KEY_MISSING');

  const client = createClient(url, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
    global: {
      headers: {
        'x-essence-runtime': 'm2b-server-sync',
      },
    },
  });

  return client;
}
