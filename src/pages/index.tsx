import Head from 'next/head';
import Link from 'next/link';
import { SEO } from '@/components/SEO';
import { useMistFadeIn } from '@/hooks/useMistFadeIn';

const flowCards = [
  {
    label: 'Cho chính bạn',
    title: 'Nhìn rõ vòng lặp bên trong',
    description:
      'Một lối vào nhẹ để nhận diện kiểu gồng, phản xạ cảm xúc và bước nhỏ kế tiếp trong đời sống hiện tại.',
    cta: 'Bắt đầu từ đây',
    href: '#cho-chinh-ban',
  },
  {
    label: 'Cho con bạn',
    title: 'Một cửa sổ để hiểu con',
    description:
      'Bản Sắc Hạt Mầm gợi ý quan sát về khuynh hướng và hạt mầm bản sắc của con, không gắn nhãn hay đóng khung con.',
    cta: 'Tôi muốn hiểu con mình',
    href: '/kidbook',
  },
  {
    label: 'Hiểu hệ Essence',
    title: 'Một giao thức phản tư có cấu trúc',
    description:
      'Essence kết hợp coaching, tâm lý chiều sâu, bản đồ biểu tượng và agentic workflow để tạo một hệ khai vấn AI-native.',
    cta: 'Hiểu cách hệ vận hành',
    href: '#he-essence',
  },
];

const doors = [
  {
    title: 'Ấn phẩm Bản Sắc Hạt Mầm',
    status: 'Đang mở',
    description:
      'Một ấn phẩm dành cho cha mẹ muốn có thêm gợi ý quan sát để hiểu con trong những năm đầu đời.',
    cta: 'Khám phá ấn phẩm',
    href: '/kidbook',
  },
  {
    title: 'Ghi chép Essence',
    status: 'Sắp mở',
    description:
      'Những ghi chép ngắn về bản sắc, phản tư, AI-native workflow và cách con người học nhìn rõ mình hơn.',
    cta: 'Đang chuẩn bị',
    href: '#ghi-chep',
  },
  {
    title: 'AI Startup Dossier',
    status: 'Đã có',
    description:
      'Một hồ sơ công khai về hướng xây dựng Solo AI Company và hệ vận hành phía sau Essence.',
    cta: 'Xem dossier',
    href: '/ai-startup',
  },
];

const boundaries = [
  'Không hứa đổi đời sau một phiên.',
  'Không thay thế chăm sóc sức khỏe tinh thần chuyên môn.',
  'Không chẩn đoán.',
  'Không biến bản đồ biểu tượng thành lời phán cố định.',
  'Không dùng AI như một nhà chuyên môn thay thế con người.',
];

export default function HomePage() {
  useMistFadeIn();

  return (
    <>
      <SEO
        title="Kenji Phạm | Essence Coaching — Khai vấn bản sắc AI-native"
        description="Kenji Phạm là Essence Coach và founder Essence Coaching System — hệ khai vấn bản sắc AI-native giúp con người nhìn rõ bản sắc, an định phản xạ cảm xúc và chọn bước đi kế tiếp bằng một giao thức có cấu trúc."
        image="/og-image.png"
        url="https://coachkenjipham.com"
      />

      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'Essence Coaching System',
              alternateName: 'Essence Coaching',
              founder: {
                '@type': 'Person',
                name: 'Kenji Phạm',
                jobTitle: 'Essence Coach',
              },
              description:
                'Hệ khai vấn bản sắc AI-native kết hợp coaching, tâm lý chiều sâu, bản đồ biểu tượng và AI agentic workflow.',
              url: 'https://coachkenjipham.com',
            }),
          }}
        />
      </Head>

      <main className="min-h-screen bg-[#100f0c] text-[#f2ead8]">
        <section className="relative overflow-hidden px-6 py-8 md:px-10 lg:px-14">
          <div className="absolute inset-x-0 top-0 h-40 bg-[radial-gradient(circle_at_top,_rgba(201,168,76,0.16),_rgba(16,15,12,0)_64%)]" />

          <nav
            aria-label="Điều hướng chính"
            className="relative z-10 mx-auto flex max-w-6xl items-center justify-between gap-6 py-4"
          >
            <Link href="/" className="group inline-flex flex-col">
              <span className="text-[10px] font-medium uppercase tracking-[0.38em] text-[#8a6820]">
                Kenji Phạm
              </span>
              <span className="font-serif text-2xl italic text-[#c9a84c] transition-colors group-hover:text-[#e0c373]">
                Essence Coaching
              </span>
            </Link>
            <div className="hidden items-center gap-6 text-xs uppercase tracking-[0.2em] text-[#a08d6e] md:flex">
              <a href="#he-essence" className="transition-colors hover:text-[#f2ead8]">
                Essence
              </a>
              <a href="#bat-dau" className="transition-colors hover:text-[#f2ead8]">
                Bắt đầu
              </a>
              <Link href="/kidbook" className="transition-colors hover:text-[#f2ead8]">
                Bản Sắc Của Con
              </Link>
              <a href="#ghi-chep" className="transition-colors hover:text-[#f2ead8]">
                Ghi chép
              </a>
              <Link href="/ai-startup" className="transition-colors hover:text-[#f2ead8]">
                AI Startup
              </Link>
            </div>
          </nav>

          <div className="relative z-10 mx-auto grid min-h-[calc(100vh-96px)] max-w-6xl items-center gap-14 py-16 md:grid-cols-[1.05fr_0.95fr] md:py-20">
            <div className="fade-in-section">
              <p className="mb-5 text-[11px] font-medium uppercase tracking-[0.32em] text-[#8a6820]">
                Kenji Phạm — Essence Coach, founder Essence Coaching System
              </p>
              <h1 className="max-w-4xl text-5xl leading-[0.98] text-[#f7efd9] md:text-6xl lg:text-7xl">
                Hệ khai vấn bản sắc AI-native giúp con người nhìn rõ mình hơn.
              </h1>
              <p className="mt-7 max-w-2xl text-base leading-8 text-[#cbbd9d] md:text-lg">
                Essence Coaching giúp bạn nhận diện bản sắc, an định phản xạ cảm xúc và chọn bước đi kế tiếp bằng một giao thức phản tư có cấu trúc.
              </p>
              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <Link
                  href="/kidbook"
                  className="inline-flex min-h-12 items-center justify-center border border-[#c9a84c] bg-[#c9a84c] px-6 text-center text-xs font-medium uppercase tracking-[0.2em] text-[#100f0c] transition-colors hover:bg-[#e0c373]"
                >
                  Tôi muốn hiểu con mình
                </Link>
                <a
                  href="#cho-chinh-ban"
                  className="inline-flex min-h-12 items-center justify-center border border-[#6d5521] px-6 text-center text-xs font-medium uppercase tracking-[0.2em] text-[#e0c373] transition-colors hover:border-[#c9a84c] hover:text-[#f7efd9]"
                >
                  Tôi muốn bắt đầu hiểu mình
                </a>
              </div>
            </div>

            <div className="fade-in-section">
              <div className="border border-[#2a2115] bg-[#15120e]/80 p-6 shadow-2xl shadow-black/20 md:p-8">
                <p className="text-[11px] uppercase tracking-[0.28em] text-[#8a6820]">
                  Brand Hub
                </p>
                <div className="mt-8 space-y-7">
                  {[
                    ['01', 'Cho chính bạn'],
                    ['02', 'Cho con bạn'],
                    ['03', 'Hiểu Kenji / Essence / AI system'],
                  ].map(([number, title]) => (
                    <div key={title} className="flex items-center gap-5 border-t border-[#2f281b] pt-5">
                      <span className="font-serif text-3xl italic text-[#c9a84c]">{number}</span>
                      <span className="text-sm uppercase tracking-[0.18em] text-[#f2ead8]">
                        {title}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="he-essence" className="px-6 py-20 md:px-10 lg:px-14">
          <div className="mx-auto max-w-6xl">
            <div className="fade-in-section grid gap-10 border-y border-[#2a2115] py-14 md:grid-cols-[0.72fr_1fr]">
              <div>
                <p className="mb-4 text-[11px] uppercase tracking-[0.28em] text-[#8a6820]">
                  Essence là gì?
                </p>
                <h2 className="text-4xl leading-tight text-[#f7efd9] md:text-5xl">
                  Không bắt đầu bằng việc sửa bạn.
                </h2>
              </div>
              <div className="space-y-5 text-base leading-8 text-[#cbbd9d] md:text-lg">
                <p>
                  Essence bắt đầu bằng việc nhìn rõ kiểu gồng, vòng lặp, giao diện sống và một bước nhỏ kế tiếp có thể làm ngay.
                </p>
                <p>
                  Đây là một giao thức phản tư có cấu trúc, có ranh giới đạo đức rõ ràng và không hứa phép màu.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="bat-dau" className="px-6 py-20 md:px-10 lg:px-14">
          <div className="mx-auto max-w-6xl">
            <div className="fade-in-section mb-10 max-w-2xl">
              <p className="mb-4 text-[11px] uppercase tracking-[0.28em] text-[#8a6820]">
                Bạn đến vì điều gì?
              </p>
              <h2 className="text-4xl leading-tight text-[#f7efd9] md:text-5xl">
                Chọn đúng cửa, rồi đi sâu vừa đủ.
              </h2>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {flowCards.map((card) => {
                const isExternalRoute = card.href.startsWith('/');

                const content = (
                  <>
                    <p className="text-[10px] uppercase tracking-[0.28em] text-[#8a6820]">
                      {card.label}
                    </p>
                    <h3 className="mt-6 text-3xl leading-tight text-[#f7efd9]">
                      {card.title}
                    </h3>
                    <p className="mt-5 min-h-28 text-sm leading-7 text-[#cbbd9d]">
                      {card.description}
                    </p>
                    <span className="mt-8 inline-flex text-xs font-medium uppercase tracking-[0.18em] text-[#c9a84c]">
                      {card.cta}
                    </span>
                  </>
                );

                return isExternalRoute ? (
                  <Link
                    key={card.title}
                    href={card.href}
                    className="fade-in-section border border-[#2a2115] bg-[#15120e] p-7 transition-colors hover:border-[#8a6820]"
                  >
                    {content}
                  </Link>
                ) : (
                  <a
                    key={card.title}
                    href={card.href}
                    className="fade-in-section border border-[#2a2115] bg-[#15120e] p-7 transition-colors hover:border-[#8a6820]"
                  >
                    {content}
                  </a>
                );
              })}
            </div>
          </div>
        </section>

        <section className="px-6 py-20 md:px-10 lg:px-14">
          <div className="mx-auto max-w-6xl">
            <div className="fade-in-section mb-10 flex flex-col justify-between gap-5 md:flex-row md:items-end">
              <div>
                <p className="mb-4 text-[11px] uppercase tracking-[0.28em] text-[#8a6820]">
                  Cánh cửa hiện có
                </p>
                <h2 className="text-4xl leading-tight text-[#f7efd9] md:text-5xl">
                  Ít cửa hơn, rõ đường hơn.
                </h2>
              </div>
              <p className="max-w-md text-sm leading-7 text-[#a08d6e]">
                Trang chủ chỉ mở những lối đi đủ an toàn ở thời điểm hiện tại.
              </p>
            </div>

            <div className="grid gap-px overflow-hidden border border-[#2a2115] bg-[#2a2115] md:grid-cols-3">
              {doors.map((door) => {
                const isExternalRoute = door.href.startsWith('/');

                const content = (
                  <>
                    <div className="flex items-center justify-between gap-4">
                      <h3 className="text-2xl leading-tight text-[#f7efd9]">{door.title}</h3>
                      <span className="shrink-0 text-[10px] uppercase tracking-[0.18em] text-[#8a6820]">
                        {door.status}
                      </span>
                    </div>
                    <p className="mt-6 min-h-28 text-sm leading-7 text-[#cbbd9d]">
                      {door.description}
                    </p>
                    <span className="mt-8 inline-flex text-xs font-medium uppercase tracking-[0.18em] text-[#c9a84c]">
                      {door.cta}
                    </span>
                  </>
                );

                return isExternalRoute ? (
                  <Link
                    key={door.title}
                    href={door.href}
                    className="fade-in-section bg-[#100f0c] p-7 transition-colors hover:bg-[#15120e]"
                  >
                    {content}
                  </Link>
                ) : (
                  <a
                    key={door.title}
                    href={door.href}
                    className="fade-in-section bg-[#100f0c] p-7 transition-colors hover:bg-[#15120e]"
                  >
                    {content}
                  </a>
                );
              })}
            </div>
          </div>
        </section>

        <section id="ban-sac-hat-mam" className="px-6 py-20 md:px-10 lg:px-14">
          <div className="fade-in-section mx-auto grid max-w-6xl gap-10 border border-[#2a2115] bg-[#15120e] p-7 md:grid-cols-[0.9fr_1.1fr] md:p-10">
            <div>
              <p className="mb-4 text-[11px] uppercase tracking-[0.28em] text-[#8a6820]">
                Ấn phẩm Bản Sắc Hạt Mầm
              </p>
              <h2 className="text-4xl leading-tight text-[#f7efd9] md:text-5xl">
                Một cách dịu và rõ để cha mẹ quan sát con.
              </h2>
            </div>
            <div className="space-y-6 text-base leading-8 text-[#cbbd9d]">
              <p>
                Ấn phẩm này không gắn nhãn trẻ, không dự báo tương lai của con và không thần bí hóa con. Nó là một cửa sổ để hiểu con qua khuynh hướng, nhịp phản ứng và những gợi ý quan sát gần gũi.
              </p>
              <p>
                Mục tiêu là giúp cha mẹ có thêm ngôn ngữ để ở cạnh hạt mầm bản sắc của con một cách bình tĩnh hơn.
              </p>
              <Link
                href="/kidbook"
                className="inline-flex min-h-12 items-center justify-center border border-[#c9a84c] px-6 text-center text-xs font-medium uppercase tracking-[0.2em] text-[#e0c373] transition-colors hover:bg-[#c9a84c] hover:text-[#100f0c]"
              >
                Tôi muốn hiểu con mình
              </Link>
            </div>
          </div>
        </section>

        <section id="ranh-gioi" className="px-6 py-20 md:px-10 lg:px-14">
          <div className="mx-auto max-w-6xl">
            <div className="fade-in-section mb-10 max-w-2xl">
              <p className="mb-4 text-[11px] uppercase tracking-[0.28em] text-[#8a6820]">
                Điều Essence không hứa
              </p>
              <h2 className="text-4xl leading-tight text-[#f7efd9] md:text-5xl">
                Rõ ràng trước khi đi sâu.
              </h2>
            </div>

            <div className="grid gap-3 md:grid-cols-5">
              {boundaries.map((boundary) => (
                <div
                  key={boundary}
                  className="fade-in-section border border-[#2a2115] bg-[#15120e] p-5 text-sm leading-7 text-[#cbbd9d]"
                >
                  {boundary}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="ghi-chep" className="px-6 py-20 md:px-10 lg:px-14">
          <div className="fade-in-section mx-auto max-w-6xl border-y border-[#2a2115] py-14">
            <div className="grid gap-10 md:grid-cols-[0.75fr_1fr]">
              <div>
                <p className="mb-4 text-[11px] uppercase tracking-[0.28em] text-[#8a6820]">
                  Ghi chép Essence
                </p>
                <h2 className="text-4xl leading-tight text-[#f7efd9] md:text-5xl">
                  Sắp mở.
                </h2>
              </div>
              <p className="text-base leading-8 text-[#cbbd9d] md:text-lg">
                Một không gian ghi chép về bản sắc, phản tư, tâm lý chiều sâu, AI-native workflow và cách xây một đời sống có cấu trúc hơn từ những quan sát nhỏ.
              </p>
            </div>
          </div>
        </section>

        <section id="kenji" className="px-6 py-20 md:px-10 lg:px-14">
          <div className="fade-in-section mx-auto grid max-w-6xl gap-10 md:grid-cols-[1fr_0.85fr] md:items-end">
            <div>
              <p className="mb-4 text-[11px] uppercase tracking-[0.28em] text-[#8a6820]">
                Kenji là ai?
              </p>
              <h2 className="text-4xl leading-tight text-[#f7efd9] md:text-5xl">
                Kenji Phạm là Essence Coach và founder Essence Coaching System.
              </h2>
            </div>
            <div className="space-y-6 text-base leading-8 text-[#cbbd9d]">
              <p>
                Essence Coaching System là hệ khai vấn bản sắc AI-native kết hợp coaching, tâm lý chiều sâu, bản đồ biểu tượng và AI agentic workflow.
              </p>
              <span className="inline-flex min-h-12 items-center justify-center border border-[#3a2c16] px-6 text-center text-xs font-medium uppercase tracking-[0.2em] text-[#8a6820]">
                Trang giới thiệu đang chuẩn bị
              </span>
            </div>
          </div>
        </section>

        <section id="cho-chinh-ban" className="px-6 py-20 md:px-10 lg:px-14">
          <div className="fade-in-section mx-auto max-w-4xl text-center">
            <p className="mb-4 text-[11px] uppercase tracking-[0.28em] text-[#8a6820]">
              Bắt đầu nhẹ
            </p>
            <h2 className="text-4xl leading-tight text-[#f7efd9] md:text-6xl">
              Nếu bạn muốn hiểu mình, hãy bắt đầu bằng một câu hỏi đủ thật.
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-[#cbbd9d]">
              Essence chưa mở mạnh các phiên cá nhân trên trang chủ V1. Bạn có thể bắt đầu bằng cách đọc các ghi chép sắp mở, hoặc liên hệ trực tiếp khi cần một cuộc đối thoại có cấu trúc.
            </p>
            <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
              <Link
                href="/kidbook"
                className="inline-flex min-h-12 items-center justify-center border border-[#c9a84c] bg-[#c9a84c] px-6 text-center text-xs font-medium uppercase tracking-[0.2em] text-[#100f0c] transition-colors hover:bg-[#e0c373]"
              >
                Tôi muốn hiểu con mình
              </Link>
              <a
                href="#kenji"
                className="inline-flex min-h-12 items-center justify-center border border-[#6d5521] px-6 text-center text-xs font-medium uppercase tracking-[0.2em] text-[#e0c373] transition-colors hover:border-[#c9a84c] hover:text-[#f7efd9]"
              >
                Tôi muốn bắt đầu hiểu mình
              </a>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
