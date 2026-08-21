import Head from "next/head";
import Link from "next/link";
import type { FormEvent } from "react";
import HomeFooter from "@/components/homepage/HomeFooter";
import styles from "@/styles/advisory.module.css";

const operatingQuestions = [
  "Chúng ta đang giải quyết vấn đề kinh doanh nào?",
  "Công việc cần thay đổi ở đâu?",
  "Ai chịu trách nhiệm cho kết quả?",
  "Hệ thống AI đang dựa vào nguồn nào?",
  "Đâu là dữ kiện, đâu là suy luận?",
  "Ai cần kiểm lại trước khi đầu ra đó được dùng cho một quyết định?",
];

const routeBItems = [
  "nhiều cách ứng dụng nhưng chưa rõ cái nào đáng mở rộng;",
  "công cụ AI được đặt vào cách làm việc cũ;",
  "mỗi đội ngũ thử theo một cách khác nhau;",
  "trách nhiệm và cách kiểm soát đầu ra chưa rõ.",
];

const fitItems = [
  "Có một vấn đề kinh doanh đủ quan trọng phía sau câu chuyện ứng dụng AI;",
  "Có người đủ quyền quyết định và chịu trách nhiệm;",
  "Tổ chức sẵn sàng xem lại cách công việc đang vận hành;",
  "Công nghệ AI đã hoặc sắp ảnh hưởng đáng kể đến cách làm việc hoặc quyết định.",
];

function AdvisoryHeader() {
  return (
    <header className={styles.header} data-shell="advisory-header-exception">
      <div className={styles.headerInner}>
        <Link href="/" aria-label="Về trang chủ" className={styles.brandLink}>
          <span className={styles.brandLockup}>
            <img src="/brand/logo/kenji-signature-2026.svg" alt="Kenji Phạm" />
            <img src="/brand/logo/essence-wordmark-minimal-2026.svg" alt="Essence Coaching" />
          </span>
        </Link>
        <Link href="/ve-kenji" className={styles.trustLink}>Về Kenji</Link>
      </div>
    </header>
  );
}

function ContextForm() {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} data-form-transport="pending-contract">
      <div className={styles.field}>
        <label htmlFor="advisory-role">Vai trò và tổ chức</label>
        <p id="advisory-role-help">Anh/chị đang phụ trách điều gì?</p>
        <textarea id="advisory-role" name="roleAndOrganization" rows={3} required aria-describedby="advisory-role-help" />
      </div>
      <div className={`${styles.field} ${styles.fieldPriority}`}>
        <label htmlFor="advisory-problem">Vấn đề cần giải quyết</label>
        <p id="advisory-problem-help">Vấn đề nào đang cần được giải quyết nhất?</p>
        <textarea id="advisory-problem" name="businessPriority" rows={5} required aria-describedby="advisory-problem-help" />
      </div>
      <div className={styles.field}>
        <label htmlFor="advisory-ai-state">Hiện trạng ứng dụng AI</label>
        <p id="advisory-ai-state-help">Doanh nghiệp đang dùng hoặc đã thử công cụ AI ở đâu?</p>
        <textarea id="advisory-ai-state" name="aiState" rows={3} required aria-describedby="advisory-ai-state-help" />
      </div>
      <div className={styles.field}>
        <label htmlFor="advisory-why-now">Vì sao là lúc này?</label>
        <p id="advisory-why-now-help">Vì sao vấn đề này cần được xử lý lúc này?</p>
        <textarea id="advisory-why-now" name="whyNow" rows={3} required aria-describedby="advisory-why-now-help" />
      </div>
      <button type="submit" className={styles.primaryButton}>Gửi bối cảnh vấn đề</button>
    </form>
  );
}

export default function AdvisoryPage() {
  return (
    <>
      <Head><meta name="robots" content="noindex, nofollow" /></Head>
      <AdvisoryHeader />

      <main className={styles.page}>
        <section className={`${styles.section} ${styles.hero} ${styles.statementScene} ${styles.rhythmOpen}`} data-review-crop="hero">
          <div className={styles.shell}>
            <div className={styles.heroStatement}>
              <h1 className={styles.displayVoice} data-type-scale="hero">DOANH NGHIỆP ĐÃ DÙNG NHIỀU CÔNG CỤ AI HƠN. NHƯNG ĐIỀU GÌ THỰC SỰ TỐT LÊN?</h1>
              <div className={`${styles.readingVoice} ${styles.heroArgument}`}>
                <p>Trí tuệ nhân tạo (AI) có thể đã xuất hiện ở nhiều nơi trong doanh nghiệp. Một số thử nghiệm đã chạy. Một vài đội ngũ đã dùng khá sâu.</p>
                <p>Nhưng nếu công việc vẫn gần như cũ, trách nhiệm còn mờ, quyết định chưa tốt hơn và giá trị tạo ra vẫn khó nhìn thấy, thì vấn đề có lẽ không còn nằm ở chuyện thiếu thêm công cụ.</p>
                <p>Lúc này, điều đáng nhìn hơn là:</p>
              </div>
            </div>
            <blockquote className={`${styles.accentVoice} ${styles.heroSignal}`}>“Điều gì trong doanh nghiệp thực sự cần thay đổi — và công nghệ này nên tham gia vào phần nào?”</blockquote>
            <div className={styles.heroClose}>
              <p className={styles.readingVoice}>Tôi thường bắt đầu từ chính câu hỏi đó khi làm việc cùng Founder và đội ngũ điều hành.</p>
              <a href="#boi-canh" className={styles.lightCta}>Trao đổi về một vấn đề kinh doanh cụ thể</a>
            </div>
          </div>
        </section>

        <section className={`${styles.section} ${styles.reframeSection} ${styles.diagnosticScene} ${styles.rhythmGo}`}>
          <div className={styles.shell}>
            <div className={styles.reframeOpening}>
              <h2 className={styles.sectionAnchor} data-type-scale="section">KHI TRÍ TUỆ NHÂN TẠO ĐI VÀO VẬN HÀNH, BÀI TOÁN CŨNG THAY ĐỔI</h2>
              <div className={styles.readingVoice}>
                <p>Lúc đầu, câu hỏi thường là: “Các công cụ AI có thể giúp chúng ta làm gì?”</p>
                <p>Nhưng khi công nghệ này đi vào vận hành, câu hỏi đó không còn đủ nữa.</p>
                <p>Một công cụ tốt chưa chắc làm cách vận hành hiệu quả hơn. Câu trả lời nhanh chưa chắc dẫn tới quyết định tốt hơn.</p>
                <p>Và một đầu ra từ hệ thống AI nghe rất thuyết phục vẫn có thể sai ở đúng chỗ quan trọng nhất.</p>
              </div>
            </div>
            <div className={styles.diagnosticField}>
              <p className={styles.diagnosticIntro}>Lúc này, có vài điều cần nhìn rõ:</p>
              <ol className={styles.diagnosticList}>
                {operatingQuestions.map((item, index) => (
                  <li key={item}>
                    <span className={styles.questionNumber} aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ol>
            </div>
            <p className={styles.judgmentAnchor}>Công nghệ này có thể tham gia rất sâu, nhưng người chịu trách nhiệm vẫn phải biết mình đang dựa vào điều gì để quyết định.</p>
          </div>
        </section>

        <section className={`${styles.section} ${styles.startingStates} ${styles.diagnosticScene} ${styles.rhythmGo}`} data-review-crop="starting-states">
          <div className={styles.shell}>
            <h2 className={styles.sectionAnchor} data-type-scale="section">HAI ĐIỂM XUẤT PHÁT</h2>
            <div className={styles.stateComposition} data-state-composition>
              <article className={styles.routeB}>
                <p className={styles.routeLead}>Tôi gặp tình huống này nhiều hơn: doanh nghiệp đã dùng các công cụ AI ở khá nhiều chỗ, nhưng giá trị tạo ra vẫn còn rời rạc:</p>
                <ul className={styles.editorialList}>{routeBItems.map((item) => <li key={item}>{item}</li>)}</ul>
              </article>
              <article className={styles.routeA} data-advisory-route-a>
                <p data-route-a-kicker>MỘT ĐIỂM XUẤT PHÁT KHÁC</p>
                <p data-route-a-body>Có những Founder hoặc CEO đã nhìn thấy AI sẽ ảnh hưởng đáng kể đến doanh nghiệp, nhưng chọn không vội thêm công cụ hay khởi động một chương trình lớn.</p>
                <p data-route-a-emphasis>Họ muốn hiểu rõ điều gì thực sự cần thay đổi trước — để đầu tư đúng chỗ.</p>
              </article>
            </div>
          </div>
        </section>

        <section className={`${styles.ahaScene} ${styles.statementScene} ${styles.rhythmQuiet}`} data-review-crop="aha">
          <div className={styles.signalShell}>
            <span className={styles.ahaMarker} aria-hidden="true" />
            <p className={`${styles.accentVoice} ${styles.ahaLead}`} data-type-scale="aha-lead">Giá trị không nằm ở việc dùng thêm công cụ.</p>
            <p className={`${styles.displayVoice} ${styles.ahaSignal}`} data-type-scale="aha-signal">Nó nằm ở việc thay đổi đúng chỗ trong cách doanh nghiệp vận hành.</p>
          </div>
        </section>

        <section className={`${styles.section} ${styles.valueSection} ${styles.decisionScene} ${styles.rhythmOpen}`} data-review-crop="tangible-value">
          <div className={styles.shell}>
            <div className={styles.valueOpening}>
              <h2 className={styles.sectionAnchor} data-type-scale="section">SAU BƯỚC ĐẦU, LÃNH ĐẠO CÓ GÌ TRONG TAY?</h2>
              <div className={styles.readingVoice}>
                <p>Điểm bắt đầu thường là một ưu tiên kinh doanh cụ thể: nơi giá trị đang bị mất, quyết định đang vướng mắc hoặc trách nhiệm chưa rõ.</p>
                <p>Sau bước đầu, lãnh đạo cần có ba điều đủ rõ để quyết định bước tiếp theo.</p>
              </div>
            </div>

            <div className={styles.decisionAssets}>
              <article className={`${styles.decisionAsset} ${styles.decisionAssetOne}`}>
                <div className={styles.editorialNumeral} aria-label="1">01</div>
                <div className={styles.assetContent}>
                  <h3 data-type-scale="decision-heading">BẢN ĐỒ GIÁ TRỊ &amp; CÁCH CÔNG NGHỆ AI ĐANG ĐƯỢC DÙNG</h3>
                  <p>Thấy công nghệ AI đang được dùng ở đâu, giá trị đang mất ở đâu và phần nào nên dừng, sửa, thử hoặc mở rộng.</p>
                </div>
              </article>
              <article className={`${styles.decisionAsset} ${styles.decisionAssetTwo}`}>
                <div className={styles.editorialNumeral} aria-label="2">02</div>
                <div className={styles.assetContent}>
                  <h3 data-type-scale="decision-heading">BẢN ĐỒ QUYẾT ĐỊNH &amp; TRÁCH NHIỆM</h3>
                  <p>Rõ ai quyết định, ai chịu trách nhiệm, chỗ nào cần người kiểm lại và khoảng trống trách nhiệm nằm ở đâu.</p>
                </div>
              </article>
              <article className={`${styles.decisionAsset} ${styles.decisionAssetThree}`}>
                <div className={styles.editorialNumeral} aria-label="3">03</div>
                <div className={styles.assetContent}>
                  <h3 data-type-scale="decision-heading">LỘ TRÌNH 90 NGÀY ĐỂ KIỂM CHỨNG GIÁ TRỊ</h3>
                  <p>Chọn 1–2 ưu tiên để kiểm chứng, cùng người chịu trách nhiệm, bằng chứng cần thấy và tiêu chí để tiếp tục, điều chỉnh hoặc dừng.</p>
                </div>
              </article>
            </div>

            <div className={styles.valueClose}>
              <div className={styles.readingVoice}>
                <p>Tài liệu chỉ có ý nghĩa nếu nó giúp lãnh đạo đủ rõ để quyết định điều gì đáng làm tiếp — và điều gì không.</p>
                <p>Đôi khi, kết luận tốt nhất vẫn là: “Chưa nên làm.” Hoặc: “Phần này không cần dùng công nghệ AI.”</p>
              </div>
              <a href="#boi-canh" className={styles.lightCta}>Trao đổi về một ưu tiên kinh doanh</a>
            </div>
          </div>
        </section>

        <section className={`${styles.section} ${styles.authoritySection} ${styles.humanProofScene} ${styles.rhythmOpen}`} data-review-crop="advisor-judgment">
          <div className={`${styles.shell} ${styles.advisorStage}`}>
            <figure className={styles.portraitWrap}>
              <img src="/images/advisory/advisory-kenji-portrait-friendly-editorial-selected-v02.webp" alt="Kenji ngồi trên ghế trong không gian sáng, mặc sơ mi trắng." loading="lazy" decoding="async" className={styles.portrait} />
            </figure>
            <div className={styles.advisorContent}>
              <h2 className={styles.sectionAnchor} data-type-scale="section">CÁCH TÔI NHÌN MỘT VẤN ĐỀ CÓ ỨNG DỤNG AI</h2>
              <p className={`${styles.readingVoice} ${styles.advisorIntro}`}>Khi công nghệ này đi vào vận hành, giá trị, phản ứng của đội ngũ và chất lượng quyết định thường đi cùng nhau.</p>

              <div className={styles.judgmentPath}>
                <article className={styles.judgmentStep}>
                  <p className={styles.utilityVoice}>KINH DOANH</p>
                  <p className={styles.pathText}>Vấn đề nào đáng giải, giá trị nằm ở đâu và doanh nghiệp sẵn sàng đánh đổi điều gì?</p>
                </article>
                <article className={styles.judgmentStep}>
                  <p className={styles.utilityVoice}>TÂM LÝ &amp; PHÁN ĐOÁN</p>
                  <p className={styles.pathText}>Có người còn dè dặt, có người lại tin quá nhanh. Một đầu ra từ hệ thống AI nghe hợp lý cũng có thể khiến người ra quyết định dừng phản biện quá sớm.</p>
                </article>
                <article className={styles.judgmentStep}>
                  <p className={styles.utilityVoice}>HỆ THỐNG AI &amp; CHẤT LƯỢNG ĐẦU RA</p>
                  <p className={styles.pathText}>Hệ thống AI nên tham gia ở đâu, dựa trên nguồn nào, ai kiểm lại và quyết định cuối cùng thuộc về ai?</p>
                </article>
              </div>

              <p className={styles.boundaryNote}>Khi vấn đề đi sâu vào kỹ thuật, dữ liệu, bảo mật, tích hợp hay kiến trúc hệ thống, đó là lúc cần đúng chuyên gia kỹ thuật bước vào.</p>
            </div>
          </div>
        </section>

        <section className={`${styles.section} ${styles.proofSection} ${styles.humanProofScene} ${styles.rhythmQuiet}`} data-review-crop="essence">
          <div className={styles.shell}>
            <div className={styles.proofIntro}>
              <h2 className={styles.sectionAnchor} data-type-scale="section">VÌ SAO TÔI NHÌN VẤN ĐỀ THEO CÁCH NÀY?</h2>
              <p className={styles.proofCredentials}>Cách nhìn này được hình thành qua hơn 20 năm làm việc, kinh doanh và lãnh đạo, trong đó có giai đoạn tôi là Founder/CEO của BHT Media và chịu trách nhiệm P&amp;L. Tôi cũng có hơn 3.000 giờ coaching và đào tạo với C-Level, quản lý và chủ doanh nghiệp; năm 2021, tôi đạt chứng nhận ICF ACC.</p>
            </div>

            <article className={styles.essenceProof}>
              <div className={styles.essenceCopy}>
                <h3>ESSENCE — NƠI TÔI TRỰC TIẾP VẬN HÀNH CÁCH LÀM NÀY</h3>
                <div className={styles.readingVoice}>
                  <p>ESSENCE là hệ kinh doanh tôi trực tiếp xây và vận hành. Ở đây, các công cụ AI được dùng sâu nhưng không được mặc định là đúng: nguồn phải rõ, trách nhiệm phải rõ, đầu ra phải có người kiểm lại và quyết định cuối cùng phải có người chịu trách nhiệm.</p>
                  <p>Khi làm việc với một doanh nghiệp khác, tôi không áp một mô hình có sẵn. Tôi bắt đầu từ vấn đề cụ thể, cách công việc đang vận hành và người đang chịu trách nhiệm.</p>
                  <p>Tôi tin một hệ tốt bắt đầu khi đúng người giữ đúng trách nhiệm.</p>
                </div>
              </div>
              <figure className={styles.loopWrap}>
                <img src="/images/advisory/advisory-essence-operating-loop-selected-v01.webp" alt="Sơ đồ vòng lặp vận hành ESSENCE: Nguồn thật → Quyền hạn → AI hỗ trợ → Người kiểm lại → Quyết định → Bằng chứng → Điều chỉnh cách làm." width={1254} height={1254} loading="lazy" decoding="async" className={styles.loopImage} />
              </figure>
            </article>
          </div>
        </section>

        <section className={`${styles.section} ${styles.fitSection} ${styles.diagnosticScene} ${styles.rhythmGo}`}>
          <div className={`${styles.shell} ${styles.fitLayout}`}>
            <div className={styles.fitPrimary}>
              <h2 className={styles.sectionAnchor} data-type-scale="section">CUỘC TRAO ĐỔI NÀY THƯỜNG NÊN BẮT ĐẦU KHI:</h2>
              <ul className={styles.fitList}>{fitItems.map((item) => <li key={item}>{item}</li>)}</ul>
            </div>
            <div className={styles.fitContext}>
              <p>Quy mô không phải tiêu chí đầu tiên. Quan trọng hơn là vấn đề có đủ ảnh hưởng và người chịu trách nhiệm chính có thực sự muốn thay đổi cách làm hay không.</p>
              <p className={styles.nonFit}>Nếu điều anh/chị đang cần chủ yếu là đào tạo sử dụng công cụ AI cơ bản, chatbot/agent dựng sẵn, triển khai kỹ thuật trọn gói hoặc một lời cam kết chắc chắn về ROI, có lẽ đây chưa phải cuộc trao đổi phù hợp.</p>
            </div>
          </div>
        </section>

        <section id="boi-canh" className={`${styles.section} ${styles.formSection} ${styles.statementScene} ${styles.rhythmQuiet}`} data-review-crop="form-footer">
          <div className={`${styles.shell} ${styles.formLayout}`}>
            <div className={styles.formScene}>
              <h2 className={styles.sectionAnchor} data-type-scale="section">HÃY BẮT ĐẦU BẰNG MỘT VẤN ĐỀ CỤ THỂ</h2>
              <div className={styles.readingVoice}>
                <p>Anh/chị không cần chuẩn bị sẵn một chiến lược ứng dụng AI hoàn chỉnh, cũng không cần biết trước giải pháp.</p>
                <p>Chỉ cần mang đến một vấn đề kinh doanh đang gặp phải để cùng nhìn rõ.</p>
              </div>
            </div>
            <div className={styles.formColumn}>
              <ContextForm />
              <div className={styles.formAfter}>
                <p>Tôi sẽ đọc trước để hiểu bối cảnh và xem một cuộc trao đổi sâu hơn có thực sự hữu ích không. Nếu phù hợp, chúng ta bắt đầu từ chính vấn đề đó.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <HomeFooter />

      <style jsx global>{`
        main [data-state-composition] {
          grid-template-columns: minmax(0, 1.55fr) minmax(340px, 0.95fr);
          gap: 64px;
        }

        main [data-advisory-route-a] {
          margin-top: 0;
          align-self: stretch;
          display: flex;
          flex-direction: column;
          padding: 34px 32px 36px;
          border-top: 1px solid var(--essence-text-primary-2026);
          border-left: 1px solid var(--essence-border-light-2026);
          background: color-mix(in srgb, var(--essence-cream-2026) 46%, transparent);
          color: var(--essence-text-primary-2026);
        }

        main [data-route-a-kicker] {
          margin: 0;
          font-family: Inter, Arial, sans-serif;
          font-size: 11px;
          line-height: 1.4;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          font-weight: 600;
          color: var(--essence-text-secondary-2026);
        }

        main [data-route-a-body] {
          margin: 26px 0 0;
          font-family: Inter, Arial, sans-serif;
          font-size: 18px;
          line-height: 1.72;
          font-weight: 400;
        }

        main [data-route-a-emphasis] {
          margin: auto 0 0;
          padding-top: 26px;
          border-top: 1px solid var(--essence-border-light-2026);
          font-family: "Cormorant Garamond", Georgia, serif;
          font-size: clamp(22px, 1.8vw, 26px);
          line-height: 1.36;
          font-style: italic;
          font-weight: 400;
          letter-spacing: -0.006em;
        }

        main [data-type-scale="hero"] {
          font-size: clamp(54px, 5.55vw, 81px);
        }

        main [data-type-scale="section"] {
          font-size: clamp(36px, 3.6vw, 52px);
        }

        main [data-type-scale="aha-lead"] {
          font-size: clamp(25px, 2.5vw, 34px);
        }

        main [data-type-scale="aha-signal"] {
          font-size: clamp(52px, 5.4vw, 79px);
        }

        main [data-type-scale="decision-heading"] {
          font-size: clamp(34px, 3.35vw, 47px);
        }

        @media (max-width: 1020px) and (min-width: 721px) {
          main [data-state-composition] {
            grid-template-columns: minmax(0, 1.25fr) minmax(280px, 0.75fr);
            gap: 46px;
          }
        }

        @media (max-width: 720px) {
          main [data-state-composition] {
            grid-template-columns: 1fr;
            gap: 38px;
          }

          main [data-advisory-route-a] {
            padding: 28px 22px 30px;
            border-left: 0;
          }

          main [data-route-a-kicker] {
            font-size: 10px;
          }

          main [data-route-a-body] {
            margin-top: 22px;
            font-size: 17px;
            line-height: 1.7;
          }

          main [data-route-a-emphasis] {
            margin-top: 26px;
            padding-top: 22px;
            font-size: 22px;
            line-height: 1.38;
          }

          main [data-type-scale="hero"] {
            font-size: clamp(38px, 10.8vw, 50px);
          }

          main [data-type-scale="section"] {
            font-size: clamp(31px, 8.8vw, 40px);
          }

          main [data-type-scale="aha-lead"] {
            font-size: 25px;
          }

          main [data-type-scale="aha-signal"] {
            font-size: clamp(43px, 11.7vw, 58px);
          }

          main [data-type-scale="decision-heading"] {
            font-size: 32px;
          }
        }
      `}</style>
    </>
  );
}
