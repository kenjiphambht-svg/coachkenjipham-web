import { SEO } from "@/components/SEO";
import { Heart, AlertCircle, Lightbulb, Users, FileText, MessageCircle, Send, BookOpen } from "lucide-react";
import Image from "next/image";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function Home() {
  return (
    <>
      <SEO
        title="Bản Sắc · Cuốn sách tâm hồn duy nhất của bé · Essence Coaching"
        description="Mỗi đứa trẻ mang một bản thiết kế riêng. Ấn phẩm Mini Ebook được viết riêng để giải mã tính cách bẩm sinh, cảm xúc và tài năng bẩm sinh cho bé 0-6 tuổi."
      />

      <div className="min-h-screen bg-cream text-body-text">
        {/* Navigation */}
        <nav className="border-b border-[rgba(201,168,76,0.3)] bg-cream">
          <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
            <Image
              src="/essence-wordmark-inline-light.svg"
              alt="Kenji Phạm · Essence Coaching"
              width={380}
              height={85}
              className="h-auto w-auto max-w-[200px] md:max-w-[380px]"
            />
            <a
              href="#contact"
              className="font-sans text-[10px] tracking-widest uppercase border border-gold-brand px-[14px] py-[5px] text-ink hover:bg-gold-brand hover:text-ink transition-colors"
            >
              Ưu đãi ra mắt
            </a>
          </div>
        </nav>

        {/* Hero Section - Enhanced spacing */}
        <section className="py-28 px-6 text-center bg-cream">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="font-sans text-[12px] tracking-[0.25em] uppercase text-gold font-semibold">
              MINI EBOOK BẢN SẮC · DÀNH CHO BÉ 0–6 TUỔI
            </div>
            <h1 className="font-serif text-4xl md:text-[56px] leading-[1.15] text-ink">
              Con không đến thế giới này để trở thành một ai đó khác.{" "}
              <span className="italic text-gold-brand">Con đến để là chính mình.</span>
            </h1>
            <p className="text-[16px] leading-[1.7] max-w-3xl mx-auto text-body-text">
              Đừng cố gắng "sửa chữa" con, khi điều con cần nhất là được thấu hiểu. 
              <strong className="text-gold-brand"> BẢN SẮC</strong> là ấn phẩm Mini Ebook được viết riêng cho từng bé, 
              giúp bạn hiểu tính cách bẩm sinh, cảm xúc và tài năng bẩm sinh của con. 
              Nó không dự báo số phận, chỉ là một chiếc la bàn tĩnh lặng để ba mẹ tự tin trên hành trình nuôi dưỡng.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
              <a
                href="#contact"
                className="font-sans text-[11px] tracking-widest uppercase border border-ink text-ink px-8 py-4 hover:bg-ink hover:text-cream transition-colors"
              >
                MÓN QUÀ THẤU HIỂU (2.000.000đ)
              </a>
              <a
                href="#contact"
                className="font-sans text-[11px] tracking-widest uppercase bg-gold text-ink px-8 py-4 hover:bg-[#b89640] transition-colors"
              >
                TRÒ CHUYỆN CÙNG KENJI (3.500.000đ)
              </a>
            </div>
          </div>
        </section>

        {/* Pain Points - 4 Cards Grid with Icons */}
        <section className="py-28 px-6 bg-[#f2ead8]">
          <div className="max-w-6xl mx-auto space-y-12">
            <div className="text-center space-y-4">
              <h2 className="font-serif text-3xl md:text-[42px] text-ink">
                Tại sao lại là một cuốn sách của riêng bạn?
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                {
                  icon: <Heart className="w-10 h-10" />,
                  quote: "Sao con cứ quấy khóc mà mình không hiểu lý do?",
                },
                {
                  icon: <AlertCircle className="w-10 h-10" />,
                  quote: "Nuôi theo đúng sách dạy, sao con vẫn không như kỳ vọng?",
                },
                {
                  icon: <Lightbulb className="w-10 h-10" />,
                  quote: "Làm sao để biết con có năng khiếu gì từ sớm?",
                },
                {
                  icon: <Users className="w-10 h-10" />,
                  quote: "Con bướng bỉnh — là con đang hư hay đó là cá tính?",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="bg-cream p-8 shadow-[0_4px_20px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.09)] transition-shadow space-y-4"
                >
                  <div className="text-gold">{item.icon}</div>
                  <p className="font-serif italic text-[17px] leading-[1.6] text-ink">
                    {item.quote}
                  </p>
                </div>
              ))}
            </div>

            <div className="max-w-3xl mx-auto pt-8">
              <p className="text-[15px] leading-[1.7] text-body-text text-center">
                Trong thế giới đầy rẫy những lời khuyên "phải làm thế này, phải làm thế kia", 
                ba mẹ thường tự trách mình khi con không giống "con nhà người ta". 
                Nhưng kỳ thực, không có cuốn sách giáo khoa nào viết đúng về đứa trẻ của bạn cả. 
                <strong className="text-gold-brand"> Trừ cuốn sách này.</strong>
              </p>
              <p className="text-[15px] leading-[1.7] text-body-text text-center mt-4">
                Bản Sắc không dạy bạn cách làm ba mẹ, nó giúp bạn học cách đọc cuốn sách quý giá nhất đời mình: 
                <strong className="text-gold-brand"> Đó chính là con bạn.</strong> Khi bạn hiểu được ngôn ngữ của con, 
                mọi áp lực sẽ tan biến, chỉ còn lại sự kết nối tĩnh lặng và đầy yêu thương.
              </p>
            </div>
          </div>
        </section>

        {/* Kenji Bio - Enhanced with emphasis box */}
        <section className="py-28 px-6 bg-cream">
          <div className="max-w-4xl mx-auto space-y-12">
            <div className="text-center space-y-4">
              <h2 className="font-serif text-3xl md:text-[42px] text-ink">
                Tôi đọc "bản sắc" của con bạn.
              </h2>
            </div>

            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="w-[68px] h-[68px] flex-shrink-0">
                <Image
                  src="/essence-monogram-light.svg"
                  alt="Essence Coaching"
                  width={68}
                  height={68}
                  className="w-full h-full"
                />
              </div>
              <div className="space-y-4 flex-1">
                <div className="space-y-1">
                  <div className="font-serif text-[20px] text-ink">
                    Kenji Phạm
                  </div>
                  <div className="font-sans text-[10px] tracking-widest uppercase text-gold">
                    ESSENCE COACH · SÀI GÒN
                  </div>
                </div>
                <p className="text-[15px] leading-[1.7] text-body-text">
                  Chào bạn, tôi là Kenji Phạm — Essence Coach. Suốt 8 năm làm việc cùng người lớn, 
                  tôi nhận ra bao tổn thương của họ đều bắt nguồn từ việc bị "uốn nắn" sai cách thuở nhỏ. 
                  Bản Sắc ra đời để con bạn không phải đi lại vết xe đổ ấy. Mỗi Ebook không phải là sản phẩm 
                  copy-paste từ phần mềm. Nó được tôi tĩnh lặng phân tích, chắt lọc để viết cho riêng tâm hồn từng bé.
                </p>
              </div>
            </div>

            <div className="border-l-4 border-gold bg-[#f2ead8] p-8 shadow-[0_4px_20px_rgba(0,0,0,0.04)]">
              <p className="text-[15px] leading-[1.7] text-body-text italic">
                Vì mỗi ấn phẩm đòi hỏi sự hiện diện trọn vẹn và tính cá nhân hóa 100%, 
                <strong className="text-gold-brand"> tôi chỉ nhận phân tích và viết tối đa 20 bản / tháng</strong> để giữ gìn 
                sự sâu sắc nhất trong từng câu chữ.
              </p>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-28 px-6 bg-[#f2ead8]">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="space-y-6">
              <div className="bg-cream p-8 shadow-[0_4px_20px_rgba(0,0,0,0.06)] space-y-4">
                <div className="font-sans text-[10px] tracking-widest uppercase text-gold-deep">
                  Mẹ bé Minh Khuê
                </div>
                <p className="font-serif text-[17px] leading-[1.6] text-body-text italic">
                  "Đọc cuốn sách nhỏ này, mình mới thấu hiểu sự 'bướng bỉnh' của con thực chất là khao khát 
                  sự hoàn hảo và an toàn. Mình nhẹ nhõm hẳn vì học được cách 'chứa đựng' con thay vì cố sửa con..."
                </p>
              </div>

              <div className="bg-cream p-8 shadow-[0_4px_20px_rgba(0,0,0,0.06)] space-y-4">
                <div className="font-sans text-[10px] tracking-widest uppercase text-gold-deep">
                  Ba Mẹ bé Win
                </div>
                <p className="font-serif text-[17px] leading-[1.6] text-body-text italic">
                  "Bản Sắc không tiên đoán tương lai, nhưng trao cho vợ chồng mình một điểm tựa vững chắc để 
                  quan sát sự độc bản của con lớn lên mỗi ngày. Một món quà quá đẹp cho tuổi thơ của con."
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 5 Chapters - Timeline Style with Dark Background */}
        <section className="py-28 px-6 bg-dark-section">
          <div className="max-w-4xl mx-auto space-y-12">
            <div className="space-y-4 text-center">
              <div className="font-sans text-[10px] tracking-widest uppercase text-gold">
                NỘI DUNG EBOOK
              </div>
              <h2 className="font-serif text-3xl md:text-[42px] text-cream-light">
                5 Chương Hành Trình — Phác họa chân dung tâm hồn con
              </h2>
              <p className="text-[15px] text-cream-muted max-w-2xl mx-auto">
                Bản Ebook dài khoảng 30 trang, được thiết kế sang trọng, chia làm 5 chương viết riêng cho con:
              </p>
            </div>

            <div className="space-y-0 relative">
              {/* Timeline line */}
              <div className="absolute left-[39px] top-0 bottom-0 w-[2px] bg-[rgba(224,195,115,0.2)] hidden md:block"></div>

              {[
                {
                  num: "01",
                  title: "Bản thiết kế nguyên bản (Hạt mầm)",
                  desc: "Tìm hiểu cách con đã chọn để bước vào thế giới. Chương này giúp ba mẹ nhận diện 'mã code' riêng biệt mà con mang theo, để yêu thương con mà không cần ép uổng.",
                },
                {
                  num: "02",
                  title: "0–2 tuổi — Thế giới qua lăng kính của con",
                  desc: "Trong hai năm đầu đời, con dùng chiếc 'ăng-ten' cảm xúc để hít thở bầu không khí của gia đình. Chương này giúp ba mẹ giải mã những cơn quấy khóc tưởng chừng vô lý, để hiểu đằng sau sự khó ở đó.",
                },
                {
                  num: "03",
                  title: "2–4 tuổi — Ý chí độc lập của con",
                  desc: "Chứng kiến khoảnh khắc con bắt đầu tự vẽ nên biên giới của riêng mình. Đây là lúc 'ngôi sao' bên trong con bừng sáng, ba mẹ sẽ học cách thiết lập ranh giới mà không làm gãy đổ cá tính của con.",
                },
                {
                  num: "04",
                  title: "4–6 tuổi — Đóa hoa của bạn và khu vườn xã hội",
                  desc: "Nhìn thấy cách con chọn để tỏa hương và kết nối. Chương này giúp bạn phát hiện tài năng chớm nở, chuẩn bị cho con một bệ phóng vững chãi nhất từ chính nội lực của con.",
                },
                {
                  num: "05",
                  title: "Lời hồi đáp từ tương lai",
                  desc: "Một bức thư gửi từ tương lai, khi con đã bước sang tuổi thứ 7 và lớn lên thành một người hạnh phúc vì được ba mẹ thấu hiểu từ thuở ấu thơ.",
                },
              ].map((chapter, i) => (
                <div
                  key={i}
                  className="relative pb-12 last:pb-0"
                >
                  <div className="flex gap-8 items-start">
                    {/* Number circle */}
                    <div className="w-[80px] h-[80px] flex-shrink-0 border-2 border-[rgba(224,195,115,0.3)] bg-dark-section flex items-center justify-center relative z-10">
                      <span className="font-serif text-[32px] text-[rgba(224,195,115,0.5)]">
                        {chapter.num}
                      </span>
                    </div>
                    
                    <div className="flex-1 pt-2 space-y-3">
                      <h3 className="font-serif text-[20px] text-gold-brand leading-[1.4]">
                        {chapter.title}
                      </h3>
                      <p className="text-[14px] leading-[1.7] text-cream-muted">
                        {chapter.desc}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-28 px-6 bg-cream">
          <div className="max-w-5xl mx-auto space-y-12">
            <div className="text-center space-y-4">
              <h2 className="font-serif text-3xl md:text-[42px] text-ink">
                Để cuốn sách được mở ra
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: <Send className="w-10 h-10" />,
                  title: "Gửi thông tin",
                  desc: "Ba mẹ cung cấp ngày, giờ (dương lịch), nơi sinh của bé cùng một vài bối cảnh gia đình (không bắt buộc).",
                },
                {
                  icon: <FileText className="w-10 h-10" />,
                  title: "Phân tích",
                  desc: "Kenji dành thời gian đi sâu vào dữ liệu, phác họa và viết từng chương của cuốn sách.",
                },
                {
                  icon: <BookOpen className="w-10 h-10" />,
                  title: "Trao gửi Ebook của con",
                  desc: "Sau 3-5 ngày làm việc, cuốn sách điện tử (file PDF) thiết kế sang trọng sẽ được gửi trực tiếp qua Email và Zalo của ba mẹ. Định dạng này giúp ba mẹ dễ dàng lưu trữ, mở ra xem trên điện thoại hoặc iPad bất cứ lúc nào, ở bất cứ đâu.",
                },
              ].map((step, i) => (
                <div
                  key={i}
                  className="text-center space-y-4"
                >
                  <div className="flex justify-center">
                    <div className="w-20 h-20 rounded-full border-2 border-gold flex items-center justify-center text-gold">
                      {step.icon}
                    </div>
                  </div>
                  <h3 className="font-serif text-[20px] text-ink">
                    {step.title}
                  </h3>
                  <p className="text-[14px] leading-[1.7] text-body-text">
                    {step.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing - Enhanced with scale effect for Gói 2 */}
        <section className="py-28 px-6 bg-[#f2ead8]" id="contact">
          <div className="max-w-5xl mx-auto space-y-12">
            <div className="text-center space-y-4">
              <h2 className="font-serif text-3xl md:text-[42px] text-ink">
                Chọn món quà bạn muốn dành tặng con
              </h2>
              <p className="font-serif italic text-[16px] text-gold">
                Ưu đãi ra mắt dành riêng cho tháng này.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              {/* Gói 1 */}
              <div className="bg-cream border-2 border-gold p-8 space-y-6 shadow-[0_4px_20px_rgba(0,0,0,0.06)]">
                <div className="space-y-2">
                  <div className="font-sans text-[11px] tracking-widest uppercase text-gold">
                    GÓI 1: MÓN QUÀ THẤU HIỂU
                  </div>
                  <div className="flex items-baseline gap-3">
                    <div className="font-serif text-[48px] text-ink">
                      2.000.000đ
                    </div>
                    <div className="font-sans text-[13px] text-body-text line-through">
                      Giá chính thức 3.000.000đ
                    </div>
                  </div>
                </div>

                <ul className="space-y-3 text-[14px] leading-[1.7]">
                  <li className="flex items-start gap-3">
                    <span className="text-gold mt-1">•</span>
                    <span>Nhận ấn phẩm Mini Ebook (5 Chương)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-gold mt-1">•</span>
                    <span>Cá nhân hóa 100% cho từng bé</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-gold mt-1">•</span>
                    <span>Ba mẹ tự chiêm nghiệm và lưu giữ như một kỷ vật</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-gold mt-1">•</span>
                    <span>Giao trong 3-5 ngày</span>
                  </li>
                </ul>

                <a
                  href="#contact"
                  className="block text-center font-sans text-[11px] tracking-widest uppercase border-2 border-ink text-ink px-8 py-4 hover:bg-ink hover:text-cream transition-colors"
                >
                  Đặt Gói 1
                </a>
              </div>

              {/* Gói 2 - Highlighted */}
              <div className="bg-cream border-2 border-gold-brand p-8 space-y-6 relative shadow-[0_8px_30px_rgba(224,195,115,0.25)] md:scale-105">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gold-brand px-6 py-2 font-sans text-[11px] tracking-widest uppercase text-ink">
                  Được chọn nhiều nhất
                </div>
                <div className="space-y-2">
                  <div className="font-sans text-[11px] tracking-widest uppercase text-gold-brand">
                    GÓI 2: TRÒ CHUYỆN CÙNG KENJI
                  </div>
                  <div className="flex items-baseline gap-3">
                    <div className="font-serif text-[48px] text-ink">
                      3.500.000đ
                    </div>
                    <div className="font-sans text-[13px] text-body-text line-through">
                      Giá chính thức: 5.500.000đ
                    </div>
                  </div>
                </div>

                <ul className="space-y-3 text-[14px] leading-[1.7]">
                  <li className="flex items-start gap-3">
                    <span className="text-gold-brand mt-1">•</span>
                    <span>Bao gồm tất cả quyền lợi của Gói 1</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-gold-brand mt-1">•</span>
                    <span className="font-semibold">30 phút thảo luận 1-1 trực tiếp cùng Kenji qua Zoom/Voice</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-gold-brand mt-1">•</span>
                    <span>Kenji sẽ trò chuyện trực tiếp cùng ba mẹ, đi sâu vào những điểm tính cách nổi bật nhất của con</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-gold-brand mt-1">•</span>
                    <span>Gợi ý các phương pháp tương tác thực tế áp dụng ngay vào sinh hoạt hàng ngày</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-gold-brand mt-1">•</span>
                    <span>Gỡ rối chuyên sâu các vấn đề thực tế gia đình đang gặp</span>
                  </li>
                </ul>

                <a
                  href="#contact"
                  className="block text-center font-sans text-[11px] tracking-widest uppercase bg-gold-brand text-ink px-8 py-4 hover:bg-[#d4b960] transition-colors"
                >
                  Đặt Gói 2
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-28 px-6 bg-cream">
          <div className="max-w-3xl mx-auto space-y-8">
            <h2 className="font-serif text-3xl md:text-[42px] text-ink text-center">
              Những điều ba mẹ thường trăn trở
            </h2>

            <Accordion type="single" collapsible className="space-y-4">
              <AccordionItem value="item-1" className="border border-[rgba(201,168,76,0.3)] bg-cream px-6">
                <AccordionTrigger className="font-serif text-[17px] text-ink text-left hover:no-underline py-6">
                  Cuốn sách này được viết dựa trên cơ sở nào?
                </AccordionTrigger>
                <AccordionContent className="text-[14px] leading-[1.7] text-body-text pb-6">
                  Bản Sắc của con được phân tích dựa trên Tâm lý học chiều sâu (Depth Psychology) và 
                  các Nguyên mẫu tâm lý (Archetypes) khi con vừa chào đời. Đây là công cụ khoa học để 
                  thấu hiểu tính cách, hoàn toàn không mang tính chất tâm linh, hù dọa hay bói toán định mệnh.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2" className="border border-[rgba(201,168,76,0.3)] bg-cream px-6">
                <AccordionTrigger className="font-serif text-[17px] text-ink text-left hover:no-underline py-6">
                  Nếu ba mẹ không nhớ chính xác giờ sinh của con thì sao?
                </AccordionTrigger>
                <AccordionContent className="text-[14px] leading-[1.7] text-body-text pb-6">
                  Cuốn sách vẫn khắc họa được các tính cách bẩm sinh cốt lõi của con rõ ràng. 
                  Nếu ba mẹ nhớ được khoảng thời gian (sáng/trưa/chiều), độ chính xác vẫn sẽ rất cao 
                  để Kenji phác họa chân dung con.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3" className="border border-[rgba(201,168,76,0.3)] bg-cream px-6">
                <AccordionTrigger className="font-serif text-[17px] text-ink text-left hover:no-underline py-6">
                  Cuốn Ebook này có giá trị sử dụng trong bao lâu?
                </AccordionTrigger>
                <AccordionContent className="text-[14px] leading-[1.7] text-body-text pb-6">
                  Đây là chiếc la bàn cho suốt 6 năm đầu đời của con. Ba mẹ không chỉ đọc một lần, 
                  mà có thể mở ra xem lại mỗi khi con bước sang một giai đoạn phát triển mới, 
                  hay bất cứ khi nào thấy bối rối trên hành trình nuôi con.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </section>

        {/* New Section: Hướng dẫn đọc & Ghi nhật ký */}
        <section className="py-28 px-6 bg-[#f2ead8]">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center space-y-4">
              <h2 className="font-serif text-3xl md:text-[42px] text-ink">
                Hướng dẫn đọc & Ghi nhật ký đồng hành
              </h2>
              <p className="font-serif text-[18px] text-gold-brand uppercase tracking-wider">
                CÁCH LẬT MỞ "BẢN SẮC" & LƯU GIỮ KỶ VẬT CÙNG CON
              </p>
            </div>

            <div className="space-y-6 text-[15px] leading-[1.7] text-body-text">
              <p>
                Cuốn sách trên tay ba mẹ không phải là một tài liệu đọc một lần rồi cất đi. 
                Nó là chiếc la bàn đi cùng sự trưởng thành của con. Để cảm nhận trọn vẹn kiệt tác này, 
                Kenji gợi ý ba mẹ một vài "nhịp nghỉ" sau:
              </p>

              <div className="space-y-6 pl-6 border-l-4 border-gold-brand">
                <div>
                  <h3 className="font-serif text-[18px] text-ink mb-2">
                    Đọc trong sự tĩnh lặng
                  </h3>
                  <p>
                    Đừng vội vã lướt qua các trang sách giữa những giờ làm việc căng thẳng. 
                    Hãy pha một tách trà, ngồi xuống khi con đã ngủ say, và đọc với một tâm trí cởi mở, không phán xét.
                  </p>
                </div>

                <div>
                  <h3 className="font-serif text-[18px] text-ink mb-2">
                    Đối soát thay vì kỳ vọng
                  </h3>
                  <p>
                    Đừng tìm kiếm xem tương lai con sẽ thành ông nọ bà kia. Hãy đối chiếu những dòng chữ này 
                    với những cái nhíu mày, những lần con bướng bỉnh hay những cái ôm con vừa trao sáng nay. 
                    Ba mẹ sẽ thấy sự thấu cảm nảy mầm.
                  </p>
                </div>

                <div>
                  <h3 className="font-serif text-[18px] text-ink mb-2">
                    Viết "Nhật ký đồng hành"
                  </h3>
                  <p>
                    Kenji khuyến khích ba mẹ chuẩn bị một cuốn sổ tay nhỏ (hoặc ứng dụng ghi chú trên điện thoại). 
                    Bất cứ khi nào ba mẹ áp dụng thành công một góc nhìn từ sách, hay khi con thốt ra một câu nói 
                    ngô nghê mang đậm "bản sắc" của mình, hãy ghi lại. Dòng thời gian sẽ trôi đi, nhưng những ghi chép 
                    lặt vặt ấy chính là mảnh ghép chân thực nhất trong kiệt tác cuộc đời con.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-28 px-6 text-center bg-cream">
          <div className="max-w-3xl mx-auto space-y-8">
            <h2 className="font-serif text-3xl md:text-[48px] leading-[1.2] text-ink">
              Con chỉ có một lần đi qua tuổi thơ từ{" "}
              <span className="italic text-gold-brand">0 đến 6 tuổi.</span>
            </h2>
            <p className="text-[16px] leading-[1.7] text-body-text">
              Ấn phẩm này không dùng để thay đổi con. Nó giúp ba mẹ thực sự{" "}
              <strong className="text-gold-brand">NHÌN THẤY</strong> con. 
              Hãy để chúng ta bắt đầu lật mở trang sách đầu tiên.
            </p>
            <a
              href="#contact"
              className="inline-block font-sans text-[12px] tracking-widest uppercase bg-gold-brand text-ink px-12 py-5 hover:bg-[#d4b960] transition-colors shadow-[0_8px_30px_rgba(224,195,115,0.3)]"
            >
              Bắt đầu hành trình
            </a>
          </div>
        </section>

        {/* Footer with Terms Accordion */}
        <footer className="border-t border-[rgba(201,168,76,0.2)] bg-cream py-12 px-6">
          <div className="max-w-7xl mx-auto space-y-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <Image
                src="/essence-wordmark-full-vn-light.svg"
                alt="Kenji Phạm · Essence Coaching · Sài Gòn"
                width={280}
                height={80}
                className="h-auto w-auto max-w-[280px]"
              />
              <div className="font-sans text-[12px] text-gold-deep text-center md:text-right leading-relaxed">
                Sứ mệnh: Không dự đoán tương lai · Không phán định mệnh ·<br/>
                Chỉ mang đến sự thấu cảm và tĩnh lặng.
              </div>
            </div>

            <div className="border-t border-[rgba(201,168,76,0.2)] pt-8">
              <Accordion type="single" collapsible className="max-w-4xl mx-auto">
                <AccordionItem value="terms" className="border-none">
                  <AccordionTrigger className="font-sans text-[11px] text-gold-deep hover:text-gold hover:no-underline">
                    Điều khoản Dịch vụ & Chính sách Bảo mật
                  </AccordionTrigger>
                  <AccordionContent className="text-[12px] leading-[1.7] text-body-text space-y-4 pt-4">
                    <div>
                      <h4 className="font-semibold text-ink mb-2">1. Chính sách Bảo mật Thông tin:</h4>
                      <p>
                        Kenji cam kết bảo mật tuyệt đối mọi thông tin cá nhân của ba mẹ và bé 
                        (bao gồm ngày giờ sinh, hình ảnh, câu chuyện gia đình). Dữ liệu chỉ được sử dụng 
                        duy nhất cho mục đích phân tích thiết kế báo cáo. Tuyệt đối không chia sẻ cho bên thứ ba 
                        hoặc dùng làm tư liệu truyền thông nếu chưa có sự đồng ý bằng văn bản từ ba mẹ.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-ink mb-2">2. Điều khoản Giao nhận & Hoàn phí:</h4>
                      <p>
                        Đây là sản phẩm dịch vụ nội dung số (File PDF) được cá nhân hóa và phân tích riêng cho từng người. 
                        Do tính chất đặc thù của sản phẩm, Essence Coaching không áp dụng chính sách hoàn tiền sau khi 
                        đơn hàng đã được xác nhận thanh toán và tiến hành phân tích. Thời gian hoàn thiện Ebook là từ 
                        3 - 5 ngày làm việc. Trong trường hợp có lượng đăng ký vượt quá giới hạn tháng, Kenji sẽ thông báo 
                        trước thời gian gửi file để ba mẹ an tâm chờ đợi.
                      </p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>

            <div className="text-center text-[11px] text-gold-deep pt-4">
              © {new Date().getFullYear()} Essence Coaching. All rights reserved.
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}