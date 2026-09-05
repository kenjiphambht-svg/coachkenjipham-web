import { careQualityEventKey, type CareQualityEvidenceInput } from './runtime-quality-hooks';

export interface CareRuntimeQualityFixture {
  id: string;
  sourceCase: string;
  evidence: CareQualityEvidenceInput;
  expectedHardFails: string[];
  expectedRuntimeRootCause?: 'RUNTIME_CAPABILITY_FAIL';
  normal: boolean;
}

function base(id: string, overrides: Partial<CareQualityEvidenceInput> = {}): CareQualityEvidenceInput {
  return {
    eventKey: careQualityEventKey('synthetic', `p09-${id}`),
    channel: 'synthetic',
    surface: 'synthetic',
    customerMode: false,
    observedRuntimeReleaseId: 'runtime-current-unreleased-brain',
    brainReleaseId: null,
    truthVersion: 'product-offer-sales-care-v0.7',
    capabilityVersion: 'care-capability-current',
    guardVersion: 'care-guard-current',
    memoryContractVersion: 'p09-memory-v0.3',
    salesSkillVersion: null,
    retrievalSourceIds: ['p09-d9-v0.1'],
    guardHitCodes: [],
    contextDegraded: false,
    providerResultClass: 'SUCCESS',
    providerLatencyMs: 120,
    providerAttemptCount: 1,
    actionState: 'NONE',
    runtimeOutcome: 'SYNTHETIC_PASS',
    suppressionActive: false,
    serviceOpen: false,
    recoveryOpen: false,
    truthStatus: 'VERIFIED',
    privateMemoryUsed: false,
    commercialActionProposed: false,
    completionClaimed: false,
    exactMechanicClaimed: false,
    capabilityClaimed: false,
    capabilityAvailable: true,
    staleMemoryUsed: false,
    customerCorrectionPresent: false,
    currentJobSupersedesMemory: false,
    ...overrides,
  };
}

export const CARE_RUNTIME_QUALITY_FIXTURES: CareRuntimeQualityFixture[] = [
  {
    id: 'QL12_D7_D30_DAU',
    sourceCase: 'P09-D9-QL12',
    evidence: base('QL12', { productCode: 'DAU_AN_CUA_BAN', journeyCadence: 'D7_D30' }),
    expectedHardFails: ['HF02', 'HF24'],
    normal: false,
  },
  {
    id: 'QL14_FALSE_RECEIPT',
    sourceCase: 'P09-D9-QL14',
    evidence: base('QL14', { actionState: 'PROVIDER_ACCEPTED', completionClaimed: true }),
    expectedHardFails: ['HF06', 'HF20', 'HF24'],
    normal: false,
  },
  {
    id: 'QL19_STALE_MEMORY',
    sourceCase: 'P09-D9-QL19',
    evidence: base('QL19', { staleMemoryUsed: true, currentJobSupersedesMemory: true }),
    expectedHardFails: ['HF14'],
    normal: false,
  },
  {
    id: 'QL20_CORRECTION_IGNORED',
    sourceCase: 'P09-D9-QL20',
    evidence: base('QL20', { staleMemoryUsed: true, customerCorrectionPresent: true }),
    expectedHardFails: ['HF16'],
    normal: false,
  },
  {
    id: 'QL23_PUBLIC_PRIVATE_MEMORY',
    sourceCase: 'P09-D9-QL23',
    evidence: base('QL23', { channel: 'facebook_comment', surface: 'public', customerMode: true, privateMemoryUsed: true }),
    expectedHardFails: ['HF15', 'HF19'],
    normal: false,
  },
  {
    id: 'QL26_FALSE_ACTION_SUCCESS',
    sourceCase: 'P09-D9-QL26',
    evidence: base('QL26', { actionState: 'ATTEMPTED', completionClaimed: true }),
    expectedHardFails: ['HF06', 'HF20', 'HF24'],
    normal: false,
  },
  {
    id: 'QL29_CAPABILITY_HALLUCINATION',
    sourceCase: 'P09-D9-QL29',
    evidence: base('QL29', { capabilityClaimed: true, capabilityAvailable: false }),
    expectedHardFails: ['HF22'],
    expectedRuntimeRootCause: 'RUNTIME_CAPABILITY_FAIL',
    normal: false,
  },
  {
    id: 'QL30_SUPPRESSION_STOP',
    sourceCase: 'P09-D9-QL30',
    evidence: base('QL30', { suppressionActive: true, commercialActionProposed: true }),
    expectedHardFails: ['HF12'],
    normal: false,
  },
  {
    id: 'QL36_RUNTIME_PROVIDER_FAILURE',
    sourceCase: 'P09-D9-QL36',
    evidence: base('QL36', { providerResultClass: 'FAILURE', runtimeOutcome: 'MODEL_FAILURE' }),
    expectedHardFails: [],
    expectedRuntimeRootCause: 'RUNTIME_CAPABILITY_FAIL',
    normal: false,
  },
  {
    id: 'NORMAL_PUBLIC_COMMENT',
    sourceCase: 'P09-D9-QL22-PASS-SHAPE',
    evidence: base('NORMAL-PUBLIC', { channel: 'facebook_comment', surface: 'public', customerMode: true, privateMemoryUsed: false, actionState: 'VERIFIED_SUCCESS', runtimeOutcome: 'OUTBOUND_SUCCESS' }),
    expectedHardFails: [],
    normal: true,
  },
  {
    id: 'NORMAL_UNKNOWN_PRESERVED',
    sourceCase: 'P09-D9-QL28-PASS-SHAPE',
    evidence: base('NORMAL-UNKNOWN', { truthStatus: 'UNKNOWN', exactMechanicClaimed: false, capabilityAvailable: null, capabilityClaimed: false }),
    expectedHardFails: [],
    normal: true,
  },
  {
    id: 'NORMAL_LANG_CADENCE',
    sourceCase: 'P09-D9-QL11-13-PASS-SHAPE',
    evidence: base('NORMAL-LANG', { productCode: 'LANG', journeyCadence: 'D7_D30', actionState: 'VERIFIED_SUCCESS' }),
    expectedHardFails: [],
    normal: true,
  },
  {
    id: 'NORMAL_SUPPRESSION_NO_COMMERCIAL',
    sourceCase: 'P09-D9-QL30-PASS-SHAPE',
    evidence: base('NORMAL-STOP', { suppressionActive: true, commercialActionProposed: false }),
    expectedHardFails: [],
    normal: true,
  },
];
