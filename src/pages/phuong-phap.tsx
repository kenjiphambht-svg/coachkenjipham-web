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
// /phuong-phap — dựng ở PR #96 (8 Scene) + #98 (9 Scene) + v3 (đổi chữ/CTA).
// PR này (brief "v4" 29/07/2026) CHỈ sửa CHỮ ở Scene ④⑥⑦⑨ + tinh chỉnh bố
// cục ở Scene ④⑤⑥ (đánh số 01/02/03 Vai 5, danh sách gạch ngang thụt lề) —
// vẫn dùng đúng 5 vai đã có trong PhuongPhapTypography.tsx, không tạo style
// mới, không đổi Page Mode/schema. noindex, nofollow — CHƯA duyệt công khai
// (LUẬT 2 brief). Copy NGUYÊN VĂN, không tự sửa chữ. Không nhắc FCP/Casting/
// Gateway/Clear ở bất kỳ đâu. Scene ⑧ (Ranh giới) nền tối — dark section duy
// nhất của trang. Đúng 1 nút vàng (Scene ⑨). Schema: Article + BreadcrumbList.
//
// Vòng này CHƯA có ảnh — nền là CSS thuần (Page Mode mode ấm-nhẹ, mục 4 brief).
//
// EssenceAccent dùng ĐÚNG 3 lần (Scene ②⑤⑦, không đổi so với v3). Scene ⑥
// KHÔNG có Accent nào.
//
// ICF xuất hiện ĐÚNG 1 LẦN trong chữ khách đọc, ở Scene ④ (brief v4 mục A1:
// viết lại 4 đoạn Body, câu ICF vẫn chỉ ở đây — không nơi nào khác trên trang).
//
// Số điểm gold trên trang: ĐÚNG 2 (nút vàng Scene ⑨, gạch vàng Scene ⑧). Số
// 01/02/03 ở Scene ⑤ dùng EssenceUtility mặc định (text-e26-text-2), KHÔNG
// tô vàng — brief v4 mục B3 dành điểm gold thứ 3 cho lớp ảnh sắp tới.
//
// CTA vàng cuối trang (Scene ⑨) trỏ /ve-kenji, KHÔNG trỏ section "Hai Cửa"
// (TwoStates.tsx trên Homepage — dẫn /ban-sac-cua-ban và /ban-sac-cua-con,
// CẢ HAI ROUTE ĐÃ SỐNG THẬT, Homepage đã link tới cả hai): lý do KHÔNG phải
// kỹ thuật (không phải vì thiếu route) mà là PHẠM VI — việc dựng lại hành
// trình/CTA hiển thị của chính trang /phuong-phap thuộc về Page Contract mới
// (do Founder duyệt riêng), không thuộc phạm vi cleanup này. Cho tới khi đó,
// CTA legacy vẫn giữ nguyên trỏ /ve-kenji. Nhất quán với /ve-kenji (đã trỏ
// /phuong-phap) và /dieu-essence-khong-hua (CTA cùng dạng cũng trỏ /ve-kenji).
// (KHỐI 2 bên dưới — "Về phía bạn/con (sắp mở)" — là 2 nhãn placeholder CỦA
// RIÊNG TRANG NÀY, cố ý chưa link ở lần dựng Scene ⑨ trước; không liên quan
// tới việc /ban-sac-cua-ban và /ban-sac-cua-con có tồn tại hay không.)
// (SỬA 07/08/2026 — dọn residue: bỏ lý do cũ dựa trên route "/" từng là bản
// Coming Soon và trích comment src/pages/trang-chu-v2.tsx — cả hai đều lỗi
// thời. "/" giờ là Homepage Villa hoàn chỉnh duy nhất; /trang-chu-v2 đã
// retire và xoá khỏi repo (Founder Decision 07/08/2026, L0 C-19).)
// (SỬA 07/08/2026, lần 2 — Founder review PR #148: bản sửa lần đầu ở trên
// từng viết sai thành "Hai Cửa... chưa có route thật" — ĐỌC SAI, /ban-sac-
// cua-ban và /ban-sac-cua-con đã sống thật và Homepage đã link. Viết lại
// đúng lý do: phạm vi/quy trình, không phải thiếu route.)
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
        title="Phương pháp Essence | Coaching tâm lý chiều sâu"
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
            <EssenceAccent as="p" className="mt-12 md:mt-16">
              Tám năm ngồi nghe người lớn nói những điều họ không nói ở nơi khác, tôi thấy hai
              thứ này gần như lúc nào cũng có mặt.
            </EssenceAccent>
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
                sao đi nhanh hơn. Cách đó có giá trị thật, và nhiều người cần đúng thứ đó.
              </EssenceBody>
              <EssenceBody as="p">
                Essence bắt đầu ở một chỗ khác. Nếu coaching mục tiêu là dạy căng buồm, thì việc
                tôi làm là hỏi trước một câu: thuyền này đã có neo chưa.
              </EssenceBody>
              <EssenceBody as="p">
                Buồm quyết định bạn đi được bao xa. Neo quyết định bạn có dừng được không khi cần
                dừng. Người chưa từng ra khơi cần neo. Người đã đi mười năm không nghỉ càng cần
                neo hơn.
              </EssenceBody>
              <EssenceBody as="p">
                Đó là câu chuyện ở bên dưới. Cùng một thứ thiếu, hai kiểu người khác nhau.
              </EssenceBody>
            </div>

            {/* ④ KHÔNG PHẢI CẢM TÍNH — cùng Scene với ③, h3 (không tranh vai H2) */}
            <EssenceAnchor as="h3" level="h3" className="mt-14 mb-8 md:mt-16 md:mb-10">
              Không phải cảm tính
            </EssenceAnchor>
            <div className="space-y-6">
              <EssenceBody as="p">
                Cách tôi đọc một vòng lặp, một kiểu gánh không đến từ trực giác. Nó đến từ nền
                tảng.
              </EssenceBody>
              <EssenceBody as="p">
                Tiêu chuẩn ICF là một khung nghiêm ngặt — về đạo đức nghề, về sự hiện diện, về
                những ranh giới không được vượt. Tôi làm việc trong khung đó.
              </EssenceBody>
              <EssenceBody as="p">
                Nhưng ICF không quy định người coach phải dựa vào đâu để hiểu điều mình đang nghe.
                Phần đó mỗi người tự chọn, và tự chịu trách nhiệm. Tôi chọn tâm lý học chiều sâu
                của Carl Jung, tâm lý nguyên mẫu, và hiểu biết về cách hệ thần kinh phản ứng khi
                con người bất an.
              </EssenceBody>
              <EssenceBody as="p">
                Trên những nền tảng đó, tôi tự đặt thêm cho mình vài điều kiện riêng. Không phải
                để tỏ ra khắt khe, mà để tự nhắc mình không đi quá xa:
              </EssenceBody>
            </div>
            <div className="space-y-3 mt-5">
              <EssenceBody as="p" className="pl-6 md:pl-8">
                — không đưa ai vào tầng sâu khi họ chưa đủ vững
              </EssenceBody>
              <EssenceBody as="p" className="pl-6 md:pl-8">
                — không kết luận thay người tôi đang ngồi cùng
              </EssenceBody>
              <EssenceBody as="p" className="pl-6 md:pl-8">
                — không dùng quá khứ của họ để làm một buổi làm việc nghe có vẻ sâu sắc
              </EssenceBody>
            </div>
            <EssenceBody as="p" className="mt-8">
              Tôi đi thẳng vào điều đang vận hành trong đời sống bạn hôm nay — vì đó mới là chỗ
              bạn thật sự sống.
            </EssenceBody>
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
                Hành trình dài đi qua ba chặng. Mỗi chặng có tên riêng, và có việc riêng phải xong
                trước khi sang chặng sau.
              </EssenceBody>
              <div className="space-y-10 md:space-y-12">
                <div>
                  <EssenceUtility as="p" className="mb-2">
                    01
                  </EssenceUtility>
                  <EssenceBody as="p">
                    <EssenceLeadIn>Chill với cảm xúc</EssenceLeadIn> — Trước khi làm gì, bạn cần
                    một khoảng đủ yên để không bị cảm xúc lái. Không phân tích vội. Không sửa vội.
                    Chỉ ngồi lại được với chính mình đã.
                  </EssenceBody>
                </div>
                <div>
                  <EssenceUtility as="p" className="mb-2">
                    02
                  </EssenceUtility>
                  <EssenceBody as="p">
                    <EssenceLeadIn>Thách thức giới hạn</EssenceLeadIn> — Khi đã đủ yên, mình mới
                    nhìn thẳng vào vòng lặp và kiểu gánh, bằng những câu hỏi bạn chưa từng được
                    hỏi. Không để phán xét. Để bạn thấy rõ.
                  </EssenceBody>
                </div>
                <div>
                  <EssenceUtility as="p" className="mb-2">
                    03
                  </EssenceUtility>
                  <EssenceBody as="p">
                    <EssenceLeadIn>Hiện thực ước mơ</EssenceLeadIn> — Nhìn rõ rồi mới xây. Không
                    phải kế hoạch đẹp trên giấy — là những bước thật, theo nhịp thật của đời sống
                    bạn đang có.
                  </EssenceBody>
                </div>
              </div>
            </div>
            <EssenceAccent as="p" className="mt-12 md:mt-16">
              Thứ tự này không đảo được. Essence không đưa ai đi sâu khi họ chưa đủ vững — đó là
              nguyên tắc, không phải chiến thuật.
            </EssenceAccent>
          </div>
        </section>

        {/* ⑥ LẤY GÌ ĐỂ BIẾT MÌNH ĐANG ĐI ĐÚNG HƯỚNG — peak, tiếp nối, khối tăng uy tín */}
        <section className="px-6 py-16 md:py-24" style={{ background: BG.peak }}>
          <div className="max-w-[720px] mx-auto">
            <EssenceAnchor as="h2" className="mb-10 md:mb-12">
              Lấy gì để biết mình đang đi đúng hướng
            </EssenceAnchor>
            <div className="space-y-6">
              <EssenceBody as="p">
                Buổi đầu, bạn và tôi cùng viết xuống vài điều: điều gì đang làm bạn mỏi nhất, điều
                gì bạn muốn thấy khác đi, và bạn đang thấy mình ở đâu hôm nay. Trang giấy đó được
                giữ lại.
              </EssenceBody>
              <EssenceBody as="p">
                Sau một quãng, mình mở lại đúng trang đó và đọc cùng nhau. Không phải để chấm
                điểm. Để thấy chỗ nào đã dịch chuyển, chỗ nào chưa — và vì sao.
              </EssenceBody>
              <EssenceBody as="p">Những thứ thường dịch chuyển trước tiên:</EssenceBody>
            </div>
            <div className="space-y-3 mt-5">
              <EssenceBody as="p" className="pl-6 md:pl-8">
                — Ngủ sâu hơn.
              </EssenceBody>
              <EssenceBody as="p" className="pl-6 md:pl-8">
                — Khi bị chạm, có một nhịp để chọn thay vì phản ứng ngay.
              </EssenceBody>
              <EssenceBody as="p" className="pl-6 md:pl-8">
                — Làm việc đúng nhịp hơn, không còn phải cố hết sức chỉ để trông ổn.
              </EssenceBody>
              <EssenceBody as="p" className="pl-6 md:pl-8">
                — Bớt phải diễn, với người khác và với chính mình.
              </EssenceBody>
            </div>
            <EssenceBody as="p" className="mt-8">
              Có những thứ bạn không tự thấy, nhưng người sống gần bạn thấy trước.
            </EssenceBody>
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
                Phía sau Essence là một hệ vận hành AI được thiết kế riêng. Nó lo phần việc nặng
                và lặp lại — tra cứu, tập hợp, chuẩn bị tư liệu — để tôi có đủ thời gian cho phần
                chỉ con người mới làm được.
              </EssenceBody>
              <EssenceBody as="p">
                Những gì bạn nói trong phiên không nằm trong hệ đó. Nó ở lại giữa hai người. Cách
                dữ liệu được giữ, tôi viết riêng ở{" "}
                <Link
                  href="/chinh-sach-rieng-tu"
                  className="text-e26-text hover:text-e26-gold-deep transition-colors duration-300"
                >
                  Chính sách riêng tư
                </Link>
                .
              </EssenceBody>
              <EssenceBody as="p">
                Có một ranh giới không đổi: mọi ấn phẩm chuyên sâu gửi đến bạn đều do chính tôi
                phân tích và viết, từ dòng đầu đến dòng cuối.
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
            <EssenceAnchor as="h2" className="mb-14 md:mb-16">
              Nếu cách làm này đúng nhịp với bạn
            </EssenceAnchor>

            {/* KHỐI 1 — biết người làm */}
            <div className="flex flex-col items-center gap-6">
              <EssenceBody as="p" className="mx-auto">
                Nếu bạn muốn biết người sẽ ngồi cùng bạn là ai
              </EssenceBody>
              <Link
                href="/ve-kenji"
                className="inline-block bg-e26-gold text-e26-black rounded-none font-sans font-medium text-[13px] tracking-[0.08em] uppercase px-10 py-4 hover:bg-e26-gold-deep hover:text-e26-ivory transition-colors duration-300"
              >
                Về Kenji
              </Link>
            </div>

            {/* KHỐI 2 — đi tiếp, hai cửa chưa mở (span, KHÔNG phải Link — tránh soft 404) */}
            <div className="flex flex-col items-center gap-4 mt-16 md:mt-20">
              <EssenceBody as="p" className="mx-auto">
                Nếu bạn đã biết mình muốn đi tiếp
              </EssenceBody>
              <EssenceBody as="p" className="mx-auto">
                Ở đây có hai cửa — một cửa quay về phía bạn, một cửa quay về phía con.
              </EssenceBody>
              <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 font-sans text-[15px] text-e26-text-2 mt-2">
                <span>
                  Về phía bạn <span className="text-[13px] opacity-70">(sắp mở)</span>
                </span>
                <span aria-hidden="true">·</span>
                <span>
                  Về phía con <span className="text-[13px] opacity-70">(sắp mở)</span>
                </span>
              </div>
            </div>

            {/* KHỐI 3 — link phụ */}
            <div className="mt-16 md:mt-20">
              <Link
                href="/dieu-essence-khong-hua"
                className="group inline-flex items-center gap-1.5 font-sans font-normal text-[15px] text-e26-text hover:font-medium hover:text-e26-gold-deep transition-colors duration-300"
              >
                <span>Đọc đầy đủ: Điều Essence không hứa</span>
                <span
                  aria-hidden="true"
                  className="inline-block transition-transform duration-300 group-hover:translate-x-1"
                >
                  →
                </span>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <HomeFooter />
    </>
  );
}
