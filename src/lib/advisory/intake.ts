export const ADVISORY_MAX_BODY_BYTES = 64 * 1024;

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_CONTEXT_LENGTH = 12_000;
const MAX_NAME_LENGTH = 200;
const MAX_EMAIL_LENGTH = 320;

export type AdvisoryIntakePayload = {
  submission_id: string;
  role_org_context: string;
  business_problem: string;
  ai_current_state: string;
  why_now: string;
  contact_name: string;
  contact_email: string;
};

export type AdvisoryIntakeRegistration = {
  leadId: string;
  intakeEventId: string;
  submissionId: string;
  replayed: boolean;
  receivedAt: string;
};

export type AdvisoryRpcError = {
  message: string;
  code?: string;
};

export type AdvisoryRpcClient = {
  rpc(
    functionName: string,
    args: Record<string, unknown>
  ): PromiseLike<{ data: unknown; error: AdvisoryRpcError | null }>;
};

export class AdvisoryValidationError extends Error {
  constructor(public readonly code: string) {
    super(code);
    this.name = 'AdvisoryValidationError';
  }
}

export class AdvisoryRegistrationError extends Error {
  constructor(
    public readonly code: string,
    public readonly httpStatus: number
  ) {
    super(code);
    this.name = 'AdvisoryRegistrationError';
  }
}

function requiredTrimmedString(
  input: Record<string, unknown>,
  key: keyof AdvisoryIntakePayload,
  maxLength: number
): string {
  const raw = input[key];
  if (typeof raw !== 'string') {
    throw new AdvisoryValidationError(`ADVISORY_${key.toUpperCase()}_REQUIRED`);
  }
  const value = raw.trim();
  if (value.length < 1 || value.length > maxLength) {
    throw new AdvisoryValidationError(`ADVISORY_${key.toUpperCase()}_INVALID`);
  }
  return value;
}

export function normalizeAdvisoryEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function validateAdvisoryIntakePayload(input: unknown): AdvisoryIntakePayload {
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    throw new AdvisoryValidationError('ADVISORY_BODY_INVALID');
  }

  const body = input as Record<string, unknown>;
  const submissionId = requiredTrimmedString(body, 'submission_id', 64);
  if (!UUID_RE.test(submissionId)) {
    throw new AdvisoryValidationError('ADVISORY_SUBMISSION_ID_INVALID');
  }

  const contactName = requiredTrimmedString(body, 'contact_name', MAX_NAME_LENGTH);
  const contactEmail = normalizeAdvisoryEmail(
    requiredTrimmedString(body, 'contact_email', MAX_EMAIL_LENGTH)
  );
  if (!EMAIL_RE.test(contactEmail)) {
    throw new AdvisoryValidationError('ADVISORY_CONTACT_EMAIL_INVALID');
  }

  return {
    submission_id: submissionId,
    role_org_context: requiredTrimmedString(body, 'role_org_context', MAX_CONTEXT_LENGTH),
    business_problem: requiredTrimmedString(body, 'business_problem', MAX_CONTEXT_LENGTH),
    ai_current_state: requiredTrimmedString(body, 'ai_current_state', MAX_CONTEXT_LENGTH),
    why_now: requiredTrimmedString(body, 'why_now', MAX_CONTEXT_LENGTH),
    contact_name: contactName,
    contact_email: contactEmail,
  };
}

function safeRpcCode(error: AdvisoryRpcError): string {
  const message = error.message ?? '';
  if (message.includes('ADVISORY_SUBMISSION_CONFLICT')) {
    return 'ADVISORY_SUBMISSION_CONFLICT';
  }
  if (message.includes('ADVISORY_CONTACT_EMAIL_INVALID')) {
    return 'ADVISORY_CONTACT_EMAIL_INVALID';
  }
  if (message.includes('ADVISORY_CONTEXT_INVALID')) {
    return 'ADVISORY_CONTEXT_INVALID';
  }
  if (message.includes('ADVISORY_CONTACT_NAME_INVALID')) {
    return 'ADVISORY_CONTACT_NAME_INVALID';
  }
  return 'ADVISORY_INTAKE_UNAVAILABLE';
}

function rpcStatus(code: string): number {
  if (code === 'ADVISORY_SUBMISSION_CONFLICT') return 409;
  if (
    code === 'ADVISORY_CONTACT_EMAIL_INVALID' ||
    code === 'ADVISORY_CONTEXT_INVALID' ||
    code === 'ADVISORY_CONTACT_NAME_INVALID'
  ) {
    return 400;
  }
  return 503;
}

export async function registerAdvisoryIntake(
  client: AdvisoryRpcClient,
  payload: AdvisoryIntakePayload
): Promise<AdvisoryIntakeRegistration> {
  const { data, error } = await client.rpc('advisory_intake_register', {
    p_submission_id: payload.submission_id,
    p_role_org_context: payload.role_org_context,
    p_business_problem: payload.business_problem,
    p_ai_current_state: payload.ai_current_state,
    p_why_now: payload.why_now,
    p_contact_name: payload.contact_name,
    p_contact_email: payload.contact_email,
  });

  if (error) {
    const code = safeRpcCode(error);
    throw new AdvisoryRegistrationError(code, rpcStatus(code));
  }

  const row = Array.isArray(data) ? data[0] : data;
  if (!row || typeof row !== 'object') {
    throw new AdvisoryRegistrationError('ADVISORY_INTAKE_INVALID_RESPONSE', 503);
  }

  const result = row as Record<string, unknown>;
  if (
    typeof result.lead_id !== 'string' ||
    typeof result.intake_event_id !== 'string' ||
    typeof result.submission_id !== 'string' ||
    typeof result.replayed !== 'boolean' ||
    typeof result.received_at !== 'string'
  ) {
    throw new AdvisoryRegistrationError('ADVISORY_INTAKE_INVALID_RESPONSE', 503);
  }

  return {
    leadId: result.lead_id,
    intakeEventId: result.intake_event_id,
    submissionId: result.submission_id,
    replayed: result.replayed,
    receivedAt: result.received_at,
  };
}
