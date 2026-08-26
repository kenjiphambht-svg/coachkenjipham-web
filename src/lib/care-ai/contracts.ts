export type CareChannel = 'website';

export type CareFamily =
  | 'UNKNOWN'
  | 'REFLECTIVE_ADULT'
  | 'REFLECTIVE_PARENT'
  | 'LEADER_BUILDER';

export type Confidence = 'HIGH' | 'MEDIUM' | 'LOW' | 'UNKNOWN';

export type TruthStatus =
  | 'VERIFIED'
  | 'BOUNDED'
  | 'UNKNOWN'
  | 'ROUTE_ONLY'
  | 'SALE_NOT_ACTIVE_OR_NOT_VERIFIED';

export type NextBestCare =
  | 'ANSWER'
  | 'ASK'
  | 'EDUCATE'
  | 'WAIT'
  | 'NURTURE'
  | 'ROUTE'
  | 'ROUTE_OUT'
  | 'NO_FIT'
  | 'SUPPRESS'
  | 'HUMAN_HANDOFF';

export type CommercialReadiness =
  | 'EXPLORE'
  | 'NEED_RECOGNIZED'
  | 'FIT_UNCLEAR'
  | 'FIT_CONFIRMED'
  | 'VALUE_UNDERSTOOD'
  | 'OBJECTION_OPEN'
  | 'READY_FOR_ALLOWED_NEXT_STEP'
  | 'WAIT'
  | 'NURTURE'
  | 'ROUTE_OUT'
  | 'NO_FIT'
  | 'HANDOFF';

export type MemoryDecision = 'PRESERVE' | 'UPDATE' | 'FORGET' | 'DO_NOT_WRITE';

export type ActionConfirmationState =
  | 'NONE'
  | 'PROPOSED'
  | 'ATTEMPTED'
  | 'CONFIRMED'
  | 'FAILED_UNCONFIRMED';

export type SyntheticActionOutcome = 'confirm' | 'fail' | 'attempt_only';

export interface StateSignal {
  dimension: string;
  value: string;
  confidence: Confidence;
  provenance: 'user_stated' | 'observed' | 'synthetic_fixture';
  tentative: true;
}

export interface CareRiskFlags {
  suppression?: boolean;
  privacyDataRequest?: boolean;
  childSensitive?: boolean;
  clinicalSafety?: boolean;
  humanRequested?: boolean;
  bindingCommercial?: boolean;
  sourceConflict?: boolean;
  identityAmbiguous?: boolean;
  crossDomain?: boolean;
  rawPrivateStory?: boolean;
}

export interface SyntheticActionRequest {
  kind: 'persist_suppression' | 'send_handoff' | 'send_message' | 'book' | 'memory_write';
  outcome: SyntheticActionOutcome;
}

export interface SyntheticCareFixture {
  id: string;
  sourceKind: 'SCENARIO' | 'GOLDEN';
  sourceRef: string;
  inputSummary: string;
  channel: CareChannel;
  family: CareFamily;
  familyConfidence: Confidence;
  productRoute?: string;
  truthStatus: TruthStatus;
  nextBestCare: NextBestCare;
  commercialReadiness: CommercialReadiness;
  memoryDecision: MemoryDecision;
  risk: CareRiskFlags;
  stateSignals?: StateSignal[];
  safeMemoryFacts?: string[];
  requestedAction?: SyntheticActionRequest;
  exactAuthorityBlock?: string;
  expectedEval: string[];
}

export interface HandoffPacket {
  family: CareFamily;
  userNeed: string;
  route?: string;
  truthStatus: TruthStatus;
  exactBlock: string;
  suppression: boolean;
  recommendedNextAction: string;
  aiMustNotDoNext: string;
}

export interface ResponsePolicyTrace {
  identityDisclosureAvailable: true;
  voiceMode: 'TRUTH_FIRST_LOW_PRESSURE';
  impersonatesKenji: false;
  providerMode: 'SYNTHETIC_NO_LLM';
}

export interface CareTrace {
  fixtureId: string;
  channel: CareChannel;
  family: { value: CareFamily; confidence: Confidence };
  stateSignals: StateSignal[];
  productRoute?: string;
  retrievedAuthority: 'P09_04B_04E_SYNTHETIC';
  truthStatus: TruthStatus;
  nextBestCare: NextBestCare;
  commercialReadiness: CommercialReadiness;
  memoryDecision: MemoryDecision;
  suppressionActive: boolean;
  identityAmbiguous: boolean;
  requestedAction?: SyntheticActionRequest['kind'];
  actionState: ActionConfirmationState;
  completionClaimAllowed: boolean;
  handoffRequired: boolean;
  handoffReason?: string;
  responsePolicy: ResponsePolicyTrace;
}

export interface CareRuntimeResult {
  trace: CareTrace;
  memorySnapshot: Readonly<Record<string, string[]>>;
  handoff?: HandoffPacket;
}
