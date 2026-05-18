import { SEO } from "@/components/SEO";
import { Heart, AlertCircle, Lightbulb, Users, FileText, MessageCircle, Send, BookOpen } from "lucide-react";
import Image from "next/image";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useEffect, useState, useRef } from "react";

export default function Home() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isNavSticky, setIsNavSticky] = useState(false);
  const monogramRef = useRef<HTMLDivElement>(null);

  // Custom smooth scroll with easeInOutQuart
  const smoothScrollTo = (targetPosition: number, duration: number = 1400) => {
    const startPosition = window.scrollY;
    const distance = targetPosition - startPosition;
    let startTime: number | null = null;

    // easeInOutQuart: slow start -> smooth middle -> slow end
    const easeInOutQuart = (t: number): number => {
      return t < 0.5 
        ? 8 * t * t * t * t 
        : 1 - 8 * (--t) * t * t * t;
    };

    const animation = (currentTime: number) => {
      if (startTime === null) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const progress = Math.min(timeElapsed / duration, 1);
      const ease = easeInOutQuart(progress);
      
      window.scrollTo(0, startPosition + distance * ease);
      
      if (progress < 1) {
        requestAnimationFrame(animation);
      }
    };

    requestAnimationFrame(animation);
  };

  // Reading progress bar
  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight - windowHeight;
      const scrolled = window.scrollY;
      const progress = (scrolled / documentHeight) * 100;
      setScrollProgress(progress);
      setIsNavSticky(scrolled > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Smooth scroll
  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const targetPosition = element.offsetTop - 80; // offset for sticky nav
      smoothScrollTo(targetPosition, 1400); // 1.4s zen scroll
    }
  };

  // Parallax effect for monogram
  useEffect(() => {
    const handleParallax = () => {
      if (monogramRef.current) {
        if (window.innerWidth >= 768) {
          const scrolled = window.scrollY;
          const offsetTop = monogramRef.current.offsetTop;
          const diff = scrolled - offsetTop + window.innerHeight / 2;
          const parallaxValue = diff * 0.05;
          monogramRef.current.style.transform = `translateY(${parallaxValue}px)`;
        } else {
          monogramRef.current.style.transform = `translateY(0px)`;
        }
      }
    };

    window.addEventListener("scroll", handleParallax);
    // Initialize
    handleParallax();
    
    return () => window.removeEventListener("scroll", handleParallax);
  }, []);

  return (
    <>
      <SEO
        title="Bản Sắc · Cuốn sách tâm hồn duy nhất của bé · Essence Coaching"
        description="Mỗi đứa trẻ mang một bản thiết kế riêng. Ấn phẩm Mini Ebook được viết riêng để giải mã tính cách bẩm sinh, cảm xúc và tài năng bẩm sinh cho bé 0-6 tuổi."
      />

      <style jsx global>{`
        .shimmer-text {
          background: linear-gradient(
            120deg,
            #1a1510 0%,
            #1a1510 40%,
            #c9a84c 50%,
            #1a1510 60%,
            #1a1510 100%
          );
          background-size: 200% auto;
          color: transparent;
          -webkit-background-clip: text;
          background-clip: text;
          animation: shimmer 5s linear infinite;
        }

        @keyframes shimmer {
          0% {
            background-position: -200% center;
          }
          100% {
            background-position: 200% center;
          }
        }

        .hover-lift {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .hover-lift:hover {
          transform: translateY(-6px) scale(1.01);
          box-shadow: 0 20px 40px rgba(26, 21, 16, 0.12);
        }

        .sticky-nav {
          transition: all 0.3s ease;
        }

        .sticky-nav.scrolled {
          backdrop-filter: blur(12px);
          background-color: rgba(250, 248, 243, 0.85);
          box-shadow: 0 2px 20px rgba(26, 21, 16, 0.06);
        }

        html {
          scroll-padding-top: 80px;
        }
      `}</style>

      {/* Reading Progress Bar */}
      <div
        className="fixed top-0 left-0 h-[2px] bg-gold z-50 transition-all duration-300"
        style={{ width: `${scrollProgress}%` }}
      />

      <div className="min-h-screen bg-cream text-body-text">
        {/* Navigation - Sticky with Backdrop Blur */}
        <nav
          className={`sticky-nav sticky top-0 z-40 border-b border-[rgba(201,168,76,0.3)] ${
            isNavSticky ? "scrolled" : "bg-cream"
          }`}
        >
          <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
            <Image
              src="/essence-wordmark-inline-light.svg"
              alt="Kenji Phạm · Essence Coaching"
              width={380}
              height={85}
              className="h-auto w-auto max-w-[200px] md:max-w-[380px]"
            />
            <a
              href="#pricing"
              onClick={(e) => scrollToSection(e, "pricing")}
              className="font-sans text-[10px] tracking-widest uppercase border border-gold-brand px-[14px] py-[5px] text-ink hover:bg-gold-brand hover:text-ink transition-all duration-300 hover:shadow-md"
            >
              Ưu đãi ra mắt
            </a>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="py-14 px-6 text-center bg-cream fade-in-section">
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="font-sans text-[11px] tracking-widest uppercase text-gold-deep">
              MINI EBOOK BẢN SẮC · DÀNH CHO BÉ 0–6 TUỔI
            </div>
            <h1 className="font-serif text-4xl md:text-[56px] leading-[1.2] text-ink max-w-3xl mx-auto font-semibold">
              <span className="shimmer-text">
                Con không đến thế giới này để trở thành một ai đó khác.
              </span>{" "}
              Con đến để là chính mình.
            </h1>
            <p className="text-[15px] leading-[1.7] max-w-3xl mx-auto">
              Đừng cố gắng "sửa chữa" con, khi điều con cần nhất là được thấu
              hiểu. <span className="font-semibold">BẢN SẮC</span> là ấn phẩm Mini Ebook được viết riêng cho từng bé,
              giúp bạn hiểu tính cách bẩm sinh, cảm xúc và tài năng bẩm sinh của
              con. Nó không dự báo số phận, chỉ là một chiếc la bàn tĩnh lặng để
              ba mẹ tự tin trên hành trình nuôi dưỡng.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <a
                href="#pricing"
                onClick={(e) => scrollToSection(e, "pricing")}
                className="font-sans text-[11px] tracking-widest uppercase bg-gold-brand text-ink px-8 py-4 hover:bg-gold transition-all duration-300 hover:shadow-lg hover:scale-105"
              >
                MÓN QUÀ THẤU HIỂU
              </a>
              <a
                href="#pricing"
                onClick={(e) => scrollToSection(e, "pricing")}
                className="font-sans text-[11px] tracking-widest uppercase border border-ink text-ink px-8 py-4 hover:bg-ink hover:text-cream transition-all duration-300 hover:shadow-lg hover:scale-105"
              >
                TRÒ CHUYỆN CÙNG KENJI
              </a>
            </div>
          </div>
        </section>

        {/* Ebook Cover Image */}
        <section className="py-16 px-6 bg-[#f2ead8] fade-in-section">
          <div className="max-w-5xl mx-auto text-center">
            <div className="max-w-2xl mx-auto">
              <Image
                src="/b1.png"
                alt="Bản Sắc - Mini Ebook Cover"
                width={800}
                height={1066}
                className="w-full h-auto shadow-2xl"
                priority
              />
            </div>
          </div>
        </section>

        {/* Pain Points Grid */}
        <section className="py-28 px-6 bg-[#f2ead8]">
          <div className="max-w-6xl mx-auto">
            <h2 className="font-serif text-3xl md:text-[42px] text-center text-ink mb-16 fade-in-section font-semibold">
              Tại sao lại là một cuốn sách của riêng bạn?
            </h2>
            <div className="grid md:grid-cols-2 gap-6 mb-12">
              <div className="bg-cream p-8 hover-lift fade-in-section shadow-sm">
                <Heart className="w-8 h-8 text-gold mb-4" />
                <p className="font-serif text-[17px] italic text-gold-deep mb-3 font-medium">
                  "Sao con cứ quấy khóc mà mình không hiểu lý do?"
                </p>
                <p className="text-[14px] leading-relaxed">
                  Mỗi bé có "ăng-ten" cảm xúc khác nhau. Có con cần được ôm
                  thật chặt, có con chỉ cần ba mẹ ở gần là đủ. Cuốn sách này giúp
                  bạn đọc được tín hiệu riêng của con.
                </p>
              </div>

              <div className="bg-cream p-8 hover-lift fade-in-section delay-100 shadow-sm">
                <AlertCircle className="w-8 h-8 text-gold mb-4" />
                <p className="font-serif text-[17px] italic text-gold-deep mb-3 font-medium">
                  "Nuôi theo đúng sách dạy, sao con vẫn không như kỳ vọng?"
                </p>
                <p className="text-[14px] leading-relaxed">
                  Vì không có cuốn sách giáo khoa nào viết cho đứa trẻ này. Bản
                  Sắc phác họa chân dung tâm hồn riêng của con, để ba mẹ thấy con
                  đang cần gì.
                </p>
              </div>

              <div className="bg-cream p-8 hover-lift fade-in-section delay-200 shadow-sm">
                <Lightbulb className="w-8 h-8 text-gold mb-4" />
                <p className="font-serif text-[17px] italic text-gold-deep mb-3 font-medium">
                  "Làm sao để biết con có năng khiếu gì từ sớm?"
                </p>
                <p className="text-[14px] leading-relaxed">
                  Chương 4 giải mã tài năng chớm nở — những gì con có sẵn ngay
                  từ ngày đầu. Không ép, không so sánh, chỉ thấy và nuôi dưỡng.
                </p>
              </div>

              <div className="bg-cream p-8 hover-lift fade-in-section delay-300 shadow-sm">
                <Users className="w-8 h-8 text-gold mb-4" />
                <p className="font-serif text-[17px] italic text-gold-deep mb-3 font-medium">
                  "Con bướng bỉnh — là con đang hư hay đó là cá tính?"
                </p>
                <p className="text-[14px] leading-relaxed">
                  Đa phần là cá tính. Một bản sắc mạnh mẽ đang cố gắng lên tiếng.
                  Biết được điều này, ba mẹ sẽ thấy nhẹ nhõm và chọn cách ứng xử
                  đúng đắn hơn.
                </p>
              </div>
            </div>

            {/* Bridge Text */}
            <div className="mt-16 max-w-3xl mx-auto space-y-4 text-center">
              <p className="text-[15px] leading-relaxed text-body-text italic fade-in-section">
                Trong thế giới đầy rẫy những lời khuyên "phải làm thế này, phải làm thế kia",
              </p>
              <p className="text-[15px] leading-relaxed text-body-text italic fade-in-section delay-50">
                ba mẹ thường tự trách mình khi con không giống "con nhà người ta".
              </p>
              <p className="text-[15px] leading-relaxed text-body-text italic fade-in-section delay-100">
                Nhưng kỳ thực, không có cuốn sách giáo khoa nào viết đúng về đứa trẻ của bạn cả.
              </p>
              <p className="text-[15px] leading-relaxed text-body-text font-medium italic fade-in-section delay-150">
                Trừ cuốn sách này.
              </p>
              <p className="text-[15px] leading-relaxed text-body-text mt-6 italic fade-in-section delay-200">
                Bản Sắc không dạy bạn cách làm ba mẹ, nó giúp bạn học cách đọc cuốn sách quý giá nhất đời mình:
              </p>
              <p className="text-[15px] leading-relaxed text-body-text font-medium italic fade-in-section delay-250">
                Đó chính là con bạn.
              </p>
              <p className="text-[15px] leading-relaxed text-body-text mt-6 italic fade-in-section delay-300">
                Khi bạn hiểu được ngôn ngữ của con, mọi áp lực sẽ tan biến,
              </p>
              <p className="text-[15px] leading-relaxed text-body-text italic fade-in-section delay-350">
                chỉ còn lại sự kết nối tĩnh lặng và đầy yêu thương.
              </p>
            </div>
          </div>
        </section>

        {/* Kenji Bio */}
        <section className="py-28 px-6 bg-cream border-t border-[rgba(201,168,76,0.3)]">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-[42px] leading-tight font-serif text-ink mb-12 text-center font-semibold">
              Tôi gọi tên những hạt mầm tính cách ẩn sâu trong con bạn.
            </h2>
            <div className="flex flex-col md:flex-row gap-8 items-start">
              {/* Kenji Portrait & Monogram */}
              <div className="flex gap-6 items-start">
                <div 
                  ref={monogramRef}
                  className="w-[68px] h-[68px] flex-shrink-0"
                  style={{
                    transition: "transform 0.1s ease-out",
                  }}
                >
                  <Image
                    src="/essence-monogram-light.svg"
                    alt="Essence Coaching"
                    width={68}
                    height={68}
                    className="w-full h-full"
                  />
                </div>
                
                {/* Kenji Photo */}
                <div className="w-[180px] h-[180px] flex-shrink-0 overflow-hidden rounded-full ring-2 ring-gold shadow-xl">
                  <Image
                    src="/klp.jpg"
                    alt="Kenji Phạm - Essence Coach"
                    width={540}
                    height={540}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              <div className="space-y-3 flex-1">
                <div className="space-y-1">
                  <div className="font-serif text-[18px] text-ink font-medium">
                    Kenji Phạm
                  </div>
                  <div className="font-sans text-[10px] tracking-widest uppercase text-gold">
                    ESSENCE COACH · SÀI GÒN
                  </div>
                </div>
                <p className="text-[15px] leading-[1.7]">
                  Chào bạn, tôi là Kenji Phạm — Essence Coach. Suốt 8 năm làm
                  việc cùng người lớn, tôi nhận ra bao tổn thương của họ đều bắt
                  nguồn từ việc bị "uốn nắn" sai cách thuở nhỏ. Bản Sắc ra đời
                  để con bạn không phải đi lại vết xe đổ ấy. Mỗi Ebook không phải
                  là sản phẩm copy-paste từ phần mềm. Nó được tôi tĩnh lặng phân
                  tích, chắt lọc để viết cho riêng tâm hồn từng bé.
                </p>
                <div className="border-l-2 border-gold pl-6 py-4 bg-[#f2ead8]">
                  <p className="text-[14px] leading-relaxed font-medium">
                    Vì mỗi ấn phẩm đòi hỏi sự hiện diện trọn vẹn và tính cá nhân
                    hóa 100%, tôi chỉ nhận phân tích và viết tối đa{" "}
                    <span className="text-gold">20 bản / tháng</span> để giữ gìn
                    sự sâu sắc nhất trong từng câu chữ.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-28 px-6 bg-[#f2ead8] fade-in-section">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="bg-cream border-l-2 border-gold p-8 shadow-sm hover-lift">
              <div className="font-sans text-[10px] tracking-widest uppercase text-gold-deep mb-3">
                Mẹ bé Minh Khuê · Sài Gòn
              </div>
              <p className="font-serif text-[17px] leading-relaxed italic font-medium">
                "Đọc cuốn sách nhỏ này, mình mới thấu hiểu sự 'bướng bỉnh' của
                con thực chất là khao khát sự hoàn hảo và an toàn. Mình nhẹ nhõm
                hẳn vì học được cách 'chứa đựng' con thay vì cố sửa con..."
              </p>
            </div>

            <div className="bg-cream border-l-2 border-gold p-8 shadow-sm hover-lift">
              <div className="font-sans text-[10px] tracking-widest uppercase text-gold-deep mb-3">
                Ba Mẹ bé Win · Sài Gòn
              </div>
              <p className="font-serif text-[17px] leading-relaxed italic font-medium">
                "Bản Sắc không tiên đoán tương lai, nhưng trao cho vợ chồng mình
                một điểm tựa vững chắc để quan sát sự độc bản của con lớn lên mỗi
                ngày. Một món quà quá đẹp cho tuổi thơ của con."
              </p>
            </div>
          </div>
        </section>

        {/* 5 Chapters - Timeline */}
        <section className="py-28 px-6 bg-dark-section">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16 fade-in-section">
              <div className="font-sans text-[10px] tracking-widest uppercase text-gold mb-4">
                NỘI DUNG EBOOK
              </div>
              <h2 className="font-serif text-3xl md:text-[42px] text-cream-light mb-4 font-semibold">
                5 Chương Hành Trình — Phác họa chân dung tâm hồn con
              </h2>
              <p className="text-[14px] text-cream-muted max-w-2xl mx-auto">
                Bản Ebook dài khoảng 30 trang, được thiết kế sang trọng, chia làm
                5 chương viết riêng cho con:
              </p>
            </div>

            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute left-[23px] top-0 bottom-0 w-[1px] bg-[rgba(201,168,76,0.2)] hidden md:block" />

              <div className="space-y-12">
                {[
                  {
                    num: "01",
                    title: "Hạt mầm",
                    desc: 'Tìm hiểu cách con đã chọn để bước vào thế giới. Chương này giúp ba mẹ nhận diện cá tính riêng biệt mà con mang theo, để yêu thương con mà không cần ép uổng.',
                  },
                  {
                    num: "02",
                    title: "0–2 tuổi — Thế giới qua lăng kính của con",
                    desc: 'Trong hai năm đầu đời, con dùng chiếc "ăng-ten" cảm xúc để hít thở bầu không khí của gia đình. Chương này giúp ba mẹ giải mã những cơn quấy khóc tưởng chừng vô lý, để hiểu đằng sau sự khó ở đó.',
                  },
                  {
                    num: "03",
                    title: "2–4 tuổi — Ý chí độc lập của con",
                    desc: 'Chứng kiến khoảnh khắc con bắt đầu tự vẽ nên biên giới của riêng mình. Đây là lúc "ngôi sao" bên trong con bừng sáng, ba mẹ sẽ học cách thiết lập ranh giới mà không làm gãy đổ cá tính của con.',
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
                ].map((chapter, index) => (
                  <div
                    key={index}
                    className={`relative flex gap-6 fade-in-section delay-${index * 50}`}
                  >
                    <div className="flex-shrink-0 w-12 h-12 rounded-full border-2 border-gold bg-dark-section flex items-center justify-center z-10">
                      <span className="font-serif text-[16px] text-gold font-medium">
                        {chapter.num}
                      </span>
                    </div>
                    <div className="flex-1 pb-2">
                      <h3 className="font-serif text-[19px] text-gold-brand mb-2 font-medium">
                        {chapter.title}
                      </h3>
                      <p className="text-[14px] leading-relaxed text-cream-muted">
                        {chapter.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-28 px-6 bg-cream fade-in-section">
          <div className="max-w-5xl mx-auto">
            <h2 className="font-serif text-3xl md:text-[42px] text-center text-ink mb-16 font-semibold">
              Để cuốn sách được mở ra
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: Send,
                  title: "Gửi thông tin",
                  desc: "Ba mẹ cung cấp ngày, giờ (dương lịch), nơi sinh của bé cùng một vài bối cảnh gia đình (không bắt buộc).",
                },
                {
                  icon: FileText,
                  title: "Phân tích",
                  desc: "Kenji dành thời gian phân tích sâu dữ liệu, phác họa và viết từng chương của cuốn sách.",
                },
                {
                  icon: Heart,
                  title: "Trao gửi Ebook của con",
                  desc: "Sau 3-5 ngày làm việc, cuốn sách điện tử thiết kế sang trọng sẽ được gửi trực tiếp qua Email và Zalo của ba mẹ. Định dạng này giúp ba mẹ dễ dàng lưu trữ, mở ra xem trên điện thoại hoặc iPad bất cứ lúc nào, ở bất cứ đâu.",
                },
              ].map((step, index) => (
                <div
                  key={index}
                  className={`text-center space-y-4 fade-in-section delay-${index * 100}`}
                >
                  <div className="w-16 h-16 rounded-full border-2 border-gold bg-cream mx-auto flex items-center justify-center">
                    <step.icon className="w-7 h-7 text-gold" />
                  </div>
                  <div className="font-sans text-[10px] tracking-widest uppercase text-gold">
                    {step.title}
                  </div>
                  <h3 className="font-serif text-[19px] text-ink font-medium">
                    {step.title}
                  </h3>
                  <p className="text-[14px] leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Sample Page Excerpt */}
        <section className="py-16 px-6 bg-cream fade-in-section">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-[28px] font-serif text-ink mb-8 text-center font-medium">
              Trích dẫn từ Ebook Bản Sắc
            </h2>
            <div className="shadow-lg">
              <Image
                src="/nd1.png"
                alt="Trích dẫn từ Ebook Bản Sắc"
                width={1200}
                height={675}
                className="w-full h-auto"
              />
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="py-28 px-6 bg-[#f2ead8]">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16 fade-in-section">
              <h2 className="font-serif text-3xl md:text-[42px] text-ink mb-3 font-semibold">
                Chọn món quà bạn muốn dành tặng con
              </h2>
              <p className="font-serif text-[15px] italic text-gold font-medium">
                Ưu đãi ra mắt dành riêng cho tháng này.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Gói 1 */}
              <div className="bg-cream border border-gold p-8 space-y-6 hover-lift fade-in-section shadow-sm">
                <div className="space-y-2">
                  <div className="font-sans text-[11px] tracking-widest uppercase text-gold">
                    GÓI 1
                  </div>
                  <h3 className="font-serif text-[22px] text-ink font-medium">
                    MÓN QUÀ THẤU HIỂU
                  </h3>
                  <div className="flex items-baseline gap-3">
                    <div className="font-serif text-[40px] text-ink font-semibold">
                      2.000.000đ
                    </div>
                  </div>
                  <div className="text-[11px] text-gold-deep font-semibold uppercase tracking-wider mb-2">
                    Mức phí chính thức 3.000.000đ
                  </div>
                </div>

                <ul className="space-y-3">
                  {[
                    "Nhận ấn phẩm Mini Ebook (5 Chương)",
                    "Cá nhân hóa 100% cho từng bé",
                    "Ba mẹ đọc, quan sát và lưu giữ như một kỷ vật",
                    "Giao trong 3-5 ngày",
                  ].map((item, index) => (
                    <li key={index} className="flex gap-3 text-[14px]">
                      <span className="text-gold mt-1">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                <a
                  href="#contact"
                  className="block w-full text-center font-sans text-[11px] tracking-widest uppercase bg-ink text-cream-light px-6 py-4 hover:bg-body-text transition-all duration-300 hover:shadow-lg hover:scale-105"
                >
                  Đặt Gói 1
                </a>
              </div>

              {/* Gói 2 - Highlighted */}
              <div className="bg-cream border-[1.5px] border-gold p-8 space-y-6 relative transform md:scale-105 hover-lift fade-in-section delay-100 shadow-lg">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gold text-ink font-sans text-[9px] tracking-widest uppercase px-4 py-1">
                  Được chọn nhiều nhất
                </div>

                <div className="space-y-2">
                  <div className="font-sans text-[11px] tracking-widest uppercase text-gold">
                    GÓI 2
                  </div>
                  <h3 className="font-serif text-[22px] text-ink font-medium">
                    TRÒ CHUYỆN CÙNG KENJI
                  </h3>
                  <div className="flex items-baseline gap-3">
                    <div className="font-serif text-[40px] text-ink font-semibold">
                      3.500.000đ
                    </div>
                  </div>
                  <div className="text-[11px] text-gold-deep font-semibold uppercase tracking-wider mb-2">
                    Mức phí chính thức 5.500.000đ
                  </div>
                </div>

                <ul className="space-y-3">
                  {[
                    "Bao gồm tất cả quyền lợi của Gói 1",
                    "30 phút thảo luận 1-1 trực tiếp cùng Kenji qua Zoom/Voice",
                    "Kenji giải thích sâu những điểm tính cách nổi bật của con",
                    "Gợi ý phương pháp tương tác áp dụng ngay vào sinh hoạt",
                    "Gỡ rối chuyên sâu các vấn đề thực tế gia đình đang gặp",
                  ].map((item, index) => (
                    <li key={index} className="flex gap-3 text-[14px]">
                      <span className="text-gold mt-1">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                <a
                  href="#contact"
                  className="block w-full text-center font-sans text-[11px] tracking-widest uppercase bg-gold text-ink px-6 py-4 hover:bg-gold-brand transition-all duration-300 hover:shadow-lg hover:scale-105"
                >
                  Đặt Gói 2
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-28 px-6 bg-cream fade-in-section">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-serif text-3xl md:text-[42px] text-center text-ink mb-12 font-semibold">
              Những điều ba mẹ thường trăn trở
            </h2>
            <Accordion type="single" collapsible className="space-y-4">
              <AccordionItem
                value="item-1"
                className="border border-[rgba(201,168,76,0.3)] bg-cream px-6"
              >
                <AccordionTrigger className="font-serif text-[17px] text-left hover:text-gold transition-colors font-medium">
                  Cuốn sách này được viết dựa trên cơ sở nào?
                </AccordionTrigger>
                <AccordionContent className="text-[14px] leading-relaxed pt-2">
                  Bản Sắc của con được phân tích dựa trên Tâm lý học chiều sâu
                  (Depth Psychology) và các Nguyên mẫu tâm lý (Archetypes) khi
                  con vừa chào đời. Đây là công cụ khoa học để thấu hiểu tính
                  cách, hoàn toàn không mang tính chất tâm linh, hù dọa hay bói
                  toán định mệnh.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem
                value="item-2"
                className="border border-[rgba(201,168,76,0.3)] bg-cream px-6"
              >
                <AccordionTrigger className="font-serif text-[17px] text-left hover:text-gold transition-colors font-medium">
                  Nếu ba mẹ không nhớ chính xác giờ sinh của con thì sao?
                </AccordionTrigger>
                <AccordionContent className="text-[14px] leading-relaxed pt-2">
                  Cuốn sách vẫn khắc họa được các tính cách bẩm sinh cốt lõi của
                  con rõ ràng. Nếu ba mẹ nhớ được khoảng thời gian (sáng/trưa/chiều),
                  độ chính xác vẫn sẽ rất cao để Kenji phác họa chân dung con.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem
                value="item-3"
                className="border border-[rgba(201,168,76,0.3)] bg-cream px-6"
              >
                <AccordionTrigger className="font-serif text-[17px] text-left hover:text-gold transition-colors font-medium">
                  Cuốn Ebook này có giá trị sử dụng trong bao lâu?
                </AccordionTrigger>
                <AccordionContent className="text-[14px] leading-relaxed pt-2">
                  Đây là chiếc la bàn cho suốt 6 năm đầu đời của con. Ba mẹ không
                  chỉ đọc một lần, mà có thể mở ra xem lại mỗi khi con bước sang
                  một giai đoạn phát triển mới, hay bất cứ khi nào thấy bối rối
                  trên hành trình nuôi con.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </section>

        {/* Hướng dẫn đọc & Ghi nhật ký đồng hành */}
        <section className="py-28 px-6 bg-[#f2ead8] fade-in-section">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-serif text-3xl md:text-[42px] text-center text-ink mb-12 font-semibold">
              CÁCH LẬT MỞ "BẢN SẮC" & LƯU GIỮ KỶ VẬT CÙNG CON
            </h2>
            <p className="text-[15px] leading-[1.7] mb-10 text-center">
              Khi Ebook được cầm trên tay ba mẹ, nó không phải là một tài liệu đọc một lần rồi
              cất đi. Nó là chiếc la bàn đi cùng sự trưởng thành của con. Để cảm
              nhận trọn vẹn kiệt tác này, Kenji gợi ý ba mẹ một vài "nhịp nghỉ"
              sau:
            </p>

            <div className="space-y-8">
              <div className="border-l-2 border-gold pl-6">
                <h3 className="font-serif text-[19px] text-ink mb-3 font-medium">
                  Đọc chậm
                </h3>
                <p className="text-[14px] leading-relaxed">
                  Đừng vội vã lướt qua các trang sách giữa những giờ làm việc căng
                  thẳng. Hãy pha một tách trà, ngồi xuống khi con đã ngủ say, và
                  đọc với một tâm trí cởi mở, không phán xét.
                </p>
              </div>

              <div className="border-l-2 border-gold pl-6">
                <h3 className="font-serif text-[19px] text-ink mb-3 font-medium">
                  Đón nhận thay vì kỳ vọng
                </h3>
                <p className="text-[14px] leading-relaxed">
                  Đừng tìm kiếm xem tương lai con sẽ thành ông nọ bà kia. Hãy đối chiếu những dòng chữ này với những cái nhíu mày, những lần con bướng bỉnh hay những cái ôm con vừa trao sáng nay. Ba mẹ sẽ thấy sự thấu cảm nảy mầm.
                </p>
              </div>

              <div className="border-l-2 border-gold pl-6">
                <h3 className="font-serif text-[19px] text-ink mb-3 font-medium">
                  Viết "Nhật ký đồng hành"
                </h3>
                <p className="text-[14px] leading-relaxed">
                  Kenji khuyến khích ba mẹ chuẩn bị một cuốn sổ tay nhỏ (hoặc ứng
                  dụng ghi chú trên điện thoại). Bất cứ khi nào ba mẹ áp dụng
                  thành công một góc nhìn từ sách, hay khi con thốt ra một câu nói
                  ngô nghê mang đậm "bản sắc" của mình, hãy ghi lại. Dòng thời gian
                  sẽ trôi đi, nhưng những ghi chép lặt vặt ấy chính là mảnh ghép
                  chân thực nhất trong kiệt tác cuộc đời con.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-28 px-6 text-center bg-cream fade-in-section">
          <div className="max-w-3xl mx-auto space-y-6">
            <h2 className="font-serif text-3xl md:text-[40px] text-ink font-semibold">
              Con chỉ có một lần đi qua tuổi thơ từ{" "}
              <span className="italic text-gold-brand">0 đến 6 tuổi.</span>
            </h2>
            <p className="text-[15px] leading-[1.7] max-w-2xl mx-auto">
              Ấn phẩm này không dùng để thay đổi con. Nó giúp ba mẹ thực sự{" "}
              <span className="font-semibold">NHÌN THẤY</span> con. Hãy để chúng
              ta bắt đầu lật mở trang sách đầu tiên.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <a
                href="#pricing"
                onClick={(e) => scrollToSection(e, "pricing")}
                className="font-sans text-[11px] tracking-widest uppercase bg-gold text-ink px-8 py-4 hover:bg-gold-brand transition-all duration-300 hover:shadow-lg hover:scale-105"
              >
                Bắt đầu hành trình
              </a>
            </div>
          </div>
        </section>

        {/* Footer with Terms Accordion */}
        <footer className="border-t border-[rgba(201,168,76,0.2)] bg-cream py-12 px-6">
          <div className="max-w-7xl mx-auto space-y-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <Image
                src="/essence-wordmark-full-vn-light.svg"
                alt="Kenji Phạm · Essence Coaching · Sài Gòn"
                width={350}
                height={100}
                className="h-auto w-auto max-w-[200px] sm:max-w-[280px] md:max-w-[350px]"
              />
              <div className="font-sans text-[14px] text-gold-deep text-center md:text-right leading-relaxed">
                Không dự đoán tương lai · Không phán định mệnh
                <br />
                Chỉ mang đến sự thấu cảm và tĩnh lặng.
              </div>
            </div>

            {/* Terms & Privacy Accordion */}
            <Accordion type="single" collapsible className="max-w-4xl mx-auto">
              <AccordionItem
                value="terms"
                className="border-t border-[rgba(201,168,76,0.2)]"
              >
                <AccordionTrigger className="font-sans text-[11px] text-gold-deep hover:text-gold transition-colors py-4">
                  Điều khoản Dịch vụ & Chính sách Bảo mật
                </AccordionTrigger>
                <AccordionContent className="text-[12px] text-gray-500 leading-relaxed space-y-4 pb-6">
                  <div>
                    <h4 className="font-semibold text-body-text mb-2">
                      1. Chính sách Bảo mật Thông tin
                    </h4>
                    <p>
                      Kenji cam kết bảo mật tuyệt đối mọi thông tin cá nhân của ba
                      mẹ và bé (bao gồm ngày giờ sinh, hình ảnh, câu chuyện gia
                      đình). Dữ liệu chỉ được sử dụng duy nhất cho mục đích phân
                      tích thiết kế báo cáo. Tuyệt đối không chia sẻ cho bên thứ ba
                      hoặc dùng làm tư liệu truyền thông nếu chưa có sự đồng ý bằng
                      văn bản từ ba mẹ.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-body-text mb-2">
                      2. Điều khoản Giao nhận & Hoàn phí
                    </h4>
                    <p>
                      Đây là sản phẩm dịch vụ nội dung số (File PDF) được cá nhân
                      hóa và phân tích riêng cho từng người. Do tính chất đặc thù
                      của sản phẩm, Essence Coaching không áp dụng chính sách hoàn
                      tiền sau khi đơn hàng đã được xác nhận thanh toán và tiến hành
                      phân tích. Thời gian hoàn thiện Ebook là từ 3 - 5 ngày làm
                      việc. Trong trường hợp có lượng đăng ký vượt quá giới hạn
                      tháng, Kenji sẽ thông báo trước thời gian gửi file để ba mẹ an
                      tâm chờ đợi.
                    </p>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <div className="text-center text-[10px] text-gray-400 pt-4">
              © {new Date().getFullYear()} Essence Coaching · Sài Gòn. All
              rights reserved.
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}