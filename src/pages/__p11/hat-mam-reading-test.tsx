import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ArrowLeft, BookOpenText, Clock3, FlaskConical, LockKeyhole, ShieldCheck } from 'lucide-react';
import styles from '../../styles/p11-hm-test.module.css';
import readable from '../../styles/p11-hm-readable.module.css';
import { hatMamScenarios, type HatMamScenarioKey } from '../../lib/p11-hm-synthetic-fixtures';

function isScenarioKey(value: string | string[] | undefined): value is HatMamScenarioKey {
  return typeof value === 'string' && value in hatMamScenarios;
}

const reviewLabel = {
  APPROVED: 'ĐÃ DUYỆT',
  PENDING: 'CHỜ DUYỆT',
  NEEDS_CHANGES: 'CẦN SỬA',
  REJECTED: 'KHÔNG DUYỆT',
} as const;

const accessLabel = {
  ACTIVE: 'ĐANG HIỆU LỰC',
  EXPIRED: 'ĐÃ HẾT HẠN',
  REVOKED: 'ĐÃ THU HỒI',
} as const;

const deliveryLabel = {
  NOT_RECORDED: 'CHƯA GHI NHẬN',
  SUCCEEDED: 'ĐÃ GIAO THÀNH CÔNG',
} as const;

const confirmationLabel = {
  NOT_RECORDED: 'CHƯA GHI NHẬN',
  CONFIRMED: 'KHÁCH ĐÃ XÁC NHẬN',
} as const;

export default function HatMamReadingTestPage() {
  const router = useRouter();
  const scenarioResolved = router.isReady;
  const scenarioKey: HatMamScenarioKey = isScenarioKey(router.query.scenario) ? router.query.scenario : 'approved';
  const scenario = hatMamScenarios[scenarioKey];
  const isAllowed = scenarioResolved && scenario.readingAllowed;

  return (
    <>
      <Head>
        <title>Hạt Mầm · Phòng đọc riêng · Dữ liệu giả</title>
        <meta name="robots" content="noindex,nofollow,noarchive" />
        <meta name="referrer" content="no-referrer" />
      </Head>

      <main className={`${styles.readingShell} ${readable.largeText}`}>
        <header className={styles.readingTopbar}>
          <Link href="/__p11/hat-mam-founder-test" className={styles.backLink}><ArrowLeft size={20} /> Màn hình kiểm thử</Link>
          <div className={styles.syntheticBadge}><FlaskConical size={18} /> DỮ LIỆU GIẢ</div>
        </header>

        {!scenarioResolved ? (
          <section className={styles.deniedWrap} aria-live="polite" aria-busy="true">
            <div className={styles.deniedIcon}><ShieldCheck size={28} /></div>
            <div className={styles.eyebrow}>PHÒNG ĐỌC RIÊNG TƯ</div>
            <h1>Đang kiểm tra quyền truy cập…</h1>
            <p>Nội dung riêng tư chỉ được hiển thị sau khi quyền truy cập đã được xác định.</p>
          </section>
        ) : !isAllowed ? (
          <section className={styles.deniedWrap} aria-live="polite">
            <div className={styles.deniedIcon}><LockKeyhole size={28} /></div>
            <div className={styles.eyebrow}>PHÒNG ĐỌC RIÊNG TƯ</div>
            <h1>Không thể mở nội dung này với quyền hiện tại.</h1>
            <p>Quyền truy cập có thể đã thay đổi hoặc nội dung này không thuộc tài khoản đang sử dụng. Nội dung riêng tư chưa được tải.</p>
            <div className={styles.deniedBoundary}>
              <ShieldCheck size={22} />
              <span>Màn hình của người đọc không hiển thị chủ sở hữu, phiên bản, thông tin kỹ thuật của ấn phẩm hay mã nguyên nhân nội bộ.</span>
            </div>
            <Link href="/__p11/hat-mam-founder-test" className={styles.secondaryAction}>Quay lại màn hình kiểm thử</Link>
          </section>
        ) : (
          <div className={styles.readingLayout}>
            <article className={styles.readingArticle}>
              <div className={styles.readingKicker}>HẠT MẦM · BẢN ĐỌC RIÊNG</div>
              <h1>Hạt Mầm</h1>
              <p className={styles.readingSubtitle}>Một khoảng để nhìn lại điều đang lớn lên bên trong.</p>

              <div className={readable.readingHelp}>
                <strong>Cách thử phòng đọc:</strong> Anh đọc như một khách hàng bình thường, thử cuộn từ đầu đến cuối và thử cả màn hình điện thoại. Sau đó bấm “Màn hình kiểm thử” để quay lại chọn tình huống khác.
              </div>

              <div className={styles.readingMeta}>
                <span><BookOpenText size={20} /> Phiên bản hiện tại · v{scenario.currentVersion}</span>
                <span><Clock3 size={20} /> Bản dữ liệu giả để kiểm trải nghiệm đọc</span>
              </div>

              <div className={styles.syntheticContentNotice}>Nội dung dưới đây chỉ là chữ mô phỏng để kiểm bố cục, nhịp đọc và độ dễ chịu của màn hình. Đây không phải ấn phẩm của khách thật và chưa phải nội dung phát hành.</div>

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
                <p className={styles.closingLine}>Một điều mình nhận ra chỉ bắt đầu có ý nghĩa khi nó đi cùng mình ra khỏi trang này.</p>
              </section>
            </article>

            <aside className={styles.readingSide}>
              <div className={styles.sideCard}>
                <div className={styles.sideLabel}>Quyền truy cập</div>
                <strong>Đang hợp lệ</strong>
                <span>Đúng phiên bản v{scenario.currentVersion}</span>
                <span>P11 · {reviewLabel[scenario.p11Review]}</span>
                <span>Quyền mở · {accessLabel[scenario.access]}</span>
              </div>
              <div className={styles.sideCardMuted}>
                <div className={styles.sideLabel}>Đã giao ≠ Đã xác nhận</div>
                <span>Giao sản phẩm: {deliveryLabel[scenario.delivery]}</span>
                <span>Khách xác nhận: {confirmationLabel[scenario.confirmation]}</span>
                <small>Chỉ mở trang không có nghĩa là khách đã xác nhận nhận được sản phẩm.</small>
              </div>
              <Link href="/__p11/hat-mam-founder-test" className={styles.secondaryAction}>Quay lại màn hình kiểm thử</Link>
            </aside>
          </div>
        )}
      </main>
    </>
  );
}
