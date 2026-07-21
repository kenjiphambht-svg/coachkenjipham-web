import Link from "next/link";

// Section 10 — Footer, dùng chung cho toàn site (10 trang). Theo
// BRIEF-CLAUDE-CODE-trang-chu-CHOT.md: monogram chữ "E" serif lớn
// (-webkit-text-stroke, mờ 13%, tràn mép trái-dưới) thay cho SVG monogram
// nhỏ trước đây; hai tầng link tách nhóm rõ (không gộp một
// hàng); bỏ hẳn link "Essence AI Startup Dossier" — đã dời sang
// src/pages/lien-he.tsx (mục "Hợp tác & đầu tư") TRƯỚC khi bỏ ở đây, để
// route /ai-startup không mất lối vào ở bất kỳ thời điểm nào.
// SỬA 21/07/2026 (brief tinh gọn câu chữ, Quyết định 4) — BỎ link "Zalo" +
// dấu ngăn cách " · " đứng trước nó khỏi dòng liên hệ, theo yêu cầu Kenji.
// CHỈ xoá đúng phần này — email + mọi dòng khác trong footer giữ nguyên y
// hệt, áp dụng đồng nhất trên toàn bộ 10 trang dùng chung component này.
export default function HomeFooter() {
  return (
    <footer className="relative overflow-hidden bg-e26-black px-6 py-16 md:py-20">
      {/* Monogram nền — chữ ký watermark, tràn mép trái-dưới, mờ 13% */}
      <span
        aria-hidden="true"
        className="pointer-events-none select-none absolute -left-10 -bottom-16 md:-left-14 md:-bottom-24 font-serif leading-none text-transparent"
        style={{
          fontSize: "clamp(180px, 32vw, 380px)",
          WebkitTextStroke: "1px var(--essence-text-primary-dark-2026)",
          opacity: 0.13,
        }}
      >
        E
      </span>

      <div className="relative max-w-4xl mx-auto text-center">
        <p className="font-serif italic text-lg md:text-xl text-e26-text-dark mb-12">
          Chuyển dòng chảy — Vững nhịp sống.
        </p>

        {/* Tầng link 1 — "con người": trang niềm tin */}
        <nav
          aria-label="Trang niềm tin"
          className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 font-sans text-xs text-e26-text-dark-2"
        >
          <Link href="/ve-kenji" className="hover:text-e26-gold transition-colors duration-300">
            Về Kenji
          </Link>
          <span aria-hidden="true">·</span>
          <Link href="/phuong-phap" className="hover:text-e26-gold transition-colors duration-300">
            Phương pháp
          </Link>
          <span aria-hidden="true">·</span>
          <Link href="/dieu-essence-khong-hua" className="hover:text-e26-gold transition-colors duration-300">
            Điều Essence không hứa
          </Link>
        </nav>

        {/* Tầng link 2 — "an toàn": chính sách */}
        <nav
          aria-label="Chính sách"
          className="mt-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 font-sans text-xs text-e26-text-dark-2"
        >
          <Link href="/chinh-sach-rieng-tu" className="hover:text-e26-gold transition-colors duration-300">
            Chính sách riêng tư
          </Link>
        </nav>

        {/* Định danh + liên hệ */}
        <div className="border-t border-e26-border-dark max-w-md mx-auto mt-10 pt-8">
          <p className="font-sans text-xs tracking-[0.24em] uppercase text-e26-text-dark-2 mb-1">
            Kenji Phạm
          </p>
          <p className="font-sans text-sm text-e26-text-dark-2 mb-6">Sài Gòn · 2026</p>

          <p className="font-sans text-sm text-e26-text-dark-2">
            <a
              href="mailto:contact@coachkenjipham.com"
              className="text-e26-text-dark hover:text-e26-gold transition-colors duration-300"
            >
              contact@coachkenjipham.com
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
