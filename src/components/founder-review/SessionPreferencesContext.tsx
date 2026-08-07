// ============================================================
// Founder Review session preferences — WP3.5-A2 clarity milestone.
//
// Local-only display preferences (density, which summary blocks show,
// whether priority buckets start expanded, whether operational guidance
// text shows). Lives in React memory only via useReducer — no
// localStorage, sessionStorage, cookie, IndexedDB or network call anywhere
// in this module. A page reload or a fresh page navigation naturally
// resets it, since nothing is ever written outside the React tree.
//
// Deliberately separate from ReviewStateContext (the simulated-action
// overlay): preferences are about how the workspace is displayed, not
// about what a Founder has done to a specific record.
//
// `reviewPreferencesReducer` is exported as a plain, dependency-free pure
// function so it stays unit-testable without a DOM.
// ============================================================

// `React` is imported explicitly for the same reason documented at the top
// of TodayReview.tsx — Vitest's esbuild JSX transform (no
// @vitejs/plugin-react in this repo's vitest.config.mts) needs it in scope;
// Next's own automatic runtime does not.
import React, { createContext, useContext, useReducer, type Dispatch, type ReactNode } from 'react';

export type Density = 'comfortable' | 'compact';

export interface ReviewPreferencesState {
  readonly density: Density;
  readonly showSummaryMetrics: boolean;
  readonly bucketsExpandedByDefault: boolean;
  readonly showGuidanceText: boolean;
}

export const DEFAULT_REVIEW_PREFERENCES: ReviewPreferencesState = {
  density: 'comfortable',
  showSummaryMetrics: true,
  bucketsExpandedByDefault: false,
  showGuidanceText: true,
};

export type ReviewPreferencesAction =
  | { readonly type: 'SET_DENSITY'; readonly density: Density }
  | { readonly type: 'TOGGLE_SUMMARY_METRICS' }
  | { readonly type: 'TOGGLE_BUCKETS_EXPANDED' }
  | { readonly type: 'TOGGLE_GUIDANCE_TEXT' }
  | { readonly type: 'RESET' };

export function reviewPreferencesReducer(
  state: ReviewPreferencesState,
  action: ReviewPreferencesAction
): ReviewPreferencesState {
  switch (action.type) {
    case 'SET_DENSITY':
      return { ...state, density: action.density };
    case 'TOGGLE_SUMMARY_METRICS':
      return { ...state, showSummaryMetrics: !state.showSummaryMetrics };
    case 'TOGGLE_BUCKETS_EXPANDED':
      return { ...state, bucketsExpandedByDefault: !state.bucketsExpandedByDefault };
    case 'TOGGLE_GUIDANCE_TEXT':
      return { ...state, showGuidanceText: !state.showGuidanceText };
    case 'RESET':
      return DEFAULT_REVIEW_PREFERENCES;
    default:
      return state;
  }
}

interface ReviewPreferencesContextValue {
  readonly state: ReviewPreferencesState;
  readonly dispatch: Dispatch<ReviewPreferencesAction>;
}

const ReviewPreferencesReactContext = createContext<ReviewPreferencesContextValue | undefined>(undefined);

export function ReviewPreferencesProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reviewPreferencesReducer, DEFAULT_REVIEW_PREFERENCES);
  return (
    <ReviewPreferencesReactContext.Provider value={{ state, dispatch }}>
      {children}
    </ReviewPreferencesReactContext.Provider>
  );
}

export function useReviewPreferences(): ReviewPreferencesContextValue {
  const ctx = useContext(ReviewPreferencesReactContext);
  if (!ctx) {
    throw new Error('useReviewPreferences must be used within a ReviewPreferencesProvider');
  }
  return ctx;
}
