import { NextResponse } from 'next/server';
import { createKnowledgeSyncRpcClient } from '@/lib/knowledge/supabase-sync-client';

export const dynamic = 'force-dynamic';

const PROBE_CONNECTOR_KEY = '__cloudflare_portability_readonly__';

export async function GET() {
  if (process.env.CLOUDFLARE_PORTABILITY_PROOF !== '1') {
    return NextResponse.json({ status: 'not_found' }, { status: 404 });
  }

  const env = {
    supabaseUrl: Boolean(process.env.SUPABASE_URL),
    supabaseServiceRoleKey: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY),
  };

  if (!env.supabaseUrl || !env.supabaseServiceRoleKey) {
    return NextResponse.json(
      { status: 'FAIL', runtime: 'cloudflare-workers', env, supabaseReadOnlyRpc: false },
      { status: 503 }
    );
  }

  try {
    const client = createKnowledgeSyncRpcClient();
    const { error } = await client.rpc('knowledge_sync_get_checkpoint', {
      p_connector_key: PROBE_CONNECTOR_KEY,
    });

    if (error) {
      return NextResponse.json(
        { status: 'FAIL', runtime: 'cloudflare-workers', env, supabaseReadOnlyRpc: false },
        { status: 503 }
      );
    }

    return NextResponse.json({
      status: 'PASS',
      runtime: 'cloudflare-workers',
      env,
      supabaseReadOnlyRpc: true,
      mutationPerformed: false,
    });
  } catch {
    return NextResponse.json(
      { status: 'FAIL', runtime: 'cloudflare-workers', env, supabaseReadOnlyRpc: false },
      { status: 503 }
    );
  }
}
