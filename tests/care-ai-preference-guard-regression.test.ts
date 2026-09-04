import { describe, expect, it } from 'vitest';
import {
  enforceFreeformActionRouteTruth,
  type CareModelDecision,
} from '../src/lib/care-ai/provider-neutral-model';

const baseDecision: CareModelDecision = {
  family: 'REFLECTIVE_ADULT',
  truthStatus: 'BOUNDED',
  nextBestCare: 'ANSWER',
  commercialReadiness: 'EXPLORE',
  memoryDecision: 'DO_NOT_WRITE',
  handoffRequired: false,
  reply: 'Mình đã ghi nhận và sẽ điều chỉnh cách trả lời.',
};

describe('P07 live concise-preference guard regression', () => {
  it('keeps an explicit concise-reply preference eligible for durable UPDATE without claiming it was already persisted', () => {
    const result = enforceFreeformActionRouteTruth(
      {
        channel: 'facebook_messenger',
        turns: ['Customer: Từ giờ em hãy trả lời ngắn gọn giúp anh nhé'],
      },
      baseDecision,
    );

    expect(result).toMatchObject({
      truthStatus: 'BOUNDED',
      nextBestCare: 'ANSWER',
      commercialReadiness: 'EXPLORE',
      memoryDecision: 'UPDATE',
      handoffRequired: false,
      reply: 'Được, mình sẽ trả lời ngắn gọn hơn.',
    });
    expect(result.reply).not.toMatch(/đã ghi nhận|đã lưu|đã nhớ/i);
  });

  it('does not turn a negated concise preference into a durable update', () => {
    const result = enforceFreeformActionRouteTruth(
      {
        channel: 'facebook_messenger',
        turns: ['Customer: Đừng trả lời ngắn gọn, cứ giải thích đầy đủ cho anh.'],
      },
      {
        ...baseDecision,
        reply: 'Mình có thể giải thích đầy đủ hơn.',
      },
    );

    expect(result.memoryDecision).toBe('DO_NOT_WRITE');
    expect(result.reply).toBe('Mình có thể giải thích đầy đủ hơn.');
  });

  it('keeps explicit human-request safety precedence over the preference shortcut', () => {
    const result = enforceFreeformActionRouteTruth(
      {
        channel: 'facebook_messenger',
        turns: ['Customer: Trả lời ngắn gọn thôi và cho anh nói chuyện với Kenji.'],
      },
      baseDecision,
    );

    expect(result).toMatchObject({
      nextBestCare: 'HUMAN_HANDOFF',
      memoryDecision: 'DO_NOT_WRITE',
      handoffRequired: true,
    });
  });
});
