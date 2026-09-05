import { describe, expect, it } from 'vitest';
import { CARE_RUNTIME_QUALITY_FIXTURES } from '@/lib/care-ai/runtime-quality-fixtures';
import {
  careQualityHardFailFamilies,
  careQualityRuntimeRootCauses,
  evaluateCareRuntimeQuality,
} from '@/lib/care-ai/runtime-quality-hooks';

describe('P07 runtime quality hooks — seeded P09 D9 synthetic proof', () => {
  it('contains only synthetic structured evidence and no customer text field', () => {
    expect(CARE_RUNTIME_QUALITY_FIXTURES.length).toBeGreaterThanOrEqual(12);
    for (const fixture of CARE_RUNTIME_QUALITY_FIXTURES) {
      const serialized = JSON.stringify(fixture.evidence);
      expect(serialized).not.toMatch(/"message"|"reply"|"transcript"|"senderId"|"customerName"|"chainOfThought"/);
    }
  });

  it.each(CARE_RUNTIME_QUALITY_FIXTURES.filter((item) => item.expectedHardFails.length > 0))(
    '$id catches the exact seeded deterministic hard-fail families',
    (fixture) => {
      const results = evaluateCareRuntimeQuality(fixture.evidence);
      expect(careQualityHardFailFamilies(results)).toEqual(expect.arrayContaining(fixture.expectedHardFails));
    },
  );

  it('routes the QL36 provider/runtime failure to P07 without fabricating a semantic Brain hard fail', () => {
    const fixture = CARE_RUNTIME_QUALITY_FIXTURES.find((item) => item.id === 'QL36_RUNTIME_PROVIDER_FAILURE');
    if (!fixture) throw new Error('missing QL36 runtime fixture');
    const results = evaluateCareRuntimeQuality(fixture.evidence);
    expect(careQualityHardFailFamilies(results)).toEqual([]);
    expect(careQualityRuntimeRootCauses(results)).toContain('RUNTIME_CAPABILITY_FAIL');
  });

  it.each(CARE_RUNTIME_QUALITY_FIXTURES.filter((item) => item.normal))(
    '$id does not over-flag normal Care from safe metadata',
    (fixture) => {
      const results = evaluateCareRuntimeQuality(fixture.evidence);
      expect(careQualityHardFailFamilies(results)).toEqual([]);
      expect(results.filter((item) => item.eligibility === 'DET' && item.result === 'FAIL')).toEqual([]);
    },
  );

  it('keeps SEM/HUM coverage unscored for every fixture rather than pretending metadata is enough', () => {
    for (const fixture of CARE_RUNTIME_QUALITY_FIXTURES) {
      const results = evaluateCareRuntimeQuality(fixture.evidence);
      expect(results.find((item) => item.eligibility === 'SEM')?.result).toBe('NOT_EVALUATED');
      expect(results.find((item) => item.eligibility === 'HUM')?.result).toBe('NOT_EVALUATED');
    }
  });
});
