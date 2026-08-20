import Head from "next/head";
import Link from "next/link";
import type { FormEvent } from "react";
import styles from "@/styles/advisory.module.css";

const operatingQuestions = [
  "Chúng ta đang giải quyết vấn đề kinh doanh nào?",
  "Công việc thực sự cần thay đổi ở đâu?",
  "Ai chịu trách nhiệm cho kết quả?",
  "AI đang dựa vào nguồn nào?",
  "Đâu là dữ kiện, đâu là suy luận?",
  "Ai cần kiểm lại trước khi đầu ra AI ảnh hưởng đến quyết định?",
];

const routeBItems = [
  "nhiều use case nhưng chưa rõ cái nào đáng mở rộng;",
  "AI được thêm vào workflow cũ;",
  "mỗi đội ngũ thử theo một cách khác nhau;",
  "trách nhiệm và cách kiểm soát đầu ra chưa rõ.",
];

const fitItems = [
  "phía sau câu chuyện AI là một vấn đề kinh doanh đủ quan trọng;",
  "có người thực sự có quyền quyết định và chịu trách nhiệm;",
  "tổ chức sẵn sàng xem lại cách công việc đang vận hành;",
  "AI đã hoặc sắp ảnh hưởng đáng kể đến workflow hoặc quyết định.",
];

function AdvisoryHeader() {
  return (
    <header className={styles.header}>
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
      <div className={styles.field}>
        <label htmlFor="advisory-problem">Vấn đề kinh doanh quan trọng nhất</label>
        <p id="advisory-problem-help">Điều gì đang đủ tốn kém, đủ quan trọng hoặc ảnh hưởng đủ lớn để cần giải quyết?</p>
        <textarea id="advisory-problem" name="businessPriority" rows={4} required aria-describedby="advisory-problem-help" />
      </div>
      <div className={styles.field}>
        <label htmlFor="advisory-ai-state">AI hiện đang ở đâu?</label>
        <p id="advisory-ai-state-help">Tổ chức đã thử những gì? Điều gì đang hoạt động và điều gì chưa?</p>
        <textarea id="advisory-ai-state" name="aiState" rows={4} required aria-describedby="advisory-ai-state-help" />
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
        <section className={`${styles.section} ${styles.hero} ${styles.rhythmOpen}`}>
          <div className={styles.shell}>
            <div className={styles.heroStatement}>
              <h1 className={styles.displayVoice}>CÓ NHIỀU CÔNG CỤ AI HƠN, DOANH NGHIỆP TẠO RA NHIỀU GIÁ TRỊ HƠN ?</h1>
              <div className={`${styles.readingVoice} ${styles.heroArgument}`}>
                <p>AI có thể đã xuất hiện ở nhiều nơi trong doanh nghiệp. Một số pilot đã chạy. Một vài đội ngũ dùng khá sâu.</p>
                <p>Nhưng nếu công việc vẫn gần như cũ, trách nhiệm còn mờ, quyết định chưa tốt hơn và giá trị tạo ra vẫn khó nhìn thấy, thì vấn đề có lẽ không còn nằm ở chuyện thiếu thêm công cụ.</p>
                <p>Lúc này, điều đáng nhìn hơn là:</p>
              </div>
            </div>
            <blockquote className={`${styles.accentVoice} ${styles.heroSignal}`}>“Điều gì trong doanh nghiệp thực sự cần thay đổi — và AI nên tham gia vào phần nào?”</blockquote>
            <div className={styles.heroClose}>
              <p className={styles.readingVoice}>Và đó thường là nơi tôi bắt đầu khi làm việc cùng Founder và đội ngũ điều hành.</p>
              <a href="#boi-canh" className={styles.lightCta}>Trao đổi về một vấn đề kinh doanh thực tế</a>
            </div>
          </div>
        </section>

        <section className={`${styles.section} ${styles.reframeSection} ${styles.rhythmGo}`}>
          <div className={`${styles.shell} ${styles.reframeLayout}`}>
            <div className={styles.reframeArgument}>
              <h2 className={styles.sectionAnchor}>KHI AI ĐI VÀO CÔNG VIỆC THẬT, BÀI TOÁN CŨNG THAY ĐỔI</h2>
              <div className={styles.readingVoice}>
                <p>Lúc đầu, câu hỏi thường là: “AI có thể giúp chúng ta làm gì?”</p>
                <p>Nhưng đến khi AI đi vào công việc thật, câu hỏi đó không còn đủ nữa.</p>
                <p>Một công cụ tốt không tự làm workflow tốt lên. Câu trả lời nhanh chưa chắc dẫn tới quyết định tốt hơn. Và một đầu ra AI nghe rất thuyết phục vẫn có thể sai ở đúng chỗ quan trọng nhất.</p>
              </div>
            </div>
            <div className={styles.diagnosticField}>
              <p className={styles.diagnosticIntro}>Lúc này, cần nhìn cho rõ vài điều:</p>
              <ol className={styles.diagnosticList}>
                {operatingQuestions.map((item, index) => (
                  <li key={item}><span className={styles.questionNumber}>{String(index + 1).padStart(2, "0")}</span><span>{item}</span></li>
                ))}
              </ol>
            </div>
            <p className={styles.judgmentAnchor}>AI có thể tham gia rất sâu, nhưng người chịu trách nhiệm vẫn phải biết mình đang dựa vào điều gì để quyết định.</p>
          </div>
        </section>

        <section className={`${styles.section} ${styles.startingStates} ${styles.rhythmGo}`}>
          <div className={styles.shell}>
            <h2 className={styles.sectionAnchor}>HAI ĐIỂM XUẤT PHÁT</h2>
            <div className={styles.stateComposition}>
              <article className={styles.routeB}>
                <p className={styles.routeLead}>Trường hợp tôi gặp nhiều hơn là doanh nghiệp đã dùng AI ở khá nhiều chỗ, nhưng giá trị tạo ra vẫn còn rời rạc:</p>
                <ul className={styles.editorialList}>{routeBItems.map((item) => <li key={item}>{item}</li>)}</ul>
                <p className={styles.routeQuestion}>Nếu đang ở đây, câu hỏi không còn là “cần thêm công cụ nào?”, mà là điều gì trong cách doanh nghiệp đang vận hành khiến những gì đã có vẫn chưa tạo ra giá trị tương xứng.</p>
              </article>
              <article className={styles.routeA}>
                <p>Ở một điểm xuất phát khác, Founder hoặc CEO biết AI quan trọng nhưng không muốn bắt đầu bằng tool hay một chương trình lớn khi chưa rõ doanh nghiệp thực sự cần thay đổi điều gì.</p>
              </article>
            </div>
          </div>
          <div className={`${styles.signatureMoment} ${styles.rhythmQuiet}`} data-review-crop="m3">
            <div className={styles.signalShell}>
              <p className={styles.signatureLine}>MỘT VẤN ĐỀ KINH DOANH THẬT TRƯỚC. AI SAU.</p>
            </div>
          </div>
        </section>

        <section className={`${styles.section} ${styles.valueSection} ${styles.rhythmOpen}`} data-review-crop="m4">
          <div className={styles.shell}>
            <div className={styles.valueOpening}>
              <h2 className={styles.sectionAnchor}>SAU BƯỚC ĐẦU, LÃNH ĐẠO CÓ GÌ TRONG TAY?</h2>
              <div className={styles.readingVoice}>
                <p>Điểm bắt đầu thường là một ưu tiên kinh doanh cụ thể: nơi giá trị đang bị mất, quyết định đang mắc hoặc trách nhiệm chưa rõ.</p>
                <p>Sau bước đầu, điều tôi muốn lãnh đạo có trong tay là ba thứ đủ rõ để tiếp tục ra quyết định.</p>
              </div>
            </div>

            <div className={styles.decisionAssets}>
              <article className={styles.decisionAsset}>
                <div className={styles.editorialNumeral} aria-label="1">01</div>
                <div className={styles.assetContent}>
                  <h3>BẢN ĐỒ GIÁ TRỊ &amp; VẬN HÀNH AI</h3>
                  <p>Nhìn rõ AI đang tham gia ở đâu, nên tham gia đến đâu, giá trị đang thất thoát chỗ nào, phần nào trùng lặp hoặc phân mảnh, use case nào đáng ưu tiên và việc gì nên dừng, sửa, thử hay mở rộng.</p>
                </div>
              </article>
              <article className={styles.decisionAsset}>
                <div className={styles.editorialNumeral} aria-label="2">02</div>
                <div className={styles.assetContent}>
                  <h3>BẢN ĐỒ QUYẾT ĐỊNH, VAI TRÒ &amp; ĐIỂM KIỂM SOÁT</h3>
                  <p>Làm rõ ai có quyền quyết, ai chịu trách nhiệm, công việc đang được chuyển giao giữa những vai trò nào, điểm nào cần người kiểm lại và khoảng trống trách nhiệm nằm ở đâu.</p>
                </div>
              </article>
              <article className={styles.decisionAsset}>
                <div className={styles.editorialNumeral} aria-label="3">03</div>
                <div className={styles.assetContent}>
                  <h3>LỘ TRÌNH THỬ NGHIỆM GIÁ TRỊ 90 NGÀY</h3>
                  <p>Chọn 1–2 ưu tiên đáng kiểm chứng, xác định người sở hữu, baseline hoặc dấu mốc cần theo dõi, bằng chứng cần thấy, tiêu chí để tiếp tục, điều chỉnh hay dừng — và khi nào cần đúng technical specialist bước vào.</p>
                </div>
              </article>
            </div>

            <div className={styles.valueClose}>
              <div className={styles.readingVoice}>
                <p>Mục tiêu không phải có thêm tài liệu, mà là để lãnh đạo đủ rõ để quyết định điều gì đáng làm tiếp — và điều gì không.</p>
                <p>Và đôi khi, kết luận tốt nhất vẫn là: “Chưa nên làm.” Hoặc: “Phần này không cần AI.”</p>
              </div>
              <a href="#boi-canh" className={styles.lightCta}>Trao đổi về một ưu tiên kinh doanh</a>
            </div>
          </div>
        </section>

        <section className={`${styles.section} ${styles.authoritySection} ${styles.rhythmOpen}`}>
          <div className={styles.shell}>
            <div className={styles.authorityOpening}>
              <div>
                <h2 className={styles.sectionAnchor}>CÁCH TÔI NHÌN MỘT VẤN ĐỀ CÓ AI</h2>
                <p className={styles.readingVoice}>Tôi không nhìn một bài toán AI chỉ bằng công nghệ. Khi AI đi vào công việc thật, bài toán cũng kéo theo câu chuyện về giá trị, cách đội ngũ phản ứng và chất lượng quyết định.</p>
              </div>
              <figure className={styles.portraitWrap}>
                <img src="/images/advisory/advisory-kenji-portrait-selected-v01.webp" alt="Kenji tại bàn làm việc trong không gian tối giản, với laptop và sổ ghi chép." width={1448} height={1086} loading="lazy" decoding="async" className={styles.portrait} />
              </figure>
            </div>

            <div className={styles.lenses}>
              <article className={styles.lensPrimary}>
                <p className={styles.utilityVoice}>KINH DOANH</p>
                <p className={styles.lensText}>Vấn đề nào đáng giải, giá trị nằm ở đâu và doanh nghiệp sẵn sàng đánh đổi điều gì?</p>
              </article>
              <article className={styles.lensJudgment}>
                <p className={styles.utilityVoice}>TÂM LÝ &amp; PHÁN ĐOÁN</p>
                <p className={styles.lensText}>Không phải ai cũng phản ứng với AI giống nhau. Có người còn dè dặt, có người lại tin quá nhanh. Và đôi khi, một đầu ra AI nghe quá hợp lý có thể khiến người ra quyết định dừng phản biện sớm hơn họ nên làm.</p>
              </article>
              <article className={styles.lensAI}>
                <p className={styles.utilityVoice}>AI &amp; CHẤT LƯỢNG ĐẦU RA</p>
                <p className={styles.lensText}>AI nên tham gia ở đâu, dựa trên nguồn nào, ai kiểm lại và quyết định cuối cùng thuộc về ai?</p>
              </article>
            </div>

            <div className={styles.integratedView}>
              <p className={styles.integratedTitle}>Tôi không tách ba phần này thành ba dịch vụ. Trong thực tế, chúng thường nằm trong cùng một vấn đề vận hành.</p>
              <p className={styles.boundaryNote}>Khi công việc đi sâu sang engineering, data, security, integration hay technical architecture, đó là lúc cần đúng specialist bước vào.</p>
            </div>
          </div>
        </section>

        <section className={`${styles.section} ${styles.proofSection} ${styles.rhythmQuiet}`} data-review-crop="m6">
          <div className={styles.shell}>
            <div className={styles.proofIntro}>
              <h2 className={styles.sectionAnchor}>VÌ SAO TÔI NHÌN VẤN ĐỀ THEO CÁCH NÀY?</h2>
              <p className={styles.proofCredentials}>Cách nhìn này được hình thành qua hơn 20 năm kinh doanh và lãnh đạo, trong đó có giai đoạn tôi là Founder/CEO của BHT Media với trách nhiệm P&amp;L. Tôi cũng có hơn 3.000 giờ coaching &amp; training với C-Level, managers và business owners, và đạt chứng nhận ICF ACC vào năm 2021.</p>
            </div>

            <article className={styles.essenceProof}>
              <div className={styles.essenceCopy}>
                <h3>ESSENCE — NƠI TÔI ĐANG TRỰC TIẾP LÀM ĐIỀU MÌNH NÓI</h3>
                <div className={styles.readingVoice}>
                  <p>ESSENCE là hệ kinh doanh tôi đang trực tiếp xây và vận hành.</p>
                  <p>Ở đây, AI được dùng sâu nhưng không mặc định là đúng. Với mỗi việc, cần rõ nguồn nào đáng tin, AI được giao phần nào, ai kiểm lại, bằng chứng nào đủ tốt và quyết định cuối cùng thuộc về ai.</p>
                  <p>Đó là bằng chứng từ chính hệ tôi đang vận hành — không phải một client case, cũng không phải cơ sở để nói rằng tôi đã dẫn dắt AI transformation cho nhiều doanh nghiệp khác.</p>
                  <p>Tôi tin một hệ tốt bắt đầu từ việc đúng người giữ đúng trách nhiệm.</p>
                </div>
              </div>
              <figure className={styles.loopWrap}>
                <img src="/images/advisory/advisory-essence-operating-loop-selected-v01.webp" alt="Sơ đồ vòng lặp vận hành ESSENCE: Nguồn thật → Quyền hạn → AI hỗ trợ → Người kiểm lại → Quyết định → Bằng chứng → Điều chỉnh cách làm." width={1254} height={1254} loading="lazy" decoding="async" className={styles.loopImage} />
              </figure>
            </article>
          </div>
        </section>

        <section className={`${styles.section} ${styles.fitSection} ${styles.rhythmGo}`}>
          <div className={`${styles.shell} ${styles.fitLayout}`}>
            <div className={styles.fitPrimary}>
              <h2 className={styles.sectionAnchor}>KHI NÀO CUỘC TRAO ĐỔI NÀY ĐÁNG ĐỂ BẮT ĐẦU?</h2>
              <p className={styles.fitLead}>Cuộc trao đổi này thường đáng bắt đầu khi:</p>
              <ul className={styles.fitList}>{fitItems.map((item) => <li key={item}>{item}</li>)}</ul>
            </div>
            <div className={styles.fitContext}>
              <p>Tôi thường làm việc trực tiếp với Founder, CEO và người có quyền quyết định trên những vấn đề đủ quan trọng để ảnh hưởng đến cách tổ chức vận hành.</p>
              <p>Quy mô không phải tiêu chí đầu tiên. Quan trọng hơn là vấn đề có đủ thật và người sở hữu có thực sự muốn thay đổi cách làm việc hay không.</p>
              <p className={styles.nonFit}>Nếu điều anh/chị đang cần chủ yếu là đào tạo AI cơ bản, chatbot/agent dựng sẵn, triển khai kỹ thuật trọn gói hoặc một lời cam kết chắc chắn về ROI, có lẽ đây chưa phải cuộc trao đổi phù hợp.</p>
            </div>
          </div>
        </section>

        <section id="boi-canh" className={`${styles.section} ${styles.formSection} ${styles.rhythmQuiet}`}>
          <div className={`${styles.shell} ${styles.formLayout}`}>
            <div className={styles.formScene}>
              <h2 className={styles.sectionAnchor}>HÃY BẮT ĐẦU BẰNG MỘT VẤN ĐỀ THẬT</h2>
              <div className={styles.readingVoice}>
                <p>Anh/chị không cần chuẩn bị một AI strategy hoàn chỉnh và cũng không cần biết trước giải pháp.</p>
                <p>Chỉ cần mang đến một vấn đề kinh doanh đủ thật để đáng cùng nhìn.</p>
              </div>
            </div>
            <div className={styles.formColumn}>
              <ContextForm />
              <div className={styles.formAfter}>
                <p>Tôi sẽ đọc trước để hiểu bối cảnh và xem liệu một cuộc trao đổi sâu hơn có thực sự hữu ích hay không. Nếu phù hợp, chúng ta bắt đầu từ chính vấn đề đó.</p>
                <p>Chưa cần mặc định trước giải pháp, cũng chưa cần bắt đầu bằng một chương trình lớn.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className={styles.footer}><div className={styles.footerInner}><span>Kenji Phạm</span><Link href="/chinh-sach-rieng-tu">Chính sách riêng tư</Link></div></footer>
    </>
  );
}
