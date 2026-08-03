import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  maybeSingle: vi.fn(),
  rpc: vi.fn(),
  checkRateLimit: vi.fn(),
}));

vi.mock('@/lib/db/client', () => ({
  createAdminSupabase: () => ({
    from: () => ({
      select: () => ({
        eq: () => ({ maybeSingle: mocks.maybeSingle }),
      }),
    }),
    rpc: mocks.rpc,
  }),
}));

vi.mock('@/lib/security/rate-limit', () => ({
  checkPostgresRateLimit: mocks.checkRateLimit,
}));

import handler from '@/pages/api/hat-mam/dang-ky';

function createResponse() {
  const response = {
    setHeader: vi.fn(),
    status: vi.fn(),
    json: vi.fn(),
  };
  response.status.mockReturnValue(response);
  return response;
}

describe('B10 Hạt Mầm public-release gate', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.maybeSingle.mockResolvedValue({
      data: {
        public_activation_enabled: false,
        deletion_workflow_ready: false,
        private_storage_ready: false,
      },
      error: null,
    });
  });

  it('rejects before validation, rate-limit, or RPC when child-data gates are off', async () => {
    const response = createResponse();
    await handler({
      method: 'POST',
      headers: { 'idempotency-key': 'audit-key' },
      socket: { remoteAddress: '127.0.0.1' },
      body: {
        package_code: 'HM-01',
        parent_name: 'Parent Audit',
        parent_contact: 'parent@example.test',
        child_name: 'Child Audit',
        birth_date: '2020-01-01',
        birth_time_known: false,
        parent_question: 'Question',
        consent_version: 'hatmam-parent-intake-v1',
        consent: true,
      },
    } as any, response as any);

    expect(response.status).toHaveBeenCalledWith(404);
    expect(response.json).toHaveBeenCalledWith(expect.objectContaining({ ok: false }));
    expect(JSON.stringify(response.json.mock.calls)).not.toContain('Child Audit');
    expect(mocks.checkRateLimit).not.toHaveBeenCalled();
    expect(mocks.rpc).not.toHaveBeenCalled();
  });
});
