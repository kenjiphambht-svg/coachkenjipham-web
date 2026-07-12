// ============================================================
// PHÒNG 3 — CÔNG NGHỆ (Section: Technology + Section: Multi-model)
// Nhịp màu: ivory → cream. Chữ nguyên văn từ ai-startup-noi-dung-cu.md.
// Ghi chú: giữ nguyên "FCP Protocol" trong Psychology Engine Layer theo đúng
// nội dung gốc — xem lưu ý trong phiếu báo cáo cuối (docs/brand/design-system/08
// khuyến nghị /ve-essence không nêu chi tiết FCP; ai-startup.tsx đang có).
// ============================================================
const LAYERS = [
  {
    n: "1",
    title: "Input Layer",
    body: "Journal entries · Emotional check-ins · Life context · Goals · Decision points",
  },
  {
    n: "2",
    title: "AI Agent Layer",
    body: "Claude · GPT · Gemini · n8n workflows · Structured prompts · Safety filters",
  },
  {
    n: "3",
    title: "Psychology Engine Layer",
    body: "FCP Protocol · Emotional pattern detection · Limiting loop mapping · Identity reflection",
  },
  {
    n: "4",
    title: "Output Layer",
    body: "Personal insight report · Action plan dashboard · Follow-up prompts · Progress tracking",
  },
];

const MODELS = [
  {
    name: "Claude",
    body: "Emotionally nuanced analysis, reflective writing, long-form psychological reports, and safety-sensitive language.",
  },
  {
    name: "OpenAI / GPT",
    body: "Structured reasoning, workflow orchestration, dashboard generation, summarization, and action planning.",
  },
  {
    name: "Gemini / Google Cloud",
    body: "Long-context analysis, scalable infrastructure, future multimodal journaling, and analytics across user journeys.",
  },
  {
    name: "AWS / Bedrock",
    body: "Claude access through enterprise-grade infrastructure, scalable deployment path, and future production environment.",
  },
];

export default function Room3Technology() {
  return (
    <>
      <section id="technology" className="bg-e26-ivory px-6 py-16 md:py-24 scroll-mt-16">
        <div className="max-w-[820px] mx-auto">
          <h2 className="as-reveal font-serif font-normal text-[28px] md:text-[38px] leading-tight text-e26-text text-center mb-14">
            From raw reflection to structured action.
          </h2>
          <div className="space-y-8">
            {LAYERS.map((l) => (
              <div key={l.n} className="as-reveal border-t border-e26-border pt-6">
                <div className="flex items-baseline gap-4 mb-2">
                  <span className="font-serif text-2xl text-e26-gold-deep" aria-hidden="true">{l.n}</span>
                  <h3 className="font-serif text-xl text-e26-text">{l.title}</h3>
                </div>
                <p className="font-sans text-[15px] leading-[1.65] text-e26-text-2 pl-9">{l.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-e26-cream px-6 py-16 md:py-24">
        <div className="max-w-[1040px] mx-auto">
          <h2 className="as-reveal font-serif font-normal text-[28px] md:text-[38px] leading-tight text-e26-text text-center mb-14">
            Built for a multi-model future.
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {MODELS.map((m) => (
              <div key={m.name} className="as-reveal bg-e26-white border border-e26-border p-8">
                <h3 className="font-serif text-2xl text-e26-text mb-3">{m.name}</h3>
                <p className="font-sans text-[15px] leading-[1.65] text-e26-text-2">{m.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
