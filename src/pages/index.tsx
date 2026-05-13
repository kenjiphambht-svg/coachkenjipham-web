import { SEO } from "@/components/SEO";
import { Sparkles, Heart, Compass, Star } from "lucide-react";
import Image from "next/image";

export default function Home() {
  return (
    <>
      <SEO
        title="Bản Đồ Tâm Hồn Bé · Kenji Phạm · Essence Coaching"
        description="Giải mã khí chất, cảm xúc và tài năng bẩm sinh của con — qua từng giai đoạn 0 đến 6 tuổi. Báo cáo bản đồ tâm hồn cá nhân hoá cho trẻ nhỏ tại Sài Gòn."
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
              Báo cáo bản đồ tâm hồn · Bé 0–6 tuổi · Sài Gòn
            </div>
            <h1 className="font-serif text-4xl md:text-[56px] leading-tight text-ink">
              Con bạn đến thế giới này với một{" "}
              <span className="italic text-gold">bản thiết kế riêng.</span>
            </h1>
            <p className="text-[15px] leading-relaxed max-w-2xl mx-auto">
              Bản Đồ Tâm Hồn Bé giải mã khí chất, cảm xúc và tài năng bẩm sinh
              của con — qua từng giai đoạn 0 đến 6 tuổi. Không phán tương lai.
              Chỉ là chiếc la bàn để ba mẹ hiểu con sâu hơn.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <a
                href="#contact"
                className="font-sans text-[11px] tracking-widest uppercase bg-gold text-ink px-8 py-4 hover:bg-[#b89640] transition-colors"
              >
                Gói 2 · 3.500.000đ
              </a>
              <a
                href="#contact"
                className="font-sans text-[11px] tracking-widest uppercase border border-ink text-ink px-8 py-4 hover:bg-ink hover:text-cream transition-colors"
              >
                Gói 1 · 2.000.000đ
              </a>
            </div>
          </div>
        </section>

        {/* Pain Points Grid */}
        <section className="py-20 px-6">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[1px] bg-[rgba(201,168,76,0.18)]">
              <div className="bg-cream p-6 space-y-3">
                <p className="font-serif italic text-gold text-base">
                  "Sao con cứ quấy khóc mà mình không hiểu lý do?"
                </p>
                <p className="text-[13px] leading-relaxed">
                  Mỗi bé có ăng-ten cảm xúc khác nhau. Chương 2 giải mã cách con
                  nhận diện an toàn — và vì sao một số bé dễ quấy hơn những bé
                  khác.
                </p>
              </div>
              <div className="bg-cream p-6 space-y-3">
                <p className="font-serif italic text-gold text-base">
                  "Nuôi theo sách mà con vẫn không như kỳ vọng?"
                </p>
                <p className="text-[13px] leading-relaxed">
                  Vì không có cuốn sách nào viết cho đứa trẻ này. Bản Đồ Tâm
                  Hồn Bé cá nhân hoá hoàn toàn — theo từng đứa con, từng giai
                  đoạn.
                </p>
              </div>
              <div className="bg-cream p-6 space-y-3">
                <p className="font-serif italic text-gold text-base">
                  "Làm sao biết con có năng khiếu gì?"
                </p>
                <p className="text-[13px] leading-relaxed">
                  Chương 4 giải mã tài năng chớm nở — những gì con làm tốt một
                  cách tự nhiên, trước khi vào lớp 1.
                </p>
              </div>
              <div className="bg-cream p-6 space-y-3">
                <p className="font-serif italic text-gold text-base">
                  "Con hay bướng bỉnh — là hư hay là cá tính?"
                </p>
                <p className="text-[13px] leading-relaxed">
                  Đa phần là cá tính. Chương 1 phân biệt khí chất bẩm sinh với
                  hành vi cần điều chỉnh — để ba mẹ không sửa nhầm.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 5 Chapters - Dark Section */}
        <section className="py-20 px-6 bg-dark-section">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="space-y-2">
              <div className="font-sans text-[10px] tracking-widest uppercase text-gold">
                NỘI DUNG BÁO CÁO
              </div>
              <h2 className="font-serif text-3xl md:text-[36px] text-cream-light">
                5 chương · Cá nhân hoá hoàn toàn
              </h2>
              <p className="text-[14px] text-cream-muted">
                Mỗi báo cáo viết riêng cho từng bé.
              </p>
            </div>

            <div className="space-y-0">
              {[
                {
                  num: "01",
                  title: "Con bước ra đời như thế nào?",
                  desc: "Khí chất bẩm sinh, cách con xuất hiện với thế giới. Những gì không thể thay đổi — và những gì ba mẹ nên chấp nhận từ đầu.",
                },
                {
                  num: "02",
                  title: "24 tháng đầu đời",
                  desc: "Nhu cầu gắn kết sơ sinh, \"ăng-ten\" cảm xúc của con. Tại sao một số bé dễ nuôi hơn, và làm sao điều chỉnh khi con quấy khóc.",
                },
                {
                  num: "03",
                  title: "Giai đoạn 2–4 tuổi",
                  desc: "\"Khủng hoảng lên 3\" biểu hiện thế nào với bé này. Cách đặt ranh giới mà không chà đạp cá tính.",
                },
                {
                  num: "04",
                  title: "Giai đoạn 4–6 tuổi",
                  desc: "Tài năng chớm nở, phong cách hoà nhập bạn bè. Con sẽ tỏa sáng ở đâu — và cần hỗ trợ gì từ ba mẹ.",
                },
                {
                  num: "05",
                  title: "Lời thì thầm từ tương lai",
                  desc: "Hình ảnh con 20 năm nữa — nếu ba mẹ nuôi dưỡng đúng cách. Lời chúc cá nhân từ Kenji.",
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
          </div>
        </section>

        {/* Value Props Grid */}
        <section className="py-20 px-6 bg-cream">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                {
                  icon: <Compass className="w-8 h-8" />,
                  title: "Bản đồ khí chất bẩm sinh",
                  desc: "Hiểu tại sao con phản ứng như vậy — không phải để sửa, mà để chấp nhận và điều hướng.",
                  tag: "Không đâu có",
                },
                {
                  icon: <Heart className="w-8 h-8" />,
                  title: "Hướng dẫn theo từng giai đoạn",
                  desc: "Từ sơ sinh đến 6 tuổi — mỗi chương viết riêng cho từng bé, từng năm tháng.",
                  tag: "Cá nhân hoá hoàn toàn",
                },
                {
                  icon: <Sparkles className="w-8 h-8" />,
                  title: "Tài năng và điểm mạnh",
                  desc: "Phát hiện những gì con làm tốt tự nhiên — trước khi vào lớp 1.",
                  tag: "Trước khi vào lớp 1",
                },
                {
                  icon: <Star className="w-8 h-8" />,
                  title: "La bàn nuôi con dài hạn",
                  desc: "Không chỉ cho hiện tại — báo cáo này ba mẹ dùng được cả 6 năm đầu đời.",
                  tag: "Dùng được cả 6 năm",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="border border-[rgba(201,168,76,0.3)] p-6 space-y-4"
                >
                  <div className="text-gold">{item.icon}</div>
                  <div className="space-y-2">
                    <h3 className="font-serif text-xl text-ink">
                      {item.title}
                    </h3>
                    <p className="text-[13px] leading-relaxed">{item.desc}</p>
                  </div>
                  <div className="pt-2">
                    <span className="font-sans text-[10px] tracking-widest uppercase text-gold border border-gold px-3 py-1">
                      {item.tag}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Sample Excerpts */}
        <section className="py-20 px-6 bg-[#f2ead8]">
          <div className="max-w-4xl mx-auto space-y-8">
            <h2 className="font-serif text-3xl md:text-[34px] text-ink text-center">
              Ngôn ngữ của báo cáo
            </h2>

            <div className="space-y-6">
              <div className="border-l-2 border-gold bg-cream p-6 space-y-3">
                <div className="font-sans text-[10px] tracking-widest uppercase text-gold-deep">
                  Chương 1 — Bé Win · Sài Gòn
                </div>
                <p className="font-serif text-[15px] leading-relaxed text-body-text italic">
                  "Thưa ba Trung và mẹ Kha, Win bước vào thế giới này như một
                  vị tướng quân nhỏ bé — đầy quyết đoán, không sợ va chạm. Con
                  không cần được dỗ dành nhiều. Con chỉ cần biết rằng mình được
                  tôn trọng."
                </p>
              </div>

              <div className="border-l-2 border-gold bg-cream p-6 space-y-3">
                <div className="font-sans text-[10px] tracking-widest uppercase text-gold-deep">
                  Chương 2 — Bé Minh Khuê · Sài Gòn
                </div>
                <p className="font-serif text-[15px] leading-relaxed text-body-text italic">
                  "Mẹ Vân ơi, con bé của mình trong những tháng đầu đời mang một
                  tâm hồn nhạy cảm đến lạ thường. Con cảm nhận được năng lượng
                  của người xung quanh — ngay cả khi họ không nói gì. Đây không
                  phải điểm yếu. Đây là món quà."
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section className="py-20 px-6 bg-cream" id="contact">
          <div className="max-w-5xl mx-auto space-y-8">
            <div className="text-center space-y-2">
              <h2 className="font-serif text-3xl md:text-[34px] text-ink">
                Chọn gói phù hợp
              </h2>
              <p className="font-serif italic text-[15px] text-gold">
                Ưu đãi ra mắt — giá này không kéo dài
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Gói 1 */}
              <div className="border border-gold p-8 space-y-6">
                <div className="space-y-2">
                  <div className="font-sans text-[11px] tracking-widest uppercase text-gold">
                    GÓI 1
                  </div>
                  <div className="font-serif text-[40px] text-ink">
                    2.000.000đ
                  </div>
                  <div className="font-sans text-[11px] text-gold">
                    Ra mắt · Thường 3.500.000đ
                  </div>
                </div>

                <ul className="space-y-3 text-[13px]">
                  <li className="flex items-start gap-2">
                    <span className="text-gold mt-1">•</span>
                    <span>Báo cáo đầy đủ 5 chương</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gold mt-1">•</span>
                    <span>Cá nhân hoá theo từng bé</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gold mt-1">•</span>
                    <span>Giao trong 3–5 ngày</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gold mt-1">•</span>
                    <span>Hỗ trợ Zalo 7 ngày</span>
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
                    GÓI 2
                  </div>
                  <div className="font-serif text-[40px] text-ink">
                    3.500.000đ
                  </div>
                  <div className="font-sans text-[11px] text-gold">
                    Ra mắt · Thường 5.500.000đ
                  </div>
                </div>

                <ul className="space-y-3 text-[13px]">
                  <li className="flex items-start gap-2">
                    <span className="text-gold mt-1">•</span>
                    <span>Tất cả trong Gói 1</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gold mt-1">•</span>
                    <span className="font-semibold">
                      30 phút tư vấn 1-1 với Kenji
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gold mt-1">•</span>
                    <span>Kenji giải thích trực tiếp theo bé</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gold mt-1">•</span>
                    <span>Hỏi sâu những gì ba mẹ cần</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gold mt-1">•</span>
                    <span>Hỗ trợ Zalo 30 ngày</span>
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

        {/* Kenji Bio */}
        <section className="py-20 px-6 bg-cream border-t border-[rgba(201,168,76,0.3)]">
          <div className="max-w-4xl mx-auto">
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
                  <div className="font-serif text-[18px] text-ink">
                    Kenji Phạm
                  </div>
                  <div className="font-sans text-[10px] tracking-widest uppercase text-gold">
                    ESSENCE COACH · SÀI GÒN
                  </div>
                </div>
                <p className="text-[13px] leading-relaxed">
                  Tôi không đọc tương lai. Tôi đọc bản thiết kế — cái mà mỗi
                  đứa trẻ mang theo khi sinh ra. Sau 8 năm làm coach cho người
                  lớn, tôi nhận ra rằng nhiều vấn đề của họ bắt nguồn từ việc bị
                  "sửa" sai từ nhỏ. Bản Đồ Tâm Hồn Bé là để những đứa trẻ này
                  không phải trải qua điều đó.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-20 px-6 bg-[#f2ead8]">
          <div className="max-w-3xl mx-auto space-y-6">
            <h2 className="font-serif text-3xl text-ink text-center mb-8">
              Câu hỏi thường gặp
            </h2>

            <div className="space-y-4">
              {[
                {
                  q: "Báo cáo dựa trên cơ sở gì?",
                  a: "Tâm lý học nguyên mẫu (Jungian archetypes) kết hợp với hành tinh học phát triển. Không phải tử vi cổ truyền. Đây là công cụ hiện đại để hiểu tính cách — không phán định mệnh.",
                },
                {
                  q: "Cần cung cấp thông tin gì?",
                  a: "Ngày sinh, giờ sinh, nơi sinh của bé. Thông tin về ba mẹ (tên, hoàn cảnh gia đình) giúp báo cáo cá nhân hoá hơn, nhưng không bắt buộc.",
                },
                {
                  q: "Không biết giờ sinh chính xác thì sao?",
                  a: "Báo cáo vẫn làm được. Nhưng một số chi tiết về cảm xúc sơ sinh sẽ ít chính xác hơn. Nếu biết khoảng thời gian (sáng/chiều/tối), vẫn tốt hơn không có gì.",
                },
                {
                  q: "Gói 1 và Gói 2 khác nhau thế nào?",
                  a: "Gói 1 ba mẹ tự đọc báo cáo. Gói 2 có thêm 30 phút tư vấn trực tiếp với Kenji — để hỏi sâu, để Kenji giải thích theo đúng bối cảnh của gia đình bạn.",
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
              Con chỉ có một lần{" "}
              <span className="italic text-gold-brand">0 đến 6 tuổi.</span>
            </h2>
            <p className="text-[15px] leading-relaxed">
              Báo cáo này không thay đổi con. Nó giúp ba mẹ nhìn thấy con.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <a
                href="#contact"
                className="font-sans text-[11px] tracking-widest uppercase bg-gold text-ink px-8 py-4 hover:bg-[#b89640] transition-colors"
              >
                Gói 2 · 3.500.000đ
              </a>
              <a
                href="#contact"
                className="font-sans text-[11px] tracking-widest uppercase border border-ink text-ink px-8 py-4 hover:bg-ink hover:text-cream transition-colors"
              >
                Gói 1 · 2.000.000đ
              </a>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-[rgba(201,168,76,0.2)] bg-cream py-8 px-6">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <Image
              src="/essence-wordmark-full-vn-light.svg"
              alt="Kenji Phạm · Essence Coaching · Sài Gòn"
              width={280}
              height={80}
              className="h-auto w-auto max-w-[280px]"
            />
            <div className="font-sans text-[11px] text-gold-deep">
              Không dự đoán tương lai · Không phán định mệnh
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}