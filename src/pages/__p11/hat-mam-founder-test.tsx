import Head from 'next/head';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { ArrowRight, CheckCircle2, CircleAlert, FlaskConical, LockKeyhole, RefreshCw, ShieldCheck } from 'lucide-react';
import styles from '../../styles/p11-hm-test.module.css';
import { getTrace, hatMamScenarios, scenarioOrder, type HatMamScenarioKey, type TraceState } from '../../lib/p11-hm-synthetic-fixtures';

const stateClass: Record<TraceState, string> = {
  PASS: styles.statePass,
  BLOCKED: styles.stateBlocked,
  PENDING: styles.statePending,
  SEPARATE: styles.stateSeparate,
  IDEMPOTENT: styles.stateIdempotent,
};

export default function HatMamFounderTestPage() {
  const [scenarioKey, setScenarioKey] = useState<HatMamScenarioKey>('approved');
  const scenario = hatMamScenarios[scenarioKey];
  const trace = useMemo(() => getTrace(scenario), [scenario]);

  return (
    <>
      <Head>
        <title>Hạt Mầm · Founder Test View · Synthetic</title>
        <meta name="robots" content="noindex,nofollow,noarchive" />
        <meta name="referrer" content="no-referrer" />
      </Head>

      <main className={styles.shell}>
        <header className={styles.founderHeader}>
          <div>
            <div className={styles.eyebrow}>ESSENCE · P11 PRODUCT & DELIVERY OPERATIONS</div>
            <h1>Hạt Mầm — Founder Test View</h1>
            <p className={styles.lead}>Một màn hình để nhìn đúng chuỗi vận hành, thấy chính xác khâu nào PASS, khâu nào đang chặn và không nhầm “file tồn tại” với “đã được phép giao”.</p>
          </div>
          <div className={styles.syntheticBadge}><FlaskConical size={15} /> SYNTHETIC · PREVIEW ONLY</div>
        </header>

        <section className={styles.notice} aria-label="Giới hạn môi trường test">
          <ShieldCheck size={18} />
          <div><strong>Không có dữ liệu khách thật.</strong> Màn hình này chỉ dùng fixture giả để anh test trải nghiệm và logic trạng thái. Không Production, không provider, không delivery thật.</div>
        </section>

        <div className={styles.founderGrid}>
          <aside className={styles.scenarioPanel} aria-label="Kịch bản acceptance test">
            <div className={styles.panelTitle}>Kịch bản để test</div>
            <p className={styles.panelHint}>Bấm từng case. Đây là scenario selector của test harness, không phải authorization.</p>
            <div className={styles.scenarioList}>
              {scenarioOrder.map((key) => {
                const item = hatMamScenarios[key];
                const selected = key === scenarioKey;
                return (
                  <button
                    type="button"
                    key={key}
                    className={`${styles.scenarioButton} ${selected ? styles.scenarioButtonActive : ''}`}
                    aria-pressed={selected}
                    onClick={() => setScenarioKey(key)}
                  >
                    <span className={styles.atTag}>{item.at}</span>
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </aside>

          <section className={styles.casePanel} aria-live="polite">
            <div className={styles.caseTopline}>
              <div>
                <div className={styles.caseLabel}>{scenario.at} · CASE SYN-A</div>
                <h2>{scenario.label}</h2>
              </div>
              <span className={`${styles.overallBadge} ${scenario.outcome === 'deny' ? styles.overallDenied : scenario.outcome === 'allow' ? styles.overallAllowed : styles.overallObserve}`}>
                {scenario.outcome === 'deny' ? <LockKeyhole size={15} /> : <CheckCircle2 size={15} />}
                {scenario.overallState}
              </span>
            </div>

            <p className={styles.caseSummary}>{scenario.summary}</p>

            <div className={styles.reasonRow}>
              <span>Internal reason</span>
              <code>{scenario.reasonCode}</code>
            </div>

            <div className={styles.traceHeading}>
              <div>
                <div className={styles.panelTitle}>Chuỗi kiểm chứng end-to-end</div>
                <div className={styles.panelHint}>Founder trace chỉ có ID, digest/state và correlation giả. Không raw content, token hoặc secret.</div>
              </div>
              <RefreshCw size={17} aria-hidden="true" />
            </div>

            <div className={styles.traceGrid}>
              {trace.map((step, index) => (
                <article className={styles.traceCard} key={step.label}>
                  <div className={styles.traceIndex}>{String(index + 1).padStart(2, '0')}</div>
                  <div className={styles.traceBody}>
                    <div className={styles.traceLabel}>{step.label}</div>
                    <div className={styles.traceDetail}>{step.detail}</div>
                  </div>
                  <span className={`${styles.stateBadge} ${stateClass[step.state]}`}>{step.state}</span>
                </article>
              ))}
            </div>

            <div className={styles.truthSplit}>
              <div>
                <span>Delivery Succeeded</span>
                <strong>{scenario.delivery}</strong>
                <small>{scenario.canonicalDeliveryEvents} canonical event</small>
              </div>
              <div className={styles.truthDivider} aria-hidden="true" />
              <div>
                <span>Customer Confirmed</span>
                <strong>{scenario.confirmation}</strong>
                <small>Evidence riêng, không tự suy</small>
              </div>
            </div>

            <div className={styles.actionBar}>
              <div className={styles.actionNote}>
                <CircleAlert size={16} />
                Private Reading View sẽ giữ customer-facing message trung tính; internal reason chỉ nằm ở Founder View.
              </div>
              <Link className={styles.primaryAction} href={`/__p11/hat-mam-reading-test?scenario=${scenario.key}`}>
                Mở Phòng đọc với case này <ArrowRight size={17} />
              </Link>
            </div>
          </section>
        </div>

        <section className={styles.guardrails} aria-label="Hard boundaries">
          <div><strong>AT-08</strong><span>Trace đủ để biết lỗi nằm ở đâu.</span></div>
          <div><strong>AT-09</strong><span>Delivery và Confirmation luôn tách truth.</span></div>
          <div><strong>AT-10</strong><span>Không raw private content / token / secret / PII.</span></div>
          <div><strong>NO BYPASS</strong><span>Blocked case không có force-deliver hoặc public fallback.</span></div>
        </section>
      </main>
    </>
  );
}
