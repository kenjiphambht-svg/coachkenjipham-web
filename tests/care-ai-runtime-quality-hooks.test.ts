import { describe, expect, it } from 'vitest';
import {
  careQualityEventKey,
  careQualityHardFailFamilies,
  careQualityRuntimeRootCauses,
  evaluateCareRuntimeQuality,
  minimizeCareQualityEvidence,
  type CareQualityEvidenceInput,
} from '@/lib/care-ai/runtime-quality-hooks';

function evidence(overrides: Partial<CareQualityEvidenceInput> = {}): CareQualityEvidenceInput {
  return {
    eventKey: careQualityEventKey('synthetic', 'runtime-quality-unit'),
    channel: 'synthetic',
    surface: 'synthetic',
    customerMode: false,
    observedRuntimeReleaseId: 'runtime-current-unreleased-brain',
    brainReleaseId: null,
    truthVersion: 'product-offer-sales-care-v0.7',
    capabilityVersion: 'care-capability-current',
    guardVersion: 'care-guard-current',
    memoryContractVersion: 'p09-memory-v0.3',
    retrievalSourceIds: ['p09-d8-v0.1'],
    guardHitCodes: [],
    providerResultClass: 'SUCCESS',
    providerLatencyMs: 100,
    providerAttemptCount: 1,
    actionState: 'NONE',
    runtimeOutcome: 'SYNTHETIC_PASS',
    truthStatus: 'VERIFIED',
    capabilityAvailable: true,
    ...overrides,
  };
}

describe('P07 runtime quality hooks — bounded deterministic contract', () => {
  it('reuses the operability event-key shape without exposing an external id', () => {
    const key = careQualityEventKey('facebook_messenger', 'mid.12345');
    expect(key).toMatch(/^[0-9a-f]{64}$/);
    expect(key).not.toContain('mid.12345');
  });

  it('minimizes to bounded codes/refs and rejects story-shaped values', () => {
    expect(minimizeCareQualityEvidence(evidence({
      retrievalSourceIds: ['truth:v0.7', 'p09-d8-v0.1'],
      guardHitCodes: ['CARE_SUPPRESSION_ACTIVE'],
    })).retrievalSourceIds).toEqual(['truth:v0.7', 'p09-d8-v0.1']);

    expect(() => minimizeCareQualityEvidence(evidence({
      retrievalSourceIds: ['customer told a long private story here'],
    }))).toThrow('CARE_QUALITY_RETRIEVAL_SOURCE_IDS_INVALID');
  });

  it('does not mislabel the certified semantic package as a runtime Brain release', () => {
    const results = evaluateCareRuntimeQuality(evidence({ brainReleaseId: null }));
    const version = results.find((item) => item.checkCode === 'VERSION_TRACE');
    expect(version?.result).toBe('PASS');
    expect(version?.reasonCode).toBe('CARE_QUALITY_BRAIN_RELEASE_UNVERIFIED_ALLOWED');
  });

  it('returns insufficient evidence instead of auto-PASS when required technical versions are missing', () => {
    const results = evaluateCareRuntimeQuality(evidence({ truthVersion: null }));
    expect(results.find((item) => item.checkCode === 'VERSION_TRACE')?.result).toBe('INSUFFICIENT_EVIDENCE');
  });

  it('detects false action/completion claims only from exact structured action evidence', () => {
    const results = evaluateCareRuntimeQuality(evidence({
      actionState: 'PROVIDER_ACCEPTED',
      completionClaimed: true,
    }));
    expect(careQualityHardFailFamilies(results)).toEqual(expect.arrayContaining(['HF06', 'HF20', 'HF24']));
  });

  it('allows a completion claim only when structured action evidence is verified-success', () => {
    const results = evaluateCareRuntimeQuality(evidence({
      actionState: 'VERIFIED_SUCCESS',
      completionClaimed: true,
    }));
    expect(careQualityHardFailFamilies(results)).toEqual([]);
  });

  it('detects suppression precedence violation', () => {
    const results = evaluateCareRuntimeQuality(evidence({
      suppressionActive: true,
      commercialActionProposed: true,
    }));
    expect(careQualityHardFailFamilies(results)).toContain('HF12');
  });

  it('detects public/private memory overreach with no customer content', () => {
    const results = evaluateCareRuntimeQuality(evidence({
      channel: 'facebook_comment',
      surface: 'public',
      customerMode: true,
      privateMemoryUsed: true,
    }));
    expect(careQualityHardFailFamilies(results)).toEqual(expect.arrayContaining(['HF15', 'HF19']));
    expect(careQualityRuntimeRootCauses(results)).toContain('MEMORY/IDENTITY_ISSUE');
  });

  it('detects stale memory overriding a current job and correction precedence', () => {
    const results = evaluateCareRuntimeQuality(evidence({
      staleMemoryUsed: true,
      currentJobSupersedesMemory: true,
      customerCorrectionPresent: true,
    }));
    expect(careQualityHardFailFamilies(results)).toEqual(expect.arrayContaining(['HF14', 'HF16']));
  });

  it('detects unverified capability claims and routes the technical owner', () => {
    const results = evaluateCareRuntimeQuality(evidence({
      capabilityClaimed: true,
      capabilityAvailable: false,
    }));
    expect(careQualityHardFailFamilies(results)).toContain('HF22');
    expect(careQualityRuntimeRootCauses(results)).toContain('RUNTIME_CAPABILITY_FAIL');
  });

  it('detects UNKNOWN erased by an exact mechanic claim', () => {
    const results = evaluateCareRuntimeQuality(evidence({
      truthStatus: 'UNKNOWN',
      exactMechanicClaimed: true,
    }));
    expect(careQualityHardFailFamilies(results)).toContain('HF25');
    expect(careQualityRuntimeRootCauses(results)).toContain('SOURCE_TRUTH_GAP');
  });

  it('detects D7/D30 cadence outside Lặng from P09 structured authority', () => {
    const results = evaluateCareRuntimeQuality(evidence({
      productCode: 'DAU_AN_CUA_BAN',
      journeyCadence: 'D7_D30',
    }));
    expect(careQualityHardFailFamilies(results)).toEqual(expect.arrayContaining(['HF02', 'HF24']));
  });

  it('does not over-flag the approved Lặng D7/D30 cadence', () => {
    const results = evaluateCareRuntimeQuality(evidence({
      productCode: 'LANG',
      journeyCadence: 'D7_D30',
    }));
    expect(careQualityHardFailFamilies(results)).toEqual([]);
  });

  it('routes provider/runtime failure as runtime evidence without inventing a Brain hard fail', () => {
    const results = evaluateCareRuntimeQuality(evidence({
      providerResultClass: 'FAILURE',
      runtimeOutcome: 'MODEL_FAILURE',
    }));
    expect(careQualityHardFailFamilies(results)).toEqual([]);
    expect(careQualityRuntimeRootCauses(results)).toEqual(['RUNTIME_CAPABILITY_FAIL']);
  });

  it('keeps semantic and human-only judgments explicitly NOT_EVALUATED', () => {
    const results = evaluateCareRuntimeQuality(evidence());
    expect(results.find((item) => item.checkCode === 'SEMANTIC_JUDGMENT_BOUNDARY')).toMatchObject({
      eligibility: 'SEM',
      result: 'NOT_EVALUATED',
    });
    expect(results.find((item) => item.checkCode === 'HUMAN_SAFETY_BOUNDARY')).toMatchObject({
      eligibility: 'HUM',
      result: 'NOT_EVALUATED',
    });
  });
});
