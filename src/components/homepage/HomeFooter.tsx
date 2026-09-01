import Link from "next/link";

type HomeFooterProps = {
  homeIa?: boolean;
};

export default function HomeFooter({ homeIa = false }: HomeFooterProps) {
  return (
    <footer id="lien-he" className="relative scroll-mt-10 bg-e26-black px-6 py-16 md:py-20">
      <div className="mx-auto max-w-4xl text-center">
        <img
          src="/brand/logo/essence-monogram-2026-dark.svg"
          alt="ESSENCE"
          className="mx-auto mb-4 h-10 w-10"
        />
        <p className="mb-1 font-sans text-xs uppercase tracking-[0.24em] text-e26-text-dark-2">
          Kenji Phạm
        </p>
        <p className="font-sans text-sm text-e26-text-dark-2">Sài Gòn · 2026</p>

        <div className="mx-auto mt-10 max-w-md border-t border-e26-border-dark pt-8">
          <p className="font-sans text-sm text-e26-text-dark-2">
            Liên hệ:{" "}
            <a
              href="mailto:contact@coachkenjipham.com"
              className="text-e26-text-dark transition-colors duration-300 hover:text-e26-gold"
            >
              contact@coachkenjipham.com
            </a>
          </p>
        </div>

        <div className="mx-auto mt-8 max-w-md border-t border-e26-border-dark pt-8">
          {homeIa ? (
            <nav
              aria-label="Trang pháp lý và liên hệ"
              className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 font-sans text-xs text-e26-text-dark-2"
            >
              <Link href="/chinh-sach-rieng-tu" className="transition-colors duration-300 hover:text-e26-gold">
                Chính sách &amp; Quyền riêng tư
              </Link>
              <span aria-hidden="true">·</span>
              <Link href="/lien-he" className="transition-colors duration-300 hover:text-e26-gold">
                Liên hệ
              </Link>
            </nav>
          ) : (
            <nav
              aria-label="Trang thông tin và pháp lý"
              className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 font-sans text-xs text-e26-text-dark-2"
            >
              <Link href="/ve-kenji" className="transition-colors duration-300 hover:text-e26-gold">Về Kenji</Link>
              <span aria-hidden="true">·</span>
              <Link href="/phuong-phap" className="transition-colors duration-300 hover:text-e26-gold">Phương pháp</Link>
              <span aria-hidden="true">·</span>
              <Link href="/chinh-sach-rieng-tu" className="transition-colors duration-300 hover:text-e26-gold">Chính sách riêng tư</Link>
              <span aria-hidden="true">·</span>
              <Link href="/lien-he" className="transition-colors duration-300 hover:text-e26-gold">Liên hệ</Link>
            </nav>
          )}
        </div>

        <div className="mx-auto mt-8 max-w-md border-t border-e26-border-dark pt-8">
          <p className="mb-3 font-sans text-xs text-e26-text-dark-2">
            Dành cho đối tác &amp; nhà tài trợ —{" "}
            <Link
              href="/ai-startup"
              className="underline decoration-e26-border-dark underline-offset-4 transition-colors duration-300 hover:text-e26-gold"
            >
              Essence AI Startup Dossier
            </Link>
          </p>
          <p className="font-sans text-xs text-e26-text-dark-2">© 2026 ESSENCE</p>
        </div>
      </div>
    </footer>
  );
}
