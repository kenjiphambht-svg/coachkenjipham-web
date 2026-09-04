import { createHash } from 'node:crypto';
import type { MetaD1Database } from './meta-channel';

export type CareOperabilityChannel = 'facebook_messenger' | 'facebook_comment' | 'instagram';

export type CareOperabilityStage =
  | 'RECEIVED'
  | 'MODEL_SUCCESS'
  | 'MODEL_FAILURE'
  | 'OUTBOUND_SUCCESS'
  | 'OUTBOUND_FAILURE'
  | 'POLICY_NO_AUTO_REPLY'
  | 'OUTBOUND_GATED';

export interface CareOperabilityMark {
  eventKey: string;
  channel: CareOperabilityChannel;
  stage: CareOperabilityStage;
  customerMode: boolean;
  safeErrorCode?: string;
  nowMs?: number;
}

export interface CareOperabilityHealth {
  modelFailures: number;
  outboundFailures: number;
  pendingReplies: number;
}

export interface CareOperabilityStore {
  mark(args: CareOperabilityMark): Promise<void>;
  health(args: { nowMs?: number; lookbackMs: number; pendingAgeMs: number }): Promise<CareOperabilityHealth>;
}

const OPERABILITY_TABLE = 'care_meta_operability_state';
const SAFE_ERROR_CODE = /^CARE_[A-Z0-9_]{1,112}$/;

export function careOperabilityEventKey(channel: CareOperabilityChannel, externalMessageId: string): string {
  const normalized = externalMessageId.trim();
  if (!normalized) throw new Error('CARE_OPERABILITY_MESSAGE_ID_REQUIRED');
  return createHash('sha256').update(`${channel}\u0000${normalized}`, 'utf8').digest('hex');
}

export function safeCareOperabilityErrorCode(error: unknown): string {
  if (error instanceof Error && SAFE_ERROR_CODE.test(error.message)) return error.message.slice(0, 120);
  if (typeof error === 'string' && SAFE_ERROR_CODE.test(error)) return error.slice(0, 120);
  return 'CARE_OPERABILITY_UNKNOWN_ERROR';
}

function integerCount(value: unknown): number {
  const parsed = typeof value === 'number' ? value : Number(value ?? 0);
  return Number.isFinite(parsed) && parsed >= 0 ? Math.floor(parsed) : 0;
}

export function careOperabilityHealthDegraded(health: CareOperabilityHealth): boolean {
  return health.modelFailures > 0 || health.outboundFailures > 0 || health.pendingReplies > 0;
}

export class D1CareOperabilityStore implements CareOperabilityStore {
  constructor(private readonly db: MetaD1Database) {}

  async mark(args: CareOperabilityMark): Promise<void> {
    if (!/^[0-9a-f]{64}$/i.test(args.eventKey)) throw new Error('CARE_OPERABILITY_EVENT_KEY_INVALID');
    const nowMs = args.nowMs ?? Date.now();
    if (!Number.isInteger(nowMs) || nowMs <= 0) throw new Error('CARE_OPERABILITY_TIME_INVALID');
    const safeErrorCode = args.safeErrorCode ? safeCareOperabilityErrorCode(args.safeErrorCode) : null;
    const modelFailed = args.stage === 'MODEL_FAILURE' ? 1 : 0;
    const outboundFailed = args.stage === 'OUTBOUND_FAILURE' ? 1 : 0;

    const row = await this.db.prepare(`
      INSERT INTO ${OPERABILITY_TABLE} (
        event_key,
        channel,
        customer_mode,
        stage,
        model_failed,
        outbound_failed,
        last_error_code,
        created_at_ms,
        updated_at_ms
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(event_key) DO UPDATE SET
        channel = excluded.channel,
        customer_mode = excluded.customer_mode,
        stage = excluded.stage,
        model_failed = CASE
          WHEN excluded.model_failed = 1 THEN 1
          ELSE ${OPERABILITY_TABLE}.model_failed
        END,
        outbound_failed = CASE
          WHEN excluded.outbound_failed = 1 THEN 1
          ELSE ${OPERABILITY_TABLE}.outbound_failed
        END,
        last_error_code = CASE
          WHEN excluded.last_error_code IS NOT NULL THEN excluded.last_error_code
          ELSE ${OPERABILITY_TABLE}.last_error_code
        END,
        updated_at_ms = excluded.updated_at_ms
      RETURNING event_key
    `).bind(
      args.eventKey,
      args.channel,
      args.customerMode ? 1 : 0,
      args.stage,
      modelFailed,
      outboundFailed,
      safeErrorCode,
      nowMs,
      nowMs,
    ).first<{ event_key?: string }>();

    if (!row?.event_key) throw new Error('CARE_OPERABILITY_WRITE_FAILED');
  }

  async health(args: { nowMs?: number; lookbackMs: number; pendingAgeMs: number }): Promise<CareOperabilityHealth> {
    const nowMs = args.nowMs ?? Date.now();
    if (!Number.isInteger(nowMs) || nowMs <= 0) throw new Error('CARE_OPERABILITY_TIME_INVALID');
    if (!Number.isInteger(args.lookbackMs) || args.lookbackMs < 60_000 || args.lookbackMs > 86_400_000) {
      throw new Error('CARE_OPERABILITY_LOOKBACK_INVALID');
    }
    if (!Number.isInteger(args.pendingAgeMs) || args.pendingAgeMs < 10_000 || args.pendingAgeMs > 600_000) {
      throw new Error('CARE_OPERABILITY_PENDING_AGE_INVALID');
    }

    const cutoffMs = nowMs - args.lookbackMs;
    const pendingBeforeMs = nowMs - args.pendingAgeMs;
    const row = await this.db.prepare(`
      SELECT
        SUM(CASE WHEN updated_at_ms >= ? AND model_failed = 1 THEN 1 ELSE 0 END) AS model_failures,
        SUM(CASE WHEN updated_at_ms >= ? AND outbound_failed = 1 THEN 1 ELSE 0 END) AS outbound_failures,
        SUM(CASE
          WHEN created_at_ms >= ?
            AND updated_at_ms <= ?
            AND stage IN ('RECEIVED', 'MODEL_SUCCESS')
          THEN 1 ELSE 0 END
        ) AS pending_replies
      FROM ${OPERABILITY_TABLE}
      WHERE updated_at_ms >= ? OR created_at_ms >= ?
    `).bind(
      cutoffMs,
      cutoffMs,
      cutoffMs,
      pendingBeforeMs,
      cutoffMs,
      cutoffMs,
    ).first<{
      model_failures?: number | string | null;
      outbound_failures?: number | string | null;
      pending_replies?: number | string | null;
    }>();

    return {
      modelFailures: integerCount(row?.model_failures),
      outboundFailures: integerCount(row?.outbound_failures),
      pendingReplies: integerCount(row?.pending_replies),
    };
  }
}

export async function markCareOperabilitySafely(args: {
  store: CareOperabilityStore;
  channel: CareOperabilityChannel;
  externalMessageId: string;
  stage: CareOperabilityStage;
  customerMode: boolean;
  error?: unknown;
  nowMs?: number;
}): Promise<void> {
  try {
    await args.store.mark({
      eventKey: careOperabilityEventKey(args.channel, args.externalMessageId),
      channel: args.channel,
      stage: args.stage,
      customerMode: args.customerMode,
      safeErrorCode: args.error === undefined ? undefined : safeCareOperabilityErrorCode(args.error),
      nowMs: args.nowMs,
    });
  } catch (error) {
    console.error('CARE_OPERABILITY_WRITE_DEGRADED', {
      channel: args.channel,
      stage: args.stage,
      safeErrorCode: safeCareOperabilityErrorCode(error),
    });
  }
}
