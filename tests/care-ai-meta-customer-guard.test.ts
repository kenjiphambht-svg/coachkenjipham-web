import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { createD1MetaCustomerGuardStore, type MetaD1Database } from '../src/lib/care-ai/meta-channel';
import {
  careModelFailureDecision,
  runCareModel,
  safeCareModelFailureDiagnostic,
  type CareModelDecision,
  type CareModelRequest,
} from '../src/lib/care-ai/provider-neutral-model';

afterEach(() => vi.restoreAllMocks());

describe('Care AI Meta customer guard', () => {
  it('uses one atomic D1 counter row with a hashed scope and blocks when the limit is exhausted', async () => {
    let sql = '';
    let bindings: unknown[] = [];
    let nextResult: { count: number } | null = { count: 1 };
    const db: MetaD1Database = {
      prepare(query) {
        sql = query;
        const statement = {
          bind(...values: unknown[]) {
            bindings = values;
            return statement;
          },
          async first<T>() {
            return nextResult as T | null;
          },
        };
        return statement;
      },
    };

    const store = createD1MetaCustomerGuardStore(db);
    const allowed = await store.claim({ scope: 'sender:PAGE-1:PSID-SECRET', limit: 12, windowSeconds: 600, nowMs: 1000 });
    expect(allowed).toEqual({ allowed: true, count: 1 });
    expect(sql).toContain('care_meta_customer_rate_limits');
    expect(sql).toContain('ON CONFLICT(scope_key)');
    expect(sql).toContain('RETURNING count');
    expect(String(bindings[0])).not.toContain('PSID-SECRET');
    expect(String(bindings[0])).toMatch(/^[a-f0-9]{64}$/);
    expect(JSON.stringify(bindings)).not.toContain('PSID-SECRET');

    nextResult = null;
    await expect(store.claim({ scope: 'sender:PAGE-1:PSID-SECRET', limit: 12, windowSeconds: 600, nowMs: 2000 })).resolves.toEqual({ allowed: false });
  });

  it('fails closed on invalid customer-rate configuration', async () => {
    const db: MetaD1Database = {
      prepare() {
        throw new Error('should not reach D1');
      },
    };
    const store = createD1MetaCustomerGuardStore(db);
    await expect(store.claim({ scope: '', limit: 1, windowSeconds: 10 })).rejects.toThrow('CARE_META_CUSTOMER_RATE_SCOPE_REQUIRED');
    await expect(store.claim({ scope: 'x', limit: 0, windowSeconds: 10 })).rejects.toThrow('CARE_META_CUSTOMER_RATE_LIMIT_INVALID');
    await expect(store.claim({ scope: 'x', limit: 1, windowSeconds: 5 })).rejects.toThrow('CARE_META_CUSTOMER_RATE_WINDOW_INVALID');
  });

  it('ships a D1 migration that stores only hashed scope keys and numeric counters', () => {
    const sql = readFileSync(resolve(process.cwd(), 'cloudflare/d1/20260901_p07_care_meta_customer_guard.sql'), 'utf8');
    expect(sql).toMatch(/create table if not exists care_meta_customer_rate_limits/i);
    expect(sql).toMatch(/scope_key text primary key/i);
    expect(sql).toMatch(/window_started_ms integer not null/i);
    expect(sql).toMatch(/count integer not null/i);
    expect(sql).toMatch(/expires_at_ms integer not null/i);
    expect(sql).not.toMatch(/psid|message_text|reply_text|access_token/i);
  });
});

const providerDecision: CareModelDecision = {
  family: 'UNKNOWN',
  truthStatus: 'BOUNDED',
  nextBestCare: 'ANSWER',
  commercialReadiness: 'EXPLORE',
  memoryDecision: 'DO_NOT_WRITE',
  handoffRequired: false,
  reply: 'Mình có thể bắt đầu từ điều cần làm rõ nhất.',
};

const providerRequest: CareModelRequest = {
  config: { provider: 'google_gemini', model: 'gemini-test', apiKey: 'secret-value', timeoutMs: 2000 },
  channel: 'facebook_messenger',
  turns: ['Một câu test.'],
};

function geminiOk(): Response {
  return new Response(
    JSON.stringify({ candidates: [{ content: { parts: [{ text: JSON.stringify(providerDecision) }] } }] }),
    { status: 200, headers: { 'Content-Type': 'application/json' } },
  );
}

describe('Care AI provider resilience regressions', () => {
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

    const result = await runCareModel(providerRequest);

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
      await runCareModel(providerRequest);
    } catch (error) {
      caught = error;
    }

    expect(fetchSpy).toHaveBeenCalledOnce();
    const diagnostic = safeCareModelFailureDiagnostic(caught, providerRequest.config);
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
      await runCareModel(providerRequest);
    } catch (error) {
      caught = error;
    }

    expect(fetchSpy).toHaveBeenCalledOnce();
    expect(safeCareModelFailureDiagnostic(caught, providerRequest.config)).toMatchObject({
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
      await runCareModel(providerRequest);
    } catch (error) {
      caught = error;
    }

    expect(fetchSpy).toHaveBeenCalledTimes(2);
    const diagnostic = safeCareModelFailureDiagnostic(caught, providerRequest.config);
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
