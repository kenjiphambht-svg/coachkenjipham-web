import { Mail } from "lucide-react";

// ============================================================
// PHÒNG 7 — CỬA RA
// (Section: Roadmap + Section: Early Access form + Section: Closing CTA + Footer)
// Nhịp màu: ivory → cream (form) → đen (closing + footer, kết lặng).
// NÚT VÀNG DUY NHẤT CỦA TOÀN TRANG: nút submit form Early Access.
// Chữ nguyên văn từ ai-startup-noi-dung-cu.md.
// Ghi chú: form giữ nguyên placeholder/label gốc; mailto giữ nguyên chuỗi gốc.
// ============================================================
const ROADMAP = [
  { phase: "Phase 1 — Foundation", desc: "Landing page, early-access form, product architecture, AI report prototype." },
  { phase: "Phase 2 — Beta", desc: "Invite first 50–100 users, test emotional check-in, quiz, AI report, and action dashboard." },
  { phase: "Phase 3 — Multi-LLM Optimization", desc: "Model routing, cost tracking, output quality scoring, human review system." },
  { phase: "Phase 4 — Productization", desc: "Subscription dashboard, journey memory, analytics, and coach-assisted workflows." },
  { phase: "Phase 5 — Regional Expansion", desc: "Vietnamese-first, then English-language Southeast Asia market." },
];

export default function Room7ClosingAccess() {
  return (
    <>
      <section id="roadmap" className="bg-e26-ivory px-6 py-16 md:py-24 scroll-mt-16">
        <div className="max-w-[820px] mx-auto">
          <h2 className="as-reveal font-serif font-normal text-[28px] md:text-[38px] leading-tight text-e26-text text-center mb-14">
            Roadmap.
          </h2>
          <div className="space-y-8">
            {ROADMAP.map((r) => (
              <div key={r.phase} className="as-reveal border-l border-e26-gold pl-6">
                <h3 className="font-serif text-xl text-e26-gold-deep mb-2">{r.phase}</h3>
                <p className="font-sans text-[15px] leading-[1.65] text-e26-text-2">{r.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="early-access" className="bg-e26-cream px-6 py-16 md:py-24 scroll-mt-16">
        <div className="max-w-[560px] mx-auto">
          <h2 className="as-reveal font-serif font-normal text-[28px] md:text-[38px] leading-tight text-e26-text text-center mb-6">
            Join Early Access.
          </h2>
          <p className="as-reveal font-sans text-[17px] text-e26-text-2 text-center mb-12">
            Become one of the first users shaping the Essence Psychology Engine.
          </p>

          <form className="as-reveal bg-e26-white border border-e26-border p-8 space-y-6">
            <div>
              <label htmlFor="name" className="block font-sans text-sm text-e26-text mb-2">Name</label>
              <input
                type="text"
                id="name"
                className="w-full px-4 py-3 border border-e26-border bg-e26-white focus:outline-none focus:border-e26-gold-deep transition-colors font-sans"
                placeholder="Your name"
              />
            </div>
            <div>
              <label htmlFor="email" className="block font-sans text-sm text-e26-text mb-2">Email</label>
              <input
                type="email"
                id="email"
                className="w-full px-4 py-3 border border-e26-border bg-e26-white focus:outline-none focus:border-e26-gold-deep transition-colors font-sans"
                placeholder="your.email@example.com"
              />
            </div>
            <div>
              <label htmlFor="role" className="block font-sans text-sm text-e26-text mb-2">Role</label>
              <input
                type="text"
                id="role"
                className="w-full px-4 py-3 border border-e26-border bg-e26-white focus:outline-none focus:border-e26-gold-deep transition-colors font-sans"
                placeholder="Founder, Trader, Coach, etc."
              />
            </div>
            <div>
              <label htmlFor="reason" className="block font-sans text-sm text-e26-text mb-2">
                What brings you to Essence?
              </label>
              <textarea
                id="reason"
                rows={4}
                className="w-full px-4 py-3 border border-e26-border bg-e26-white focus:outline-none focus:border-e26-gold-deep transition-colors resize-none font-sans"
                placeholder="Share your story..."
              />
            </div>

            <a
              href="mailto:contact@coachkenjipham.com?subject=Early Access Application&body=Name:%0D%0ARole:%0D%0AWhat brings me to Essence:%0D%0A"
              className="block"
            >
              <button
                type="button"
                className="w-full bg-e26-gold text-e26-black rounded-none font-sans font-medium text-[13px] tracking-[0.08em] uppercase py-4 hover:bg-e26-gold-deep hover:text-e26-ivory transition-colors duration-300"
              >
                Apply for Early Access
              </button>
            </a>

            <p className="font-sans text-xs text-center text-e26-text-2">
              Form integration pending — this will open your email client with a pre-filled
              template.
            </p>
          </form>
        </div>
      </section>

      <section className="bg-e26-black px-6 py-20 md:py-28">
        <div className="max-w-[720px] mx-auto text-center">
          <h2 className="as-reveal font-serif font-normal text-[28px] md:text-[38px] leading-tight text-e26-text-dark mb-8">
            A human-centered AI company, built from Vietnam.
          </h2>
          <p className="as-reveal font-sans text-[17px] leading-[1.65] text-e26-text-dark-2 mb-12">
            Essence is seeking API credits, cloud infrastructure support, and technical
            partnership to validate a multi-agent, safety-aware, AI-native coaching product.
          </p>
          <div className="as-reveal flex flex-col sm:flex-row gap-4 justify-center mb-10">
            <a
              href="#early-access"
              className="inline-block text-center border border-e26-text-dark text-e26-text-dark rounded-none font-sans font-medium text-[13px] tracking-[0.08em] uppercase px-9 py-4 hover:border-e26-gold hover:text-e26-gold transition-colors duration-300"
            >
              Apply for Early Access
            </a>
            <a
              href="mailto:contact@coachkenjipham.com"
              className="inline-flex items-center justify-center gap-2 border border-e26-border-dark text-e26-text-dark-2 rounded-none font-sans font-medium text-[13px] tracking-[0.08em] uppercase px-9 py-4 hover:border-e26-gold hover:text-e26-gold transition-colors duration-300"
            >
              <Mail className="w-4 h-4" />
              Contact Us
            </a>
          </div>
          <p className="as-reveal font-sans text-sm text-e26-text-dark-2">
            contact@coachkenjipham.com
          </p>
        </div>
      </section>

      <footer className="bg-e26-black px-6 py-10 border-t border-e26-border-dark">
        <div className="max-w-[720px] mx-auto text-center">
          <p className="font-sans text-sm text-e26-text-dark-2">
            © 2026 Essence Coaching. Built with care in Vietnam.
          </p>
        </div>
      </footer>
    </>
  );
}
