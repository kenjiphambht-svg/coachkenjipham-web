import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ArrowLeft, BookOpenText, Clock3, FlaskConical, LockKeyhole, ShieldCheck } from 'lucide-react';
import styles from '../../styles/p11-hm-test.module.css';
import { hatMamScenarios, type HatMamScenarioKey } from '../../lib/p11-hm-synthetic-fixtures';

function isScenarioKey(value: string | string[] | undefined): value is HatMamScenarioKey {
  return typeof value === 'string' && value in hatMamScenarios;
}

export default function HatMamReadingTestPage() {
  const router = useRouter();
  const scenario = router.isReady && isScenarioKey(router.query.scenario)
    ? hatMamScenarios[router.query.scenario]
    : null;

  const renderDenied = (testerReason?: string) => (
    <section className={styles.deniedWrap} aria-live="polite">
      <div className={styles.deniedIcon}><LockKeyhole size={26} /></div>
      <div className={styles.eyebrow}>PHÒNG ĐỌC RIÊNG TƯ</div>
      <h1>Không thể mở nội dung này với quyền hiện tại.</h1>
      <p>Quyền truy cập có thể đã thay đổi hoặc nội dung này không thuộc tài khoản đang sử dụng. Nội dung riêng tư chưa được tải.</p>
      <div className={styles.deniedBoundary}>
        <ShieldCheck size={17} />
        <span>Customer view không hiển thị owner, version, artifact metadata hay internal reason code.</span>
      </div>
      <Link href="/__p11/hat-mam-founder-test" className={styles.secondaryAction}>Quay lại màn hình test</Link>
      {testerReason ? <div className={styles.testerOnly}>{testerReason}</div> : null}
    </section>
  );

  return (
    <>
      <Head>
        <title>Hạt Mầm · Private Reading Test · Synthetic</title>
        <meta name="robots" content="noindex,nofollow,noarchive" />
        <meta name="referrer" content="no-referrer" />
      </Head>

      <main className={styles.readingShell}>
        <header className={styles.readingTopbar}>
          <Link href="/__p11/hat-mam-founder-test" className={styles.backLink}><ArrowLeft size={16} /> Founder Test View</Link>
          <div className={styles.syntheticBadge}><FlaskConical size={14} /> SYNTHETIC PREVIEW</div>
        </header>

        {!router.isReady ? (
          <section className={styles.deniedWrap} aria-live="polite" aria-busy="true">
            <div className={styles.deniedIcon}><ShieldCheck size={26} /></div>
            <div className={styles.eyebrow}>PHÒNG ĐỌC RIÊNG TƯ</div>
            <h1>Đang kiểm tra quyền truy cập…</h1>
            <p>Nội dung riêng tư chỉ được hiển thị sau khi trạng thái truy cập đã được xác định.</p>
          </section>
        ) : !scenario ? (
          renderDenied()
        ) : !scenario.readingAllowed ? (
          renderDenied(`TEST HARNESS · ${scenario.at} · internal reason: ${scenario.reasonCode}`)
        ) : (
          <div className={styles.readingLayout}>
            <article className={styles.readingArticle}>
              <div className={styles.readingKicker}>HẠT MẦM · BẢN ĐỌC RIÊNG</div>
              <h1>Hạt Mầm</h1>
              <p className={styles.readingSubtitle}>Một khoảng để nhìn lại điều đang lớn lên bên trong.</p>

              <div className={styles.readingMeta}>
                <span><BookOpenText size={15} /> Phiên bản hiện tại · v{scenario.currentVersion}</span>
                <span><Clock3 size={15} /> Bản synthetic để kiểm trải nghiệm đọc</span>
              </div>

              <div className={styles.syntheticContentNotice}>Nội dung dưới đây là fixture mô phỏng bố cục đọc, không phải ấn phẩm của khách thật và không phải customer copy đã phát hành.</div>

              <section className={styles.readingSection}>
                <div className={styles.sectionNumber}>01</div>
                <h2>Một điều đang hiện ra</h2>
                <p>Có những lúc mình không thiếu câu trả lời. Điều còn thiếu chỉ là một khoảng đủ yên để nhận ra câu trả lời nào thật sự thuộc về mình, và điều nào chỉ là phản xạ đã quen.</p>
                <p>Trong bản mô phỏng này, phần nội dung được giữ vừa đủ dài để kiểm nhịp đọc, độ rộng cột chữ, khoảng thở và cảm giác riêng tư trên màn hình lớn lẫn điện thoại.</p>
              </section>

              <section className={styles.readingSection}>
                <div className={styles.sectionNumber}>02</div>
                <h2>Một câu hỏi nhỏ</h2>
                <blockquote>Nếu không cần chứng minh điều gì với ai, lúc này bạn muốn giữ lại điều gì — và muốn buông điều gì?</blockquote>
                <p>Không cần trả lời ngay. Một câu hỏi tốt có thể ở lại đủ lâu để mình nhìn một lựa chọn quen thuộc bằng một góc khác.</p>
              </section>

              <section className={styles.readingSection}>
                <div className={styles.sectionNumber}>03</div>
                <h2>Mang một điều ra đời sống</h2>
                <p>Chọn một việc nhỏ có thể làm trong hôm nay: nói rõ một điều, dừng một phản xạ, thử một cách khác hoặc đơn giản là ghi lại điều vừa nhận ra.</p>
                <p className={styles.closingLine}>Insight chỉ bắt đầu có ý nghĩa khi nó đi cùng mình ra khỏi trang này.</p>
              </section>
            </article>

            <aside className={styles.readingSide}>
              <div className={styles.sideCard}>
                <div className={styles.sideLabel}>Quyền truy cập</div>
                <strong>Đang hợp lệ</strong>
                <span>Exact version v{scenario.currentVersion}</span>
                <span>P11 · {scenario.p11Review}</span>
                <span>Access · {scenario.access}</span>
              </div>
              <div className={styles.sideCardMuted}>
                <div className={styles.sideLabel}>Delivery ≠ Confirmation</div>
                <span>Delivery: {scenario.delivery}</span>
                <span>Confirmed: {scenario.confirmation}</span>
                <small>Việc mở trang không tự tạo Customer Confirmed.</small>
              </div>
              <Link href="/__p11/hat-mam-founder-test" className={styles.secondaryAction}>Quay lại Founder Test</Link>
            </aside>
          </div>
        )}
      </main>
    </>
  );
}
