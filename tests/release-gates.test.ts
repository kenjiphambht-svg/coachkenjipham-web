import { describe, expect, it } from 'vitest';
import { assessReleaseReadiness } from '@/lib/release/gates';

describe('B10 release gates', () => {
  it('keeps public activation blocked while real child-data dependencies are unverified', () => {
    expect(assessReleaseReadiness({
      publicActivationEnabled: false,
      deletionWorkflowReady: false,
      privateStorageReady: false,
      calendarReady: false,
      emailReady: false,
    })).toEqual({
      ready: false,
      blockers: [
        'PUBLIC_ACTIVATION_OFF',
        'DELETION_WORKFLOW_UNVERIFIED',
        'PRIVATE_STORAGE_UNVERIFIED',
        'CALENDAR_INTEGRATION_UNVERIFIED',
        'EMAIL_INTEGRATION_UNVERIFIED',
      ],
    });
  });

  it('requires every explicit gate, not only public activation', () => {
    expect(assessReleaseReadiness({
      publicActivationEnabled: true,
      deletionWorkflowReady: true,
      privateStorageReady: false,
      calendarReady: true,
      emailReady: true,
    })).toEqual({ ready: false, blockers: ['PRIVATE_STORAGE_UNVERIFIED'] });
  });
});
