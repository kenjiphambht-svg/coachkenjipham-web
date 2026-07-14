import Head from "next/head";
import Link from "next/link";
import { SEO } from "@/components/SEO";
import HomeHeader from "@/components/homepage/HomeHeader";
import HomeFooter from "@/components/homepage/HomeFooter";

// ============================================================
// /ban-sac-cua-con — HUB dòng phụ huynh (noindex, chờ Kenji duyệt).
// Copy NGUYÊN VĂN theo task — không tự viết thêm/bớt. Luật child-safety
// nghiêm nhất site: không dán nhãn, không hứa, không dọa, ngôn ngữ mở
// ("có thể", "ba mẹ có thể quan sát"). Câu lõi bắt buộc có mặt ở Section 2.
// Schema: Article (KHÔNG Product — đây là hub, không phải trang bán hàng).
// Chỉ 1 nút vàng duy nhất (Section 5). 2/3 thẻ độ tuổi vẫn ghi "Sắp mở"
// (đúng thực tế — chưa mở bán, ẩn giá) NHƯNG đã có link tới trang preview
// noindex tương ứng (/an-pham-ban-sac-kham-pha, /an-pham-ban-sac-giao-mua)
// theo yêu cầu trực tiếp của Kenji — khác với chỉ thị "giữ nguyên hub"
// ban đầu ở 2 task xây 2 trang preview đó.
// ============================================================
export default function BanSacCuaConPage() {
  return (
    <>
      <SEO
        title="Bản Sắc Của Con — bản đồ quan sát cho ba mẹ (Bản nháp)"
        description="Một dòng ấn phẩm giúp ba mẹ quan sát con dịu hơn, chậm hơn, ít áp nhãn hơn — theo từng độ tuổi con đang đi qua."
        url="https://coachkenjipham.com/ban-sac-cua-con"
      />
      <Head>
        <meta name="robots" content="noindex" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Article",
              headline: "Bản Sắc Của Con — bản đồ quan sát cho ba mẹ",
              description:
                "Một dòng ấn phẩm giúp ba mẹ quan sát con dịu hơn, chậm hơn, ít áp nhãn hơn — theo từng độ tuổi con đang đi qua.",
              author: { "@type": "Person", name: "Kenji Phạm" },
              publisher: { "@type": "Organization", name: "Essence Coaching System" },
              url: "https://coachkenjipham.com/ban-sac-cua-con",
            }),
          }}
        />
      </Head>

      <HomeHeader />
      <main className="bg-e26-ivory">
        {/* 1 — HERO */}
        <section className="max-w-[720px] mx-auto px-6 pt-16 pb-16 md:pt-24 md:pb-20">
          <p className="font-sans text-sm text-e26-text-2">Bản Sắc Của Con</p>
          <h1 className="font-serif font-light text-[34px] md:text-[48px] leading-[1.15] text-e26-text mt-4">
            Con không cần được sửa ngay.
            <br />
            Con cần được nhìn thấy trước đã.
          </h1>
          <p className="font-sans text-[17px] leading-[1.65] text-e26-text-2 mt-8 max-w-xl">
            Một dòng ấn phẩm giúp ba mẹ quan sát con dịu hơn, chậm hơn, ít áp nhãn hơn — theo
            từng độ tuổi con đang đi qua.
          </p>
        </section>

        {/* 2 — MỘT ĐOẠN CHO BA MẸ */}
        <section className="bg-e26-white">
          <div className="max-w-[720px] mx-auto px-6 py-16 md:py-24">
            <div className="space-y-5 font-sans text-[17px] leading-[1.7] text-e26-text-2 max-w-xl">
              <p className="text-e26-text">Ba mẹ thân mến,</p>
              <p>
                Có những em bé không cần thêm một bài học mới. Con chỉ cần người lớn trong nhà
                chậm lại đủ lâu để con bắt kịp nhịp.
              </p>
              <p>
                Dòng Bản Sắc Của Con không nói con là ai mãi mãi. Nó giúp ba mẹ hỏi những câu
                dịu hơn: con mềm ra trong môi trường nào, con co lại khi nào, con cần nhịp gì để
                thấy an toàn.
              </p>
            </div>
            <p className="font-serif italic text-xl md:text-2xl leading-snug text-e26-text mt-10 max-w-xl">
              Đây là bản đồ quan sát. Không phải chiếc nhãn dán.
            </p>
          </div>
        </section>

        {/* 3 — BA PHÒNG THEO TUỔI */}
        <section className="bg-e26-cream px-6 py-16 md:py-24">
          <div className="max-w-[1120px] mx-auto">
            <h2 className="font-serif font-normal text-[26px] md:text-[34px] text-e26-text mb-12">
              Chọn theo tuổi con đang đi qua
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {/* Thẻ 1 — Hạt Mầm, ĐANG MỞ */}
              <div className="bg-e26-white border border-e26-border p-8 flex flex-col">
                <p className="font-sans text-xs tracking-[0.08em] uppercase text-e26-text-2 mb-3">
                  0–7 tuổi · Đang mở
                </p>
                <h3 className="font-serif text-xl text-e26-text mb-4">Bản Sắc Hạt Mầm</h3>
                <p className="font-sans text-[15px] leading-[1.6] text-e26-text-2 mb-6 flex-1">
                  Khi con cần được nhìn qua khí chất đầu đời, cảm xúc, nhịp sinh hoạt và cảm
                  giác an toàn.
                </p>
                <Link
                  href="/an-pham-ban-sac-hat-mam"
                  className="font-sans text-[14px] text-e26-text underline underline-offset-4 decoration-e26-border hover:text-e26-gold-deep hover:decoration-e26-gold transition-colors duration-300"
                >
                  Tìm hiểu Hạt Mầm
                </Link>
              </div>

              {/* Thẻ 2 — Khám Phá, SẮP MỞ (đã có link preview theo yêu cầu Kenji) */}
              <div className="bg-e26-white border border-e26-border p-8 flex flex-col">
                <p className="font-sans text-xs tracking-[0.08em] uppercase text-e26-text-2 mb-3">
                  7–14 tuổi · Sắp mở
                </p>
                <h3 className="font-serif text-xl text-e26-text mb-4">Bản Sắc Khám Phá</h3>
                <p className="font-sans text-[15px] leading-[1.6] text-e26-text-2 mb-6 flex-1">
                  Khi con bước vào học đường, bạn bè, năng lực và thế giới bên ngoài gia đình.
                </p>
                <Link
                  href="/an-pham-ban-sac-kham-pha"
                  className="font-sans text-[14px] text-e26-text underline underline-offset-4 decoration-e26-border hover:text-e26-gold-deep hover:decoration-e26-gold transition-colors duration-300"
                >
                  Sắp mở
                </Link>
              </div>

              {/* Thẻ 3 — Giao Mùa, SẮP MỞ (đã có link preview theo yêu cầu Kenji) */}
              <div className="bg-e26-white border border-e26-border p-8 flex flex-col">
                <p className="font-sans text-xs tracking-[0.08em] uppercase text-e26-text-2 mb-3">
                  14–21 tuổi · Sắp mở
                </p>
                <h3 className="font-serif text-xl text-e26-text mb-4">Bản Sắc Giao Mùa</h3>
                <p className="font-sans text-[15px] leading-[1.6] text-e26-text-2 mb-6 flex-1">
                  Khi con đi qua tuổi chuyển mùa — cần tự do hơn, ranh giới hơn, được tôn trọng
                  như một cá thể riêng.
                </p>
                <Link
                  href="/an-pham-ban-sac-giao-mua"
                  className="font-sans text-[14px] text-e26-text underline underline-offset-4 decoration-e26-border hover:text-e26-gold-deep hover:decoration-e26-gold transition-colors duration-300"
                >
                  Sắp mở
                </Link>
              </div>
            </div>

            <p className="font-sans text-sm text-e26-text-2 mt-10 max-w-2xl">
              Ba ấn phẩm ngang giá trị. Ba mẹ chọn theo tuổi con — không mua tuần tự, không có
              &ldquo;nâng cấp&rdquo;, không thiếu nếu chưa mua đủ.
            </p>
          </div>
        </section>

        {/* 4 — LUẬT AN TOÀN NGÔN NGỮ, công khai */}
        <section className="max-w-[720px] mx-auto px-6 py-16 md:py-24">
          <h2 className="font-serif font-normal text-[26px] md:text-[34px] text-e26-text mb-10">
            Điều dòng ấn phẩm này sẽ không bao giờ làm
          </h2>
          <ul className="space-y-4 font-sans text-[16px] leading-[1.7] text-e26-text-2">
            <li className="border-t border-e26-border pt-4">
              Không dán nhãn con, không nói con &ldquo;là&rdquo; một kiểu người cố định.
            </li>
            <li className="border-t border-e26-border pt-4">
              Không chẩn đoán, không dự đoán tương lai của con.
            </li>
            <li className="border-t border-e26-border pt-4">
              Không nói con sinh ra để chữa lành hay gánh vác cảm xúc gia đình.
            </li>
            <li className="border-t border-e26-border pt-4">
              Không biến con thành dự án phát triển bản thân của ba mẹ.
            </li>
          </ul>
          <p className="font-sans text-[16px] leading-[1.7] text-e26-text mt-10 max-w-xl border-l border-e26-gold pl-6">
            Con cảm nhận được bầu không khí, nhưng con không có trách nhiệm gánh vác nó. Ba mẹ
            mới là người giữ khung và giữ nhịp cho con.
          </p>
        </section>

        {/* 5 — CTA (đúng 1 nút vàng) */}
        <section className="bg-e26-cream px-6 py-16 md:py-24 text-center">
          <h2 className="font-serif font-normal text-[26px] md:text-[32px] text-e26-text mb-10">
            Bắt đầu từ Hạt Mầm
          </h2>
          <div className="flex flex-col items-center gap-6">
            <Link
              href="/an-pham-ban-sac-hat-mam"
              className="inline-block bg-e26-gold text-e26-black rounded-none font-sans font-medium text-[13px] tracking-[0.08em] uppercase px-10 py-4 hover:bg-e26-gold-deep hover:text-e26-ivory transition-colors duration-300"
            >
              Xem ấn phẩm Bản Sắc Hạt Mầm
            </Link>
            <Link
              href="/lien-he"
              className="font-sans text-[15px] text-e26-text-2 underline underline-offset-4 decoration-e26-border hover:text-e26-gold-deep hover:decoration-e26-gold transition-colors duration-300"
            >
              Có câu hỏi trước khi bắt đầu?
            </Link>
          </div>
        </section>
      </main>
      <HomeFooter />
    </>
  );
}
