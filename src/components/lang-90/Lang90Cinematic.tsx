import Image from "next/image";
import Link from "next/link";
import { useId, useState } from "react";

import {
  bodyClass,
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
    number: "Một",
    title: "Bắt đầu từ nơi đang rối nhất",
    copy: "Bạn không cần kể câu chuyện theo đúng trình tự. Chúng ta bắt đầu từ điều đang khiến bạn có mặt ở đây.",
  },
  {
    number: "Hai",
    title: "Nhìn điều đang nằm bên dưới",
    copy: "Một vòng lặp, một nỗi sợ hoặc một mâu thuẫn chính bắt đầu hiện ra. Không cần tìm mười vấn đề. Chỉ cần nhìn đúng một điều đang thật sự dẫn phản ứng của bạn.",
  },
  {
    number: "Ba",
    title: "Mang điều vừa thấy trở lại đời sống",
    copy: "Trước khi kết thúc, chúng ta chọn một việc có thể làm hoặc quan sát trong 48 giờ tiếp theo.",
  },
];

const outcomes = [
  "Điều chính đang kéo bạn được gọi đúng tên.",
  "Một phản ứng hoặc vòng lặp cần tiếp tục quan sát.",
  "Một bước đủ nhỏ để thực hiện trong 48 giờ.",
  "Bản tóm tắt riêng 1–2 trang để bạn không phải cố nhớ mọi thứ.",
];

const sessionDetails = [
  ["Thời lượng", "90 phút"],
  ["Hình thức", "Trực tuyến hoặc gặp trực tiếp tại Sài Gòn"],
  ["Người giữ phiên", "Kenji Phạm"],
  ["Phí phiên", "10.000.000 đồng"],
  ["Sau phiên", "Bản tóm tắt riêng 1–2 trang"],
  ["Số lượng", "Tối đa 5 phiên mỗi tháng"],
] as const;

const faqItems = [
  [
    "Tôi không biết phải bắt đầu nói từ đâu thì sao?",
    "Bạn không cần biết trước. Có thể bắt đầu bằng một sự việc, một cảm giác, một câu hỏi — hoặc chỉ bằng câu: “Tôi không biết phải bắt đầu từ đâu.”",
  ],
  [
    "Tôi có phải kể hết mọi chuyện không?",
    "Không. Bạn kể đến đâu, chúng ta làm việc đến đó. Không cần kể trọn cuộc đời để nhìn rõ điều đang diễn ra lúc này.",
  ],
  [
    "Kenji có nói tôi nên làm gì không?",
    "Kenji có thể hỏi thẳng, đưa ra một góc nhìn hoặc chỉ ra nơi bạn đang né tránh. Quyết định vẫn là của bạn.",
  ],
  [
    "Những gì tôi chia sẻ có được giữ riêng tư không?",
    "Kenji trực tiếp đọc phần bạn gửi. Nội dung được giữ trong phạm vi riêng tư của quá trình làm việc, trừ khi có một nguy cơ an toàn nghiêm trọng cần được xử lý trước.",
  ],
] as const;

function HeroScene() {
  return (
    <section data-lang90-scene="hero" className="relative flex min-h-[88svh] overflow-hidden bg-e26-black px-6 py-16 md:min-h-[92svh] md:py-24">
      <Lang90Lightscape scene="opening" alt="" priority className="object-[63%_center] md:object-center" />
      <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(90deg,rgba(26,26,26,0.48)_0%,rgba(26,26,26,0.22)_52%,rgba(26,26,26,0.08)_100%)]" />
      <div className="relative mx-auto flex w-full max-w-[1120px] flex-col justify-end pb-4 md:pb-10">
        <Lang90Reveal>
          <p className={darkSectionLabelClass}>Lặng</p>
        </Lang90Reveal>
        <Lang90Reveal delay="short" className="mt-8 max-w-[285px] md:max-w-[760px]">
          <Lang90HeroComposition />
        </Lang90Reveal>
        <Lang90Reveal delay="long" className="mt-10 max-w-[285px] md:max-w-[620px] md:mt-12">
          <p className={[bodyClass, "max-w-[590px] text-e26-text-dark-2"].join(" ")}>
            Một lần ngồi xuống đủ lâu để tiếng ồn bớt đi — và điều thật sự đang dẫn bạn bắt đầu hiện ra.
          </p>
          <p className={["mt-8 text-[11px] md:text-xs", darkSectionLabelClass].join(" ")}>
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
          <p className={darkSectionLabelClass}>Bên ngoài vẫn vận hành</p>
          <Lang90SectionHeading className="mt-7 max-w-[700px] text-e26-text-dark">
            Có những điều rất khó nhìn khi ta vẫn đang đứng bên trong nó.
          </Lang90SectionHeading>
        </Lang90Reveal>
        <Lang90Reveal delay="short" className={["mt-12 max-w-[650px] space-y-8", bodyClass, "text-e26-text-dark-2"].join(" ")}>
          <p>Bạn vẫn làm việc. Vẫn trả lời những câu cần trả lời. Người khác vẫn thấy bạn ổn.</p>
          <p>Chỉ có một điều bên trong đã lệch nhịp từ lâu — và bạn vẫn chưa gọi được tên.</p>
          <p>Bạn đã nghĩ về nó nhiều lần. Nhưng rất khó nhìn thấy toàn bộ căn phòng khi mình vẫn đang đứng bên trong.</p>
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
    <section data-lang90-scene="clarity" className="bg-e26-cream-deep px-6 py-24 md:py-36">
      <div className="mx-auto max-w-[1080px] md:grid md:grid-cols-[0.78fr_1fr] md:gap-20">
        <Lang90Reveal>
          <p className={sectionLabelClass}>Lặng thực sự làm gì</p>
        </Lang90Reveal>
        <div className="mt-8 md:mt-0">
          <Lang90Reveal delay="short">
            <Lang90SectionHeading className="text-e26-text">
              Trong Lặng, chúng ta không cố giải quyết cả cuộc đời.
            </Lang90SectionHeading>
          </Lang90Reveal>
          <Lang90Reveal delay="short" className={["mt-12 space-y-7", bodyClass].join(" ")}>
            <p>Chúng ta bắt đầu từ điều đang rối nhất.</p>
            <p>Nhìn xem điều gì thật sự nằm bên dưới phản ứng ấy.</p>
            <p>Và chọn một bước đủ nhỏ để đời sống bắt đầu khác đi.</p>
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
            <p className={sectionLabelClass}>Người ngồi cùng bạn</p>
            <Lang90SectionHeading className="mt-7 text-e26-text">Tôi là Kenji Phạm.</Lang90SectionHeading>
          </Lang90Reveal>
          <Lang90Reveal delay="short" className={["mt-12 space-y-8", bodyClass].join(" ")}>
            <p>Có những giai đoạn trong đời, tôi không thể đi qua chỉ bằng những điều mình đã học. Vì vậy, điều tôi mang vào phiên không phải một câu trả lời có sẵn.</p>
            <p>Đó là khả năng ở lại, nhìn kỹ và nói thật — mà không vội cứu, không phán xét và không lấy quyền quyết định khỏi tay bạn.</p>
            <p>Tôi không sửa. Tôi tạo một khoảng đủ An định để bạn nhìn rõ hơn.</p>
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
      <div className="relative mx-auto max-w-[1080px]">
        <Lang90Reveal>
          <p className={sectionLabelClass}>Hành trình 90 phút</p>
          <Lang90SectionHeading className="mt-7 max-w-[650px] text-e26-text">Trong 90 phút, chúng ta đi qua ba nhịp.</Lang90SectionHeading>
        </Lang90Reveal>
        <div className="mt-16 grid gap-10 md:mt-20 md:grid-cols-3 md:gap-12">
          {journeySteps.map((step, index) => (
            <Lang90Reveal key={step.number} delay={index === 1 ? "short" : index === 2 ? "long" : "none"}>
              <article className="border-t border-e26-border pt-7">
                <p className={sectionLabelClass}>{step.number}</p>
                <h3 className="mt-5 font-serif text-[27px] font-medium leading-[1.2] tracking-[-0.012em] text-e26-text md:text-[31px]">{step.title}</h3>
                <p className={["mt-7", bodyClass].join(" ")}>{step.copy}</p>
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
          <p className={sectionLabelClass}>Điều người đọc mang về</p>
          <Lang90SectionHeading className="mt-7 max-w-[590px] text-e26-text">Bạn không cần rời phiên với mọi câu trả lời.</Lang90SectionHeading>
          <Lang90AccentVoice className="mt-6 text-e26-text">Chỉ cần một điều đã rõ hơn.</Lang90AccentVoice>
        </Lang90Reveal>
        <div className="mt-14 md:mt-0">
          {outcomes.map((outcome, index) => (
            <Lang90Reveal key={outcome} delay={index > 1 ? "short" : "none"}>
              <div className="grid grid-cols-[2rem_1fr] gap-5 border-t border-e26-border py-6 last:border-b">
                <p className={sectionLabelClass}>0{index + 1}</p>
                <p className={bodyClass}>{outcome}</p>
              </div>
            </Lang90Reveal>
          ))}
          <Lang90Reveal delay="long" className={["mt-10 max-w-[620px]", bodyClass].join(" ")}>
            Ngày 7 và ngày 30, bạn nhận một lời nhắc để nhìn lại điều gì đã thay đổi — và bước tiếp theo nào, nếu có, bạn muốn tự chọn cho mình.
          </Lang90Reveal>
        </div>
      </div>
    </section>
  );
}

function FaqList() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const baseId = useId();

  return (
    <div className="border-t border-e26-border">
      {faqItems.map(([question, answer], index) => {
        const panelId = baseId + "-" + index;
        const open = index === openIndex;

        return (
          <div key={question} className="border-b border-e26-border">
            <h3>
              <button
                type="button"
                onClick={() => setOpenIndex(open ? null : index)}
                aria-expanded={open}
                aria-controls={panelId}
                className="flex min-h-16 w-full items-center justify-between gap-6 py-6 text-left font-serif text-[22px] font-medium leading-snug tracking-[-0.01em] text-e26-text transition-colors hover:text-e26-text-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-e26-text-2 focus-visible:ring-offset-4 focus-visible:ring-offset-e26-cream md:text-[25px]"
              >
                <span>{question}</span>
                <span aria-hidden="true" className="text-xl font-normal">{open ? "−" : "+"}</span>
              </button>
            </h3>
            <div id={panelId} className={open ? "grid grid-rows-[1fr] opacity-100 transition-[grid-template-rows,opacity] duration-500 motion-reduce:transition-none" : "grid grid-rows-[0fr] opacity-0 transition-[grid-template-rows,opacity] duration-500 motion-reduce:transition-none"}>
              <div className="overflow-hidden">
                <p className={["pb-8 pr-4", bodyClass].join(" ")}>{answer}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function OfferScene() {
  return (
    <section data-lang90-scene="offer" className="bg-e26-cream px-6 py-24 md:py-36">
      <div className="mx-auto max-w-[1080px]">
        <Lang90Reveal>
          <p className={sectionLabelClass}>Thông tin phiên và cánh cửa sáu câu hỏi</p>
          <Lang90SectionHeading className="mt-7 max-w-[680px] text-e26-text">Bạn chưa đặt lịch ngay.</Lang90SectionHeading>
        </Lang90Reveal>
        <div className="mt-14 grid gap-16 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1fr)] lg:gap-20">
          <Lang90Reveal delay="short" className={["space-y-7", bodyClass].join(" ")}>
            <p>Trước tiên là sáu câu hỏi, khoảng 5–10 phút. Tôi trực tiếp đọc và phản hồi trong một ngày làm việc.</p>
            <p>Nếu phù hợp, bạn mới nhận đường dẫn chọn lịch. Sau khi chọn được thời gian, bạn mới đến bước thanh toán.</p>
            <p>Nếu Lặng không phải cánh cửa phù hợp lúc này, tôi cũng sẽ nói rõ.</p>
            <p className="border-l border-e26-border pl-6 text-e26-text">Lặng không thay thế hỗ trợ y tế hoặc chuyên môn sức khỏe tâm thần. Nếu điều bạn đang trải qua nằm ngoài phạm vi của phiên, Kenji sẽ nói rõ để bạn không nhận sai loại hỗ trợ.</p>
          </Lang90Reveal>
          <Lang90Reveal delay="short">
            <dl className="border-y border-e26-border">
              {sessionDetails.map(([label, value]) => (
              <div key={label} className="grid gap-2 border-b border-e26-border py-5 last:border-b-0 md:grid-cols-[140px_1fr] md:gap-7">
                <dt className={sectionLabelClass}>{label}</dt>
                <dd className={bodyClass}>{value}</dd>
              </div>
              ))}
            </dl>
          </Lang90Reveal>
        </div>
        <Lang90Reveal delay="long" className="mx-auto mt-16 max-w-[680px] text-center md:mt-20">
          <Link
            href="/lang-90/dat-phien"
            className={["inline-flex min-h-14 items-center justify-center bg-e26-gold px-8 py-4 text-[13px] uppercase tracking-[0.08em] text-e26-black transition-colors hover:bg-e26-gold-deep hover:text-e26-ivory focus:outline-none focus-visible:ring-2 focus-visible:ring-e26-gold-deep focus-visible:ring-offset-4 focus-visible:ring-offset-e26-cream", utilityClass].join(" ")}
          >
            BẮT ĐẦU 6 CÂU HỎI
          </Link>
          <p className={["mt-5 text-xs tracking-[0.08em] text-e26-text-2", utilityClass].join(" ")}>
            Kenji trực tiếp đọc · Chưa đặt lịch · Chưa phát sinh thanh toán
          </p>
        </Lang90Reveal>
        <div className="mx-auto mt-24 max-w-[760px] md:mt-32">
          <Lang90Reveal>
            <p className={sectionLabelClass}>Những điều có thể bạn đang hỏi</p>
          </Lang90Reveal>
          <Lang90Reveal delay="short" className="mt-7">
            <FaqList />
          </Lang90Reveal>
        </div>
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
          <Lang90AccentVoice className="text-[31px] leading-[1.22] text-e26-text-dark md:text-[42px] md:leading-[1.25]">
            Cảm ơn bạn đã dành thời gian<br />ngồi lại cùng chính mình.
          </Lang90AccentVoice>
          <div className={["mt-10 space-y-6 text-e26-text-dark-2", bodyClass].join(" ")}>
            <p>Bạn không cần bước qua cánh cửa này vì đang bị thúc giục.</p>
            <p>Chỉ khi bạn cảm thấy mình đã sẵn sàng ngồi xuống — và nhìn một điều cho đủ rõ.</p>
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
      <OfferScene />
      <ClosingScene />
    </>
  );
}
