import Image from "next/image";
import Link from "next/link";

const thresholdMotion = "duration-[420ms] ease-out motion-reduce:transition-none motion-reduce:duration-0";

export default function NotesTeaser() {
  return (
    <div id="goc-doc" className="relative scroll-mt-28">
      <h2 data-start-headline className="e26-reveal max-w-[1080px] font-serif text-[46px] font-medium leading-[1.02] tracking-[-0.024em] text-e26-text md:max-w-none md:whitespace-nowrap md:text-[62px] lg:text-[68px]">
        Bạn không cần biết hết để bắt đầu.
      </h2>

      <div className="e26-reveal relative mt-20 border-y border-[color-mix(in_srgb,var(--essence-black-2026)_12%,transparent)] py-10 md:mt-24 md:min-h-[340px] md:py-12">
        <span className="absolute left-0 top-0 h-px w-[26%] bg-[#E0C068]/76" aria-hidden="true" />
        <Link
          href="/khoi-dau"
          aria-label="Đi tới Khởi đầu"
          className={`group relative block min-h-[200px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-e26-gold focus-visible:ring-offset-4 focus-visible:ring-offset-e26-ivory md:min-h-[230px] ${thresholdMotion}`}
        >
          <div className={`pointer-events-none absolute inset-y-0 left-0 w-[8%] origin-left bg-gradient-to-r from-[color-mix(in_srgb,var(--essence-white-2026)_82%,transparent)] to-transparent transition-[width] group-hover:w-full ${thresholdMotion}`} aria-hidden="true" />
          <div className="relative flex min-h-[200px] items-end justify-between gap-8 py-8 md:min-h-[230px] md:items-center md:py-9">
            <p className="font-serif text-[58px] font-medium leading-[0.94] tracking-[-0.03em] text-e26-text md:text-[92px] lg:text-[104px]">Khởi đầu</p>
            <span data-threshold-arrow className={`mb-2 inline-flex shrink-0 items-center transition-transform group-hover:translate-x-2 md:mb-0 ${thresholdMotion}`} aria-hidden="true">
              <span className="h-px w-16 bg-[#E0C068] md:w-24" />
              <span className="-ml-1 h-3 w-3 rotate-45 border-r border-t border-[#E0C068]" />
            </span>
          </div>
        </Link>
      </div>

      <div className="e26-reveal mt-16 grid gap-14 md:mt-24 md:grid-cols-12 md:items-end md:gap-8">
        <article className="relative md:col-span-5">
          <div className="absolute left-4 top-4 h-full w-full border border-[color-mix(in_srgb,var(--essence-black-2026)_10%,transparent)] bg-[color-mix(in_srgb,var(--essence-white-2026)_72%,var(--essence-ivory-2026))]" aria-hidden="true" />
          <div className="relative min-h-[270px] overflow-hidden bg-e26-cream md:min-h-[330px]">
            <Image
              src="/images/home/ghi-chep-essence-v4.webp"
              alt=""
              fill
              sizes="(max-width: 768px) 100vw, 42vw"
              className="object-cover object-center opacity-72 saturate-[0.72]"
              aria-hidden="true"
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,color-mix(in_srgb,var(--essence-ivory-2026)_20%,transparent),color-mix(in_srgb,var(--essence-ivory-2026)_82%,transparent)_78%)]" aria-hidden="true" />
            <div className="absolute bottom-0 left-0 w-[78%] bg-e26-ivory px-6 py-5 md:w-[68%] md:px-7 md:py-6">
              <p className="font-serif text-[34px] font-medium leading-none tracking-[-0.018em] text-e26-text md:text-[42px]">Góc đọc</p>
            </div>
          </div>
        </article>

        <article className="relative md:col-span-4 md:col-start-9 md:-translate-y-5">
          <div className="absolute -left-4 -top-4 h-full w-full bg-[color-mix(in_srgb,var(--essence-cream-2026)_78%,var(--essence-white-2026))]" aria-hidden="true" />
          <div className="absolute -right-3 top-5 h-[88%] w-[88%] border border-[#E0C068]/28" aria-hidden="true" />
          <div className="relative min-h-[300px] overflow-hidden bg-e26-white md:min-h-[360px]">
            <Image
              src="/images/home/ban-sac-cua-ban-quiet-pause.webp"
              alt=""
              fill
              sizes="(max-width: 768px) 100vw, 34vw"
              className="object-cover object-center opacity-62 saturate-[0.66]"
              aria-hidden="true"
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,color-mix(in_srgb,var(--essence-white-2026)_12%,transparent),color-mix(in_srgb,var(--essence-ivory-2026)_90%,transparent)_72%)]" aria-hidden="true" />
            <div className="absolute inset-x-0 bottom-0 px-6 pb-7 pt-12 md:px-8 md:pb-8">
              <p className="font-sans text-[12px] font-medium uppercase tracking-[0.16em] text-e26-text-2">Ebook</p>
              <p className="mt-2 max-w-[330px] font-serif text-[31px] font-medium leading-[1.02] tracking-[-0.018em] text-e26-text md:text-[38px]">Bản Sắc Nhân Hiệu</p>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}
