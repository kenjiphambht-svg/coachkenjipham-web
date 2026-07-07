import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// ============================================================
// PHÒNG 6 — QUYẾT ĐỊNH (Section 12 hai gói + Section 13 phản hồi + Section 14 FAQ
// + Section 15 phù hợp/chưa phù hợp)
// Nhịp màu: S12 cream → S14 ivory → S15 cream.
// S12: nút vàng CHỈ ở Gói 1 (2/3 nút vàng toàn trang), Gói 2 nút viền;
// giá gạch hiển thị điềm đạm, không đỏ. CTA gói trỏ Tally form live (funnel thật
// đang chạy) — không đụng payment pages.
// S13: render ẩn sau flag — chỉ bật khi có phản hồi thật được phép — VoC mức 2+.
// S14: FAQ accordion (Radix) — mở được bằng bàn phím.
// Copy nguyên văn docs/product/landing-hat-mam-v3-copy.md.
// ============================================================

// Chỉ bật khi có phản hồi thật được phép — VoC mức 2+ (docs/strategy/06).
// Nội dung trong copy V3 là bản MÔ PHỎNG để duyệt giọng — không render public.
const SHOW_TESTIMONIALS = false;

// Export để trang dựng FAQPage schema từ đúng nội dung hiển thị
export const FAQS = [
  {
    q: "Cuốn sách này được viết dựa trên cơ sở nào?",
    a: "Bản Sắc được tôi viết dựa trên Tâm lý học chiều sâu, quan sát phát triển cảm xúc theo từng giai đoạn 0–7 tuổi, và kinh nghiệm coaching bản sắc với người trưởng thành.\n\nẤn phẩm không dùng để chẩn đoán, dự đoán số phận, hay kết luận con “phải” trở thành ai.\n\nNó là một bản đồ gợi mở, giúp ba mẹ quan sát con tinh tế hơn.",
  },
  {
    q: "Nếu không nhớ chính xác giờ sinh của con thì sao?",
    a: "Vẫn đặt được.\n\nNếu chỉ nhớ khoảng giờ, ba mẹ ghi khoảng đó.\n\nNếu hoàn toàn không nhớ, tôi vẫn có thể viết theo ngày sinh và bối cảnh quan sát — nhưng một số chi tiết cá nhân hóa sẽ được diễn đạt thận trọng hơn, và tôi sẽ ghi rõ điều đó trong ấn phẩm.",
  },
  {
    q: "Có cần gửi ảnh hoặc kể vấn đề của con không?",
    a: "Không bắt buộc.\n\nNhưng nếu ba mẹ chia sẻ thêm vài dòng về tính cách, thói quen, điều đang bối rối hoặc một tình huống gần đây của con, ấn phẩm sẽ gần hơn với đời sống thật của gia đình.",
  },
  {
    q: "Ấn phẩm này có giá trị sử dụng trong bao lâu?",
    a: "Bản Sắc Hạt Mầm được thiết kế như một kỷ vật đồng hành suốt giai đoạn 0–7 tuổi.\n\nBa mẹ có thể đọc lại ở nhiều mốc: khi con bắt đầu bộc lộ cảm xúc mạnh, khi con bước vào tuổi tự lập, khi con chuẩn bị vào lớp 1, hoặc khi gia đình có những va chạm nhỏ trong sinh hoạt.\n\nMỗi lần đọc lại, ba mẹ có thể thấy một lớp mới — không phải vì cuốn sách đổi, mà vì con đang lớn lên từng ngày.",
  },
  {
    q: "Sau khi bấm nút thì chuyện gì xảy ra?",
    a: "Ba mẹ điền form thông tin của bé, sau đó nhận hướng dẫn thanh toán và xác nhận.\n\nSau khi xác nhận, tôi bắt đầu đọc và viết.\n\nẤn phẩm hoàn chỉnh sẽ được gửi qua Email và Zalo trong 3–5 ngày làm việc.",
  },
  {
    q: "Con tôi đã hơn 7 tuổi, có làm được không?",
    a: "Có.\n\nPhiên bản chính trên trang này là Bản Sắc Hạt Mầm, dành cho giai đoạn 0–7 tuổi.\n\nNếu con đã lớn hơn 7 tuổi, tôi sẽ viết theo đúng giai đoạn phát triển hiện tại của con:\n\nBản Sắc Khám Phá dành cho giai đoạn 7–14 tuổi.\nBản Sắc Giao Mùa dành cho giai đoạn 14–21 tuổi.\n\nKhông có giai đoạn nào là quá muộn để bắt đầu hiểu con.",
  },
  {
    q: "File là gì, có in được không?",
    a: "Ấn phẩm được gửi dưới dạng PDF chất lượng cao.\n\nBa mẹ có thể lưu trên máy, đọc trên điện thoại, máy tính bảng, hoặc in ra nếu muốn giữ như một kỷ vật.",
  },
  {
    q: "Bản Sắc có giúp tôi xử lý hành vi của con ngay không?",
    a: "Bản Sắc không phải sách kỷ luật hành vi.\n\nNó không đưa ra công thức “nếu con làm A thì ba mẹ làm B”.\n\nThay vào đó, nó giúp ba mẹ hiểu nhu cầu nằm dưới hành vi.\n\nKhi hiểu đúng nhu cầu, cách phản hồi của ba mẹ thường mềm hơn, rõ hơn và ít phản ứng từ mệt mỏi hơn.",
  },
  {
    q: "Nếu đọc xong tôi thấy có điểm chưa giống con thì sao?",
    a: "Bản Sắc là bản đồ gợi mở, không phải bản án cố định.\n\nNếu có điểm nào ba mẹ thấy cần làm rõ hơn, hãy ghi lại.\n\nVới Gói 2, Kenji sẽ cùng ba mẹ đọc lại những điểm nổi bật, điều chỉnh cách hiểu và đưa ấn phẩm về gần hơn với đời sống thật của con.",
  },
];

const TESTIMONIALS = [
  {
    who: "Mẹ bé An, 5 tuổi",
    text: "“Trước đây mỗi lần con không chịu đi học, mình cứ nghĩ con mè nheo hoặc muốn làm khó mẹ. Đọc Bản Sắc xong, mình mới nhận ra con không chống đối. Con chỉ rất nhạy với việc bị thúc ép vào buổi sáng.\n\nMình thử đổi cách gọi con dậy, chậm hơn một chút, cho con chọn một món nhỏ mang theo trong cặp. Không phải ngày nào cũng êm, nhưng buổi sáng nhà mình bớt căng hẳn.\n\nĐiều mình quý nhất là cuốn này không làm mình thấy mình là người mẹ tệ. Nó làm mình thấy mình vẫn có thể học lại cách hiểu con.”",
  },
  {
    who: "Ba bé Gạo, 6 tuổi",
    text: "“Mình là ba nên trước giờ hay muốn giải quyết vấn đề cho nhanh. Con khóc thì mình nói ‘có gì đâu mà khóc’. Con sợ thì mình nói ‘mạnh mẽ lên’.\n\nĐọc tới phần cảm xúc của con, mình hơi nghẹn. Hóa ra có những lúc con không cần mình giảng. Con cần mình ở đó trước đã.\n\nSau đó có lần con khóc vì không ráp được đồ chơi, mình không vội sửa liền. Mình ngồi xuống hỏi: ‘Con đang tức hay buồn?’ Tự nhiên con dịu lại.\n\nMình không nghĩ một cuốn sách lại làm mình đổi một câu nói nhỏ như vậy.”",
  },
  {
    who: "Mẹ bé Mây, 4 tuổi",
    text: "“Mình từng sợ con bướng. Vì con cái gì cũng muốn tự làm, tự chọn, tự quyết. Có lúc mình rất mệt và nghĩ con khó dạy.\n\nNhưng khi đọc Bản Sắc, mình thấy một góc khác: có thể con đang học cảm giác ‘con có tiếng nói’. Từ đó mình không buông hết ranh giới, nhưng cũng không ép con im ngay như trước.\n\nMình bắt đầu cho con hai lựa chọn nhỏ: áo này hay áo kia, đánh răng trước hay thay đồ trước. Nhà vẫn có lúc ồn, nhưng mình bớt cảm giác phải thắng con.\n\nVà lạ lắm, khi mình bớt thắng, con cũng bớt chống.”",
  },
];

export default function Room6Decision() {
  return (
    <>
      {/* --- SECTION 12 — HAI CÁCH ĐỒNG HÀNH --- */}
      <section id="hai-goi" className="bg-e26-cream px-6 py-16 md:py-32 scroll-mt-10">
        <div className="max-w-[1040px] mx-auto">
          <h2 className="hm-reveal font-serif font-normal text-[28px] md:text-[38px] leading-tight text-e26-text mb-14 max-w-[720px]">
            Ba mẹ có thể chọn cách mở Bản Sắc phù hợp với mình
          </h2>

          <div className="grid md:grid-cols-2 gap-10 md:gap-8 mb-10">
            {/* Gói 1 — nút vàng duy nhất của khu quyết định */}
            <div className="hm-reveal bg-e26-white border border-e26-border p-8 md:p-10 flex flex-col">
              <h3 className="font-serif text-2xl text-e26-text mb-6">Gói 1 — Ấn phẩm Bản Sắc</h3>
              <p className="font-serif text-3xl text-e26-text">
                Giá ra mắt: 2.000.000đ
              </p>
              <p className="font-sans text-sm text-e26-text-2 line-through decoration-e26-border mt-2 mb-6">
                Giá chính thức: 3.000.000đ
              </p>
              <p className="font-sans text-[15px] text-e26-text mb-3">Bao gồm:</p>
              <ul className="font-sans text-[15px] leading-[1.8] text-e26-text-2 space-y-1 mb-6">
                <li>Ấn phẩm hoàn chỉnh 5 chương</li>
                <li>Cá nhân hóa theo thông tin của bé</li>
                <li>File PDF chất lượng cao</li>
                <li>Giao trong 3–5 ngày làm việc</li>
              </ul>
              <p className="font-sans text-[15px] leading-[1.65] text-e26-text-2 mb-8">
                Dành cho ba mẹ muốn tự đọc, tự cảm, tự ngẫm về con.
              </p>
              <a
                href="https://tally.so/r/1ANjJ4"
                className="mt-auto inline-block text-center bg-e26-gold text-e26-black rounded-none font-sans font-medium text-[13px] tracking-[0.08em] uppercase px-9 py-4 hover:bg-e26-gold-deep hover:text-e26-ivory transition-colors duration-300"
              >
                Tôi muốn nhận ấn phẩm
              </a>
            </div>

            {/* Gói 2 — nút viền */}
            <div className="hm-reveal hm-d1 bg-e26-white border border-e26-border p-8 md:p-10 flex flex-col">
              <h3 className="font-serif text-2xl text-e26-text mb-6">
                Gói 2 — Trò Chuyện Cùng Kenji
              </h3>
              <p className="font-serif text-3xl text-e26-text">
                Giá ra mắt: 3.500.000đ
              </p>
              <p className="font-sans text-sm text-e26-text-2 line-through decoration-e26-border mt-2 mb-6">
                Giá chính thức: 5.500.000đ
              </p>
              <p className="font-sans text-[15px] text-e26-text mb-3">Bao gồm trọn Gói 1, và thêm:</p>
              <ul className="font-sans text-[15px] leading-[1.8] text-e26-text-2 space-y-1 mb-6">
                <li>30 phút cùng Kenji đọc những điểm nổi bật nhất trong ấn phẩm của con</li>
                <li>Hiểu đâu là nhu cầu cảm xúc cốt lõi của bé</li>
                <li>Nhận diện 1–2 tình huống gia đình đang dễ va chạm nhất</li>
                <li>Gợi ý tương tác cụ thể để áp dụng ngay trong sinh hoạt hằng ngày</li>
              </ul>
              <p className="font-sans text-[15px] leading-[1.65] text-e26-text-2 mb-4">
                Dành cho ba mẹ muốn hiểu con sâu hơn — không chỉ đọc rồi để đó.
              </p>
              <p className="font-serif italic text-lg leading-[1.6] text-e26-text mb-8">
                Ấn phẩm cho ba mẹ tấm bản đồ.
                <br />
                Buổi trò chuyện giúp ba mẹ biết cách đi.
              </p>
              <a
                href="https://tally.so/r/Y5J2VN"
                className="mt-auto inline-block text-center border border-e26-text text-e26-text rounded-none font-sans font-medium text-[13px] tracking-[0.08em] uppercase px-9 py-4 hover:border-e26-gold-deep hover:text-e26-gold-deep transition-colors duration-300"
              >
                Tôi muốn Kenji cùng đọc với mình
              </a>
            </div>
          </div>

          <div className="hm-reveal max-w-[720px] font-sans text-[15px] leading-[1.7] text-e26-text-2 space-y-4">
            <p>
              Nếu ba mẹ chưa chắc nên chọn gói nào, hãy bắt đầu bằng Gói 1. Sau khi nhận ấn phẩm,
              nếu muốn Kenji cùng đọc sâu hơn, ba mẹ có thể hỏi thêm về buổi trò chuyện.
            </p>
            <p>
              Vì mỗi ấn phẩm cần được đọc, phân tích, viết lại và biên tập như một bản chân dung
              riêng, tôi chỉ nhận tối đa{" "}
              <span className="font-medium text-e26-text">10 ấn phẩm mỗi tháng</span>.
            </p>
          </div>
        </div>
      </section>

      {/* --- SECTION 13 — PHẢN HỒI TỪ BA MẸ (ẨN sau flag) --- */}
      {SHOW_TESTIMONIALS && (
        <section className="bg-e26-ivory px-6 py-16 md:py-32">
          <div className="max-w-[720px] mx-auto">
            <h2 className="hm-reveal font-serif font-normal text-[28px] md:text-[38px] leading-tight text-e26-text mb-14">
              Ba mẹ đã đọc con như thế nào
            </h2>
            <div className="space-y-12">
              {TESTIMONIALS.map((t, i) => (
                <blockquote key={i} className="hm-reveal border-l border-e26-gold pl-6">
                  <p className="font-sans text-xs tracking-[0.08em] uppercase text-e26-gold-deep mb-4">
                    {t.who}
                  </p>
                  <p className="font-serif italic text-lg leading-[1.7] text-e26-text whitespace-pre-line">
                    {t.text}
                  </p>
                </blockquote>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* --- SECTION 14 — NHỮNG ĐIỀU BA MẸ THƯỜNG TRĂN TRỞ (FAQ) --- */}
      <section className="bg-e26-ivory px-6 py-16 md:py-32">
        <div className="max-w-[720px] mx-auto">
          <h2 className="hm-reveal font-serif font-normal text-[28px] md:text-[38px] leading-tight text-e26-text mb-12">
            Những điều ba mẹ thường trăn trở
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

      {/* --- SECTION 15 — AI PHÙ HỢP / AI CHƯA PHÙ HỢP --- */}
      <section className="bg-e26-cream px-6 py-16 md:py-32">
        <div className="max-w-[1040px] mx-auto">
          <h2 className="hm-reveal font-serif font-normal text-[28px] md:text-[38px] leading-tight text-e26-text mb-14">
            Bản Sắc dành cho ai
          </h2>
          <div className="grid md:grid-cols-2 gap-10 md:gap-8 mb-14">
            <div className="hm-reveal border-t border-e26-gold pt-8">
              <h3 className="font-serif text-xl text-e26-text mb-5">
                Bản Sắc phù hợp với ba mẹ:
              </h3>
              <ul className="font-sans text-[15px] leading-[1.8] text-e26-text-2 space-y-2">
                <li>Có con 0–7 tuổi và muốn hiểu con sâu hơn</li>
                <li>
                  Đang bối rối trước cảm xúc, sự bướng bỉnh, nhạy cảm hoặc cá tính mạnh của con
                </li>
                <li>Thích một cách tiếp cận dịu dàng, không phán xét, không so sánh</li>
                <li>Muốn lưu giữ một kỷ vật tinh tế cho tuổi thơ của con</li>
                <li>Sẵn sàng quan sát con, không chỉ tìm một &ldquo;đáp án nhanh&rdquo;</li>
              </ul>
            </div>
            <div className="hm-reveal hm-d1 border-t border-e26-border pt-8">
              <h3 className="font-serif text-xl text-e26-text mb-5">
                Bản Sắc chưa phù hợp nếu ba mẹ:
              </h3>
              <ul className="font-sans text-[15px] leading-[1.8] text-e26-text-2 space-y-2">
                <li>Muốn một bản dự đoán tương lai chắc chắn cho con</li>
                <li>Muốn biết con sau này làm nghề gì, giàu hay nghèo, thành công hay không</li>
                <li>
                  Đang cần chẩn đoán y khoa, tâm lý, ngôn ngữ, tự kỷ, ADHD, rối loạn cảm xúc
                </li>
                <li>Muốn dùng ấn phẩm để ép con thành một hình mẫu nào đó</li>
              </ul>
            </div>
          </div>

          <div className="hm-reveal max-w-[620px]">
            <h3 className="font-serif text-xl text-e26-text mb-5">Một lưu ý dịu dàng</h3>
            <div className="font-sans text-[15px] leading-[1.7] text-e26-text-2 space-y-4">
              <p>Trẻ em không phải một bản mô tả cố định.</p>
              <p>Con đang lớn, đang thử, đang sai, đang mở ra mỗi ngày.</p>
              <p>Vì vậy, Bản Sắc không phải chiếc nhãn dán lên con.</p>
              <p className="text-e26-text">
                Nó là một chiếc đèn nhỏ, để ba mẹ nhìn con với ít phán xét hơn.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
