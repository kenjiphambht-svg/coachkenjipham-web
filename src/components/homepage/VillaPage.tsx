import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { SEO } from "@/components/SEO";
import GrainOverlay from "@/components/homepage/GrainOverlay";
import HomeHeader from "@/components/homepage/HomeHeader";
import HomeFooter from "@/components/homepage/HomeFooter";
import { useHomeReveal } from "@/components/homepage/useHomeReveal";

const CANONICAL_URL = "https://coachkenjipham.com/";

const softLink =
  "group relative inline-flex items-center gap-2 font-sans text-[13px] font-medium uppercase tracking-[0.12em] text-e26-text transition-opacity hover:opacity-70";

export default function VillaPage() {
  useHomeReveal();

  return (
    <>
      <SEO
        title="ESSENCE — Từ Bản sắc đến Hiện thực"
        ogTitle="ESSENCE — Câu chuyện cuộc sống của bạn là một kiệt tác."
        description="ESSENCE giúp điều được nhìn rõ đi tiếp vào lựa chọn, hành động và hiện thực có thể quan sát — trong đời sống hoặc công việc."
        ogDescription="Từ điều được nhận ra đến lựa chọn có ý thức và hiện thực có thể quan sát."
        image="https://coachkenjipham.com/essence-og-1200x630.png"
        url={CANONICAL_URL}
      />

      <Head>
        <meta name="robots" content="noindex" />
        <link rel="canonical" href={CANONICAL_URL} />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/favicon-192.png" />
        <link rel="icon" type="image/png" sizes="512x512" href="/favicon-512.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon-180.png" />
      </Head>

      <GrainOverlay />
      <HomeHeader homeIa />

      <main className="bg-e26-ivory text-e26-text">
        {/* 01 — Recognition / BIẾT → LÀM */}
        <section className="relative isolate min-h-[90svh] overflow-hidden px-6 pb-24 pt-28 md:flex md:min-h-[94svh] md:items-center md:px-10 md:pb-32 md:pt-32">
          <div className="absolute inset-0 -z-20 md:hidden">
            <Image
              src="/images/home/window-first-light-mobile.webp"
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover object-center"
            />
          </div>
          <div className="absolute inset-0 -z-20 hidden md:block">
            <Image
              src="/images/home/window-first-light.webp"
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover object-center"
            />
          </div>
          <div
            className="absolute inset-0 -z-10"
            style={{
              background:
                "linear-gradient(90deg, color-mix(in srgb, var(--essence-ivory-2026) 94%, transparent) 0%, color-mix(in srgb, var(--essence-ivory-2026) 88%, transparent) 42%, color-mix(in srgb, var(--essence-ivory-2026) 56%, transparent) 72%, color-mix(in srgb, var(--essence-ivory-2026) 28%, transparent) 100%)",
            }}
            aria-hidden="true"
          />
          <div className="absolute inset-0 -z-10 bg-[color-mix(in_srgb,var(--essence-ivory-2026)_26%,transparent)] md:hidden" aria-hidden="true" />

          <div className="mx-auto w-full max-w-6xl">
            <div className="e26-reveal max-w-[720px] md:translate-y-2">
              <h1 className="max-w-[700px] font-serif text-[44px] font-medium leading-[1.06] tracking-[-0.018em] md:text-[66px] lg:text-[76px]">
                Có những điều bạn biết rất rõ.
              </h1>
              <div className="mt-10 max-w-[590px] space-y-3 font-sans text-[17px] font-normal leading-[1.8] md:mt-12 md:text-[19px]">
                <p>Biết một cuộc nói chuyện đã đến lúc phải diễn ra.</p>
                <p>Biết một việc nên dừng.</p>
                <p>Biết một quyết định không thể để lâu hơn nữa.</p>
                <p>Biết cách cũ không còn đưa bạn tới nơi bạn muốn.</p>
              </div>
              <p className="mt-10 max-w-[600px] font-serif text-[27px] font-normal leading-[1.35] tracking-[-0.01em] md:mt-12 md:text-[34px]">
                Nhưng từ <em>biết</em> đến thật sự sống và làm khác đi vẫn còn một khoảng.
              </p>
              <div className="mt-9 flex items-center gap-4">
                <span className="h-px w-10 bg-[#E0C068]" aria-hidden="true" />
                <p className="font-sans text-[15px] font-medium leading-[1.7]">ESSENCE bắt đầu từ khoảng đó.</p>
              </div>
            </div>
          </div>
        </section>

        {/* 02 — ESSENCE / Reframe */}
        <section className="relative overflow-hidden bg-e26-white px-6 py-24 md:px-10 md:py-36">
          <div
            className="pointer-events-none absolute inset-y-0 right-0 hidden w-[42%] md:block"
            style={{
              background:
                "linear-gradient(112deg, transparent, color-mix(in srgb, var(--essence-cream-2026) 52%, transparent))",
            }}
            aria-hidden="true"
          />
          <div className="relative mx-auto grid max-w-6xl gap-12 md:grid-cols-[0.72fr_1.28fr] md:gap-24">
            <h2 className="e26-reveal max-w-[410px] font-serif text-[34px] font-medium leading-[1.16] tracking-[-0.014em] md:text-[48px]">
              Ở khoảng đó, ESSENCE không bắt đầu bằng việc nói bạn nên làm gì.
            </h2>
            <div className="e26-reveal max-w-[660px] space-y-7 font-sans text-[17px] font-normal leading-[1.85] md:mt-16 md:border-l md:border-[color-mix(in_srgb,var(--essence-black-2026)_10%,transparent)] md:pl-12 md:text-[18px]">
              <p>
                Điều được nhìn ra cần đi tiếp vào đời sống hoặc công việc: NHẬN RA → LỰA CHỌN → HIỆN THỰC.
              </p>
              <p>
                Ở cấp độ cá nhân, <strong className="font-medium">Bản sắc</strong> là phần bạn ngày càng nhận ra trung thực hơn qua những gì đã sống — cả điều dễ đón nhận lẫn những phần bạn từng né tránh, chưa hiểu hoặc chưa muốn nhận.
              </p>
              <p className="max-w-[580px] font-serif text-[27px] font-medium leading-[1.4] tracking-[-0.01em] md:text-[31px]">
                Không phải để đóng bạn vào một định nghĩa. <br className="hidden md:block" />Là để bạn có thêm quyền chọn.
              </p>
            </div>
          </div>
        </section>

        {/* 03 — Từ Bản sắc đến Hiện thực */}
        <section className="relative overflow-hidden border-y border-[#E0C068]/20 bg-[color-mix(in_srgb,var(--essence-white-2026)_48%,var(--essence-ivory-2026))] px-6 py-24 md:px-10 md:py-36">
          <div
            className="pointer-events-none absolute -left-[10%] top-[22%] h-[48%] w-[42%] rounded-full bg-[color-mix(in_srgb,var(--essence-white-2026)_58%,transparent)] blur-3xl"
            aria-hidden="true"
          />
          <div className="relative mx-auto max-w-6xl">
            <div className="e26-reveal max-w-[780px]">
              <h2 className="max-w-[700px] font-serif text-[40px] font-medium leading-[1.06] tracking-[-0.016em] md:text-[60px]">
                TỪ BẢN SẮC ĐẾN HIỆN THỰC.
              </h2>
              <p className="mt-7 font-sans text-[13px] font-semibold uppercase tracking-[0.12em] text-e26-text md:mt-8">
                NHẬN RA → LỰA CHỌN → HIỆN THỰC
              </p>
            </div>

            <div className="e26-reveal mt-14 grid gap-10 md:mt-20 md:grid-cols-[0.72fr_1.28fr] md:gap-24">
              <p className="max-w-[400px] font-serif text-[27px] font-medium leading-[1.42] tracking-[-0.01em] md:text-[33px]">
                Và một lựa chọn chỉ thật sự có ý nghĩa khi nó bắt đầu có mặt trong thực tế.
              </p>

              <div className="max-w-[680px] space-y-8 font-sans text-[17px] font-normal leading-[1.85] md:text-[18px]">
                <div className="grid gap-x-10 gap-y-0 md:grid-cols-2">
                  <p className="border-t border-[color-mix(in_srgb,var(--essence-black-2026)_12%,transparent)] py-4">Một ranh giới được nói ra.</p>
                  <p className="border-t border-[color-mix(in_srgb,var(--essence-black-2026)_12%,transparent)] py-4">Một lựa chọn nghề nghiệp được đưa ra.</p>
                  <p className="border-t border-[color-mix(in_srgb,var(--essence-black-2026)_12%,transparent)] py-4">Một quyết định trong doanh nghiệp có người thực sự sở hữu.</p>
                  <p className="border-y border-[color-mix(in_srgb,var(--essence-black-2026)_12%,transparent)] py-4 md:border-b-0">Một cách làm mới được thử thay vì tiếp tục nằm trong cuộc họp.</p>
                </div>
                <p>
                  Với <strong className="font-medium">nhân hiệu</strong>, điều đó có thể là cách bạn hiện diện rõ hơn từ điều bạn chọn đứng về — thay vì dựng một hình ảnh trước rồi cố sống cho giống nó.
                </p>
                <p className="max-w-[600px] text-e26-text-2">Khi đi vào hiện thực, điều bạn chọn mới có thứ để nhìn lại và điều chỉnh.</p>
              </div>
            </div>
          </div>
        </section>

        {/* 04 — Brand Signature Signal */}
        <section className="relative flex min-h-[72svh] items-center overflow-hidden bg-e26-black px-6 py-28 text-e26-ivory md:min-h-[82svh] md:px-10 md:py-40">
          <Image
            src="/images/home/kiettac-villa-toi.webp"
            alt=""
            fill
            sizes="100vw"
            className="object-cover object-center opacity-80"
            aria-hidden="true"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to bottom, color-mix(in srgb, var(--essence-black-2026) 94%, transparent), color-mix(in srgb, var(--essence-black-2026) 74%, transparent) 45%, color-mix(in srgb, var(--essence-black-2026) 88%, transparent))",
            }}
            aria-hidden="true"
          />
          <div className="e26-reveal relative z-10 mx-auto max-w-6xl text-center">
            <p className="mx-auto max-w-[1020px] font-serif text-[48px] font-normal leading-[1.04] tracking-[-0.018em] md:text-[78px] lg:text-[94px]">
              Câu chuyện cuộc sống của bạn là một kiệt tác.
            </p>
          </div>
        </section>

        {/* 05 — Two contexts */}
        <section className="relative overflow-hidden px-6 py-24 md:px-10 md:py-36">
          <Image
            src="/images/home/two-paths-light-room.webp"
            alt=""
            fill
            sizes="100vw"
            className="object-cover object-center opacity-35"
            aria-hidden="true"
          />
          <div className="absolute inset-0 bg-[color-mix(in_srgb,var(--essence-ivory-2026)_86%,transparent)]" aria-hidden="true" />
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#E0C068]/25 to-transparent"
            aria-hidden="true"
          />

          <div className="relative z-10 mx-auto max-w-6xl">
            <h2 className="e26-reveal max-w-[780px] font-serif text-[40px] font-medium leading-[1.08] tracking-[-0.016em] md:text-[58px]">
              HAI BỐI CẢNH. CÙNG MỘT BẢN SẮC
            </h2>

            <div className="mt-14 grid gap-8 md:mt-20 md:grid-cols-2 md:gap-10">
              <Link
                href="/coaching"
                aria-label="Đi tới ESSENCE Coaching"
                className="group e26-reveal relative min-h-[430px] overflow-hidden border-t border-[color-mix(in_srgb,var(--essence-black-2026)_18%,transparent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-e26-gold focus-visible:ring-offset-4 focus-visible:ring-offset-e26-ivory md:min-h-[500px]"
              >
                <Image
                  src="/images/home/kitchen-morning.webp"
                  alt=""
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover object-center opacity-70 transition-transform duration-700 ease-out group-hover:scale-[1.025]"
                  aria-hidden="true"
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(to bottom, color-mix(in srgb, var(--essence-ivory-2026) 34%, transparent), color-mix(in srgb, var(--essence-ivory-2026) 90%, transparent) 62%, var(--essence-ivory-2026) 100%)",
                  }}
                  aria-hidden="true"
                />
                <div className="relative z-10 flex h-full min-h-[430px] flex-col justify-end px-6 py-8 md:min-h-[500px] md:px-9 md:py-10">
                  <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.18em] text-e26-text-2">ESSENCE COACHING</p>
                  <p className="mt-5 max-w-[470px] font-serif text-[28px] font-normal leading-[1.38] tracking-[-0.01em] md:text-[34px]">
                    Khi điều cần nhìn rõ nằm trong đời sống của bạn — lựa chọn, mối quan hệ, vai trò, gia đình hay cách bạn đang sống với bản thân.
                  </p>
                  <span className={`${softLink} mt-8 w-fit`}>
                    ESSENCE Coaching <span className="text-[#E0C068] transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true">→</span>
                    <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-[#E0C068] transition-transform duration-300 group-hover:scale-x-100" aria-hidden="true" />
                  </span>
                </div>
              </Link>

              <Link
                href="/advisory"
                aria-label="Đi tới ESSENCE Advisory"
                className="group e26-reveal relative min-h-[430px] overflow-hidden border-t border-[color-mix(in_srgb,var(--essence-black-2026)_18%,transparent)] bg-[color-mix(in_srgb,var(--essence-white-2026)_68%,var(--essence-ivory-2026))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-e26-gold focus-visible:ring-offset-4 focus-visible:ring-offset-e26-ivory md:mt-14 md:min-h-[500px]"
              >
                <div
                  className="absolute inset-0 opacity-80"
                  style={{
                    background:
                      "linear-gradient(135deg, color-mix(in srgb, var(--essence-white-2026) 76%, transparent), transparent 58%), repeating-linear-gradient(0deg, transparent 0 46px, color-mix(in srgb, var(--essence-black-2026) 5%, transparent) 47px 48px)",
                  }}
                  aria-hidden="true"
                />
                <Image
                  src="/images/advisory/advisory-essence-operating-loop-selected-v03.webp"
                  alt=""
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-contain object-[82%_26%] p-12 opacity-[0.12] transition-transform duration-700 ease-out group-hover:translate-x-1 group-hover:-translate-y-1 md:p-16"
                  aria-hidden="true"
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(to bottom, transparent 18%, color-mix(in srgb, var(--essence-ivory-2026) 50%, transparent) 54%, var(--essence-ivory-2026) 100%)",
                  }}
                  aria-hidden="true"
                />
                <div className="relative z-10 flex h-full min-h-[430px] flex-col justify-end px-6 py-8 md:min-h-[500px] md:px-9 md:py-10">
                  <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.18em] text-e26-text-2">ESSENCE ADVISORY</p>
                  <p className="mt-5 max-w-[470px] font-serif text-[28px] font-normal leading-[1.38] tracking-[-0.01em] md:text-[34px]">
                    Khi điều cần nhìn rõ nằm trong công việc hoặc doanh nghiệp — một bài toán quan trọng, quyết định có hệ quả, cách vận hành hay thay đổi cần được đưa vào thực tế.
                  </p>
                  <span className={`${softLink} mt-8 w-fit`}>
                    ESSENCE Advisory <span className="text-[#E0C068] transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true">→</span>
                    <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-[#E0C068] transition-transform duration-300 group-hover:scale-x-100" aria-hidden="true" />
                  </span>
                </div>
              </Link>
            </div>

            <div className="e26-reveal mt-14 max-w-[800px] space-y-3 font-sans text-[16px] font-normal leading-[1.8] text-e26-text-2 md:ml-auto md:mt-20 md:text-[17px]">
              <p>Ở cá nhân, Bản sắc đi qua những vai trò bạn sống và điều bạn chọn đứng về.</p>
              <p>Ở doanh nghiệp, nó được biểu hiện qua điều tổ chức chọn đứng về, cách quyết định, vận hành và thể hiện — không phải một nhãn tâm lý.</p>
            </div>
          </div>
        </section>

        {/* 06 — One ESSENCE / Kenji founder seed */}
        <section className="relative overflow-hidden bg-e26-white px-6 py-24 md:px-10 md:py-36">
          <Image
            src="/images/home/kenji-section-light-wall.webp"
            alt=""
            fill
            sizes="100vw"
            className="object-cover object-left opacity-80"
            aria-hidden="true"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(90deg, color-mix(in srgb, var(--essence-cream-2026) 56%, transparent), color-mix(in srgb, var(--essence-cream-2026) 84%, transparent) 58%, color-mix(in srgb, var(--essence-ivory-2026) 94%, transparent))",
            }}
            aria-hidden="true"
          />

          <div className="relative z-10 mx-auto grid max-w-6xl items-center gap-14 md:grid-cols-[0.7fr_1.3fr] md:gap-24">
            <div className="e26-reveal relative mx-auto aspect-[4/5] w-full max-w-[370px] overflow-hidden bg-e26-cream-deep md:-translate-y-5">
              <Image src="/images/home/kenji-portrait.webp" alt="Kenji Phạm — Founder, ESSENCE" fill sizes="(max-width: 768px) 84vw, 30vw" className="object-cover transition-transform duration-700 ease-out hover:scale-[1.012]" />
            </div>

            <div className="e26-reveal max-w-[690px] md:pt-8">
              <h2 className="font-serif text-[40px] font-medium leading-[1.08] tracking-[-0.016em] md:text-[56px]">
                VÌ SAO CẢ HAI CÙNG LÀ BẢN SẮC?
              </h2>
              <div className="mt-9 space-y-6 font-sans text-[17px] font-normal leading-[1.85] md:text-[18px]">
                <p>Trước ESSENCE, tôi từng làm nhiều công việc liên quan đến hình ảnh, định vị và cách một người xuất hiện trước công chúng.</p>
                <p>Tôi nhận ra một khoảng lệch: hình ảnh có thể được xây rất nhanh, trong khi điều người đứng phía sau thật sự muốn đứng về và có thể sống cùng lâu dài chưa chắc đã rõ.</p>
                <p className="max-w-[610px] border-t border-[#E0C068]/55 pt-6 font-serif text-[30px] font-medium leading-[1.32] tracking-[-0.01em] md:text-[36px]">“Điều gì ở đây thật sự đáng để được xây?”</p>
                <p>Dù ở CÁ NHÂN hay CÔNG VIỆC, ESSENCE vẫn quay lại một mạch: NHẬN RA → LỰA CHỌN → HIỆN THỰC.</p>
              </div>
              <div className="mt-10 border-l border-[#E0C068]/70 pl-4">
                <p className="font-serif text-[21px] leading-[1.4]">Kenji Phạm <span className="font-sans text-[12px] uppercase tracking-[0.13em] text-[#E0C068]">— Founder, ESSENCE</span></p>
              </div>
              <Link className={`${softLink} mt-8`} href="/ve-kenji">Về Kenji <span className="text-[#E0C068]" aria-hidden="true">→</span></Link>
            </div>
          </div>
        </section>

        {/* 07 — Open paths + trust */}
        <section className="relative overflow-hidden bg-e26-ivory px-6 py-24 md:px-10 md:py-40">
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(circle at 18% 24%, color-mix(in srgb, var(--essence-white-2026) 68%, transparent), transparent 33%), linear-gradient(110deg, transparent 58%, color-mix(in srgb, var(--essence-cream-2026) 42%, transparent))",
            }}
            aria-hidden="true"
          />
          <div className="relative mx-auto max-w-6xl">
            <div className="e26-reveal grid gap-14 md:grid-cols-[1.14fr_0.86fr] md:gap-24">
              <div className="max-w-[660px]">
                <h2 className="font-serif text-[40px] font-medium leading-[1.1] tracking-[-0.014em] md:text-[58px]">Nếu chưa rõ nên bắt đầu từ đâu.</h2>
                <p className="mt-8 max-w-[570px] font-sans text-[17px] font-normal leading-[1.85] md:text-[18px]">
                  Có thể bạn đã thấy một điều có liên quan tới bạn, nhưng chưa gọi tên được nó.
                </p>
                <p className="mt-6 max-w-[590px] font-serif text-[29px] font-normal leading-[1.38] tracking-[-0.01em] md:text-[35px]">
                  Khởi đầu là nơi để điều còn mơ hồ bắt đầu có hình — trước khi bạn tự chọn bước tiếp theo.
                </p>
                <Link className={`${softLink} mt-9`} href="/khoi-dau">
                  Khởi đầu <span className="text-[#E0C068]" aria-hidden="true">→</span>
                  <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-[#E0C068] transition-transform duration-300 group-hover:scale-x-100" aria-hidden="true" />
                </Link>

                <div id="goc-doc" className="mt-14 max-w-[520px] scroll-mt-28 border-t border-[color-mix(in_srgb,var(--essence-black-2026)_12%,transparent)] pt-7">
                  <p className="font-sans text-[15px] leading-[1.7] text-e26-text-2">Nếu bạn muốn hiểu thêm trước, Góc đọc vẫn là một lối đi hợp lệ.</p>
                  <p className="mt-3 font-sans text-[12px] font-medium uppercase tracking-[0.12em] text-e26-text-2">Góc đọc</p>
                </div>
              </div>

              <aside className="border-t border-[#E0C068]/45 pt-8 md:mt-16 md:border-l md:border-t-0 md:pl-12 md:pt-1">
                <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.18em] text-e26-text">ĐIỀU ESSENCE CAM KẾT GIỮ</p>
                <div className="mt-8 space-y-5 font-sans text-[17px] font-normal leading-[1.8] md:text-[18px]">
                  <p>ESSENCE giữ quyền lựa chọn ở bạn.</p>
                  <p>Không dùng một chiếc nhãn để định nghĩa bạn.</p>
                  <p>Giữ điều được nhận ra kết nối với lựa chọn và thực tế.</p>
                  <p>Và chỉ hứa những điều ESSENCE có thể chịu trách nhiệm.</p>
                </div>
              </aside>
            </div>
          </div>
        </section>
      </main>

      <HomeFooter homeIa />
    </>
  );
}
