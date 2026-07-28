import Image from "next/image";
import Link from "next/link";
import { useId, useState, type ReactNode } from "react";

import {
  bodyClass,
  darkBodyClass,
  darkSectionLabelClass,
  sectionLabelClass,
  utilityClass,
} from "./Lang90Frame";
import {
  Lang90AccentVoice,
  Lang90HeroComposition,
  Lang90SectionHeading,
  Lang90SignalComposition,
} from "./Lang90Composition";
import Lang90Lightscape from "./Lang90Lightscape";
import Lang90Reveal from "./Lang90Reveal";

const journeySteps = [
  {
    title: "Một — Bắt đầu từ nơi đang rối nhất",
    copy: [
      "Bạn không cần kể cho đúng thứ tự.",
      "Chúng ta bắt đầu từ điều đang khiến bạn có mặt ở đây.",
    ],
  },
  {
    title: "Hai — Nhìn điều đang nằm bên dưới",
    copy: [
      "Khi mọi thứ chậm lại, điều nằm bên dưới bắt đầu hiện ra.",
      "Không cần tìm mười vấn đề. Chỉ cần gọi đúng một điều đang thật sự dẫn phản ứng của bạn.",
    ],
  },
  {
    title: "Ba — Mang điều vừa thấy trở lại đời sống",
    copy: [
      "Trước khi kết thúc, bạn chọn một việc nhỏ để làm hoặc quan sát trong 48 giờ tiếp theo.",
    ],
  },
] as const;

const outcomes = [
  "Một phản ứng hoặc vòng lặp để nhận ra khi nó quay lại.",
  "Một bước đủ nhỏ để thực hiện trong 48 giờ.",
  "Một bản tóm tắt riêng để bạn không phải nhớ một mình.",
  "Một vài câu hỏi có thể tiếp tục mang theo sau phiên.",
] as const;

const sessionDetails = [
  ["Thời lượng", "90 phút"],
  ["Hình thức", "Trực tuyến hoặc gặp trực tiếp tại Sài Gòn"],
  ["Người giữ phiên", "Kenji Phạm"],
  ["Phí phiên", "10.000.000 đồng"],
  ["Sau phiên", "Bản tóm tắt riêng 1–2 trang. Hai lần tôi hỏi lại bạn: ngày 7 và ngày 30."],
  ["Số lượng", "Tối đa 5 phiên mỗi tháng"],
] as const;

type FaqItem = {
  question: string;
  answer: ReactNode;
};

const faqItems: FaqItem[] = [
  {
    question: "Tôi không biết phải bắt đầu nói từ đâu thì sao?",
    answer: (
      <>
        <p>Bạn không cần biết trước mình phải bắt đầu ở đâu.</p>
        <p className="mt-5">Có thể bắt đầu bằng một sự việc, một cảm giác hoặc chỉ bằng câu:</p>
        <p className="mt-5">“Tôi không biết phải bắt đầu từ đâu.”</p>
      </>
    ),
  },
  {
    question: "Tôi có phải kể hết mọi chuyện không?",
    answer: (
      <>
        <p>Không.</p>
        <p className="mt-5">Bạn kể đến đâu, chúng ta làm việc đến đó.</p>
      </>
    ),
  },
  {
    question: "Kenji có nói tôi nên làm gì không?",
    answer: (
      <>
        <p>Tôi sẽ nói điều mình đang nhìn thấy.</p>
        <p className="mt-5">Có thể hỏi thẳng hoặc đưa ra một góc nhìn khác. Nhưng quyết định vẫn là của bạn.</p>
      </>
    ),
  },
  {
    question: "Những gì tôi chia sẻ có được giữ riêng tư không?",
    answer: (
      <p>
        Nội dung bạn gửi và chia sẻ trong phiên được giữ trong phạm vi riêng tư của quá trình làm việc. {" "}
        <Link href="/chinh-sach-rieng-tu" className="underline decoration-e26-text-2 underline-offset-4 transition-colors hover:text-e26-text">
          Chính sách riêng tư.
        </Link>
      </p>
    ),
  },
];

function HeroScene() {
  return (
    <section data-lang90-scene="hero" className="relative flex min-h-[88svh] overflow-hidden bg-e26-black px-6 py-16 md:min-h-[92svh] md:py-24">
      <Lang90Lightscape scene="opening" alt="" priority className="object-[63%_center] md:object-center" />
      <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(90deg,rgba(26,26,26,0.48)_0%,rgba(26,26,26,0.22)_52%,rgba(26,26,26,0.08)_100%)]" />
      <div className="relative mx-auto flex w-full max-w-[1120px] flex-col justify-end pb-4 md:pb-10">
        <Lang90Reveal>
          <p className={darkSectionLabelClass}>Lặng</p>
        </Lang90Reveal>
        <Lang90Reveal delay="short" className="mt-8 max-w-[327px] md:max-w-[900px]">
          <Lang90HeroComposition />
        </Lang90Reveal>
        <Lang90Reveal delay="long" className="mt-10 max-w-[327px] md:mt-12 md:max-w-[620px]">
          <p className={darkBodyClass}>
            Không phải vì bạn chưa cố đủ. Có khi bạn chỉ đang đứng quá gần câu chuyện của mình.
          </p>
          <p className={["mt-8", darkSectionLabelClass].join(" ")}>
            90 phút · 1:1 cùng Kenji Phạm · Trực tuyến hoặc tại Sài Gòn
          </p>
        </Lang90Reveal>
      </div>
    </section>
  );
}

function RecognitionScene() {
  return (
    <section data-lang90-scene="recognition" className="relative overflow-hidden bg-e26-black px-6 py-24 md:py-36">
      <Lang90Lightscape scene="opening" alt="" className="object-[67%_center] opacity-[0.22]" />
      <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(90deg,rgba(26,26,26,0.9)_0%,rgba(26,26,26,0.72)_60%,rgba(26,26,26,0.48)_100%)]" />
      <div className="relative mx-auto max-w-[1040px]">
        <Lang90Reveal>
          <p className={darkSectionLabelClass}>BẠN CÓ ĐANG Ở ĐÂY KHÔNG?</p>
        </Lang90Reveal>
        <Lang90Reveal delay="short" className={["mt-12", darkBodyClass].join(" ")}>
          <p>Bạn vẫn làm việc. Vẫn trả lời những câu cần trả lời. Người khác vẫn thấy bạn ổn.</p>
        </Lang90Reveal>
        <Lang90Reveal delay="short" className="mt-10 md:mt-12">
          <p className="max-w-[620px] font-serif text-[21px] font-normal italic leading-[1.85] tracking-[-0.006em] text-e26-text-dark md:text-[25px] md:leading-[1.8]">
            Email đã trả lời. Con đã ngủ. Nhà đã yên. Điện thoại không còn rung.
            <br />
            Chỉ có đầu óc của bạn — vẫn chưa.
          </p>
        </Lang90Reveal>
        <Lang90Reveal delay="short" className={["mt-10", darkBodyClass].join(" ")}>
          <p>Bạn đã nghĩ về nó nhiều lần. Nhưng càng nghĩ, mọi thứ càng rối.</p>
        </Lang90Reveal>
        <Lang90Reveal delay="long" className={["mt-14", darkBodyClass].join(" ")}>
          <p>Có lẽ lúc này, bạn không cần thêm một lời khuyên.</p>
        </Lang90Reveal>
      </div>
    </section>
  );
}

function SignalScene() {
  return (
    <section data-lang90-scene="signal" className="relative flex min-h-[94svh] overflow-hidden bg-e26-black px-6 py-24 md:min-h-[96svh] md:py-32">
      <Lang90Lightscape
        scene="signal"
        alt="Một chiếc ghế đơn trong căn phòng tối, được ánh sáng chạm nhẹ."
        className="object-[65%_center] md:object-center"
      />
      <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(90deg,rgba(26,26,26,0.56)_0%,rgba(26,26,26,0.28)_52%,rgba(26,26,26,0.06)_100%)]" />
      <div className="relative mx-auto flex w-full max-w-[1120px] flex-col justify-center">
        <h2 className="sr-only">Khoảng đủ yên</h2>
        <Lang90Reveal className="max-w-[700px]">
          <Lang90SignalComposition />
        </Lang90Reveal>
      </div>
    </section>
  );
}

function DefinitionScene() {
  return (
    <section data-lang90-scene="clarity" className="relative isolate flex min-h-[88svh] overflow-hidden bg-e26-cream-deep px-6 py-24 md:min-h-[84svh] md:py-36">
      <Lang90Lightscape
        scene="dawn"
        alt="Ánh sáng ban mai trải trên bức tường và sàn của một không gian tối giản."
        className="object-[58%_center] md:object-center"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(90deg,rgba(241,239,232,0.97)_0%,rgba(241,239,232,0.94)_48%,rgba(241,239,232,0.72)_68%,rgba(241,239,232,0.18)_100%)]"
      />
      <div className="relative mx-auto flex w-full max-w-[1120px] flex-col justify-center">
        <div className="max-w-[650px]">
          <Lang90Reveal>
            <p className={sectionLabelClass}>LẶNG LÀ GÌ?</p>
          </Lang90Reveal>
          <Lang90Reveal delay="short" className="mt-8">
            <Lang90SectionHeading className="text-e26-text">
              Trong Lặng, tôi không cố giải quyết cả cuộc đời bạn.
            </Lang90SectionHeading>
          </Lang90Reveal>
          <Lang90Reveal delay="short" className={["mt-12 space-y-7", bodyClass].join(" ")}>
            <p>Tôi chỉ ngồi cùng bạn để nhìn một điều: điều gì đang thật sự kéo bạn lúc này?</p>
            <p>Tôi sẽ nghe điều bạn nói. Hỏi vào chỗ đang bị bỏ qua. Và cùng bạn chọn một bước có thể mang về đời sống.</p>
          </Lang90Reveal>
          <Lang90Reveal delay="long" className="mt-14">
            <Lang90AccentVoice className="max-w-[560px] text-e26-text">
              Không cần thấy hết.<br />Chỉ cần thấy đúng điều đang cần được thấy.
            </Lang90AccentVoice>
          </Lang90Reveal>
        </div>
      </div>
    </section>
  );
}

function KenjiScene() {
  return (
    <section data-lang90-scene="kenji" className="bg-e26-cream px-6 py-24 md:py-36">
      <div className="mx-auto grid max-w-[1120px] gap-14 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1fr)] md:items-start md:gap-20">
        <Lang90Reveal className="order-2 md:order-1">
          <Image
            src="/images/lang-90/sb-02-kenji-presence-v01.webp"
            alt="Kenji Phạm rót trà trong một không gian yên tĩnh trước cuộc trò chuyện."
            width={912}
            height={1152}
            sizes="(min-width: 1024px) 460px, (min-width: 768px) 42vw, calc(100vw - 48px)"
            className="h-auto w-full md:sticky md:top-10"
          />
        </Lang90Reveal>
        <div className="order-1 md:order-2">
          <Lang90Reveal>
            <p className={sectionLabelClass}>NGƯỜI NGỒI CÙNG BẠN</p>
            <Lang90SectionHeading className="mt-7 text-e26-text">Tôi là Kenji Phạm.</Lang90SectionHeading>
          </Lang90Reveal>
          <Lang90Reveal delay="short" className={["mt-12 space-y-8", bodyClass].join(" ")}>
            <p>Tôi là Kenji Phạm. Tám năm ngồi nghe người lớn nói những điều họ không nói ở nơi khác.</p>
            <p>Có một giai đoạn tôi một mình nuôi hai con, tài khoản còn 2,5 đô.<br />Tôi không kể thêm ở đây. Trang này không phải để nói về tôi.</p>
            <p>Tôi không ngồi ở đây để nói bạn nên sống thế nào.</p>
            <p>Tôi ở đây để giúp bạn nhìn rõ hơn điều chính mình đã cảm thấy — nhưng chưa đủ yên để tin.</p>
            <p>Tôi sẽ hỏi thẳng khi cần.<br />Và quyền quyết định vẫn ở bạn.</p>
          </Lang90Reveal>
          <Lang90Reveal delay="long" className="mt-14">
            <Lang90AccentVoice className="max-w-[560px] text-e26-text">
              Tôi không sửa.<br />Tôi tạo một khoảng đủ An định để bạn nhìn rõ hơn.
            </Lang90AccentVoice>
          </Lang90Reveal>
        </div>
      </div>
    </section>
  );
}

function JourneyScene() {
  return (
    <section data-lang90-scene="journey" className="relative overflow-hidden bg-e26-ivory px-6 py-24 md:py-36">
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-[radial-gradient(ellipse_at_78%_0%,rgba(255,255,255,0.92),transparent_66%)]" />
      <div className="relative mx-auto max-w-[860px]">
        <Lang90Reveal>
          <p className={sectionLabelClass}>TRONG 90 PHÚT</p>
          <Lang90SectionHeading className="mt-7 max-w-[650px] text-e26-text">Chúng ta đi qua ba nhịp.</Lang90SectionHeading>
        </Lang90Reveal>
        <div className="mt-16 space-y-14 md:mt-20 md:space-y-20">
          {journeySteps.map((step, index) => (
            <Lang90Reveal key={step.title} delay={index === 1 ? "short" : index === 2 ? "long" : "none"}>
              <article className="border-t border-e26-border pt-8 md:grid md:grid-cols-[minmax(0,0.42fr)_minmax(0,1fr)] md:gap-16 md:pt-10">
                <h3 className="font-serif text-[27px] font-medium leading-[1.2] tracking-[-0.012em] text-e26-text md:text-[31px]">
                  {step.title}
                </h3>
                <div className={["mt-7 space-y-6 md:mt-0", bodyClass].join(" ")}>
                  {step.copy.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                </div>
              </article>
            </Lang90Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function OutcomeScene() {
  return (
    <section data-lang90-scene="outcomes" className="relative overflow-hidden bg-e26-cream-deep px-6 py-24 md:py-36">
      <Lang90Lightscape scene="release" alt="" className="object-[44%_center] md:object-center" />
      <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(90deg,rgba(241,239,232,0.96)_0%,rgba(241,239,232,0.88)_48%,rgba(241,239,232,0.38)_100%)]" />
      <div className="relative mx-auto max-w-[1080px] md:grid md:grid-cols-[0.86fr_1fr] md:gap-20">
        <Lang90Reveal>
          <p className={sectionLabelClass}>SAU PHIÊN</p>
          <Lang90SectionHeading className="mt-7 max-w-[590px] text-e26-text">Sau 90 phút, bạn không cần hiểu hết mọi chuyện.</Lang90SectionHeading>
          <Lang90AccentVoice className="mt-6 text-e26-text">Chỉ cần một điều đã rõ hơn.</Lang90AccentVoice>
        </Lang90Reveal>
        <div className="mt-14 md:mt-0">
          <Lang90Reveal delay="short" className={bodyClass}>
            <p>Điều chính đang kéo bạn được gọi đúng tên.</p>
          </Lang90Reveal>
          <div className="mt-10">
            {outcomes.map((outcome, index) => (
              <Lang90Reveal key={outcome} delay={index > 1 ? "short" : "none"}>
                <div className="grid grid-cols-[2rem_1fr] gap-5 border-t border-e26-border py-6 last:border-b">
                  <p className={sectionLabelClass}>0{index + 1}</p>
                  <p className={bodyClass}>{outcome}</p>
                </div>
              </Lang90Reveal>
            ))}
          </div>
          <Lang90Reveal delay="long" className={["mt-12 space-y-5", bodyClass].join(" ")}>
            <p>Không phải một phiên bản mới của bạn.</p>
            <p>Chỉ là bạn — với thêm một khoảng để lựa chọn.</p>
          </Lang90Reveal>
        </div>
      </div>
    </section>
  );
}

function SessionInfoScene() {
  return (
    <section data-lang90-scene="session-info" className="relative overflow-hidden bg-e26-cream px-6 py-28 md:py-40">
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-[radial-gradient(ellipse_at_20%_0%,rgba(255,255,255,0.85),transparent_66%)]" />
      <div className="relative mx-auto max-w-[920px]">
        <Lang90Reveal>
          <p className={sectionLabelClass}>THÔNG TIN PHIÊN</p>
        </Lang90Reveal>
        <Lang90Reveal delay="short" className="mt-12">
          <dl className="border-y border-e26-border">
            {sessionDetails.map(([label, value]) => (
              <div key={label} className="grid gap-2 border-b border-e26-border py-5 last:border-b-0 md:grid-cols-[180px_1fr] md:gap-10 md:py-6">
                <dt className={sectionLabelClass}>{label}</dt>
                <dd className="font-sans text-[18px] font-medium leading-[1.65] text-e26-text md:text-[19px]">{value}</dd>
              </div>
            ))}
          </dl>
        </Lang90Reveal>
      </div>
    </section>
  );
}

function BreathScene() {
  return (
    <section data-lang90-scene="breath" className="bg-e26-ivory px-6 py-32 md:py-44">
      <div className="mx-auto max-w-[860px]">
        <Lang90Reveal>
          <p className="font-serif text-[28px] font-normal italic leading-[1.35] tracking-[-0.012em] text-e26-text md:text-[38px] lg:text-[44px]">
            Bạn không cần chắc chắn. Chỉ cần đủ thật với chính mình lúc này.
          </p>
        </Lang90Reveal>
      </div>
    </section>
  );
}

function CtaScene() {
  return (
    <section data-lang90-scene="next-step" className="bg-e26-cream-deep px-6 py-32 md:py-44">
      <div className="mx-auto max-w-[680px]">
        <Lang90Reveal>
          <p className={sectionLabelClass}>BƯỚC TIẾP THEO</p>
          <Lang90SectionHeading className="mt-7 text-e26-text">
            Trước khi đặt lịch, tôi muốn hiểu điều gì đang đưa bạn đến đây.
          </Lang90SectionHeading>
        </Lang90Reveal>
        <Lang90Reveal delay="short" className={["mt-12 space-y-7", bodyClass].join(" ")}>
          <p>Sáu câu hỏi. Khoảng 5–10 phút.</p>
          <p>Tôi trực tiếp đọc và phản hồi trong một ngày làm việc.</p>
          <p>Nếu Lặng phù hợp, bạn sẽ nhận đường dẫn chọn lịch. Sau khi chọn được thời gian, bạn mới đến bước thanh toán.</p>
          <p>Nếu một hướng khác phù hợp hơn, tôi cũng sẽ nói rõ.</p>
        </Lang90Reveal>
        <Lang90Reveal delay="long" className="mt-16 md:mt-20">
          <Link
            href="/lang-90/dat-phien"
            className={[
              "inline-flex min-h-14 w-full items-center justify-center bg-e26-gold px-8 py-4 text-[13px] uppercase tracking-[0.08em] text-e26-black transition-colors hover:bg-e26-gold-deep hover:text-e26-ivory focus:outline-none focus-visible:ring-2 focus-visible:ring-e26-gold-deep focus-visible:ring-offset-4 focus-visible:ring-offset-e26-cream-deep sm:w-auto",
              utilityClass,
            ].join(" ")}
          >
            BẮT ĐẦU 6 CÂU HỎI
          </Link>
          <p className={["mt-5 text-[11px] leading-[1.45] tracking-[0.08em] text-e26-text-2 md:text-xs", utilityClass].join(" ")}>
            Kenji trực tiếp đọc · Chưa đặt lịch · Chưa phát sinh thanh toán
          </p>
          <p className={["mt-6 max-w-[560px] text-[11px] leading-[1.75] tracking-[0.08em] text-e26-text-2 md:text-xs md:leading-[1.7]", utilityClass].join(" ")}>
            Nếu bạn đang ở trong tình trạng khẩn cấp hoặc có nguy cơ làm tổn thương bản thân hay người khác, hãy ưu tiên liên hệ ngay với một người thân đáng tin, cơ sở y tế hoặc dịch vụ khẩn cấp tại nơi bạn đang sống.
          </p>
          <p className={["mt-8 flex flex-wrap gap-x-5 gap-y-3 text-[11px] tracking-[0.08em] text-e26-text-2 md:text-xs", utilityClass].join(" ")}>
            <Link href="/dieu-essence-khong-hua" className="underline decoration-e26-text-2 underline-offset-4 transition-colors hover:text-e26-text">Điều Essence không hứa</Link>
            <Link href="/chinh-sach-rieng-tu" className="underline decoration-e26-text-2 underline-offset-4 transition-colors hover:text-e26-text">Chính sách riêng tư</Link>
          </p>
        </Lang90Reveal>
      </div>
    </section>
  );
}

function FaqList() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const baseId = useId();

  return (
    <div className="border-t border-e26-border">
      {faqItems.map((item, index) => {
        const panelId = baseId + "-" + index;
        const open = index === openIndex;

        return (
          <div key={item.question} className="border-b border-e26-border">
            <h3>
              <button
                type="button"
                onClick={() => setOpenIndex(open ? null : index)}
                aria-expanded={open}
                aria-controls={panelId}
                className="flex min-h-16 w-full items-center justify-between gap-6 py-6 text-left font-serif text-[22px] font-medium leading-snug tracking-[-0.01em] text-e26-text transition-colors hover:text-e26-text-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-e26-text-2 focus-visible:ring-offset-4 focus-visible:ring-offset-e26-ivory md:text-[25px]"
              >
                <span>{item.question}</span>
                <span aria-hidden="true" className="text-xl font-normal">{open ? "−" : "+"}</span>
              </button>
            </h3>
            <div id={panelId} className={open ? "grid grid-rows-[1fr] opacity-100 transition-[grid-template-rows,opacity] duration-500 motion-reduce:transition-none" : "grid grid-rows-[0fr] opacity-0 transition-[grid-template-rows,opacity] duration-500 motion-reduce:transition-none"}>
              <div className="overflow-hidden">
                <div className={["pb-8 pr-4", bodyClass].join(" ")}>{item.answer}</div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function FaqScene() {
  return (
    <section data-lang90-scene="faq" className="relative overflow-hidden bg-e26-ivory px-6 py-28 md:py-40">
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-64 bg-[radial-gradient(ellipse_at_82%_100%,rgba(255,255,255,0.85),transparent_66%)]" />
      <div className="relative mx-auto max-w-[760px]">
        <Lang90Reveal>
          <p className={sectionLabelClass}>NHỮNG ĐIỀU CÓ THỂ BẠN ĐANG HỎI</p>
        </Lang90Reveal>
        <Lang90Reveal delay="short" className="mt-7">
          <FaqList />
        </Lang90Reveal>
      </div>
    </section>
  );
}

function ClosingScene() {
  return (
    <section data-lang90-scene="closing" className="relative flex min-h-[88svh] overflow-hidden bg-e26-black px-6 py-24 md:min-h-[92svh] md:py-32">
      <Lang90Lightscape scene="doorway" alt="" className="object-[58%_center] md:object-center" />
      <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(90deg,rgba(26,26,26,0.68)_0%,rgba(26,26,26,0.4)_48%,rgba(26,26,26,0.08)_100%)]" />
      <div className="relative mx-auto flex w-full max-w-[1080px] flex-col justify-end">
        <Lang90Reveal className="max-w-[620px]">
          <Lang90SectionHeading className="text-e26-text-dark">Bạn không cần quyết định ngay.</Lang90SectionHeading>
          <div className={["mt-10 space-y-6", darkBodyClass].join(" ")}>
            <p>Chỉ cần nhớ:</p>
            <p>khi bạn muốn ngồi xuống<br />và nhìn một điều cho đủ rõ,<br />cánh cửa này vẫn ở đây.</p>
          </div>
          <div className={["mt-14 border-t border-e26-border-dark pt-8", darkSectionLabelClass].join(" ")}>
            <p>Có câu hỏi trước khi bắt đầu?</p>
            <a href="mailto:contact@coachkenjipham.com" className="mt-5 inline-block text-e26-text-dark transition-colors hover:text-e26-text-dark-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-e26-text-dark-2">
              contact@coachkenjipham.com
            </a>
          </div>
        </Lang90Reveal>
      </div>
    </section>
  );
}

export default function Lang90Cinematic() {
  return (
    <>
      <HeroScene />
      <RecognitionScene />
      <SignalScene />
      <DefinitionScene />
      <KenjiScene />
      <JourneyScene />
      <OutcomeScene />
      <SessionInfoScene />
      <BreathScene />
      <CtaScene />
      <FaqScene />
      <ClosingScene />
    </>
  );
}
