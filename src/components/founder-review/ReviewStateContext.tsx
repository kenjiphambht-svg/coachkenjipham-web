// ============================================================
// Local-only simulated review interaction state — WP3.5-A2 Package C3.
//
// Everything here lives in React memory only (useReducer). There is no
// localStorage, sessionStorage, cookie, IndexedDB, network request or API
// call anywhere in this module. A page reload discards all of it, because
// nothing is ever written outside the React tree.
//
// `reviewOverlayReducer` is exported as a plain, dependency-free pure
// function specifically so it can be unit-tested directly without a DOM
// (this repo has no jsdom/happy-dom installed and this task may not add
// one) — see ReviewStateContext usage in TodayReview.test.tsx.
//
// The overlay is keyed by synthetic item id (a Today Queue id, a
// Relationship id, or any other canonical id) and is strictly additive
// local state — it never writes back into the imported canonical universe
// objects from review-manifest.ts / review-universe.ts.
// ============================================================

// `React` is imported explicitly for the same reason documented at the top
// of TodayReview.tsx — required for Vitest's esbuild JSX transform (this
// file's ReviewStateProvider returns JSX).
import React, { createContext, useContext, useReducer, type Dispatch, type ReactNode } from 'react';

export const SIMULATED_ACTION_TYPES = [
  'mark_reviewed',
  'defer',
  'acknowledge',
  'keep_silence',
  'request_founder_decision',
] as const;

export type SimulatedActionType = (typeof SIMULATED_ACTION_TYPES)[number];

export const SIMULATED_ACTION_LABEL: Readonly<Record<SimulatedActionType, string>> = {
  mark_reviewed: 'Đánh dấu đã xem',
  defer: 'Giữ lại',
  acknowledge: 'Ghi nhận',
  keep_silence: 'Giữ yên (mô phỏng)',
  request_founder_decision: 'Yêu cầu Founder quyết định',
};

export interface OverlayEntry {
  readonly actions: readonly SimulatedActionType[];
  readonly lastAction: SimulatedActionType;
}

export type ReviewOverlayState = Readonly<Record<string, OverlayEntry>>;

export type ReviewOverlayAction =
  | { readonly type: 'APPLY_ACTION'; readonly itemId: string; readonly action: SimulatedActionType }
  | { readonly type: 'RESET' };

export const INITIAL_REVIEW_OVERLAY_STATE: ReviewOverlayState = {};

/** Pure reducer — no DOM, no I/O, no mutation of its input. */
export function reviewOverlayReducer(state: ReviewOverlayState, action: ReviewOverlayAction): ReviewOverlayState {
  switch (action.type) {
    case 'APPLY_ACTION': {
      const previous = state[action.itemId];
      const actions = previous ? [...previous.actions, action.action] : [action.action];
      return { ...state, [action.itemId]: { actions, lastAction: action.action } };
    }
    case 'RESET':
      return INITIAL_REVIEW_OVERLAY_STATE;
    default:
      return state;
  }
}

export function getOverlayForItem(state: ReviewOverlayState, itemId: string): OverlayEntry | undefined {
  return state[itemId];
}

interface ReviewStateContextValue {
  readonly state: ReviewOverlayState;
  readonly dispatch: Dispatch<ReviewOverlayAction>;
}

const ReviewStateReactContext = createContext<ReviewStateContextValue | undefined>(undefined);

export function ReviewStateProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reviewOverlayReducer, INITIAL_REVIEW_OVERLAY_STATE);
  return <ReviewStateReactContext.Provider value={{ state, dispatch }}>{children}</ReviewStateReactContext.Provider>;
}

export function useReviewState(): ReviewStateContextValue {
  const ctx = useContext(ReviewStateReactContext);
  if (!ctx) {
    throw new Error('useReviewState must be used within a ReviewStateProvider');
  }
  return ctx;
}
