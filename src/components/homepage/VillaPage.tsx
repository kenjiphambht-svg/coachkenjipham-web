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
        <section className="relative overflow-hidden bg-e26-white px-6 py-32 md:px-10 md:py-56">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#E0C068]/18 to-transparent" aria-hidden="true" />

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
                  <span className="block text-[42px] font-normal italic leading-[1.02] tracking-[-0.02em] md:text-[68px]">Bản sắc</span>
                  <span className="-my-1 block text-[52px] font-medium uppercase leading-[0.9] tracking-[-0.04em] md:-my-2 md:text-[96px] lg:text-[108px]">không phải</span>
                  <span className="block text-[42px] font-normal italic leading-[1.02] tracking-[-0.02em] md:text-[66px]">một chiếc nhãn.</span>
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
        <section className="relative overflow-hidden bg-[color-mix(in_srgb,var(--essence-white-2026)_42%,var(--essence-ivory-2026))] px-6 py-28 md:px-10 md:py-48">
          <div className="pointer-events-none absolute -left-[16%] top-[7%] h-[42%] w-[48%] rounded-full bg-[color-mix(in_srgb,var(--essence-white-2026)_72%,transparent)] blur-3xl" aria-hidden="true" />
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#E0C068]/28 to-transparent" aria-hidden="true" />

          <div className="relative mx-auto max-w-7xl">
            <div className="grid gap-12 md:grid-cols-12 md:gap-8">
              <h2 className="e26-reveal max-w-[900px] font-serif text-[48px] font-medium leading-[0.98] tracking-[-0.026em] md:col-span-8 md:text-[80px] lg:text-[94px]">
                Trí tuệ không phải<br className="hidden md:block" /> biết nhiều hơn.
              </h2>

              <div data-body-copy className="e26-reveal max-w-[420px] font-sans text-[17px] leading-[1.76] md:col-span-4 md:mt-20 md:text-[18px]">
                <p>Có lúc bạn đã hiểu đủ.</p>
                <p className="mt-4">Điều còn thiếu là nhìn đủ rõ để biết:</p>
                <p className="mt-7 font-medium">điều gì đáng giữ,<br />điều gì đã hết vai trò,<br />và điều gì bạn thực sự chọn.</p>
              </div>
            </div>

            <div className="e26-reveal relative mt-20 border-y border-[color-mix(in_srgb,var(--essence-black-2026)_12%,transparent)] py-10 md:mt-28 md:min-h-[260px] md:py-14">
              <span className="absolute left-0 top-0 h-px w-[24%] bg-[#E0C068]/76" aria-hidden="true" />
              <p aria-label="NHẬN RA → LỰA CHỌN → HIỆN THỰC" className="relative grid gap-8 md:grid-cols-[0.86fr_1fr_1.14fr] md:gap-8">
                <span data-home-flow-anchor aria-hidden="true" className="whitespace-nowrap font-serif text-[36px] font-medium leading-none tracking-[-0.02em] md:text-[52px]">NHẬN RA</span>
                <span data-home-flow-anchor aria-hidden="true" className="whitespace-nowrap font-serif text-[42px] font-medium leading-none tracking-[-0.022em] md:translate-y-10 md:text-[58px]">LỰA CHỌN</span>
                <span data-home-flow-anchor aria-hidden="true" className="whitespace-nowrap font-serif text-[48px] font-medium leading-none tracking-[-0.026em] md:translate-y-20 md:text-[64px]">HIỆN THỰC</span>
              </p>
              <span data-flow-arrow className="pointer-events-none absolute left-[28.5%] top-[31%] hidden items-center md:flex" aria-hidden="true">
                <span className="h-px w-14 bg-[#E0C068]" />
                <span className="-ml-1 h-2.5 w-2.5 rotate-45 border-r border-t border-[#E0C068]" />
              </span>
              <span data-flow-arrow className="pointer-events-none absolute left-[63%] top-[49%] hidden items-center md:flex" aria-hidden="true">
                <span className="h-px w-14 bg-[#E0C068]" />
                <span className="-ml-1 h-2.5 w-2.5 rotate-45 border-r border-t border-[#E0C068]" />
              </span>
            </div>
          </div>
        </section>

        {/* 04 — Brand Signature / emotional peak */}
        <section className="relative flex min-h-[78svh] items-center overflow-hidden bg-e26-black px-6 py-28 text-e26-ivory md:min-h-[92svh] md:px-10 md:py-40">
          <Image src="/images/home/kiettac-villa-toi.webp" alt="" fill sizes="100vw" className="object-cover object-center opacity-55" aria-hidden="true" />
          <div className="absolute inset-0 bg-[color-mix(in_srgb,var(--essence-black-2026)_76%,transparent)]" aria-hidden="true" />
          <div className="e26-reveal relative z-10 mx-auto w-full max-w-7xl">
            <p className="mx-auto max-w-[1180px] text-center font-serif text-[52px] font-normal leading-[0.98] tracking-[-0.026em] md:text-[88px] lg:text-[110px]">
              Câu chuyện cuộc sống của bạn là một kiệt tác.
            </p>
          </div>
        </section>

        {/* 05 — creation / two contexts */}
        <section className="relative overflow-hidden px-6 py-28 md:px-10 md:py-48">
          <Image src="/images/home/two-paths-light-room.webp" alt="" fill sizes="100vw" className="object-cover object-center opacity-[0.12]" aria-hidden="true" />
          <div className="absolute inset-0 bg-[color-mix(in_srgb,var(--essence-ivory-2026)_93%,transparent)]" aria-hidden="true" />
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#E0C068]/28 to-transparent" aria-hidden="true" />

          <div className="relative z-10 mx-auto max-w-7xl">
            <div className="relative md:grid md:min-h-[690px] md:grid-cols-12 md:gap-8">
              <Link
                href="/coaching"
                aria-label="Đi tới ESSENCE Coaching"
                className="group e26-reveal relative min-h-[500px] overflow-hidden bg-[color-mix(in_srgb,var(--essence-white-2026)_52%,transparent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-e26-gold focus-visible:ring-offset-4 focus-visible:ring-offset-e26-ivory md:col-span-7 md:min-h-[650px]"
              >
                <Image src="/images/home/kitchen-morning.webp" alt="" fill sizes="(max-width: 768px) 100vw, 58vw" className={`object-cover object-center opacity-48 transition-transform group-hover:scale-[1.012] ${thresholdMotion}`} aria-hidden="true" />
                <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, color-mix(in srgb, var(--essence-ivory-2026) 18%, transparent), color-mix(in srgb, var(--essence-ivory-2026) 84%, transparent) 66%, var(--essence-ivory-2026) 100%)" }} aria-hidden="true" />
                <div className="relative z-10 flex min-h-[500px] flex-col justify-end px-7 py-10 md:min-h-[650px] md:px-12 md:py-14">
                  <h2 className="font-serif text-[46px] font-medium leading-[0.98] tracking-[-0.022em] md:text-[70px]">ESSENCE<br />Coaching</h2>
                  <p data-body-copy className="mt-8 max-w-[470px] font-sans text-[17px] leading-[1.72] md:text-[18px]">Khi điều cần nhìn rõ nằm trong đời sống của bạn.</p>
                  <p className="mt-5 max-w-[430px] font-serif text-[27px] leading-[1.18] tracking-[-0.012em] md:text-[34px]">Một điều đã đến lúc phải khác đi.</p>
                  <span className={`${softLink} mt-9 w-fit`}>ESSENCE Coaching <span className={`text-[#E0C068] transition-transform group-hover:translate-x-1 ${thresholdMotion}`} aria-hidden="true">→</span></span>
                </div>
              </Link>

              <Link
                href="/advisory"
                aria-label="Đi tới ESSENCE Advisory"
                className="group e26-reveal relative mt-10 min-h-[430px] overflow-hidden border-l border-[#E0C068]/42 bg-[color-mix(in_srgb,var(--essence-white-2026)_38%,transparent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-e26-gold focus-visible:ring-offset-4 focus-visible:ring-offset-e26-ivory md:col-span-5 md:col-start-8 md:mt-28 md:min-h-[500px]"
              >
                <Image src="/images/advisory/advisory-essence-operating-loop-selected-v03.webp" alt="" fill sizes="(max-width: 768px) 100vw, 42vw" className={`object-contain object-[78%_20%] p-10 opacity-[0.065] transition-transform group-hover:translate-x-1 md:p-14 ${thresholdMotion}`} aria-hidden="true" />
                <div className="absolute inset-0" style={{ background: "linear-gradient(160deg, color-mix(in srgb, var(--essence-white-2026) 66%, transparent), transparent 56%), repeating-linear-gradient(0deg, transparent 0 58px, color-mix(in srgb, var(--essence-black-2026) 3%, transparent) 59px 60px)" }} aria-hidden="true" />
                <div className="relative z-10 flex min-h-[430px] flex-col justify-end px-7 py-10 md:min-h-[500px] md:px-10 md:py-14">
                  <h2 className="font-serif text-[42px] font-medium leading-[0.98] tracking-[-0.022em] md:text-[58px]">ESSENCE<br />Advisory</h2>
                  <p data-body-copy className="mt-8 max-w-[430px] font-sans text-[17px] leading-[1.72] md:text-[18px]">Khi điều cần được làm rõ nằm trong công việc hoặc doanh nghiệp.</p>
                  <p className="mt-5 max-w-[390px] font-serif text-[27px] leading-[1.18] tracking-[-0.012em] md:text-[32px]">Một điều cần được đưa vào vận hành.</p>
                  <span className={`${softLink} mt-9 w-fit`}>ESSENCE Advisory <span className="text-[#E0C068]" aria-hidden="true">→</span></span>
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
