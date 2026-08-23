import { NextRequest, NextResponse } from 'next/server';
import {
  ADVISORY_MAX_BODY_BYTES,
  AdvisoryRegistrationError,
  AdvisoryValidationError,
  registerAdvisoryIntake,
  validateAdvisoryIntakePayload,
} from '@/lib/advisory/intake';
import { createAdvisoryIntakeRpcClient } from '@/lib/advisory/supabase-intake-client';

export const dynamic = 'force-dynamic';

function json(
  body: Record<string, unknown>,
  status: number
): NextResponse {
  return NextResponse.json(body, {
    status,
    headers: {
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff',
    },
  });
}

export async function POST(request: NextRequest) {
  const contentType = request.headers.get('content-type') ?? '';
  if (!contentType.toLowerCase().startsWith('application/json')) {
    return json({ status: 'invalid_request', errorCode: 'ADVISORY_JSON_REQUIRED' }, 415);
  }

  const contentLength = Number(request.headers.get('content-length') ?? '0');
  if (Number.isFinite(contentLength) && contentLength > ADVISORY_MAX_BODY_BYTES) {
    return json({ status: 'invalid_request', errorCode: 'ADVISORY_BODY_TOO_LARGE' }, 413);
  }

  let rawBody: unknown;
  try {
    rawBody = await request.json();
  } catch {
    return json({ status: 'invalid_request', errorCode: 'ADVISORY_BODY_INVALID' }, 400);
  }

  try {
    const payload = validateAdvisoryIntakePayload(rawBody);
    const result = await registerAdvisoryIntake(createAdvisoryIntakeRpcClient(), payload);

    // The public response intentionally excludes canonical lead/intake IDs and
    // submitted context. P04 only needs durable acceptance/replay evidence.
    return json(
      {
        status: 'accepted',
        submissionId: result.submissionId,
        replayed: result.replayed,
        receivedAt: result.receivedAt,
        acknowledgementState: 'pending',
      },
      result.replayed ? 200 : 201
    );
  } catch (error) {
    if (error instanceof AdvisoryValidationError) {
      return json({ status: 'invalid_request', errorCode: error.code }, 400);
    }
    if (error instanceof AdvisoryRegistrationError) {
      return json({ status: 'not_accepted', errorCode: error.code }, error.httpStatus);
    }

    const code =
      error instanceof Error && /^ADVISORY_[A-Z0-9_]+$/.test(error.message)
        ? error.message
        : 'ADVISORY_INTAKE_UNAVAILABLE';
    console.warn(`[ADVISORY_INTAKE] errorCode=${code}`);
    return json({ status: 'not_accepted', errorCode: 'ADVISORY_INTAKE_UNAVAILABLE' }, 503);
  }
}
