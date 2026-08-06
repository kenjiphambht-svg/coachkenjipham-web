import Link from 'next/link';
import type { ReactNode } from 'react';

import {
  PRIORITY_LABEL,
  careFixtures,
  doorStateLabel,
  journeyFixtures,
  journeyStateLabel,
  queueFixtures,
  relationshipFixtures,
} from '@/lib/wp3-5/synthetic';

function Panel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="border border-e26-border bg-e26-white p-4 md:p-5">
      <h2 className="font-serif text-[20px] mb-4">{title}</h2>
      {children}
    </section>
  );
}

function Badge({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex border border-e26-border bg-e26-cream px-2 py-1 font-sans text-[12px] text-e26-text-2">
      {children}
    </span>
  );
}

export function PreviewNotice() {
  return (
    <div className="border border-e26-border bg-e26-cream p-4 font-sans text-[14px] text-e26-text-2 mb-6">
      <strong className="text-e26-text">WP3.5-A synthetic preview.</strong> Không dữ liệu thật, không persistence, không gửi, không provider và không customer score.
    </div>
  );
}

export function TodayPreview() {
  return (
    <Panel title="WP3.5 — Hôm nay">
      <p className="font-sans text-[14px] text-e26-text-2 mb-5">
        Thứ tự dựa trên care, risk, lời hứa và Human Decision Gate. Mỗi vị trí đều giải thích được bằng facts.
      </p>
      <div className="space-y-3">
        {queueFixtures.map((item) => (
          <article key={item.id} className="border border-e26-border p-4">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <Badge>{PRIORITY_LABEL[item.bucket]}</Badge>
                <h3 className="font-serif text-[18px] mt-2">{item.title}</h3>
              </div>
              <span className="font-sans text-[13px] font-medium">{item.dueLabel}</span>
            </div>
            <p className="font-sans text-[13px] text-e26-text-2 mt-2">
              {item.relationship} · {item.journey} · Owner: {item.owner}
            </p>
            <p className="font-sans text-[14px] mt-3"><strong>Vì sao cần nhìn lúc này:</strong> {item.reason}</p>
            <p className="font-sans text-[14px] mt-2"><strong>Đề xuất chăm sóc:</strong> {item.proposedCare}</p>
            {item.warning && <p className="font-sans text-[13px] text-e26-text-2 mt-2">Lưu ý: {item.warning}</p>}
          </article>
        ))}
      </div>
    </Panel>
  );
}

export function RelationshipPreview() {
  return (
    <div className="space-y-4">
      {relationshipFixtures.map((item) => (
        <Panel key={item.id} title={item.label}>
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge>{item.verification}</Badge>
            <Badge>{doorStateLabel[item.doorState]}</Badge>
          </div>
          <div className="grid md:grid-cols-2 gap-4 font-sans text-[14px]">
            <div>
              <h3 className="font-medium mb-2">Hành trình</h3>
              <ul className="space-y-1 text-e26-text-2">{item.journeys.map((x) => <li key={x}>{x}</li>)}</ul>
            </div>
            <div>
              <h3 className="font-medium mb-2">Điều đang mở</h3>
              <ul className="space-y-1 text-e26-text-2">
                {(item.openCare.length ? item.openCare : ['Không có care/support/recovery đang mở']).map((x) => <li key={x}>{x}</li>)}
              </ul>
            </div>
            <div><strong>Consent:</strong> <span className="text-e26-text-2">{item.consent}</span></div>
            <div><strong>Suppression:</strong> <span className="text-e26-text-2">{item.suppression}</span></div>
            <div><strong>Entitlement:</strong> <span className="text-e26-text-2">{item.entitlement}</span></div>
            <div><strong>Lời hứa:</strong> <span className="text-e26-text-2">{item.promise}</span></div>
            <div><strong>Founder gate:</strong> <span className="text-e26-text-2">{item.founderGate}</span></div>
          </div>
          <div className="mt-4 border-t border-e26-border pt-4 font-sans text-[13px] text-e26-text-2">
            <strong className="text-e26-text">Safe operational note:</strong> {item.safeNote}
          </div>
        </Panel>
      ))}
    </div>
  );
}

export function JourneyPreview() {
  return (
    <Panel title="Các hành trình synthetic">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] border-collapse font-sans text-[13px]">
          <thead>
            <tr className="border-b border-e26-border text-left">
              <th className="py-3 pr-4">Quan hệ</th><th className="py-3 pr-4">Sản phẩm</th><th className="py-3 pr-4">Trạng thái</th><th className="py-3 pr-4">Current truth</th><th className="py-3 pr-4">Bước tiếp theo</th><th className="py-3">Due</th>
            </tr>
          </thead>
          <tbody>
            {journeyFixtures.map((item) => (
              <tr key={item.id} className="border-b border-e26-border align-top">
                <td className="py-3 pr-4">{item.relationship}</td>
                <td className="py-3 pr-4">{item.product}</td>
                <td className="py-3 pr-4"><Badge>{journeyStateLabel[item.state]}</Badge></td>
                <td className="py-3 pr-4 text-e26-text-2">{item.currentTruth}</td>
                <td className="py-3 pr-4 text-e26-text-2">{item.nextStep}</td>
                <td className="py-3">{item.dueLabel}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Panel>
  );
}

export function CarePreview() {
  return (
    <div className="space-y-4">
      {careFixtures.map((item) => (
        <Panel key={item.id} title={`${item.type} · ${item.title}`}>
          <div className="flex flex-wrap gap-2 mb-4"><Badge>{item.relationship}</Badge><Badge>{item.dueLabel}</Badge>{item.offerBlock && <Badge>Offer blocked</Badge>}</div>
          <dl className="grid md:grid-cols-2 gap-3 font-sans text-[14px]">
            <div><dt className="font-medium">Ảnh hưởng</dt><dd className="text-e26-text-2 mt-1">{item.impact}</dd></div>
            <div><dt className="font-medium">Containment</dt><dd className="text-e26-text-2 mt-1">{item.containment}</dd></div>
            <div><dt className="font-medium">Next action</dt><dd className="text-e26-text-2 mt-1">{item.nextAction}</dd></div>
            <div><dt className="font-medium">Owner</dt><dd className="text-e26-text-2 mt-1">{item.owner}</dd></div>
          </dl>
        </Panel>
      ))}
      <Panel title="Cánh cửa tiếp theo — Founder review">
        <p className="font-sans text-[14px] mb-3"><strong>Next Best Care đứng trước và tạo điều kiện cho Next Best Offer.</strong></p>
        <p className="font-sans text-[14px] text-e26-text-2 mb-4">Synthetic case: journey đã khép, không blocker, khách chủ động hỏi bước tiếp theo và consent cho phép. Không có hành động gửi thật.</p>
        <div className="flex flex-wrap gap-2">
          {['Duyệt lời mời', 'Chỉnh wording', 'Để sau', 'Không phù hợp', 'Tiếp tục care'].map((label) => (
            <button key={label} type="button" className="border border-e26-border px-3 py-2 font-sans text-[13px] hover:bg-e26-cream">{label}</button>
          ))}
        </div>
      </Panel>
    </div>
  );
}

export function FounderPreviewLinks() {
  return (
    <div className="grid sm:grid-cols-3 gap-3 mb-6">
      <Link href="/admin/quan-he" className="border border-e26-border bg-e26-white p-4 font-sans text-[14px] hover:bg-e26-cream">Quan hệ →</Link>
      <Link href="/admin/hanh-trinh" className="border border-e26-border bg-e26-white p-4 font-sans text-[14px] hover:bg-e26-cream">Hành trình →</Link>
      <Link href="/admin/cham-soc" className="border border-e26-border bg-e26-white p-4 font-sans text-[14px] hover:bg-e26-cream">Chăm sóc & Phục hồi →</Link>
    </div>
  );
}
