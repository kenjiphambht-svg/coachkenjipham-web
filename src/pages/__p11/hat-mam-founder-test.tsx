import Head from 'next/head';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { ArrowRight, CheckCircle2, CircleAlert, FlaskConical, LockKeyhole, RefreshCw, ShieldCheck } from 'lucide-react';
import styles from '../../styles/p11-hm-test.module.css';
import readable from '../../styles/p11-hm-readable.module.css';
import { getTrace, hatMamScenarios, scenarioOrder, type HatMamScenarioKey, type TraceState } from '../../lib/p11-hm-synthetic-fixtures';

const stateClass: Record<TraceState, string> = {
  PASS: styles.statePass,
  BLOCKED: styles.stateBlocked,
  PENDING: styles.statePending,
  SEPARATE: styles.stateSeparate,
  IDEMPOTENT: styles.stateIdempotent,
};

const stateLabel: Record<TraceState, string> = {
  PASS: 'ĐẠT',
  BLOCKED: 'BỊ CHẶN',
  PENDING: 'CHỜ DUYỆT',
  SEPARATE: 'TÁCH RIÊNG',
  IDEMPOTENT: 'KHÔNG TẠO LẶP',
};

const deliveryLabel = {
  NOT_RECORDED: 'CHƯA GHI NHẬN',
  SUCCEEDED: 'ĐÃ GIAO THÀNH CÔNG',
} as const;

const confirmationLabel = {
  NOT_RECORDED: 'CHƯA GHI NHẬN',
  CONFIRMED: 'KHÁCH ĐÃ XÁC NHẬN',
} as const;

export default function HatMamFounderTestPage() {
  const [scenarioKey, setScenarioKey] = useState<HatMamScenarioKey>('approved');
  const scenario = hatMamScenarios[scenarioKey];
  const trace = useMemo(() => getTrace(scenario), [scenario]);

  return (
    <>
      <Head>
        <title>Hạt Mầm · Màn hình kiểm thử · Dữ liệu giả</title>
        <meta name="robots" content="noindex,nofollow,noarchive" />
        <meta name="referrer" content="no-referrer" />
      </Head>

      <main className={`${styles.shell} ${readable.largeText}`}>
        <header className={styles.founderHeader}>
          <div>
            <div className={styles.eyebrow}>ESSENCE · P11 VẬN HÀNH SẢN PHẨM & GIAO TRẢI NGHIỆM</div>
            <h1>Hạt Mầm — Màn hình kiểm thử</h1>
            <p className={styles.lead}>Màn hình này giúp anh nhìn toàn bộ đường đi của một Hạt Mầm: từ đúng người, đúng quyền, đúng phiên bản, được P11 duyệt, cho tới quyền mở phòng đọc và trạng thái giao nhận.</p>
          </div>
          <div className={styles.syntheticBadge}><FlaskConical size={20} /> DỮ LIỆU GIẢ · CHỈ ĐỂ THỬ</div>
        </header>

        <section className={styles.notice} aria-label="Giới hạn môi trường thử nghiệm">
          <ShieldCheck size={22} />
          <div><strong>Không có dữ liệu khách thật.</strong> Đây là môi trường thử bằng dữ liệu giả. Không giao sản phẩm thật, không kết nối nhà cung cấp thật và không tác động môi trường vận hành thật.</div>
        </section>

        <section className={readable.usageGuide} aria-label="Hướng dẫn sử dụng">
          <div className={readable.guideTitle}>Cách sử dụng màn hình này</div>
          <ol>
            <li><strong>Bước 1 — Chọn một tình huống ở cột bên trái.</strong> Mỗi mã AT là một trường hợp anh cần kiểm thử.</li>
            <li><strong>Bước 2 — Nhìn kết quả ở bên phải.</strong> Màu xanh nghĩa là đạt; màu đỏ nghĩa là bị chặn; màu vàng/xám là trạng thái cần quan sát hoặc tách riêng.</li>
            <li><strong>Bước 3 — Bấm “Mở Phòng đọc với tình huống này”.</strong> Nếu đủ quyền thì phải đọc được; nếu sai người, hết quyền, sai phiên bản hoặc chưa duyệt thì phải bị chặn.</li>
          </ol>
          <p><strong>Điều quan trọng nhất:</strong> có file không có nghĩa là được phép giao. Chỉ đúng người + đúng quyền + đúng phiên bản + đúng phê duyệt mới được mở.</p>
        </section>

        <div className={styles.founderGrid}>
          <aside className={styles.scenarioPanel} aria-label="Các tình huống kiểm thử">
            <div className={styles.panelTitle}>Các tình huống để anh thử</div>
            <p className={styles.panelHint}>Bấm từng tình huống. Nút này chỉ đổi dữ liệu giả để kiểm thử; nó không tự cấp quyền truy cập.</p>
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
                <div className={styles.caseLabel}>{scenario.at} · TÌNH HUỐNG GIẢ A</div>
                <h2>{scenario.label}</h2>
              </div>
              <span className={`${styles.overallBadge} ${scenario.outcome === 'deny' ? styles.overallDenied : scenario.outcome === 'allow' ? styles.overallAllowed : styles.overallObserve}`}>
                {scenario.outcome === 'deny' ? <LockKeyhole size={20} /> : <CheckCircle2 size={20} />}
                {scenario.overallState}
              </span>
            </div>

            <p className={styles.caseSummary}>{scenario.summary}</p>

            <div className={styles.reasonRow}>
              <span>Mã nguyên nhân kỹ thuật</span>
              <code>{scenario.reasonCode}</code>
            </div>

            <div className={styles.traceHeading}>
              <div>
                <div className={styles.panelTitle}>Chuỗi kiểm tra từ đầu đến cuối</div>
                <div className={styles.panelHint}>Chỉ hiển thị mã định danh giả, trạng thái và dấu vết cần thiết. Không hiển thị nội dung riêng tư, mã truy cập hoặc bí mật hệ thống.</div>
              </div>
              <RefreshCw size={22} aria-hidden="true" />
            </div>

            <div className={styles.traceGrid}>
              {trace.map((step, index) => (
                <article className={styles.traceCard} key={step.label}>
                  <div className={styles.traceIndex}>{String(index + 1).padStart(2, '0')}</div>
                  <div className={styles.traceBody}>
                    <div className={styles.traceLabel}>{step.label}</div>
                    <div className={styles.traceDetail}>{step.detail}</div>
                  </div>
                  <span className={`${styles.stateBadge} ${stateClass[step.state]}`}>{stateLabel[step.state]}</span>
                </article>
              ))}
            </div>

            <div className={styles.truthSplit}>
              <div>
                <span>Giao sản phẩm thành công</span>
                <strong>{deliveryLabel[scenario.delivery]}</strong>
                <small>{scenario.canonicalDeliveryEvents} bản ghi chuẩn</small>
              </div>
              <div className={styles.truthDivider} aria-hidden="true" />
              <div>
                <span>Khách đã xác nhận nhận được</span>
                <strong>{confirmationLabel[scenario.confirmation]}</strong>
                <small>Bằng chứng riêng, không tự suy ra từ việc đã giao</small>
              </div>
            </div>

            <div className={styles.actionBar}>
              <div className={styles.actionNote}>
                <CircleAlert size={22} />
                Phòng đọc chỉ hiển thị thông báo trung tính cho người đọc; lý do kỹ thuật chi tiết chỉ nằm ở màn hình kiểm thử này.
              </div>
              <Link className={styles.primaryAction} href={`/__p11/hat-mam-reading-test?scenario=${scenario.key}`}>
                Mở Phòng đọc với tình huống này <ArrowRight size={22} />
              </Link>
            </div>
          </section>
        </div>

        <section className={styles.guardrails} aria-label="Các nguyên tắc không được vượt qua">
          <div><strong>AT-08</strong><span>Dấu vết phải đủ để biết lỗi nằm ở khâu nào.</span></div>
          <div><strong>AT-09</strong><span>“Đã giao” và “Khách đã xác nhận” luôn là hai sự thật riêng.</span></div>
          <div><strong>AT-10</strong><span>Không lộ nội dung riêng tư, mã truy cập, bí mật hoặc dữ liệu định danh không cần thiết.</span></div>
          <div><strong>KHÔNG VƯỢT RÀO</strong><span>Tình huống bị chặn không được có nút ép giao hoặc đường vòng công khai.</span></div>
        </section>
      </main>
    </>
  );
}
