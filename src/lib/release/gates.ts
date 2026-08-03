export interface ReleaseGateState {
  publicActivationEnabled: boolean;
  deletionWorkflowReady: boolean;
  privateStorageReady: boolean;
  calendarReady: boolean;
  emailReady: boolean;
}

export interface ReleaseReadiness {
  ready: boolean;
  blockers: string[];
}

/**
 * A release cannot be inferred from passing unit tests. Every operational
 * dependency needs an explicit, real verification before activation.
 */
export function assessReleaseReadiness(gates: ReleaseGateState): ReleaseReadiness {
  const blockers: string[] = [];
  if (!gates.publicActivationEnabled) blockers.push('PUBLIC_ACTIVATION_OFF');
  if (!gates.deletionWorkflowReady) blockers.push('DELETION_WORKFLOW_UNVERIFIED');
  if (!gates.privateStorageReady) blockers.push('PRIVATE_STORAGE_UNVERIFIED');
  if (!gates.calendarReady) blockers.push('CALENDAR_INTEGRATION_UNVERIFIED');
  if (!gates.emailReady) blockers.push('EMAIL_INTEGRATION_UNVERIFIED');
  return { ready: blockers.length === 0, blockers };
}
