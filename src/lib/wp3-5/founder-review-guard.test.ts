import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import type { GetServerSidePropsContext } from 'next';

import { isFounderReviewEnabled, founderReviewGuard } from './founder-review-guard';

const ORIGINAL_ENV = { ...process.env };
const FLAG = 'FOUNDER_REVIEW_ENABLED';

function setFlag(value: string | undefined) {
  if (value === undefined) {
    delete process.env[FLAG];
  } else {
    process.env[FLAG] = value;
  }
}

const fakeCtx = {} as GetServerSidePropsContext;

beforeEach(() => {
  delete process.env[FLAG];
});

afterEach(() => {
  process.env = { ...ORIGINAL_ENV };
});

describe('1. exact `1` enables', () => {
  it('isFounderReviewEnabled is true only for the exact string "1"', () => {
    setFlag('1');
    expect(isFounderReviewEnabled()).toBe(true);
  });
});

describe('2. undefined disables', () => {
  it('isFounderReviewEnabled is false when the var is absent', () => {
    setFlag(undefined);
    expect(process.env[FLAG]).toBeUndefined();
    expect(isFounderReviewEnabled()).toBe(false);
  });
});

describe('3. empty disables', () => {
  it('isFounderReviewEnabled is false for an empty string', () => {
    setFlag('');
    expect(isFounderReviewEnabled()).toBe(false);
  });
});

describe('4. `0` disables', () => {
  it('isFounderReviewEnabled is false for "0"', () => {
    setFlag('0');
    expect(isFounderReviewEnabled()).toBe(false);
  });
});

describe('5. `true` disables', () => {
  it('isFounderReviewEnabled is false for the string "true"', () => {
    setFlag('true');
    expect(isFounderReviewEnabled()).toBe(false);
  });
});

describe('6. `yes` disables', () => {
  it('isFounderReviewEnabled is false for "yes"', () => {
    setFlag('yes');
    expect(isFounderReviewEnabled()).toBe(false);
  });
});

describe('7. NODE_ENV does not bypass', () => {
  it('remains disabled regardless of NODE_ENV, with the flag absent or any non-"1" value', () => {
    const originalNodeEnv = process.env.NODE_ENV;

    setFlag(undefined);
    (process.env as Record<string, string | undefined>).NODE_ENV = 'development';
    expect(isFounderReviewEnabled()).toBe(false);

    (process.env as Record<string, string | undefined>).NODE_ENV = 'production';
    setFlag('true');
    expect(isFounderReviewEnabled()).toBe(false);

    (process.env as Record<string, string | undefined>).NODE_ENV = 'test';
    setFlag('yes');
    expect(isFounderReviewEnabled()).toBe(false);

    (process.env as Record<string, string | undefined>).NODE_ENV = originalNodeEnv;
  });
});

describe('8. guard returns notFound when disabled', () => {
  it('founderReviewGuard short-circuits to notFound: true without invoking the handler', async () => {
    setFlag(undefined);
    let handlerCalled = false;
    const guarded = founderReviewGuard(async () => {
      handlerCalled = true;
      return { props: {} };
    });

    const result = await guarded(fakeCtx);
    expect(result).toEqual({ notFound: true });
    expect(handlerCalled).toBe(false);
  });

  it('founderReviewGuard invokes the handler only when the flag is exactly "1"', async () => {
    setFlag('1');
    let handlerCalled = false;
    const guarded = founderReviewGuard(async () => {
      handlerCalled = true;
      return { props: { ok: true } };
    });

    const result = await guarded(fakeCtx);
    expect(handlerCalled).toBe(true);
    expect(result).toEqual({ props: { ok: true } });
  });

  it('founderReviewGuard with no handler returns empty props when enabled', async () => {
    setFlag('1');
    const guarded = founderReviewGuard();
    const result = await guarded(fakeCtx);
    expect(result).toEqual({ props: {} });
  });
});
