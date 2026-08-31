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

      <div className="e26-reveal mt-12 grid gap-5 md:mt-16 md:grid-cols-12 md:gap-8">
        <p data-body-copy className="font-sans text-[16px] font-medium leading-[1.7] uppercase tracking-[0.08em] text-e26-text md:col-span-3 md:text-[17px]">⟶ Góc đọc</p>
        <p data-body-copy className="font-sans text-[16px] font-medium leading-[1.7] uppercase tracking-[0.08em] text-e26-text-2 md:col-span-3 md:col-start-10 md:text-right md:text-[17px]">⟶ Ebook</p>
      </div>
    </div>
  );
}
