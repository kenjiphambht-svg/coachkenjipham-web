import Head from "next/head";
import Link from "next/link";
import type { FormEvent } from "react";
import styles from "@/styles/advisory.module.css";

const operatingQuestions = [
  "Chúng ta đang giải quyết vấn đề kinh doanh nào?",
  "Công việc thực sự cần thay đổi ở đâu?",
  "Ai chịu trách nhiệm cho kết quả?",
  "AI đang dựa vào nguồn nào, và nguồn đó có đủ đáng tin không?",
  "Đâu là dữ kiện, đâu là suy luận?",
  "Ai cần kiểm lại trước khi một output ảnh hưởng đến quyết định?",
];

const routeBItems = [
  "nhiều use case nhưng chưa rõ cái nào đáng mở rộng;",
  "AI được thêm vào workflow cũ;",
  "mỗi đội ngũ thử theo một cách khác nhau;",
  "trách nhiệm và cách kiểm soát đầu ra chưa rõ;",
  "hoạt động ngày càng nhiều nhưng giá trị kinh doanh vẫn khó nhìn thấy.",
];

const valueMapItems = [
  "AI đang được dùng hoặc được cân nhắc ở đâu;",
  "giá trị đang bị thất thoát ở chỗ nào;",
  "phần nào đang trùng lặp, phân mảnh hoặc chưa đáng tiếp tục;",
  "đâu là use case đáng ưu tiên;",
  "và việc nào nên STOP, FIX, PILOT hoặc SCALE.",
];

const decisionMapItems = [
  "ai sở hữu quyết định;",
  "ai chịu trách nhiệm cho kết quả;",
  "công việc đang được chuyển giao giữa những vai trò nào;",
  "ở đâu cần người kiểm lại trước khi AI ảnh hưởng đến công việc quan trọng;",
  "và điểm nào đang tạo ra ma sát, chậm trễ hoặc khoảng trống trách nhiệm.",
];

const roadmapItems = [
  "tối đa một vài ưu tiên chính;",
  "một hoặc hai thử nghiệm có giá trị;",
  "baseline hoặc dấu mốc để biết mình đang cải thiện điều gì;",
  "người sở hữu;",
  "tiêu chí để biết nên tiếp tục, điều chỉnh hay dừng;",
  "và specialist nào cần tham gia nếu bài toán bước sang chuyên môn sâu hơn.",
];

const fitItems = [
  "phía sau câu chuyện AI là một vấn đề kinh doanh đủ quan trọng;",
  "có người thực sự có quyền quyết định và chịu trách nhiệm cho kết quả;",
  "tổ chức sẵn sàng xem lại cách công việc đang vận hành, không chỉ mua thêm tool;",
  "AI đã hoặc sắp ảnh hưởng đáng kể đến workflow và quyết định;",
  "khi cần, sẵn sàng đưa đúng specialist kỹ thuật vào.",
];

const nonFitItems = [
  "đào tạo AI cơ bản hoặc một danh sách công cụ;",
  "chatbot hay agent dựng sẵn;",
  "software development, systems integration hoặc triển khai kỹ thuật trọn gói;",
  "một lời cam kết chắc chắn về ROI hay kết quả chuyển đổi.",
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
        <Link href="/ve-kenji" className={styles.trustLink}>
          Về Kenji
        </Link>
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
        <p id="advisory-ai-state-help">Tổ chức đã thử những gì?<br />Điều gì đang hoạt động và điều gì chưa?</p>
        <textarea id="advisory-ai-state" name="aiState" rows={4} required aria-describedby="advisory-ai-state-help" />
      </div>
      <div className={styles.field}>
        <label htmlFor="advisory-why-now">Tại sao là lúc này?</label>
        <p id="advisory-why-now-help">Điều gì khiến vấn đề này cần được giải quyết bây giờ?</p>
        <textarea id="advisory-why-now" name="whyNow" rows={3} required aria-describedby="advisory-why-now-help" />
      </div>
      <button type="submit" className={styles.primaryButton}>
        Gửi bối cảnh vấn đề
      </button>
    </form>
  );
}

export default function AdvisoryPage() {
  return (
    <>
      <Head>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <AdvisoryHeader />

      <main className={styles.page}>
        <section className={`${styles.section} ${styles.hero} ${styles.rhythmOpen}`}>
          <div className={styles.shell}>
            <div className={styles.heroStatement}>
              <h1 className={styles.displayVoice}>CÓ NHIỀU CÔNG CỤ AI HƠN DOANH NGHIỆP SẼ TẠO RA NHIỀU GIÁ TRỊ HƠN?</h1>
              <div className={`${styles.readingVoice} ${styles.heroArgument}`}>
                <p>Tool AI có thể đã xuất hiện ở nhiều nơi trong doanh nghiệp.</p>
                <p>Một vài đội ngũ dùng khá sâu. Một số pilot đã chạy. Có những kết quả ban đầu rất hứa hẹn.</p>
                <p>Nhưng nếu công việc vẫn diễn ra gần như cũ, trách nhiệm chưa rõ, quyết định chưa tốt hơn và giá trị tạo ra vẫn khó nhìn thấy, thì có lẽ vấn đề không còn nằm ở việc thiếu thêm công cụ.</p>
                <p>Điều đáng nhìn lúc này là:</p>
              </div>
            </div>

            <blockquote className={`${styles.accentVoice} ${styles.heroSignal}`}>
              “Điều gì trong doanh nghiệp thực sự cần thay đổi — và AI nên tham gia vào phần nào?”
            </blockquote>

            <div className={styles.heroClose}>
              <div className={styles.readingVoice}>
                <p>Đó cũng là nơi tôi thường bắt đầu khi làm việc cùng Founder và đội ngũ điều hành: từ một vấn đề kinh doanh đủ quan trọng để cùng nhìn cho rõ, thay vì một danh sách công cụ.</p>
                <div className={styles.lineGroup}>
                  <p>Để từ đó, lãnh đạo biết chắc hơn:</p>
                  <p>việc nào đáng làm,</p>
                  <p>việc nào nên dừng,</p>
                  <p>và bước tiếp theo nào thực sự đáng để đầu tư.</p>
                </div>
              </div>
              <a href="#boi-canh" className={styles.lightCta}>Trao đổi về một vấn đề kinh doanh thực tế</a>
            </div>
          </div>
        </section>

        <section className={`${styles.section} ${styles.reframeSection} ${styles.rhythmGo}`}>
          <div className={`${styles.shell} ${styles.reframeLayout}`}>
            <div className={styles.reframeArgument}>
              <h2 className={styles.sectionAnchor}>KHI ÁP DỤNG AI ĐI VÀO CÔNG VIỆC THẬT, BÀI TOÁN CŨNG THAY ĐỔI</h2>
              <div className={styles.readingVoice}>
                <p>Lúc đầu, câu hỏi thường là:</p>
                <p className={styles.inlineSignal}>“AI có thể giúp chúng ta làm gì?”</p>
                <p>Nhưng khi AI bắt đầu đi vào công việc thật, câu hỏi đó chưa đủ nữa.</p>
                <p>Một công cụ tốt không tự làm workflow tốt lên. Một câu trả lời nhanh không đồng nghĩa với một quyết định tốt hơn. Và một output nghe rất thuyết phục cũng chưa chắc đủ đáng tin để đưa vào công việc quan trọng.</p>
              </div>
            </div>

            <div className={styles.diagnosticField}>
              <p className={styles.utilityVoice}>Lúc đó, doanh nghiệp cần nhìn rõ hơn:</p>
              <ol className={styles.diagnosticList}>
                {operatingQuestions.map((item, index) => (
                  <li key={item}>
                    <span className={styles.questionNumber}>{String(index + 1).padStart(2, "0")}</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ol>
            </div>

            <div className={styles.judgmentAnchor}>
              <p>AI có thể tham gia rất sâu.</p>
              <p>Nhưng người chịu trách nhiệm vẫn cần biết mình đang dựa vào điều gì để quyết định.</p>
              <p className={styles.accentVoice}>Đó là khác biệt giữa việc chỉ dùng AI và việc đưa AI vào một cách làm việc có trách nhiệm.</p>
            </div>
          </div>
        </section>

        <section className={`${styles.section} ${styles.startingStates} ${styles.rhythmGo}`}>
          <div className={styles.shell}>
            <h2 className={styles.sectionAnchor}>HAI ĐIỂM XUẤT PHÁT. MỘT CÁNH CỬA.</h2>

            <div className={styles.stateComposition}>
              <article className={styles.routeB}>
                <h3 className={styles.routeTitle}>Trường hợp tôi gặp nhiều hơn: Nhiều tool AI đã có, nhưng giá trị vẫn còn rời rạc.</h3>
                <p>Doanh nghiệp có thể đã có khá nhiều hoạt động AI:</p>
                <ul className={styles.editorialList}>
                  {routeBItems.map((item) => <li key={item}>{item}</li>)}
                </ul>
                <div className={styles.routeQuestion}>
                  <p>Nếu đang ở đây, câu hỏi có lẽ không còn là:</p>
                  <p>“Chúng ta cần thêm công cụ nào?”</p>
                  <p>Mà là:</p>
                  <p className={styles.accentVoice}>“Điều gì trong cách doanh nghiệp đang vận hành khiến những gì đã có vẫn chưa tạo ra giá trị tương xứng?”</p>
                </div>
              </article>

              <article className={styles.routeA}>
                <h3 className={styles.routeTitle}>Một trường hợp khác: biết AI quan trọng nhưng không muốn bắt đầu sai.</h3>
                <div className={styles.readingVoice}>
                  <p>Có những Founder hoặc CEO biết AI sẽ ảnh hưởng đến doanh nghiệp, nhưng cũng không muốn lao ngay vào tool, chatbot hay một chương trình chuyển đổi lớn khi chưa rõ mình thực sự cần thay đổi điều gì.</p>
                  <p>Trong trường hợp đó, tôi vẫn muốn bắt đầu từ một việc rất thực:</p>
                  <p className={styles.routeAEmphasis}>Một vấn đề kinh doanh đủ quan trọng.</p>
                  <p>Có thể nó đang tốn tiền, tốn thời gian, ảnh hưởng khách hàng, làm chậm tăng trưởng hoặc đơn giản là một điểm mắc mà lãnh đạo không muốn tiếp tục mang theo.</p>
                </div>
              </article>
            </div>
          </div>

          <div className={`${styles.signatureMoment} ${styles.rhythmQuiet}`} data-review-crop="m3">
            <div className={styles.signalShell}>
              <p className={styles.readingVoice}>Dù bắt đầu ở trạng thái nào, nguyên tắc vẫn giống nhau:</p>
              <p className={styles.signatureLine}>Một vấn đề kinh doanh thật trước. AI sau.</p>
            </div>
          </div>
        </section>

        <section className={`${styles.section} ${styles.authoritySection} ${styles.rhythmOpen}`}>
          <div className={styles.shell}>
            <div className={styles.authorityOpening}>
              <div>
                <h2 className={styles.sectionAnchor}>CÁCH TÔI NHÌN MỘT VẤN ĐỀ CÓ AI</h2>
                <div className={styles.readingVoice}>
                  <p>Tôi không nhìn một bài toán AI chỉ bằng công nghệ.</p>
                  <p>Khi AI bắt đầu chạm vào công việc thật, nó thường chạm cùng lúc vào cách doanh nghiệp tạo giá trị, cách đội ngũ phản ứng với thay đổi và chất lượng của những quyết định được đưa ra.</p>
                  <p>Tôi thường nhìn vấn đề qua ba góc.</p>
                </div>
              </div>

              <figure className={styles.portraitWrap}>
                <img
                  src="/images/advisory/advisory-kenji-portrait-selected-v01.webp"
                  alt="Kenji tại bàn làm việc trong không gian tối giản, với laptop và sổ ghi chép."
                  width={1448}
                  height={1086}
                  loading="lazy"
                  decoding="async"
                  className={styles.portrait}
                />
              </figure>
            </div>

            <div className={styles.lenses}>
              <article className={styles.lensPrimary}>
                <p className={styles.utilityVoice}>KINH DOANH</p>
                <div className={styles.lensQuestions}>
                  <p>Vấn đề nào thật sự đáng giải?</p>
                  <p>Giá trị nằm ở đâu?</p>
                  <p>Ưu tiên nào quan trọng hơn?</p>
                  <p>Doanh nghiệp sẵn sàng đánh đổi điều gì?</p>
                </div>
              </article>

              <article>
                <p className={styles.utilityVoice}>TÂM LÝ &amp; PHÁN ĐOÁN</p>
                <div className={styles.readingVoice}>
                  <p>Không phải ai cũng phản ứng với AI giống nhau.</p>
                  <p>Có người chưa tin. Có người lại tin quá nhanh. Có người bắt đầu lo vai trò của mình sẽ thay đổi.</p>
                  <p>Và đôi khi, một câu trả lời AI nghe quá hợp lý lại khiến người ra quyết định dừng phản biện sớm hơn họ nên làm.</p>
                  <p>Những điều đó không nằm ngoài bài toán vận hành. Chúng ảnh hưởng trực tiếp đến cách một tổ chức thay đổi và ra quyết định.</p>
                </div>
              </article>

              <article>
                <p className={styles.utilityVoice}>AI &amp; CHẤT LƯỢNG ĐẦU RA</p>
                <div className={styles.lensQuestions}>
                  <p>AI nên hỗ trợ phần nào?</p>
                  <p>Kết quả đó dựa trên nguồn gì?</p>
                  <p>Có đủ đáng tin để sử dụng không?</p>
                  <p>Ai cần kiểm lại?</p>
                  <p>Và đến đâu thì quyết định cuối cùng vẫn phải thuộc về người chịu trách nhiệm?</p>
                </div>
              </article>
            </div>

            <div className={styles.integratedView}>
              <p className={styles.integratedTitle}>Kinh doanh × Tâm lý × AI</p>
              <div className={styles.readingVoice}>
                <p>Tôi không xem đây là ba dịch vụ khác nhau.</p>
                <p>Trong thực tế, chúng thường nằm trong cùng một vấn đề.</p>
                <div className={styles.lineGroup}>
                  <p>Điều tôi muốn giúp lãnh đạo nhìn rõ là:</p>
                  <p>điều gì thực sự cần thay đổi,</p>
                  <p>việc nào đáng làm trước,</p>
                  <p>ai cần chịu trách nhiệm,</p>
                  <p>AI nên tham gia ở đâu,</p>
                  <p>và lúc nào cần đưa đúng specialist vào cuộc.</p>
                </div>
              </div>
              <div className={styles.boundaryNote}>
                <p>Khi bài toán đi sâu sang engineering, data, security, integration hay technical architecture, đó là lúc cần đúng người chuyên môn tham gia.</p>
                <p>Một hệ tốt không cần một người làm tất cả.</p>
                <p>Nó cần đúng người giữ đúng phần trách nhiệm của mình.</p>
              </div>
            </div>
          </div>
        </section>

        <section className={`${styles.section} ${styles.valueSection} ${styles.rhythmOpen}`} data-review-crop="m5">
          <div className={styles.shell}>
            <div className={styles.valueOpening}>
              <h2 className={styles.sectionAnchor}>BẮT ĐẦU TỪ MỘT VẤN ĐỀ, KHÔNG PHẢI MỘT CUỘC CHUYỂN ĐỔI LỚN</h2>
              <div className={styles.readingVoice}>
                <p>Tôi không nghĩ doanh nghiệp nên bắt đầu bằng một chương trình lớn chỉ vì AI đang là một chủ đề quan trọng.</p>
                <p>Tôi thích bắt đầu nhỏ hơn và thật hơn:</p>
                <p className={styles.inlineSignal}>Một ưu tiên kinh doanh cụ thể.</p>
                <p>Chúng ta cùng nhìn vào nơi giá trị đang bị mất, công việc hiện đang diễn ra thế nào, quyết định đang mắc ở đâu, ai đang chịu trách nhiệm và AI đã được thử ra sao.</p>
                <p>Mục tiêu không phải tạo thêm một bộ slide.</p>
                <p>Mà là đi đến một vài quyết định đủ rõ để hành động.</p>
                <p>Sau bước đầu tiên, quyết định có thể rất đơn giản: dừng một việc chưa đáng làm, sửa lại workflow, thử trong phạm vi nhỏ, mở rộng thứ đã có bằng chứng hoặc chuyển phần kỹ thuật cho đúng specialist.</p>
              </div>
            </div>

            <div className={styles.valueQuestion}>
              <h3>SAU BƯỚC ĐẦU, LÃNH ĐẠO CÓ GÌ TRONG TAY?</h3>
              <div className={styles.readingVoice}>
                <p>Tôi không muốn một cuộc trao đổi kết thúc bằng cảm giác:</p>
                <p className={styles.accentVoice}>“Chúng ta đã hiểu vấn đề rõ hơn.”</p>
                <p>Rõ hơn là cần thiết. Nhưng chưa đủ.</p>
                <p>Tùy điểm xuất phát của doanh nghiệp, hình thức cụ thể có thể khác nhau. Nhưng bước đầu thường cần để lại ba thứ đủ rõ để lã đạo có thể tiếp tục quyết định và hành động.</p>
              </div>
            </div>

            <div className={styles.decisionAssets}>
              <article className={styles.decisionAsset}>
                <div className={styles.assetNumber}>1.</div>
                <div className={styles.assetContent}>
                  <h4>BẢN ĐỒ GIÁ TRỊ &amp; VẬN HÀNH AI</h4>
                  <p>Một bức tranh đủ gọn để thấy:</p>
                  <ul className={styles.editorialList}>
                    {valueMapItems.map((item) => <li key={item}>{item}</li>)}
                  </ul>
                  <p>Nếu doanh nghiệp mới bắt đầu với AI, bản đồ này tập trung nhiều hơn vào kết quả kinh doanh cần đạt, thực tế vận hành hiện tại và nơi AI thực sự đáng tham gia.</p>
                </div>
              </article>

              <article className={styles.decisionAsset}>
                <div className={styles.assetNumber}>2.</div>
                <div className={styles.assetContent}>
                  <h4>BẢN ĐỒ QUYẾT ĐỊNH, VAI TRÒ &amp; ĐIỂM KIỂM SOÁT</h4>
                  <p>AI chỉ tạo được giá trị bền khi phía sau nó có trách nhiệm rõ.</p>
                  <p>Bản đồ này giúp nhìn ra:</p>
                  <ul className={styles.editorialList}>
                    {decisionMapItems.map((item) => <li key={item}>{item}</li>)}
                  </ul>
                </div>
              </article>

              <article className={styles.decisionAsset}>
                <div className={styles.assetNumber}>3.</div>
                <div className={styles.assetContent}>
                  <h4>LỘ TRÌNH THỬ NGHIỆM GIÁ TRỊ 90 NGÀY</h4>
                  <p>Không phải một roadmap dài đầy dự án.</p>
                  <p>Chỉ là một số ít ưu tiên đáng kiểm chứng tiếp:</p>
                  <ul className={styles.editorialList}>
                    {roadmapItems.map((item) => <li key={item}>{item}</li>)}
                  </ul>
                </div>
              </article>
            </div>

            <div className={styles.valueClose}>
              <div className={styles.readingVoice}>
                <p>Mục tiêu của ba phần này không phải tạo thêm tài liệu.</p>
                <div className={styles.lineGroup}>
                  <p>Mà là để sau bước đầu, lãnh đạo có thể nhìn vào cùng một bức tranh và trả lời rõ hơn:</p>
                  <p>Chúng ta đang cố tạo ra giá trị gì?</p>
                  <p>Điều gì thực sự cần thay đổi?</p>
                  <p>Ai chịu trách nhiệm?</p>
                  <p>AI nên tham gia đến đâu?</p>
                  <p>Và bằng chứng nào sẽ khiến chúng ta tiếp tục — hoặc dừng lại?</p>
                </div>
                <p>Không phải vấn đề nào cũng kết thúc bằng một dự án mới.</p>
                <p>Đôi khi, quyết định tốt nhất là:</p>
                <p className={styles.accentVoice}>“Chưa nên làm.”</p>
                <p>Hoặc:</p>
                <p className={styles.accentVoice}>“Phần này không cần AI.”</p>
                <p>Tránh được một khoản đầu tư sai đôi khi cũng có giá trị không kém việc tìm ra một cơ hội đúng.</p>
              </div>
              <a href="#boi-canh" className={styles.lightCta}>Trao đổi về một ưu tiên kinh doanh</a>
            </div>
          </div>
        </section>

        <section className={`${styles.section} ${styles.proofSection} ${styles.rhythmQuiet}`} data-review-crop="m6">
          <div className={styles.shell}>
            <div className={styles.proofIntro}>
              <h2 className={styles.sectionAnchor}>VÌ SAO TÔI NHÌN VẤN ĐỀ THEO CÁCH NÀY?</h2>
              <div className={styles.readingVoice}>
                <p>Cách tôi làm việc hôm nay không đến từ một vai trò duy nhất.</p>
                <p>Nó được hình thành qua nhiều năm làm kinh doanh, lãnh đạo, làm việc sâu với tâm lý và quyết định, và gần đây là trực tiếp xây những hệ thống có AI hỗ trợ.</p>
              </div>
            </div>

            <div className={styles.proofPair}>
              <article>
                <p className={styles.utilityVoice}>KINH DOANH</p>
                <p className={styles.proofLead}>Tôi có hơn 20 năm kinh nghiệm làm việc và lãnh đạo, từng làm việc trong môi trường doanh nghiệp tập đoàn đa quốc gia và từng là Founder/CEO của BHT Media với trách nhiệm P&amp;L.</p>
                <p>Tôi hiểu một quyết định không chỉ cần nghe hợp lý.</p>
                <p>Nó còn phải sống được với nguồn lực, đội ngũ và thực tế vận hành.</p>
              </article>

              <article>
                <p className={styles.utilityVoice}>TÂM LÝ &amp; QUYẾT ĐỊNH</p>
                <p className={styles.proofLead}>Tôi có hơn 5 năm thực hành coaching và hơn 3.000 giờ coaching &amp; training với C-Level, managers và business owners; tôi đạt chứng nhận ICF Associate Certified Coach năm 2021.</p>
                <p>Nền tảng đó khiến tôi chú ý nhiều hơn đến niềm tin, sự phản kháng, thiên kiến, thay đổi vai trò và cách người chịu trách nhiệm giữ được phán đoán của mình khi công việc bắt đầu thay đổi bởi AI.</p>
              </article>
            </div>

            <article className={styles.essenceProof}>
              <div className={styles.essenceCopy}>
                <h3>ESSENCE — NƠI TÔI ĐANG TRỰC TIẾP LÀM ĐIỀU MÌNH NÓI</h3>
                <div className={styles.readingVoice}>
                  <p>ESSENCE là hệ kinh doanh tôi đang trực tiếp xây, nơi AI được sử dụng sâu trong nhiều phần công việc.</p>
                  <p>Nhưng AI không mặc định được xem là đúng.</p>
                  <p>Mỗi việc cần rõ nguồn nào đáng tin, AI được giao phần nào, ai kiểm lại, bằng chứng nào đủ tốt và quyết định cuối cùng thuộc về ai.</p>
                  <p>Đó là bằng chứng công việc trong chính hệ tôi đang vận hành.</p>
                  <p>Không phải một client case, và tôi cũng không dùng nó để suy rộng thành một tuyên bố rằng mình đã làm AI transformation cho nhiều doanh nghiệp khác.</p>
                </div>
              </div>

              <figure className={styles.loopWrap}>
                <img
                  src="/images/advisory/advisory-essence-operating-loop-selected-v01.webp"
                  alt="Sơ đồ vòng lặp vận hành ESSENCE: Nguồn thật → Quyền hạn → AI hỗ trợ → Người kiểm lại → Quyết định → Bằng chứng → Điều chỉnh cách làm."
                  width={1254}
                  height={1254}
                  loading="lazy"
                  decoding="async"
                  className={styles.loopImage}
                />
              </figure>
            </article>

            <div className={styles.proofBoundary}>
              <h3>Rõ phạm vi để làm việc tốt hơn</h3>
              <div className={styles.readingVoice}>
                <p>Phần tôi có thể mang lại nhiều giá trị nhất là giúp lãnh đạo làm rõ vấn đề kinh doanh, chất lượng quyết định, cách vận hành, sự thích nghi của đội ngũ và cách AI được sử dụng có trách nhiệm.</p>
                <p>Khi bài toán bước sang chuyên môn kỹ thuật sâu, tôi muốn đúng specialist bước vào.</p>
                <p>Tôi tin một hệ tốt bắt đầu từ việc đúng người giữ đúng trách nhiệm.</p>
              </div>
            </div>
          </div>
        </section>

        <section className={`${styles.section} ${styles.fitSection} ${styles.rhythmGo}`}>
          <div className={`${styles.shell} ${styles.fitLayout}`}>
            <div className={styles.fitPrimary}>
              <h2 className={styles.sectionAnchor}>KHI NÀO CUỘC TRAO ĐỔI NÀY CÓ THỂ HỮU ÍCH?</h2>
              <p className={styles.fitLead}>Có lẽ chúng ta nên nói chuyện nếu:</p>
              <ul className={styles.fitList}>
                {fitItems.map((item) => <li key={item}>{item}</li>)}
              </ul>
              <div className={styles.readingVoice}>
                <p>Quy mô không phải tiêu chí đầu tiên.</p>
                <p>Quan trọng hơn là vấn đề có đủ thật, quyền quyết định có đủ rõ và người sở hữu có thực sự muốn thay đổi cách làm việc hay không.</p>
              </div>
            </div>

            <aside className={styles.nonFit}>
              <p className={styles.nonFitLead}>Có thể chúng ta chưa phù hợp nếu điều anh/chị cần chủ yếu là:</p>
              <ul className={styles.editorialList}>
                {nonFitItems.map((item) => <li key={item}>{item}</li>)}
              </ul>
              <p className={styles.accentVoice}>Biết điều đó sớm vẫn tốt hơn bắt đầu một dự án không đúng.</p>
            </aside>
          </div>
        </section>

        <section id="boi-canh" className={`${styles.section} ${styles.formSection} ${styles.rhythmQuiet}`}>
          <div className={`${styles.shell} ${styles.formLayout}`}>
            <div className={styles.formScene}>
              <h2 className={styles.sectionAnchor}>HÃY BẮT ĐẦU BẰNG MỘT VẤN ĐỀ THẬT</h2>
              <div className={styles.readingVoice}>
                <p>Anh/chị không cần chuẩn bị một AI strategy hoàn chỉnh.</p>
                <p>Cũng không cần biết trước giải pháp.</p>
                <p>Chỉ cần mang đến một vấn đề đủ thật để đáng cùng nhìn.</p>
              </div>
              <p className={styles.formInvitation}>Cho tôi một chút bối cảnh</p>
            </div>

            <div className={styles.formColumn}>
              <ContextForm />
              <div className={styles.formAfter}>
                <p>Tôi sẽ đọc trước để hiểu tình hình và xem một cuộc trao đổi sâu hơn có thực sự hữu ích hay không.</p>
                <p>Nếu chúng ta nói chuyện, tôi muốn bắt đầu từ vấn đề thật của doanh nghiệp — không mặc định giải pháp và cũng không mặc định rằng anh/chị cần một chương trình lớn.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <span>Kenji Phạm</span>
          <Link href="/chinh-sach-rieng-tu">Chính sách riêng tư</Link>
        </div>
      </footer>
    </>
  );
}
