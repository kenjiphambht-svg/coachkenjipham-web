import type {
  ActionConfirmationState,
  CareRuntimeResult,
  HandoffPacket,
  MemoryDecision,
  NextBestCare,
  SyntheticCareFixture,
} from './contracts';

class EphemeralSafeMemory {
  private readonly records = new Map<string, string[]>();

  apply(fixture: SyntheticCareFixture, decision: MemoryDecision): void {
    if (decision === 'DO_NOT_WRITE') return;
    if (decision === 'FORGET') {
      this.records.delete(fixture.id);
      return;
    }
    const facts = fixture.safeMemoryFacts ?? [];
    if (facts.length === 0) return;
    this.records.set(fixture.id, [...facts]);
  }

  snapshot(): Readonly<Record<string, string[]>> {
    return Object.freeze(Object.fromEntries([...this.records.entries()].map(([key, value]) => [key, [...value]])));
  }
}

function resolveActionState(fixture: SyntheticCareFixture): ActionConfirmationState {
  const action = fixture.requestedAction;
  if (!action) return 'NONE';
  if (action.outcome === 'confirm') return 'CONFIRMED';
  if (action.outcome === 'fail') return 'FAILED_UNCONFIRMED';
  return 'ATTEMPTED';
}

function resolveGuardedNextBestCare(fixture: SyntheticCareFixture): NextBestCare {
  const risk = fixture.risk;
  if (risk.suppression) return 'SUPPRESS';
  if (
    risk.privacyDataRequest ||
    risk.childSensitive ||
    risk.clinicalSafety ||
    risk.humanRequested ||
    risk.bindingCommercial ||
    risk.sourceConflict
  ) return 'HUMAN_HANDOFF';
  if (risk.identityAmbiguous) return 'ASK';
  return fixture.nextBestCare;
}

function resolveGuardedMemory(fixture: SyntheticCareFixture): MemoryDecision {
  const risk = fixture.risk;
  if (risk.privacyDataRequest) return 'FORGET';
  if (risk.childSensitive || risk.clinicalSafety || risk.rawPrivateStory || risk.identityAmbiguous) return 'DO_NOT_WRITE';
  if (risk.suppression) return 'UPDATE';
  return fixture.memoryDecision;
}

function handoffReason(fixture: SyntheticCareFixture): string | undefined {
  const risk = fixture.risk;
  if (risk.privacyDataRequest) return 'PRIVACY_DATA_REQUEST';
  if (risk.clinicalSafety) return 'CLINICAL_SAFETY_BOUNDARY';
  if (risk.childSensitive) return 'CHILD_SENSITIVE_BOUNDARY';
  if (risk.humanRequested) return 'USER_REQUESTED_HUMAN';
  if (risk.bindingCommercial) return 'BINDING_COMMERCIAL_AUTHORITY';
  if (risk.sourceConflict) return 'MATERIAL_SOURCE_CONFLICT';
  return undefined;
}

function buildHandoff(fixture: SyntheticCareFixture, reason: string): HandoffPacket {
  return {
    family: fixture.family,
    userNeed: fixture.inputSummary,
    route: fixture.productRoute,
    truthStatus: fixture.risk.sourceConflict ? 'UNKNOWN' : fixture.truthStatus,
    exactBlock: fixture.exactAuthorityBlock ?? reason,
    suppression: Boolean(fixture.risk.suppression),
    recommendedNextAction: 'HUMAN_REVIEW',
    aiMustNotDoNext: 'Do not invent truth, bind a commercial action, claim deletion, or claim an unconfirmed tool result.',
  };
}

export class WebsiteSyntheticCareRuntime {
  private readonly memory = new EphemeralSafeMemory();

  run(fixture: SyntheticCareFixture): CareRuntimeResult {
    if (fixture.channel !== 'website') throw new Error('CARE_SYNTHETIC_WEBSITE_ONLY');

    const nextBestCare = resolveGuardedNextBestCare(fixture);
    const memoryDecision = resolveGuardedMemory(fixture);
    const actionState = resolveActionState(fixture);
    const reason = handoffReason(fixture);
    const handoffRequired = nextBestCare === 'HUMAN_HANDOFF';

    // Current-turn suppression is behavior-first even when persistence fails or is not attempted.
    this.memory.apply(fixture, memoryDecision);

    const result: CareRuntimeResult = {
      trace: {
        fixtureId: fixture.id,
        channel: fixture.channel,
        family: { value: fixture.family, confidence: fixture.familyConfidence },
        stateSignals: (fixture.stateSignals ?? []).map((signal) => ({ ...signal, tentative: true })),
        productRoute: fixture.productRoute,
        retrievedAuthority: 'P09_04B_04E_SYNTHETIC',
        truthStatus: fixture.risk.sourceConflict ? 'UNKNOWN' : fixture.truthStatus,
        nextBestCare,
        commercialReadiness: handoffRequired ? 'HANDOFF' : fixture.commercialReadiness,
        memoryDecision,
        suppressionActive: Boolean(fixture.risk.suppression),
        identityAmbiguous: Boolean(fixture.risk.identityAmbiguous),
        requestedAction: fixture.requestedAction?.kind,
        actionState,
        completionClaimAllowed: actionState === 'CONFIRMED',
        handoffRequired,
        handoffReason: reason,
        responsePolicy: {
          identityDisclosureAvailable: true,
          voiceMode: 'TRUTH_FIRST_LOW_PRESSURE',
          impersonatesKenji: false,
          providerMode: 'SYNTHETIC_NO_LLM',
        },
      },
      memorySnapshot: this.memory.snapshot(),
    };

    if (handoffRequired) result.handoff = buildHandoff(fixture, reason ?? 'POLICY_HUMAN_GATE');
    return result;
  }
}
