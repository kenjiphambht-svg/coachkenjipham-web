import { createHash, createHmac } from 'node:crypto';
import type { CareChannel } from './contracts';

export type CareConversationDirection = 'INBOUND' | 'OUTBOUND';

export interface CareConversationTurn {
  direction: CareConversationDirection;
  text: string;
  createdAt?: string;
}

export interface CareChannelIdentityRef {
  channel: CareChannel;
  accountScopeHash: string;
  externalSubjectHash: string;
}

export interface CareConversationContextRepository {
  loadRecent(args: {
    identity: CareChannelIdentityRef;
    nowIso: string;
    maxMessages: number;
  }): Promise<CareConversationTurn[]>;

  appendTurn(args: {
    identity: CareChannelIdentityRef;
    direction: CareConversationDirection;
    text: string;
    externalMessageHash?: string;
    expiresAtIso: string;
    contextPolicyVersion: string;
    idleCutoffIso: string;
  }): Promise<{ conversationId: string }>;
}

export interface CareConversationBudget {
  maxMessages: number;
  maxChars: number;
}

function requireNonEmpty(value: string, code: string): string {
  const trimmed = value.trim();
  if (!trimmed) throw new Error(code);
  return trimmed;
}

function requireSecret(value: string): string {
  const secret = requireNonEmpty(value, 'CARE_CONTEXT_IDENTITY_HMAC_SECRET_REQUIRED');
  if (secret.length < 32) throw new Error('CARE_CONTEXT_IDENTITY_HMAC_SECRET_TOO_SHORT');
  return secret;
}

function hmacHex(secret: string, namespace: string, value: string): string {
  return createHmac('sha256', secret)
    .update(`${namespace}\u0000${value}`, 'utf8')
    .digest('hex');
}

export function deriveCareChannelIdentity(args: {
  secret: string;
  channel: CareChannel;
  accountId: string;
  externalSubjectId: string;
}): CareChannelIdentityRef {
  const secret = requireSecret(args.secret);
  const accountId = requireNonEmpty(args.accountId, 'CARE_CONTEXT_ACCOUNT_ID_REQUIRED');
  const externalSubjectId = requireNonEmpty(args.externalSubjectId, 'CARE_CONTEXT_EXTERNAL_SUBJECT_ID_REQUIRED');
  return {
    channel: args.channel,
    accountScopeHash: hmacHex(secret, `care-context-account:${args.channel}`, accountId),
    externalSubjectHash: hmacHex(secret, `care-context-subject:${args.channel}`, externalSubjectId),
  };
}

export function hashCareExternalMessageId(value: string): string {
  const messageId = requireNonEmpty(value, 'CARE_CONTEXT_EXTERNAL_MESSAGE_ID_REQUIRED');
  return createHash('sha256').update(`care-context-message\u0000${messageId}`, 'utf8').digest('hex');
}

function assertBudget(budget: CareConversationBudget): void {
  if (!Number.isInteger(budget.maxMessages) || budget.maxMessages < 1 || budget.maxMessages > 32) {
    throw new Error('CARE_CONTEXT_MAX_MESSAGES_INVALID');
  }
  if (!Number.isInteger(budget.maxChars) || budget.maxChars < 256 || budget.maxChars > 24000) {
    throw new Error('CARE_CONTEXT_MAX_CHARS_INVALID');
  }
}

function turnCharCost(turn: CareConversationTurn): number {
  return turn.text.length + (turn.direction === 'INBOUND' ? 10 : 6);
}

export function buildBoundedConversation(
  priorTurns: readonly CareConversationTurn[],
  currentInboundText: string,
  budget: CareConversationBudget,
): CareConversationTurn[] {
  assertBudget(budget);
  const currentText = requireNonEmpty(currentInboundText, 'CARE_CONTEXT_CURRENT_TEXT_REQUIRED');
  const candidate = [
    ...priorTurns
      .filter((turn) => turn.text.trim())
      .map((turn) => ({ ...turn, text: turn.text.trim() })),
    { direction: 'INBOUND' as const, text: currentText },
  ];

  const bounded: CareConversationTurn[] = [];
  let chars = 0;
  for (let index = candidate.length - 1; index >= 0; index -= 1) {
    const turn = candidate[index];
    const cost = turnCharCost(turn);
    if (bounded.length >= budget.maxMessages) break;
    if (bounded.length > 0 && chars + cost > budget.maxChars) break;
    bounded.push(turn);
    chars += cost;
  }
  return bounded.reverse();
}

export function careConversationToModelTurns(turns: readonly CareConversationTurn[]): string[] {
  return turns.map((turn) => `${turn.direction === 'INBOUND' ? 'Customer' : 'Care'}: ${turn.text}`);
}

export function careConversationCharCount(turns: readonly CareConversationTurn[]): number {
  return turns.reduce((total, turn) => total + turnCharCost(turn), 0);
}

export function safeCareContextError(error: unknown): string {
  if (error instanceof Error && /^CARE_CONTEXT_[A-Z0-9_]+$/.test(error.message)) {
    return error.message.slice(0, 120);
  }
  return 'CARE_CONTEXT_UNKNOWN_ERROR';
}
