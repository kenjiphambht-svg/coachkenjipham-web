// ============================================================
// PHÒNG 1 — CỬA VÀO (Nav + Hero)
// Mode: Light editorial institutional (docs/brand/design-system/08 — gần nhất
// với /ve-essence, vì /ai-startup chưa có mục riêng trong Page Application Guide).
// Nền ivory, không nút vàng ở đây — vàng duy nhất toàn trang đặt ở Room 7 (Early Access).
// Toàn bộ chữ nguyên văn từ docs/product/ai-startup-noi-dung-cu.md — Section: Nav, Hero.
// ============================================================
export default function Room1Hero() {
  return (
    <>
      <header className="bg-e26-ivory border-b border-e26-border px-6">
        <div className="max-w-[1120px] mx-auto flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 py-4">
          <p className="font-serif text-xl text-e26-text">Essence Coaching</p>
          <nav aria-label="Điều hướng trang" className="flex flex-wrap items-baseline gap-x-5 gap-y-1">
            <a href="#product" className="font-sans text-sm text-e26-text-2 hover:text-e26-gold-deep transition-colors duration-300">
              Product
            </a>
            <a href="#technology" className="font-sans text-sm text-e26-text-2 hover:text-e26-gold-deep transition-colors duration-300">
              Technology
            </a>
            <a href="#safety" className="font-sans text-sm text-e26-text-2 hover:text-e26-gold-deep transition-colors duration-300">
              Safety
            </a>
            <a href="#roadmap" className="font-sans text-sm text-e26-text-2 hover:text-e26-gold-deep transition-colors duration-300">
              Roadmap
            </a>
            <a
              href="#early-access"
              className="font-sans text-sm text-e26-text border border-e26-text px-4 py-1.5 hover:border-e26-gold-deep hover:text-e26-gold-deep transition-colors duration-300"
            >
              Apply
            </a>
          </nav>
        </div>
      </header>

      <section className="bg-e26-ivory px-6 pt-20 pb-20 md:pt-28 md:pb-28">
        <div className="max-w-[900px] mx-auto text-center">
          <p className="as-reveal font-sans text-xs tracking-[0.08em] uppercase text-e26-gold-deep mb-6">
            Essence Coaching · AI Startup Dossier
          </p>

          <h1 className="as-reveal font-serif font-light text-[36px] md:text-[56px] leading-[1.12] text-e26-text mb-8">
            The AI-driven
            <br />
            Personal Psychology Engine
            <br />
            <span className="text-e26-text-2">for self-awareness, emotional regulation, and action planning.</span>
          </h1>

          <p className="as-reveal font-sans text-[17px] leading-[1.65] text-e26-text-2 max-w-2xl mx-auto mb-10">
            Essence Coaching helps high-responsibility individuals recognize emotional patterns,
            challenge limiting loops, and turn inner clarity into practical action — powered by a
            multi-agent AI workflow.
          </p>

          <div className="as-reveal flex flex-col sm:flex-row gap-4 justify-center mb-10">
            <a
              href="#early-access"
              className="inline-block text-center border border-e26-text text-e26-text rounded-none font-sans font-medium text-[13px] tracking-[0.08em] uppercase px-9 py-4 hover:border-e26-gold-deep hover:text-e26-gold-deep transition-colors duration-300"
            >
              Apply for Early Access
            </a>
            <a
              href="#technology"
              className="inline-block text-center border border-e26-border text-e26-text-2 rounded-none font-sans font-medium text-[13px] tracking-[0.08em] uppercase px-9 py-4 hover:border-e26-gold-deep hover:text-e26-gold-deep transition-colors duration-300"
            >
              View Technology Overview
            </a>
          </div>

          <p className="as-reveal font-sans text-sm text-e26-text-2">
            Built by Kenji Phạm — Essence Coach, founder of Essence Coaching System, Vietnam.
          </p>
        </div>
      </section>
    </>
  );
}
