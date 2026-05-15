import { SEO } from "@/components/SEO";
import { Sparkles, Heart, Compass, Star, FileText, MessageCircle, Send, BookOpen } from "lucide-react";
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

        {/* Hero Section */}
        <section className="py-20 px-6 text-center bg-cream">
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="font-sans text-[11px] tracking-widest uppercase text-gold-brand">
              MINI EBOOK BẢN SẮC · DÀNH CHO BÉ 0–6 TUỔI
            </div>
            <h1 className="font-serif text-4xl md:text-[56px] leading-tight text-ink">
              Con không đến thế giới này để trở thành một ai đó khác.{" "}
              <span className="italic text-gold">Con đến để là chính mình.</span>
            </h1>
            <p className="text-[15px] leading-relaxed max-w-2xl mx-auto">
              Đừng cố gắng "sửa chữa" con, khi điều con cần nhất là được thấu hiểu. 
              BẢN SẮC là ấn phẩm Mini Ebook được viết riêng cho từng bé, giúp bạn hiểu 
              tính cách bẩm sinh, cảm xúc và tài năng bẩm sinh của con. Nó không dự báo 
              số phận, chỉ là một chiếc la bàn tĩnh lặng để ba mẹ tự tin trên hành trình nuôi dưỡng.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <a
                href="#contact"
                className="font-sans text-[11px] tracking-widest uppercase bg-gold text-ink px-8 py-4 hover:bg-[#b89640] transition-colors"
              >
                Đặt viết sách cho con (Gói 2.000.000đ)
              </a>
              <a
                href="#contact"
                className="font-sans text-[11px] tracking-widest uppercase border border-ink text-ink px-8 py-4 hover:bg-ink hover:text-cream transition-colors"
              >
                Đồng hành cùng Kenji (Gói 3.500.000đ)
              </a>
            </div>
          </div>
        </section>

        {/* Pain Points Section */}
        <section className="py-20 px-6 bg-cream">
          <div className="max-w-5xl mx-auto space-y-8">
            <h2 className="font-serif text-3xl md:text-[36px] text-center text-ink">
              Tại sao lại là một cuốn sách của riêng bạn?
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[1px] bg-[rgba(201,168,76,0.18)]">
              <div className="bg-cream p-6 space-y-3">
                <p className="font-serif italic text-gold text-base">
                  "Sao con cứ quấy khóc mà mình không hiểu lý do?"
                </p>
              </div>
              <div className="bg-cream p-6 space-y-3">
                <p className="font-serif italic text-gold text-base">
                  "Nuôi theo đúng sách dạy, sao con vẫn không như kỳ vọng?"
                </p>
              </div>
              <div className="bg-cream p-6 space-y-3">
                <p className="font-serif italic text-gold text-base">
                  "Làm sao để biết con có năng khiếu gì từ sớm?"
                </p>
              </div>
              <div className="bg-cream p-6 space-y-3">
                <p className="font-serif italic text-gold text-base">
                  "Con bướng bỉnh — là con đang hư hay đó là cá tính?"
                </p>
              </div>
            </div>

            <div className="max-w-3xl mx-auto pt-6">
              <p className="text-[15px] leading-relaxed text-center">
                Trong thế giới đầy rẫy những lời khuyên "phải làm thế này, phải làm thế kia", 
                ba mẹ thường tự trách mình khi con không giống "con nhà người ta". Nhưng kỳ thực, 
                không có cuốn sách giáo khoa nào viết đúng về đứa trẻ của bạn cả.
              </p>
              <p className="text-[15px] leading-relaxed text-center mt-4 font-semibold">
                Trừ cuốn sách này.
              </p>
              <p className="text-[15px] leading-relaxed text-center mt-4">
                Bản Sắc không dạy bạn cách làm ba mẹ, nó giúp bạn học cách đọc cuốn sách quý giá 
                nhất đời mình: Đó chính là con bạn. Khi bạn hiểu được ngôn ngữ của con, mọi áp lực 
                sẽ tan biến, chỉ còn lại sự kết nối tĩnh lặng và đầy yêu thương.
              </p>
            </div>
          </div>
        </section>

        {/* Kenji Bio */}
        <section className="py-20 px-6 bg-cream border-t border-[rgba(201,168,76,0.3)]">
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="w-[68px] h-[68px] flex-shrink-0">
                <Image
                  src="/essence-monogram-light.svg"
                  alt="Essence Coaching"
                  width={68}
                  height={68}
                  className="w-full h-full"
                />
              </div>
              <div className="space-y-3 flex-1">
                <div className="space-y-1">
                  <h2 className="font-serif text-[24px] text-ink">
                    Tôi đọc "bản sắc" của con bạn.
                  </h2>
                  <div className="font-sans text-[10px] tracking-widest uppercase text-gold">
                    KENJI PHẠM · ESSENCE COACH · SÀI GÒN
                  </div>
                </div>
                <p className="text-[13px] leading-relaxed">
                  Chào bạn, tôi là Kenji Phạm — Essence Coach. Suốt 8 năm làm việc cùng người lớn, 
                  tôi nhận ra bao tổn thương của họ đều bắt nguồn từ việc bị "uốn nắn" sai cách thuở nhỏ. 
                  Bản Sắc ra đời để con bạn không phải đi lại vết xe đổ ấy. Mỗi Ebook không phải là sản phẩm 
                  copy-paste từ phần mềm. Nó được tôi tĩnh lặng phân tích, chắt lọc để viết cho riêng 
                  tâm hồn từng bé.
                </p>
              </div>
            </div>

            {/* Emphasis Box */}
            <div className="border-l-2 border-gold-brand bg-[#f2ead8] p-6 mt-6">
              <p className="text-[13px] leading-relaxed italic">
                Vì mỗi ấn phẩm đòi hỏi sự hiện diện trọn vẹn và tính cá nhân hóa 100%, tôi chỉ nhận 
                phân tích và viết <span className="font-semibold text-gold-brand">tối đa 20 bản / tháng</span> để 
                giữ gìn sự sâu sắc nhất trong từng câu chữ.
              </p>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-20 px-6 bg-[#f2ead8]">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="space-y-6">
              <div className="border-l-2 border-gold bg-cream p-6 space-y-3">
                <div className="font-sans text-[10px] tracking-widest uppercase text-gold-deep">
                  MẸ BÉ MINH KHUÊ
                </div>
                <p className="font-serif text-[15px] leading-relaxed text-body-text italic">
                  "Đọc cuốn sách nhỏ này, mình mới thấu hiểu sự 'bướng bỉnh' của con thực chất là 
                  khao khát sự hoàn hảo và an toàn. Mình nhẹ nhõm hẳn vì học được cách 'chứa đựng' 
                  con thay vì cố sửa con..."
                </p>
              </div>

              <div className="border-l-2 border-gold bg-cream p-6 space-y-3">
                <div className="font-sans text-[10px] tracking-widest uppercase text-gold-deep">
                  BA MẸ BÉ WIN
                </div>
                <p className="font-serif text-[15px] leading-relaxed text-body-text italic">
                  "Bản Sắc không tiên đoán tương lai, nhưng trao cho vợ chồng mình một điểm tựa vững chắc 
                  để quan sát sự độc bản của con lớn lên mỗi ngày. Một món quà quá đẹp cho tuổi thơ của con."
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 5 Chapters - Dark Section */}
        <section className="py-20 px-6 bg-dark-section">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="space-y-2">
              <h2 className="font-serif text-3xl md:text-[36px] text-cream-light">
                5 Chương Hành Trình — Phác họa chân dung tâm hồn con
              </h2>
              <p className="text-[14px] text-cream-muted">
                Bản Ebook dài khoảng 30 trang, được thiết kế sang trọng, chia làm 5 chương viết riêng cho con:
              </p>
            </div>

            <div className="space-y-0">
              {[
                {
                  num: "01",
                  title: "Bản thiết kế nguyên bản (Hạt mầm)",
                  desc: "Tìm hiểu cách con đã chọn để bước vào thế giới. Chương này giúp ba mẹ nhận diện \"mã code\" riêng biệt mà con mang theo, để yêu thương con mà không cần ép uổng.",
                },
                {
                  num: "02",
                  title: "0–2 tuổi — Thế giới qua lăng kính của con",
                  desc: "Khi con chưa biết nói, con dùng \"ăng-ten\" tâm hồn để cảm nhận ba mẹ. Chương này giúp bạn đọc được những thông điệp không lời từ con và lý giải những tiếng khóc bàng bạc.",
                },
                {
                  num: "03",
                  title: "2–4 tuổi — Ý chí độc lập của con",
                  desc: "Chứng kiến khoảnh khắc con bắt đầu tự vẽ nên biên giới của riêng mình. Đây là lúc \"ngôi sao\" bên trong con bừng sáng, ba mẹ sẽ học cách thiết lập ranh giới mà không làm gãy đổ cá tính của con.",
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
                  className="border-b border-[rgba(201,168,76,0.12)] py-6 grid grid-cols-[80px_1fr] gap-6"
                >
                  <div className="font-serif text-[28px] text-[rgba(201,168,76,0.25)]">
                    {chapter.num}
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-serif text-[17px] text-[#e0c373]">
                      {chapter.title}
                    </h3>
                    <p className="text-[13px] text-cream-muted leading-relaxed">
                      {chapter.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-6 border-t border-[rgba(201,168,76,0.12)]">
              <p className="text-[13px] text-cream-muted italic">
                <span className="text-gold-brand font-semibold">Đặc biệt:</span> Xuyên suốt cuốn sách 
                sẽ có không gian "Ghi chép của Ba Mẹ" để bạn tự tay viết tiếp những quan sát của mình. 
                Biến ấn phẩm này thành kỷ vật quý giá nhất khi con trưởng thành.
              </p>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-20 px-6 bg-cream">
          <div className="max-w-4xl mx-auto space-y-8">
            <h2 className="font-serif text-3xl md:text-[36px] text-ink text-center">
              Để cuốn sách được mở ra
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-4">
                <div className="w-12 h-12 bg-gold-brand flex items-center justify-center">
                  <FileText className="w-6 h-6 text-ink" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-sans text-[11px] tracking-widest uppercase text-gold">
                    BƯỚC 1: GỬI THÔNG TIN
                  </h3>
                  <p className="text-[13px] leading-relaxed">
                    Ba mẹ cung cấp ngày, giờ (dương lịch), nơi sinh của bé cùng một vài bối cảnh 
                    gia đình (không bắt buộc).
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="w-12 h-12 bg-gold-brand flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-ink" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-sans text-[11px] tracking-widest uppercase text-gold">
                    BƯỚC 2: PHÂN TÍCH
                  </h3>
                  <p className="text-[13px] leading-relaxed">
                    Kenji dành thời gian đi sâu vào dữ liệu, phác họa và viết từng chương của cuốn sách.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="w-12 h-12 bg-gold-brand flex items-center justify-center">
                  <Send className="w-6 h-6 text-ink" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-sans text-[11px] tracking-widest uppercase text-gold">
                    BƯỚC 3: TRAO GỬI EBOOK CỦA CON
                  </h3>
                  <p className="text-[13px] leading-relaxed">
                    Sau 3-5 ngày làm việc, cuốn sách điện tử (file PDF) thiết kế sang trọng sẽ được 
                    gửi trực tiếp qua Email và Zalo của ba mẹ. Định dạng này giúp ba mẹ dễ dàng lưu trữ, 
                    mở ra xem trên điện thoại hoặc iPad bất cứ lúc nào, ở bất cứ đâu.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section className="py-20 px-6 bg-cream border-t border-[rgba(201,168,76,0.3)]" id="contact">
          <div className="max-w-5xl mx-auto space-y-8">
            <div className="text-center space-y-2">
              <h2 className="font-serif text-3xl md:text-[34px] text-ink">
                Chọn món quà bạn muốn dành tặng con
              </h2>
              <p className="font-serif italic text-[15px] text-gold">
                Ưu đãi ra mắt dành riêng cho tháng này.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Gói 1 */}
              <div className="border border-gold p-8 space-y-6">
                <div className="space-y-2">
                  <div className="font-sans text-[11px] tracking-widest uppercase text-gold">
                    GÓI 1: MÓN QUÀ THẤU HIỂU
                  </div>
                  <div className="font-serif text-[40px] text-ink">
                    2.000.000đ
                  </div>
                  <div className="font-sans text-[11px] text-gold">
                    Giá chính thức 3.000.000đ
                  </div>
                </div>

                <ul className="space-y-3 text-[13px]">
                  <li className="flex items-start gap-2">
                    <span className="text-gold mt-1">•</span>
                    <span>Nhận ấn phẩm Mini Ebook (5 Chương)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gold mt-1">•</span>
                    <span>Cá nhân hóa 100% cho từng bé</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gold mt-1">•</span>
                    <span>Ba mẹ tự chiêm nghiệm và lưu giữ như một kỷ vật</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gold mt-1">•</span>
                    <span>Giao trong 3-5 ngày</span>
                  </li>
                </ul>

                <a
                  href="#contact"
                  className="block text-center font-sans text-[11px] tracking-widest uppercase bg-ink text-cream-light px-8 py-4 hover:bg-body-text transition-colors"
                >
                  Đặt Gói 1
                </a>
              </div>

              {/* Gói 2 */}
              <div className="border-[1.5px] border-gold p-8 space-y-6 relative">
                <div className="absolute -top-3 left-8 bg-gold px-4 py-1 font-sans text-[10px] tracking-widest uppercase text-ink">
                  Được chọn nhiều nhất
                </div>
                <div className="space-y-2">
                  <div className="font-sans text-[11px] tracking-widest uppercase text-gold">
                    GÓI 2: TRÒ CHUYỆN CÙNG KENJI
                  </div>
                  <div className="font-serif text-[40px] text-ink">
                    3.500.000đ
                  </div>
                  <div className="font-sans text-[11px] text-gold">
                    Giá chính thức: 5.500.000đ
                  </div>
                </div>

                <ul className="space-y-3 text-[13px]">
                  <li className="flex items-start gap-2">
                    <span className="text-gold mt-1">•</span>
                    <span>Bao gồm tất cả quyền lợi của Gói 1</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gold mt-1">•</span>
                    <span className="font-semibold">
                      30 phút thảo luận 1-1 trực tiếp cùng Kenji qua Zoom/Voice
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gold mt-1">•</span>
                    <span>Kenji sẽ trò chuyện trực tiếp cùng ba mẹ, đi sâu vào những điểm tính cách nổi bật nhất của con</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gold mt-1">•</span>
                    <span>Gợi ý các phương pháp tương tác thực tế áp dụng ngay vào sinh hoạt hàng ngày</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gold mt-1">•</span>
                    <span>Gỡ rối chuyên sâu các vấn đề thực tế gia đình đang gặp</span>
                  </li>
                </ul>

                <a
                  href="#contact"
                  className="block text-center font-sans text-[11px] tracking-widest uppercase bg-gold text-ink px-8 py-4 hover:bg-[#b89640] transition-colors"
                >
                  Đặt Gói 2
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-20 px-6 bg-[#f2ead8]">
          <div className="max-w-3xl mx-auto space-y-6">
            <h2 className="font-serif text-3xl text-ink text-center mb-8">
              Những điều ba mẹ thường trăn trở
            </h2>

            <div className="space-y-4">
              {[
                {
                  q: "Cuốn sách này được viết dựa trên cơ sở nào?",
                  a: "Bản Sắc của con được phân tích dựa trên Tâm lý học chiều sâu (Depth Psychology) và các Nguyên mẫu tâm lý (Archetypes) khi con vừa chào đời. Đây là công cụ khoa học để thấu hiểu tính cách, hoàn toàn không mang tính chất tâm linh, hù dọa hay bói toán định mệnh.",
                },
                {
                  q: "Nếu ba mẹ không nhớ chính xác giờ sinh của con thì sao?",
                  a: "Cuốn sách vẫn khắc họa được các tính cách bẩm sinh cốt lõi của con rõ ràng. Nếu ba mẹ nhớ được khoảng thời gian (sáng/trưa/chiều), độ chính xác vẫn sẽ rất cao để Kenji phác họa chân dung con.",
                },
                {
                  q: "Cuốn Ebook này có giá trị sử dụng trong bao lâu?",
                  a: "Đây là chiếc la bàn cho suốt 6 năm đầu đời của con. Ba mẹ không chỉ đọc một lần, mà có thể mở ra xem lại mỗi khi con bước sang một giai đoạn phát triển mới, hay bất cứ khi nào thấy bối rối trên hành trình nuôi con.",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="border border-[rgba(201,168,76,0.3)] bg-cream p-6 space-y-3"
                >
                  <h3 className="font-serif text-[17px] text-ink">
                    {item.q}
                  </h3>
                  <p className="text-[13px] leading-relaxed">{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-20 px-6 text-center bg-cream">
          <div className="max-w-3xl mx-auto space-y-6">
            <h2 className="font-serif text-3xl md:text-[40px] text-ink">
              Con chỉ có một lần đi qua tuổi thơ từ{" "}
              <span className="italic text-gold-brand">0 đến 6 tuổi.</span>
            </h2>
            <p className="text-[15px] leading-relaxed">
              Ấn phẩm này không dùng để thay đổi con. Nó giúp ba mẹ thực sự NHÌN THẤY con. 
              Hãy để chúng ta bắt đầu lật mở trang sách đầu tiên.
            </p>
            <div className="pt-4">
              <a
                href="#contact"
                className="inline-block font-sans text-[12px] tracking-widest uppercase bg-gold text-ink px-12 py-5 hover:bg-[#b89640] transition-colors"
              >
                Bắt đầu hành trình
              </a>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-[rgba(201,168,76,0.2)] bg-cream py-8 px-6">
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Logo & Tagline */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <Image
                src="/essence-wordmark-full-vn-light.svg"
                alt="Kenji Phạm · Essence Coaching · Sài Gòn"
                width={280}
                height={80}
                className="h-auto w-auto max-w-[280px]"
              />
              <div className="font-sans text-[11px] text-gold-deep text-center md:text-right">
                Không dự đoán tương lai · Không phán định mệnh · <br className="hidden md:block" />
                Chỉ mang đến sự thấu cảm và tĩnh lặng.
              </div>
            </div>

            {/* Terms & Privacy Accordion */}
            <div className="border-t border-[rgba(201,168,76,0.2)] pt-6">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="terms" className="border-none">
                  <AccordionTrigger className="text-[11px] text-gold-deep hover:text-gold hover:no-underline py-3">
                    Điều khoản Dịch vụ & Chính sách Bảo mật
                  </AccordionTrigger>
                  <AccordionContent className="text-[11px] text-body-text leading-relaxed space-y-4 pt-2">
                    <div>
                      <h4 className="font-semibold mb-2">1. Chính sách Bảo mật Thông tin:</h4>
                      <p>
                        Kenji cam kết bảo mật tuyệt đối mọi thông tin cá nhân của ba mẹ và bé 
                        (bao gồm ngày giờ sinh, hình ảnh, câu chuyện gia đình). Dữ liệu chỉ được 
                        sử dụng duy nhất cho mục đích phân tích thiết kế báo cáo. Tuyệt đối không 
                        chia sẻ cho bên thứ ba hoặc dùng làm tư liệu truyền thông nếu chưa có sự 
                        đồng ý bằng văn bản từ ba mẹ.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">2. Điều khoản Giao nhận & Hoàn phí:</h4>
                      <p>
                        Đây là sản phẩm dịch vụ nội dung số (File PDF) được cá nhân hóa và phân tích 
                        riêng cho từng người. Do tính chất đặc thù của sản phẩm, Essence Coaching không 
                        áp dụng chính sách hoàn tiền sau khi đơn hàng đã được xác nhận thanh toán và 
                        tiến hành phân tích. Thời gian hoàn thiện Ebook là từ 3 - 5 ngày làm việc. 
                        Trong trường hợp có lượng đăng ký vượt quá giới hạn tháng, Kenji sẽ thông báo 
                        trước thời gian gửi file để ba mẹ an tâm chờ đợi.
                      </p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>

            {/* Copyright */}
            <div className="text-center text-[10px] text-gold-deep pt-4 border-t border-[rgba(201,168,76,0.1)]">
              © 2026 Essence Coaching. All rights reserved.
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}