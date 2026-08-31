export type AcceptedAdvisoryIntakeResponse = {
  status: 'accepted';
  submissionId: string;
  replayed: boolean;
  receivedAt: string;
  acknowledgementState: 'pending';
};

export function isAcceptedAdvisoryIntakeResponse(
  httpStatus: number,
  responseOk: boolean,
  payload: unknown,
  expectedSubmissionId: string
): payload is AcceptedAdvisoryIntakeResponse {
  if (!responseOk || (httpStatus !== 200 && httpStatus !== 201)) return false;
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) return false;

  const result = payload as Record<string, unknown>;
  if (result.status !== 'accepted') return false;
  if (result.submissionId !== expectedSubmissionId) return false;
  if (result.acknowledgementState !== 'pending') return false;
  if (typeof result.replayed !== 'boolean') return false;
  if (typeof result.receivedAt !== 'string' || result.receivedAt.trim().length === 0) return false;

  if (httpStatus === 201 && result.replayed !== false) return false;
  if (httpStatus === 200 && result.replayed !== true) return false;

  return true;
}
