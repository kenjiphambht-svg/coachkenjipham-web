import Head from "next/head";
import Link from "next/link";
import { SEO } from "@/components/SEO";
import HomeHeader from "@/components/homepage/HomeHeader";
import HomeFooter from "@/components/homepage/HomeFooter";

// ============================================================
// /phuong-phap — trang public-safe về phương pháp (noindex, chờ duyệt).
// Copy NGUYÊN VĂN theo task — không nhắc FCP/Casting/Gateway/chiêm tinh
// ở bất kỳ đâu. Section 5 (Ranh giới) nền tối — dark section duy nhất.
// Đúng 1 nút vàng (Section 6). Schema: Article.
//
// CTA cuối trỏ /ve-kenji (không phải trang chủ thật "/"): route sống
// "/" hiện vẫn là bản Coming Soon cũ (đã đọc src/pages/index.tsx xác
// nhận), chưa thay bằng nội dung "2 cửa" — đúng theo nhánh dự phòng
// task cho phép, và nhất quán với lựa chọn đã áp dụng ở
// /dieu-essence-khong-hua (CTA cùng dạng cũng trỏ /ve-kenji).
// ============================================================
export default function PhuongPhapPage() {
  return (
    <>
      <SEO
        title="Phương pháp Essence — nhìn rõ trước khi đi sâu (Bản nháp)"
        description="Phần lớn chúng ta không cần thêm một lời khuyên. Chúng ta cần được nhìn thấy đúng — rồi tự mình chọn bước tiếp theo."
        url="https://coachkenjipham.com/phuong-phap"
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
              headline: "Phương pháp Essence",
              description:
                "Phần lớn chúng ta không cần thêm một lời khuyên. Chúng ta cần được nhìn thấy đúng — rồi tự mình chọn bước tiếp theo.",
              author: { "@type": "Person", name: "Kenji Phạm" },
              publisher: { "@type": "Organization", name: "Essence Coaching System" },
              url: "https://coachkenjipham.com/phuong-phap",
            }),
          }}
        />
      </Head>

      <HomeHeader />
      <main className="bg-e26-ivory">
        {/* 1 — HERO */}
        <section className="max-w-[720px] mx-auto px-6 pt-16 pb-16 md:pt-24 md:pb-20">
          <p className="font-sans text-sm text-e26-text-2">Phương pháp Essence</p>
          <h1 className="font-serif font-light text-[34px] md:text-[48px] leading-[1.2] text-e26-text mt-4">
            Essence không bắt đầu bằng lời khuyên.
            <br />
            Essence bắt đầu bằng việc nhìn rõ.
          </h1>
          <p className="font-sans text-[17px] leading-[1.65] text-e26-text-2 mt-8 max-w-xl">
            Phần lớn chúng ta không cần thêm một lời khuyên. Chúng ta cần được nhìn thấy đúng —
            rồi tự mình chọn bước tiếp theo.
          </p>
        </section>

        {/* 2 — HAI KHÁI NIỆM NỀN */}
        <section className="bg-e26-white">
          <div className="max-w-[720px] mx-auto px-6 py-16 md:py-24">
            <h2 className="font-serif font-normal text-[26px] md:text-[34px] text-e26-text mb-10">
              Hai thứ đang âm thầm vận hành bên dưới
            </h2>
            <div className="space-y-10">
              <div>
                <h3 className="font-serif text-xl text-e26-text mb-3">Vòng lặp</h3>
                <p className="font-sans text-[17px] leading-[1.7] text-e26-text-2 max-w-xl">
                  Có những chuyện cứ lặp lại trong đời bạn — khác người, khác cảnh, nhưng cùng
                  một kịch bản. Công việc nào rồi cũng đi đến cùng một kiểu mệt. Mối quan hệ nào
                  rồi cũng chạm cùng một bức tường. Đó không phải xui. Đó là một vòng lặp — và
                  vòng lặp thì nhìn rõ được.
                </p>
              </div>
              <div>
                <h3 className="font-serif text-xl text-e26-text mb-3">Kiểu gồng</h3>
                <p className="font-sans text-[17px] leading-[1.7] text-e26-text-2 max-w-xl">
                  Mỗi người có một cách riêng để trụ qua giai đoạn khó: người thì ôm hết việc,
                  người thì im lặng chịu, người thì phải kiểm soát mọi thứ mới yên. Cách trụ đó
                  từng cứu bạn. Nhưng khi giai đoạn khó đã qua mà cách trụ vẫn còn — nó thành cái
                  gồng. Và gồng lâu thì mỏi, dù bề ngoài vẫn đang ổn.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 3 — BA GIAI ĐOẠN */}
        <section className="bg-e26-cream px-6 py-16 md:py-24">
          <div className="max-w-[720px] mx-auto">
            <h2 className="font-serif font-normal text-[26px] md:text-[34px] text-e26-text mb-12">
              Ba giai đoạn — không đường tắt
            </h2>
            <div className="space-y-10">
              <div className="border-t border-e26-border pt-6">
                <div className="flex items-baseline gap-4">
                  <span className="font-serif text-2xl text-e26-gold-deep" aria-hidden="true">1</span>
                  <h3 className="font-serif text-xl text-e26-text">Chill với cảm xúc</h3>
                </div>
                <p className="font-sans text-[15px] leading-[1.7] text-e26-text-2 mt-3 pl-9">
                  Trước khi làm gì, bạn cần một khoảng đủ yên để không bị cảm xúc lái. Không phân
                  tích vội. Không sửa vội. Chỉ ngồi lại được với chính mình đã.
                </p>
              </div>
              <div className="border-t border-e26-border pt-6">
                <div className="flex items-baseline gap-4">
                  <span className="font-serif text-2xl text-e26-gold-deep" aria-hidden="true">2</span>
                  <h3 className="font-serif text-xl text-e26-text">Thách thức giới hạn</h3>
                </div>
                <p className="font-sans text-[15px] leading-[1.7] text-e26-text-2 mt-3 pl-9">
                  Khi đã đủ yên, mình mới nhìn thẳng vào vòng lặp và kiểu gồng — bằng những câu
                  hỏi bạn chưa từng được hỏi. Không để phán xét. Để bạn thấy rõ.
                </p>
              </div>
              <div className="border-t border-e26-border pt-6">
                <div className="flex items-baseline gap-4">
                  <span className="font-serif text-2xl text-e26-gold-deep" aria-hidden="true">3</span>
                  <h3 className="font-serif text-xl text-e26-text">Hiện thực ước mơ</h3>
                </div>
                <p className="font-sans text-[15px] leading-[1.7] text-e26-text-2 mt-3 pl-9">
                  Nhìn rõ rồi mới xây. Không phải kế hoạch đẹp trên giấy — là những bước thật,
                  theo nhịp thật của đời sống bạn đang có.
                </p>
              </div>
            </div>
            <p className="font-sans text-[15px] leading-[1.7] text-e26-text mt-10 max-w-xl border-l border-e26-gold pl-6">
              Thứ tự này không đảo được. Essence không đưa ai đi sâu khi họ chưa đủ vững — đó là
              nguyên tắc, không phải chiến thuật.
            </p>
          </div>
        </section>

        {/* 4 — AI ĐỨNG SAU, KENJI ĐỨNG TRƯỚC */}
        <section className="max-w-[720px] mx-auto px-6 py-16 md:py-24">
          <h2 className="font-serif font-normal text-[26px] md:text-[34px] text-e26-text mb-8">
            Phía sau là hệ thống. Bản cuối là con người.
          </h2>
          <div className="space-y-5 font-sans text-[17px] leading-[1.7] text-e26-text-2 max-w-xl">
            <p>
              Phía sau Essence là một hệ vận hành AI được thiết kế riêng — giúp tôi đọc sâu hơn,
              cấu trúc kỹ hơn, và giữ chất lượng đều tay ở mọi ấn phẩm.
            </p>
            <p>
              Nhưng có một luật không đổi: mọi bản cuối cùng gửi đến bạn đều do chính tôi đọc và
              duyệt. AI không quyết định thay ai điều gì. Máy làm phần nặng. Người giữ phần
              thật.
            </p>
          </div>
        </section>

        {/* 5 — RANH GIỚI (dark silence section duy nhất) */}
        <section className="bg-e26-black px-6 py-24 md:py-[180px]">
          <div className="max-w-[640px] mx-auto text-center">
            <div className="w-12 h-px bg-e26-gold mx-auto mb-14" aria-hidden="true" />
            <h2 className="font-serif font-normal text-[28px] md:text-[40px] text-e26-text-dark mb-14">
              Phương pháp này không dành cho mọi tình huống
            </h2>
            <div className="space-y-7 font-sans text-[17px] leading-[1.8] text-e26-text-dark text-left md:text-center max-w-xl mx-auto">
              <p>
                Essence là coaching — không phải chăm sóc sức khỏe tinh thần chuyên môn. Nếu bạn
                đang trong khủng hoảng cấp tính, điều bạn cần trước tiên là chuyên gia tâm lý lâm
                sàng — và tôi sẽ nói thẳng điều đó, thay vì nhận một ca ngoài phạm vi của mình.
              </p>
              <p>
                Essence cũng không có đường tắt. Không cam kết thay đổi nhanh. Không đoán trước
                tương lai của bạn hay của con bạn.
              </p>
            </div>
          </div>
        </section>

        {/* 6 — CTA (đúng 1 nút vàng) */}
        <section className="max-w-[720px] mx-auto px-6 py-16 md:py-24 text-center">
          <h2 className="font-serif font-normal text-[26px] md:text-[32px] text-e26-text mb-10">
            Nếu cách làm này đúng nhịp với bạn
          </h2>
          <div className="flex flex-col items-center gap-6">
            <Link
              href="/ve-kenji"
              className="inline-block bg-e26-gold text-e26-black rounded-none font-sans font-medium text-[13px] tracking-[0.08em] uppercase px-10 py-4 hover:bg-e26-gold-deep hover:text-e26-ivory transition-colors duration-300"
            >
              Bắt đầu từ cửa phù hợp
            </Link>
            <Link
              href="/dieu-essence-khong-hua"
              className="font-sans text-[15px] text-e26-text-2 underline underline-offset-4 decoration-e26-border hover:text-e26-gold-deep transition-colors"
            >
              Đọc thêm: Điều Essence không hứa
            </Link>
          </div>
        </section>
      </main>
      <HomeFooter />
    </>
  );
}
