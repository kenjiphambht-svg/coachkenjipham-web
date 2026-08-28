import type { SyntheticCareFixture } from './contracts';
import {
  evaluateModelQualityHardBoundaries,
  type ModelQualityDecision,
} from './openai-model-quality';
import type { CareModelDecision } from './provider-neutral-model';

export interface ModelQualityEvaluation {
  hardFails: string[];
  comparisonNotes: string[];
  expected: {
    family: string;
    truthStatus: string;
    nextBestCare: string;
    commercialReadiness: string;
    memoryDecision: string;
  };
}

export function evaluateModelQuality(
  fixture: SyntheticCareFixture,
  actual: CareModelDecision,
): ModelQualityEvaluation {
  const hardened = evaluateModelQualityHardBoundaries(
    fixture,
    actual as ModelQualityDecision,
  );

  return {
    hardFails: hardened.hardFails,
    comparisonNotes: hardened.notes,
    expected: {
      family: fixture.family,
      truthStatus: fixture.truthStatus,
      nextBestCare: fixture.nextBestCare,
      commercialReadiness: fixture.commercialReadiness,
      memoryDecision: fixture.memoryDecision,
    },
  };
}
