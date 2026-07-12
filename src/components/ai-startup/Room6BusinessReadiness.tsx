// ============================================================
// PHÒNG 6 — KINH DOANH & SẴN SÀNG
// (Section: Business model + Section: Current readiness + Section: How API credits will be used)
// Nhịp màu: cream → ivory → cream. Chữ nguyên văn từ ai-startup-noi-dung-cu.md.
// Ghi chú: "Current readiness" đã đổi từ danh sách chi tiết hạ tầng (domain,
// email, stack kỹ thuật) sang một đoạn tóm tắt public-safe theo yêu cầu Kenji
// sau báo cáo PR #11 — không còn lộ thông tin vận hành nội bộ.
// ============================================================
const BUSINESS_MODEL = [
  "Free content for lead generation",
  "Low-ticket AI reports for validation",
  "Premium human-led coaching experiences",
  "Subscription dashboard for ongoing reflection and action planning",
  "Future B2B / B2B2C licensing for coaches, creators, and high-performance teams",
];

const READINESS_SUMMARY =
  "Hệ thống đã vận hành ổn định ở quy mô sản phẩm đầu tiên, với quy trình kiểm soát chất lượng ba vòng và hạ tầng triển khai sẵn sàng mở rộng. Chi tiết vận hành được chia sẻ trực tiếp khi trao đổi hợp tác.";

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
        <div className="max-w-[820px] mx-auto text-center">
          <h2 className="as-reveal font-serif font-normal text-[28px] md:text-[38px] leading-tight text-e26-text mb-8">
            Current readiness.
          </h2>
          <p className="as-reveal font-sans text-[17px] leading-[1.65] text-e26-text-2">
            {READINESS_SUMMARY}
          </p>
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
