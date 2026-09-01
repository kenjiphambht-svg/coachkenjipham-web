import Link from "next/link";

type HomeFooterProps = {
  homeIa?: boolean;
};

export default function HomeFooter(_props: HomeFooterProps) {
  return (
    <footer id="lien-he" className="relative scroll-mt-10 overflow-hidden bg-e26-black px-6 py-16 md:py-20">
      <div className="relative mx-auto max-w-4xl text-center">
        <p className="mx-auto max-w-[760px] font-serif text-lg font-normal italic leading-[1.4] text-e26-text-dark md:text-xl">
          Câu chuyện cuộc sống của bạn là một kiệt tác.
        </p>

        <nav
          aria-label="Điều hướng cuối trang"
          className="mt-10 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 font-sans text-xs text-e26-text-dark-2 md:mt-12"
        >
          <Link href="/khoi-dau" className="transition-colors duration-300 hover:text-e26-gold">
            Khởi đầu
          </Link>
          <span aria-hidden="true">·</span>
          <Link href="/lien-he" className="transition-colors duration-300 hover:text-e26-gold">
            Liên hệ
          </Link>
          <span aria-hidden="true">·</span>
          <Link href="/chinh-sach-rieng-tu" className="transition-colors duration-300 hover:text-e26-gold">
            Chính sách riêng tư
          </Link>
        </nav>

        <div className="mx-auto mt-10 max-w-4xl border-t border-e26-border-dark pt-8 md:mt-12">
          <p className="mb-1 font-sans text-xs font-medium uppercase tracking-[0.24em] text-e26-text-dark">
            Kenji Phạm
          </p>
          <p className="mb-6 font-sans text-sm font-medium text-e26-text-dark">Sài Gòn · 2026</p>

          <p className="font-sans text-sm text-e26-text-dark-2">
            <a
              href="mailto:hello@kenjipham.com"
              className="text-e26-text-dark transition-colors duration-300 hover:text-e26-gold"
            >
              hello@kenjipham.com
            </a>
          </p>

          <p className="mt-5 font-sans text-[11px] leading-[1.5] tracking-[0.07em] text-e26-text-dark-2">
            © 2026 Kenji Phạm. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
