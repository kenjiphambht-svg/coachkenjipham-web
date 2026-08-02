// ============================================================
// Test bộ luật trạng thái — work order B0 mục 7, ca 1 · 2 · 3.
// ============================================================

import { describe, expect, it } from 'vitest';

import { DomainError } from '@/lib/domain/errors';
import { transitionHatMam, transitionLang, type Actor } from '@/lib/domain/state-machine';

const kenji: Actor = { kind: 'human', id: 'user-kenji', label: 'kenji@example.com' };
const bank: Actor = { kind: 'system', label: 'bank-webhook' };

const lang = (from: Parameters<typeof transitionLang>[0]['from'], to: Parameters<typeof transitionLang>[0]['to'], extra = {}) =>
  transitionLang({ applicationId: 'app-1', from, to, actor: kenji, ...extra });

describe('ca 1 — chuyển trạng thái hợp lệ thì pass', () => {
  it('đi hết vòng đời Lặng theo đúng thứ tự', () => {
    expect(lang('submitted', 'under_review').to).toBe('under_review');
    expect(lang('under_review', 'accepted').to).toBe('accepted');
    expect(
      lang('accepted', 'awaiting_payment', {
        capacity: { monthKey: '2026-09-01', usedSlots: 0 },
      }).to
    ).toBe('awaiting_payment');
    expect(lang('awaiting_payment', 'paid').to).toBe('paid');
    expect(lang('paid', 'scheduled').to).toBe('scheduled');
    expect(lang('scheduled', 'completed').to).toBe('completed');
  });

  it('đi hết vòng đời Hạt Mầm', () => {
    const step = (from: never, to: never) =>
      transitionHatMam({ orderId: 'o-1', from, to, actor: kenji }).to;
    expect(step('submitted' as never, 'awaiting_payment' as never)).toBe('awaiting_payment');
    expect(step('awaiting_payment' as never, 'paid' as never)).toBe('paid');
    expect(step('paid' as never, 'in_production' as never)).toBe('in_production');
    expect(step('in_production' as never, 'ready' as never)).toBe('ready');
    expect(step('ready' as never, 'delivered' as never)).toBe('delivered');
  });

  it('mỗi lần chuyển đều sinh một bản ghi audit', () => {
    const result = lang('submitted', 'under_review');
    expect(result.audit).toMatchObject({
      entityType: 'lang_application',
      entityId: 'app-1',
      fromState: 'submitted',
      toState: 'under_review',
      action: 'lang.submitted->under_review',
    });
    expect(result.audit.actor).toContain('human:user-kenji');
  });
});

describe('ca 2 — nhảy thẳng sang scheduled khi chưa paid thì bị chặn', () => {
  it.each([
    ['submitted'],
    ['under_review'],
    ['accepted'],
    ['awaiting_payment'],
  ] as const)('chặn %s -> scheduled', (from) => {
    expect(() => lang(from, 'scheduled')).toThrowError(DomainError);
    try {
      lang(from, 'scheduled');
    } catch (err) {
      expect((err as DomainError).code).toBe('INVALID_TRANSITION');
    }
  });

  it('chỉ paid mới sang scheduled được', () => {
    expect(lang('paid', 'scheduled').to).toBe('scheduled');
  });
});

describe('Cửa 1 — Human Decision Gate (L0 C-05, FD-B)', () => {
  it('không có đường tự động nào từ submitted sang accepted', () => {
    expect(() => lang('submitted', 'accepted')).toThrowError(DomainError);
  });

  it.each(['accepted', 'declined', 'more_info_needed'] as const)(
    'hệ thống (actor system) KHÔNG được tự chuyển sang %s',
    (to) => {
      expect(() =>
        transitionLang({ applicationId: 'app-1', from: 'under_review', to, actor: bank })
      ).toThrowError(DomainError);

      try {
        transitionLang({ applicationId: 'app-1', from: 'under_review', to, actor: bank });
      } catch (err) {
        expect((err as DomainError).code).toBe('HUMAN_DECISION_REQUIRED');
      }
    }
  );

  it('Cửa 2 — xác nhận tiền thì hệ thống ĐƯỢC làm (sự thật kế toán)', () => {
    const result = transitionLang({
      applicationId: 'app-1',
      from: 'awaiting_payment',
      to: 'paid',
      actor: bank,
    });
    expect(result.to).toBe('paid');
    expect(result.audit.actor).toBe('system:bank-webhook');
  });
});

describe('trạng thái kết thúc', () => {
  it.each(['completed', 'declined', 'cancelled'] as const)(
    '%s không chuyển đi đâu được nữa',
    (from) => {
      expect(() => lang(from, 'under_review')).toThrowError(DomainError);
    }
  );

  it('huỷ được từ mọi trạng thái đang chạy', () => {
    for (const from of ['submitted', 'under_review', 'accepted', 'awaiting_payment', 'paid', 'scheduled'] as const) {
      expect(lang(from, 'cancelled').to).toBe('cancelled');
    }
  });
});
