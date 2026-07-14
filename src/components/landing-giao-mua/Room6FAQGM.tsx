import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// ============================================================
// PHÒNG 7 — FAQ & KẾT. Tái dùng pattern "S14 FAQ accordion" + "S15 ai
// phù hợp" + "S17 CTA cuối/Footer signature" (Hạt Mầm) — cùng cách đã
// dùng cho Room6FAQKP.tsx (Khám Phá). Copy NGUYÊN VĂN theo task.
// FAQS export để trang dựng FAQPage schema từ đúng nội dung hiển thị.
// ============================================================

export const FAQS = [
  {
    q: "Khác Khám Phá (7–14) chỗ nào?",
    a: "Khám Phá nhìn cách con học và va vấp khi bước ra thế giới; Giao Mùa nhìn cách con tách ra để thành chính mình — và cách ba mẹ đồng hành mà không giữ, không buông.",
  },
  {
    q: "Con gần 18–20 tuổi rồi, còn phù hợp không?",
    a: "Còn. 14–21 là một mùa; càng về cuối mùa, chương “khoảng cách đúng” càng quan trọng.",
  },
  {
    q: "Con có biết ba mẹ làm ấn phẩm này không?",
    a: "Nên biết. Với con từ 15 tuổi, phiếu hỏi có phần mời con tham gia; chương 5 có trang viết để trao cho con. Ấn phẩm làm sau lưng con thì đi ngược tinh thần của chính nó.",
  },
  {
    q: "Có giúp con chọn ngành không?",
    a: "Không chọn hộ. Nó giúp ba mẹ hiểu điều gì phía sau lựa chọn của con, để cuộc nói chuyện chọn ngành bớt thành cuộc đối đầu.",
  },
  {
    q: "Cần thông tin gì?",
    a: "Ngày sinh, nơi sinh (giờ nếu nhớ), vài tình huống gần đây, điều ba mẹ trăn trở nhất — và phần con tự kể nếu con muốn.",
  },
  {
    q: "Bao lâu nhận?",
    a: "[X] ngày từ khi đủ thông tin.",
  },
  {
    q: "Nếu con đang thật sự khó khăn (bỏ học, thu mình kéo dài, dấu hiệu đáng lo)?",
    a: "Hãy tìm hỗ trợ chuyên môn phù hợp trước. Ấn phẩm là bản đồ quan sát cho hành trình dài, không phải công cụ xử lý khủng hoảng.",
  },
];

export default function Room6FAQGM() {
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
                Ba mẹ có con 14–21 muốn giữ được sợi dây với con qua mùa giao — bằng tôn trọng,
                không bằng kiểm soát.
              </p>
            </div>
            <div className="hm-reveal hm-d1 border-t border-e26-border pt-8">
              <h3 className="font-serif text-xl text-e26-text mb-5">Ai chưa phù hợp</h3>
              <p className="font-sans text-[15px] leading-[1.8] text-e26-text-2">
                Ba mẹ tìm cách quản con chặt hơn, đoán tương lai con, hoặc muốn ấn phẩm &ldquo;nói
                hộ&rdquo; điều ba mẹ muốn áp.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- CTA CUỐI --- */}
      <section className="bg-e26-ivory px-6 py-20 md:py-36">
        <div className="max-w-[620px] mx-auto text-center">
          <p className="hm-reveal font-serif text-xl md:text-2xl leading-snug text-e26-text mb-10">
            Mùa giao của con chỉ có một lần — và nó đang diễn ra.
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
            Thương con ở tuổi này là học đứng đúng khoảng cách.
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
