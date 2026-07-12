// ============================================================
// PHÒNG 5 — SẢN PHẨM SỚM & NGƯỜI DÙNG MỤC TIÊU
// (Section: Early product modules + Section: Target users)
// Nhịp màu: cream → ivory. Chữ nguyên văn từ ai-startup-noi-dung-cu.md.
// ============================================================
const MODULES = [
  { title: "Zero Point Map", desc: "Free self-awareness reading experience." },
  { title: "Identity Quiz", desc: "AI-generated mini report based on emotional patterns." },
  { title: "Deep Reflection Report", desc: "Personalized long-form psychological analysis." },
  { title: "90-Minute Stillness Session Support", desc: "Human-led session with AI-assisted summary." },
  { title: "Action Plan Dashboard", desc: "Structured next steps after reflection." },
  { title: "Journey Memory Layer", desc: "Progress tracking across user reflections." },
];

export default function Room5ModulesUsers() {
  return (
    <>
      <section className="bg-e26-cream px-6 py-16 md:py-24">
        <div className="max-w-[1040px] mx-auto">
          <h2 className="as-reveal font-serif font-normal text-[28px] md:text-[38px] leading-tight text-e26-text text-center mb-14">
            Early product modules.
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {MODULES.map((m) => (
              <div key={m.title} className="as-reveal bg-e26-white border border-e26-border p-6">
                <h3 className="font-serif text-lg text-e26-text mb-2">{m.title}</h3>
                <p className="font-sans text-sm text-e26-text-2">{m.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-e26-ivory px-6 py-16 md:py-24">
        <div className="max-w-[820px] mx-auto text-center">
          <h2 className="as-reveal font-serif font-normal text-[28px] md:text-[38px] leading-tight text-e26-text mb-8">
            Starting with Vietnam's high-responsibility professionals.
          </h2>
          <p className="as-reveal font-sans text-[17px] leading-[1.65] text-e26-text-2 mb-6">
            Initial users include solo founders, traders, investors, coaches, creators, and
            leaders facing emotional overload, decision fatigue, or identity misalignment.
          </p>
          <p className="as-reveal font-sans text-[17px] leading-[1.65] text-e26-text">
            These users already pay for self-development, coaching, productivity systems, and AI
            tools — but lack one integrated reflective operating system.
          </p>
        </div>
      </section>
    </>
  );
}
