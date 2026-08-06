/**
 * WP3.5-A2 — Founder Review server-side Preview guard
 *
 * WO §8.3 "Preview gate": a single non-secret flag, checked server-side
 * only, with no bypass of any kind.
 *
 *   FOUNDER_REVIEW_ENABLED=1
 *
 * The decision is based on exactly one condition:
 * `process.env.FOUNDER_REVIEW_ENABLED === '1'`. Nothing else — not
 * `NODE_ENV`, not Vercel's preview/development mode, not a client-side
 * flag or cookie — may enable or bypass it. Any value other than the exact
 * string `'1'` (absent, empty, `'0'`, `'true'`, `'yes'`, anything else)
 * disables it.
 *
 * This module has no Supabase, auth, provider or API dependency by design —
 * it is a pure environment check plus a thin Pages Router SSR wrapper.
 */

import type { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from 'next';

/** The exact, sole condition that enables the Founder Review preview. */
export function isFounderReviewEnabled(): boolean {
  return process.env.FOUNDER_REVIEW_ENABLED === '1';
}

export type FounderReviewGuardedHandler<P extends { [key: string]: any }> = (
  ctx: GetServerSidePropsContext
) => Promise<GetServerSidePropsResult<P>> | GetServerSidePropsResult<P>;

/**
 * Wraps a Pages Router `getServerSideProps`. When the flag is not exactly
 * `'1'`, the wrapped handler is never invoked and the guard returns
 * `{ notFound: true }` directly — the route renders Next's standard 404,
 * with no distinguishing signal about why. When enabled, the provided
 * handler runs normally; if no handler is supplied, an empty props object
 * is returned.
 *
 * The `{ [key: string]: any }` bound mirrors Next's own `GetServerSideProps`
 * constraint (not `unknown`) — a plain named-field props interface like
 * `{ scenario: ScenarioPreset }` does not structurally satisfy an `unknown`
 * index signature, but does satisfy Next's own looser `any` one.
 */
export function founderReviewGuard<P extends { [key: string]: any } = { [key: string]: never }>(
  handler?: FounderReviewGuardedHandler<P>
): GetServerSideProps<P> {
  return async (ctx) => {
    if (!isFounderReviewEnabled()) {
      return { notFound: true };
    }
    if (!handler) {
      return { props: {} as P };
    }
    return handler(ctx);
  };
}
