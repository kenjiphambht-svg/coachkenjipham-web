import Head from "next/head";
import Link from "next/link";
import type { FormEvent } from "react";
import HomeFooter from "@/components/homepage/HomeFooter";
import styles from "@/styles/advisory.module.css";

// Preview rebuild marker: portrait-v02 binary hotfix; no runtime behavior.
const operatingQuestions = [
  "Chúng ta đang giải quyết vấn đề kinh doanh nào?",
  "Công việc thực sự cần thay đổi ở đâu?",
  "Ai chịu trách nhiệm cho kết quả?",
  "Hệ thống AI đang dựa vào nguồn nào?",
  "Đâu là dữ kiện, đâu là suy luận?",
  "Ai cần kiểm lại trước khi đầu ra từ hệ thống AI, ảnh hưởng đến quyết định?",
];

const routeBItems = [
  "nhiều cách ứng dụng nhưng chưa rõ cái nào đáng mở rộng;",
  "công cụ AI được đặt vào cách làm việc cũ;",
  "mỗi đội ngũ thử theo một cách khác nhau;",
  "trách nhiệm và cách kiểm soát đầu ra chưa rõ.",
];

const fitItems = [
  "Phía sau câu chuyện ứng dụng AI là một vấn đề kinh doanh đủ quan trọng;",
  "Người thực sự có quyền quyết định và chịu trách nhiệm;",
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
        <p id="advisory-role-help">Anh/chị đang chịu trách nhiệm chính về điều gì?</p>
        <textarea id="advisory-role" name="roleAndOrganization" rows={3} required aria-describedby="advisory-role-help" />
      </div>
      <div className={`${styles.field} ${styles.fieldPriority}`}>
        <label htmlFor="advisory-problem">Vấn đề kinh doanh quan trọng nhất</label>
        <p id="advisory-problem-help">Điều gì đang đủ tốn kém, đủ quan trọng hoặc ảnh hưởng đủ lớn để cần giải quyết?</p>
        <textarea id="advisory-problem" name="businessPriority" rows={5} required aria-describedby="advisory-problem-help" />
      </div>
      <div className={styles.field}>
        <label htmlFor="advisory-ai-state">Ứng dụng AI hiện đang ở đâu?</label>
        <p id="advisory-ai-state-help">Tổ chức đã thử những gì? Điều gì đang hoạt động và điều gì chưa?</p>
        <textarea id="advisory-ai-state" name="aiState" rows={3} required aria-describedby="advisory-ai-state-help" />
      </div>
      <div className={styles.field}>
        <label htmlFor="advisory-why-now">Tại sao là lúc này?</label>
        <p id="advisory-why-now-help">Điều gì khiến vấn đề này cần được giải quyết bây giờ?</p>
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
              <h1 className={styles.displayVoice}>CÓ NHIỀU CÔNG CỤ AI HƠN, DOANH NGHIỆP TẠO RA NHIỀU GIÁ TRỊ HƠN?</h1>
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
              <h2 className={styles.sectionAnchor}>KHI TRÍ TUỆ NHÂN TẠO ĐI VÀO VẬN HÀNH, BÀI TOÁN CŨNG THAY ĐỔI</h2>
              <div className={styles.readingVoice}>
                <p>Lúc đầu, câu hỏi thường là: “Các công cụ AI có thể giúp chúng ta làm gì?”</p>
                <p>Nhưng đến khi công nghệ này đi vào công việc thật, câu hỏi đó không còn đủ nữa.</p>
                <p>Một công cụ tốt không tự làm cho cách làm việc tốt hơn. Câu trả lời nhanh chưa chắc dẫn tới quyết định tốt hơn. Và một đầu ra từ hệ thống AI nghe rất thuyết phục vẫn có thể sai ở đúng chỗ quan trọng nhất.</p>
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
            <h2 className={styles.sectionAnchor}>HAI ĐIỂM XUẤT PHÁT</h2>
            <div className={styles.stateComposition}>
              <article className={styles.routeB}>
                <p className={styles.routeLead}>Tôi gặp tình huống này nhiều hơn: doanh nghiệp đã dùng các công cụ AI ở khá nhiều chỗ, nhưng giá trị tạo ra vẫn còn rời rạc:</p>
                <ul className={styles.editorialList}>{routeBItems.map((item) => <li key={item}>{item}</li>)}</ul>
                <p className={styles.routeQuestion}>Nếu đang ở đây, câu hỏi đáng đặt không còn là “cần thêm công cụ nào?”, mà là điều gì trong cách doanh nghiệp đang vận hành khiến những gì đã có vẫn chưa tạo ra giá trị tương xứng.</p>
              </article>
              <article className={styles.routeA}>
                <p>Cũng có một điểm xuất phát khác:</p>
                <p>Founder hoặc CEO biết việc ứng dụng AI là quan trọng, nhưng không muốn lao vào thêm công cụ hay một chương trình lớn khi chưa rõ doanh nghiệp thực sự cần thay đổi điều gì.</p>
              </article>
            </div>
          </div>
        </section>

        <section className={`${styles.ahaScene} ${styles.statementScene} ${styles.rhythmQuiet}`} data-review-crop="aha">
          <div className={styles.signalShell}>
            <span className={styles.ahaMarker} aria-hidden="true" />
            <p className={`${styles.accentVoice} ${styles.ahaLead}`}>Có thể bước đầu tiên không nằm ở công nghệ AI.</p>
            <p className={`${styles.displayVoice} ${styles.ahaSignal}`}>Hãy nhìn nơi giá trị thất thoát — và công việc mắc ở đâu.</p>
          </div>
        </section>

        <section className={`${styles.section} ${styles.valueSection} ${styles.decisionScene} ${styles.rhythmOpen}`} data-review-crop="tangible-value">
          <div className={styles.shell}>
            <div className={styles.valueOpening}>
              <h2 className={styles.sectionAnchor}>SAU BƯỚC ĐẦU, LÃNH ĐẠO CÓ GÌ TRONG TAY?</h2>
              <div className={styles.readingVoice}>
                <p>Điểm bắt đầu thường là một ưu tiên kinh doanh cụ thể: nơi giá trị đang bị mất, quyết định đang vướng mắc hoặc trách nhiệm chưa rõ.</p>
                <p>Sau bước đầu, lãnh đạo cần có ba điều đủ rõ để biết nên đi tiếp thế nào.</p>
              </div>
            </div>

            <div className={styles.decisionAssets}>
              <article className={`${styles.decisionAsset} ${styles.decisionAssetOne}`}>
                <div className={styles.editorialNumeral} aria-label="1">01</div>
                <div className={styles.assetContent}>
                  <h3>BẢN ĐỒ GIÁ TRỊ &amp; CÁCH CÔNG NGHỆ AI ĐANG ĐƯỢC DÙNG</h3>
                  <p>Nhìn rõ công nghệ AI đang tham gia ở đâu, nên tham gia đến đâu; giá trị đang thất thoát chỗ nào; phần nào đang trùng lặp hoặc phân mảnh; cách dùng nào đáng ưu tiên; và việc gì nên dừng, sửa, thử hay mở rộng.</p>
                </div>
              </article>
              <article className={`${styles.decisionAsset} ${styles.decisionAssetTwo}`}>
                <div className={styles.editorialNumeral} aria-label="2">02</div>
                <div className={styles.assetContent}>
                  <h3>BẢN ĐỒ QUYẾT ĐỊNH &amp; TRÁCH NHIỆM</h3>
                  <p>Làm rõ ai có quyền quyết định, ai chịu trách nhiệm, công việc đi qua những vai trò nào, chỗ nào cần người kiểm lại và khoảng trống trách nhiệm đang nằm ở đâu.</p>
                </div>
              </article>
              <article className={`${styles.decisionAsset} ${styles.decisionAssetThree}`}>
                <div className={styles.editorialNumeral} aria-label="3">03</div>
                <div className={styles.assetContent}>
                  <h3>LỘ TRÌNH 90 NGÀY ĐỂ KIỂM CHỨNG GIÁ TRỊ</h3>
                  <p>Chọn 1–2 ưu tiên đáng kiểm chứng, xác định người chịu trách nhiệm, mốc ban đầu cần theo dõi, bằng chứng cần thấy, tiêu chí để tiếp tục, điều chỉnh hay dừng — và khi nào cần chuyên gia kỹ thuật phù hợp bước vào.</p>
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
              <h2 className={styles.sectionAnchor}>CÁCH TÔI NHÌN MỘT VẤN ĐỀ CÓ ỨNG DỤNG AI</h2>
              <p className={`${styles.readingVoice} ${styles.advisorIntro}`}>Với tôi, một bài toán có ứng dụng AI hiếm khi chỉ là chuyện công nghệ. Khi công nghệ này đi vào công việc thật, câu chuyện về giá trị, phản ứng của đội ngũ và chất lượng quyết định thường đi cùng nhau.</p>

              <div className={styles.judgmentPath}>
                <article className={styles.judgmentStep}>
                  <p className={styles.utilityVoice}>KINH DOANH</p>
                  <p className={styles.pathText}>Vấn đề nào đáng giải, giá trị nằm ở đâu và doanh nghiệp sẵn sàng đánh đổi điều gì?</p>
                </article>
                <article className={styles.judgmentStep}>
                  <p className={styles.utilityVoice}>TÂM LÝ &amp; PHÁN ĐOÁN</p>
                  <p className={styles.pathText}>Phản ứng với công nghệ AI rất khác nhau. Có người còn dè dặt, có người lại tin quá nhanh. Và đôi khi, một đầu ra từ hệ thống AI nghe quá hợp lý khiến người ra quyết định dừng phản biện quá sớm.</p>
                </article>
                <article className={styles.judgmentStep}>
                  <p className={styles.utilityVoice}>HỆ THỐNG AI &amp; CHẤT LƯỢNG ĐẦU RA</p>
                  <p className={styles.pathText}>Hệ thống AI nên tham gia ở đâu, dựa trên nguồn nào, ai kiểm lại và quyết định cuối cùng thuộc về ai?</p>
                </article>
              </div>

              <p className={`${styles.accentVoice} ${styles.integratedTitle}`}>Ba góc nhìn này thường cùng xuất hiện trong một vấn đề vận hành; tôi không xem chúng như ba dịch vụ tách rời.</p>
              <p className={styles.boundaryNote}>Khi vấn đề đi sâu vào kỹ thuật, dữ liệu, bảo mật, tích hợp hay kiến trúc hệ thống, đó là lúc cần đúng chuyên gia kỹ thuật bước vào.</p>
            </div>
          </div>
        </section>

        <section className={`${styles.section} ${styles.proofSection} ${styles.humanProofScene} ${styles.rhythmQuiet}`} data-review-crop="essence">
          <div className={styles.shell}>
            <div className={styles.proofIntro}>
              <h2 className={styles.sectionAnchor}>VÌ SAO TÔI NHÌN VẤN ĐỀ THEO CÁCH NÀY?</h2>
              <p className={styles.proofCredentials}>Cách nhìn này được hình thành qua hơn 20 năm làm kinh doanh và lãnh đạo, trong đó có giai đoạn tôi là Founder/CEO của BHT Media và chịu trách nhiệm P&amp;L. Tôi cũng có hơn 3.000 giờ coaching và đào tạo với C-Level, quản lý và chủ doanh nghiệp; năm 2021, tôi đạt chứng nhận ICF ACC.</p>
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
              <h2 className={styles.sectionAnchor}>CUỘC TRAO ĐỔI THẢO LUẬN NÀY THƯỜNG NÊN BẮT ĐẦU KHI:</h2>
              <ul className={styles.fitList}>{fitItems.map((item) => <li key={item}>{item}</li>)}</ul>
            </div>
            <div className={styles.fitContext}>
              <p>Tôi thường làm việc trực tiếp với Founder, CEO và người có quyền quyết định khi vấn đề đủ quan trọng để ảnh hưởng đến cách tổ chức vận hành.</p>
              <p>Quy mô không phải tiêu chí đầu tiên. Quan trọng hơn là vấn đề tạo ra giá tri cho khách hàng và người chịu trách nhiệm chính có thực sự muốn thay đổi cách làm việc hay không.</p>
              <p className={styles.nonFit}>Nếu điều anh/chị đang cần chủ yếu là đào tạo sử dụng công cụ AI cơ bản, chatbot/agent dựng sẵn, triển khai kỹ thuật trọn gói hoặc một lời cam kết chắc chắn về ROI, có lẽ đây chưa phải cuộc trao đổi phù hợp.</p>
            </div>
          </div>
        </section>

        <section id="boi-canh" className={`${styles.section} ${styles.formSection} ${styles.statementScene} ${styles.rhythmQuiet}`} data-review-crop="form-footer">
          <div className={`${styles.shell} ${styles.formLayout}`}>
            <div className={styles.formScene}>
              <h2 className={styles.sectionAnchor}>HÃY BẮT ĐẦU BẰNG MỘT VẤN ĐỀ CỤ THỂ</h2>
              <div className={styles.readingVoice}>
                <p>Anh/chị không cần chuẩn bị sẵn một chiến lược ứng dụng AI hoàn chỉnh, cũng không cần biết trước giải pháp.</p>
                <p>Chỉ cần mang đến một vấn đề kinh doanh đang gặp phải để cùng nhìn rõ.</p>
              </div>
            </div>
            <div className={styles.formColumn}>
              <ContextForm />
              <div className={styles.formAfter}>
                <p>Tôi sẽ đọc trước để hiểu bối cảnh và xem một cuộc trao đổi sâu hơn có thực sự hữu ích không. Nếu phù hợp, chúng ta bắt đầu từ chính vấn đề đó.</p>
                <p>Chưa cần chốt trước giải pháp, cũng chưa cần bắt đầu bằng một chương trình lớn.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <HomeFooter />
    </>
  );
}
