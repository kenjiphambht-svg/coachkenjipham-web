import Head from "next/head";
import Link from "next/link";
import { SEO } from "@/components/SEO";
import HomeHeader from "@/components/homepage/HomeHeader";
import HomeFooter from "@/components/homepage/HomeFooter";
import {
  EssenceAccent,
  EssenceAnchor,
  EssenceBody,
  EssenceDisplay,
  EssenceLeadIn,
  EssenceUtility,
} from "@/components/phuong-phap/PhuongPhapTypography";

// ============================================================
// /phuong-phap — VÒNG 1 (brief "GÓI 05" 28/07/2026, bản cập nhật 9 Scene):
// thay bản 8 Scene trước đó (PR #96) — brief mới thêm Scene ⑥ "Đo được,
// không mơ hồ" và dời Ranh giới (nền tối) từ ⑦ → ⑧, CTA từ ⑧ → ⑨. noindex,
// nofollow — CHƯA duyệt công khai (LUẬT 2 brief). Copy NGUYÊN VĂN, không tự
// sửa chữ. Không nhắc FCP/Casting/Gateway/Clear ở bất kỳ đâu. Scene ⑧ (Ranh
// giới) nền tối — dark section duy nhất của trang. Đúng 1 nút vàng (Scene ⑨).
// Schema: Article + BreadcrumbList.
//
// Vòng này CHƯA có ảnh — nền là CSS thuần (Page Mode mode ấm-nhẹ, mục 4 brief).
//
// EssenceAccent dùng ĐÚNG 3 lần — brief đánh số rõ tại Scene ⑤⑥⑦, không thêm
// ở đâu khác (không còn là lựa chọn tự quyết như bản 8 Scene trước — Scene ⑥
// mới đã cho sẵn câu Accent thứ 3 "Đây là những dấu hiệu...").
//
// CTA vàng cuối trang (Scene ⑨) trỏ /ve-kenji, KHÔNG trỏ section "Hai Cửa"
// (TwoStates.tsx): đã đọc src/pages/index.tsx (route "/" sống hiện tại vẫn là
// bản Coming Soon cũ) và src/pages/trang-chu-v2.tsx (comment đầu file ghi rõ
// "Route TẠM ... NOINDEX — chưa công khai ... Khi duyệt xong, nội dung này sẽ
// thay thế index.tsx thật") — /trang-chu-v2 CHƯA phải bản sống chính thức nên
// theo đúng nhánh dự phòng brief mục 2 Scene ⑨, CTA trỏ /ve-kenji. Nhất quán
// với /ve-kenji (đã trỏ /phuong-phap) và /dieu-essence-khong-hua (CTA cùng
// dạng cũng trỏ /ve-kenji).
//
// personSchema tái dùng NGUYÊN VĂN từ src/pages/ve-kenji.tsx (không viết lại
// từ đầu, theo đúng brief mục 5) — page component không export nên copy y
// nguyên object (cùng dữ liệu, không phải viết mới).
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

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Phương pháp Essence",
  description:
    "Phương pháp Essence: nhìn rõ vòng lặp và kiểu gánh, theo tiêu chuẩn ICF, tâm lý học chiều sâu và khoa học thần kinh — không đường tắt, không hứa nhanh.",
  author: personSchema,
  publisher: { "@type": "Organization", name: "Essence Coaching System" },
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

// Page Mode — mode ấm-nhẹ (brief mục 4). 4 token màu đã có trong hệ, không tự
// chế màu mới. rising/steady là nội suy tuyến tính cream→ivory (không phải
// màu thứ 5 độc lập) — cùng công thức BG.rising/BG.steady của /ve-kenji.
const BG = {
  base: "var(--essence-cream-2026)", // #F1EFE8 — ①②
  rising: "#F6F5F0", // cream→ivory ~55% — ③④ / ⑧ lắng lại
  steady: "#F8F7F4", // cream→ivory ~80% — ⑤ mở
  peak: "var(--essence-ivory-2026)", // #FAF9F7 — ⑤ chốt, ⑥
};

export default function PhuongPhapPage() {
  return (
    <>
      <SEO
        title="Phương pháp Essence | Coaching chiều sâu theo ICF"
        description="Phương pháp Essence: nhìn rõ vòng lặp và kiểu gánh, theo tiêu chuẩn ICF, tâm lý học chiều sâu và khoa học thần kinh — không đường tắt, không hứa nhanh."
        image="/essence-og-1200x630.png"
        url="https://coachkenjipham.com/phuong-phap"
      />
      <Head>
        <meta name="robots" content="noindex, nofollow" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/favicon-192.png" />
        <link rel="icon" type="image/png" sizes="512x512" href="/favicon-512.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon-180.png" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />
      </Head>

      <HomeHeader />

      <main className="text-e26-text">
        {/* ①② — base cream, một khối nền liền mạch không seam */}
        <div style={{ background: BG.base }}>
          {/* ① HERO */}
          <section className="max-w-[720px] mx-auto px-6 pt-16 pb-10 md:pt-24 md:pb-12">
            <EssenceUtility as="p" className="mb-6 md:mb-8">
              Phương pháp Essence
            </EssenceUtility>
            <EssenceDisplay as="h1">
              Essence không bắt đầu bằng lời khuyên.
              <br />
              Essence bắt đầu bằng việc nhìn rõ.
            </EssenceDisplay>
            <EssenceBody as="p" className="mt-8 md:mt-10">
              Phần lớn chúng ta không cần thêm một lời khuyên. Chúng ta cần được nhìn thấy đúng —
              rồi tự mình chọn bước tiếp theo.
            </EssenceBody>
          </section>

          {/* ② HAI THỨ ĐANG ÂM THẦM VẬN HÀNH BÊN DƯỚI */}
          <section className="max-w-[720px] mx-auto px-6 pt-6 pb-16 md:pt-8 md:pb-24">
            <EssenceAnchor as="h2" className="mb-10 md:mb-12">
              Hai thứ đang âm thầm vận hành bên dưới
            </EssenceAnchor>
            <div className="space-y-6">
              <EssenceBody as="p">
                Có những chuyện cứ lặp lại trong đời bạn — khác người, khác cảnh, nhưng cùng một
                kịch bản. Công việc nào rồi cũng đi đến cùng một kiểu mệt. Mối quan hệ nào rồi
                cũng chạm cùng một bức tường. Đó không phải xui. Đó là một vòng lặp — và vòng lặp
                thì nhìn rõ được.
              </EssenceBody>
              <EssenceBody as="p">
                Mỗi người có một cách riêng để trụ qua giai đoạn khó: người thì ôm hết việc, người
                thì im lặng chịu, người thì phải kiểm soát mọi thứ mới yên. Cách trụ đó từng cứu
                bạn. Nhưng khi giai đoạn khó đã qua mà cách trụ vẫn còn — nó thành một gánh. Và
                gánh lâu thì mỏi, dù bề ngoài vẫn đang ổn.
              </EssenceBody>
            </div>
          </section>
        </div>

        {/* ③④ — rising, mở dần từ base */}
        <section
          className="px-6 pt-16 pb-16 md:pt-24 md:pb-24"
          style={{ background: `linear-gradient(to bottom, ${BG.base} 0%, ${BG.rising} 100%)` }}
        >
          <div className="max-w-[720px] mx-auto">
            <EssenceAnchor as="h2" className="mb-10 md:mb-12">
              Vậy khác gì với coaching thông thường?
            </EssenceAnchor>
            <div className="space-y-6">
              <EssenceBody as="p">
                Phần lớn coaching hướng tới mục tiêu — bạn muốn đi đâu, bước tiếp theo là gì, làm
                sao đi nhanh hơn. Cách đó có giá trị thật, giống một người thầy dạy lái xe giỏi:
                dạy đi đâu, đi thế nào, đi nhanh hơn.
              </EssenceBody>
              <EssenceBody as="p">Essence làm một việc khác: mở nắp ca-pô, xem xe có phanh không.</EssenceBody>
              <EssenceBody as="p">
                Không phải chuyện ai đi trước, ai đi sau. Là chuyện ở bên dưới. Người chưa biết lái
                mà đã ra đường — cần kiểm phanh. Người đã chạy nhanh suốt nhiều năm — cần kiểm
                phanh hơn nữa. Cùng một thứ thiếu, hai kiểu người khác nhau.
              </EssenceBody>
              <EssenceBody as="p">
                Kenji làm việc theo tiêu chuẩn ICF — nền tảng vững về quy trình và đạo đức nghề.
                Essence không thay thế nền đó. Essence bắt đầu ở chỗ nó dừng lại.
              </EssenceBody>
            </div>

            {/* ④ KHÔNG PHẢI CẢM TÍNH — cùng Scene với ③, h3 (không tranh vai H2) */}
            <EssenceAnchor as="h3" level="h3" className="mt-14 mb-8 md:mt-16 md:mb-10">
              Không phải cảm tính
            </EssenceAnchor>
            <div className="space-y-6">
              <EssenceBody as="p">
                Cách tôi đọc một vòng lặp, một kiểu gánh — không dựa vào trực giác đơn thuần. Tôi
                làm việc theo tiêu chuẩn ICF, dựa trên tâm lý học chiều sâu của Carl Jung, tâm lý
                nguyên mẫu, và hiểu biết về cách hệ thần kinh phản ứng khi con người bất an.
              </EssenceBody>
              <EssenceBody as="p">
                Nhưng tôi không dùng những nền tảng đó để đào về quá khứ cho ra vẻ sâu sắc. Tôi đi
                thẳng vào điều đang vận hành trong đời sống bạn hôm nay — vì đó mới là chỗ bạn
                thật sự sống.
              </EssenceBody>
            </div>
          </div>
        </section>

        {/* ⑤ BA GIAI ĐOẠN — steady → peak */}
        <section
          className="px-6 py-16 md:py-24"
          style={{ background: `linear-gradient(to bottom, ${BG.steady} 0%, ${BG.peak} 100%)` }}
        >
          <div className="max-w-[720px] mx-auto">
            <EssenceAnchor as="h2" className="mb-10 md:mb-12">
              Ba giai đoạn — không đường tắt
            </EssenceAnchor>
            <div className="space-y-6">
              <EssenceBody as="p">
                <EssenceLeadIn>Chill với cảm xúc.</EssenceLeadIn> Trước khi làm gì, bạn cần một
                khoảng đủ yên để không bị cảm xúc lái. Không phân tích vội. Không sửa vội. Chỉ
                ngồi lại được với chính mình đã.
              </EssenceBody>
              <EssenceBody as="p">
                <EssenceLeadIn>Thách thức giới hạn.</EssenceLeadIn> Khi đã đủ yên, mình mới nhìn
                thẳng vào vòng lặp và kiểu gánh — bằng những câu hỏi bạn chưa từng được hỏi. Không
                để phán xét. Để bạn thấy rõ.
              </EssenceBody>
              <EssenceBody as="p">
                <EssenceLeadIn>Hiện thực ước mơ.</EssenceLeadIn> Nhìn rõ rồi mới xây. Không phải
                kế hoạch đẹp trên giấy — là những bước thật, theo nhịp thật của đời sống bạn đang
                có.
              </EssenceBody>
            </div>
            <EssenceAccent as="p" className="mt-12 md:mt-16">
              Thứ tự này không đảo được. Essence không đưa ai đi sâu khi họ chưa đủ vững — đó là
              nguyên tắc, không phải chiến thuật.
            </EssenceAccent>
          </div>
        </section>

        {/* ⑥ ĐO ĐƯỢC, KHÔNG MƠ HỒ — peak, tiếp nối, khối tăng uy tín */}
        <section className="px-6 py-16 md:py-24" style={{ background: BG.peak }}>
          <div className="max-w-[720px] mx-auto">
            <EssenceAnchor as="h2" className="mb-10 md:mb-12">
              Đo được, không mơ hồ
            </EssenceAnchor>
            <div className="space-y-6">
              <EssenceBody as="p">
                Tôi không nói "bạn sẽ thấy tốt hơn" rồi để đó. Kết quả của Essence không phải một
                cảm giác mơ hồ — là những thay đổi cụ thể bạn, và cả người xung quanh bạn, nhận ra
                được.
              </EssenceBody>
              <EssenceBody as="p">
                Ngủ sâu hơn. Khi bị chạm, có một nhịp để chọn thay vì phản ứng ngay. Làm việc đúng
                nhịp hơn, không còn phải cố hết sức chỉ để trông ổn. Bớt phải diễn — với người
                khác, và với chính mình.
              </EssenceBody>
            </div>
            <EssenceAccent as="p" className="mt-12 md:mt-16">
              Đây là những dấu hiệu tôi cùng bạn theo dõi được qua thời gian — không phải một lời
              hứa, mà là cách để cả hai cùng biết chuyện có đang đi đúng hướng hay không.
            </EssenceAccent>
          </div>
        </section>

        {/* ⑦ PHÍA SAU LÀ HỆ THỐNG. PHÍA TRƯỚC LÀ CON NGƯỜI — peak, tiếp nối */}
        <section className="px-6 py-16 md:py-24" style={{ background: BG.peak }}>
          <div className="max-w-[720px] mx-auto">
            <EssenceAnchor as="h2" className="mb-10 md:mb-12">
              Phía sau là hệ thống. Phía trước là con người.
            </EssenceAnchor>
            <div className="space-y-6">
              <EssenceBody as="p">
                Phía sau Essence là một hệ vận hành AI được thiết kế riêng — giúp tôi sắp xếp, đối
                chiếu, và giữ chất lượng đều tay ở mọi ấn phẩm.
              </EssenceBody>
              <EssenceBody as="p">
                Nhưng có một ranh giới không đổi: mọi ấn phẩm chuyên sâu gửi đến bạn đều do chính
                tôi phân tích và viết, từ dòng đầu đến dòng cuối.
              </EssenceBody>
            </div>
            <EssenceAccent as="p" className="mt-12 md:mt-16">
              AI không quyết định thay tôi bất kỳ điều gì.
            </EssenceAccent>
          </div>
        </section>

        {/* ⑧ RANH GIỚI — nền tối, điểm tương phản duy nhất của trang */}
        <section className="bg-e26-black px-6 py-24 md:py-[180px]">
          <div className="max-w-[640px] mx-auto text-center">
            <div className="w-12 h-px bg-e26-gold mx-auto mb-14" aria-hidden="true" />
            <EssenceAnchor as="h2" className="text-e26-text-dark mb-14">
              Phương pháp này không dành cho mọi tình huống
            </EssenceAnchor>
            <div className="space-y-6 text-left md:text-center max-w-xl mx-auto">
              <EssenceBody as="p" className="text-e26-text-dark-2 mx-auto">
                Essence là coaching — không phải chăm sóc sức khỏe tinh thần chuyên môn. Nếu bạn
                đang trong khủng hoảng cấp tính, điều bạn cần trước tiên là chuyên gia sức khỏe
                tâm thần hoặc cơ sở y tế — và tôi sẽ nói thẳng điều đó, thay vì nhận một ca ngoài
                phạm vi của mình.
              </EssenceBody>
              <EssenceBody as="p" className="text-e26-text-dark-2 mx-auto">
                Essence cũng không có đường tắt. Không cam kết thay đổi nhanh. Không đoán trước
                tương lai của bạn hay của con bạn.
              </EssenceBody>
            </div>
          </div>
        </section>

        {/* ⑨ CTA — peak → rising, ấm lắng lại */}
        <section
          className="px-6 py-16 md:py-24 text-center"
          style={{ background: `linear-gradient(to bottom, ${BG.peak} 0%, ${BG.rising} 100%)` }}
        >
          <div className="max-w-[720px] mx-auto">
            <EssenceAnchor as="h2" className="mb-10">
              Nếu cách làm này đúng nhịp với bạn
            </EssenceAnchor>
            <div className="flex flex-col items-center gap-8">
              <Link
                href="/dieu-essence-khong-hua"
                className="group inline-flex items-center gap-1.5 font-sans font-normal text-[15px] text-e26-text hover:font-medium hover:text-e26-gold-deep transition-colors duration-300"
              >
                <span>Đọc đầy đủ</span>
                <span
                  aria-hidden="true"
                  className="inline-block transition-transform duration-300 group-hover:translate-x-1"
                >
                  →
                </span>
              </Link>
              <Link
                href="/ve-kenji"
                className="inline-block bg-e26-gold text-e26-black rounded-none font-sans font-medium text-[13px] tracking-[0.08em] uppercase px-10 py-4 hover:bg-e26-gold-deep hover:text-e26-ivory transition-colors duration-300"
              >
                Bắt đầu từ cửa phù hợp
              </Link>
            </div>
          </div>
        </section>
      </main>
      <HomeFooter />
    </>
  );
}
