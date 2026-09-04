import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { SEO } from "@/components/SEO";
import GrainOverlay from "@/components/homepage/GrainOverlay";
import HomeHeader from "@/components/homepage/HomeHeader";
import HomeFooter from "@/components/homepage/HomeFooter";
import NotesTeaser from "@/components/homepage/NotesTeaser";
import { useHomeReveal } from "@/components/homepage/useHomeReveal";

const CANONICAL_URL = "https://coachkenjipham.com/";
const thresholdMotion = "duration-[420ms] ease-out motion-reduce:transition-none motion-reduce:duration-0";
const softLink =
  `group relative inline-flex min-h-11 items-center gap-2 font-sans text-[13px] font-medium uppercase tracking-[0.12em] text-e26-text transition-opacity hover:opacity-70 ${thresholdMotion}`;

export default function VillaPage() {
  useHomeReveal();
  const [heroReady, setHeroReady] = useState(false);

  const revealDecodedHero = async (image: HTMLImageElement) => {
    try {
      await image.decode();
    } finally {
      if (image.complete && image.naturalWidth === 3200) setHeroReady(true);
    }
  };

  return (
    <>
      <SEO
        title="ESSENCE — Từ Bản sắc đến Hiện thực"
        ogTitle="ESSENCE — Câu chuyện cuộc sống của bạn là một kiệt tác."
        description="ESSENCE giúp điều được nhìn rõ đi tiếp vào lựa chọn, hành động và hiện thực có thể quan sát — trong đời sống hoặc công việc."
        ogDescription="Từ điều được nhận ra đến lựa chọn có ý thức và hiện thực có thể quan sát."
        image="https://coachkenjipham.com/essence-og-1200x630.png"
        url={CANONICAL_URL}
      />

      <Head>
        <meta name="robots" content="noindex" />
        <link rel="canonical" href={CANONICAL_URL} />
        <link rel="preload" as="image" href="/images/home/home-scene-01-first-paint.webp" type="image/webp" />
        <link rel="preload" as="image" href="/images/home/home-scene-01-master.webp" type="image/webp" fetchPriority="high" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/favicon-192.png" />
        <link rel="icon" type="image/png" sizes="512x512" href="/favicon-512.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon-180.png" />
      </Head>

      <GrainOverlay />
      <HomeHeader homeIa />

      <main className="bg-e26-ivory text-e26-text">
        {/* 01 — freedom / recognition */}
        <section className="relative isolate min-h-[100svh] overflow-hidden px-6 pb-20 pt-32 text-e26-ivory md:flex md:items-center md:px-10 md:pb-36 md:pt-40">
          <div className="absolute inset-0 -z-30" aria-hidden="true">
            <img
              src="/images/home/home-scene-01-first-paint.webp"
              alt=""
              width="160"
              height="90"
              loading="eager"
              decoding="sync"
              className="absolute inset-0 h-full w-full object-cover object-[70%_center] md:object-center"
            />
            <img
              src="/images/home/home-scene-01-master.webp"
              alt=""
              width="3200"
              height="1801"
              loading="eager"
              fetchPriority="high"
              decoding="async"
              onLoad={(event) => void revealDecodedHero(event.currentTarget)}
              className={`relative z-10 h-full w-full object-cover object-[70%_center] md:object-center ${heroReady ? "opacity-100" : "opacity-0"}`}
            />
          </div>
          <div
            className="pointer-events-none absolute inset-0 -z-20 [--veil-color:rgba(26,23,20,0.26)] [--veil-filter:none] md:[--veil-color:rgba(26,26,26,0.16)] md:[--veil-filter:saturate(0.05)]"
            style={{
              background: "var(--veil-color)",
              backdropFilter: "var(--veil-filter)",
              WebkitBackdropFilter: "var(--veil-filter)",
              maskImage: "linear-gradient(90deg, black 0%, black 32%, rgba(0,0,0,0.86) 46%, rgba(0,0,0,0.28) 61%, transparent 74%)",
              WebkitMaskImage: "linear-gradient(90deg, black 0%, black 32%, rgba(0,0,0,0.86) 46%, rgba(0,0,0,0.28) 61%, transparent 74%)",
            }}
            aria-hidden="true"
          />
          <div
            className="absolute inset-0 -z-20 md:hidden"
            style={{
              background:
                "linear-gradient(90deg, color-mix(in srgb, var(--essence-black-2026) 62%, transparent) 0%, color-mix(in srgb, var(--essence-black-2026) 50%, transparent) 58%, color-mix(in srgb, var(--essence-black-2026) 18%, transparent) 82%, transparent 100%)",
            }}
            aria-hidden="true"
          />
          <div
            className="absolute inset-0 -z-20 hidden md:block"
            style={{
              background:
                "linear-gradient(90deg, color-mix(in srgb, var(--essence-black-2026) 68%, transparent) 0%, color-mix(in srgb, var(--essence-black-2026) 58%, transparent) 42%, color-mix(in srgb, var(--essence-black-2026) 30%, transparent) 58%, color-mix(in srgb, var(--essence-black-2026) 8%, transparent) 76%, transparent 100%)",
            }}
            aria-hidden="true"
          />
          <div className="pointer-events-none absolute inset-y-0 left-0 -z-10 w-[16%] bg-gradient-to-r from-black/28 to-transparent backdrop-blur-[1px]" aria-hidden="true" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[28%] bg-gradient-to-t from-black/18 to-transparent" aria-hidden="true" />

          <div className="relative z-10 mx-auto w-full max-w-7xl">
            <div className="e26-reveal relative" style={{ textShadow: "0 3px 28px rgba(0,0,0,0.24)" }}>
              <h1 className="max-w-[266px] font-serif text-[44px] font-medium leading-[0.98] tracking-[-0.028em] md:max-w-[1080px] md:text-[88px] lg:text-[108px]">
                Có những điều bạn<br className="hidden md:block" /> biết rất rõ.
              </h1>

              <div data-body-copy className="mt-9 max-w-[270px] space-y-2 font-sans text-[16px] font-normal leading-[1.68] md:ml-[7%] md:mt-14 md:max-w-[420px] md:text-[18px] md:leading-[1.72]">
                <p>Một cuộc nói chuyện cần diễn ra.</p>
                <p>Một việc cần dừng.</p>
                <p>Một quyết định không thể để lâu hơn.</p>
                <p className="pt-4 font-medium">Nhưng biết rồi vẫn chưa chắc làm được.</p>
              </div>

              <p className="mt-10 max-w-[258px] font-serif text-[27px] font-medium leading-[1.1] tracking-[-0.018em] md:ml-[34%] md:mt-20 md:max-w-[760px] md:text-[52px] md:leading-[1.12] lg:text-[58px]">
                Từ điều bạn biết đến điều bạn thực sự chọn, vẫn còn một khoảng cách.
              </p>

              <div className="mt-8 md:ml-[34%] md:mt-12" aria-hidden="true">
                <span className="block h-px w-14 bg-[#E0C068]" />
              </div>
            </div>
          </div>
        </section>

        {/* 02 — freedom / identity recognition */}
        <section className="relative z-10 bg-e26-white px-6 pb-16 pt-28 before:pointer-events-none before:absolute before:inset-x-4 before:-top-6 before:h-6 before:bg-e26-white md:px-10 md:pb-24 md:pt-44 md:before:inset-x-10 md:before:-top-12 md:before:h-12">
          {/* A flat editorial plane lifts over the final empty edge of Scene 01. */}

          <div className="relative mx-auto max-w-6xl text-center">
            <span className="e26-reveal mx-auto mb-14 block h-px w-16 bg-[#E0C068] md:mb-20" aria-hidden="true" />

            <h2 className="e26-reveal mx-auto max-w-[1120px] font-serif">
              <span className="sr-only">Điều gì đang chọn thay bạn?</span>
              <span aria-hidden="true" className="block">
                <span className="block text-[45px] font-normal italic leading-[1.02] tracking-[-0.02em] md:text-[72px]">Điều gì đang</span>
                <span className="-my-1 block text-[82px] font-medium uppercase leading-[0.84] tracking-[-0.045em] md:-my-2 md:text-[156px] lg:text-[176px]">chọn</span>
                <span className="block text-[48px] font-normal italic leading-[1.02] tracking-[-0.02em] md:text-[76px]">thay bạn?</span>
              </span>
            </h2>

            <div data-body-copy className="e26-reveal mx-auto mt-14 max-w-[620px] space-y-2 font-sans text-[16px] leading-[1.78] md:mt-20 md:text-[18px] md:leading-[1.74]">
              <p>Một phản xạ từng giúp bạn an toàn.</p>
              <p>Một cách sống đã thành quen.</p>
            </div>

            <p data-body-copy className="e26-reveal mx-auto mt-16 max-w-[770px] font-sans text-[17px] leading-[1.82] md:mt-24 md:text-[20px] md:leading-[1.74]">
              <span className="font-medium tracking-[0.05em]">ESSENCE</span> giúp bạn nhìn rõ điều đang dẫn nhịp lựa chọn của mình — để nhận ra điều gì đã thành quen, và điều gì thật sự thuộc về bạn.
            </p>

            <div className="e26-reveal mx-auto mt-24 md:mt-36">
              <span className="mx-auto block h-px w-16 bg-[#E0C068]" aria-hidden="true" />
              <p className="mx-auto mt-10 max-w-[1080px] font-serif md:mt-14">
                <span className="sr-only">Bản sắc không phải một chiếc nhãn.</span>
                <span aria-hidden="true" className="block">
                  <span className="block text-[78px] font-medium uppercase leading-[0.84] tracking-[-0.045em] md:text-[142px] lg:text-[160px]">Bản sắc</span>
                  <span className="mt-3 block text-[32px] font-normal italic leading-[1.06] tracking-[-0.016em] md:mt-4 md:text-[48px]">không phải</span>
                  <span className="mt-1 block text-[42px] font-normal leading-[1.02] tracking-[-0.02em] md:text-[66px] lg:text-[72px]">một chiếc nhãn.</span>
                </span>
              </p>
            </div>

            <p data-body-copy className="e26-reveal mx-auto mt-10 max-w-[660px] font-sans text-[16px] leading-[1.82] md:mt-14 md:text-[18px] md:leading-[1.76]">
              Đó là con người thật của bạn, được nhận ra dần qua chính đời sống mình đang sống.
            </p>

            <p className="e26-reveal mx-auto mt-24 max-w-[920px] font-serif md:mt-36">
              <span className="sr-only">Càng hiểu rõ mình, bạn càng có thêm quyền lựa chọn.</span>
              <span aria-hidden="true" className="block">
                <span className="block text-[32px] font-normal italic leading-[1.08] tracking-[-0.016em] md:text-[44px]">Càng hiểu rõ mình,</span>
                <span className="mt-2 block text-[41px] font-medium leading-[1.06] tracking-[-0.022em] md:mt-3 md:text-[60px] lg:text-[66px]">bạn càng có thêm quyền lựa chọn.</span>
              </span>
            </p>
          </div>
        </section>

        {/* 03 — wisdom / from recognition to reality */}
        <section className="relative z-20 px-6 pb-28 pt-16 before:pointer-events-none before:absolute before:inset-x-4 before:-bottom-6 before:h-6 before:bg-[color-mix(in_srgb,var(--essence-white-2026)_60%,var(--essence-ivory-2026))] md:px-10 md:pb-48 md:pt-24 md:before:inset-x-10 md:before:-bottom-12 md:before:h-12" style={{ background: "linear-gradient(to bottom, var(--essence-white-2026), color-mix(in srgb, var(--essence-white-2026) 60%, var(--essence-ivory-2026)))" }}>

          <div className="relative mx-auto max-w-7xl">
            <div className="mx-auto max-w-[980px] text-center">
              <h2 className="e26-reveal mx-auto max-w-[900px] font-serif text-[42px] font-medium leading-[1.08] tracking-[-0.02em] md:text-[64px] lg:text-[72px]">
                Trí tuệ không phải<br className="hidden md:block" /> biết nhiều hơn.
              </h2>

              <div data-body-copy className="e26-reveal mx-auto mt-12 max-w-[560px] font-sans text-[17px] leading-[1.76] md:mt-16 md:text-[18px]">
                <p>Có lúc bạn đã hiểu đủ.</p>
                <p className="mt-4">Điều còn thiếu là nhìn đủ rõ để biết:</p>
                <p className="mt-7 font-medium">điều gì đáng giữ,<br />điều gì đã hết vai trò,<br />và điều gì bạn thực sự chọn.</p>
              </div>
            </div>

            <div className="e26-reveal relative mt-20 py-6 md:mt-28 lg:min-h-[260px] lg:py-14">
              <p aria-label="NHẬN RA → LỰA CHỌN → HIỆN THỰC" className="relative grid gap-10 text-center lg:grid-cols-[0.86fr_1fr_1.14fr] lg:gap-8 lg:text-left">
                <span data-home-flow-anchor aria-hidden="true" className="whitespace-nowrap font-serif text-[36px] font-medium leading-none tracking-[-0.02em] lg:text-[52px]">NHẬN RA</span>
                <span data-home-flow-anchor aria-hidden="true" className="whitespace-nowrap font-serif text-[42px] font-medium leading-none tracking-[-0.022em] lg:translate-y-10 lg:text-[58px]">LỰA CHỌN</span>
                <span data-home-flow-anchor aria-hidden="true" className="whitespace-nowrap font-serif text-[48px] font-medium leading-none tracking-[-0.026em] lg:translate-y-20 lg:text-[64px]">HIỆN THỰC</span>
              </p>
              <span data-flow-arrow className="pointer-events-none absolute left-[28.5%] top-[31%] hidden items-center lg:flex" aria-hidden="true">
                <span className="h-px w-14 bg-[#E0C068]" />
                <span className="-ml-1 h-2.5 w-2.5 rotate-45 border-r border-t border-[#E0C068]" />
              </span>
              <span data-flow-arrow className="pointer-events-none absolute left-[63%] top-[49%] hidden items-center lg:flex" aria-hidden="true">
                <span className="h-px w-14 bg-[#E0C068]" />
                <span className="-ml-1 h-2.5 w-2.5 rotate-45 border-r border-t border-[#E0C068]" />
              </span>
            </div>
          </div>
        </section>

        {/* 04 — Brand Signature / emotional peak */}
        <section className="relative -mt-28 flex min-h-[calc(78svh+112px)] items-center overflow-hidden bg-e26-black px-6 pb-28 pt-56 text-e26-ivory md:-mt-44 md:min-h-[calc(92svh+176px)] md:px-10 md:pb-40 md:pt-[336px]">
          <Image src="/images/home/home-scene-04-selected.webp" alt="" fill sizes="100vw" className="object-cover object-[72%_center] md:object-center" aria-hidden="true" />
          <div
            className="pointer-events-none absolute inset-0 [--veil-color:rgba(26,23,20,0.28)] [--veil-filter:none] md:[--veil-color:rgba(26,26,26,0.18)] md:[--veil-filter:saturate(0.05)]"
            style={{
              background: "var(--veil-color)",
              backdropFilter: "var(--veil-filter)",
              WebkitBackdropFilter: "var(--veil-filter)",
              maskImage: "radial-gradient(ellipse 34% 54% at 70% 38%, transparent 0%, rgba(0,0,0,0.08) 30%, rgba(0,0,0,0.62) 66%, black 100%)",
              WebkitMaskImage: "radial-gradient(ellipse 34% 54% at 70% 38%, transparent 0%, rgba(0,0,0,0.08) 30%, rgba(0,0,0,0.62) 66%, black 100%)",
            }}
            aria-hidden="true"
          />
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(90deg, color-mix(in srgb, var(--essence-black-2026) 48%, transparent) 0%, color-mix(in srgb, var(--essence-black-2026) 32%, transparent) 48%, color-mix(in srgb, var(--essence-black-2026) 12%, transparent) 76%, color-mix(in srgb, var(--essence-black-2026) 24%, transparent) 100%), linear-gradient(to bottom, color-mix(in srgb, var(--essence-black-2026) 24%, transparent) 0%, color-mix(in srgb, var(--essence-black-2026) 38%, transparent) 48%, color-mix(in srgb, var(--essence-black-2026) 44%, transparent) 64%, color-mix(in srgb, var(--essence-black-2026) 58%, transparent) 100%)" }}
            aria-hidden="true"
          />
          <div className="e26-reveal relative z-10 mx-auto w-full max-w-7xl">
            <p className="mx-auto max-w-[1180px] text-center font-serif text-[52px] font-normal leading-[0.98] tracking-[-0.026em] md:text-[88px] lg:text-[110px]">
              Câu chuyện cuộc sống của bạn là một{" "}
              <span className="relative inline-block whitespace-nowrap">
                kiệt tác
                <i aria-hidden="true" className="gold-brush-line e26-reveal" />
              </span>.
            </p>
          </div>
        </section>

        {/* 05 — bright editorial plane / two rectangular pathways */}
        <section className="relative isolate z-30 -mt-16 overflow-hidden bg-e26-ivory px-6 pb-14 pt-20 md:-mt-24 md:px-10 md:pb-20 md:pt-28 xl:-mt-28 xl:pb-16 xl:pt-32">
          {/* Clean white/ivory base plane — no ambient architecture image. */}
          <div
            className="pointer-events-none absolute inset-0 z-0"
            style={{
              background:
                "linear-gradient(to bottom, var(--essence-white-2026) 0%, color-mix(in srgb, var(--essence-white-2026) 62%, var(--essence-ivory-2026)) 38%, var(--essence-ivory-2026) 100%)",
            }}
            aria-hidden="true"
          />

          <div className="relative z-10 mx-auto max-w-[1720px]">
            <div className="grid gap-16 md:gap-24 xl:relative xl:block xl:min-h-[790px]">
              <Link
                href="/coaching"
                aria-label="Đi tới ESSENCE Coaching"
                className="group e26-reveal relative block pt-[74px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-e26-gold focus-visible:ring-offset-8 focus-visible:ring-offset-e26-ivory md:pt-[96px] xl:absolute xl:inset-y-0 xl:left-0 xl:w-[58%] xl:pt-[102px]"
              >
                <p className="absolute left-0 top-0 z-30 font-serif text-[61px] font-normal leading-none tracking-[-0.038em] md:text-[82px] xl:text-[94px]" aria-hidden="true">ESSENCE</p>
                <div className={`relative ml-[3%] aspect-[4/5] w-[97%] overflow-hidden shadow-[0_68px_104px_-58px_rgba(26,26,26,0.44),0_30px_50px_-30px_rgba(26,26,26,0.24),0_4px_10px_-4px_rgba(26,26,26,0.16)] transition-transform group-hover:-translate-y-1 md:ml-[8%] md:aspect-[4/3] md:w-[89%] xl:ml-[4%] xl:h-[680px] xl:w-[96%] xl:aspect-auto ${thresholdMotion}`}>
                  <Image
                    src="/images/home/home-scene-05-coaching.webp"
                    alt=""
                    fill
                    sizes="(max-width: 767px) 94vw, (max-width: 1279px) 82vw, 56vw"
                    className={`object-cover object-[46%_center] transition-transform group-hover:scale-[1.014] ${thresholdMotion}`}
                    aria-hidden="true"
                  />
                  <div className="absolute inset-0 z-10 flex flex-col px-6 pb-8 pt-5 md:px-10 md:pb-10 md:pt-7 xl:px-12 xl:pb-12 xl:pt-8">
                    <div className="relative w-fit">
                      <div
                        className="pointer-events-none absolute -left-24 -right-24 -top-24 bottom-[-16px] [--tf:24px] md:bottom-[-30px] md:[--tf:46px] opacity-[0.94] md:opacity-[0.88] xl:opacity-100"
                        style={{
                          background:
                            "linear-gradient(90deg, transparent 0%, color-mix(in srgb, var(--essence-ivory-2026) 52%, transparent) 15%, color-mix(in srgb, var(--essence-ivory-2026) 52%, transparent) 85%, transparent 100%)",
                          maskImage: "linear-gradient(to bottom, #000 0px, #000 calc(100% - var(--tf)), transparent 100%)",
                          WebkitMaskImage: "linear-gradient(to bottom, #000 0px, #000 calc(100% - var(--tf)), transparent 100%)",
                        }}
                        aria-hidden="true"
                      />
                      <h2 className="relative z-10 font-serif text-[60px] font-normal leading-[0.9] tracking-[-0.038em] md:text-[78px] xl:text-[90px]">Coaching</h2>
                    </div>
                    <div className="relative mt-auto mb-[9%] max-w-[350px] md:mb-[7%] xl:mb-[5%] xl:max-w-[390px]">
                      {/* Local readability scrim — confined to the copy band, feathered top and bottom. */}
                      <div
                        className="pointer-events-none absolute -bottom-7 -left-16 -top-6 right-[-30%] [--fb:26px] [--ft:22px] md:-bottom-14 md:-top-12 md:[--fb:54px] md:[--ft:46px] opacity-[0.94] md:opacity-[0.88] xl:opacity-100"
                        style={{
                          background:
                            "linear-gradient(90deg, color-mix(in srgb, var(--essence-ivory-2026) 74%, transparent) 0%, color-mix(in srgb, var(--essence-ivory-2026) 72%, transparent) 80%, color-mix(in srgb, var(--essence-ivory-2026) 42%, transparent) 90%, transparent 100%)",
                          maskImage: "linear-gradient(to bottom, transparent 0px, #000 var(--ft), #000 calc(100% - var(--fb)), transparent 100%)",
                          WebkitMaskImage: "linear-gradient(to bottom, transparent 0px, #000 var(--ft), #000 calc(100% - var(--fb)), transparent 100%)",
                        }}
                        aria-hidden="true"
                      />
                      <span className="relative mb-6 flex items-center" aria-hidden="true"><i className="h-1.5 w-1.5 rotate-45 bg-[#C9A441]" /><i className="h-px w-24 bg-[#C9A441]/75" /></span>
                      <p data-body-copy className="relative font-serif text-[22px] leading-[1.58] tracking-[-0.014em] md:text-[25px] xl:text-[27px]">Khi điều cần nhìn rõ nằm trong đời sống của bạn.</p>
                      <span className="relative my-6 block h-px w-24 bg-[#C9A441]/70" aria-hidden="true" />
                      <p className="relative font-serif text-[22px] leading-[1.54] tracking-[-0.014em] md:text-[25px] xl:text-[27px]">Một điều đã đến lúc phải <span className="whitespace-nowrap">khác đi.<span className={`ml-3 inline-block origin-left scale-x-[1.55] text-[25px] leading-none tracking-normal text-[#B58B24] transition-transform group-hover:translate-x-1.5 ${thresholdMotion}`} aria-hidden="true">⟶</span></span></p>
                    </div>
                  </div>
                </div>
              </Link>

              <Link
                href="/advisory"
                aria-label="Đi tới ESSENCE Advisory"
                className="group e26-reveal relative block pt-[74px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-e26-gold focus-visible:ring-offset-8 focus-visible:ring-offset-e26-ivory md:ml-auto md:w-[92%] md:pt-[92px] xl:absolute xl:right-0 xl:top-[68px] xl:h-[680px] xl:w-[39.5%] xl:pt-[96px]"
              >
                <p className="absolute right-0 top-0 z-30 font-serif text-[61px] font-normal leading-none tracking-[-0.038em] md:text-[80px] xl:left-[4%] xl:right-auto xl:text-[86px]" aria-hidden="true">ESSENCE</p>
                <div className={`relative ml-auto aspect-[4/5] w-[90%] overflow-hidden shadow-[0_58px_92px_-58px_rgba(26,26,26,0.40),0_26px_42px_-30px_rgba(26,26,26,0.22),0_3px_9px_-4px_rgba(26,26,26,0.15)] transition-transform group-hover:-translate-y-1 md:ml-0 md:aspect-[4/3] md:w-[86%] xl:h-[584px] xl:w-full xl:aspect-auto ${thresholdMotion}`}>
                  <Image
                    src="/images/home/home-scene-05-advisory.webp"
                    alt=""
                    fill
                    sizes="(max-width: 767px) 94vw, (max-width: 1279px) 78vw, 40vw"
                    className={`object-cover object-center transition-transform group-hover:scale-[1.014] ${thresholdMotion}`}
                    aria-hidden="true"
                  />
                  <div className="absolute inset-0 z-10 flex flex-col items-end px-6 pb-8 pt-5 md:px-10 md:pb-10 md:pt-7 xl:px-10 xl:pb-11 xl:pt-8">
                    <div className="w-[82%] md:w-[68%] xl:w-[74%]">
                      <div className="relative w-fit">
                      <div
                        className="pointer-events-none absolute -left-24 -right-24 -top-24 bottom-[-16px] [--tf:24px] md:bottom-[-30px] md:[--tf:46px] opacity-[0.94] md:opacity-[0.88] xl:opacity-100"
                        style={{
                          background:
                            "linear-gradient(90deg, transparent 0%, color-mix(in srgb, var(--essence-ivory-2026) 52%, transparent) 15%, color-mix(in srgb, var(--essence-ivory-2026) 52%, transparent) 85%, transparent 100%)",
                          maskImage: "linear-gradient(to bottom, #000 0px, #000 calc(100% - var(--tf)), transparent 100%)",
                          WebkitMaskImage: "linear-gradient(to bottom, #000 0px, #000 calc(100% - var(--tf)), transparent 100%)",
                        }}
                        aria-hidden="true"
                      />
                      <h2 className="relative z-10 text-left font-serif text-[58px] font-normal leading-[0.9] tracking-[-0.038em] md:text-[74px] xl:text-[78px]">Advisory</h2>
                      </div>
                    </div>
                    <div className="relative mt-auto mb-[9%] w-[82%] max-w-[360px] md:mb-[7%] md:w-[68%] xl:mb-[5%] xl:w-[74%]">
                      {/* Local readability scrim — confined to the copy band, feathered top and bottom. */}
                      <div
                        className="pointer-events-none absolute -bottom-7 -right-16 -top-6 left-[-30%] [--fb:26px] [--ft:22px] md:-bottom-14 md:-top-12 md:[--fb:54px] md:[--ft:46px] opacity-[0.94] md:opacity-[0.88] xl:opacity-100"
                        style={{
                          background:
                            "linear-gradient(270deg, color-mix(in srgb, var(--essence-ivory-2026) 74%, transparent) 0%, color-mix(in srgb, var(--essence-ivory-2026) 72%, transparent) 80%, color-mix(in srgb, var(--essence-ivory-2026) 42%, transparent) 90%, transparent 100%)",
                          maskImage: "linear-gradient(to bottom, transparent 0px, #000 var(--ft), #000 calc(100% - var(--fb)), transparent 100%)",
                          WebkitMaskImage: "linear-gradient(to bottom, transparent 0px, #000 var(--ft), #000 calc(100% - var(--fb)), transparent 100%)",
                        }}
                        aria-hidden="true"
                      />
                      <span className="relative mb-6 flex items-center" aria-hidden="true"><i className="h-1.5 w-1.5 rotate-45 bg-[#C9A441]" /><i className="h-px w-24 bg-[#C9A441]/75" /></span>
                      <p data-body-copy className="relative font-serif text-[22px] leading-[1.56] tracking-[-0.014em] md:text-[24px] xl:text-[25px]">Khi điều cần được làm rõ nằm trong công việc hoặc doanh nghiệp.</p>
                      <span className="relative my-6 block h-px w-24 bg-[#C9A441]/70" aria-hidden="true" />
                      <p className="relative font-serif text-[22px] leading-[1.52] tracking-[-0.014em] md:text-[24px] xl:text-[25px]">Một điều cần được đưa vào <span className="whitespace-nowrap">vận hành.<span className={`ml-3 inline-block origin-left scale-x-[1.55] text-[25px] leading-none tracking-normal text-[#B58B24] transition-transform group-hover:translate-x-1.5 ${thresholdMotion}`} aria-hidden="true">⟶</span></span></p>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* 06 — Founder / origin + question */}
        <section className="relative overflow-hidden bg-e26-white px-6 py-28 md:px-10 md:py-48">
          <Image src="/images/home/kenji-section-light-wall.webp" alt="" fill sizes="100vw" className="object-cover object-left opacity-60" aria-hidden="true" />
          <div className="absolute inset-0" style={{ background: "linear-gradient(90deg, color-mix(in srgb, var(--essence-cream-2026) 52%, transparent), color-mix(in srgb, var(--essence-cream-2026) 82%, transparent) 56%, color-mix(in srgb, var(--essence-ivory-2026) 97%, transparent))" }} aria-hidden="true" />

          <div className="relative z-10 mx-auto grid max-w-7xl items-start gap-14 md:grid-cols-12 md:gap-8">
            <div className="e26-reveal relative -ml-6 aspect-[4/5] w-[calc(100%+1.5rem)] max-w-[430px] overflow-hidden bg-e26-cream-deep md:col-span-4 md:-ml-10 md:mt-16 md:w-[calc(100%+2.5rem)]">
              <Image src="/images/home/kenji-portrait.webp" alt="Kenji Phạm — Founder, ESSENCE" fill sizes="(max-width: 768px) 100vw, 34vw" className={`object-cover transition-transform hover:scale-[1.01] ${thresholdMotion}`} />
            </div>

            <div className="e26-reveal md:col-span-8 md:col-start-5 md:pt-8">
              <p data-body-copy className="max-w-[590px] font-sans text-[17px] leading-[1.78] md:text-[18px]">
                Trước ESSENCE, tôi làm nhiều việc với nhân hiệu, hình ảnh và cách một người xuất hiện.
              </p>

              <p className="mt-10 max-w-[720px] font-serif text-[34px] font-medium leading-[1.16] tracking-[-0.016em] md:text-[48px]">
                Hình ảnh có thể được xây nhanh hơn điều thật sự đứng phía sau nó.
              </p>

              <div className="relative mt-16 border-t border-[#E0C068]/62 pt-10 md:mt-24 md:pt-14">
                <p className="mb-7 font-sans text-[12px] font-medium uppercase tracking-[0.13em] text-e26-text-2">Từ đó, một câu hỏi ở lại với tôi:</p>
                <p className="max-w-[900px] font-serif text-[48px] font-medium leading-[1.02] tracking-[-0.024em] md:text-[76px] lg:text-[88px]">“Điều gì ở đây thật sự đáng để được xây?”</p>
              </div>

              <div className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-4">
                <div className="border-l border-[#E0C068]/72 pl-4">
                  <p data-founder-attribution className="font-serif text-[21px] leading-[1.4] text-e26-text">Kenji Phạm <span className="font-sans text-[12px] uppercase tracking-[0.13em] text-e26-text">— Founder, ESSENCE</span></p>
                </div>
                <Link className={softLink} href="/ve-kenji">Về Kenji <span className="text-[#E0C068]" aria-hidden="true">→</span></Link>
              </div>
            </div>
          </div>
        </section>

        {/* 07 — first threshold into ESSENCE */}
        <section className="relative overflow-hidden bg-e26-ivory px-6 py-28 md:px-10 md:py-48">
          <Image src="/images/home/ghi-chep-essence-v4.webp" alt="" fill sizes="100vw" className="object-cover object-center opacity-[0.12]" aria-hidden="true" />
          <div className="absolute inset-0 bg-[color-mix(in_srgb,var(--essence-ivory-2026)_86%,transparent)]" aria-hidden="true" />
          <div className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(circle at 18% 18%, color-mix(in srgb, var(--essence-white-2026) 64%, transparent), transparent 34%), linear-gradient(110deg, transparent 60%, color-mix(in srgb, var(--essence-cream-2026) 34%, transparent))" }} aria-hidden="true" />

          <div className="relative mx-auto max-w-7xl">
            <NotesTeaser />
          </div>
        </section>
      </main>

      <HomeFooter homeIa />
    </>
  );
}
