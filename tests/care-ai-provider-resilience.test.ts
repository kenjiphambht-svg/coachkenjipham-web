import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  careModelFailureDecision,
  runCareModel,
  safeCareModelFailureDiagnostic,
  type CareModelDecision,
  type CareModelRequest,
} from '../src/lib/care-ai/provider-neutral-model';

const decision: CareModelDecision = {
  family: 'UNKNOWN',
  truthStatus: 'BOUNDED',
  nextBestCare: 'ANSWER',
  commercialReadiness: 'EXPLORE',
  memoryDecision: 'DO_NOT_WRITE',
  handoffRequired: false,
  reply: 'Mình có thể bắt đầu từ điều cần làm rõ nhất.',
};

const request: CareModelRequest = {
  config: { provider: 'google_gemini', model: 'gemini-test', apiKey: 'secret-value', timeoutMs: 2000 },
  channel: 'facebook_messenger',
  turns: ['Một câu test.'],
};

function geminiOk() {
  return new Response(
    JSON.stringify({ candidates: [{ content: { parts: [{ text: JSON.stringify(decision) }] } }] }),
    { status: 200, headers: { 'Content-Type': 'application/json' } },
  );
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe('Care AI provider resilience', () => {
  it('retries one transient Gemini rate-limit failure then succeeds without leaking provider body', async () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const fetchSpy = vi.spyOn(globalThis, 'fetch');
    fetchSpy
      .mockResolvedValueOnce(new Response(
        JSON.stringify({ error: { status: 'RATE_LIMIT_EXCEEDED', message: 'PRIVATE-UPSTREAM-DETAIL' } }),
        { status: 429, headers: { 'Content-Type': 'application/json', 'Retry-After': '0' } },
      ))
      .mockResolvedValueOnce(geminiOk());

    const result = await runCareModel(request);

    expect(result.reply).toContain('bắt đầu');
    expect(fetchSpy).toHaveBeenCalledTimes(2);
    expect(warn).toHaveBeenCalledWith('CARE_MODEL_PROVIDER_RETRY', expect.objectContaining({
      provider: 'google_gemini',
      model: 'gemini-test',
      httpStatus: 429,
      providerCode: 'RATE_LIMIT_EXCEEDED',
      classification: 'RATE_LIMIT',
      retryable: true,
      attempts: 1,
      safeErrorCode: 'CARE_MODEL_HTTP_429',
    }));
    expect(JSON.stringify(warn.mock.calls)).not.toContain('PRIVATE-UPSTREAM-DETAIL');
    expect(JSON.stringify(warn.mock.calls)).not.toContain('secret-value');
    expect(JSON.stringify(warn.mock.calls)).not.toContain('Một câu test');
  });

  it('does not retry a daily quota classification and exposes only safe machine diagnostics', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(
      JSON.stringify({ error: { status: 'QUOTA_EXCEEDED', message: 'quota message must not escape' } }),
      { status: 429, headers: { 'Content-Type': 'application/json' } },
    ));

    let caught: unknown;
    try {
      await runCareModel(request);
    } catch (error) {
      caught = error;
    }

    expect(fetchSpy).toHaveBeenCalledOnce();
    const diagnostic = safeCareModelFailureDiagnostic(caught, request.config);
    expect(diagnostic).toEqual({
      provider: 'google_gemini',
      model: 'gemini-test',
      httpStatus: 429,
      providerCode: 'QUOTA_EXCEEDED',
      classification: 'QUOTA',
      retryable: false,
      attempts: 1,
      safeErrorCode: 'CARE_MODEL_HTTP_429',
    });
    expect(JSON.stringify(diagnostic)).not.toContain('quota message must not escape');
  });

  it('does not retry permanent permission errors', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(
      JSON.stringify({ error: { status: 'PERMISSION_DENIED', message: 'private permission detail' } }),
      { status: 403, headers: { 'Content-Type': 'application/json' } },
    ));

    let caught: unknown;
    try {
      await runCareModel(request);
    } catch (error) {
      caught = error;
    }

    expect(fetchSpy).toHaveBeenCalledOnce();
    expect(safeCareModelFailureDiagnostic(caught, request.config)).toMatchObject({
      httpStatus: 403,
      providerCode: 'PERMISSION_DENIED',
      classification: 'PERMISSION',
      retryable: false,
      attempts: 1,
    });
  });

  it('caps transport retry at one retry and keeps runtime exception text private', async () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockRejectedValue(new TypeError('PRIVATE-NETWORK-DETAIL'));

    let caught: unknown;
    try {
      await runCareModel(request);
    } catch (error) {
      caught = error;
    }

    expect(fetchSpy).toHaveBeenCalledTimes(2);
    const diagnostic = safeCareModelFailureDiagnostic(caught, request.config);
    expect(diagnostic).toMatchObject({
      classification: 'TRANSPORT',
      retryable: true,
      attempts: 2,
      safeErrorCode: 'CARE_MODEL_FETCH_TYPE_ERROR',
    });
    expect(JSON.stringify(diagnostic)).not.toContain('PRIVATE-NETWORK-DETAIL');
    expect(JSON.stringify(warn.mock.calls)).not.toContain('PRIVATE-NETWORK-DETAIL');
  });

  it('uses a deterministic customer-safe degraded reply when the model is unavailable', () => {
    const fallback = careModelFailureDecision('facebook_messenger');
    expect(fallback).toMatchObject({
      family: 'UNKNOWN',
      truthStatus: 'UNKNOWN',
      nextBestCare: 'WAIT',
      commercialReadiness: 'WAIT',
      memoryDecision: 'DO_NOT_WRITE',
      handoffRequired: false,
    });
    expect(fallback.reply).toMatch(/chưa thể xử lý/i);
    expect(fallback.reply).not.toMatch(/đã chuyển|bộ phận|Kenji|đã ghi nhận|đã xử lý|đặt lịch|thanh toán/i);
  });
});
