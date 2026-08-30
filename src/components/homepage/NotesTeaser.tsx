import Link from "next/link";

const thresholdMotion = "duration-[420ms] ease-out motion-reduce:transition-none motion-reduce:duration-0";

export default function NotesTeaser() {
  return (
    <div id="goc-doc" className="relative scroll-mt-28">
      <div className="e26-reveal grid items-end gap-10 md:grid-cols-[1.12fr_0.88fr] md:gap-20">
        <h2 className="max-w-[620px] font-serif text-[44px] font-medium leading-[1.03] tracking-[-0.018em] text-e26-text md:text-[68px]">
          Một góc để quay lại.
        </h2>

        <div data-body-copy className="max-w-[470px] space-y-4 font-sans text-[17px] font-normal leading-[1.82] text-e26-text md:pb-2 md:text-[18px]">
          <p>Không phải lúc nào bạn cũng cần thêm một câu trả lời.</p>
          <p className="font-medium">Có khi chỉ cần một nơi để quay lại.</p>
        </div>
      </div>

      <div className="relative mt-16 md:mt-28 md:grid md:grid-cols-12 md:gap-x-8 lg:gap-x-10">
        <article className="e26-reveal md:col-span-6 lg:col-span-5">
          <div className="relative aspect-[4/5] w-full max-w-[450px] overflow-hidden border border-[color-mix(in_srgb,var(--essence-black-2026)_12%,transparent)] bg-[color-mix(in_srgb,var(--essence-white-2026)_84%,transparent)] px-8 py-10 shadow-[0_30px_80px_rgba(26,24,20,0.055)] md:px-11 md:py-12">
            <div className="absolute inset-y-0 left-0 w-px bg-[#E0C068]/38" aria-hidden="true" />
            <div className="flex h-full flex-col">
              <div className="my-auto max-w-[330px] py-10 md:py-14">
                <h3 className="font-serif text-[46px] font-medium leading-[1.02] tracking-[-0.016em] text-e26-text md:text-[64px]">Ebook</h3>
                <p data-body-copy className="mt-7 font-sans text-[16px] font-normal leading-[1.8] text-e26-text md:text-[17px]">Một cuốn sách nhỏ cho câu hỏi:</p>
                <p className="mt-9 font-serif text-[27px] font-normal italic leading-[1.3] text-e26-text md:text-[34px]">“Bắt đầu nhìn lại bản sắc từ đâu?”</p>
              </div>

              <p className="border-t border-[color-mix(in_srgb,var(--essence-black-2026)_13%,transparent)] pt-4 font-sans text-[12px] font-medium uppercase tracking-[0.12em] text-e26-text-2">Sắp hoàn thành</p>
            </div>
          </div>
        </article>

        <article className="e26-reveal mt-16 md:col-span-5 md:col-start-8 md:mt-8 lg:col-span-4 lg:col-start-8 lg:mt-10">
          <div className="relative border-y border-[color-mix(in_srgb,var(--essence-black-2026)_14%,transparent)] py-10 md:py-12">
            <span className="absolute left-0 top-0 h-px w-16 bg-[#E0C068]/55" aria-hidden="true" />
            <h3 className="max-w-[360px] font-serif text-[34px] font-medium leading-[1.08] tracking-[-0.012em] text-e26-text md:text-[44px]">Ghi chép ESSENCE</h3>
            <p data-body-copy className="mt-7 max-w-[390px] font-sans text-[16px] font-normal leading-[1.85] text-e26-text md:text-[17px]">Những đoạn ngắn về bản sắc, khoảng dừng và những điều đi qua đời sống trước khi kịp được gọi tên.</p>
            <p className="mt-12 font-sans text-[12px] font-medium uppercase tracking-[0.12em] text-e26-text-2">Đang được viết</p>
          </div>
        </article>

        <Link
          href="/khoi-dau"
          aria-label="Đi tới Khởi đầu"
          className={`group e26-reveal relative mt-16 min-h-[300px] overflow-hidden border-l border-[#E0C068]/48 pl-7 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-e26-gold focus-visible:ring-offset-4 focus-visible:ring-offset-e26-ivory md:col-span-7 md:col-start-6 md:-mt-10 md:min-h-[330px] md:pl-10 lg:col-span-6 lg:col-start-7 lg:-mt-16 ${thresholdMotion}`}
        >
          <div
            className={`pointer-events-none absolute inset-0 origin-left scale-x-[0.11] bg-gradient-to-r from-[color-mix(in_srgb,var(--essence-white-2026)_74%,transparent)] to-transparent transition-transform group-hover:scale-x-100 ${thresholdMotion}`}
            aria-hidden="true"
          />
          <div className="relative flex min-h-[300px] items-end justify-between gap-8 py-9 md:min-h-[330px] md:py-12">
            <div>
              <h3 className="font-serif text-[38px] font-medium leading-[1.04] tracking-[-0.014em] text-e26-text md:text-[52px]">Khởi đầu</h3>
              <p data-body-copy className="mt-6 max-w-[340px] font-sans text-[16px] font-normal leading-[1.85] text-e26-text md:text-[17px]">Một vài câu hỏi để nhận ra nơi bạn đang đứng.</p>
            </div>

            <p className="relative hidden w-fit shrink-0 font-sans text-[12px] font-medium uppercase tracking-[0.12em] text-e26-text-2 md:block">
              Khởi đầu <span className={`ml-2 inline-block text-[#E0C068] transition-transform group-hover:translate-x-1 ${thresholdMotion}`} aria-hidden="true">→</span>
              <span className={`absolute -bottom-2 left-0 h-px w-full origin-left scale-x-0 bg-[#E0C068] transition-transform group-hover:scale-x-100 ${thresholdMotion}`} aria-hidden="true" />
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
}
