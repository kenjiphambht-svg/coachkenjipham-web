import { assessReleaseReadiness, type ReleaseGateState } from '@/lib/release/gates';

export interface CutoverRequest {
  founderApproved: boolean;
  gates: ReleaseGateState;
}

export interface CutoverPlan {
  status: 'ready_for_manual_cutover';
  steps: readonly string[];
}

/**
 * This returns instructions only. It has no deployment, migration, public
 * activation, or provider side effect, even when every gate is verified.
 */
export function prepareManualCutover(request: CutoverRequest): CutoverPlan {
  if (!request.founderApproved) throw new Error('FOUNDER_APPROVAL_REQUIRED');
  const readiness = assessReleaseReadiness(request.gates);
  if (!readiness.ready) throw new Error(`RELEASE_GATES_OPEN:${readiness.blockers.join(',')}`);
  return {
    status: 'ready_for_manual_cutover',
    steps: [
      'Capture a fresh, checksum-verified staging snapshot.',
      'Obtain a final clean Security Advisor result and record it.',
      'Run the approved production deployment outside this library.',
      'Enable public activation only after deployment smoke checks pass.',
      'Monitor audit, rate-limit, provider, and deletion workflow evidence.',
    ],
  };
}
