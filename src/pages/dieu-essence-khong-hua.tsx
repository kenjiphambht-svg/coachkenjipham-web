import Head from "next/head";
import Link from "next/link";
import { SEO } from "@/components/SEO";
import HomeHeader from "@/components/homepage/HomeHeader";
import HomeFooter from "@/components/homepage/HomeFooter";

// ============================================================
// /dieu-essence-khong-hua — trust page (noindex, chờ Kenji duyệt).
// Copy NGUYÊN VĂN theo task — không tự viết thêm/bớt, không so sánh với
// đối thủ, không giọng disclaimer pháp lý lạnh. Section 1 (Hero) nền tối
// theo đúng chỉ định "hợp tinh thần trang này" — các section còn lại
// light-led như thường lệ; đúng 1 nút vàng (Section 5).
// Schema: Article + FAQPage (mỗi câu Section 4 là 1 Question).
// ============================================================
export default function DieuEssenceKhongHuaPage() {
  return (
    <>
      <SEO
        title="Điều Essence không hứa (Bản nháp)"
        description="Vì một lời hứa giữ được thì đáng tin hơn mười lời hứa đẹp. Đây là những gì Essence sẽ không bao giờ hứa với bạn."
        url="https://coachkenjipham.com/dieu-essence-khong-hua"
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
              headline: "Điều Essence không hứa",
              description:
                "Vì một lời hứa giữ được thì đáng tin hơn mười lời hứa đẹp. Đây là những gì Essence sẽ không bao giờ hứa với bạn.",
              author: { "@type": "Person", name: "Kenji Phạm" },
              publisher: { "@type": "Organization", name: "Essence Coaching System" },
              url: "https://coachkenjipham.com/dieu-essence-khong-hua",
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: [
                {
                  "@type": "Question",
                  name: "Vậy Essence có chắc giúp được tôi không?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Không ai trung thực hứa được điều đó. Điều tôi giữ được là một khoảng đủ yên để bạn tự nhìn rõ — phần còn lại là hành trình của bạn.",
                  },
                },
                {
                  "@type": "Question",
                  name: "Đây có phải trị liệu tâm lý không?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Không. Đây là coaching. Nếu bạn cần trị liệu lâm sàng, tôi sẽ nói thẳng.",
                  },
                },
                {
                  "@type": "Question",
                  name: "AI có đọc chuyện của tôi không?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Máy giúp tôi làm phần nặng phía sau, nhưng bản cuối luôn do tôi đọc và duyệt. Không có chuyện máy tự phán về bạn.",
                  },
                },
              ],
            }),
          }}
        />
      </Head>

      <HomeHeader />
      <main className="bg-e26-ivory">
        {/* 1 — HERO (nền tối) */}
        <section className="bg-e26-black px-6 py-20 md:py-28">
          <div className="max-w-[720px] mx-auto">
            <p className="font-sans text-sm text-e26-text-dark-2">Điều Essence không hứa</p>
            <h1 className="font-serif font-light text-[34px] md:text-[48px] leading-[1.15] text-e26-text-dark mt-4">
              Có những lời hứa nghe rất hay —
              <br />
              mà chúng tôi chọn không nói.
            </h1>
            <p className="font-sans text-[17px] leading-[1.65] text-e26-text-dark-2 mt-8 max-w-xl">
              Vì một lời hứa giữ được thì đáng tin hơn mười lời hứa đẹp. Đây là những gì
              Essence sẽ không bao giờ hứa với bạn.
            </p>
          </div>
        </section>

        {/* 2 — DANH SÁCH "KHÔNG HỨA", có nhịp thở */}
        <section className="bg-e26-white">
          <div className="max-w-[720px] mx-auto px-6 py-16 md:py-24">
            <div className="space-y-9 font-sans text-[18px] leading-[1.7] text-e26-text-2 max-w-xl">
              <p>Không hứa kết quả sau một buổi, một ấn phẩm, hay một tháng.</p>
              <p>
                Không thay thế chăm sóc sức khỏe tinh thần chuyên môn. Nếu bạn cần chuyên gia
                tâm lý lâm sàng, tôi sẽ nói thẳng — thay vì giữ bạn lại.
              </p>
              <p>
                Không chẩn đoán bạn, không dán cho bạn một cái tên bệnh hay một kiểu người cố
                định.
              </p>
              <p>
                Không đoán trước tương lai của bạn — và càng không đoán trước tương lai của một
                đứa trẻ.
              </p>
              <p>
                Không dùng nỗi sợ để khiến bạn phải mua, hay phải chia sẻ nhiều hơn mức bạn
                muốn.
              </p>
              <p>
                Không để máy quyết định thay con người. Bản cuối cùng luôn do tôi đọc và duyệt.
              </p>
            </div>
          </div>
        </section>

        {/* 3 — ĐỔI LẠI, ESSENCE GIỮ GÌ */}
        <section className="bg-e26-cream px-6 py-16 md:py-24">
          <div className="max-w-[720px] mx-auto">
            <h2 className="font-serif font-normal text-[26px] md:text-[34px] text-e26-text mb-10">
              Đổi lại — những gì tôi giữ được
            </h2>
            <ul className="space-y-6 font-sans text-[17px] leading-[1.6] text-e26-text-2">
              <li className="border-t border-e26-border pt-6">
                <span className="text-e26-text font-medium">Rõ ràng:</span> bạn luôn biết mình
                đang ở đâu trong hành trình.
              </li>
              <li className="border-t border-e26-border pt-6">
                <span className="text-e26-text font-medium">Riêng tư:</span> mọi điều bạn chia
                sẻ được giữ kín.
              </li>
              <li className="border-t border-e26-border pt-6">
                <span className="text-e26-text font-medium">Đúng nhịp:</span> không ai bị đẩy đi
                sâu hơn mức mình sẵn sàng.
              </li>
              <li className="border-t border-e26-border pt-6">
                <span className="text-e26-text font-medium">Quyền dừng:</span> bạn có thể dừng
                lại bất kỳ lúc nào, không cần giải thích.
              </li>
            </ul>
          </div>
        </section>

        {/* 4 — FAQ NGẮN */}
        <section className="max-w-[720px] mx-auto px-6 py-16 md:py-24">
          <h2 className="font-serif font-normal text-[26px] md:text-[34px] text-e26-text mb-10">
            Vài câu hỏi thật
          </h2>
          <div className="space-y-10">
            <div className="border-t border-e26-border pt-6">
              <p className="font-serif text-xl text-e26-text mb-3">
                &ldquo;Vậy Essence có chắc giúp được tôi không?&rdquo;
              </p>
              <p className="font-sans text-[16px] leading-[1.7] text-e26-text-2">
                Không ai trung thực hứa được điều đó. Điều tôi giữ được là một khoảng đủ yên để
                bạn tự nhìn rõ — phần còn lại là hành trình của bạn.
              </p>
            </div>
            <div className="border-t border-e26-border pt-6">
              <p className="font-serif text-xl text-e26-text mb-3">
                &ldquo;Đây có phải trị liệu tâm lý không?&rdquo;
              </p>
              <p className="font-sans text-[16px] leading-[1.7] text-e26-text-2">
                Không. Đây là coaching. Nếu bạn cần trị liệu lâm sàng, tôi sẽ nói thẳng.
              </p>
            </div>
            <div className="border-t border-e26-border pt-6">
              <p className="font-serif text-xl text-e26-text mb-3">
                &ldquo;AI có đọc chuyện của tôi không?&rdquo;
              </p>
              <p className="font-sans text-[16px] leading-[1.7] text-e26-text-2">
                Máy giúp tôi làm phần nặng phía sau, nhưng bản cuối luôn do tôi đọc và duyệt.
                Không có chuyện máy tự phán về bạn.
              </p>
            </div>
          </div>
        </section>

        {/* 5 — CTA (đúng 1 nút vàng) */}
        <section className="bg-e26-cream px-6 py-16 md:py-24 text-center">
          <h2 className="font-serif font-normal text-[26px] md:text-[32px] text-e26-text mb-10">
            Nếu cách làm việc này đúng với bạn
          </h2>
          <div className="flex flex-col items-center gap-6">
            <Link
              href="/ve-kenji"
              className="inline-block bg-e26-gold text-e26-black rounded-none font-sans font-medium text-[13px] tracking-[0.08em] uppercase px-10 py-4 hover:bg-e26-gold-deep hover:text-e26-ivory transition-colors duration-300"
            >
              Bắt đầu từ cửa phù hợp
            </Link>
            <Link
              href="/phuong-phap"
              className="font-sans text-[15px] text-e26-text-2 underline underline-offset-4 decoration-e26-border hover:text-e26-gold-deep hover:decoration-e26-gold transition-colors duration-300"
            >
              Đọc thêm về phương pháp
            </Link>
          </div>
        </section>
      </main>
      <HomeFooter />
    </>
  );
}
