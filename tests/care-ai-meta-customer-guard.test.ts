import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { createD1MetaCustomerGuardStore, type MetaD1Database } from '../src/lib/care-ai/meta-channel';

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
