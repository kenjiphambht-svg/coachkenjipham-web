import Head from "next/head";
import Link from "next/link";
import type { FormEvent } from "react";
import styles from "@/styles/advisory.module.css";

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

const operatingQuestions = [
  "Chúng ta đang giải quyết vấn đề kinh doanh nào?",
  "Công việc thực sự cần thay đổi ở đâu?",
  "Ai chịu trách nhiệm cho kết quả?",
  "AI đang dựa vào nguồn nào, và nguồn đó có đủ đáng tin không?",
  "Đâu là dữ kiện, đâu là suy luận?",
  "Ai cần kiểm lại trước khi một output ảnh hưởng đến quyết định?",
];

const primaryStateItems = [
  "nhiều use case nhưng chưa rõ cái nào đáng mở rộng;",
  "AI được thêm vào workflow cũ;",
  "mỗi đội ngũ thử theo một cách khác nhau;",
  "trách nhiệm và cách kiểm soát đầu ra chưa rõ;",
  "hoạt động ngày càng nhiều nhưng giá trị kinh doanh vẫn khó nhìn thấy.",
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
    // PS-001 preview only: the approved backend/provider contract is not yet supplied.
    // Native browser constraint validation still runs before this handler.
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
        <section className={`${styles.section} ${styles.hero}`}>
          <div className={styles.shell}>
            <div className={styles.heroCopy}>
              <h1>CÓ NHIỀU AI HƠN CHƯA CHẮC DOANH NGHIỆP TẠO RA NHIỀU GIÁ TRỊ HƠN</h1>
              <div className={styles.prose}>
                <p>Tool AI có thể đã xuất hiện ở nhiều nơi trong doanh nghiệp. Một vài đội ngũ dùng khá sâu. Một số pilot đã chạy. Có những kết quả ban đầu rất hứa hẹn.</p>
                <p>Nhưng nếu công việc vẫn diễn ra gần như cũ, trách nhiệm chưa rõ, quyết định chưa tốt hơn và giá trị tạo ra vẫn khó nhìn thấy, thì có lẽ vấn đề không còn nằm ở việc thiếu thêm công cụ.</p>
                <p>Điều đáng nhìn lúc này là:</p>
              </div>
              <blockquote className={styles.pullQuote}>“Điều gì trong doanh nghiệp thực sự cần thay đổi — và AI nên tham gia vào phần nào?”</blockquote>
              <div className={styles.prose}>
                <p>Đó cũng là nơi tôi thường bắt đầu khi làm việc cùng Founder và đội ngũ điều hành: từ một vấn đề kinh doanh đủ quan trọng để cùng nhìn cho rõ, thay vì một danh sách công cụ.</p>
                <p>Để từ đó, lãnh đạo biết chắc hơn: việc nào đáng làm, việc nào nên dừng, và bước tiếp theo nào thực sự đáng để đầu tư.</p>
              </div>
              <a href="#boi-canh" className={styles.lightCta}>Trao đổi về một vấn đề kinh doanh thực tế</a>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <div className={`${styles.shell} ${styles.twoColumn}`}>
            <div>
              <h2>KHI AI ĐI VÀO CÔNG VIỆC THẬT, BÀI TOÁN CŨNG THAY ĐỔI</h2>
              <div className={styles.prose}>
                <p>Lúc đầu, câu hỏi thường là: “AI có thể giúp chúng ta làm gì?”</p>
                <p>Nhưng khi AI bắt đầu đi vào công việc thật, câu hỏi đó chưa đủ nữa.</p>
                <p>Một công cụ tốt không tự làm workflow tốt lên. Một câu trả lời nhanh không đồng nghĩa với một quyết định tốt hơn. Và một output nghe rất thuyết phục cũng chưa chắc đủ đáng tin để đưa vào công việc quan trọng.</p>
              </div>
            </div>
            <div className={styles.questionPanel}>
              <p className={styles.panelLead}>Lúc đó, doanh nghiệp cần nhìn rõ hơn:</p>
              <ul>
                {operatingQuestions.map((item) => <li key={item}>{item}</li>)}
              </ul>
              <div className={styles.prose}>
                <p>AI có thể tham gia rất sâu. Nhưng người chịu trách nhiệm vẫn cần biết mình đang dựa vào điều gì để quyết định.</p>
                <p>Đó là khác biệt giữa việc chỉ dùng AI và việc đưa AI vào một cách làm việc có trách nhiệm.</p>
              </div>
            </div>
          </div>
        </section>

        <section className={`${styles.section} ${styles.creamSection}`}>
          <div className={styles.shell}>
            <h2>HAI ĐIỂM XUẤT PHÁT. MỘT CÁNH CỬA.</h2>
            <div className={styles.stateGrid}>
              <article className={styles.primaryState}>
                <h3>Trường hợp tôi gặp nhiều hơn: Nhiều tool AI đã có, nhưng giá trị vẫn còn rời rạc.</h3>
                <p>Doanh nghiệp có thể đã có khá nhiều hoạt động AI:</p>
                <ul>{primaryStateItems.map((item) => <li key={item}>{item}</li>)}</ul>
                <p>Nếu đang ở đây, câu hỏi có lẽ không còn là: “Chúng ta cần thêm công cụ nào?”</p>
                <p className={styles.stateQuestion}>“Điều gì trong cách doanh nghiệp đang vận hành khiến những gì đã có vẫn chưa tạo ra giá trị tương xứng?”</p>
              </article>
              <article className={styles.secondaryState}>
                <h3>Một trường hợp khác: biết AI quan trọng nhưng không muốn bắt đầu sai.</h3>
                <div className={styles.prose}>
                  <p>Có những Founder hoặc CEO biết AI sẽ ảnh hưởng đến doanh nghiệp, nhưng cũng không muốn lao ngay vào tool, chatbot hay một chương trình chuyển đổi lớn khi chưa rõ mình thực sự cần thay đổi điều gì.</p>
                  <p>Trong trường hợp đó, tôi vẫn muốn bắt đầu từ một việc rất thực: Một vấn đề kinh doanh đủ quan trọng.</p>
                  <p>Có thể nó đang tốn tiền, tốn thời gian, ảnh hưởng khách hàng, làm chậm tăng trưởng hoặc đơn giản là một điểm mắc mà lãnh đạo không muốn tiếp tục mang theo.</p>
                </div>
              </article>
            </div>
            <p className={styles.signatureLine}>Một vấn đề kinh doanh thật trước. AI sau.</p>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.shell}>
            <div className={styles.sectionIntro}>
              <h2>CÁCH TÔI NHÌN MỘT VẤN ĐỀ CÓ AI</h2>
              <div className={styles.prose}>
                <p>Tôi không nhìn một bài toán AI chỉ bằng công nghệ.</p>
                <p>Khi AI bắt đầu chạm vào công việc thật, nó thường chạm cùng lúc vào cách doanh nghiệp tạo giá trị, cách đội ngũ phản ứng với thay đổi và chất lượng của những quyết định được đưa ra.</p>
                <p>Tôi thường nhìn vấn đề qua ba góc.</p>
              </div>
            </div>
            <div className={styles.portraitRow}>
              <div className={styles.portraitWrap}>
                <img
                  src="https://drive.google.com/uc?export=view&id=1ykn9ZfEP-AqnPekPBhst8DmWlWdSi6_W"
                  alt="Kenji tại bàn làm việc trong không gian tối giản, với laptop và sổ ghi chép."
                  width={1448}
                  height={1086}
                  loading="lazy"
                  decoding="async"
                  className={styles.portrait}
                />
              </div>
              <div className={styles.lensGrid}>
                <article>
                  <h3>KINH DOANH</h3>
                  <p>Vấn đề nào thật sự đáng giải?<br />Giá trị nằm ở đâu?<br />Ưu tiên nào quan trọng hơn?<br />Doanh nghiệp sẵn sàng đánh đổi điều gì?</p>
                </article>
                <article>
                  <h3>TÂM LÝ &amp; PHÁN ĐOÁN</h3>
                  <p>Không phải ai cũng phản ứng với AI giống nhau. Có người chưa tin. Có người lại tin quá nhanh. Có người bắt đầu lo vai trò của mình sẽ thay đổi.</p>
                  <p>Và đôi khi, một câu trả lời AI nghe quá hợp lý lại khiến người ra quyết định dừng phản biện sớm hơn họ nên làm.</p>
                  <p>Những điều đó không nằm ngoài bài toán vận hành. Chúng ảnh hưởng trực tiếp đến cách một tổ chức thay đổi và ra quyết định.</p>
                </article>
                <article>
                  <h3>AI &amp; CHẤT LƯỢNG ĐẦU RA</h3>
                  <p>AI nên hỗ trợ phần nào?<br />Kết quả đó dựa trên nguồn gì?<br />Có đủ đáng tin để sử dụng không?<br />Ai cần kiểm lại?<br />Và đến đâu thì quyết định cuối cùng vẫn phải thuộc về người chịu trách nhiệm?</p>
                </article>
              </div>
            </div>
            <div className={styles.integratedView}>
              <h3>Kinh doanh × Tâm lý × AI</h3>
              <div className={styles.prose}>
                <p>Tôi không xem đây là ba dịch vụ khác nhau. Trong thực tế, chúng thường nằm trong cùng một vấn đề.</p>
                <p>Điều tôi muốn giúp lãnh đạo nhìn rõ là: điều gì thực sự cần thay đổi, việc nào đáng làm trước, ai cần chịu trách nhiệm, AI nên tham gia ở đâu, và lúc nào cần đưa đúng specialist vào cuộc.</p>
                <p>Khi bài toán đi sâu sang engineering, data, security, integration hay technical architecture, đó là lúc cần đúng người chuyên môn tham gia.</p>
                <p>Một hệ tốt không cần một người làm tất cả. Nó cần đúng người giữ đúng phần trách nhiệm của mình.</p>
              </div>
            </div>
          </div>
        </section>

        <section className={`${styles.section} ${styles.darkSection}`}>
          <div className={`${styles.shell} ${styles.twoColumn}`}>
            <h2>BẮT ĐẦU TỪ MỘT VẤN ĐỀ, KHÔNG PHẢI MỘT CUỘC CHUYỂN ĐỔI LỚN</h2>
            <div className={styles.prose}>
              <p>Tôi không nghĩ doanh nghiệp nên bắt đầu bằng một chương trình lớn chỉ vì AI đang là một chủ đề quan trọng.</p>
              <p>Tôi thích bắt đầu nhỏ hơn và thật hơn: Một ưu tiên kinh doanh cụ thể.</p>
              <p>Chúng ta cùng nhìn vào nơi giá trị đang bị mất, công việc hiện đang diễn ra thế nào, quyết định đang mắc ở đâu, ai đang chịu trách nhiệm và AI đã được thử ra sao.</p>
              <p>Mục tiêu không phải tạo thêm một bộ slide. Mà là đi đến một vài quyết định đủ rõ để hành động.</p>
              <p>Sau bước đầu tiên, quyết định có thể rất đơn giản: dừng một việc chưa đáng làm, sửa lại workflow, thử trong phạm vi nhỏ, mở rộng thứ đã có bằng chứng hoặc chuyển phần kỹ thuật cho đúng specialist.</p>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.shell}>
            <div className={styles.sectionIntro}>
              <h2>VÌ SAO TÔI NHÌN VẤN ĐỀ THEO CÁCH NÀY?</h2>
              <div className={styles.prose}>
                <p>Cách tôi làm việc hôm nay không đến từ một vai trò duy nhất.</p>
                <p>Nó được hình thành qua nhiều năm làm kinh doanh, lãnh đạo, làm việc sâu với tâm lý và quyết định, và gần đây là trực tiếp xây những hệ thống có AI hỗ trợ.</p>
              </div>
            </div>
            <div className={styles.proofGrid}>
              <article>
                <h3>KINH DOANH</h3>
                <p>Tôi có hơn 20 năm kinh nghiệm làm việc và lãnh đạo, từng làm việc trong môi trường doanh nghiệp tập đoàn đa quốc gia và từng là Founder/CEO của BHT Media với trách nhiệm P&amp;L.</p>
                <p>Tôi hiểu một quyết định không chỉ cần nghe hợp lý. Nó còn phải sống được với nguồn lực, đội ngũ và thực tế vận hành.</p>
              </article>
              <article>
                <h3>TÂM LÝ &amp; QUYẾT ĐỊNH</h3>
                <p>Tôi có hơn 5 năm thực hành coaching và hơn 3.000 giờ coaching &amp; training với C-Level, managers và business owners; tôi đạt chứng nhận ICF Associate Certified Coach năm 2021.</p>
                <p>Nền tảng đó khiến tôi chú ý nhiều hơn đến niềm tin, sự phản kháng, thiên kiến, thay đổi vai trò và cách người chịu trách nhiệm giữ được phán đoán của mình khi công việc bắt đầu thay đổi bởi AI.</p>
              </article>
            </div>
            <div className={styles.essenceProof}>
              <div className={styles.essenceCopy}>
                <h3>ESSENCE — NƠI TÔI ĐANG TRỰC TIẾP LÀM ĐIỀU MÌNH NÓI</h3>
                <div className={styles.prose}>
                  <p>ESSENCE là hệ kinh doanh tôi đang trực tiếp xây, nơi AI được sử dụng sâu trong nhiều phần công việc.</p>
                  <p>Nhưng AI không mặc định được xem là đúng.</p>
                  <p>Mỗi việc cần rõ nguồn nào đáng tin, AI được giao phần nào, ai kiểm lại, bằng chứng nào đủ tốt và quyết định cuối cùng thuộc về ai.</p>
                  <p>Đó là bằng chứng công việc trong chính hệ tôi đang vận hành.</p>
                  <p>Không phải một client case, và tôi cũng không dùng nó để suy rộng thành một tuyên bố rằng mình đã làm AI transformation cho nhiều doanh nghiệp khác.</p>
                </div>
              </div>
              <img
                src="https://drive.google.com/uc?export=view&id=1Xw1ExUAA-JkHW0o8ssrv7lkGCEitHwQO"
                alt="Sơ đồ vòng lặp vận hành ESSENCE: Nguồn thật → Quyền hạn → AI hỗ trợ → Người kiểm lại → Quyết định → Bằng chứng → Điều chỉnh cách làm."
                width={1254}
                height={1254}
                loading="lazy"
                decoding="async"
                className={styles.loopImage}
              />
            </div>
            <div className={styles.boundaryBlock}>
              <h3>Rõ phạm vi để làm việc tốt hơn</h3>
              <div className={styles.prose}>
                <p>Phần tôi có thể mang lại nhiều giá trị nhất là giúp lãnh đạo làm rõ vấn đề kinh doanh, chất lượng quyết định, cách vận hành, sự thích nghi của đội ngũ và cách AI được sử dụng có trách nhiệm.</p>
                <p>Khi bài toán bước sang chuyên môn kỹ thuật sâu, tôi muốn đúng specialist bước vào.</p>
                <p>Tôi tin một hệ tốt bắt đầu từ việc đúng người giữ đúng trách nhiệm.</p>
              </div>
            </div>
          </div>
        </section>

        <section className={`${styles.section} ${styles.creamSection}`}>
          <div className={styles.shell}>
            <h2>KHI NÀO CUỘC TRAO ĐỔI NÀY CÓ THỂ HỮU ÍCH?</h2>
            <div className={styles.fitGrid}>
              <div>
                <p className={styles.panelLead}>Có lẽ chúng ta nên nói chuyện nếu:</p>
                <ul>{fitItems.map((item) => <li key={item}>{item}</li>)}</ul>
                <p>Quy mô không phải tiêu chí đầu tiên.</p>
                <p>Quan trọng hơn là vấn đề có đủ thật, quyền quyết định có đủ rõ và người sở hữu có thực sự muốn thay đổi cách làm việc hay không.</p>
              </div>
              <div className={styles.nonFit}>
                <p className={styles.panelLead}>Có thể chúng ta chưa phù hợp nếu điều anh/chị cần chủ yếu là:</p>
                <ul>{nonFitItems.map((item) => <li key={item}>{item}</li>)}</ul>
                <p>Biết điều đó sớm vẫn tốt hơn bắt đầu một dự án không đúng.</p>
              </div>
            </div>
          </div>
        </section>

        <section id="boi-canh" className={`${styles.section} ${styles.formSection}`}>
          <div className={`${styles.shell} ${styles.formLayout}`}>
            <div>
              <h2>HÃY BẮT ĐẦU BẰNG MỘT VẤN ĐỀ THẬT</h2>
              <div className={styles.prose}>
                <p>Anh/chị không cần chuẩn bị một AI strategy hoàn chỉnh.</p>
                <p>Cũng không cần biết trước giải pháp.</p>
                <p>Chỉ cần mang đến một vấn đề đủ thật để đáng cùng nhìn.</p>
              </div>
              <p className={styles.formLead}>Cho tôi một chút bối cảnh</p>
            </div>
            <div>
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
