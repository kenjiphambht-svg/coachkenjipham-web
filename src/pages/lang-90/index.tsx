import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { SEO } from "@/components/SEO";

// ============================================================
// LANDING "Lặng 90'" — /lang-90 (noindex, bản nháp chờ Kenji duyệt)
// Mode: Light-led premium (token --essence-*-2026), 1 nút vàng duy nhất ("Giữ chỗ").
// Copy: NGUYÊN VĂN tài liệu Kenji cung cấp; chỉ áp 4 điểm đã duyệt
// (bỏ "FCP Clear" ở bước 1 · 5→6 phiên · VietQR · check-in 7/30). Không sửa gì thêm.
// Route sống KHÔNG bị đụng.
// ============================================================
export default function Lang90Landing() {
  return (
    <>
      <SEO
        title="Lặng 90' — Kenji Phạm | Essence Coach (Bản nháp)"
        description="90 phút ngồi xuống cùng nhau khi tất cả sụp đổ. Coaching 1:1 với Kenji Phạm — nhìn thẳng vào thứ đang giữ bạn lại và bước ra khỏi đó."
        image="/essence-og-1200x630.png"
        url="https://coachkenjipham.com/lang-90"
      />
      <Head>
        <meta name="robots" content="noindex" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon-180.png" />
      </Head>

      <main className="bg-e26-ivory text-e26-text">
        {/* Kicker định danh */}
        <div className="max-w-[720px] mx-auto px-6 pt-10">
          <p className="font-sans text-sm text-e26-text-2">Kenji Phạm · Essence Coach · Sài Gòn</p>
        </div>

        {/* 1 — HERO */}
        <section className="max-w-[720px] mx-auto px-6 pt-16 pb-20 md:pt-24 md:pb-28">
          <h1 className="font-serif font-light text-[38px] md:text-[56px] leading-[1.12] text-e26-text">
            Khi tất cả sụp đổ
            <br />
            và bạn không biết
            <br />
            <em className="italic">mình còn là ai nữa.</em>
          </h1>
          <p className="font-sans text-[17px] leading-[1.65] text-e26-text-2 mt-10 max-w-xl">
            90 phút ngồi xuống cùng nhau. Tôi không an ủi. Tôi không dạy. Tôi giúp bạn nhìn
            thẳng vào thứ đang giữ bạn lại — và bước ra khỏi đó.
          </p>
        </section>

        {/* 2 — NGƯỜI THẬT */}
        <section className="bg-e26-white">
          <div className="max-w-[720px] mx-auto px-6 py-16 md:py-24">
            <div className="w-[180px] h-[225px] overflow-hidden mb-10">
              <Image
                src="/klp.jpg"
                alt="Kenji Phạm — Essence Coach"
                width={360}
                height={450}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="space-y-5 font-sans text-[17px] leading-[1.7] text-e26-text-2 max-w-xl">
              <p>
                Tôi biết cảm giác đó. Hoang mang đến mức không ngủ được. Tức giận đến mức muốn
                đập phá tất cả. Nhìn lại những gì đã mất và chỉ muốn trả thù — hoặc biến mất.
              </p>
              <p className="text-e26-text">
                Tôi đã từng ở đó. Một mình. Nuôi hai con. Tài khoản còn 2.5 USD.
              </p>
              <p>
                Không phải động lực hay lời khuyên đưa tôi qua đó. Là một phương pháp — mà tôi
                phải sống qua mới hiểu nó thật sự hoạt động.
              </p>
            </div>
          </div>
        </section>

        {/* 3 — BẠN CÓ ĐANG Ở ĐÂY KHÔNG */}
        <section className="max-w-[720px] mx-auto px-6 py-16 md:py-24">
          <h2 className="font-serif font-normal text-[28px] md:text-[38px] text-e26-text mb-10">
            Bạn có đang ở đây không
          </h2>
          <p className="font-serif italic text-xl md:text-2xl leading-snug text-e26-text mb-10">
            &ldquo;Tôi không biết mình đang hoảng loạn hay đang giận — hay cả hai.&rdquo;
          </p>
          <ul className="space-y-5 font-sans text-[17px] leading-[1.6] text-e26-text-2">
            <li className="border-t border-e26-border pt-5">
              Thất bại xong không biết đứng lên kiểu nào mà không cảm thấy ngu ngốc
            </li>
            <li className="border-t border-e26-border pt-5">
              Hoang mang cực độ — biết mình phải làm gì đó nhưng không làm được gì
            </li>
            <li className="border-t border-e26-border pt-5">
              Muốn trả thù — người phản bội, hoàn cảnh, hoặc chính bản thân mình
            </li>
            <li className="border-t border-e26-border pt-5">
              Bề ngoài vẫn đang vận hành. Bên trong đã không còn ổn từ lâu rồi
            </li>
            <li className="border-t border-e26-border pt-5">
              Đã nói chuyện với nhiều người — không ai thật sự hiểu bạn đang nói về cái gì
            </li>
          </ul>
        </section>

        {/* 4 — PHIÊN DIỄN RA THẾ NÀO */}
        <section className="bg-e26-cream">
          <div className="max-w-[720px] mx-auto px-6 py-16 md:py-24">
            <h2 className="font-serif font-normal text-[24px] md:text-[30px] leading-snug text-e26-text mb-12">
              90 phút. Không cần chuẩn bị gì. Chỉ cần mang sự thật của bạn đến.
            </h2>

            <div className="space-y-10">
              <div className="border-t border-e26-border pt-6">
                <div className="flex items-baseline gap-4">
                  <span className="font-serif text-2xl text-e26-gold-deep" aria-hidden="true">1</span>
                  <h3 className="font-serif text-xl text-e26-text">Về Điểm Không</h3>
                </div>
                <p className="font-sans text-[15px] leading-[1.7] text-e26-text-2 mt-3 pl-9">
                  Trước khi nói bất cứ điều gì, tôi sẽ đưa bạn về trạng thái rỗng. Không phán
                  xét, không kháng cự. Não đang hỗn loạn — bước này giúp nó dừng lại.
                </p>
              </div>
              <div className="border-t border-e26-border pt-6">
                <div className="flex items-baseline gap-4">
                  <span className="font-serif text-2xl text-e26-gold-deep" aria-hidden="true">2</span>
                  <h3 className="font-serif text-xl text-e26-text">Bẻ gãy vòng lặp</h3>
                </div>
                <p className="font-sans text-[15px] leading-[1.7] text-e26-text-2 mt-3 pl-9">
                  Tôi sẽ hỏi những câu bạn chưa bao giờ được hỏi. Không để phán xét — để bạn
                  nhìn thấy rõ thứ đang giữ bạn trong vòng lặp đó là gì.
                </p>
              </div>
              <div className="border-t border-e26-border pt-6">
                <div className="flex items-baseline gap-4">
                  <span className="font-serif text-2xl text-e26-gold-deep" aria-hidden="true">3</span>
                  <h3 className="font-serif text-xl text-e26-text">Một bước tiếp theo — cụ thể</h3>
                </div>
                <p className="font-sans text-[15px] leading-[1.7] text-e26-text-2 mt-3 pl-9">
                  Không phải kế hoạch đẹp trên giấy. Là một hành động thật, ngay ngày mai. Bạn
                  rời đi với câu hỏi cốt lõi và biết bước tiếp theo là gì.
                </p>
              </div>
            </div>

            <div className="border-t border-e26-border mt-12 pt-8">
              <h3 className="font-serif text-xl text-e26-text mb-3">Tối đa 6 phiên mỗi tháng</h3>
              <p className="font-sans text-[15px] leading-[1.7] text-e26-text-2 max-w-xl">
                Không phải chiến thuật marketing. Mỗi phiên tôi cần mang toàn bộ sự tập trung
                vào — và tôi chỉ có đủ cho 6 người. Khi đủ chỗ, tháng đó đóng.
              </p>
            </div>
          </div>
        </section>

        {/* 5 — PHÍ PHIÊN */}
        <section className="max-w-[720px] mx-auto px-6 py-16 md:py-24">
          <h2 className="font-serif font-normal text-[28px] md:text-[38px] text-e26-text mb-6">
            Phí phiên
          </h2>
          <p className="font-serif text-4xl text-e26-text mb-6">10.000.000đ</p>
          <div className="space-y-2 font-sans text-[15px] leading-[1.7] text-e26-text-2">
            <p>90 phút · 1:1 với Kenji · Zoom hoặc gặp mặt tại Sài Gòn</p>
            <p>Thanh toán trước · Báo cáo tóm tắt giao trong 24h sau phiên</p>
            <p>Check-in ngày 7 và ngày 30 (nằm trong giá)</p>
          </div>
        </section>

        {/* 6 — RANH GIỚI CÔNG KHAI */}
        <section className="bg-e26-cream">
          <div className="max-w-[720px] mx-auto px-6 py-16 md:py-24">
            <blockquote className="border-l border-e26-gold pl-6">
              <p className="font-serif italic text-xl md:text-2xl leading-[1.6] text-e26-text">
                Tôi là coach — tôi không chữa bệnh, không chẩn đoán, và không thay thế chuyên gia
                tâm lý lâm sàng. Những gì chúng ta làm hôm nay là coaching — tôi giúp bạn nhìn
                thấy rõ hơn để bạn tự quyết định. Nếu bất kỳ lúc nào tôi thấy bạn cần thứ gì khác
                ngoài phạm vi này, tôi sẽ nói thẳng.
              </p>
            </blockquote>
            <ul className="space-y-3 font-sans text-[15px] leading-[1.7] text-e26-text-2 mt-8">
              <li>Có quyền dừng phiên bất kỳ lúc nào nếu ca vượt phạm vi</li>
              <li>Có quyền từ chối phiên tiếp theo nếu không phù hợp</li>
            </ul>
          </div>
        </section>

        {/* 7 — CTA (nút vàng duy nhất) */}
        <section className="max-w-[720px] mx-auto px-6 py-16 md:py-24 text-center">
          <Link
            href="/lang-90/dat-phien"
            className="inline-block bg-e26-gold text-e26-black rounded-none font-sans font-medium text-[13px] tracking-[0.08em] uppercase px-10 py-4 hover:bg-e26-gold-deep hover:text-e26-ivory transition-colors duration-300"
          >
            Giữ chỗ
          </Link>
        </section>

        {/* 8 — FOOTER */}
        <footer className="bg-e26-black px-6 py-16">
          <div className="max-w-[720px] mx-auto text-center">
            <p className="font-sans text-sm text-e26-text-dark-2 mb-2">Có câu hỏi trước khi đặt?</p>
            <p className="font-sans text-sm text-e26-text-dark mb-8">
              Email:{" "}
              <a href="mailto:kenjipham.bht@gmail.com" className="hover:text-e26-gold transition-colors">
                kenjipham.bht@gmail.com
              </a>
            </p>
            <p className="font-sans text-xs text-e26-text-dark-2">
              Kenji Phạm · Essence Coach · Sài Gòn · 2026
            </p>
          </div>
        </footer>
      </main>
    </>
  );
}
