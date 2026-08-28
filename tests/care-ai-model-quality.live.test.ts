import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { ALL_CARE_SYNTHETIC_FIXTURES } from '@/lib/care-ai/synthetic-fixtures';
import { MODEL_QUALITY_CASES } from '@/lib/care-ai/model-quality-corpus';
import {
  MODEL_QUALITY_MODEL,
  MODEL_QUALITY_PROVIDER,
  evaluateModelQualityHardBoundaries,
  runOpenRouterModelQualityCase,
  type ModelQualityDecision,
} from '@/lib/care-ai/openai-model-quality';

const LIVE = process.env.CARE_AI_MODEL_EVAL === '1';
const API_KEY = process.env.OPENROUTER_API_KEY ?? '';

interface EvalRecord {
  id: string;
  sourceKind: 'SCENARIO' | 'GOLDEN';
  turns: string[];
  expected: {
    family: string;
    truthStatus: string;
    nextBestCare: string;
    commercialReadiness: string;
    memoryDecision: string;
  };
  actual?: ModelQualityDecision;
  autoHardFails: string[];
  comparisonNotes: string[];
  error?: string;
}

const liveDescribe = LIVE ? describe : describe.skip;

liveDescribe('P07 Care AI model-quality — live synthetic only', () => {
  it('runs 40 scenarios + 10 Golden through the guarded model layer and emits P09 evidence', async () => {
    if (!API_KEY) throw new Error('CARE_MODEL_CREDENTIAL_MISSING: OPENROUTER_API_KEY is not available to this workflow.');

    expect(MODEL_QUALITY_CASES).toHaveLength(50);
    expect(ALL_CARE_SYNTHETIC_FIXTURES).toHaveLength(50);

    const fixtureById = new Map(ALL_CARE_SYNTHETIC_FIXTURES.map((fixture) => [fixture.id, fixture]));
    const records: EvalRecord[] = [];

    for (const modelCase of MODEL_QUALITY_CASES) {
      const fixture = fixtureById.get(modelCase.id);
      if (!fixture) throw new Error(`CARE_MODEL_FIXTURE_MISSING:${modelCase.id}`);

      const record: EvalRecord = {
        id: modelCase.id,
        sourceKind: fixture.sourceKind,
        turns: modelCase.turns,
        expected: {
          family: fixture.family,
          truthStatus: fixture.truthStatus,
          nextBestCare: fixture.nextBestCare,
          commercialReadiness: fixture.commercialReadiness,
          memoryDecision: fixture.memoryDecision,
        },
        autoHardFails: [],
        comparisonNotes: [],
      };

      try {
        const actual = await runOpenRouterModelQualityCase({
          apiKey: API_KEY,
          turns: modelCase.turns,
          fixture,
        });
        record.actual = actual;
        const evaluated = evaluateModelQualityHardBoundaries(fixture, actual);
        record.autoHardFails = evaluated.hardFails;
        record.comparisonNotes = evaluated.notes;
      } catch (error) {
        record.error = error instanceof Error ? error.message : String(error);
      }

      records.push(record);
    }

    const hardFails = records.flatMap((record) => record.autoHardFails.map((fail) => `${record.id}:${fail}`));
    const errors = records.filter((record) => record.error).map((record) => `${record.id}:${record.error}`);
    const attempted = records.length;
    const completed = records.filter((record) => record.actual).length;
    const scenarioCompleted = records.filter((record) => record.sourceKind === 'SCENARIO' && record.actual).length;
    const goldenCompleted = records.filter((record) => record.sourceKind === 'GOLDEN' && record.actual).length;
    const responseModes = records.reduce<Record<string, number>>((acc, record) => {
      const mode = record.actual?.responseMode ?? 'NONE';
      acc[mode] = (acc[mode] ?? 0) + 1;
      return acc;
    }, {});

    const artifact = {
      generatedAt: new Date().toISOString(),
      scope: 'SYNTHETIC_ONLY_NO_REAL_CUSTOMER_DATA',
      provider: MODEL_QUALITY_PROVIDER,
      model: MODEL_QUALITY_MODEL,
      configuration: {
        endpointStyle: 'chat_completions',
        challengerReason: 'gpt-oss-20b failed output reliability on both Responses and Chat Completions paths',
        maxTokens: 1600,
        structuredOutput: true,
        structuredRetry: 'one fail-closed retry for malformed structured output only',
        deterministicSemanticGuard: 'accepted WebsiteSyntheticCareRuntime semantics from PR #177',
        replyRepair: 'one bounded model rewrite pass; deterministic safe fallback only if reply-level hard-fails remain',
        openRouterPromptStorage: 'not opted in',
        providerSort: 'price',
        dataCollection: 'deny',
        requireParameters: true,
        allowFallbacks: true,
      },
      attempted,
      completed,
      scenarioCompleted,
      goldenCompleted,
      responseModes,
      autoHardFails: hardFails,
      errors,
      note: 'All 50 cases are attempted even when one provider/model case errors. Accepted deterministic runtime semantics constrain authority/state before customer-facing generation. responseMode records whether the accepted reply is raw model output, one bounded model repair, or deterministic fail-closed fallback. Automated hard-fail checks include P09 Care/authority, route/action capability, Vietnamese-language operational-route patterns and E06 Voice classes. P09 still performs final human Voice/authority acceptance.',
      records,
    };

    const artifactDir = path.join(process.cwd(), 'artifacts');
    fs.mkdirSync(artifactDir, { recursive: true });
    fs.writeFileSync(path.join(artifactDir, 'care-ai-model-quality.json'), JSON.stringify(artifact, null, 2), 'utf8');

    expect(attempted).toBe(50);
    expect(errors).toEqual([]);
    expect(completed).toBe(50);
    expect(scenarioCompleted).toBe(40);
    expect(goldenCompleted).toBe(10);
    expect(hardFails).toEqual([]);
  }, 900_000);
});
