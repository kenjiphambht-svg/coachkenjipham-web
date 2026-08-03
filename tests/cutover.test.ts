import { describe, expect, it } from 'vitest';
import { prepareManualCutover } from '@/lib/release/cutover';

const verifiedGates = {
  publicActivationEnabled: true,
  deletionWorkflowReady: true,
  privateStorageReady: true,
  calendarReady: true,
  emailReady: true,
};

describe('B12 manual cutover', () => {
  it('requires Founder approval even after every technical gate is verified', () => {
    expect(() => prepareManualCutover({ founderApproved: false, gates: verifiedGates })).toThrow('FOUNDER_APPROVAL_REQUIRED');
  });

  it('requires every technical gate even with Founder approval', () => {
    expect(() => prepareManualCutover({ founderApproved: true, gates: { ...verifiedGates, privateStorageReady: false } })).toThrow('RELEASE_GATES_OPEN:PRIVATE_STORAGE_UNVERIFIED');
  });

  it('creates instructions only and has no cutover side effect', () => {
    expect(prepareManualCutover({ founderApproved: true, gates: verifiedGates })).toMatchObject({ status: 'ready_for_manual_cutover' });
  });
});
