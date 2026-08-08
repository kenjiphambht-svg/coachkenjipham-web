import Head from "next/head";
import Link from "next/link";
import { SEO } from "@/components/SEO";
import HomeFooter from "@/components/homepage/HomeFooter";
import HomeHeader from "@/components/homepage/HomeHeader";
import { PhuongPhapImageSlot } from "@/components/phuong-phap/PhuongPhapImageSlot";
import {
  EssenceAccent,
  EssenceAnchor,
  EssenceBody,
  EssenceDisplay,
  EssenceUtility,
} from "@/components/phuong-phap/PhuongPhapTypography";
import { usePhuongPhapReveal } from "@/components/phuong-phap/usePhuongPhapReveal";
import styles from "@/styles/phuong-phap.module.css";

const pageTitle = "Phương pháp Essence | Kenji Phạm — Essence Coaching";
const pageDescription =
  "Khám phá cách Essence kết hợp coaching, tâm lý chiều sâu, tâm lý nguyên mẫu và khoa học thần kinh qua ba chuyển động: Chill với cảm xúc, Thách thức giới hạn và Hiện thực ước mơ.";

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Kenji Phạm",
  jobTitle: "Huấn luyện viên Tâm lý Chiều sâu",
  description:
    "Kenji Phạm là huấn luyện viên tâm lý chiều sâu tại Sài Gòn, người sáng lập Essence Coaching.",
  worksFor: {
    "@type": "Organization",
    name: "Essence Coaching",
    url: "https://coachkenjipham.com",
  },
  address: {
    "@type": "PostalAddress",
    addressLocality: "Sài Gòn",
    addressCountry: "VN",
  },
  url: "https://coachkenjipham.com/ve-kenji",
};

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Phương pháp Essence",
  description: pageDescription,
  author: personSchema,
  publisher: { "@type": "Organization", name: "Essence Coaching" },
  url: "https://coachkenjipham.com/phuong-phap",
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Trang chủ",
      item: "https://coachkenjipham.com/",
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Phương pháp",
      item: "https://coachkenjipham.com/phuong-phap",
    },
  ],
};

const textLink =
  "inline-flex min-h-11 items-center border-b border-e26-text pb-0.5 font-sans text-[15px] font-medium text-e26-text transition-colors duration-300 hover:border-e26-gold-deep hover:text-e26-gold-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-e26-gold focus-visible:ring-offset-4";

export default function PhuongPhapPage() {
  usePhuongPhapReveal();

  return (
    <>
      <SEO
        title={pageTitle}
        description={pageDescription}
        image="/essence-og-1200x630.png"
        url="https://coachkenjipham.com/phuong-phap"
        type="article"
      />
      <Head>
        <meta name="robots" content="noindex, nofollow" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />
      </Head>

      <HomeHeader />

      <main className={`${styles.page} overflow-x-clip text-e26-text`}>
        <section className="bg-e26-ivory px-6 pb-24 pt-16 md:px-8 md:pb-32 md:pt-24 lg:px-12 lg:pb-36 lg:pt-28">
          <div className="mx-auto grid max-w-[1180px] items-start gap-16 lg:grid-cols-12 lg:gap-12">
            <div
              className={`${styles.reveal} lg:col-span-7 lg:pt-12`}
              data-phuong-phap-reveal
            >
              <EssenceUtility as="p" className="mb-8 md:mb-10">
                Phương pháp Essence
              </EssenceUtility>
              <EssenceDisplay as="h1">
                Có những chuyện mình biết rất rõ — mà vẫn cứ lặp lại.
              </EssenceDisplay>
              <div className="mt-10 space-y-5 md:mt-12">
                <EssenceBody as="p">
                  Mình biết đã quá mệt, nhưng ai nhờ vẫn nhận thêm.
                </EssenceBody>
                <EssenceBody as="p">
                  Biết cuộc nói chuyện ấy cần diễn ra, nhưng vẫn nghĩ:
                </EssenceBody>
                <EssenceAccent as="p" className="max-w-[520px]">
                  “Đợi lúc nào phù hợp hơn.”
                </EssenceAccent>
                <EssenceBody as="p">
                  Biết mình không muốn phản ứng như vậy với người thân, nhưng khi chuyện xảy ra,
                  cách cũ vẫn đến trước.
                </EssenceBody>
              </div>

              <div className="mt-12 space-y-3 border-l border-e26-border pl-6 md:mt-16 md:pl-8">
                <EssenceBody as="p">Có người cứ đi quá nhanh.</EssenceBody>
                <EssenceBody as="p">Có người nghĩ rất lâu mà vẫn chưa bước.</EssenceBody>
                <EssenceBody as="p">Có người luôn làm thêm một chút.</EssenceBody>
                <EssenceBody as="p">
                  Có người chờ thêm một dấu hiệu, thêm một lần chắc chắn.
                </EssenceBody>
              </div>

              <div className="mt-12 space-y-5 md:mt-16">
                <EssenceBody as="p">Bề ngoài rất khác nhau.</EssenceBody>
                <EssenceBody as="p">
                  Nhưng đôi khi, phía dưới vẫn là cùng một chuyện:
                </EssenceBody>
                <EssenceAnchor as="p" level="h3" className="max-w-[620px] pt-2">
                  Một cách sống cũ đang âm thầm lựa chọn thay mình.
                </EssenceAnchor>
              </div>
            </div>

            <div
              className={`${styles.reveal} mx-auto w-full max-w-[430px] lg:col-span-5 lg:mx-0 lg:max-w-none`}
              data-phuong-phap-reveal
            >
              <PhuongPhapImageSlot ratio="portrait" />
            </div>
          </div>
        </section>

        <section className="bg-e26-cream px-6 py-24 md:px-8 md:py-32 lg:py-36">
          <div
            className={`${styles.reveal} mx-auto max-w-[660px]`}
            data-phuong-phap-reveal
          >
            <EssenceAnchor as="h2" className="mb-12 md:mb-16">
              Essence bắt đầu ở một chỗ khác
            </EssenceAnchor>
            <div className="space-y-6">
              <EssenceBody as="p">
                Essence không bắt đầu bằng việc sửa một con người.
              </EssenceBody>
              <EssenceBody as="p">
                Cũng không bảo họ phải sống nhanh hơn, chậm hơn hay trở thành một phiên bản khác
                của chính mình.
              </EssenceBody>
              <EssenceBody as="p">
                Essence tạo đủ khoảng để một người nhìn rõ điều đang thật sự vận hành bên dưới
                những phản ứng, lựa chọn và vòng lặp của mình — rồi tự chọn điều phù hợp hơn để
                làm tiếp.
              </EssenceBody>
            </div>

            <div className="mt-14 space-y-5 md:mt-20">
              <EssenceBody as="p">
                Một người luôn nhận thêm việc có thể không chỉ vì họ chăm chỉ.
              </EssenceBody>
              <EssenceBody as="p">
                Một người trì hoãn có thể không chỉ vì họ thiếu kỷ luật.
              </EssenceBody>
              <EssenceBody as="p">
                Một cơn giận có thể không chỉ bắt đầu từ chuyện vừa xảy ra.
              </EssenceBody>
              <EssenceBody as="p">
                Và có lúc mình tưởng mình đang suy nghĩ cho kỹ, nhưng thật ra đã đứng quá lâu
                trước một điều mình biết cần phải chọn.
              </EssenceBody>
            </div>

            <div className="mt-16 border-t border-e26-border pt-12 md:mt-24 md:pt-16">
              <EssenceBody as="p">Tôi không tìm một cái nhãn để giải thích bạn.</EssenceBody>
              <EssenceBody as="p" className="mt-5">
                Tôi quan tâm hơn đến:
              </EssenceBody>
              <div className="mt-10 space-y-6 md:mt-12 md:space-y-8">
                <EssenceAnchor as="p" level="h3">
                  Điều gì đang thật sự dẫn nhịp mình?
                </EssenceAnchor>
                <EssenceAnchor as="p" level="h3">
                  Điều gì vẫn còn phù hợp?
                </EssenceAnchor>
                <EssenceAnchor as="p" level="h3">
                  Và điều gì đã đến lúc mình chọn lại?
                </EssenceAnchor>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-e26-ivory px-6 py-24 md:px-8 md:py-32 lg:py-36">
          <div className="mx-auto max-w-[1120px]">
            <div
              className={`${styles.reveal} max-w-[720px]`}
              data-phuong-phap-reveal
            >
              <EssenceAnchor as="h2" className="mb-8 md:mb-10">
                Phía sau cách tôi làm việc
              </EssenceAnchor>
              <EssenceBody as="p">
                Phía sau cách tôi nghe, hỏi và cùng một người nhìn lại điều đang xảy ra là bốn
                nền tri thức.
              </EssenceBody>
            </div>

            <div className="mt-16 grid gap-x-16 gap-y-12 md:mt-24 md:grid-cols-2 md:gap-y-16">
              <article
                className={`${styles.reveal} border-t border-e26-border pt-7`}
                data-phuong-phap-reveal
              >
                <EssenceAnchor as="h3" level="h3" className="mb-5">
                  Coaching
                </EssenceAnchor>
                <EssenceBody as="p" className="max-w-none">
                  giữ quyền lựa chọn ở chính người đang sống cuộc đời ấy. Tôi có thể hỏi, phản
                  chiếu và cùng bạn làm rõ — nhưng không quyết định thay bạn.
                </EssenceBody>
              </article>
              <article
                className={`${styles.reveal} border-t border-e26-border pt-7`}
                data-phuong-phap-reveal
              >
                <EssenceAnchor as="h3" level="h3" className="mb-5">
                  Tâm lý chiều sâu
                </EssenceAnchor>
                <EssenceBody as="p" className="max-w-none">
                  giúp nhìn xa hơn chuyện đang xảy ra trên bề mặt, để nhận ra những vòng lặp và
                  cách phản ứng đã theo mình từ lâu.
                </EssenceBody>
              </article>
              <article
                className={`${styles.reveal} border-t border-e26-border pt-7`}
                data-phuong-phap-reveal
              >
                <EssenceAnchor as="h3" level="h3" className="mb-5">
                  Tâm lý nguyên mẫu
                </EssenceAnchor>
                <EssenceBody as="p" className="max-w-none">
                  giúp nhìn những vai mình có thể đã quen sống: người phải mạnh, người phải đúng,
                  người luôn lo cho tất cả. Đó là chiếc gương để nhìn, không phải chiếc nhãn để
                  định nghĩa bạn.
                </EssenceBody>
              </article>
              <article
                className={`${styles.reveal} border-t border-e26-border pt-7`}
                data-phuong-phap-reveal
              >
                <EssenceAnchor as="h3" level="h3" className="mb-5">
                  Khoa học thần kinh
                </EssenceAnchor>
                <EssenceBody as="p" className="max-w-none">
                  giúp hiểu vì sao có những điều đầu mình đã biết nhưng phản ứng cũ vẫn đến rất
                  nhanh — và vì sao hiểu một điều chưa chắc đã lập tức sống khác được.
                </EssenceBody>
              </article>
            </div>

            <div
              className={`${styles.reveal} mt-20 max-w-[720px] md:mt-28 lg:ml-auto`}
              data-phuong-phap-reveal
            >
              <EssenceBody as="p">Bốn nền ấy nằm phía sau.</EssenceBody>
              <EssenceBody as="p" className="mt-3">
                Ở phía trước vẫn là:
              </EssenceBody>
              <EssenceAnchor as="p" className="mt-8 max-w-[650px] md:mt-10">
                một người đang sống một chuyện thật trong đời mình.
              </EssenceAnchor>
              <EssenceBody as="p" className="mt-8 md:mt-10">
                Và cách tôi làm việc với câu chuyện ấy đi qua ba chuyển động.
              </EssenceBody>
            </div>
          </div>
        </section>

        <section className="bg-e26-cream px-6 py-24 md:px-8 md:py-36 lg:py-40">
          <div className="mx-auto grid max-w-[1120px] items-start gap-16 lg:grid-cols-12 lg:gap-20">
            <div
              className={`${styles.reveal} lg:col-span-5`}
              data-phuong-phap-reveal
            >
              <EssenceUtility variant="numeral" as="p" className="mb-8">
                01
              </EssenceUtility>
              <EssenceAnchor as="h2" className="max-w-[480px]">
                Chill với cảm xúc
              </EssenceAnchor>
              <PhuongPhapImageSlot
                ratio="editorial"
                className="mx-auto mt-14 max-w-[390px] md:mt-20 lg:mx-0"
              />
            </div>

            <div
              className={`${styles.reveal} lg:col-span-7 lg:pt-28`}
              data-phuong-phap-reveal
            >
              <div className="space-y-5">
                <EssenceBody as="p">Khi giận, mình thường muốn phản ứng ngay.</EssenceBody>
                <EssenceBody as="p">Khi sợ, mình muốn thoát khỏi cảm giác ấy.</EssenceBody>
                <EssenceBody as="p">Khi buồn, có người làm mình bận hơn.</EssenceBody>
                <EssenceBody as="p">Có người phân tích.</EssenceBody>
                <EssenceBody as="p">Có người cố tỏ ra ổn.</EssenceBody>
              </div>

              <div className="my-14 border-y border-e26-border py-10 md:my-20 md:py-12">
                <EssenceAccent as="p" className="max-w-[620px]">
                  Chill với cảm xúc không phải làm cho mình hết cảm xúc.
                </EssenceAccent>
                <EssenceBody as="p" className="mt-7">
                  Nó là hiểu điều mình đang thật sự cảm thấy — không chống lại, không bỏ qua và
                  không để cảm xúc lập tức quyết định thay mình.
                </EssenceBody>
              </div>

              <div className="space-y-5">
                <EssenceBody as="p">Mình vẫn có thể giận.</EssenceBody>
                <EssenceBody as="p">Vẫn sợ.</EssenceBody>
                <EssenceBody as="p">Vẫn chưa biết phải làm gì.</EssenceBody>
                <EssenceBody as="p" className="pt-4">
                  Nhưng khi không cần phản ứng ngay, một khoảng bắt đầu xuất hiện.
                </EssenceBody>
                <EssenceBody as="p">Đủ để mình nhìn rõ hơn:</EssenceBody>
              </div>

              <div className="mt-10 space-y-5 border-l border-e26-border pl-6 md:pl-8">
                <EssenceBody as="p">Chuyện gì đang thật sự xảy ra?</EssenceBody>
                <EssenceBody as="p">Điều gì vừa chạm vào mình?</EssenceBody>
                <EssenceBody as="p">
                  Và phản ứng này có còn là cách mình muốn sống không?
                </EssenceBody>
              </div>

              <div className="mt-16 space-y-5 md:mt-20">
                <EssenceBody as="p">Khoảng ấy không phải nơi để đứng yên mãi.</EssenceBody>
                <EssenceBody as="p">Có lúc mình đã đi quá nhanh và cần dừng.</EssenceBody>
                <EssenceBody as="p">
                  Nhưng cũng có lúc mình đã nghĩ đủ lâu, chuẩn bị đủ nhiều và chờ đủ lâu.
                </EssenceBody>
                <EssenceBody as="p">
                  Khi ấy, điều cần thiết có thể đơn giản là:
                </EssenceBody>
                <EssenceAnchor as="p" level="h3" className="pt-4">
                  đã đến lúc bước.
                </EssenceAnchor>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-e26-ivory px-6 py-24 md:px-8 md:py-36 lg:py-40">
          <div className="mx-auto max-w-[1120px]">
            <div
              className={`${styles.reveal} grid gap-8 border-b border-e26-border pb-16 md:grid-cols-12 md:pb-24`}
              data-phuong-phap-reveal
            >
              <EssenceUtility variant="numeral" as="p" className="md:col-span-3">
                02
              </EssenceUtility>
              <EssenceAnchor as="h2" className="md:col-span-8">
                Thách thức giới hạn
              </EssenceAnchor>
            </div>

            <div className="mt-16 grid gap-16 md:mt-24 lg:grid-cols-12 lg:gap-20">
              <div
                className={`${styles.reveal} space-y-5 lg:col-span-5`}
                data-phuong-phap-reveal
              >
                <EssenceBody as="p">
                  Nhìn ra một điều chưa có nghĩa là mình đã thay đổi nó.
                </EssenceBody>
                <EssenceBody as="p">Mình có thể biết:</EssenceBody>
                <EssenceAccent as="p" className="py-5">
                  “Mỗi lần sợ mất lòng, tôi lại nói đồng ý.”
                </EssenceAccent>
                <EssenceBody as="p">Nhưng lần sau vẫn nhận thêm.</EssenceBody>
                <EssenceBody as="p" className="pt-5">
                  Mình có thể biết mình trì hoãn vì sợ làm chưa đủ tốt.
                </EssenceBody>
                <EssenceBody as="p">Nhưng rồi vẫn chuẩn bị thêm.</EssenceBody>
                <EssenceBody as="p">Đọc thêm.</EssenceBody>
                <EssenceBody as="p">Chờ thêm.</EssenceBody>
              </div>

              <div
                className={`${styles.reveal} lg:col-span-7`}
                data-phuong-phap-reveal
              >
                <EssenceBody as="p">
                  Thách thức giới hạn không phải chống lại bản thân.
                </EssenceBody>
                <EssenceBody as="p" className="mt-5">
                  Nó bắt đầu bằng một câu hỏi:
                </EssenceBody>
                <EssenceAnchor as="h3" level="h3" className="my-12 max-w-[680px] md:my-16">
                  Nếu đã nhìn thấy cách cũ rồi, lần này mình có dám chọn khác đi không?
                </EssenceAnchor>

                <div className="space-y-0 border-t border-e26-border">
                  {[
                    "Có thể là nói “không” ở nơi mình vẫn luôn nói “được”.",
                    "Có thể là chưa trả lời khi mình còn đang giận.",
                    "Có thể là thôi giữ một vai đã khiến mình mệt quá lâu.",
                    "Có thể là bước dù chưa thể biết hết mọi chuyện phía trước.",
                  ].map((item) => (
                    <EssenceBody
                      as="p"
                      className="max-w-none border-b border-e26-border py-6 md:py-7"
                      key={item}
                    >
                      {item}
                    </EssenceBody>
                  ))}
                </div>

                <div className="mt-14 space-y-5 md:mt-20">
                  <EssenceBody as="p">
                    Điều quan trọng không phải mình đi nhanh hay chậm.
                  </EssenceBody>
                  <EssenceBody as="p">Mà là bắt đầu nhận ra:</EssenceBody>
                  <EssenceBody as="p" className="text-e26-text">
                    đâu là lựa chọn quen thuộc, và đâu là lựa chọn mình thật sự muốn sống.
                  </EssenceBody>
                </div>

                <div className="mt-14 space-y-5 md:mt-20">
                  <EssenceBody as="p">
                    Có những cách từng giúp mình đi qua một giai đoạn.
                  </EssenceBody>
                  <EssenceBody as="p">
                    Nhưng điều từng cần thiết không nhất thiết phải trở thành cách mình sống mãi.
                  </EssenceBody>
                  <EssenceBody as="p" className="pt-3">
                    Đến một lúc nào đó, câu hỏi không còn là:
                  </EssenceBody>
                  <EssenceAccent as="p">“Tại sao tôi lại như vậy?”</EssenceAccent>
                  <EssenceBody as="p">Mà là:</EssenceBody>
                  <EssenceAnchor as="p" level="h3" className="pt-4">
                    Từ đây, tôi muốn sống thế nào?
                  </EssenceAnchor>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-e26-cream px-6 py-24 md:px-8 md:py-36 lg:py-40">
          <div className="mx-auto grid max-w-[1120px] items-start gap-16 lg:grid-cols-12 lg:gap-20">
            <div
              className={`${styles.reveal} order-2 lg:order-1 lg:col-span-5 lg:pt-36`}
              data-phuong-phap-reveal
            >
              <PhuongPhapImageSlot ratio="portrait" className="mx-auto max-w-[430px] lg:mx-0" />
            </div>

            <div
              className={`${styles.reveal} order-1 lg:order-2 lg:col-span-7`}
              data-phuong-phap-reveal
            >
              <EssenceUtility variant="numeral" as="p" className="mb-8">
                03
              </EssenceUtility>
              <EssenceAnchor as="h2" className="mb-14 md:mb-20">
                Hiện thực ước mơ
              </EssenceAnchor>

              <div className="space-y-5">
                <EssenceBody as="p">
                  Nhìn ra mình muốn gì vẫn chưa làm cuộc đời thay đổi.
                </EssenceBody>
                <EssenceBody as="p">
                  Một điều được hiểu bên trong cần có một hình hài ở bên ngoài.
                </EssenceBody>
              </div>

              <div className="mt-12 space-y-5 md:mt-16">
                <EssenceBody as="p">
                  Biết mình cần một ranh giới chưa phải là có ranh giới.
                </EssenceBody>
                <EssenceBody as="p">Một lúc nào đó, mình phải nói câu cần nói.</EssenceBody>
                <EssenceBody as="p" className="pt-3">
                  Biết mình muốn gần gia đình hơn chưa làm lịch sống thay đổi.
                </EssenceBody>
                <EssenceBody as="p">Một lúc nào đó, mình phải dành chỗ cho điều ấy.</EssenceBody>
                <EssenceBody as="p" className="pt-3">
                  Biết mình muốn một hướng khác chưa làm cuộc đời rẽ hướng.
                </EssenceBody>
                <EssenceBody as="p">Một lúc nào đó, mình phải bắt đầu.</EssenceBody>
              </div>

              <EssenceAnchor as="h3" level="h3" className="my-14 max-w-[650px] md:my-20">
                Hiện thực ước mơ là đưa điều mình muốn sống vào những lựa chọn có thật.
              </EssenceAnchor>

              <div className="space-y-4 border-l border-e26-border pl-6 md:pl-8">
                <EssenceBody as="p">Một cuộc trò chuyện.</EssenceBody>
                <EssenceBody as="p">Một ranh giới.</EssenceBody>
                <EssenceBody as="p">Một cách dùng thời gian khác.</EssenceBody>
                <EssenceBody as="p">Một quyết định.</EssenceBody>
                <EssenceBody as="p">Một việc bắt đầu.</EssenceBody>
                <EssenceBody as="p">Một việc dừng lại.</EssenceBody>
              </div>

              <div className="mt-14 space-y-5 md:mt-20">
                <EssenceBody as="p">
                  Không phải nghĩ đủ mạnh để điều mình muốn tự xuất hiện.
                </EssenceBody>
                <EssenceBody as="p">
                  Mà là để điều mình đã nhìn thấy bên trong bắt đầu có mặt trong cách mình sống
                  bên ngoài.
                </EssenceBody>
                <EssenceBody as="p" className="pt-3">
                  Và thay đổi không nhất thiết phải bắt đầu thật lớn.
                </EssenceBody>
                <EssenceBody as="p">
                  Đôi khi, một cách sống mới bắt đầu từ một lựa chọn nhỏ nhưng mình có thể thực sự
                  giữ được.
                </EssenceBody>
              </div>

              <EssenceAccent as="p" className="my-14 max-w-[620px] md:my-20">
                Ước mơ bắt đầu trở thành đời sống khi nó có mặt trong một ngày bình thường.
              </EssenceAccent>

              <div className="space-y-5">
                <EssenceBody as="p">
                  Với ESSENCE, câu chuyện cũng không dừng ở việc hiểu mình hơn hay yên hơn bên
                  trong.
                </EssenceBody>
                <EssenceBody as="p">
                  Từ một nền đủ vững, mỗi người có thể tiếp tục lựa chọn, hành động và kiến tạo
                  những điều thật sự quan trọng với mình.
                </EssenceBody>
              </div>

              <div className="mt-10 space-y-3">
                <EssenceBody as="p">Một sự nghiệp.</EssenceBody>
                <EssenceBody as="p">Một mối quan hệ.</EssenceBody>
                <EssenceBody as="p">Một gia đình.</EssenceBody>
                <EssenceBody as="p">Nhiều tự do hơn.</EssenceBody>
                <EssenceBody as="p">
                  Hay một đời sống đủ đầy theo cách riêng của chính mình.
                </EssenceBody>
              </div>

              <div className="mt-14 space-y-5 border-t border-e26-border pt-10 md:mt-20 md:pt-12">
                <EssenceBody as="p">ESSENCE gọi hướng ấy là An Thịnh.</EssenceBody>
                <EssenceBody as="p">Không có một thước đo chung cho chữ “Thịnh”.</EssenceBody>
                <EssenceBody as="p">Và không ai có thể tạo ra đời sống ấy thay bạn.</EssenceBody>
              </div>
            </div>
          </div>
        </section>

        <section className="flex bg-e26-ivory px-6 py-28 md:min-h-[68vh] md:items-center md:px-8 md:py-36 lg:py-40">
          <div
            className={`${styles.reveal} ${styles.signalReveal} mx-auto max-w-[980px] text-center`}
            data-phuong-phap-reveal
          >
            <EssenceAnchor as="h2" className="mx-auto max-w-[900px] text-[42px] leading-[1.06] md:text-[68px] md:leading-[1.02]">
              Nhìn ra một điều chưa làm đời mình thay đổi.
            </EssenceAnchor>
            <EssenceAccent as="p" className="mx-auto mt-12 max-w-[700px] md:mt-16">
              Điều quan trọng là mình có thể sống khác đi từ điều vừa nhìn thấy.
            </EssenceAccent>
          </div>
        </section>

        <section className="bg-e26-cream-deep px-6 py-24 md:px-8 md:py-32">
          <div
            className={`${styles.reveal} mx-auto grid max-w-[980px] gap-12 md:grid-cols-12 md:gap-16`}
            data-phuong-phap-reveal
          >
            <EssenceAnchor as="h2" className="md:col-span-5">
              Có những giới hạn tôi không bước qua.
            </EssenceAnchor>
            <div className="space-y-5 md:col-span-7 md:pt-2">
              <EssenceBody as="p">Tôi không chẩn đoán một con người.</EssenceBody>
              <EssenceBody as="p">
                Không dùng tâm lý hay nguyên mẫu để đóng họ vào một kiểu cố định.
              </EssenceBody>
              <EssenceBody as="p">
                Không dùng khoa học thần kinh để hứa một kết quả.
              </EssenceBody>
              <EssenceBody as="p">
                Không quyết định thay người mình đang đồng hành.
              </EssenceBody>
              <EssenceBody as="p">
                Và coaching không thay thế hỗ trợ chuyên môn về sức khỏe tâm thần khi đó mới là
                điều một người cần.
              </EssenceBody>
              <EssenceBody as="p" className="pt-4">
                Có lúc điều trung thực nhất tôi có thể nói là:
              </EssenceBody>
              <EssenceAccent as="p" className="py-3">
                “Việc này nằm ngoài phạm vi của tôi.”
              </EssenceAccent>
              <Link
                href="/dieu-essence-khong-hua"
                className={`${textLink} focus-visible:ring-offset-e26-cream-deep`}
              >
                Những điều Essence không hứa →
              </Link>
            </div>
          </div>
        </section>

        <section className="bg-e26-ivory px-6 py-24 md:px-8 md:py-36 lg:py-40">
          <div className="mx-auto max-w-[1120px]">
            <div
              className={`${styles.reveal} max-w-[760px]`}
              data-phuong-phap-reveal
            >
              <EssenceAnchor as="h2" className="mb-10">
                Mỗi câu chuyện sẽ dẫn bạn đến một cánh cửa khác.
              </EssenceAnchor>
              <div className="space-y-5">
                <EssenceBody as="p">
                  Đến đây, có lẽ bạn đã hiểu thêm một chút về cách ESSENCE nhìn một con người.
                </EssenceBody>
                <EssenceBody as="p">Nhưng phương pháp chỉ là một phần của câu chuyện.</EssenceBody>
                <EssenceBody as="p">
                  Có thể điều khiến bạn tò mò tiếp theo là người đứng phía sau cách làm này.
                </EssenceBody>
                <EssenceBody as="p">
                  Có thể là những điều đang diễn ra trong chính đời sống của mình.
                </EssenceBody>
                <EssenceBody as="p">
                  Hoặc có thể, điều bạn đang muốn nhìn gần hơn lại là đứa trẻ đang lớn lên bên
                  cạnh mình.
                </EssenceBody>
                <EssenceBody as="p" className="pt-3 text-e26-text">
                  Ba cánh cửa dưới đây bắt đầu từ ba câu chuyện khác nhau.
                </EssenceBody>
              </div>
            </div>

            <div className="mt-16 grid gap-16 md:mt-24 md:grid-cols-2 lg:grid-cols-3 lg:gap-10">
              <article
                className={`${styles.reveal} flex flex-col`}
                data-phuong-phap-reveal
              >
                <PhuongPhapImageSlot ratio="portrait" />
                <EssenceAnchor as="h3" level="h3" className="mt-8">
                  Người đứng sau ESSENCE
                </EssenceAnchor>
                <div className="mt-6 flex-1 space-y-4">
                  <EssenceBody as="p" className="max-w-none">
                    Không chỉ là tôi đã học gì.
                  </EssenceBody>
                  <EssenceBody as="p" className="max-w-none">
                    Mà là điều gì đã hình thành cách tôi nhìn một con người, điều tôi tin trong
                    công việc này và vì sao tôi chọn đứng bên cạnh thay vì quyết định thay họ.
                  </EssenceBody>
                </div>
                <Link href="/ve-kenji" className={`${textLink} mt-8 self-start`}>
                  Gặp Kenji →
                </Link>
              </article>

              <article
                className={`${styles.reveal} flex flex-col md:translate-y-12 lg:translate-y-16`}
                data-phuong-phap-reveal
              >
                <PhuongPhapImageSlot ratio="portrait" />
                <EssenceAnchor as="h3" level="h3" className="mt-8">
                  Câu chuyện của chính bạn
                </EssenceAnchor>
                <div className="mt-6 flex-1 space-y-4">
                  <EssenceBody as="p" className="max-w-none">
                    Có những vòng lặp mình đã nhận ra.
                  </EssenceBody>
                  <EssenceBody as="p" className="max-w-none">
                    Có những lựa chọn vẫn chưa rõ.
                  </EssenceBody>
                  <EssenceBody as="p" className="max-w-none">
                    Và cũng có những lúc mình biết khá nhiều về bản thân nhưng vẫn chưa hiểu điều
                    gì đang thật sự dẫn nhịp đời sống của mình.
                  </EssenceBody>
                </div>
                <Link href="/ban-sac-cua-ban" className={`${textLink} mt-8 self-start`}>
                  Tôi muốn nhìn về phía chính mình →
                </Link>
              </article>

              <article
                className={`${styles.reveal} flex flex-col md:col-span-2 md:max-w-[calc(50%_-_2rem)] lg:col-span-1 lg:max-w-none`}
                data-phuong-phap-reveal
              >
                <PhuongPhapImageSlot ratio="portrait" />
                <EssenceAnchor as="h3" level="h3" className="mt-8">
                  Câu chuyện của con
                </EssenceAnchor>
                <div className="mt-6 flex-1 space-y-4">
                  <EssenceBody as="p" className="max-w-none">
                    Một đứa trẻ không cần thêm một chiếc nhãn để người lớn hiểu con nhanh hơn.
                  </EssenceBody>
                  <EssenceBody as="p" className="max-w-none">
                    Đôi khi, điều cần thiết hơn là một cách nhìn đủ gần để nhận ra đứa trẻ đang
                    thật sự lớn lên như thế nào — trước khi vội nói con nên trở thành ai.
                  </EssenceBody>
                </div>
                <Link href="/ban-sac-cua-con" className={`${textLink} mt-8 self-start`}>
                  Tôi đang muốn hiểu con rõ hơn →
                </Link>
              </article>
            </div>
          </div>
        </section>

        <section className="bg-e26-cream px-6 py-28 md:px-8 md:py-40 lg:py-44">
          <div
            className={`${styles.reveal} mx-auto max-w-[780px]`}
            data-phuong-phap-reveal
          >
            <EssenceAnchor as="h2" className="max-w-[760px]">
              Bạn không cần trở thành một người khác để bắt đầu sống khác đi.
            </EssenceAnchor>
            <EssenceBody as="p" className="mt-12 md:mt-16">
              Có khi mình chỉ cần nhìn đủ rõ để nhận ra:
            </EssenceBody>
            <EssenceAccent as="p" className="mt-8 max-w-[640px] md:mt-10">
              điều gì đã đến lúc dừng,
              <br />
              điều gì đáng giữ,
              <br />
              và điều gì đã đến lúc mình dám bước.
            </EssenceAccent>
          </div>
        </section>
      </main>

      <HomeFooter />
    </>
  );
}
