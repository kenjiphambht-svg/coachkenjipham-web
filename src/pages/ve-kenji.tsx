import Head from "next/head";
import Link from "next/link";
import { useRef } from "react";
import { SEO } from "@/components/SEO";
import HomeHeader from "@/components/homepage/HomeHeader";
import HomeFooter from "@/components/homepage/HomeFooter";
import {
  EssenceAccent,
  EssenceAnchor,
  EssenceBody,
  EssenceDisplay,
  EssenceLeadIn,
  EssenceSignalComposition,
  EssenceUtility,
  VeKenjiToneProvider,
} from "@/components/ve-kenji/VeKenjiTypography";
import { VeKenjiSectionImage } from "@/components/ve-kenji/VeKenjiImagery";
import { useVeKenjiSignalReveal } from "@/hooks/useVeKenjiSignalReveal";

// ============================================================
// "VỀ KENJI" — /ve-kenji (noindex, nofollow — LUẬT 2, còn hiệu lực: KHÔNG
// khai báo Google dưới bất kỳ hình thức nào cho tới khi Kenji duyệt riêng)
// Hạ tầng niềm tin + entity chính cho GEO (schema Person). Copy NGUYÊN VĂN
// Kenji đã chốt — không tự sửa chính tả/từ ngữ/dấu câu.
// Vòng 29/07/2026 "LẮP 5 ẢNH THẬT": thay mode nền CSS-only bằng ảnh Lightscape
// thật (public/images/ve-kenji/*.webp) + overlay rgba tối theo section + GSAP
// parallax cho ④ Signal. Ảnh chân dung (chan-dung-kenji.png) CHƯA dùng — vi
// phạm wood rule (ghế gỗ đen rõ trong khung), xem phiếu báo cáo PR.
// ============================================================

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

const faqs = [
  {
    q: "Kenji Phạm là ai?",
    a: "Tôi là Kenji Phạm — huấn luyện viên tâm lý chiều sâu tại Sài Gòn, người sáng lập Essence Coaching. Tám năm qua, tôi ngồi cùng người lớn, lắng nghe những điều họ chưa từng nói với ai.",
  },
  {
    q: "Kenji Phạm có chứng chỉ gì?",
    a: "Tôi có chứng chỉ ICF — International Coaching Federation. Trước đó, cách tôi làm việc đã dựa trên tâm lý học chiều sâu của Carl Jung, tâm lý nguyên mẫu và khoa học thần kinh.",
  },
  {
    q: "Kenji làm việc với những ai?",
    a: "Người lớn muốn nhìn lại chính mình, và ba mẹ muốn hiểu con hơn. Với tôi hai việc đó là một đường: tám năm ngồi nghe người lớn cho tôi thấy phần lớn những gì đang kéo họ đã bắt đầu từ khi họ còn rất nhỏ.",
  },
  {
    q: "Làm việc với Kenji có ranh giới gì?",
    a: "Có. Tôi viết công khai những dòng đạo đức tôi tự giữ: chỉ nói điều tôi thấy rõ và nói thẳng khi chưa rõ, không hứa phép màu, không đẩy ai đi nhanh hơn mức họ chịu được, không lấy chứng chỉ hay danh tiếng làm thước đo, không tạo phụ thuộc, không thay thế chuyên gia sức khỏe tâm thần, không để AI đóng vai tôi, không dán nhãn trẻ con — và nếu tôi đi sai nhịp thì quay lại, xin lỗi, chỉnh cho đúng.",
  },
  {
    q: "Coaching ở Essence có thay được chuyên gia sức khỏe tâm thần không?",
    a: "Không. Coaching không chẩn đoán và không thay thế chuyên gia tâm lý lâm sàng hay bác sĩ. Nếu điều bạn đang mang cần đến chuyên môn khác, tôi nói thẳng và hướng bạn tới nơi phù hợp hơn.",
  },
  {
    q: "Làm việc ở đâu?",
    a: "Sài Gòn, Việt Nam. Trực tiếp và trực tuyến.",
  },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: {
      "@type": "Answer",
      text: f.a,
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

const IMG = {
  vanMo: "/images/ve-kenji/03-van-mo.webp",
  vanChuyen: "/images/ve-kenji/02-van-chuyen.webp",
  kheVanToi: "/images/ve-kenji/01-khe-van-toi.webp",
  vanSangDinh: "/images/ve-kenji/04-van-sang-dinh.webp",
};

export default function VeKenjiPage() {
  const signalRef = useRef<HTMLDivElement>(null);
  useVeKenjiSignalReveal(signalRef);

  return (
    <>
      <SEO
        title="Kenji Phạm — Huấn Luyện Viên Tâm Lý Chiều Sâu | Essence"
        description="Kenji Phạm cùng bạn nhìn lại các vòng lặp cũ và dựng lại nhịp sống vững vàng từ bản sắc thật. Huấn luyện viên tâm lý chiều sâu tại Sài Gòn."
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

      <main className="text-e26-text">
        {/* ①② — Hero + intro, ảnh 03-van-mo (dùng chính), overlay rất nhẹ để giữ chữ nổi */}
        <VeKenjiSectionImage src={IMG.vanMo} overlay={0.05} priority>
          {/* ① HERO — hơi nén (padding dọc hẹp hơn các khối sau) */}
          <section className="max-w-[720px] mx-auto px-6 pt-14 pb-10 md:pt-20 md:pb-12">
            <EssenceUtility as="p" className="mb-6 md:mb-8">
              Kenji Phạm · Huấn luyện viên tâm lý chiều sâu
            </EssenceUtility>
            <EssenceDisplay as="h1">
              Tôi không sửa ai.
              <br />
              Tôi tạo khoảng An định.
            </EssenceDisplay>
            <EssenceBody as="p" className="mt-8 md:mt-10">
              Để bạn nhìn lại câu chuyện cuộc sống của mình, dọn điều đang kéo mình, và bạn chọn
              lại nhịp sống — từ nơi thật hơn bên trong.
            </EssenceBody>
          </section>

          {/* ② — nối tiếp Hero, không heading hiện. Chân dung Kenji CHƯA đặt ở đây —
              xem phiếu báo cáo PR (wood rule + vị trí còn là đề xuất, chưa Kenji chốt). */}
          <section className="max-w-[720px] mx-auto px-6 pt-6 pb-14 md:pt-8 md:pb-20">
            <div className="space-y-5">
              <EssenceBody as="p">
                Tôi là Kenji Phạm — huấn luyện viên tâm lý chiều sâu tại Sài Gòn, người sáng lập
                Essence Coaching.
              </EssenceBody>
              <EssenceBody as="p">
                <Link href="/ban-sac-cua-ban" className={linkUnderline}>
                  Tám năm qua, tôi ngồi cùng người lớn trong những đoạn họ muốn nhìn lại chính
                  mình.
                </Link>
              </EssenceBody>
              <EssenceBody as="p">
                <Link href="/ban-sac-cua-con" className={linkUnderline}>
                  Và ngồi cùng ba mẹ, khi họ muốn hiểu con hơn
                </Link>
              </EssenceBody>
            </div>
            <EssenceAccent as="p" className="mt-12 md:mt-16">
              Câu chuyện cuộc sống của bạn là một kiệt tác.
            </EssenceAccent>
          </section>
        </VeKenjiSectionImage>

        {/* ③ — ảnh 02-van-chuyen dùng lại, overlay đậm hơn ⑤⑥ (nặng dần trước Signal).
            Overlay tăng từ 0.12→0.5 + đổi tone chữ sáng: đo thật bằng ảnh chụp, 0.12 +
            chữ tối KHÔNG đủ tương phản trên vùng tối của ảnh (QA "chữ chìm vào nền"
            — cấm sửa bằng text-shadow, phải sửa overlay/tone như brief cho phép). */}
        <VeKenjiSectionImage src={IMG.vanChuyen} overlay={0.5}>
          <VeKenjiToneProvider tone="light">
            <section className="max-w-[720px] mx-auto px-6 pt-16 pb-16 md:pt-24 md:pb-24">
              <EssenceAnchor as="h2" className="mb-10 md:mb-12">
                Tôi không đến từ <em>lý thuyết</em>.
              </EssenceAnchor>
              <div className="space-y-5">
                <EssenceBody as="p">
                  Tôi lớn lên trong một môi trường mà từ rất sớm, tôi phải học cách sinh tồn. Không
                  phải bằng sự dịu dàng — bằng gồng. Bằng kiểm soát. Bằng việc phải chứng minh mình
                  không yếu.
                </EssenceBody>
                <EssenceBody as="p">
                  Sau này, tôi phá sản ba lần. Hôn nhân tan vỡ. Từ năm 2015, tôi một mình nuôi hai
                  con trai và làm lại từ đầu.
                </EssenceBody>
                <EssenceBody as="p">
                  Tôi đã đi qua nhiều nghề — phục vụ, lái xe, trợ lý, bảo hiểm, buôn bán, kinh
                  doanh, truyền thông. Nhiều việc giúp tôi sống. Nhưng chỉ khi gặp coaching — khi
                  tôi giúp một người nhìn ra điều đang âm thầm kéo họ — tôi mới thấy: à…mình đang ở
                  đúng chỗ.
                </EssenceBody>
                <EssenceBody as="p">
                  Từ rất lâu trước phiên đầu tiên, tôi đã đi qua nhiều hệ quy chiếu khác nhau để
                  hiểu con người. Tôi chỉ giữ lại phần nào còn đứng được sau hàng trăm buổi ngồi
                  lắng nghe câu chuyện người ta kể. Tâm lý học chiều sâu của Carl Jung ở lại. Tâm lý
                  nguyên mẫu ở lại. Khoa học thần kinh ở lại. Còn lại, tôi để xuống.
                </EssenceBody>
                <EssenceBody as="p">
                  Và từ một câu hỏi: nếu đời mình đã từng vỡ như vậy — mình có thể dựng nó thành thứ
                  giúp người khác bớt lạc hơn không?
                </EssenceBody>
              </div>
            </section>
          </VeKenjiToneProvider>
        </VeKenjiSectionImage>

        {/* ④ SIGNAL COMPOSITION — ảnh 01-khe-van-toi độc quyền, KHÔNG dùng lại nơi khác.
            GSAP: parallax liên tục (yPercent -4→4, scrub) + reveal 1 lần (hairline + tầng A/B). */}
        <VeKenjiSectionImage
          src={IMG.kheVanToi}
          overlay={0}
          imgClassName="ve-kenji-signal-image scale-110"
          className="py-28 px-6 md:py-40"
        >
          <div ref={signalRef}>
            <EssenceSignalComposition
              onImage
              tierA="Essence không sinh ra từ một ý tưởng đẹp."
              tierB="Essence sinh ra từ những lần gãy đổ."
            />
          </div>
        </VeKenjiSectionImage>

        {/* ⑤⑥ — ảnh 02-van-chuyen dùng chính, overlay nhẹ hơn ③ (đo thật: vẫn cần
            tone sáng để chữ nổi trên vùng tối của ảnh, xem ghi chú ở ③). */}
        <VeKenjiSectionImage src={IMG.vanChuyen} overlay={0.42}>
          <VeKenjiToneProvider tone="light">
          <section className="max-w-[720px] mx-auto px-6 pt-16 pb-16 md:pt-24 md:pb-24">
            <EssenceAnchor as="h2" className="mb-10 md:mb-12">
              Tôi đọc, để hiểu — <em>không để phán</em>.
            </EssenceAnchor>
            <div className="space-y-5">
              <EssenceBody as="p">
                Điều tôi học được nhiều nhất là: cái đang kéo một người thường không nằm ở chỗ họ
                đang nhìn.
              </EssenceBody>
              <EssenceBody as="p">
                Tôi không đọc tâm lý người khác để dán nhãn họ. Tôi đọc để hiểu điều gì đang vận
                hành bên dưới: những phản xạ cũ, những cách mình từng phải dùng để trụ lại, vai
                diễn mình mang ra đời, và bản sắc thật đang chờ được sống.
              </EssenceBody>
              <EssenceBody as="p">
                Việc này tôi làm từ lâu trước khi biết nó có một cái tên nghề. Đọc, ngồi nghe, đối
                chiếu — nhiều năm như vậy, trước khi tôi biết người ta gọi nó là coaching.
              </EssenceBody>
              <EssenceBody as="p">
                ICF đến sau. Tôi học vì thấy mình cần một khung nghề rõ ràng, và cần một bộ quy
                tắc từ bên ngoài để tự soi — chứ không chỉ dựa vào cảm nhận của riêng mình. Chứng
                chỉ đó không làm tôi hiểu người sâu hơn. Nó cho tôi khung làm việc có kỷ luật hơn.
                Tôi giữ nó vì lý do này.
              </EssenceBody>
              <EssenceBody as="p">
                Nhưng tám năm ngồi nghe, tôi thấy một điều lặp lại. Có người chưa đủ yên mà đã
                được hỏi bước tiếp theo là gì — họ trả lời được, và rồi họ mệt thêm. Có người đã
                tới đích rồi mới thấy trống — đạt được, nhưng đạt bằng cách căng mình lên.
              </EssenceBody>
              <EssenceBody as="p">
                Cả hai đều thiếu cùng một thứ, và thứ đó không nằm trước hay sau cái đích. Nó nằm
                bên dưới. Tôi làm phần bên dưới ấy.
              </EssenceBody>
              <EssenceBody as="p">
                Cách làm cụ thể tôi viết riêng ở{" "}
                <Link
                  href="/phuong-phap"
                  className="italic hover:text-e26-gold-deep transition-colors duration-300"
                >
                  Phương pháp
                </Link>
              </EssenceBody>
            </div>
          </section>

          <section className="max-w-[720px] mx-auto px-6 pb-16 md:pb-24">
            <EssenceAnchor as="h2" className="mb-8">
              Điều tôi hướng tới cùng bạn
            </EssenceAnchor>
            <EssenceBody as="p">
              Ngồi yên không phải là đích. Nó là chỗ để từ đó nhìn ra mình thật sự muốn đi đâu.
            </EssenceBody>
            <EssenceBody as="p" className="mt-5">
              Ba giá trị gốc của tôi, cũng là ba điều tôi hướng mọi người về:
            </EssenceBody>

            <p
              className="font-serif text-[30px] md:text-[42px] my-12 md:my-16"
              style={{ color: "var(--essence-gold-deep-2026)" }}
            >
              Tự Do — Trí Tuệ — Kiến Tạo
            </p>

            <div className="space-y-5">
              <EssenceBody as="p">
                Tự Do không phải là làm gì cũng được. Tự Do là không còn bị phản xạ cũ lái đời
                mình.
              </EssenceBody>
              <EssenceBody as="p">
                Trí Tuệ không phải là biết nhiều. Trí Tuệ là nhìn được điều đang thật sự diễn ra,
                kể cả khi nó không dễ chịu.
              </EssenceBody>
              <EssenceBody as="p">
                Kiến Tạo không phải là làm được nhiều việc. Kiến Tạo là dựng đời sống từ nơi thật,
                không từ nỗi sợ.
              </EssenceBody>
            </div>

            <EssenceAccent as="p" className="mt-12 md:mt-16">
              Ba điều đó không đến cùng lúc. Chúng đến theo thứ tự.
            </EssenceAccent>

            <div className="space-y-5 mt-12 md:mt-16">
              <EssenceBody as="p">
                <EssenceLeadIn>Chill với cảm xúc</EssenceLeadIn> — học ở cùng cảm xúc mà không bị
                nó cuốn đi.
              </EssenceBody>
              <EssenceBody as="p">
                <EssenceLeadIn>Thách thức giới hạn</EssenceLeadIn> — nhìn thẳng vào những vòng lặp
                cũ, khi bên trong đã đủ yên để nhìn.
              </EssenceBody>
              <EssenceBody as="p">
                <EssenceLeadIn>Hiện thực ước mơ</EssenceLeadIn> — dựng lại đời sống từ bản sắc
                thật.
              </EssenceBody>
            </div>
          </section>
          </VeKenjiToneProvider>
        </VeKenjiSectionImage>

        {/* ⑦ — ảnh 03-van-mo dùng lại, overlay trung tính (đo thật: cần tone sáng,
            xem ghi chú ở ③ — cùng ảnh 03-van-mo nhưng crop khác Hero nên tương phản khác). */}
        <VeKenjiSectionImage src={IMG.vanMo} overlay={0.42}>
          <VeKenjiToneProvider tone="light">
          <section className="max-w-[720px] mx-auto px-6 pt-16 pb-16 md:pt-24 md:pb-24">
            <EssenceAnchor as="h2" className="mb-10 md:mb-12">
              La bàn tôi <em>tự giữ</em>
            </EssenceAnchor>
            <div className="space-y-5">
              <EssenceBody as="p">
                Con đường này đi qua những tầng khá nhạy. Nên trước khi mình bắt đầu, tôi muốn
                bạn biết tôi tự giữ mình bằng gì.
              </EssenceBody>
              <EssenceBody as="p">
                Tôi không phải guru. Không phải thầy tâm linh. Không phải người biết trước tương
                lai của bạn.
              </EssenceBody>
              <EssenceBody as="p">
                Nghề này có bộ quy tắc đạo đức riêng, và ICF giữ phần đó khá chặt. Nhưng có những
                điều không ai kiểm tra được ngoài chính tôi. Nên tôi viết cho mình một la bàn, và
                để nó ở đây mời bạn đọc.
              </EssenceBody>
              <EssenceBody as="p">
                Không phải để tỏ ra mình đúng. Để tự nhắc mình không đi quá xa khỏi điều mình
                biết.
              </EssenceBody>
            </div>

            <div className="space-y-8 mt-12 md:mt-16">
              <EssenceBody as="p">
                <EssenceLeadIn>Tôi chỉ nói điều tôi thấy rõ.</EssenceLeadIn> Điều chưa rõ, tôi nói
                là chưa rõ. Tôi không biến một cái nhìn thành kết luận về bạn. Và tôi không hứa
                phép màu — không hết mệt sau một buổi, không biết trước điều gì đang chờ bạn.
              </EssenceBody>
              <EssenceBody as="p">
                <EssenceLeadIn>Tôi đi theo nhịp của bạn.</EssenceLeadIn> Có những giai đoạn cần im
                lặng để tiêu hóa, không phải im lặng vì thất bại. Tôi không dùng kỹ thuật để bạn
                trông ổn hơn trong khi bên trong chưa ổn. Và tôi không gọi cái đau của bạn là "bài
                học đẹp" cho sang — tôi chỉ ngồi cùng nó, đủ thật và đủ mềm.
              </EssenceBody>
              <EssenceBody as="p">
                <EssenceLeadIn>Tôi không muốn bạn cần tôi lâu.</EssenceLeadIn> Một buổi làm việc
                tốt không khiến bạn nghĩ "không có Kenji thì tôi không xong". Nó khiến bạn nghĩ
                "tôi thấy rõ hơn, và tôi biết bước tiếp theo của mình". Chứng chỉ, danh tiếng, hay
                việc từng học với ai — tôi không lấy làm thước đo. Thước đo là bạn có thật sự nhẹ
                hơn không.
              </EssenceBody>
              <EssenceBody as="p">
                <EssenceLeadIn>Tôi biết chỗ mình phải dừng.</EssenceLeadIn> Tôi không chẩn đoán,
                không thay bác sĩ hay chuyên gia tâm lý lâm sàng, không tư vấn đầu tư hay pháp lý.
                Nếu điều bạn mang đến vượt phạm vi này, tôi nói thẳng và chỉ bạn tới nơi phù hợp
                hơn.
              </EssenceBody>
              <EssenceBody as="p">
                <EssenceLeadIn>Tôi không để AI đóng vai tôi.</EssenceLeadIn> Phía sau có một lớp
                vận hành AI giúp tôi nhanh và chính xác hơn khi sắp xếp, đối chiếu, ghi lại. Nhưng
                bản gửi đến bạn, tôi đọc và viết từ đầu đến cuối.
              </EssenceBody>
              <EssenceBody as="p">
                <EssenceLeadIn>Với con của bạn, tôi giữ chặt hơn nữa.</EssenceLeadIn> Chữ tôi viết
                là để ba mẹ nhìn con rõ hơn, không phải để dán cho con một cái nhãn.
              </EssenceBody>
            </div>

            <EssenceBody as="p" className="mt-12 md:mt-16">
              Còn nếu tôi lỡ đẩy nhanh, lỡ gồng, lỡ sai nhịp — tôi quay lại, nói một câu xin lỗi,
              rồi chỉnh cho đúng.
            </EssenceBody>
          </section>
          </VeKenjiToneProvider>
        </VeKenjiSectionImage>

        {/* ⑦b — ảnh 04-van-sang-dinh dùng chính, gần như nguyên bản (sáng nhất trang) */}
        <VeKenjiSectionImage src={IMG.vanSangDinh} overlay={0.03}>
          <section className="max-w-[720px] mx-auto px-6 pt-16 pb-16 md:pt-24 md:pb-24">
            <EssenceAnchor as="h2" className="mb-8">
              Đổi lại, bạn nhận được gì
            </EssenceAnchor>
            <EssenceBody as="p" className="mb-5">
              Đổi lại, đây là những gì tôi giữ được cho bạn.
            </EssenceBody>

            <div className="space-y-5">
              <EssenceBody as="p">
                <EssenceLeadIn>Trước hết là sự rõ ràng.</EssenceLeadIn> Bạn thấy được điều gì
                đang thật sự vận hành trong đời mình — thay vì chỉ thấy mình mệt mà không biết vì
                sao.
              </EssenceBody>
              <EssenceBody as="p">
                <EssenceLeadIn>Từ chỗ rõ, bên trong bắt đầu có một khoảng yên.</EssenceLeadIn> Tôi
                gọi đó là An định. Không phải bình an kiểu không còn chuyện gì xảy ra. Là khi bị
                chạm, bạn còn một nhịp để chọn, thay vì bị nhịp cũ kéo đi.
              </EssenceBody>
              <EssenceBody as="p">
                <EssenceLeadIn>
                  Và khi nền đó đủ vững, đời sống bên ngoài thường tự có trái.
                </EssenceLeadIn>{" "}
                Công việc đúng nhịp hơn. Quan hệ thật hơn. Chuyện tiền bớt căng. Thân nhẹ hơn. Đó
                là An thịnh — không phải thứ tôi làm ra cho bạn, mà là thứ mọc lên khi bên trong
                bạn nền đã vững.
              </EssenceBody>
            </div>

            <div className="space-y-5 mt-8">
              <EssenceBody as="p">
                Thứ tự đó không đảo được. An định trước, An thịnh sau. Và tôi không nói với bạn nó
                mất bao lâu.
              </EssenceBody>
              <EssenceBody as="p">
                Riêng tư, đúng nhịp, và quyền dừng bất cứ lúc nào — ba điều đó luôn thuộc về bạn.
              </EssenceBody>
              <EssenceBody as="p">
                Toàn bộ những điều Essence không hứa, tôi viết rõ{" "}
                <Link
                  href="/dieu-essence-khong-hua"
                  className="italic hover:text-e26-gold-deep transition-colors duration-300"
                >
                  ở đây
                </Link>
              </EssenceBody>
            </div>
          </section>
        </VeKenjiSectionImage>

        {/* ⑧ — ảnh 03-van-mo dùng lại lần 2, overlay hơi tối hơn ⑦ một chút (đo thật:
            cần tone sáng như ⑦, xem ghi chú ở ③). */}
        <VeKenjiSectionImage src={IMG.vanMo} overlay={0.48}>
          <VeKenjiToneProvider tone="light">
            <section className="max-w-[720px] mx-auto px-6 pt-16 pb-16 md:pt-24 md:pb-24">
              <EssenceAnchor as="h2" className="mb-10 md:mb-12">
                Vài câu người ta hay hỏi tôi
              </EssenceAnchor>
              <div className="space-y-10 md:space-y-12">
                {faqs.map((f) => (
                  <div key={f.q}>
                    <EssenceAnchor as="h3" level="h3" className="mb-3">
                      {f.q}
                    </EssenceAnchor>
                    <EssenceBody as="p">{f.a}</EssenceBody>
                  </div>
                ))}
              </div>
            </section>
          </VeKenjiToneProvider>
        </VeKenjiSectionImage>

        {/* ⑨ — ảnh 04-van-sang-dinh dùng lại, khép trang êm */}
        <VeKenjiSectionImage src={IMG.vanSangDinh} overlay={0.05}>
          <section className="max-w-[720px] mx-auto px-6 pt-16 pb-24 md:pt-24 md:pb-32">
            <div className="space-y-5">
              <EssenceBody as="p">
                Nếu bạn muốn đi tiếp một bước,{" "}
                <Link
                  href="/phuong-phap"
                  className="underline decoration-1 underline-offset-4 transition-colors duration-300"
                  style={{ color: "var(--essence-gold-deep-2026)" }}
                >
                  Phương pháp
                </Link>{" "}
                là chỗ kế tiếp
              </EssenceBody>
              <EssenceBody as="p">
                Còn nếu bạn chỉ muốn hỏi một câu,{" "}
                <Link href="/lien-he" className={linkUnderline}>
                  chỗ này
                </Link>{" "}
                là để cho việc đó
              </EssenceBody>
            </div>
            <EssenceAccent as="p" className="mt-14 mb-8 md:mt-20">
              Bạn không cần quyết gì hôm nay. Cửa không đóng, và nhịp là của bạn.
            </EssenceAccent>
          </section>
        </VeKenjiSectionImage>
      </main>

      <HomeFooter />
    </>
  );
}
