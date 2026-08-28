import { timingSafeEqual } from 'node:crypto';
import type { NextApiRequest, NextApiResponse } from 'next';
import type { CareChannel } from '../../../lib/care-ai/contracts';
import { MODEL_QUALITY_CASES } from '../../../lib/care-ai/model-quality-corpus';
import { ALL_CARE_SYNTHETIC_FIXTURES } from '../../../lib/care-ai/synthetic-fixtures';
import { WebsiteSyntheticCareRuntime } from '../../../lib/care-ai/synthetic-runtime';
import { evaluateModelQuality } from '../../../lib/care-ai/model-quality-evaluator';
import {
  CARE_MODEL_PROVIDERS,
  runCareModel,
  type CareAuthorityGuard,
  type CareModelProvider,
} from '../../../lib/care-ai/provider-neutral-model';
import { syntheticChannelInbound } from '../../../lib/care-ai/meta-channel';

function enabled(): boolean {
  return process.env.CARE_AI_TEST_UI_ENABLED === 'true' && Boolean(process.env.CARE_AI_TEST_ACCESS_TOKEN);
}

function constantTimeTokenMatch(provided: string, expected: string): boolean {
  const providedBuffer = Buffer.from(provided, 'utf8');
  const expectedBuffer = Buffer.from(expected, 'utf8');
  return providedBuffer.length === expectedBuffer.length && timingSafeEqual(providedBuffer, expectedBuffer);
}

function authorized(req: NextApiRequest): boolean {
  const expected = process.env.CARE_AI_TEST_ACCESS_TOKEN || '';
  const provided = req.headers['x-care-test-token'];
  return Boolean(expected) && typeof provided === 'string' && constantTimeTokenMatch(provided, expected);
}

function allowedCompatibleHosts(): string[] {
  return (process.env.CARE_MODEL_ALLOWED_COMPATIBLE_HOSTS || '')
    .split(',')
    .map((host) => host.trim().toLowerCase())
    .filter(Boolean);
}

function authorityGuardForFixture(fixtureId?: string): CareAuthorityGuard | undefined {
  if (!fixtureId) return undefined;
  const fixture = ALL_CARE_SYNTHETIC_FIXTURES.find((item) => item.id === fixtureId);
  if (!fixture) return undefined;
  const trace = new WebsiteSyntheticCareRuntime().run(fixture).trace;
  return {
    family: trace.family.value,
    truthStatus: trace.truthStatus,
    nextBestCare: trace.nextBestCare,
    commercialReadiness: trace.commercialReadiness,
    memoryDecision: trace.memoryDecision,
    handoffRequired: trace.handoffRequired,
  };
}

function safeError(error: unknown): string {
  if (!(error instanceof Error)) return 'CARE_TEST_UNKNOWN_ERROR';
  if (error.message.startsWith('CARE_MODEL_') || error.message.startsWith('CARE_TEST_')) {
    return error.message.slice(0, 180);
  }
  return 'CARE_TEST_PROVIDER_ERROR';
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Cache-Control', 'no-store');

  if (!enabled()) return res.status(404).json({ error: 'CARE_TEST_DISABLED' });
  if (!authorized(req)) return res.status(401).json({ error: 'CARE_TEST_UNAUTHORIZED' });

  if (req.method === 'GET') {
    return res.status(200).json({
      enabled: true,
      mode: 'EXPLICIT_TEST_GATE',
      providers: CARE_MODEL_PROVIDERS.map(({ id, label, defaultBaseUrl }) => ({ id, label, defaultBaseUrl })),
      channels: ['website', 'facebook_messenger', 'instagram'],
      fixtureCount: MODEL_QUALITY_CASES.length,
      credentialMode: process.env.CARE_MODEL_API_KEY ? 'SERVER_SECRET_AVAILABLE' : 'EPHEMERAL_KEY_REQUIRED',
      accessTokenRequired: true,
      compatibleHostAllowlistConfigured: allowedCompatibleHosts().length > 0,
    });
  }

  if (req.method !== 'POST') return res.status(405).json({ error: 'METHOD_NOT_ALLOWED' });

  const body = req.body || {};
  const provider = body.provider as CareModelProvider;
  const channel = body.channel as CareChannel;
  const model = typeof body.model === 'string' ? body.model.trim() : '';
  const baseUrl = typeof body.baseUrl === 'string' && body.baseUrl.trim() ? body.baseUrl.trim() : undefined;
  const apiKey =
    typeof body.apiKey === 'string' && body.apiKey.trim()
      ? body.apiKey.trim()
      : process.env.CARE_MODEL_API_KEY || '';
  const fixtureId = typeof body.fixtureId === 'string' && body.fixtureId.trim() ? body.fixtureId.trim() : undefined;
  const canonicalCase = fixtureId ? MODEL_QUALITY_CASES.find((item) => item.id === fixtureId) : undefined;
  if (fixtureId && !canonicalCase) return res.status(400).json({ error: 'CARE_TEST_FIXTURE_NOT_FOUND' });

  const turns = canonicalCase
    ? canonicalCase.turns
    : Array.isArray(body.turns)
      ? body.turns.filter((turn: unknown): turn is string => typeof turn === 'string' && Boolean(turn.trim())).slice(-12)
      : typeof body.message === 'string' && body.message.trim()
        ? [body.message.trim()]
        : [];

  if (!CARE_MODEL_PROVIDERS.some((item) => item.id === provider)) {
    return res.status(400).json({ error: 'CARE_MODEL_PROVIDER_UNSUPPORTED' });
  }
  if (!['website', 'facebook_messenger', 'instagram'].includes(channel)) {
    return res.status(400).json({ error: 'CARE_CHANNEL_UNSUPPORTED' });
  }
  if (!model) return res.status(400).json({ error: 'CARE_MODEL_NAME_REQUIRED' });
  if (!turns.length) return res.status(400).json({ error: 'CARE_TEST_MESSAGE_REQUIRED' });
  if (!apiKey) return res.status(400).json({ error: 'CARE_MODEL_CREDENTIAL_MISSING' });

  try {
    const inbound = syntheticChannelInbound(channel, turns[turns.length - 1]);
    const fixture = fixtureId ? ALL_CARE_SYNTHETIC_FIXTURES.find((item) => item.id === fixtureId) : undefined;
    if (fixtureId && !fixture) throw new Error('CARE_TEST_EXPECTED_FIXTURE_NOT_FOUND');
    const authorityGuard = authorityGuardForFixture(fixtureId);
    const decision = await runCareModel({
      config: {
        provider,
        model,
        apiKey,
        baseUrl,
        allowedCompatibleHosts: allowedCompatibleHosts(),
      },
      channel,
      turns,
      authorityGuard,
    });
    const evaluation = fixture ? evaluateModelQuality(fixture, decision) : undefined;

    return res.status(200).json({
      fixtureId: fixtureId || null,
      turns,
      inbound: {
        channel: inbound.channel,
        sender: inbound.externalSenderId,
        rawKind: inbound.rawKind,
      },
      config: { provider, model, baseUrl: baseUrl || null },
      guardMode: authorityGuard ? 'DETERMINISTIC_FIXTURE_GUARD' : 'MODEL_ONLY_FREEFORM_SYNTHETIC',
      decision,
      evaluation: evaluation
        ? {
            hardFails: evaluation.hardFails,
            comparisonNotes: evaluation.comparisonNotes,
            expected: evaluation.expected,
            autoVerdict: evaluation.hardFails.length ? 'FAIL_HARD_BOUNDARY' : 'NO_AUTO_HARD_FAIL',
            note: 'Canonical fixture decisions are deterministic-guarded. Semantic differences and actual Voice/E06 still require P09 review.',
          }
        : null,
      secretPersisted: false,
      productionActionExecuted: false,
      metaOutboundExecuted: false,
    });
  } catch (error) {
    return res.status(502).json({ error: safeError(error) });
  }
}
