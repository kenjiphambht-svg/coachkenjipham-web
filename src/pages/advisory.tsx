import Head from "next/head";
import Link from "next/link";
import { useState, type FormEvent } from "react";
import HomeFooter from "@/components/homepage/HomeFooter";
import { isAcceptedAdvisoryIntakeResponse } from "@/lib/advisory/intake-response";
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

type SubmissionStatus = "idle" | "submitting" | "error" | "success";

type ContactFieldErrors = {
  contact_name?: string;
  contact_email?: string;
};

type IntakePayload = {
  role_org_context: string;
  business_problem: string;
  ai_current_state: string;
  why_now: string;
  contact_name: string;
  contact_email: string;
  source_route: "/advisory";
  locale?: string;
  referrer?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function readTrimmed(formData: FormData, name: string) {
  const value = formData.get(name);
  return typeof value === "string" ? value.trim() : "";
}

function createSubmissionId() {
  if (typeof window.crypto.randomUUID === "function") {
    return window.crypto.randomUUID();
  }

  const bytes = new Uint8Array(16);
  window.crypto.getRandomValues(bytes);
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0"));

  return `${hex.slice(0, 4).join("")}-${hex.slice(4, 6).join("")}-${hex.slice(6, 8).join("")}-${hex.slice(8, 10).join("")}-${hex.slice(10, 16).join("")}`;
}

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
  const [status, setStatus] = useState<SubmissionStatus>("idle");
  const [fieldErrors, setFieldErrors] = useState<ContactFieldErrors>({});
  const [validationSummary, setValidationSummary] = useState("");
  const [submissionId, setSubmissionId] = useState<string | null>(null);
  const [submittedFingerprint, setSubmittedFingerprint] = useState<string | null>(null);

  function clearContactError(field: keyof ContactFieldErrors) {
    setFieldErrors((current) => ({ ...current, [field]: undefined }));
    setValidationSummary("");
    if (status === "error") setStatus("idle");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "submitting") return;

    const form = event.currentTarget;
    const formData = new FormData(form);
    const roleOrgContext = readTrimmed(formData, "role_org_context");
    const businessProblem = readTrimmed(formData, "business_problem");
    const aiCurrentState = readTrimmed(formData, "ai_current_state");
    const whyNow = readTrimmed(formData, "why_now");
    const contactName = readTrimmed(formData, "contact_name");
    const contactEmail = readTrimmed(formData, "contact_email");

    const nextErrors: ContactFieldErrors = {};
    if (!contactName) nextErrors.contact_name = "Vui lòng cho biết tên của anh/chị.";
    if (!contactEmail) {
      nextErrors.contact_email = "Vui lòng nhập email để tôi có thể phản hồi.";
    } else if (!emailPattern.test(contactEmail)) {
      nextErrors.contact_email = "Email này có vẻ chưa đúng. Anh/chị kiểm tra lại giúp tôi.";
    }

    const missingContext = !roleOrgContext || !businessProblem || !aiCurrentState || !whyNow;
    if (missingContext || Object.keys(nextErrors).length > 0) {
      setFieldErrors(nextErrors);
      setValidationSummary("Anh/chị kiểm tra lại những phần còn thiếu trước khi gửi.");
      setStatus("idle");

      const firstInvalid = form.querySelector<HTMLElement>(
        !roleOrgContext
          ? "[name='role_org_context']"
          : !businessProblem
            ? "[name='business_problem']"
            : !aiCurrentState
              ? "[name='ai_current_state']"
              : !whyNow
                ? "[name='why_now']"
                : nextErrors.contact_name
                  ? "[name='contact_name']"
                  : "[name='contact_email']",
      );
      firstInvalid?.focus();
      return;
    }

    setFieldErrors({});
    setValidationSummary("");

    const params = new URLSearchParams(window.location.search);
    const payload: IntakePayload = {
      role_org_context: roleOrgContext,
      business_problem: businessProblem,
      ai_current_state: aiCurrentState,
      why_now: whyNow,
      contact_name: contactName,
      contact_email: contactEmail,
      source_route: "/advisory",
      locale: window.navigator.language || undefined,
      referrer: document.referrer || undefined,
      utm_source: params.get("utm_source") || undefined,
      utm_medium: params.get("utm_medium") || undefined,
      utm_campaign: params.get("utm_campaign") || undefined,
      utm_content: params.get("utm_content") || undefined,
      utm_term: params.get("utm_term") || undefined,
    };

    const fingerprint = JSON.stringify(payload);
    const activeSubmissionId =
      submissionId && submittedFingerprint === fingerprint ? submissionId : createSubmissionId();

    setSubmissionId(activeSubmissionId);
    setSubmittedFingerprint(fingerprint);
    setStatus("submitting");

    try {
      const response = await fetch("/api/advisory/intake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, submission_id: activeSubmissionId }),
      });
      const result = await response.json().catch(() => null);

      if (!isAcceptedAdvisoryIntakeResponse(response.status, response.ok, result, activeSubmissionId)) {
        throw new Error("INTAKE_NOT_ACCEPTED");
      }

      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className={`${styles.form} advisoryReceipt`} role="status" aria-live="polite" data-advisory-intake-receipt>
        <h3>Đã nhận được bối cảnh.</h3>
        <p>Cảm ơn anh/chị. Tôi sẽ đọc những gì anh/chị đã gửi trước khi quyết định bước tiếp theo. Nếu một cuộc trao đổi sâu hơn có thể hữu ích, ESSENCE sẽ liên hệ qua email anh/chị đã cung cấp. Anh/chị không cần gửi lại bốn phần thông tin này.</p>
        <p className="advisoryReceiptBoundary">Việc gửi bối cảnh chưa phải là xác nhận lịch hẹn, đề xuất, mức phí hay cam kết hợp tác.</p>
      </div>
    );
  }

  const buttonLabel = status === "submitting" ? "Đang gửi…" : status === "error" ? "Thử gửi lại" : "Gửi bối cảnh vấn đề";

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate aria-busy={status === "submitting"} data-form-transport="/api/advisory/intake">
      <div className={styles.field}>
        <label htmlFor="advisory-role">Vai trò và tổ chức</label>
        <p id="advisory-role-help">Anh/chị đang phụ trách điều gì?</p>
        <textarea id="advisory-role" name="role_org_context" rows={3} required aria-describedby="advisory-role-help" />
      </div>
      <div className={`${styles.field} ${styles.fieldPriority}`}>
        <label htmlFor="advisory-problem">Vấn đề cần giải quyết</label>
        <p id="advisory-problem-help">Vấn đề nào đang cần được giải quyết nhất?</p>
        <textarea id="advisory-problem" name="business_problem" rows={5} required aria-describedby="advisory-problem-help" />
      </div>
      <div className={styles.field}>
        <label htmlFor="advisory-ai-state">Hiện trạng ứng dụng AI</label>
        <p id="advisory-ai-state-help">Doanh nghiệp đang dùng hoặc đã thử công cụ AI ở đâu?</p>
        <textarea id="advisory-ai-state" name="ai_current_state" rows={3} required aria-describedby="advisory-ai-state-help" />
      </div>
      <div className={styles.field}>
        <label htmlFor="advisory-why-now">Vì sao là lúc này?</label>
        <p id="advisory-why-now-help">Vì sao vấn đề này cần được xử lý lúc này?</p>
        <textarea id="advisory-why-now" name="why_now" rows={3} required aria-describedby="advisory-why-now-help" />
      </div>

      <div className="advisoryContactGroup" data-advisory-contact-group>
        <div className="advisoryContactIntro">
          <h3>Thông tin để phản hồi</h3>
          <p>Để tôi biết mình đang trao đổi với ai và có thể phản hồi sau khi đọc bối cảnh.</p>
        </div>

        <div className={`${styles.field} advisoryContactField`}>
          <label htmlFor="advisory-contact-name">Tên anh/chị</label>
          <input
            id="advisory-contact-name"
            name="contact_name"
            type="text"
            autoComplete="name"
            required
            aria-invalid={Boolean(fieldErrors.contact_name)}
            aria-describedby={fieldErrors.contact_name ? "advisory-contact-name-error" : undefined}
            onChange={() => clearContactError("contact_name")}
          />
          {fieldErrors.contact_name ? <p id="advisory-contact-name-error" className="advisoryFieldError" role="alert">{fieldErrors.contact_name}</p> : null}
        </div>

        <div className={`${styles.field} advisoryContactField`}>
          <label htmlFor="advisory-contact-email">Email liên hệ</label>
          <p id="advisory-contact-email-help">Dùng để phản hồi về chính bối cảnh anh/chị gửi.</p>
          <input
            id="advisory-contact-email"
            name="contact_email"
            type="email"
            inputMode="email"
            autoComplete="email"
            required
            aria-invalid={Boolean(fieldErrors.contact_email)}
            aria-describedby={fieldErrors.contact_email ? "advisory-contact-email-help advisory-contact-email-error" : "advisory-contact-email-help"}
            onChange={() => clearContactError("contact_email")}
          />
          {fieldErrors.contact_email ? <p id="advisory-contact-email-error" className="advisoryFieldError" role="alert">{fieldErrors.contact_email}</p> : null}
        </div>
      </div>

      {validationSummary ? <p className="advisoryFormMessage" role="alert">{validationSummary}</p> : null}
      {status === "error" ? (
        <div className="advisoryFormMessage" role="alert" aria-live="assertive">
          <strong>Chưa gửi được bối cảnh.</strong>
          <p>Nội dung anh/chị đã nhập vẫn được giữ trên trang này. Vui lòng thử gửi lại.</p>
        </div>
      ) : null}

      <p className="advisoryPrivacyNote">Thông tin liên hệ được dùng để đọc và phản hồi bối cảnh anh/chị gửi; việc gửi form không phải là đăng ký nhận nội dung marketing.</p>
      <button type="submit" className={styles.primaryButton} disabled={status === "submitting"}>{buttonLabel}</button>

      <style jsx>{`
        .advisoryContactGroup {
          display: grid;
          gap: 24px;
          margin-top: 8px;
          padding-top: 30px;
          border-top: 1px solid var(--essence-border-light-2026);
        }

        .advisoryContactIntro {
          display: grid;
          gap: 8px;
        }

        .advisoryContactIntro h3 {
          margin: 0;
          font-family: Inter, Arial, sans-serif;
          font-size: 14px;
          line-height: 1.4;
          font-weight: 600;
          letter-spacing: 0.06em;
        }

        .advisoryContactIntro p,
        .advisoryPrivacyNote,
        .advisoryFormMessage,
        .advisoryFieldError {
          margin: 0;
          font-family: Inter, Arial, sans-serif;
          font-size: 14px;
          line-height: 1.6;
        }

        .advisoryContactField input {
          box-sizing: border-box;
          width: 100%;
          min-height: 50px;
          margin-top: 10px;
          padding: 12px 14px;
          border: 1px solid var(--essence-border-light-2026);
          border-radius: 0;
          background: transparent;
          color: inherit;
          font: inherit;
        }

        .advisoryContactField input:focus-visible {
          outline: 2px solid currentColor;
          outline-offset: 2px;
        }

        .advisoryContactField input[aria-invalid="true"] {
          border-color: currentColor;
          border-width: 2px;
        }

        .advisoryFieldError {
          margin-top: 8px;
          font-weight: 500;
        }

        .advisoryFormMessage {
          display: grid;
          gap: 6px;
          padding-top: 4px;
        }

        .advisoryFormMessage p {
          margin: 0;
        }

        .advisoryPrivacyNote {
          color: var(--essence-text-secondary-2026);
        }

        button:disabled {
          cursor: wait;
          opacity: 0.7;
        }
      `}</style>
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
            <p className={styles.judgmentAnchor} data-weight-soften="judgment">Công nghệ này có thể tham gia rất sâu, nhưng người chịu trách nhiệm vẫn phải biết mình đang dựa vào điều gì để quyết định.</p>
          </div>
        </section>

        <section className={`${styles.section} ${styles.startingStates} ${styles.diagnosticScene} ${styles.rhythmGo}`} data-review-crop="starting-states">
          <div className={styles.shell}>
            <h2 className={styles.sectionAnchor} data-type-scale="section">HAI ĐIỂM XUẤT PHÁT</h2>
            <div className={styles.stateComposition} data-state-composition>
              <article className={styles.routeB}>
                <p className={styles.routeLead} data-weight-soften="route-lead">Tôi gặp tình huống này nhiều hơn: doanh nghiệp đã dùng các công cụ AI ở khá nhiều chỗ, nhưng giá trị tạo ra vẫn còn rời rạc:</p>
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
              <figure className={styles.loopWrap} data-essence-loop-wrap>
                <img src="/images/advisory/advisory-essence-operating-loop-selected-v03.webp" alt="Sơ đồ vòng lặp vận hành ESSENCE: Nguồn thật → Quyền hạn → AI hỗ trợ → Người kiểm lại → Quyết định → Bằng chứng → Điều chỉnh cách làm." width={500} height={500} loading="lazy" decoding="async" className={styles.loopImage} />
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

        main [data-weight-soften="judgment"],
        main [data-weight-soften="route-lead"] {
          font-weight: 500 !important;
        }

        main [data-essence-loop-wrap] {
          width: min(100%, 620px);
          max-width: 620px;
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

        .advisoryReceipt {
          display: grid;
          gap: 18px;
        }

        .advisoryReceipt h3 {
          margin: 0;
          font-family: "Cormorant Garamond", Georgia, serif;
          font-size: clamp(30px, 2.5vw, 40px);
          line-height: 1.1;
          font-weight: 500;
        }

        .advisoryReceipt p {
          margin: 0;
          font-family: Inter, Arial, sans-serif;
          font-size: 16px;
          line-height: 1.7;
        }

        .advisoryReceiptBoundary {
          padding-top: 18px;
          border-top: 1px solid var(--essence-border-light-2026);
          color: var(--essence-text-secondary-2026);
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

          main [data-essence-loop-wrap] {
            width: calc(100vw - 16px);
            max-width: calc(100vw - 16px);
            margin-left: 50%;
            transform: translateX(-50%);
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