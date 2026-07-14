import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// ============================================================
// PHÒNG 7 — FAQ & KẾT. Tái dùng pattern "S14 FAQ accordion" +
// "S15 ai phù hợp" (Room6Decision.tsx) + "S17 CTA cuối/Footer signature"
// (Room7Doors.tsx) của Hạt Mầm. Copy NGUYÊN VĂN theo task.
// FAQS export để trang dựng FAQPage schema từ đúng nội dung hiển thị
// (cùng pattern Room6Decision.tsx).
// ============================================================

export const FAQS = [
  {
    q: "Khác Bản Sắc Hạt Mầm chỗ nào?",
    a: "Hạt Mầm nhìn nhịp an toàn của tuổi 0–7; Khám Phá nhìn cách con học, kết bạn và va vấp khi bước ra thế giới 7–14.",
  },
  {
    q: "Có giống trắc nghiệm tính cách không?",
    a: "Không. Không có 16 ô, không có nhãn. Chỉ có những gợi ý quan sát viết riêng cho con anh chị.",
  },
  {
    q: "Con có nên đọc cùng không?",
    a: "Được, và thường rất đẹp: chương 3 và 5 viết để ba mẹ có thể đọc cùng con. Con được quyền nói “chỗ này không giống con” — đó chính là lúc câu chuyện bắt đầu.",
  },
  {
    q: "Cần thông tin gì về con?",
    a: "Ngày sinh, nơi sinh (giờ sinh nếu nhớ), nhịp sinh hoạt, vài tình huống gần đây, và câu hỏi thật của ba mẹ. Không cần học bạ, không cần điểm số.",
  },
  {
    q: "Bao lâu nhận được?",
    a: "[X] ngày kể từ khi đủ thông tin, vì mỗi bản đều qua tay Kenji.",
  },
  {
    q: "Nếu đọc xong thấy chưa giống con?",
    a: "Nhắn thẳng cho Kenji. Ấn phẩm là bản đồ quan sát, không phải phán quyết — chỗ chưa giống là dữ liệu quý để nhìn con kỹ hơn.",
  },
];

export default function Room6FAQKP() {
  return (
    <>
      {/* --- FAQ --- */}
      <section className="bg-e26-ivory px-6 py-16 md:py-32">
        <div className="max-w-[720px] mx-auto">
          <h2 className="hm-reveal font-serif font-normal text-[28px] md:text-[38px] leading-tight text-e26-text mb-12">
            Vài câu hỏi thật
          </h2>
          <div className="hm-reveal">
            <Accordion type="single" collapsible className="space-y-0">
              {FAQS.map((f, i) => (
                <AccordionItem key={i} value={`faq-${i}`} className="border-b border-e26-border">
                  <AccordionTrigger className="font-serif text-lg md:text-xl text-left text-e26-text hover:text-e26-gold-deep transition-colors py-5 font-normal">
                    {f.q}
                  </AccordionTrigger>
                  <AccordionContent className="font-sans text-[15px] leading-[1.7] text-e26-text-2 whitespace-pre-line pb-6">
                    {f.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* --- AI PHÙ HỢP / AI CHƯA PHÙ HỢP --- */}
      <section className="bg-e26-cream px-6 py-16 md:py-32">
        <div className="max-w-[1040px] mx-auto">
          <div className="grid md:grid-cols-2 gap-10 md:gap-8">
            <div className="hm-reveal border-t border-e26-gold pt-8">
              <h3 className="font-serif text-xl text-e26-text mb-5">Ai phù hợp</h3>
              <p className="font-sans text-[15px] leading-[1.8] text-e26-text-2">
                Ba mẹ có con 7–14 muốn hiểu cách con học và lớn, sẵn sàng quan sát thay vì kết
                luận.
              </p>
            </div>
            <div className="hm-reveal hm-d1 border-t border-e26-border pt-8">
              <h3 className="font-serif text-xl text-e26-text mb-5">Ai chưa phù hợp</h3>
              <p className="font-sans text-[15px] leading-[1.8] text-e26-text-2">
                Ba mẹ đang tìm công cụ ép con vào khuôn, đoán tương lai, hoặc con đang cần hỗ trợ
                chuyên môn khẩn — hãy ưu tiên chuyên môn trước, ấn phẩm chờ được.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- CTA CUỐI --- */}
      <section className="bg-e26-ivory px-6 py-20 md:py-36">
        <div className="max-w-[620px] mx-auto text-center">
          <p className="hm-reveal font-serif text-xl md:text-2xl leading-snug text-e26-text mb-10">
            Con chỉ đi qua tuổi này một lần.
          </p>
          <a
            href="#ghi-danh"
            className="hm-reveal inline-block border border-e26-text text-e26-text rounded-none font-sans font-medium text-[13px] tracking-[0.08em] uppercase px-9 py-4 hover:border-e26-gold-deep hover:text-e26-gold-deep transition-colors duration-300"
          >
            Ghi danh sớm — Kenji sẽ báo ba mẹ đầu tiên khi cửa này mở
          </a>
        </div>
      </section>

      {/* --- FOOTER SIGNATURE --- */}
      <footer className="bg-e26-black px-6 py-20 md:py-28">
        <div className="max-w-[720px] mx-auto text-center">
          <img
            src="/brand/logo/essence-monogram-2026-dark.svg"
            alt="Essence Coaching"
            className="hm-reveal h-9 w-9 mx-auto mb-8"
          />
          <p className="hm-reveal hm-reveal-slow font-serif italic text-2xl md:text-3xl leading-relaxed text-e26-gold mb-10">
            Mỗi đứa trẻ là một câu chuyện đang tự viết. Ba mẹ là người giữ đèn.
          </p>
          <p className="hm-reveal hm-d1 font-sans text-sm text-e26-text-dark">— Kenji Phạm</p>
          <p className="hm-reveal hm-d1 font-sans text-sm text-e26-text-dark-2 mb-8">
            Essence Coach
          </p>
          <p className="hm-reveal hm-d2 font-sans text-xs text-e26-text-dark-2">
            Liên hệ:{" "}
            <a
              href="mailto:kenjipham.bht@gmail.com"
              className="text-e26-text-dark hover:text-e26-gold transition-colors duration-300"
            >
              kenjipham.bht@gmail.com
            </a>
          </p>
        </div>
      </footer>
    </>
  );
}
