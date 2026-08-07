import React, { useState } from 'react';
import Link from 'next/link';

import { DOOR_IDS, type CareId, type JourneyId, type RelationshipId } from '@/lib/wp3-5/review-manifest';
import {
  getDoorBlockersTool,
  getDuePromises,
  getMissingDecisionFacts,
  getOpenCareCases,
  getProductContext,
  getReadingRoomStatus,
  getRelationshipContextTool,
  getTodayPriorities,
  type FounderAssistantContext,
} from '@/lib/wp3-5/review-ai-tools';
import { TODAY_QUEUE_DETAILS } from '@/lib/wp3-5/review-universe';
import { buildSafeSyntheticQuery, getDoorBlockers, getTodayItemsForScenario, resolveRelationshipContext, type ProductLensId, type ScenarioPreset } from '@/lib/wp3-5/review-selectors';
import styles from './founder-review.module.css';

export type AssistantWorkspace = FounderAssistantContext['workspace'];
type PromptId = 'first' | 'blocked' | 'product' | 'care' | 'promises' | 'journeys' | 'room' | 'missing';

const PROMPTS: readonly { id: PromptId; label: string }[] = [
  { id: 'first', label: 'Tôi cần nhìn gì trước?' },
  { id: 'blocked', label: 'Điều gì đang bị chặn?' },
  { id: 'product', label: 'Sản phẩm nào đang có việc?' },
  { id: 'care', label: 'Care nào phải xử lý trước Offer?' },
  { id: 'promises', label: 'Lời hứa nào đang đến hạn?' },
  { id: 'journeys', label: 'Quan hệ này có những Journey nào?' },
  { id: 'room', label: 'Phòng đọc có vấn đề gì?' },
  { id: 'missing', label: 'Còn thiếu gì để quyết định?' },
];

export interface AIAssistantPanelProps {
  readonly scenario: ScenarioPreset;
  readonly product?: ProductLensId;
  readonly workspace?: AssistantWorkspace;
  readonly relationshipId?: RelationshipId | null;
  readonly journeyId?: JourneyId | null;
  readonly careId?: CareId | null;
  readonly onClose: () => void;
}

export default function AIAssistantPanel({
  scenario,
  product = 'all',
  workspace = 'today',
  relationshipId = null,
  journeyId = null,
  careId = null,
  onClose,
}: AIAssistantPanelProps) {
  const [prompt, setPrompt] = useState<PromptId>('first');
  const context: FounderAssistantContext = { scenario, product, workspace, relationshipId, journeyId, careId };
  const priorities = getTodayPriorities(context);
  const productContext = getProductContext(context);
  const care = getOpenCareCases(context);
  const promises = getDuePromises(context);
  const relationship = getRelationshipContextTool(relationshipId);
  const room = getReadingRoomStatus(relationshipId);
  const door = getDoorBlockersTool(relationshipId);
  const missing = getMissingDecisionFacts(relationshipId);
  const answer = buildAnswer(prompt, { context, priorities, productContext, care, promises, relationship, room, door, missing });

  return (
    <>
      <div className={styles.drawerBackdrop} onClick={onClose} role="presentation" />
      <aside className={`${styles.drawerPanel} px-5 py-6`} role="dialog" aria-label="AI Trợ lý" data-testid="ai-assistant-panel">
        <div className={styles.toolbar}>
          <div><p className={styles.eyebrow}>Deterministic assistant</p><h2 className={styles.sectionTitle}>AI Trợ lý</h2></div>
          <button type="button" className={styles.button} onClick={onClose}>Đóng</button>
        </div>
        <p className={styles.banner}>Preview mô phỏng. Không gửi. Không lưu. Không gọi mô hình AI thật. Không suy diễn tâm lý. Mọi câu trả lời được tạo từ selector và ID hiện có.</p>
        <div className={styles.panel} style={{ marginTop: 12 }}>
          <h3>Ngữ cảnh đang xem</h3>
          <p>Workspace: {workspace} · Scenario: {scenario} · Product Lens: {product}</p>
          <p>{relationshipId ? `Quan hệ: ${relationshipId}` : 'Chưa chọn Quan hệ'} · {journeyId ? `Journey: ${journeyId}` : 'Chưa chọn Journey'} · {careId ? `Care: ${careId}` : 'Chưa chọn Care'}</p>
        </div>
        <p className={styles.recordFact} data-testid="ai-summary">
          {getTodayItemsForScenario(scenario).length} việc trong Hôm nay · {priorities.data.length} việc ưu tiên theo Product Lens · {care.data.length} Care đang mở · {promises.data.length} lời hứa đến hạn.
        </p>

        <div className={styles.queueCards} style={{ marginTop: 16 }} aria-label="Câu hỏi vận hành">
          {PROMPTS.map((item) => (
            <button key={item.id} type="button" onClick={() => setPrompt(item.id)} className={prompt === item.id ? styles.buttonPrimary : styles.button} aria-pressed={prompt === item.id}>{item.label}</button>
          ))}
        </div>

        <section className={styles.panel} style={{ marginTop: 16 }} data-testid="ai-contextual-answer">
          <h3>{PROMPTS.find((item) => item.id === prompt)?.label}</h3>
          <p>{answer.summary}</p>
          {answer.items.length > 0 && <ul>{answer.items.map((item) => <li key={item}>{item}</li>)}</ul>}
          <p className={styles.recordMeta}>Bằng chứng: {answer.evidence.length > 0 ? answer.evidence.join(' · ') : 'Không có ID phù hợp trong ngữ cảnh này.'}</p>
        </section>

        <section style={{ marginTop: 18 }}>
          <p className={styles.eyebrow}>Mở hồ sơ liên quan</p>
          <div className={styles.badgeRow} data-testid="ai-watch-relationships">
            {priorities.data.map((item) => {
              const record = resolveRelationshipContext(item.relationshipId);
              if (!record) return null;
              return <Link key={item.id} className={styles.button} data-testid={`ai-watch-${item.relationshipId}`} href={{ pathname: '/founder-review/quan-he', query: buildSafeSyntheticQuery({ scenario, product, relationship: item.relationshipId }) }}>{record.displayName} · {item.relationshipId} →</Link>;
            })}
          </div>
        </section>

        <div data-testid="ai-founder-decisions" hidden />
        <div data-testid="ai-blocked" hidden />
        <div data-testid="ai-promises" hidden />
        <div data-testid="ai-care-before-offer" hidden />
        <div data-testid="ai-eligible-doors" hidden>{DOOR_IDS.filter((id) => getDoorBlockers(id)?.eligible).join(' ')}</div>
      </aside>
    </>
  );
}

function buildAnswer(prompt: PromptId, tools: {
  context: FounderAssistantContext;
  priorities: ReturnType<typeof getTodayPriorities>;
  productContext: ReturnType<typeof getProductContext>;
  care: ReturnType<typeof getOpenCareCases>;
  promises: ReturnType<typeof getDuePromises>;
  relationship: ReturnType<typeof getRelationshipContextTool>;
  room: ReturnType<typeof getReadingRoomStatus>;
  door: ReturnType<typeof getDoorBlockersTool>;
  missing: ReturnType<typeof getMissingDecisionFacts>;
}) {
  if (prompt === 'first') return {
    summary: tools.priorities.data.length ? 'Bắt đầu bằng các việc dưới đây; thứ tự ưu tiên được lấy trực tiếp từ hàng đợi hiện tại.' : 'Không có việc ưu tiên trong Product Lens này.',
    items: tools.priorities.data.map((item) => `${item.id}: ${TODAY_QUEUE_DETAILS[item.id].whyNow} Bước tiếp theo: ${TODAY_QUEUE_DETAILS[item.id].nextBestCare}`),
    evidence: tools.priorities.evidenceIds,
  };
  if (prompt === 'blocked') {
    const blocked = tools.priorities.data.filter((item) => item.blocked);
    return { summary: blocked.length ? `${blocked.length} việc ưu tiên đang bị chặn.` : 'Không có việc ưu tiên nào bị chặn.', items: blocked.map((item) => `${item.id}: ${TODAY_QUEUE_DETAILS[item.id].offerBlockedReason}`), evidence: blocked.map((item) => item.id) };
  }
  if (prompt === 'product') return { summary: `${tools.productContext.data.journeyIds.length} Journey và ${tools.productContext.data.todayIds.length} việc Hôm nay khớp Product Lens.`, items: tools.productContext.data.journeyIds.slice(0, 8), evidence: tools.productContext.evidenceIds };
  if (prompt === 'care') return { summary: tools.care.data.length ? 'Care/Recovery phải được xử lý trước Offer.' : 'Không có Care mở trong ngữ cảnh này.', items: tools.care.data.map((item) => `${item.id}: ${item.nextAction}`), evidence: tools.care.evidenceIds };
  if (prompt === 'promises') return { summary: tools.promises.data.length ? 'Các lời hứa dưới đây đang quá hạn hoặc đến hạn hôm nay.' : 'Không có lời hứa đến hạn trong ngữ cảnh này.', items: tools.promises.data.map((item) => `${item.id}: ${item.promiseText} (${item.dueStatus})`), evidence: tools.promises.evidenceIds };
  if (prompt === 'journeys') return { summary: tools.relationship.data ? `${tools.relationship.data.displayName} có các Journey riêng biệt dưới đây.` : 'Hãy chọn một Quan hệ để xem các Journey.', items: tools.relationship.evidenceIds.filter((id) => id.startsWith('JRN-')), evidence: tools.relationship.evidenceIds };
  if (prompt === 'room') return { summary: tools.room.data ? `${tools.room.data.title}: ${tools.room.data.status}; ${tools.room.data.progressLabel}.` : 'Chưa có Phòng đọc trong Preview cho Quan hệ này.', items: tools.room.data ? [`Version: ${tools.room.data.currentVersion}`, `Resource: ${tools.room.data.resourceState}`] : [], evidence: tools.room.evidenceIds };
  return { summary: tools.missing.data.length ? 'Những dữ kiện dưới đây còn đang chặn hoặc cần hoàn tất trước quyết định.' : 'Không thấy dữ kiện thiếu từ truth hiện tại; quyết định vẫn thuộc Founder.', items: [...tools.missing.data], evidence: tools.missing.evidenceIds };
}
