// ============================================================
// PHÒNG 6 — KINH DOANH & SẴN SÀNG
// (Section: Business model + Section: Current readiness + Section: How API credits will be used)
// Nhịp màu: cream → ivory → cream. Chữ nguyên văn từ ai-startup-noi-dung-cu.md.
// Ghi chú: "Current readiness" liệt kê thông tin nội bộ (domain, email, hạ tầng)
// — giữ nguyên theo đúng yêu cầu không tự xóa nội dung; xem phiếu báo cáo cuối.
// ============================================================
const BUSINESS_MODEL = [
  "Free content for lead generation",
  "Low-ticket AI reports for validation",
  "Premium human-led coaching experiences",
  "Subscription dashboard for ongoing reflection and action planning",
  "Future B2B / B2B2C licensing for coaches, creators, and high-performance teams",
];

const READINESS = [
  "Official domain: coachkenjipham.com",
  "Business email: contact@coachkenjipham.com",
  "Core psychology framework documented",
  "Multi-agent workflow designed",
  "n8n automation stack in progress",
  "AI report pipeline under development",
  "Founder-led quality control",
  "Vietnam-first market positioning",
];

const API_CREDITS = [
  "Run multi-agent workflows for Early Access users",
  "Generate personalized reflection reports",
  "Test model routing between Claude, GPT, Gemini, and Bedrock",
  "Build the action-plan dashboard",
  "Improve safety filters and human-review workflows",
  "Analyze anonymized user journeys for product iteration",
  "Reduce infrastructure cost during beta",
];

export default function Room6BusinessReadiness() {
  return (
    <>
      <section className="bg-e26-cream px-6 py-16 md:py-24">
        <div className="max-w-[820px] mx-auto">
          <h2 className="as-reveal font-serif font-normal text-[28px] md:text-[38px] leading-tight text-e26-text text-center mb-14">
            Business model.
          </h2>
          <div className="space-y-4">
            {BUSINESS_MODEL.map((item, i) => (
              <div key={item} className="as-reveal flex items-start gap-4 bg-e26-white border border-e26-border p-6">
                <span className="font-serif text-xl text-e26-gold-deep flex-shrink-0">{i + 1}</span>
                <p className="font-sans text-[16px] text-e26-text">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-e26-ivory px-6 py-16 md:py-24">
        <div className="max-w-[1040px] mx-auto">
          <h2 className="as-reveal font-serif font-normal text-[28px] md:text-[38px] leading-tight text-e26-text text-center mb-14">
            Current readiness.
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {READINESS.map((item) => (
              <div key={item} className="as-reveal flex items-start gap-3 border border-e26-border p-4">
                <span className="w-1.5 h-1.5 rounded-full bg-e26-gold flex-shrink-0 mt-2" aria-hidden="true" />
                <span className="font-sans text-[15px] text-e26-text-2">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-e26-cream px-6 py-16 md:py-24">
        <div className="max-w-[720px] mx-auto">
          <h2 className="as-reveal font-serif font-normal text-[28px] md:text-[38px] leading-tight text-e26-text text-center mb-14">
            How API credits will be used.
          </h2>
          <div className="space-y-3">
            {API_CREDITS.map((item) => (
              <div key={item} className="as-reveal flex items-start gap-3 bg-e26-white border border-e26-border p-4">
                <span className="w-1.5 h-1.5 bg-e26-gold flex-shrink-0 mt-2" aria-hidden="true" />
                <p className="font-sans text-[15px] text-e26-text-2">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
