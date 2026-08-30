import Link from "next/link";

const thresholdMotion = "duration-[420ms] ease-out motion-reduce:transition-none motion-reduce:duration-0";

export default function NotesTeaser() {
  return (
    <div id="goc-doc" className="relative scroll-mt-28">
      <div className="e26-reveal max-w-[650px]">
        <div className="mb-7 flex items-center gap-4">
          <span className="h-px w-10 bg-[#E0C068]" aria-hidden="true" />
          <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.18em] text-e26-text-2">Góc đọc & quay lại</p>
        </div>
        <h2 className="font-serif text-[40px] font-medium leading-[1.08] tracking-[-0.014em] text-e26-text md:text-[58px]">Một góc để quay lại.</h2>
        <div data-body-copy className="mt-8 max-w-[590px] space-y-5 font-sans text-[17px] font-normal leading-[1.85] text-e26-text md:text-[18px]">
          <p>Có ngày, bạn cần một cuộc đối thoại sâu.</p>
          <p>Có ngày, một đoạn ngắn đã đủ để nhìn rõ thêm một điều.</p>
          <p>Những cánh cửa này đang được viết dần.</p>
          <p>Khi mở, chúng sẽ ở đây — để bạn quay lại đúng lúc mình cần.</p>
        </div>
      </div>

      <div className="mt-16 grid gap-y-16 md:mt-24 md:grid-cols-12 md:gap-x-8 md:gap-y-0 lg:gap-x-10">
        {/* 01 — Editorial / book object */}
        <article className="e26-reveal md:col-span-5 lg:col-span-5">
          <div className="relative mx-auto aspect-[4/5] w-full max-w-[430px] overflow-hidden border border-[color-mix(in_srgb,var(--essence-black-2026)_12%,transparent)] bg-[color-mix(in_srgb,var(--essence-white-2026)_82%,transparent)] px-8 py-10 shadow-[0_28px_70px_rgba(26,24,20,0.06)] md:px-10 md:py-12">
            <div className="absolute inset-y-0 left-0 w-px bg-[#E0C068]/35" aria-hidden="true" />
            <div className="flex h-full flex-col">
              <p className="flex items-baseline gap-4">
                <span className="font-serif text-[34px] font-normal leading-none tracking-[0.02em] text-e26-text md:text-[42px]">01</span>
                <span className="font-sans text-[11px] font-medium uppercase tracking-[0.16em] text-e26-text-2">Ấn phẩm</span>
              </p>

              <div className="my-auto max-w-[320px] py-10 md:py-14">
                <h3 className="font-serif text-[42px] font-medium leading-[1.06] tracking-[-0.012em] text-e26-text md:text-[58px]">Ebook</h3>
                <p data-body-copy className="mt-7 font-sans text-[16px] font-normal leading-[1.8] text-e26-text md:text-[17px]">Một cuốn sách nhỏ cho người đang tự hỏi:</p>
                <p className="mt-9 font-serif text-[25px] font-normal italic leading-[1.35] text-e26-text md:text-[31px]">“Tôi nên bắt đầu nhìn lại bản sắc của mình từ đâu?”</p>
              </div>

              <p className="border-t border-[color-mix(in_srgb,var(--essence-black-2026)_13%,transparent)] pt-4 font-sans text-[12px] font-medium uppercase tracking-[0.12em] text-e26-text-2">Sắp hoàn thành</p>
            </div>
          </div>
        </article>

        {/* 02 — Note / fragment */}
        <article className="e26-reveal relative md:col-span-4 md:col-start-7 md:mt-14 lg:col-span-3 lg:col-start-7 lg:mt-20">
          <div className="border-y border-[color-mix(in_srgb,var(--essence-black-2026)_14%,transparent)] py-9 md:py-11">
            <p className="flex items-baseline gap-4">
              <span className="font-serif text-[30px] font-normal leading-none tracking-[0.02em] text-e26-text md:text-[36px]">02</span>
              <span className="font-sans text-[11px] font-medium uppercase tracking-[0.16em] text-e26-text-2">Ghi chép</span>
            </p>
            <h3 className="mt-12 font-serif text-[31px] font-medium leading-[1.14] tracking-[-0.01em] text-e26-text md:text-[38px]">Ghi chép Essence</h3>
            <p data-body-copy className="mt-7 font-sans text-[16px] font-normal leading-[1.9] text-e26-text md:text-[17px]">Những bài viết ngắn về phản xạ, bản sắc, khoảng dừng và những điều thường đi qua đời sống trước khi ta kịp gọi tên.</p>
            <div className="mt-11 flex items-center gap-4">
              <span className="h-px w-8 bg-[#E0C068]/70" aria-hidden="true" />
              <p className="font-sans text-[12px] font-medium uppercase tracking-[0.12em] text-e26-text-2">Đang được viết</p>
            </div>
          </div>
        </article>

        {/* 03 — Threshold / orientation */}
        <Link
          href="/khoi-dau"
          aria-label="Đi tới Khởi đầu"
          className={`group e26-reveal relative min-h-[330px] overflow-hidden border-l border-[#E0C068]/45 pl-7 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-e26-gold focus-visible:ring-offset-4 focus-visible:ring-offset-e26-ivory md:col-span-4 md:col-start-9 md:mt-44 md:min-h-[360px] md:pl-9 lg:col-span-3 lg:col-start-10 lg:mt-52 ${thresholdMotion}`}
        >
          <div
            className={`pointer-events-none absolute inset-0 origin-left scale-x-[0.16] bg-gradient-to-r from-[color-mix(in_srgb,var(--essence-white-2026)_72%,transparent)] to-transparent transition-transform group-hover:scale-x-100 ${thresholdMotion}`}
            aria-hidden="true"
          />
          <div className="relative flex min-h-[330px] flex-col py-7 md:min-h-[360px] md:py-9">
            <p className="flex items-baseline gap-4">
              <span className="font-serif text-[30px] font-normal leading-none tracking-[0.02em] text-e26-text md:text-[36px]">03</span>
              <span className="font-sans text-[11px] font-medium uppercase tracking-[0.16em] text-e26-text-2">Khởi đầu</span>
            </p>
            <div className="my-auto py-10">
              <h3 className="font-serif text-[34px] font-medium leading-[1.1] tracking-[-0.01em] text-e26-text md:text-[42px]">Khởi đầu</h3>
              <p data-body-copy className="mt-7 max-w-[300px] font-sans text-[16px] font-normal leading-[1.9] text-e26-text md:text-[17px]">Một vài câu hỏi để bạn nhận ra mình đang đứng ở đâu.</p>
            </div>
            <p className="relative w-fit font-sans text-[12px] font-medium uppercase tracking-[0.12em] text-e26-text-2">
              Đi tới Khởi đầu <span className={`ml-2 inline-block text-[#E0C068] transition-transform group-hover:translate-x-1 ${thresholdMotion}`} aria-hidden="true">→</span>
              <span className={`absolute -bottom-2 left-0 h-px w-full origin-left scale-x-0 bg-[#E0C068] transition-transform group-hover:scale-x-100 ${thresholdMotion}`} aria-hidden="true" />
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
}
