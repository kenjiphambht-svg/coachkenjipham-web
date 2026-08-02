import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { useRef } from "react";
import { SEO } from "@/components/SEO";
import HomeHeader from "@/components/homepage/HomeHeader";
import HomeFooter from "@/components/homepage/HomeFooter";
import {
  EssenceAnchor,
  EssenceAccent,
  EssenceBody,
  EssenceDisplay,
  EssenceLeadIn,
  EssenceSignalComposition,
  EssenceUtility,
} from "@/components/ve-kenji/VeKenjiTypography";
import { VeKenjiSectionImage } from "@/components/ve-kenji/VeKenjiImagery";
import { useVeKenjiSignalReveal } from "@/hooks/useVeKenjiSignalReveal";
import { useVeKenjiSectionReveal } from "@/hooks/useVeKenjiSectionReveal";

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Kenji Phạm",
  jobTitle: "Huấn luyện viên Tâm lý Chiều sâu",
  description:
    "Kenji Phạm — Huấn luyện viên Tâm lý Chiều sâu, Essence Coach. Người sáng lập Essence Coaching.",
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

const faqs = [
  {
    q: "Kenji làm việc với ai?",
    a: "Tôi làm việc với người lớn muốn nhìn lại chính mình, và ba mẹ muốn hiểu con rõ hơn mà không vội dán nhãn.\n\nMỗi hướng có phạm vi, mức cam kết và bước tiếp riêng.",
  },
  {
    q: "Kenji có chứng chỉ gì?",
    a: "Tôi có chứng chỉ ICF — International Coaching Federation.\n\nTôi dùng ICF như một khung kỷ luật nghề nghiệp và bộ quy tắc để tự soi; không dùng chứng chỉ như bằng chứng rằng mình hiểu ai sâu hơn.",
  },
  {
    q: "Coaching có thay thế chuyên gia sức khỏe tâm thần không?",
    a: "Không.\n\nCoaching không chẩn đoán và không thay thế chuyên gia tâm lý lâm sàng hay bác sĩ.\n\nKhi điều một người đang mang cần đến chuyên môn khác, tôi nói thẳng và khuyến nghị họ tìm sự hỗ trợ phù hợp.",
  },
  {
    q: "Kenji làm việc ở đâu?",
    a: "Tôi làm việc tại Sài Gòn, Việt Nam — trực tiếp và trực tuyến.",
  },
  {
    q: "AI tham gia vào quá trình như thế nào?",
    a: "AI hỗ trợ những việc phía sau như sắp xếp, ghi lại và đối chiếu thông tin.\n\nAI không đóng vai Kenji, không đồng hành thay Kenji và không đưa ra quyết định thay Kenji.\n\nBản gửi đến khách do Kenji đọc và viết từ đầu đến cuối.",
  },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.q,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.a,
    },
  })),
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
      name: "Về Kenji",
      item: "https://coachkenjipham.com/ve-kenji",
    },
  ],
};

const linkUnderline =
  "text-e26-text underline underline-offset-4 decoration-e26-border hover:text-e26-gold-deep hover:decoration-e26-gold transition-colors duration-300";

const CREAM = "#F1EFE8";
const BG = {
  base: CREAM,
  story: "#E8E5DC",
  identity: "#EAE7DF",
  belief: "#E2DFD7",
  values: "#FCFAF3",
  presence: "#EEECE5",
  boundaries: "#D8D5CC",
  faq: "#F3F1EA",
  discovery: "#F8F5EC",
};

function lighten(hex: string, amount: number) {
  const n = parseInt(hex.slice(1), 16);
  const r = Math.min(255, ((n >> 16) & 255) + amount);
  const g = Math.min(255, ((n >> 8) & 255) + amount);
  const b = Math.min(255, (n & 255) + amount);
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0").toUpperCase()}`;
}

function sectionBg(edge: string) {
  const center = lighten(edge, 6);
  return `radial-gradient(ellipse 120% 90% at 50% 40%, ${center} 0%, ${edge} 100%)`;
}

function VeKenjiDivider() {
  return (
    <div className="max-w-[660px] mx-auto px-6" aria-hidden="true">
      <div className="h-px w-full max-w-[180px]" style={{ backgroundColor: "rgba(26, 26, 26, 0.06)" }} />
    </div>
  );
}

const RHYTHM = {
  mo: "py-28 md:py-40",
  thuong: "py-20 md:py-28",
  lang: "py-36 md:py-56",
};

function SectionLabel({ children }: { children: string }) {
  return (
    <EssenceUtility as="p" className="text-[#1A1A1A]/60 mb-4 md:mb-5">
      {children}
    </EssenceUtility>
  );
}

export default function VeKenjiPage() {
  const signalRef = useRef<HTMLDivElement>(null);
  const pageRef = useRef<HTMLElement>(null);
  useVeKenjiSignalReveal(signalRef);
  useVeKenjiSectionReveal(pageRef);

  return (
    <>
      <SEO
        title="Kenji Phạm — Huấn luyện viên Tâm lý Chiều sâu | Essence Coaching"
        description="Câu chuyện, ba giá trị gốc, cách hiện diện và những ranh giới Kenji Phạm tự giữ trong công việc huấn luyện tâm lý chiều sâu tại Sài Gòn."
        image="/essence-og-1200x630.png"
        url="https://coachkenjipham.com/ve-kenji"
        type="profile"
      />
      <Head>
        <meta name="robots" content="noindex, nofollow" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/favicon-192.png" />
        <link rel="icon" type="image/png" sizes="512x512" href="/favicon-512.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon-180.png" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      </Head>

      <HomeHeader />

      <main ref={pageRef} className="text-e26-text">
        <section className={`px-6 ${RHYTHM.mo}`} style={{ background: sectionBg(BG.base) }}>
          <div className="ve-kenji-reveal max-w-[660px] mx-auto">
            <SectionLabel>VÌ SAO TÔI Ở ĐÂY</SectionLabel>
            <EssenceDisplay as="h1" className="max-w-[700px]">
              Vì sao tôi chọn ngồi lại với những điều thường bị<br className="hidden md:block" /> đi qua quá nhanh?
            </EssenceDisplay>
            <div className="space-y-5 mt-8 md:mt-10">
              <EssenceBody as="p" className="max-w-[580px]">
                Phía sau một quyết định, một cơn giận hay sự mệt mỏi khó gọi tên, thường còn một điều chưa được nhìn thấy.
              </EssenceBody>
              <EssenceBody as="p">
                Có người vẫn làm việc, vẫn chăm lo cho mọi người, vẫn nói mình ổn — nhưng bên trong đã phải gánh quá lâu.
              </EssenceBody>
              <EssenceBody as="p">
                Có những phản ứng từng giúp mình trụ lại. Đến một lúc nào đó, chính chúng lại âm thầm quyết định thay cách mình sống, yêu thương và lựa chọn.
              </EssenceBody>
              <EssenceBody as="p">
                Tôi chọn công việc này để cùng một người nhìn vào điều đang vận hành bên dưới — không vội phán, không kéo họ đi nhanh hơn, cũng không quyết định thay họ.
              </EssenceBody>
              <EssenceAccent as="p" className="pt-3 md:pt-5">Lựa chọn ấy không bắt đầu từ một lý thuyết.</EssenceAccent>
            </div>
          </div>
        </section>

        <section className={`px-6 ${RHYTHM.mo}`} style={{ background: sectionBg(BG.story) }}>
          <div className="ve-kenji-reveal max-w-[660px] mx-auto">
            <SectionLabel>TÔI ĐẾN TỪ ĐÂU</SectionLabel>
            <EssenceAnchor as="h2" className="mb-10 md:mb-12">
              Tôi không đến từ <em>lý thuyết</em>.
            </EssenceAnchor>
            <div className="space-y-5">
              <EssenceBody as="p">Tôi lớn lên trong một môi trường mà từ rất sớm, tôi phải học cách trụ lại.</EssenceBody>
              <EssenceBody as="p">Không phải bằng sự dịu dàng.</EssenceBody>
              <EssenceBody as="p">Bằng gồng. Bằng kiểm soát. Bằng việc phải chứng minh rằng mình không yếu.</EssenceBody>
              <EssenceBody as="p">Sau này, tôi phá sản ba lần. Hôn nhân tan vỡ. Từ năm 2015, tôi một mình nuôi hai con trai và bắt đầu lại.</EssenceBody>
              <EssenceBody as="p">
                Tôi đã đi qua nhiều nghề — phục vụ, lái xe, bảo hiểm, kinh doanh, truyền thông. Những công việc ấy giúp tôi sống. Nhưng tôi vẫn chưa thấy đó là công việc mình có thể ở lại lâu dài.
              </EssenceBody>
              <EssenceBody as="p">
                Coaching không xuất hiện như một câu trả lời cứu tôi.
              </EssenceBody>
              <EssenceBody as="p">
                Nó giúp tôi nhận ra một điều mình đã làm từ lâu: ngồi lại, nghe kỹ và cùng một người nhìn ra điều đang âm thầm kéo họ.
              </EssenceBody>
            </div>
          </div>

          <div className="ve-kenji-reveal max-w-[860px] mx-auto my-14 md:my-20">
            <Image
              src="/images/ve-kenji/05-chan-dung-kenji.webp"
              alt="Kenji Phạm ngồi trong không gian làm việc"
              width={440}
              height={550}
              className="h-auto w-[256px] max-w-full md:w-[400px] object-cover mx-auto"
            />
          </div>

          <div className="ve-kenji-reveal max-w-[660px] mx-auto space-y-5">
            <EssenceBody as="p">
              Qua hàng trăm buổi ngồi nghe, tôi dần biết điều gì thực sự đứng được. Điều gì chỉ nghe đẹp. Điều gì giúp một người sáng rõ hơn. Và điều gì cần được để xuống.
            </EssenceBody>
            <EssenceAccent as="p" className="max-w-[620px]">
              Có lẽ vì chính tôi từng sống bằng cách gồng và tự giữ mọi thứ, tôi nhận ra khá nhanh khi một người vẫn đang ổn ở bên ngoài nhưng đã phải gánh quá nhiều quá lâu.
            </EssenceAccent>
            <EssenceBody as="p">
              Những gì tôi giữ hôm nay không phải câu chuyện về một người đã vượt qua tất cả.
            </EssenceBody>
            <EssenceBody as="p">
              Đó là cách nhìn được hình thành sau nhiều lần phải dừng, nhìn lại và chọn lại.
            </EssenceBody>
          </div>
        </section>

        <VeKenjiDivider />

        <div ref={signalRef}>
          <VeKenjiSectionImage
            src="/images/ve-kenji/01-khe-van-toi.webp"
            overlay={0.18}
            imgClassName="ve-kenji-signal-image scale-110"
            className={`px-6 ${RHYTHM.lang}`}
          >
            <div>
              <EssenceSignalComposition
                onImage
                tierA="Essence không sinh ra từ một ý tưởng đẹp."
                tierB="Essence sinh ra từ những lần gãy đổ."
              />
            </div>
          </VeKenjiSectionImage>
        </div>

        <section className={`px-6 ${RHYTHM.thuong}`} style={{ background: sectionBg(BG.identity) }}>
          <div className="ve-kenji-reveal max-w-[660px] mx-auto">
            <SectionLabel>TÔI LÀ AI HÔM NAY</SectionLabel>
            <EssenceAnchor as="h2" className="max-w-[720px] mb-10 md:mb-12">
              Kenji Phạm — Huấn luyện viên Tâm lý Chiều sâu, Essence Coach.<br />
              Người sáng lập Essence Coaching.
            </EssenceAnchor>
            <div className="space-y-5">
              <EssenceBody as="p">Tôi làm việc tại Sài Gòn, trực tiếp và trực tuyến.</EssenceBody>
              <EssenceBody as="p">
                Tám năm qua, tôi ngồi cùng người lớn trong những đoạn họ muốn nhìn lại chính mình, và cùng ba mẹ khi họ muốn hiểu con rõ hơn mà không vội dán nhãn.
              </EssenceBody>
              <EssenceBody as="p">
                <EssenceLeadIn>Coaching là khung nghề tôi dùng.</EssenceLeadIn> Nhưng phần tôi dành nhiều thời gian nhất không phải để thúc một người tiến lên thật nhanh.
              </EssenceBody>
              <EssenceBody as="p">
                Tôi ngồi cùng họ để đọc lại điều mình đã phải sống, nhận ra điều vẫn đang âm thầm quyết định thay mình, rồi tạo một khoảng đủ An định để họ có thể tự chọn lại.
              </EssenceBody>
              <EssenceBody as="p">ICF đến sau.</EssenceBody>
              <EssenceBody as="p">
                Tôi học vì cần một khung nghề rõ ràng và một bộ quy tắc từ bên ngoài để tự soi.
              </EssenceBody>
              <EssenceBody as="p">
                Chứng chỉ ICF — International Coaching Federation — không chứng minh rằng tôi hiểu ai sâu hơn. Nó nhắc tôi phải làm việc có kỷ luật, có trách nhiệm và biết giới hạn của mình.
              </EssenceBody>
            </div>
          </div>
        </section>

        <section className={`px-6 ${RHYTHM.mo}`} style={{ background: sectionBg(BG.belief) }}>
          <div className="ve-kenji-reveal max-w-[660px] mx-auto">
            <SectionLabel>ĐIỀU TÔI TIN</SectionLabel>
            <EssenceDisplay as="h2" size="mantra" className="max-w-[640px] mb-12 md:mb-16">
              Tôi không sửa ai.<br />
              Tôi tạo khoảng An định.
            </EssenceDisplay>
            <div className="space-y-5">
              <EssenceBody as="p">Tôi không nhìn người mình đang ngồi cùng như một điều gì cần bị khắc phục.</EssenceBody>
              <EssenceBody as="p">
                Điều đang kéo họ có thể là một nỗi sợ, một phản xạ tự bảo vệ, hoặc một cách sống đã phải giữ quá lâu.
              </EssenceBody>
              <EssenceBody as="p">Những điều ấy từng có lý do để tồn tại.</EssenceBody>
              <EssenceBody as="p">Vì vậy, tôi không vội yêu cầu ai buông bỏ chúng.</EssenceBody>
              <EssenceBody as="p">
                Khoảng An định không có nghĩa là không còn cảm xúc hay lúc nào cũng bình thản.
              </EssenceBody>
              <EssenceBody as="p">
                Đó là một khoảng dừng đủ để mình không phản ứng ngay như mọi lần. Đầu óc có thể nhìn rõ hơn. Và lựa chọn không chỉ lặp lại rãnh cũ.
              </EssenceBody>
              <EssenceBody as="p">Trong khoảng ấy, tôi không chọn thay.</EssenceBody>
              <EssenceBody as="p">Người tôi đang ngồi cùng vẫn là người quyết định bước tiếp theo.</EssenceBody>
            </div>
          </div>
        </section>

        <VeKenjiDivider />

        <section className={`px-6 ${RHYTHM.mo}`} style={{ background: sectionBg(BG.values) }}>
          <div className="ve-kenji-reveal max-w-[1040px] mx-auto">
            <SectionLabel>BA GIÁ TRỊ GỐC</SectionLabel>
            <EssenceDisplay as="h2" size="values" className="max-w-[700px] mb-10 md:mb-12">
              Tự Do — Trí Tuệ — Kiến Tạo
            </EssenceDisplay>
            <div className="max-w-[660px] space-y-5">
              <EssenceBody as="p">Đây là ba giá trị tôi tự giữ trong đời sống và trong cách làm việc.</EssenceBody>
              <EssenceBody as="p">
                Chúng không đòi hỏi ai phải sống theo một khuôn giống nhau. Với tôi, đây là ba hướng để nhìn lại cách mình đang lựa chọn và sống.
              </EssenceBody>
            </div>
            <div className="grid gap-10 mt-12 md:grid-cols-3 md:gap-0 md:mt-16">
              <div className="border-t border-e26-text/10 pt-6 md:pr-8">
                <EssenceAnchor as="h3" level="h3" className="mb-3">Tự Do</EssenceAnchor>
                <div className="space-y-5 max-w-[300px]">
                  <EssenceBody as="p" className="max-w-none text-[#1A1A1A]/85">Tự Do là khi phản xạ cũ không còn quyết định thay mình trong mọi tình huống.</EssenceBody>
                  <EssenceBody as="p" className="max-w-none text-[#1A1A1A]/85">Có lúc mình bước tiếp. Có lúc mình từ chối. Và có lúc mình chọn lại.</EssenceBody>
                </div>
              </div>
              <div className="border-t border-e26-text/10 pt-6 md:border-l md:px-8">
                <EssenceAnchor as="h3" level="h3" className="mb-3">Trí Tuệ</EssenceAnchor>
                <div className="space-y-5 max-w-[300px]">
                  <EssenceBody as="p" className="max-w-none text-[#1A1A1A]/85">Trí Tuệ không phải biết thật nhiều.</EssenceBody>
                  <EssenceBody as="p" className="max-w-none text-[#1A1A1A]/85">Đó là khả năng nhìn điều đang xảy ra trong mình, trong người khác và trong hoàn cảnh — trước khi vội kết luận.</EssenceBody>
                </div>
              </div>
              <div className="border-t border-e26-text/10 pt-6 md:border-l md:pl-8">
                <EssenceAnchor as="h3" level="h3" className="mb-3">Kiến Tạo</EssenceAnchor>
                <div className="space-y-5 max-w-[300px]">
                  <EssenceBody as="p" className="max-w-none text-[#1A1A1A]/85">Kiến Tạo là đưa điều đã nhận ra vào đời sống thật.</EssenceBody>
                  <EssenceBody as="p" className="max-w-none text-[#1A1A1A]/85">Một cuộc trò chuyện cần có. Một giới hạn cần được nói rõ. Một lựa chọn phù hợp hơn với điều mình thực sự muốn sống.</EssenceBody>
                </div>
              </div>
            </div>
            <div className="max-w-[660px] space-y-5 mt-12 md:mt-16">
              <EssenceBody as="p">Ở trang Phương pháp, tôi viết rõ hơn cách ba giá trị này đi vào từng nhịp làm việc.</EssenceBody>
              <EssenceBody as="p"><Link href="/phuong-phap" className={linkUnderline}>Đọc cách ba giá trị này đi vào phương pháp →</Link></EssenceBody>
            </div>
          </div>
        </section>

        <section className={`px-6 ${RHYTHM.thuong}`} style={{ background: sectionBg(BG.presence) }}>
          <div className="ve-kenji-reveal max-w-[760px] mx-auto">
            <SectionLabel>CÁCH TÔI HIỆN DIỆN</SectionLabel>
            <EssenceAnchor as="h2" className="mb-10 md:mb-12">
              Tôi đọc để hiểu — <em>không để phán</em>.
            </EssenceAnchor>
            <div className="space-y-10 md:space-y-12">
              <div>
                <EssenceLeadIn as="h3" className="mb-3">Tôi nghe trước khi giải thích.</EssenceLeadIn>
                <div className="space-y-5 md:ml-7 md:max-w-[560px]">
                  <EssenceBody as="p">Tôi quan tâm đến điều đang vận hành bên dưới một lựa chọn, một phản ứng hay một vòng lặp.</EssenceBody>
                  <EssenceBody as="p">Nhưng điều tôi nhìn thấy chỉ là một góc để cùng xem lại, không phải kết luận cuối cùng về một người.</EssenceBody>
                </div>
              </div>
              <div>
                <EssenceLeadIn as="h3" className="mb-3">Tôi không vội biến điều chưa rõ thành một câu trả lời.</EssenceLeadIn>
                <div className="space-y-5 md:ml-7 md:max-w-[560px]">
                  <EssenceBody as="p">Có những lúc một người cần nhìn thêm, cảm thêm hoặc chỉ đơn giản là được ở lại với điều đang xảy ra.</EssenceBody>
                  <EssenceBody as="p">Tôi không đẩy họ đến một quyết định chỉ vì quyết định ấy nghe hợp lý.</EssenceBody>
                </div>
              </div>
              <div>
                <EssenceLeadIn as="h3" className="mb-3">Tôi không dùng kỹ thuật để làm ai trông ổn hơn.</EssenceLeadIn>
                <div className="space-y-5 md:ml-7 md:max-w-[560px]">
                  <EssenceBody as="p">Một người có thể nói chuyện bình tĩnh hơn nhưng bên trong vẫn đang tự ép mình.</EssenceBody>
                  <EssenceBody as="p">Điều tôi quan tâm không phải là họ có vẻ ổn đến đâu, mà là họ có đang nhìn rõ hơn hay không.</EssenceBody>
                </div>
              </div>
              <div>
                <EssenceLeadIn as="h3" className="mb-3">Tôi muốn khả năng tự chọn dần trở về với bạn.</EssenceLeadIn>
                <div className="space-y-5 md:ml-7 md:max-w-[560px]">
                  <EssenceBody as="p">Tôi không muốn bạn phải cần tôi để hiểu mình hay quyết định thay cho đời mình.</EssenceBody>
                  <EssenceBody as="p">Công việc chỉ có ý nghĩa khi bạn dần có thể tự nhìn, tự cân nhắc và tự chọn.</EssenceBody>
                </div>
              </div>
            </div>
            <EssenceBody as="p" className="mt-12 md:mt-16"><Link href="/phuong-phap" className={linkUnderline}>Đọc cách tôi làm việc →</Link></EssenceBody>
          </div>
        </section>

        <section className={`px-6 ${RHYTHM.thuong}`} style={{ background: sectionBg(BG.boundaries) }}>
          <div className="ve-kenji-reveal max-w-[760px] mx-auto">
            <SectionLabel>NHỮNG ĐIỀU TÔI TỰ GIỮ</SectionLabel>
            <EssenceAnchor as="h2" className="mb-10 md:mb-12">
              Tin cậy không đến từ việc nói mình hiểu.<br />
              Nó đến từ những giới hạn mình không bước qua.
            </EssenceAnchor>
            <div className="space-y-5">
              <EssenceBody as="p">Những ranh giới này không làm một cuộc đồng hành trở nên lạnh hơn.</EssenceBody>
              <EssenceBody as="p">Chúng giúp cả hai biết mình đang đứng ở đâu.</EssenceBody>
            </div>
            <div className="space-y-10 md:space-y-12 mt-12 md:mt-16">
              <div>
                <EssenceLeadIn as="h3" className="mb-3">Tôi không chẩn đoán.</EssenceLeadIn>
                <div className="space-y-5 md:ml-7 md:max-w-[560px]">
                  <EssenceBody as="p">Coaching không thay thế bác sĩ, chuyên gia tâm lý lâm sàng hoặc chăm sóc sức khỏe tâm thần.</EssenceBody>
                  <EssenceBody as="p">Khi điều một người đang mang cần đến chuyên môn khác, tôi nói thẳng.</EssenceBody>
                </div>
              </div>
              <div>
                <EssenceLeadIn as="h3" className="mb-3">Tôi không tạo sự phụ thuộc.</EssenceLeadIn>
                <div className="space-y-5 md:ml-7 md:max-w-[560px]">
                  <EssenceBody as="p">Tôi không muốn một người phải cần tôi để tiếp tục hiểu hoặc quyết định đời mình.</EssenceBody>
                  <EssenceBody as="p">Mục tiêu của công việc không phải giữ họ ở lại lâu, mà giúp khả năng tự nhìn và tự chọn trở nên vững hơn.</EssenceBody>
                </div>
              </div>
              <div>
                <EssenceLeadIn as="h3" className="mb-3">Tôi không để AI đóng vai tôi.</EssenceLeadIn>
                <div className="space-y-5 md:ml-7 md:max-w-[560px]">
                  <EssenceBody as="p">AI có thể hỗ trợ vận hành, sắp xếp, ghi lại và đối chiếu.</EssenceBody>
                  <EssenceBody as="p">AI không đồng hành thay tôi và không đưa ra quyết định thay tôi.</EssenceBody>
                  <EssenceBody as="p">Bản gửi đến khách do tôi đọc và viết từ đầu đến cuối.</EssenceBody>
                </div>
              </div>
              <div>
                <EssenceLeadIn as="h3" className="mb-3">Tôi không dán nhãn trẻ em.</EssenceLeadIn>
                <div className="space-y-5 md:ml-7 md:max-w-[560px]">
                  <EssenceBody as="p">Một góc nhìn chỉ nên giúp ba mẹ quan sát con dịu hơn.</EssenceBody>
                  <EssenceBody as="p">Nó không nên biến con thành một kết luận cố định, một dự báo tương lai hay một vai mà con phải sống theo.</EssenceBody>
                </div>
              </div>
            </div>
            <div className="max-w-[620px] mt-12 md:mt-16">
              <EssenceAccent as="p">Tôi cũng không lấy chứng chỉ hay danh tiếng làm bằng chứng rằng mình luôn đúng.</EssenceAccent>
              <EssenceAccent as="p" className="mt-5">Khi đi sai nhịp, tôi quay lại, xin lỗi và chỉnh.</EssenceAccent>
            </div>
          </div>
        </section>

        <VeKenjiDivider />

        <section className={`px-6 ${RHYTHM.thuong}`} style={{ background: sectionBg(BG.faq) }}>
          <div className="ve-kenji-reveal max-w-[1040px] mx-auto">
            <EssenceUtility as="h2" className="text-[#1A1A1A]/60 mb-8 md:mb-10">
              NHỮNG ĐIỀU BẠN CÓ THỂ MUỐN BIẾT
            </EssenceUtility>
            <div className="grid gap-x-16 gap-y-10 md:grid-cols-2 md:gap-y-12">
              {faqs.map((faq) => (
                <div key={faq.q} className="border-t border-e26-text/10 pt-6">
                  <EssenceLeadIn as="h3" className="mb-3">{faq.q}</EssenceLeadIn>
                  <div className="space-y-5 md:ml-7 md:max-w-[430px]">
                    {faq.a.split("\n\n").map((paragraph) => <EssenceBody as="p" className="text-[#1A1A1A]/85" key={paragraph}>{paragraph}</EssenceBody>)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className={`px-6 ${RHYTHM.lang}`} style={{ background: sectionBg(BG.discovery) }}>
          <div className="ve-kenji-reveal max-w-[960px] mx-auto">
            <SectionLabel>BẠN MUỐN HIỂU THÊM ĐIỀU GÌ?</SectionLabel>
            <EssenceAnchor as="h2" className="mb-12 md:mb-16">Mỗi cánh cửa trả lời một câu hỏi khác nhau.</EssenceAnchor>
            <div className="space-y-12 md:space-y-16">
              <div className="max-w-[660px] border-t border-e26-text/10 pt-7">
                <EssenceAnchor as="h3" level="h3" className="text-[28px] md:text-[38px] mb-4">Cách tôi làm việc</EssenceAnchor>
                <div className="space-y-5">
                  <EssenceBody as="p">Khoảng An định có vai trò gì? Một cuộc đồng hành diễn ra ra sao? Và Tự Do — Trí Tuệ — Kiến Tạo đi vào công việc như thế nào?</EssenceBody>
                  <EssenceBody as="p"><Link href="/phuong-phap" className={linkUnderline}>Đọc Phương pháp →</Link></EssenceBody>
                </div>
              </div>
              <div className="grid gap-12 md:grid-cols-2 md:gap-x-20 md:gap-y-14">
                <div className="border-t border-e26-text/10 pt-6">
                  <EssenceAnchor as="h3" level="h3" className="mb-3">Tôi muốn nhìn lại chính mình</EssenceAnchor>
                  <div className="space-y-5">
                    <EssenceBody as="p">Khi bên ngoài vẫn tiếp tục nhưng bên trong đã phải gánh quá nhiều, bạn có thể bắt đầu từ câu chuyện của chính mình.</EssenceBody>
                    <EssenceBody as="p"><Link href="/ban-sac-cua-ban" className={linkUnderline}>Dành cho người lớn →</Link></EssenceBody>
                  </div>
                </div>
                <div className="border-t border-e26-text/10 pt-6">
                  <EssenceAnchor as="h3" level="h3" className="mb-3">Tôi muốn hiểu con rõ hơn</EssenceAnchor>
                  <div className="space-y-5">
                    <EssenceBody as="p">Một cánh cửa dành cho ba mẹ muốn quan sát con dịu hơn, bớt vội kết luận và hiểu điều đang diễn ra phía sau hành vi.</EssenceBody>
                    <EssenceBody as="p"><Link href="/ban-sac-cua-con" className={linkUnderline}>Dành cho ba mẹ →</Link></EssenceBody>
                  </div>
                </div>
              </div>
              <div className="grid gap-12 md:grid-cols-2 md:gap-x-20 md:gap-y-14 pt-2">
                <div>
                  <EssenceLeadIn as="h3" className="mb-3">Những điều Essence không hứa</EssenceLeadIn>
                  <div className="space-y-5">
                    <EssenceBody as="p">Những giới hạn được nói rõ trước khi bạn đi sâu hơn — về kết quả, chuyên môn và trách nhiệm của mỗi bên.</EssenceBody>
                    <EssenceBody as="p"><Link href="/dieu-essence-khong-hua" className={linkUnderline}>Đọc Điều Essence không hứa →</Link></EssenceBody>
                  </div>
                </div>
                <div>
                  <EssenceLeadIn as="h3" className="mb-3">Một câu hỏi dành cho Kenji</EssenceLeadIn>
                  <div className="space-y-5">
                    <EssenceBody as="p">Khi đã đọc nhưng vẫn còn một điều cần làm rõ, bạn có thể gửi cho tôi một câu hỏi.</EssenceBody>
                    <EssenceBody as="p"><Link href="/lien-he" className={linkUnderline}>Liên hệ với Kenji →</Link></EssenceBody>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <HomeFooter />
    </>
  );
}
