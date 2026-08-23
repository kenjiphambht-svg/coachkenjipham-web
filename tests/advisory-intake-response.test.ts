import { describe, expect, it } from 'vitest';
import { isAcceptedAdvisoryIntakeResponse } from '../src/lib/advisory/intake-response';

const SUBMISSION_ID = '11111111-1111-4111-8111-111111111111';
const RECEIVED_AT = '2026-08-23T11:11:00.000Z';

function acceptedPayload(replayed: boolean) {
  return {
    status: 'accepted',
    submissionId: SUBMISSION_ID,
    replayed,
    receivedAt: RECEIVED_AT,
    acknowledgementState: 'pending',
  };
}

describe('advisory intake frontend acceptance contract', () => {
  it('accepts a new durable 201 intake', () => {
    expect(
      isAcceptedAdvisoryIntakeResponse(201, true, acceptedPayload(false), SUBMISSION_ID)
    ).toBe(true);
  });

  it('accepts a 200 same-submission idempotent replay', () => {
    expect(
      isAcceptedAdvisoryIntakeResponse(200, true, acceptedPayload(true), SUBMISSION_ID)
    ).toBe(true);
  });

  it('rejects non-2xx even when the body resembles an accepted response', () => {
    expect(
      isAcceptedAdvisoryIntakeResponse(503, false, acceptedPayload(false), SUBMISSION_ID)
    ).toBe(false);
  });

  it('rejects malformed or contract-mismatched success bodies', () => {
    const malformed = [
      null,
      {},
      { ...acceptedPayload(false), status: 'queued' },
      { ...acceptedPayload(false), submissionId: '22222222-2222-4222-8222-222222222222' },
      { ...acceptedPayload(false), acknowledgementState: 'sent' },
      { ...acceptedPayload(false), replayed: 'false' },
      { ...acceptedPayload(false), receivedAt: '' },
    ];

    for (const payload of malformed) {
      expect(isAcceptedAdvisoryIntakeResponse(201, true, payload, SUBMISSION_ID)).toBe(false);
    }
  });

  it('requires status-code and replay semantics to agree', () => {
    expect(
      isAcceptedAdvisoryIntakeResponse(201, true, acceptedPayload(true), SUBMISSION_ID)
    ).toBe(false);
    expect(
      isAcceptedAdvisoryIntakeResponse(200, true, acceptedPayload(false), SUBMISSION_ID)
    ).toBe(false);
  });
});
