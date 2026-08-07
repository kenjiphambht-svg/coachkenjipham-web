// ============================================================
// AI Trợ lý — WP3.5-A2 clarity milestone.
//
// A deterministic, synthetic-only assistant panel. It does not call a real
// AI model, does not make a network request, and every line it shows is a
// direct read of the existing canonical manifest / synthetic universe via
// review-selectors — nothing here is inferred, scored or invented. It
// never mutates canonical data and links out using only approved synthetic
// query parameters.
//
// `React` is imported explicitly for Vitest's classic-mode JSX transform
// (see TodayReview.tsx for why).
// ============================================================

import React from 'react';
import Link from 'next/link';

import {
  TODAY_QUEUE_MANIFEST,
  DOOR_IDS,
  CARE_IDS,
  JOURNEY_IDS,
  type TodayQueueId,
} from '@/lib/wp3-5/review-manifest';
import {
  TODAY_QUEUE_DETAILS,
  PROMISE_RECORDS,
  CARE_RECORDS,
  JOURNEY_RECORDS,
  DOOR_RECORDS,
} from '@/lib/wp3-5/review-universe';
import {
  getTodayItemsForScenario,
  isTodayItemBlocked,
  resolveRelationshipContext,
  getDoorBlockers,
  buildSafeSyntheticQuery,
  type ScenarioPreset,
} from '@/lib/wp3-5/review-selectors';
import { Badge, SectionHeading } from './founder-review-ui';
import styles from './founder-review.module.css';

export interface AIAssistantPanelProps {
  readonly scenario: ScenarioPreset;
  readonly onClose: () => void;
}

function relName(relationshipId: string): string {
  const r = resolveRelationshipContext(relationshipId);
  return r ? `${r.displayName} · ${r.id}` : relationshipId;
}

export default function AIAssistantPanel({ scenario, onClose }: AIAssistantPanelProps) {
  const todayIds = getTodayItemsForScenario(scenario);

  const founderDecisionItems = todayIds.filter((id) => TODAY_QUEUE_DETAILS[id].founderDecisionRequired);
  const blockedItems = todayIds.filter((id) => isTodayItemBlocked(id));
  const duePromises = Object.values(PROMISE_RECORDS).filter(
    (p) => p.dueStatus === 'overdue' || p.dueStatus === 'due_today'
  );
  const careBeforeOffer = CARE_IDS.map((id) => CARE_RECORDS[id]).filter(
    (c) => c.status === 'open' && c.offerBlocked
  );
  const eligibleDoors = DOOR_IDS.filter((id) => getDoorBlockers(id)?.eligible);
  const silenceJourneys = JOURNEY_IDS.map((id) => JOURNEY_RECORDS[id]).filter(
    (j) => j.stage === 'deliberate_silence'
  );

  const watchRelationships = [
    ...new Set([
      ...founderDecisionItems.map((id) => TODAY_QUEUE_MANIFEST[id].relationshipId),
      ...blockedItems.map((id) => TODAY_QUEUE_MANIFEST[id].relationshipId),
    ]),
  ].slice(0, 6);

  return (
    <>
      <div className={styles.drawerBackdrop} onClick={onClose} role="presentation" />
      <aside
        className={`${styles.drawerPanel} px-5 py-6`}
        role="dialog"
        aria-label="AI Trợ lý"
        data-testid="ai-assistant-panel"
      >
        <button
          type="button"
          onClick={onClose}
          className="font-sans text-[13px] font-semibold text-e26-text-2 underline underline-offset-4 hover:text-e26-gold-deep mb-4"
        >
          Đóng
        </button>

        <h2 className="font-serif text-[22px] font-bold text-e26-black mb-1">AI Trợ lý</h2>
        <p className="border border-e26-border bg-e26-cream px-3 py-2 font-sans text-[12px] font-medium text-e26-text-2 mb-5">
          Trợ lý cho Preview — mô phỏng, xác định trước. Không gửi. Không lưu. Không gọi mô hình AI thật. Mọi thông
          tin dưới đây đến từ dữ liệu mô phỏng hiện có (scenario: {scenario}).
        </p>

        <SectionHeading>Tóm tắt hôm nay</SectionHeading>
        <p className="font-sans text-[14px] font-medium text-e26-text mb-5" data-testid="ai-summary">
          {todayIds.length} việc trong Hôm nay · {founderDecisionItems.length} cần Founder quyết định ·{' '}
          {blockedItems.length} đang bị chặn · {eligibleDoors.length} cánh cửa đủ điều kiện.
        </p>

        <AIListSection
          title="Việc cần Founder quyết định"
          testId="ai-founder-decisions"
          items={founderDecisionItems}
          empty="Không có việc nào cần Founder quyết định ở scenario này."
          render={(id) => (
            <li key={id} className="border border-e26-border bg-e26-white px-3 py-2">
              <p className="font-sans text-[13px] font-semibold text-e26-text">
                {id} · {relName(TODAY_QUEUE_MANIFEST[id].relationshipId)}
              </p>
              <p className="font-sans text-[12px] text-e26-text-2 mt-0.5">{TODAY_QUEUE_DETAILS[id].whatHappened}</p>
            </li>
          )}
        />

        <AIListSection
          title="Trường hợp đang bị chặn"
          testId="ai-blocked"
          items={blockedItems}
          empty="Không có việc nào đang bị chặn ở scenario này."
          render={(id) => (
            <li key={id} className="border border-e26-border bg-e26-white px-3 py-2">
              <div className="flex items-center justify-between gap-2">
                <p className="font-sans text-[13px] font-semibold text-e26-text">
                  {id} · {relName(TODAY_QUEUE_MANIFEST[id].relationshipId)}
                </p>
                <Badge variant="blocked">Đang bị chặn</Badge>
              </div>
              {TODAY_QUEUE_DETAILS[id].offerBlockedReason && (
                <p className="font-sans text-[12px] text-e26-text-2 mt-0.5">
                  {TODAY_QUEUE_DETAILS[id].offerBlockedReason}
                </p>
              )}
            </li>
          )}
        />

        <SectionHeading>Lời hứa quá hạn hoặc đến hạn</SectionHeading>
        {duePromises.length === 0 ? (
          <p className="font-sans text-[13px] text-e26-text-2 mb-5">Không có lời hứa nào quá hạn hoặc đến hạn.</p>
        ) : (
          <ul className="space-y-2 mb-5" data-testid="ai-promises">
            {duePromises.map((p) => (
              <li key={p.id} className="border border-e26-border bg-e26-white px-3 py-2">
                <p className="font-sans text-[13px] font-semibold text-e26-text">
                  {p.id} · {relName(p.relationshipId)}
                </p>
                <p className="font-sans text-[12px] text-e26-text-2 mt-0.5">
                  {p.promiseText} · {p.dueStatus === 'overdue' ? 'Quá hạn' : 'Đến hạn hôm nay'}
                </p>
              </li>
            ))}
          </ul>
        )}

        <SectionHeading>Quan hệ cần nhìn trước</SectionHeading>
        {watchRelationships.length === 0 ? (
          <p className="font-sans text-[13px] text-e26-text-2 mb-5">Không có Quan hệ nào cần ưu tiên lúc này.</p>
        ) : (
          <ul className="flex flex-wrap gap-2 mb-5" data-testid="ai-watch-relationships">
            {watchRelationships.map((rid) => (
              <li key={rid}>
                <Link
                  href={{ pathname: '/founder-review/quan-he', query: buildSafeSyntheticQuery({ scenario, relationship: rid }) }}
                  className="inline-block border border-e26-border bg-e26-white px-3 py-1.5 font-sans text-[12px] font-semibold text-e26-text hover:border-e26-gold-deep hover:text-e26-gold-deep"
                  data-testid={`ai-watch-${rid}`}
                >
                  {relName(rid)} →
                </Link>
              </li>
            ))}
          </ul>
        )}

        <SectionHeading>Care / Recovery phải xử lý trước Offer</SectionHeading>
        {careBeforeOffer.length === 0 ? (
          <p className="font-sans text-[13px] text-e26-text-2 mb-5">Không có case nào đang chặn Offer.</p>
        ) : (
          <ul className="space-y-2 mb-5" data-testid="ai-care-before-offer">
            {careBeforeOffer.map((c) => (
              <li key={c.id} className="border border-e26-border bg-e26-white px-3 py-2">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-sans text-[13px] font-semibold text-e26-text">
                    {c.id} · {relName(c.relationshipId)}
                  </p>
                  <Link
                    href={{ pathname: '/founder-review/cham-soc', query: buildSafeSyntheticQuery({ scenario, care: c.id }) }}
                    className="font-sans text-[12px] font-semibold underline underline-offset-4 text-e26-text-2 hover:text-e26-gold-deep"
                  >
                    Mở →
                  </Link>
                </div>
                <p className="font-sans text-[12px] text-e26-text-2 mt-0.5">{c.impact}</p>
              </li>
            ))}
          </ul>
        )}

        <SectionHeading>Cánh cửa đủ điều kiện</SectionHeading>
        {eligibleDoors.length === 0 ? (
          <p className="font-sans text-[13px] text-e26-text-2 mb-5">Chưa có cánh cửa nào đủ điều kiện.</p>
        ) : (
          <ul className="space-y-2 mb-5" data-testid="ai-eligible-doors">
            {eligibleDoors.map((doorId) => {
              const door = DOOR_RECORDS[doorId];
              return (
                <li key={doorId} className="border border-e26-border bg-e26-white px-3 py-2">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-sans text-[13px] font-semibold text-e26-text">
                      {doorId} · {relName(door.relationshipId)}
                    </p>
                    <Badge variant="eligible">Đủ điều kiện</Badge>
                  </div>
                  <Link
                    href={{
                      pathname: '/founder-review/quan-he',
                      query: buildSafeSyntheticQuery({ scenario, relationship: door.relationshipId }),
                    }}
                    className="font-sans text-[12px] font-semibold underline underline-offset-4 text-e26-text-2 hover:text-e26-gold-deep"
                  >
                    Mở →
                  </Link>
                </li>
              );
            })}
          </ul>
        )}

        <SectionHeading>Nên tiếp tục im lặng</SectionHeading>
        {silenceJourneys.length === 0 ? (
          <p className="font-sans text-[13px] text-e26-text-2 mb-5">Không có hành trình nào đang im lặng có chủ đích.</p>
        ) : (
          <ul className="space-y-2 mb-5" data-testid="ai-silence">
            {silenceJourneys.map((j) => (
              <li key={j.id} className="border border-e26-border bg-e26-white px-3 py-2">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-sans text-[13px] font-semibold text-e26-text">
                    {j.id} · {relName(j.relationshipId)}
                  </p>
                  <Badge variant="silence">Im lặng</Badge>
                </div>
                <p className="font-sans text-[12px] text-e26-text-2 mt-0.5">{j.now}</p>
              </li>
            ))}
          </ul>
        )}

        <SectionHeading>Gợi ý thứ tự xem</SectionHeading>
        <ol className="list-decimal list-inside space-y-1 font-sans text-[13px] text-e26-text" data-testid="ai-review-path">
          <li>Hôm nay — bắt đầu từ Safety &amp; Recovery, sau đó Founder Decision.</li>
          <li>Chăm sóc &amp; Phục hồi — xử lý Care/Recovery đang chặn Offer trước.</li>
          <li>Quan hệ — mở các Quan hệ cần nhìn trước ở trên.</li>
          <li>Hành trình — kiểm tra các hành trình đang bị chặn còn lại.</li>
          <li>Quan hệ — xem lại Cánh cửa đủ điều kiện cuối cùng, chỉ Founder tự quyết định.</li>
        </ol>
      </aside>
    </>
  );
}

function AIListSection({
  title,
  testId,
  items,
  empty,
  render,
}: {
  title: string;
  testId: string;
  items: readonly TodayQueueId[];
  empty: string;
  render: (id: TodayQueueId) => React.ReactNode;
}) {
  return (
    <div className="mb-5" data-testid={testId}>
      <SectionHeading>{title}</SectionHeading>
      {items.length === 0 ? (
        <p className="font-sans text-[13px] text-e26-text-2">{empty}</p>
      ) : (
        <ul className="space-y-2">{items.map(render)}</ul>
      )}
    </div>
  );
}
