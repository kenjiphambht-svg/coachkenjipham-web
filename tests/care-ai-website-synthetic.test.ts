import { describe, expect, it } from 'vitest';
import { ALL_CARE_SYNTHETIC_FIXTURES, CARE_GOLDENS, CARE_SCENARIOS } from '@/lib/care-ai/synthetic-fixtures';
import { WebsiteSyntheticCareRuntime } from '@/lib/care-ai/synthetic-runtime';

describe('P07 Care AI website synthetic runtime — source coverage', () => {
  it('replays exactly 40 scenario briefs plus 10 Golden fixtures', () => {
    expect(CARE_SCENARIOS).toHaveLength(40);
    expect(CARE_GOLDENS).toHaveLength(10);
    expect(ALL_CARE_SYNTHETIC_FIXTURES).toHaveLength(50);
    expect(new Set(ALL_CARE_SYNTHETIC_FIXTURES.map((fixture) => fixture.id)).size).toBe(50);
  });

  it('keeps the approved gate website-only and provider-free', () => {
    for (const fixture of ALL_CARE_SYNTHETIC_FIXTURES) {
      expect(fixture.channel).toBe('website');
      expect(fixture.sourceRef).toContain('12HlYJob7C4ZVic_1OmCLENVtIErIP3oSjOZHsHjFRAg');
    }
  });

  it('exposes coverage hooks for all E01–E11 dimensions', () => {
    const dimensions = new Set(ALL_CARE_SYNTHETIC_FIXTURES.flatMap((fixture) => fixture.expectedEval));
    expect([...dimensions].sort()).toEqual([
      'E01','E02','E03','E04','E05','E06','E07','E08','E09','E10','E11',
    ]);
  });
});

describe('P07 Care AI website synthetic runtime — 04B/04E invariants', () => {
  it('runs all 50 fixtures through one deterministic Care Brain and emits minimized traces', () => {
    const runtime = new WebsiteSyntheticCareRuntime();
    const results = ALL_CARE_SYNTHETIC_FIXTURES.map((fixture) => runtime.run(fixture));

    expect(results).toHaveLength(50);
    for (const result of results) {
      expect(result.trace.channel).toBe('website');
      expect(result.trace.retrievedAuthority).toBe('P09_04B_04E_SYNTHETIC');
      expect(result.trace.responsePolicy).toEqual({
        identityDisclosureAvailable: true,
        voiceMode: 'TRUTH_FIRST_LOW_PRESSURE',
        impersonatesKenji: false,
        providerMode: 'SYNTHETIC_NO_LLM',
      });
      for (const signal of result.trace.stateSignals) {
        expect(signal.tentative).toBe(true);
        expect(['HIGH','MEDIUM','LOW','UNKNOWN']).toContain(signal.confidence);
      }
    }
  });

  it('treats material source conflict as UNKNOWN and human-routable', () => {
    const result = new WebsiteSyntheticCareRuntime().run(CARE_SCENARIOS.find((x) => x.id === 'S05')!);
    expect(result.trace.truthStatus).toBe('UNKNOWN');
    expect(result.trace.nextBestCare).toBe('HUMAN_HANDOFF');
    expect(result.trace.handoffRequired).toBe(true);
    expect(result.trace.handoffReason).toBe('MATERIAL_SOURCE_CONFLICT');
  });

  it('honors suppression in behavior before persistence confirmation', () => {
    const result = new WebsiteSyntheticCareRuntime().run(CARE_SCENARIOS.find((x) => x.id === 'S06')!);
    expect(result.trace.suppressionActive).toBe(true);
    expect(result.trace.nextBestCare).toBe('SUPPRESS');
    expect(result.trace.memoryDecision).toBe('UPDATE');
    expect(result.trace.actionState).toBe('ATTEMPTED');
    expect(result.trace.completionClaimAllowed).toBe(false);
  });

  it('never represents an unconfirmed failed channel action as completed', () => {
    const result = new WebsiteSyntheticCareRuntime().run(CARE_SCENARIOS.find((x) => x.id === 'S09')!);
    expect(result.trace.actionState).toBe('FAILED_UNCONFIRMED');
    expect(result.trace.completionClaimAllowed).toBe(false);
  });

  it('allows completion wording only after synthetic confirmation', () => {
    const base = CARE_SCENARIOS.find((x) => x.id === 'S09')!;
    const result = new WebsiteSyntheticCareRuntime().run({
      ...base,
      id: 'T-CONFIRMED-ACTION',
      requestedAction: { kind: 'send_message', outcome: 'confirm' },
    });
    expect(result.trace.actionState).toBe('CONFIRMED');
    expect(result.trace.completionClaimAllowed).toBe(true);
  });

  it('routes privacy/delete requests to human authority without claiming deletion', () => {
    const result = new WebsiteSyntheticCareRuntime().run(CARE_SCENARIOS.find((x) => x.id === 'S07')!);
    expect(result.trace.nextBestCare).toBe('HUMAN_HANDOFF');
    expect(result.trace.memoryDecision).toBe('FORGET');
    expect(result.trace.completionClaimAllowed).toBe(false);
    expect(result.handoff?.exactBlock).toContain('Deletion');
  });

  it('does not auto-merge ambiguous identity or write ambiguous context', () => {
    const result = new WebsiteSyntheticCareRuntime().run(CARE_SCENARIOS.find((x) => x.id === 'S08')!);
    expect(result.trace.identityAmbiguous).toBe(true);
    expect(result.trace.nextBestCare).toBe('ASK');
    expect(result.trace.memoryDecision).toBe('DO_NOT_WRITE');
  });

  it('keeps clinical and crisis paths out of conversion and out of synthetic memory', () => {
    const runtime = new WebsiteSyntheticCareRuntime();
    for (const id of ['S15','S27']) {
      const result = runtime.run(CARE_SCENARIOS.find((x) => x.id === id)!);
      expect(result.trace.nextBestCare).toBe('HUMAN_HANDOFF');
      expect(result.trace.memoryDecision).toBe('DO_NOT_WRITE');
      expect(result.trace.commercialReadiness).toBe('HANDOFF');
    }
  });

  it('does not turn historical/listed price evidence into quote or close authority', () => {
    const runtime = new WebsiteSyntheticCareRuntime();
    for (const id of ['S13','S22','S28','S38']) {
      const result = runtime.run(CARE_SCENARIOS.find((x) => x.id === id)!);
      expect(['UNKNOWN','ROUTE_ONLY']).toContain(result.trace.truthStatus);
      expect(result.trace.actionState).toBe('NONE');
      expect(result.trace.completionClaimAllowed).toBe(false);
    }
  });

  it('keeps B2C/B2B cross-domain context separate rather than auto-cross-selling', () => {
    const result = new WebsiteSyntheticCareRuntime().run(CARE_SCENARIOS.find((x) => x.id === 'S03')!);
    expect(result.trace.family.value).toBe('REFLECTIVE_ADULT');
    expect(result.trace.productRoute).toBeUndefined();
    expect(result.trace.nextBestCare).toBe('ASK');
  });

  it('forces binding commercial commitment to human handoff with no autonomous action', () => {
    const result = new WebsiteSyntheticCareRuntime().run(CARE_SCENARIOS.find((x) => x.id === 'S34')!);
    expect(result.trace.nextBestCare).toBe('HUMAN_HANDOFF');
    expect(result.trace.actionState).toBe('NONE');
    expect(result.trace.completionClaimAllowed).toBe(false);
    expect(result.handoff?.exactBlock).toContain('Binding commercial');
  });

  it('uses compact decision-ready handoff packets instead of raw transcripts', () => {
    const result = new WebsiteSyntheticCareRuntime().run(CARE_GOLDENS.find((x) => x.id === 'G10')!);
    expect(result.handoff).toMatchObject({
      family: 'UNKNOWN',
      suppression: false,
      recommendedNextAction: 'HUMAN_REVIEW',
    });
    expect(Object.keys(result.handoff ?? {}).sort()).toEqual([
      'aiMustNotDoNext','exactBlock','family','recommendedNextAction','route','suppression','truthStatus','userNeed',
    ]);
    expect(result.trace.actionState).toBe('ATTEMPTED');
    expect(result.trace.completionClaimAllowed).toBe(false);
  });

  it('fails closed if a non-website channel is introduced into this approved lane', () => {
    const fixture = CARE_SCENARIOS[0];
    expect(() => new WebsiteSyntheticCareRuntime().run({ ...fixture, channel: 'messenger' as never }))
      .toThrow('CARE_SYNTHETIC_WEBSITE_ONLY');
  });
});
