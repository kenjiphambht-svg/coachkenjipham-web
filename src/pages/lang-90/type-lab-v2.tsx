import Head from "next/head";
import type { ReactNode } from "react";

import {
  Lang90AccentVoice,
  Lang90DefinitionAccentVoice,
  Lang90HeroComposition,
  Lang90ScopeHeading,
  Lang90SectionHeading,
  Lang90SignalComposition,
} from "@/components/lang-90/Lang90Composition";
import { bodyClass, sectionLabelClass, utilityClass } from "@/components/lang-90/Lang90Frame";

function SpecNote({ children, className = "" }: { children: string; className?: string }) {
  return <p className={`mt-5 font-sans text-[11px] leading-[1.6] text-e26-text-2 ${className}`}>{children}</p>;
}

function LabCard({ children, className = "", dark = false }: { children: ReactNode; className?: string; dark?: boolean }) {
  return <section className={`border border-e26-border p-6 md:p-10 ${dark ? "bg-e26-black" : "bg-e26-ivory"} ${className}`}>{children}</section>;
}

export default function Lang90TypeLabV2() {
  return (
    <>
      <Head>
        <title>Lặng Type Lab V2 — internal preview</title>
        <meta name="robots" content="noindex,nofollow" />
      </Head>
      <main className="min-h-screen bg-e26-cream px-5 py-10 text-e26-text md:px-10 md:py-16" style={{ fontSynthesis: "none" }}>
        <div className="mx-auto max-w-[1280px]">
          <p className={sectionLabelClass}>Lặng · Type Lab V2 · branch preview only</p>
          <h1 className="mt-5 font-serif text-[38px] font-medium leading-[1.1] tracking-[-0.02em] md:text-[56px]">
            Typography composition
          </h1>
          <p className={`mt-6 ${bodyClass} max-w-[720px]`}>
            V1 thử nhịp Hero, Signal và các điểm nhấn có lý do; không phải typography standard toàn website.
          </p>

          <div className="mt-14 grid gap-8">
            <LabCard dark className="text-e26-text-dark">
              <p className="font-sans text-xs font-medium uppercase tracking-[0.14em] text-e26-text-dark-2">Hero · desktop composition</p>
              <div className="mt-12 max-w-[820px]">
                <Lang90HeroComposition />
              </div>
              <SpecNote className="text-e26-text-dark-2">Display serif Cormorant Garamond · Roman 62px / transition 48px / true italic 68px at desktop · weight 500/500/400 · three semantic tiers.</SpecNote>
            </LabCard>

            <LabCard dark className="max-w-[375px] text-e26-text-dark">
              <p className="font-sans text-xs font-medium uppercase tracking-[0.14em] text-e26-text-dark-2">Hero · mobile composition</p>
              <div className="mt-10">
                <Lang90HeroComposition />
              </div>
              <SpecNote className="text-e26-text-dark-2">Roman 31px / transition 24px / true italic 34px · mobile may wrap naturally; no nowrap.</SpecNote>
            </LabCard>

            <div className="grid gap-8 xl:grid-cols-2">
              <LabCard dark className="text-e26-text-dark">
                <p className="font-sans text-xs font-medium uppercase tracking-[0.14em] text-e26-text-dark-2">Signal option A · selected for page</p>
                <div className="mt-12 max-w-[980px]">
                  <Lang90SignalComposition align="left" />
                </div>
                <SpecNote className="text-e26-text-dark-2">Left-aligned editorial composition · Roman 48px / true italic 68px / Roman 56px at desktop · 500/400/500 · generous inter-tier spacing.</SpecNote>
              </LabCard>

              <LabCard dark className="text-e26-text-dark">
                <p className="font-sans text-xs font-medium uppercase tracking-[0.14em] text-e26-text-dark-2">Signal option B · reference only</p>
                <div className="mt-12 max-w-[980px]">
                  <Lang90SignalComposition align="center" />
                </div>
                <SpecNote className="text-e26-text-dark-2">Same family, size, weight and italic logic as Option A · centered only for comparison; not used in the main page.</SpecNote>
              </LabCard>
            </div>

            <div className="grid gap-8 lg:grid-cols-2">
              <LabCard>
                <p className={sectionLabelClass}>Section heading · stable</p>
                <Lang90SectionHeading className="mt-7">Bên ngoài, mọi thứ vẫn đang vận hành.</Lang90SectionHeading>
                <SpecNote>Cormorant Garamond Roman · 30/40/42px · weight 500 · line-height 1.25 · no internal emphasis.</SpecNote>
              </LabCard>

              <LabCard>
                <p className={sectionLabelClass}>Section heading · controlled emphasis</p>
                <Lang90ScopeHeading className="mt-7" />
                <SpecNote>Cormorant Garamond Roman + true italic only on the final logical clause · 30/40/42px · one of the few internal emphases on the page.</SpecNote>
              </LabCard>
            </div>

            <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
              <LabCard>
                <p className={sectionLabelClass}>Reading body</p>
                <div className={`mt-7 ${bodyClass} space-y-6`}>
                  <p>Công việc vẫn chạy. Bạn vẫn trả lời những câu hỏi cần trả lời. Người khác vẫn thấy bạn ổn.</p>
                  <p>Chỉ là ở bên trong, có một điều gì đó đã lệch nhịp từ lâu, và bạn vẫn chưa gọi được tên nó.</p>
                  <p>Nhưng có những điều rất khó nhìn khi ta đang đứng bên trong nó.</p>
                </div>
                <SpecNote>Inter · 18px mobile, 19px tablet, 20px desktop · weight 400 · line-height 1.72–1.75 · max-width 680px.</SpecNote>
              </LabCard>

              <LabCard>
                <p className={sectionLabelClass}>Accent voice</p>
                <Lang90DefinitionAccentVoice className="mt-7" />
                <div className="mt-12 border-t border-e26-border pt-8">
                  <Lang90AccentVoice>Và cũng chưa phải thanh toán.</Lang90AccentVoice>
                </div>
                <SpecNote>True italic for a change of voice; Roman medium only for “hỏi thẳng,”; final explanatory clause returns to the reading font.</SpecNote>
              </LabCard>
            </div>

            <LabCard>
              <p className={sectionLabelClass}>Utility + CTA</p>
              <div className="mt-8 flex flex-col items-start gap-5">
                <button type="button" className={`min-h-14 bg-e26-gold px-8 py-4 ${utilityClass} text-[13px] uppercase tracking-[0.08em] text-e26-black`}>
                  BẮT ĐẦU 6 CÂU HỎI
                </button>
                <p className={`${utilityClass} text-xs tracking-[0.08em] text-e26-text-2`}>Chưa đặt lịch. Chưa phát sinh thanh toán.</p>
              </div>
              <SpecNote>Inter · utility weight 500 · CTA 13px uppercase at 0.08em; microcopy 12px and not uppercase.</SpecNote>
            </LabCard>
          </div>
        </div>
      </main>
    </>
  );
}
