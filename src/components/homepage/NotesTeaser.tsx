import Link from "next/link";

const thresholdMotion = "duration-[420ms] ease-out motion-reduce:transition-none motion-reduce:duration-0";

export default function NotesTeaser() {
  return (
    <div id="goc-doc" className="relative scroll-mt-28">
      <h2 className="e26-reveal max-w-[1080px] font-serif text-[50px] font-medium leading-[0.98] tracking-[-0.026em] text-e26-text md:text-[84px] lg:text-[100px]">
        Bạn không cần biết hết<br className="hidden md:block" /> để bắt đầu.
      </h2>

      <div className="e26-reveal relative mt-20 border-y border-[color-mix(in_srgb,var(--essence-black-2026)_12%,transparent)] py-10 md:mt-28 md:min-h-[380px] md:py-14">
        <span className="absolute left-0 top-0 h-px w-[26%] bg-[#E0C068]/76" aria-hidden="true" />
        <Link
          href="/khoi-dau"
          aria-label="Đi tới Khởi đầu"
          className={`group relative block min-h-[210px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-e26-gold focus-visible:ring-offset-4 focus-visible:ring-offset-e26-ivory md:min-h-[250px] ${thresholdMotion}`}
        >
          <div className={`pointer-events-none absolute inset-y-0 left-0 w-[8%] origin-left bg-gradient-to-r from-[color-mix(in_srgb,var(--essence-white-2026)_82%,transparent)] to-transparent transition-[width] group-hover:w-full ${thresholdMotion}`} aria-hidden="true" />
          <div className="relative flex min-h-[210px] items-end justify-between gap-8 py-8 md:min-h-[250px] md:items-center md:py-10">
            <p className="font-serif text-[68px] font-medium leading-[0.9] tracking-[-0.034em] text-e26-text md:text-[118px] lg:text-[146px]">Khởi đầu</p>
            <span className={`mb-2 shrink-0 font-sans text-[28px] text-[#E0C068] transition-transform group-hover:translate-x-2 md:mb-0 md:text-[38px] ${thresholdMotion}`} aria-hidden="true">→</span>
          </div>
        </Link>
      </div>

      <div className="e26-reveal mt-12 grid gap-5 md:mt-16 md:grid-cols-12 md:gap-8">
        <p data-body-copy className="font-sans text-[16px] font-medium leading-[1.7] uppercase tracking-[0.08em] text-e26-text md:col-span-3 md:text-[17px]">→ Góc đọc</p>
        <p data-body-copy className="font-sans text-[16px] font-medium leading-[1.7] uppercase tracking-[0.08em] text-e26-text-2 md:col-span-3 md:col-start-10 md:text-right md:text-[17px]">→ Ebook</p>
      </div>
    </div>
  );
}
