import { describe, expect, it } from 'vitest';
import {
  AdvisoryRegistrationError,
  AdvisoryValidationError,
  normalizeAdvisoryEmail,
  registerAdvisoryIntake,
  validateAdvisoryIntakePayload,
  type AdvisoryRpcClient,
} from '../src/lib/advisory/intake';

const VALID = {
  submission_id: '11111111-1111-4111-8111-111111111111',
  role_org_context: 'Founder tại một doanh nghiệp dịch vụ.',
  business_problem: 'Quy trình ra quyết định đang phân tán.',
  ai_current_state: 'Đã thử một số công cụ nhưng chưa có hệ thống.',
  why_now: 'Cần chuẩn hoá trước giai đoạn tăng trưởng tiếp theo.',
  contact_name: 'Nguyen Van A',
  contact_email: ' Founder@Example.COM ',
};

describe('advisory intake validation', () => {
  it('normalizes only trim + lowercase for email', () => {
    expect(normalizeAdvisoryEmail(' Founder+Ops@Example.COM ')).toBe(
      'founder+ops@example.com'
    );
  });

  it('accepts the locked six customer fields plus submission id', () => {
    const parsed = validateAdvisoryIntakePayload(VALID);
    expect(parsed.contact_email).toBe('founder@example.com');
    expect(parsed.contact_name).toBe('Nguyen Van A');
    expect(parsed.submission_id).toBe(VALID.submission_id);
  });

  it('fails closed when a required context field is absent', () => {
    expect(() =>
      validateAdvisoryIntakePayload({ ...VALID, business_problem: '' })
    ).toThrowError(AdvisoryValidationError);
  });

  it('rejects malformed email', () => {
    expect(() =>
      validateAdvisoryIntakePayload({ ...VALID, contact_email: 'not-an-email' })
    ).toThrowError('ADVISORY_CONTACT_EMAIL_INVALID');
  });

  it('rejects malformed submission id', () => {
    expect(() =>
      validateAdvisoryIntakePayload({ ...VALID, submission_id: 'retry-1' })
    ).toThrowError('ADVISORY_SUBMISSION_ID_INVALID');
  });
});

describe('advisory intake RPC contract', () => {
  it('maps a durable new registration without exposing payload transformation', async () => {
    const calls: Array<{ name: string; args: Record<string, unknown> }> = [];
    const client: AdvisoryRpcClient = {
      rpc: async (name, args) => {
        calls.push({ name, args });
        return {
          data: [
            {
              lead_id: '22222222-2222-4222-8222-222222222222',
              intake_event_id: '33333333-3333-4333-8333-333333333333',
              submission_id: VALID.submission_id,
              replayed: false,
              received_at: '2026-08-23T08:15:00.000Z',
            },
          ],
          error: null,
        };
      },
    };

    const payload = validateAdvisoryIntakePayload(VALID);
    const result = await registerAdvisoryIntake(client, payload);

    expect(calls).toHaveLength(1);
    expect(calls[0].name).toBe('advisory_intake_register');
    expect(calls[0].args.p_contact_email).toBe('founder@example.com');
    expect(result.replayed).toBe(false);
    expect(result.submissionId).toBe(VALID.submission_id);
  });

  it('preserves idempotent replay evidence returned by the database', async () => {
    const client: AdvisoryRpcClient = {
      rpc: async () => ({
        data: [
          {
            lead_id: '22222222-2222-4222-8222-222222222222',
            intake_event_id: '33333333-3333-4333-8333-333333333333',
            submission_id: VALID.submission_id,
            replayed: true,
            received_at: '2026-08-23T08:15:00.000Z',
          },
        ],
        error: null,
      }),
    };

    const result = await registerAdvisoryIntake(
      client,
      validateAdvisoryIntakePayload(VALID)
    );
    expect(result.replayed).toBe(true);
  });

  it('maps conflicting submission reuse to HTTP 409 semantics', async () => {
    const client: AdvisoryRpcClient = {
      rpc: async () => ({
        data: null,
        error: { message: 'ADVISORY_SUBMISSION_CONFLICT' },
      }),
    };

    await expect(
      registerAdvisoryIntake(client, validateAdvisoryIntakePayload(VALID))
    ).rejects.toMatchObject<Partial<AdvisoryRegistrationError>>({
      code: 'ADVISORY_SUBMISSION_CONFLICT',
      httpStatus: 409,
    });
  });

  it('fails closed on malformed database response', async () => {
    const client: AdvisoryRpcClient = {
      rpc: async () => ({ data: [], error: null }),
    };

    await expect(
      registerAdvisoryIntake(client, validateAdvisoryIntakePayload(VALID))
    ).rejects.toMatchObject<Partial<AdvisoryRegistrationError>>({
      code: 'ADVISORY_INTAKE_INVALID_RESPONSE',
      httpStatus: 503,
    });
  });
});
