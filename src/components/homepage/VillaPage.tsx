import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
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
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/favicon-192.png" />
        <link rel="icon" type="image/png" sizes="512x512" href="/favicon-512.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon-180.png" />
      </Head>

      <GrainOverlay />
      <HomeHeader homeIa />

      <main className="bg-e26-ivory text-e26-text">
        {/* 01 — quiet / recognition */}
        <section className="relative isolate min-h-[90svh] overflow-hidden px-6 pb-24 pt-28 md:flex md:min-h-[94svh] md:items-center md:px-10 md:pb-32 md:pt-32">
          <div className="absolute inset-0 -z-20 md:hidden">
            <Image src="/images/home/window-first-light-mobile.webp" alt="" fill priority sizes="100vw" className="object-cover object-center" />
          </div>
          <div className="absolute inset-0 -z-20 hidden md:block">
            <Image src="/images/home/window-first-light.webp" alt="" fill priority sizes="100vw" className="object-cover object-center" />
          </div>
          <div
            className="absolute inset-0 -z-10"
            style={{
              background:
                "linear-gradient(90deg, color-mix(in srgb, var(--essence-ivory-2026) 94%, transparent) 0%, color-mix(in srgb, var(--essence-ivory-2026) 88%, transparent) 42%, color-mix(in srgb, var(--essence-ivory-2026) 56%, transparent) 72%, color-mix(in srgb, var(--essence-ivory-2026) 28%, transparent) 100%)",
            }}
            aria-hidden="true"
          />
          <div className="absolute inset-0 -z-10 bg-[color-mix(in_srgb,var(--essence-ivory-2026)_26%,transparent)] md:hidden" aria-hidden="true" />

          <div className="mx-auto w-full max-w-6xl">
            <div className="e26-reveal max-w-[720px] md:translate-y-2">
              <h1 className="max-w-[700px] font-serif text-[46px] font-medium leading-[1.03] tracking-[-0.02em] md:text-[70px] lg:text-[80px]">Có những điều bạn đã biết từ lâu.</h1>
              <div data-body-copy className="mt-10 max-w-[560px] space-y-3 font-sans text-[17px] font-normal leading-[1.78] md:mt-12 md:text-[19px]">
                <p>Một cuộc nói chuyện cần diễn ra.</p>
                <p>Một việc cần dừng.</p>
                <p>Một quyết định không thể để lâu hơn.</p>
              </div>
              <p className="mt-11 max-w-[610px] font-serif text-[29px] font-normal leading-[1.32] tracking-[-0.012em] md:mt-14 md:text-[37px]">Nhưng <em>biết</em> chưa luôn có nghĩa là <em>sống khác đi</em>.</p>
              <div className="mt-10 flex items-center gap-4">
                <span className="h-px w-10 bg-[#E0C068]" aria-hidden="true" />
                <p className="font-sans text-[15px] font-medium leading-[1.7]">ESSENCE bắt đầu ở khoảng đó.</p>
              </div>
            </div>
          </div>
        </section>

        {/* 02 — clarity / reframe */}
        <section className="relative overflow-hidden bg-e26-white px-6 py-20 md:px-10 md:py-24">
          <div
            className="pointer-events-none absolute inset-y-0 right-0 hidden w-[38%] md:block"
            style={{ background: "linear-gradient(112deg, transparent, color-mix(in srgb, var(--essence-cream-2026) 46%, transparent))" }}
            aria-hidden="true"
          />
          <div className="relative mx-auto grid max-w-6xl gap-12 md:grid-cols-[0.78fr_1.22fr] md:gap-24">
            <h2 className="e26-reveal max-w-[430px] font-serif text-[36px] font-medium leading-[1.12] tracking-[-0.016em] md:text-[50px]">ESSENCE không nói bạn nên làm gì.</h2>
            <div data-body-copy className="e26-reveal max-w-[620px] space-y-7 font-sans text-[17px] font-normal leading-[1.82] md:mt-14 md:border-l md:border-[color-mix(in_srgb,var(--essence-black-2026)_10%,transparent)] md:pl-12 md:text-[18px]">
              <p className="max-w-[590px] font-serif text-[31px] font-medium leading-[1.28] tracking-[-0.014em] md:text-[38px]">Bản sắc không phải một câu trả lời cuối cùng về bạn.</p>
              <p>Đó là phần bạn ngày càng nhận ra trung thực hơn qua những gì đã sống — cả điều dễ đón nhận lẫn điều từng né tránh.</p>
              <p className="max-w-[560px] font-serif text-[29px] font-medium leading-[1.34] tracking-[-0.012em] md:text-[34px]">Không phải để định nghĩa bạn. <br className="hidden md:block" />Để bạn có thêm quyền chọn.</p>
            </div>
          </div>
        </section>

        {/* 03 — build / Core Principle signature composition */}
        <section className="relative overflow-hidden bg-[color-mix(in_srgb,var(--essence-white-2026)_42%,var(--essence-ivory-2026))] px-6 py-28 md:px-10 md:py-48">
          <div className="pointer-events-none absolute -left-[14%] top-[8%] h-[48%] w-[50%] rounded-full bg-[color-mix(in_srgb,var(--essence-white-2026)_62%,transparent)] blur-3xl" aria-hidden="true" />
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#E0C068]/25 to-transparent" aria-hidden="true" />

          <div className="relative mx-auto max-w-6xl">
            <h2 className="e26-reveal max-w-[980px] font-serif text-[44px] font-medium leading-[1.01] tracking-[-0.022em] md:text-[72px] lg:text-[82px]">TỪ BẢN SẮC ĐẾN HIỆN THỰC.</h2>

            <div className="e26-reveal relative mt-16 border-y border-[color-mix(in_srgb,var(--essence-black-2026)_13%,transparent)] py-10 md:mt-24 md:min-h-[260px] md:py-14">
              <span className="absolute left-0 top-0 h-px w-[22%] bg-[#E0C068]/70" aria-hidden="true" />
              <span className="pointer-events-none absolute left-0 right-0 top-1/2 hidden h-px bg-gradient-to-r from-[#E0C068]/45 via-[#E0C068]/22 to-transparent md:block" aria-hidden="true" />

              <p aria-label="NHẬN RA → LỰA CHỌN → HIỆN THỰC" className="relative grid gap-8 md:grid-cols-3 md:gap-12">
                <span aria-hidden="true" className="font-serif text-[38px] font-medium leading-none tracking-[-0.018em] md:self-start md:text-[50px]">NHẬN RA</span>
                <span aria-hidden="true" className="font-serif text-[46px] font-medium leading-none tracking-[-0.02em] md:translate-y-10 md:text-[60px]">LỰA CHỌN</span>
                <span aria-hidden="true" className="font-serif text-[56px] font-medium leading-none tracking-[-0.024em] md:translate-y-20 md:text-[76px]">HIỆN THỰC</span>
              </p>

              <div className="pointer-events-none absolute left-[31%] top-[30%] hidden font-sans text-[20px] text-[#E0C068] md:block" aria-hidden="true">→</div>
              <div className="pointer-events-none absolute left-[65%] top-[48%] hidden font-sans text-[20px] text-[#E0C068] md:block" aria-hidden="true">→</div>
            </div>

            <div data-body-copy className="e26-reveal mt-16 grid gap-10 font-sans text-[17px] font-normal leading-[1.82] md:mt-28 md:grid-cols-12 md:text-[18px]">
              <div className="space-y-0 md:col-span-4">
                <p className="border-t border-[color-mix(in_srgb,var(--essence-black-2026)_12%,transparent)] py-5">Một ranh giới được nói ra.</p>
              </div>
              <div className="space-y-0 md:col-span-4 md:col-start-5 md:translate-y-8">
                <p className="border-t border-[color-mix(in_srgb,var(--essence-black-2026)_12%,transparent)] py-5">Một quyết định có người thật sự đứng tên.</p>
              </div>
              <div className="space-y-0 md:col-span-4 md:col-start-9 md:translate-y-16">
                <p className="border-t border-[color-mix(in_srgb,var(--essence-black-2026)_12%,transparent)] py-5">Một cách làm mới được thử.</p>
              </div>

              <p className="md:col-span-7 md:col-start-4 md:mt-24">Với <strong className="font-medium">nhân hiệu</strong>, đó có thể là lúc cách bạn xuất hiện bắt đầu đi sau điều bạn thật sự chọn đứng về — thay vì đi trước nó.</p>
            </div>
          </div>
        </section>

        {/* 04 — pause / Brand Signature */}
        <section className="relative flex min-h-[72svh] items-center overflow-hidden bg-e26-black px-6 py-28 text-e26-ivory md:min-h-[82svh] md:px-10 md:py-40">
          <Image src="/images/home/kiettac-villa-toi.webp" alt="" fill sizes="100vw" className="object-cover object-center opacity-80" aria-hidden="true" />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, color-mix(in srgb, var(--essence-black-2026) 94%, transparent), color-mix(in srgb, var(--essence-black-2026) 74%, transparent) 45%, color-mix(in srgb, var(--essence-black-2026) 88%, transparent))" }} aria-hidden="true" />
          <div className="e26-reveal relative z-10 mx-auto max-w-6xl text-center">
            <p className="mx-auto max-w-[1020px] font-serif text-[48px] font-normal leading-[1.04] tracking-[-0.018em] md:text-[78px] lg:text-[94px]">Câu chuyện cuộc sống của bạn là một kiệt tác.</p>
          </div>
        </section>

        {/* 05 — choice / two contextual worlds */}
        <section className="relative overflow-hidden px-6 py-28 md:px-10 md:py-44">
          <Image src="/images/home/two-paths-light-room.webp" alt="" fill sizes="100vw" className="object-cover object-center opacity-[0.18]" aria-hidden="true" />
          <div className="absolute inset-0 bg-[color-mix(in_srgb,var(--essence-ivory-2026)_91%,transparent)]" aria-hidden="true" />
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#E0C068]/25 to-transparent" aria-hidden="true" />

          <div className="relative z-10 mx-auto max-w-6xl">
            <div className="relative md:grid md:min-h-[650px] md:grid-cols-12">
              <div className="pointer-events-none absolute left-[55%] top-[10%] hidden h-[76%] w-px bg-[#E0C068]/30 md:block" aria-hidden="true" />
              <div className="pointer-events-none absolute left-[48%] top-[53%] hidden h-px w-[17%] bg-[#E0C068]/52 md:block" aria-hidden="true" />

              <Link
                href="/coaching"
                aria-label="Đi tới ESSENCE Coaching"
                className="group e26-reveal relative min-h-[460px] overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-e26-gold focus-visible:ring-offset-4 focus-visible:ring-offset-e26-ivory md:col-span-7 md:min-h-[590px]"
              >
                <div className="absolute inset-0 md:right-8">
                  <Image src="/images/home/kitchen-morning.webp" alt="" fill sizes="(max-width: 768px) 100vw, 58vw" className={`object-cover object-center opacity-60 transition-transform group-hover:scale-[1.014] ${thresholdMotion}`} aria-hidden="true" />
                  <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, color-mix(in srgb, var(--essence-ivory-2026) 20%, transparent), color-mix(in srgb, var(--essence-ivory-2026) 78%, transparent) 62%, var(--essence-ivory-2026) 100%)" }} aria-hidden="true" />
                </div>
                <div className="relative z-10 flex min-h-[460px] flex-col justify-end px-6 py-9 md:min-h-[590px] md:px-10 md:py-12">
                  <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.18em] text-e26-text-2">ESSENCE COACHING</p>
                  <p className="mt-5 max-w-[480px] font-serif text-[31px] font-normal leading-[1.31] tracking-[-0.012em] md:text-[40px]">Khi điều cần nhìn rõ nằm trong <strong className="font-medium">cách bạn đang sống</strong>.</p>
                  <div data-body-copy className="mt-7 space-y-1 font-sans text-[16px] leading-[1.7] text-e26-text md:text-[17px]">
                    <p>Một lựa chọn.</p>
                    <p>Một mối quan hệ.</p>
                    <p>Một vai trò.</p>
                    <p>Một điều đã đến lúc phải khác đi.</p>
                  </div>
                  <span className={`${softLink} mt-8 w-fit`}>ESSENCE Coaching <span className={`text-[#E0C068] transition-transform group-hover:translate-x-1 ${thresholdMotion}`} aria-hidden="true">→</span><span className={`absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-[#E0C068] transition-transform group-hover:scale-x-100 ${thresholdMotion}`} aria-hidden="true" /></span>
                </div>
              </Link>

              <Link
                href="/advisory"
                aria-label="Đi tới ESSENCE Advisory"
                className="group e26-reveal relative mt-12 min-h-[390px] overflow-hidden border-t border-[#E0C068]/34 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-e26-gold focus-visible:ring-offset-4 focus-visible:ring-offset-e26-ivory md:col-span-5 md:col-start-8 md:mt-24 md:min-h-[470px] md:border-t-0 md:pl-12"
              >
                <div className="absolute inset-0" style={{ background: "linear-gradient(145deg, color-mix(in srgb, var(--essence-white-2026) 70%, transparent), transparent 62%), repeating-linear-gradient(0deg, transparent 0 52px, color-mix(in srgb, var(--essence-black-2026) 3.5%, transparent) 53px 54px)" }} aria-hidden="true" />
                <Image src="/images/advisory/advisory-essence-operating-loop-selected-v03.webp" alt="" fill sizes="(max-width: 768px) 100vw, 42vw" className={`object-contain object-[78%_18%] p-12 opacity-[0.07] transition-transform group-hover:translate-x-1 md:p-14 ${thresholdMotion}`} aria-hidden="true" />
                <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, transparent 20%, color-mix(in srgb, var(--essence-ivory-2026) 56%, transparent) 62%, var(--essence-ivory-2026) 100%)" }} aria-hidden="true" />
                <div className="relative z-10 flex min-h-[390px] flex-col justify-end px-6 py-9 md:min-h-[470px] md:px-8 md:py-12">
                  <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.18em] text-e26-text-2">ESSENCE ADVISORY</p>
                  <p className="mt-5 max-w-[430px] font-serif text-[31px] font-normal leading-[1.31] tracking-[-0.012em] md:text-[38px]">Khi điều cần nhìn rõ nằm trong <strong className="font-medium">cách doanh nghiệp đang quyết định và vận hành</strong>.</p>
                  <div data-body-copy className="mt-7 space-y-1 font-sans text-[16px] leading-[1.7] text-e26-text md:text-[17px]">
                    <p>Một bài toán quan trọng.</p>
                    <p>Một quyết định có hệ quả.</p>
                    <p>Một thay đổi cần đi vào thực tế.</p>
                  </div>
                  <span className={`${softLink} mt-8 w-fit`}>ESSENCE Advisory <span className={`text-[#E0C068] transition-transform group-hover:translate-x-1 ${thresholdMotion}`} aria-hidden="true">→</span><span className={`absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-[#E0C068] transition-transform group-hover:scale-x-100 ${thresholdMotion}`} aria-hidden="true" /></span>
                </div>
              </Link>
            </div>

            <div data-body-copy className="e26-reveal mt-16 max-w-[820px] space-y-3 font-sans text-[16px] font-normal leading-[1.78] text-e26-text-2 md:ml-auto md:mt-20 md:text-[17px]">
              <p>Ở cá nhân, Bản sắc đi vào cách bạn sống.</p>
              <p>Ở doanh nghiệp, nó đi vào điều tổ chức chọn đứng về — và cách lựa chọn ấy được thực hiện.</p>
            </div>
          </div>
        </section>

        {/* 06 — Founder / intellectual anchor */}
        <section className="relative overflow-hidden bg-e26-white px-6 py-28 md:px-10 md:py-40">
          <Image src="/images/home/kenji-section-light-wall.webp" alt="" fill sizes="100vw" className="object-cover object-left opacity-72" aria-hidden="true" />
          <div className="absolute inset-0" style={{ background: "linear-gradient(90deg, color-mix(in srgb, var(--essence-cream-2026) 58%, transparent), color-mix(in srgb, var(--essence-cream-2026) 84%, transparent) 58%, color-mix(in srgb, var(--essence-ivory-2026) 96%, transparent))" }} aria-hidden="true" />

          <div className="relative z-10 mx-auto grid max-w-6xl items-start gap-16 md:grid-cols-[0.68fr_1.32fr] md:gap-24">
            <div className="e26-reveal relative mx-auto aspect-[4/5] w-full max-w-[350px] overflow-hidden bg-e26-cream-deep md:mt-20">
              <Image src="/images/home/kenji-portrait.webp" alt="Kenji Phạm — Founder, ESSENCE" fill sizes="(max-width: 768px) 84vw, 29vw" className={`object-cover transition-transform hover:scale-[1.01] ${thresholdMotion}`} />
            </div>

            <div className="e26-reveal max-w-[760px] md:pt-12">
              <div data-body-copy className="max-w-[590px] space-y-6 font-sans text-[17px] font-normal leading-[1.82] md:text-[18px]">
                <p>Trước ESSENCE, tôi từng làm nhiều việc liên quan đến hình ảnh, định vị và cách một người xuất hiện trước công chúng.</p>
                <p>Rồi tôi nhận ra một khoảng lệch:</p>
              </div>

              <p className="mt-8 max-w-[680px] font-serif text-[34px] font-medium leading-[1.2] tracking-[-0.015em] md:text-[46px]">hình ảnh có thể được xây nhanh hơn điều thật sự đứng phía sau nó.</p>

              <div className="mt-16 border-t border-[#E0C068]/58 pt-9 md:mt-20 md:pt-12">
                <p className="mb-7 font-sans text-[12px] font-medium uppercase tracking-[0.13em] text-e26-text-2">Từ đó, một câu hỏi ở lại với tôi:</p>
                <p className="max-w-[760px] font-serif text-[44px] font-medium leading-[1.08] tracking-[-0.02em] md:text-[66px]">“Điều gì ở đây thật sự đáng để được xây?”</p>
              </div>

              <div className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-4">
                <div className="border-l border-[#E0C068]/70 pl-4">
                  <p className="font-serif text-[21px] leading-[1.4]">Kenji Phạm <span className="font-sans text-[12px] uppercase tracking-[0.13em] text-[#E0C068]">— Founder, ESSENCE</span></p>
                </div>
                <Link className={softLink} href="/ve-kenji">Về Kenji <span className="text-[#E0C068]" aria-hidden="true">→</span></Link>
              </div>
            </div>
          </div>
        </section>

        {/* 07 — open exploration */}
        <section className="relative overflow-hidden bg-e26-ivory px-6 py-28 md:px-10 md:py-48">
          <Image src="/images/home/ghi-chep-essence-v4.webp" alt="" fill sizes="100vw" className="object-cover object-center opacity-[0.18]" aria-hidden="true" />
          <div className="absolute inset-0 bg-[color-mix(in_srgb,var(--essence-ivory-2026)_80%,transparent)]" aria-hidden="true" />
          <div className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(circle at 18% 18%, color-mix(in srgb, var(--essence-white-2026) 62%, transparent), transparent 34%), linear-gradient(110deg, transparent 60%, color-mix(in srgb, var(--essence-cream-2026) 34%, transparent))" }} aria-hidden="true" />

          <div className="relative mx-auto max-w-6xl">
            <NotesTeaser />
          </div>
        </section>
      </main>

      <HomeFooter homeIa />
    </>
  );
}
