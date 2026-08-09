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
  EssenceLeadIn,
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

const foundations = [
  {
    name: "Tâm lý chiều sâu",
    copy: "giúp nhìn xa hơn chuyện đang xảy ra để nhận ra những vòng lặp và cách phản ứng đã theo mình từ lâu.",
  },
  {
    name: "Tâm lý nguyên mẫu",
    copy: "giúp nhận ra những vai mình có thể đã quen sống: người phải mạnh, người phải đúng, người luôn lo cho tất cả. Một chiếc gương để nhìn, không phải chiếc nhãn để đóng khung.",
  },
  {
    name: "Coaching",
    copy: "giữ quyền lựa chọn ở bạn. Tôi có thể hỏi, phản chiếu và cùng bạn làm rõ — nhưng không quyết định thay.",
  },
  {
    name: "Khoa học thần kinh",
    copy: "giúp hiểu vì sao có những điều mình đã biết rất rõ nhưng phản ứng cũ vẫn đến nhanh — và vì sao hiểu ra chưa chắc đã lập tức sống khác được.",
  },
];

const doors = [
  {
    title: "Người đứng sau ESSENCE",
    copy: "Điều gì đã hình thành cách tôi nhìn, điều tôi tin trong công việc này — và vì sao tôi chọn đứng bên cạnh thay vì quyết định thay bạn.",
    href: "/ve-kenji",
    image: "/images/phuong-phap/04-door-kenji.png",
    imageAlt: "Kenji Phạm tại Essence Coaching",
    label: "Gặp Kenji →",
  },
  {
    title: "Câu chuyện của chính bạn",
    copy: "Bạn có thể đã nhận ra vài vòng lặp, nhưng vẫn chưa rõ điều gì đang thật sự dẫn nhịp đời sống của mình.",
    href: "/ban-sac-cua-ban",
    image: "/images/phuong-phap/05-door-ban.png",
    imageAlt: "Không gian yên tĩnh bên khung cửa",
    label: "Tôi muốn nhìn về phía chính mình →",
  },
  {
    title: "Câu chuyện của con",
    copy: "Một đứa trẻ không cần thêm một chiếc nhãn để được hiểu nhanh hơn.\n\nĐôi khi, điều cần thiết hơn là nhìn đủ gần để nhận ra điều đang thật sự diễn ra khi con lớn lên.",
    href: "/ban-sac-cua-con",
    image: "/images/phuong-phap/06-door-con.png",
    imageAlt: "Góc không gian dành cho trẻ",
    label: "Tôi đang muốn hiểu con rõ hơn →",
  },
];

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
        <section className={`${styles.heroSurface} px-6 pb-28 pt-16 md:px-8 md:pb-40 md:pt-24 lg:px-12 lg:pb-48 lg:pt-28`}>
          <div className={`${styles.atmosphereContent} mx-auto max-w-[1180px]`}>
            <div
              className={`${styles.reveal} max-w-[720px] lg:pt-12`}
              data-phuong-phap-reveal
            >
              <EssenceUtility as="p" className="mb-8 md:mb-10">
                Phương pháp Essence
              </EssenceUtility>
              <EssenceDisplay as="h1">
                Có những chuyện mình biết rất rõ — mà vẫn cứ lặp lại.
              </EssenceDisplay>

              <div className="mt-12 space-y-6 md:mt-16">
                <EssenceBody as="p">
                  Mình biết đã quá mệt, nhưng ai nhờ vẫn nhận thêm.
                </EssenceBody>
                <EssenceBody as="p">
                  Biết có một cuộc nói chuyện cần diễn ra, nhưng vẫn nghĩ:
                </EssenceBody>
                <EssenceAccent as="p" className="max-w-[520px] py-2">
                  “Đợi lúc nào phù hợp hơn.”
                </EssenceAccent>
                <EssenceBody as="p">
                  Biết mình không muốn phản ứng như vậy với người thân, nhưng khi chuyện xảy ra,
                  cách cũ vẫn đến trước.
                </EssenceBody>
              </div>

              <div className="mt-14 space-y-4 border-l border-e26-border pl-6 md:mt-20 md:pl-8">
                <EssenceBody as="p">Có người cứ đi quá nhanh.</EssenceBody>
                <EssenceBody as="p">Có người nghĩ rất lâu mà vẫn chưa bước.</EssenceBody>
                <EssenceBody as="p">Có người luôn làm thêm một chút.</EssenceBody>
                <EssenceBody as="p">Có người chờ thêm một lần chắc chắn.</EssenceBody>
              </div>

              <div className="mt-16 space-y-7 md:mt-24">
                <EssenceLeadIn as="p">
                  Đi quá nhanh hay chờ quá lâu, luôn nhận thêm hay vẫn chưa dám chọn — nhìn thì
                  rất khác nhau.
                </EssenceLeadIn>
                <EssenceLeadIn as="p">
                  Nhưng đôi khi, tất cả lại đang được dẫn bởi một cách sống đã quá quen:
                </EssenceLeadIn>
                <EssenceAnchor
                  as="p"
                  level="h3"
                  className="max-w-[650px] pt-10 text-[34px] leading-[1.08] md:pt-16 md:text-[46px]"
                >
                  Một cách sống cũ đang âm thầm lựa chọn thay mình.
                </EssenceAnchor>
              </div>
            </div>
          </div>
        </section>

        <div className={styles.openingFlow}>
          <section className="px-6 py-28 md:px-8 md:py-40 lg:py-44">
            <div
              className={`${styles.reveal} mx-auto max-w-[700px]`}
              data-phuong-phap-reveal
            >
              <EssenceAnchor as="h2" className="mb-14 md:mb-20">
                Essence bắt đầu…
              </EssenceAnchor>

              <div className="space-y-6">
                <EssenceBody as="p">Essence không bắt đầu bằng việc sửa bạn.</EssenceBody>
                <EssenceBody as="p">
                  Cũng không bảo bạn phải sống nhanh hơn, chậm hơn hay trở thành một phiên bản
                  khác của mình.
                </EssenceBody>
                <EssenceBody as="p">
                  Essence bắt đầu bằng một nhịp dừng vừa đủ để mình nhìn rõ điều gì đang thật sự
                  đứng sau những phản ứng và lựa chọn quen thuộc — rồi tự chọn điều phù hợp hơn để
                  làm tiếp.
                </EssenceBody>
              </div>

              <div className="mt-16 space-y-5 md:mt-24">
                <EssenceBody as="p">Việc luôn nhận thêm có thể không chỉ vì chăm chỉ.</EssenceBody>
                <EssenceBody as="p">Trì hoãn có thể không chỉ vì thiếu kỷ luật.</EssenceBody>
                <EssenceBody as="p">
                  Một cơn giận có thể không chỉ bắt đầu từ chuyện vừa xảy ra.
                </EssenceBody>
                <EssenceBody as="p">
                  Và có lúc mình tưởng đang suy nghĩ cho kỹ, nhưng thật ra đã đứng quá lâu trước
                  một điều cần phải chọn.
                </EssenceBody>
              </div>

              <div className="mt-20 border-t border-e26-border pt-14 md:mt-28 md:pt-20">
                <EssenceBody as="p">Tôi không tìm một cái nhãn để định nghĩa bạn.</EssenceBody>
                <EssenceBody as="p" className="mt-6">
                  Tôi quan tâm hơn đến:
                </EssenceBody>
                <div className="mt-12 space-y-7 md:mt-16 md:space-y-9">
                  <EssenceLeadIn as="p">Điều gì đang thật sự dẫn nhịp mình?</EssenceLeadIn>
                  <EssenceLeadIn as="p">Điều gì vẫn còn phù hợp?</EssenceLeadIn>
                  <EssenceLeadIn as="p">Và điều gì đã đến lúc mình chọn lại?</EssenceLeadIn>
                </div>
              </div>
            </div>
          </section>

          <section className="px-6 pb-32 pt-20 md:px-8 md:pb-44 md:pt-28 lg:pb-48">
            <div className="mx-auto max-w-[1120px]">
              <div
                className={`${styles.reveal} max-w-[720px]`}
                data-phuong-phap-reveal
              >
                <EssenceAnchor as="h2" className="mb-9 md:mb-12">
                  Phía sau cách tôi làm việc
                </EssenceAnchor>
                <EssenceBody as="p">
                  Phía sau cách tôi nghe, hỏi và cùng bạn nhìn lại điều đang xảy ra là bốn nền
                  tri thức.
                </EssenceBody>
              </div>

              <div className="mt-16 grid gap-x-16 gap-y-12 md:mt-24 md:grid-cols-2 md:gap-y-16">
                {foundations.map((foundation) => (
                  <article
                    className={`${styles.reveal} border-t border-e26-border pt-8`}
                    data-phuong-phap-reveal
                    key={foundation.name}
                  >
                    <EssenceAnchor as="h3" level="h3" className="mb-5 text-[26px] md:text-[31px]">
                      {foundation.name}
                    </EssenceAnchor>
                    <EssenceBody as="p" className="max-w-none">
                      {foundation.copy}
                    </EssenceBody>
                  </article>
                ))}
              </div>

              <div
                className={`${styles.reveal} mt-24 max-w-[760px] border-l border-e26-gold pl-7 md:mt-32 md:pl-10 lg:ml-auto`}
                data-phuong-phap-reveal
              >
                <EssenceLeadIn as="p">
                  Điều dẫn đường vẫn là chuyện bạn đang sống, điều bạn đang cảm thấy và điều bạn
                  muốn thay đổi.
                </EssenceLeadIn>
                <EssenceBody as="p" className="mt-7">
                  Đó cũng là nơi ba chuyển động của ESSENCE bắt đầu.
                </EssenceBody>
              </div>
            </div>
          </section>
        </div>

        <div className={styles.movementFlow}>
          <section className={`${styles.movementScene} ${styles.chillAtmosphere} px-6 py-28 md:px-8 md:py-40 lg:py-48`}>
            <div className={`${styles.atmosphereContent} mx-auto grid max-w-[1120px] items-start gap-16 lg:grid-cols-12 lg:gap-20`}>
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
              </div>

              <div
                className={`${styles.reveal} lg:col-span-7 lg:pt-28`}
                data-phuong-phap-reveal
              >
                <div className="space-y-5">
                  <EssenceBody as="p">Khi giận, mình muốn phản ứng.</EssenceBody>
                  <EssenceBody as="p">Khi sợ, mình muốn tránh.</EssenceBody>
                  <EssenceBody as="p">Khi buồn, có người làm mình bận hơn.</EssenceBody>
                  <EssenceBody as="p">Có người phân tích.</EssenceBody>
                  <EssenceBody as="p">Có người cố tỏ ra ổn.</EssenceBody>
                </div>

                <EssenceAnchor
                  as="h3"
                  level="h3"
                  className="my-16 max-w-[680px] border-y border-e26-border py-12 md:my-24 md:py-16"
                >
                  Chill là hiểu điều mình đang thật sự cảm thấy — không chống lại, không bỏ qua
                  và không để cảm xúc lập tức quyết định thay mình.
                </EssenceAnchor>

                <div className="space-y-5">
                  <EssenceBody as="p">Mình vẫn có thể giận.</EssenceBody>
                  <EssenceBody as="p">Vẫn sợ.</EssenceBody>
                  <EssenceBody as="p">Vẫn chưa biết phải làm gì.</EssenceBody>
                  <EssenceBody as="p" className="pt-4">
                    Nhưng khi mình không cần phản ứng ngay, giữa điều đang cảm thấy và việc mình sẽ
                    làm tiếp bắt đầu có thêm một khoảng nhỏ.
                  </EssenceBody>
                  <EssenceBody as="p">Đủ để mình nhận ra:</EssenceBody>
                </div>

                <div className="mt-12 space-y-6 border-l border-e26-border pl-6 md:pl-8">
                  <EssenceLeadIn as="p">Chuyện gì đang thật sự xảy ra?</EssenceLeadIn>
                  <EssenceLeadIn as="p">Điều gì vừa chạm vào mình?</EssenceLeadIn>
                  <EssenceLeadIn as="p">Và mình muốn làm gì với điều đó?</EssenceLeadIn>
                </div>

                <div className="mt-20 space-y-5 md:mt-28">
                  <EssenceBody as="p">Nhưng nhìn rõ không có nghĩa là đứng yên.</EssenceBody>
                  <EssenceBody as="p">Có lúc mình đã đi quá nhanh và cần dừng.</EssenceBody>
                  <EssenceBody as="p">
                    Có lúc mình đã nghĩ đủ lâu, chuẩn bị đủ nhiều và chờ đủ lâu.
                  </EssenceBody>
                  <EssenceLeadIn as="p" className="pt-5">
                    Điều quan trọng không phải là dừng lại hay đi tiếp.
                  </EssenceLeadIn>
                  <EssenceBody as="p">
                    Mà là không để cách cũ tiếp tục lựa chọn thay mình.
                  </EssenceBody>
                  <EssenceAnchor as="h3" level="h3" className="pt-12 md:pt-16">
                    Đã đến lúc bạn tự chọn.
                  </EssenceAnchor>
                </div>
              </div>
            </div>
          </section>

          <section className={`${styles.movementScene} px-6 py-28 md:px-8 md:py-40 lg:py-48`}>
            <div className="mx-auto max-w-[1120px]">
              <div
                className={`${styles.reveal} grid gap-8 md:grid-cols-12`}
                data-phuong-phap-reveal
              >
                <EssenceUtility variant="numeral" as="p" className="md:col-span-3">
                  02
                </EssenceUtility>
                <div className="md:col-span-9">
                  <EssenceAnchor as="h2">Thách thức giới hạn</EssenceAnchor>
                  <EssenceLeadIn as="p" className="mt-10 md:mt-14">
                    Nhưng khi đã có quyền chọn, mình vẫn có thể chọn theo cách cũ.
                  </EssenceLeadIn>
                </div>
              </div>

              <div className="mt-20 grid gap-16 md:mt-28 lg:grid-cols-12 lg:gap-20">
                <div
                  className={`${styles.reveal} space-y-5 lg:col-span-5`}
                  data-phuong-phap-reveal
                >
                  <EssenceBody as="p">Mình có thể biết:</EssenceBody>
                  <EssenceAccent as="p" className="py-5">
                    “Mỗi lần sợ mất lòng, tôi lại nói đồng ý.”
                  </EssenceAccent>
                  <EssenceBody as="p">Nhưng lần sau vẫn nhận thêm.</EssenceBody>
                  <EssenceBody as="p" className="pt-6">
                    Mình có thể biết mình trì hoãn vì sợ chưa đủ tốt.
                  </EssenceBody>
                  <EssenceBody as="p">Nhưng rồi vẫn chuẩn bị thêm.</EssenceBody>
                  <EssenceBody as="p">Đọc thêm.</EssenceBody>
                  <EssenceBody as="p">Chờ thêm.</EssenceBody>
                </div>

                <div
                  className={`${styles.reveal} lg:col-span-7`}
                  data-phuong-phap-reveal
                >
                  <EssenceAnchor as="h3" level="h3" className="max-w-[690px]">
                    Nếu đã nhìn thấy cách cũ rồi, lần này bạn có dám chọn khác đi không?
                  </EssenceAnchor>

                  <div className="mt-14 space-y-0 border-t border-e26-border md:mt-20">
                    {[
                      "Có thể là nói “không” ở nơi mình vẫn luôn nói “được”.",
                      "Có thể là chưa trả lời khi mình còn đang giận.",
                      "Có thể là thôi giữ một vai đã khiến mình mệt quá lâu.",
                      "Có thể là bắt đầu dù chưa thể biết hết mọi chuyện phía trước.",
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

                  <div className="mt-16 space-y-5 md:mt-24">
                    <EssenceBody as="p">Chọn khác không phải để chống lại chính mình.</EssenceBody>
                    <EssenceBody as="p">
                      Mà để thử một cách sống phù hợp hơn với điều mình vừa nhìn thấy.
                    </EssenceBody>
                    <EssenceBody as="p" className="pt-5">
                      Có những cách từng giúp mình đi qua một giai đoạn.
                    </EssenceBody>
                    <EssenceBody as="p">
                      Nhưng điều từng cần thiết không nhất thiết phải theo mình mãi.
                    </EssenceBody>
                    <EssenceBody as="p" className="pt-5">
                      Đến một lúc nào đó, câu hỏi không còn là:
                    </EssenceBody>
                    <EssenceAccent as="p">“Tại sao tôi lại như vậy?”</EssenceAccent>
                    <EssenceBody as="p">Mà là:</EssenceBody>
                    <EssenceAnchor as="h3" level="h3" className="pt-10 md:pt-14">
                      Từ đây, tôi muốn sống thế nào?
                    </EssenceAnchor>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className={`${styles.movementScene} ${styles.realityAtmosphere} px-6 py-28 md:px-8 md:py-40 lg:py-48`}>
            <div className={`${styles.atmosphereContent} mx-auto grid max-w-[1120px] items-start gap-20 lg:grid-cols-12 lg:gap-20`}>
              <div
                className={`${styles.reveal} lg:col-start-6 lg:col-span-7`}
                data-phuong-phap-reveal
              >
                <EssenceUtility variant="numeral" as="p" className="mb-8">
                  03
                </EssenceUtility>
                <EssenceAnchor as="h2">Hiện thực ước mơ</EssenceAnchor>
                <EssenceLeadIn as="p" className="mt-12 md:mt-16">
                  Câu trả lời chỉ thật sự có ý nghĩa khi nó bắt đầu hiện ra trong cách mình sống.
                </EssenceLeadIn>

                <div className="mt-16 space-y-5 md:mt-24">
                  <EssenceBody as="p">
                    Biết mình cần một ranh giới chưa phải là có ranh giới.
                  </EssenceBody>
                  <EssenceBody as="p">Một lúc nào đó, mình phải nói câu cần nói.</EssenceBody>
                  <EssenceBody as="p" className="pt-4">
                    Biết mình muốn gần gia đình hơn chưa làm lịch sống thay đổi.
                  </EssenceBody>
                  <EssenceBody as="p">
                    Mình phải thật sự dành chỗ cho gia đình trong lịch sống.
                  </EssenceBody>
                  <EssenceBody as="p" className="pt-4">
                    Biết mình muốn một hướng khác chưa làm cuộc đời rẽ hướng.
                  </EssenceBody>
                  <EssenceBody as="p">Mình phải bắt đầu bằng một lựa chọn có thật.</EssenceBody>
                </div>

                <EssenceAnchor as="h3" level="h3" className="my-16 max-w-[680px] md:my-24">
                  Hiện thực ước mơ là đưa điều mình muốn sống vào những lựa chọn có thật.
                </EssenceAnchor>

                <div className="space-y-4 border-l border-e26-border pl-6 md:pl-8">
                  {[
                    "Một cuộc trò chuyện.",
                    "Một ranh giới.",
                    "Một cách dùng thời gian khác.",
                    "Một quyết định.",
                    "Một việc bắt đầu.",
                    "Một việc dừng lại.",
                  ].map((item) => (
                    <EssenceBody as="p" key={item}>
                      {item}
                    </EssenceBody>
                  ))}
                </div>

                <div className="mt-16 space-y-5 md:mt-24">
                  <EssenceBody as="p">
                    Không phải nghĩ đủ mạnh để điều mình muốn tự xuất hiện.
                  </EssenceBody>
                  <EssenceBody as="p">
                    Mà là để điều mình đã chọn bắt đầu hiện diện trong cách mình sống.
                  </EssenceBody>
                </div>

                <EssenceAnchor as="h3" level="h3" className="my-16 max-w-[680px] md:my-24">
                  Ước mơ bắt đầu trở thành đời sống khi nó có mặt trong một ngày bình thường.
                </EssenceAnchor>

                <div className="space-y-5">
                  <EssenceBody as="p">
                    Câu chuyện cũng không dừng ở việc hiểu mình hơn hay yên hơn bên trong.
                  </EssenceBody>
                  <EssenceBody as="p">
                    Từ một nền đủ vững, mình có thể tiếp tục lựa chọn và kiến tạo những điều thật
                    sự quan trọng:
                  </EssenceBody>
                </div>

                <div className="mt-10 space-y-3">
                  <EssenceBody as="p">một sự nghiệp,</EssenceBody>
                  <EssenceBody as="p">một mối quan hệ,</EssenceBody>
                  <EssenceBody as="p">một gia đình,</EssenceBody>
                  <EssenceBody as="p">nhiều tự do hơn,</EssenceBody>
                  <EssenceBody as="p">hay một đời sống đủ đầy theo cách riêng của mình.</EssenceBody>
                </div>

                <div className="mt-16 space-y-5 border-t border-e26-border pt-12 md:mt-24 md:pt-16">
                  <EssenceBody as="p">
                    ESSENCE gọi hướng sống này là <strong className="font-semibold text-e26-text">An Thịnh</strong>.
                  </EssenceBody>
                  <EssenceBody as="p">Không có một thước đo chung cho chữ “Thịnh”.</EssenceBody>
                  <EssenceLeadIn as="p" className="pt-4">
                    Đời sống bạn đang kiến tạo sẽ có hình hài thế nào vẫn do chính bạn lựa chọn.
                  </EssenceLeadIn>
                </div>
              </div>
            </div>
          </section>
        </div>

        <section className={`${styles.signalSurface} flex px-6 py-32 md:min-h-[70vh] md:items-center md:px-8 md:py-40 lg:py-48`}>
          <div
            className={`${styles.reveal} ${styles.signalReveal} mx-auto max-w-[980px] text-center`}
            data-phuong-phap-reveal
          >
            <EssenceAnchor
              as="h2"
              className="mx-auto max-w-[880px] text-[44px] leading-[1.04] md:text-[72px] md:leading-[1]"
            >
              Nhìn rõ là khởi đầu.
            </EssenceAnchor>
            <EssenceAccent as="p" className="mx-auto mt-14 max-w-[720px] md:mt-20">
              Điều quan trọng là lựa chọn tiếp theo thực sự là của bạn.
            </EssenceAccent>
          </div>
        </section>

        <section className={`${styles.boundarySurface} px-6 py-28 md:px-8 md:py-40 lg:py-44`}>
          <div
            className={`${styles.reveal} mx-auto grid max-w-[1020px] gap-14 md:grid-cols-12 md:gap-16`}
            data-phuong-phap-reveal
          >
            <div className="md:col-span-5">
              <EssenceAnchor as="h2">Có những giới hạn tôi không bước qua</EssenceAnchor>
              <EssenceLeadIn as="p" className="mt-10 md:mt-14">
                Và để quyền lựa chọn này luôn ở lại với bạn:
              </EssenceLeadIn>
            </div>

            <div className="md:col-span-7 md:pt-2">
              <div className="border-t border-e26-border">
                {[
                  "Tôi không chẩn đoán hay đóng bạn vào một kiểu cố định.",
                  "Không dùng nguyên mẫu để dán nhãn.",
                  "Không dùng khoa học thần kinh để hứa kết quả.",
                  "Không quyết định thay bạn.",
                  "Coaching cũng không thay thế hỗ trợ chuyên môn về sức khỏe tâm thần khi tình huống của bạn cần đến chuyên môn này.",
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

              <EssenceBody as="p" className="mt-12">
                Có lúc điều trung thực nhất tôi có thể nói là:
              </EssenceBody>
              <EssenceLeadIn as="p" className="my-7">
                “Việc này nằm ngoài phạm vi của tôi.”
              </EssenceLeadIn>
              <Link
                href="/dieu-essence-khong-hua"
                className={`${textLink} focus-visible:ring-offset-e26-cream-deep`}
              >
                Những điều Essence không hứa →
              </Link>
            </div>
          </div>
        </section>

        <div className={styles.closingFlow}>
          <section className="px-6 py-28 md:px-8 md:py-40 lg:py-48">
            <div className="mx-auto max-w-[1120px]">
              <div
                className={`${styles.reveal} max-w-[820px]`}
                data-phuong-phap-reveal
              >
                <EssenceAnchor as="h2" className="mb-10">
                  Mỗi câu chuyện sẽ dẫn bạn đến một cánh cửa khác
                </EssenceAnchor>
                <EssenceBody as="p" className="max-w-[760px]">
                  Điều bạn muốn nhìn gần hơn lúc này có thể là người đứng sau ESSENCE, câu chuyện
                  của chính bạn — hoặc đứa con bạn đang muốn hiểu rõ hơn.
                </EssenceBody>
              </div>

              <nav
                aria-label="Các hướng đọc tiếp"
                className="mt-20 grid gap-16 md:mt-28 md:grid-cols-2 lg:grid-cols-3 lg:gap-10"
              >
                {doors.map((door, index) => (
                  <article
                    className={`${styles.reveal} flex flex-col ${
                      index === 1 ? "md:translate-y-12 lg:translate-y-16" : ""
                    } ${index === 2 ? "md:col-span-2 md:max-w-[calc(50%_-_2rem)] lg:col-span-1 lg:max-w-none" : ""}`}
                    data-phuong-phap-reveal
                    key={door.href}
                  >
                    <PhuongPhapImageSlot alt={door.imageAlt} ratio="portrait" src={door.image} />
                    <EssenceAnchor as="h3" level="h3" className="mt-8">
                      {door.title}
                    </EssenceAnchor>
                    <div className="mt-6 flex-1 space-y-5">
                      {door.copy.split("\n\n").map((paragraph) => (
                        <EssenceBody as="p" className="max-w-none" key={paragraph}>
                          {paragraph}
                        </EssenceBody>
                      ))}
                    </div>
                    <Link href={door.href} className={`${textLink} mt-9 self-start`}>
                      {door.label}
                    </Link>
                  </article>
                ))}
              </nav>
            </div>
          </section>

          <section className="px-6 pb-36 pt-28 md:px-8 md:pb-52 md:pt-44 lg:pb-60 lg:pt-52">
            <div
              className={`${styles.reveal} mx-auto max-w-[820px]`}
              data-phuong-phap-reveal
            >
              <EssenceAnchor as="h2" className="max-w-[780px] text-[38px] md:text-[56px]">
                Bạn không cần trở thành một ai khác để bắt đầu sống khác đi.
              </EssenceAnchor>
              <EssenceBody as="p" className="mt-14 md:mt-20">
                Có khi bạn chỉ cần nhìn đủ rõ để nhận ra:
              </EssenceBody>
              <EssenceLeadIn as="p" className="mt-10 max-w-[660px] md:mt-14">
                điều gì đã đến lúc dừng,
                <br />
                điều gì đáng giữ,
                <br />
                và từ đây, bạn muốn chọn điều gì.
              </EssenceLeadIn>
            </div>
          </section>
        </div>
      </main>

      <HomeFooter />
    </>
  );
}
