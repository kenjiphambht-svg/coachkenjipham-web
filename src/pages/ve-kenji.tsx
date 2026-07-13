import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { SEO } from "@/components/SEO";
import HomeHeader from "@/components/homepage/HomeHeader";

// ============================================================
// "VỀ KENJI" — /ve-kenji (noindex, bản nháp chờ Kenji duyệt)
// Hạ tầng niềm tin + entity chính cho GEO. Route sống KHÔNG bị đụng.
// Copy NGUYÊN VĂN Kenji đã duyệt — không tự viết thêm/bớt.
// Mode: Light-led premium, token -2026, đúng 1 nút vàng (CTA cuối trang).
// Đúng 1 dark "silence" section duy nhất (Section 5 — Ranh giới nghề),
// theo quy tắc "light-led premium, dark as silence" (08_PAGE_APPLICATION_GUIDE_2026).
// ============================================================
export default function VeKenjiPage() {
  return (
    <>
      <SEO
        title="Kenji Phạm — Essence Coach | Essence Coaching System (Bản nháp)"
        description="Kenji Phạm là Essence Coach và founder Essence Coaching System — hệ khai vấn bản sắc AI-native kết hợp coaching, tâm lý chiều sâu, chiêm tinh tâm lý theo hướng biểu tượng và AI agentic workflow."
        image="/essence-og-1200x630.png"
        url="https://coachkenjipham.com/ve-kenji"
      />
      <Head>
        <meta name="robots" content="noindex" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/favicon-192.png" />
        <link rel="icon" type="image/png" sizes="512x512" href="/favicon-512.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon-180.png" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "Kenji Phạm",
              alternateName: "Coach Kenji Phạm",
              jobTitle: "Essence Coach",
              description:
                "Kenji Phạm là Essence Coach và founder Essence Coaching System — hệ khai vấn bản sắc AI-native kết hợp coaching, tâm lý chiều sâu, chiêm tinh tâm lý theo hướng biểu tượng và AI agentic workflow.",
              worksFor: {
                "@type": "Organization",
                name: "Essence Coaching System",
              },
              image: "https://coachkenjipham.com/essence-avatar-1024.png",
              address: {
                "@type": "PostalAddress",
                addressLocality: "Sài Gòn",
                addressCountry: "VN",
              },
              knowsAbout: ["tâm lý học chiều sâu", "coaching", "phát triển bản sắc"],
              url: "https://coachkenjipham.com/ve-kenji",
            }),
          }}
        />
      </Head>

      <HomeHeader />
      <main className="bg-e26-ivory text-e26-text">
        {/* Kicker định danh */}
        <div className="max-w-[720px] mx-auto px-6 pt-10">
          <p className="font-sans text-sm text-e26-text-2">
            Kenji Phạm — Huấn luyện viên Tâm lý Chiều sâu
          </p>
        </div>

        {/* 1 — HERO */}
        <section className="max-w-[720px] mx-auto px-6 pt-16 pb-20 md:pt-24 md:pb-28">
          <h1 className="font-serif font-light text-[38px] md:text-[56px] leading-[1.15] text-e26-text">
            Tôi không sửa con người.
            <br />
            Tôi tạo sự An định.
          </h1>
          <p className="font-sans text-[17px] leading-[1.65] text-e26-text-2 mt-10 max-w-xl">
            Để bạn tự nhìn lại câu chuyện sống của mình, tự dọn điều đang kéo mình, và tự chọn
            lại nhịp sống — từ nơi thật hơn bên trong.
          </p>
        </section>

        {/* 2 — CHÂN DUNG THẬT */}
        <section className="bg-e26-white">
          <div className="max-w-[720px] mx-auto px-6 py-16 md:py-24">
            <div className="w-[180px] h-[225px] overflow-hidden mb-3">
              <Image
                src="/klp.jpg"
                alt="Kenji Phạm — Essence Coach"
                width={360}
                height={450}
                className="w-full h-full object-cover"
              />
            </div>
            <p className="font-sans text-xs text-e26-text-2 mb-10">Sài Gòn · 2026</p>

            <div className="space-y-5 font-sans text-[17px] leading-[1.7] text-e26-text-2 max-w-xl">
              <p>
                Tôi là Kenji Phạm — Essence Coach, người sáng lập Essence Coaching System.
              </p>
              <p>
                Tám năm qua, tôi ngồi cùng người lớn trong những đoạn họ muốn nhìn lại chính
                mình — và cùng ba mẹ, khi họ muốn hiểu con hơn.
              </p>
            </div>

            <p className="font-serif italic text-xl md:text-2xl leading-snug text-e26-text mt-12 max-w-xl">
              Câu chuyện cuộc sống của bạn là một kiệt tác.
            </p>
          </div>
        </section>

        {/* 3 — HÀNH TRÌNH THẬT */}
        <section className="max-w-[720px] mx-auto px-6 py-16 md:py-24">
          <h2 className="font-serif font-normal text-[28px] md:text-[38px] text-e26-text mb-10">
            Tôi không đến từ lý thuyết.
          </h2>

          <div className="space-y-5 font-sans text-[17px] leading-[1.7] text-e26-text-2 max-w-xl">
            <p>
              Tôi lớn lên trong một môi trường mà từ rất sớm, tôi phải học cách sinh tồn. Không
              phải bằng sự dịu dàng — bằng gồng. Bằng kiểm soát. Bằng việc phải chứng minh mình
              không yếu.
            </p>
            <p>
              Sau này, tôi phá sản ba lần. Hôn nhân tan vỡ. Từ năm 2015, tôi một mình nuôi hai
              con trai và làm lại từ đầu.
            </p>
            <p>
              Tôi đã đi qua nhiều nghề — phục vụ, lái xe, trợ lý, bảo hiểm, buôn bán, kinh
              doanh, truyền thông. Nhiều việc giúp tôi sống. Nhưng chỉ khi coaching — khi tôi
              giúp một người nhìn ra điều đang âm thầm kéo họ — tôi mới thấy: à, mình đang ở
              đúng chỗ.
            </p>
            <p>
              Tôi biết đến chiêm tinh từ năm 2006. Rồi tiếp tục đi qua tâm lý học chiều sâu
              Jungian, coaching theo chuẩn ICF, kỷ luật trading, và sau này là AI — thứ giúp tôi
              hệ thống hóa tất cả những gì mình đã sống qua.
            </p>
          </div>

          {/* Đoạn nhấn, đặt riêng */}
          <div className="border-l border-e26-gold pl-6 mt-12 max-w-xl">
            <p className="font-serif text-xl md:text-2xl leading-snug text-e26-text">
              Essence không sinh ra từ một ý tưởng đẹp.
              <br />
              Essence sinh ra từ những lần gãy. Từ những lần mất. Từ trách nhiệm làm cha. Từ
              việc phải tự đứng dậy rất nhiều lần.
            </p>
            <p className="font-sans text-[17px] leading-[1.7] text-e26-text-2 mt-6">
              Và từ một câu hỏi: nếu đời mình đã từng vỡ như vậy — mình có thể biến nó thành một
              hệ thống giúp người khác bớt lạc hơn không?
            </p>
          </div>
        </section>

        {/* 4 — CÁCH TÔI LÀM VIỆC */}
        <section className="bg-e26-cream">
          <div className="max-w-[720px] mx-auto px-6 py-16 md:py-24">
            <h2 className="font-serif font-normal text-[28px] md:text-[38px] text-e26-text mb-10">
              Tôi đọc, để hiểu — không để phán.
            </h2>

            <div className="space-y-5 font-sans text-[17px] leading-[1.7] text-e26-text-2 max-w-xl">
              <p>
                Tôi không đọc con người để dán nhãn họ. Tôi đọc để hiểu điều gì đang vận hành
                bên dưới: phản xạ cũ, kiểu gồng, vai diễn xã hội, và bản sắc thật đang chờ được
                sống.
              </p>
              <p>
                Phía sau tôi là một hệ thống có cấu trúc — kết hợp tâm lý học chiều sâu, khung
                phát triển theo giai đoạn, và một hệ vận hành AI được thiết kế riêng. Nhưng bản
                cuối cùng gửi đến bạn, luôn do chính tôi đọc và duyệt.
              </p>
            </div>

            <div className="border-t border-e26-border mt-12 pt-8">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 font-serif text-lg md:text-xl text-e26-text">
                <span>Chill với cảm xúc</span>
                <span className="text-e26-gold-deep" aria-hidden="true">→</span>
                <span>Thách thức giới hạn</span>
                <span className="text-e26-gold-deep" aria-hidden="true">→</span>
                <span>Hiện thực ước mơ</span>
              </div>
            </div>
          </div>
        </section>

        {/* 5 — RANH GIỚI NGHỀ (dark silence section duy nhất) */}
        <section className="bg-e26-black px-6 py-24 md:py-[180px]">
          <div className="max-w-[640px] mx-auto text-center">
            <div className="w-12 h-px bg-e26-gold mx-auto mb-14" aria-hidden="true" />
            <h2 className="font-serif font-normal text-[28px] md:text-[40px] text-e26-text-dark mb-14">
              Điều tôi không phải
            </h2>
            <div className="space-y-7 font-sans text-[17px] leading-[1.8] text-e26-text-dark text-left md:text-center max-w-xl mx-auto">
              <p>
                Tôi không phải guru. Không phải thầy tâm linh. Không phải người đọc trước tương
                lai của bạn.
              </p>
              <p>
                Tôi là coach — tôi không chữa bệnh, không chẩn đoán, và không thay thế chuyên
                gia tâm lý lâm sàng. Nếu bất kỳ lúc nào tôi thấy bạn cần thứ gì khác ngoài phạm
                vi này, tôi sẽ nói thẳng.
              </p>
            </div>
            <p className="font-sans text-[15px] leading-[1.8] text-e26-text-dark-2 mt-14 max-w-xl mx-auto">
              Đổi lại — những gì tôi giữ được: rõ ràng, riêng tư, đúng nhịp. Và bạn luôn có
              quyền dừng.
            </p>
          </div>
        </section>

        {/* 6 — CTA (đúng 1 nút vàng) */}
        <section className="max-w-[720px] mx-auto px-6 py-16 md:py-24 text-center">
          <h2 className="font-serif font-normal text-[26px] md:text-[32px] text-e26-text mb-12">
            Bắt đầu từ cửa phù hợp với bạn
          </h2>
          <div className="flex flex-col items-center gap-6">
            <Link
              href="/lang-90"
              className="inline-block bg-e26-gold text-e26-black rounded-none font-sans font-medium text-[13px] tracking-[0.08em] uppercase px-10 py-4 hover:bg-e26-gold-deep hover:text-e26-ivory transition-colors duration-300"
            >
              Lặng 90' — ngồi xuống cùng tôi
            </Link>
            <p className="font-sans text-[15px] text-e26-text-2">
              Cho con của bạn —{" "}
              <Link
                href="/an-pham-ban-sac-hat-mam"
                className="text-e26-text underline underline-offset-4 decoration-e26-border hover:text-e26-gold-deep hover:decoration-e26-gold transition-colors duration-300"
              >
                Ấn phẩm Bản Sắc Hạt Mầm
              </Link>
            </p>
          </div>
        </section>

        {/* 8 — FOOTER chuẩn site */}
        <footer className="bg-e26-black px-6 py-16 md:py-20">
          <div className="max-w-4xl mx-auto text-center">
            <img
              src="/brand/logo/essence-monogram-2026-dark.svg"
              alt="Essence Coaching"
              className="h-10 w-10 mx-auto mb-4"
            />
            <p className="font-sans text-xs tracking-[0.24em] uppercase text-e26-text-dark-2 mb-1">
              Kenji Phạm
            </p>
            <p className="font-sans text-sm text-e26-text-dark-2">Sài Gòn · 2026</p>

            <div className="border-t border-e26-border-dark max-w-md mx-auto mt-10 pt-8">
              <p className="font-sans text-sm text-e26-text-dark-2">
                Liên hệ:{" "}
                <a
                  href="mailto:kenjipham.bht@gmail.com"
                  className="text-e26-text-dark hover:text-e26-gold transition-colors duration-300"
                >
                  kenjipham.bht@gmail.com
                </a>
              </p>
            </div>

            <div className="border-t border-e26-border-dark max-w-md mx-auto mt-8 pt-8">
              <nav
                aria-label="Trang pháp lý và tin cậy"
                className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 font-sans text-xs text-e26-text-dark-2 mb-4"
              >
                <Link href="/dieu-essence-khong-hua" className="hover:text-e26-gold transition-colors duration-300">
                  Điều Essence không hứa
                </Link>
                <span aria-hidden="true">·</span>
                <Link href="/chinh-sach-rieng-tu" className="hover:text-e26-gold transition-colors duration-300">
                  Chính sách riêng tư
                </Link>
                <span aria-hidden="true">·</span>
                <Link href="/lien-he" className="hover:text-e26-gold transition-colors duration-300">
                  Liên hệ
                </Link>
              </nav>
              <p className="font-sans text-xs text-e26-text-dark-2">© 2026 Essence Coaching</p>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}
