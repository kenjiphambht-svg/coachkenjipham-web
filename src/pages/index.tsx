import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { SEO } from '@/components/SEO';
import { useMistFadeIn } from '@/hooks/useMistFadeIn';

const selfRecognitionStates = [
  {
    label: 'Người lớn muốn hiểu mình',
    title: 'Có những phản xạ bạn đã quen đến mức tưởng đó là mình.',
    description:
      'Một lời mời đi chậm lại, gọi tên kiểu gồng, nhịp cảm xúc và điều đang lặp lại trong đời sống hiện tại.',
    cta: 'Bước tiếp vào Essence',
    href: '#he-essence',
  },
  {
    label: 'Phụ huynh muốn hiểu con',
    title: 'Có những điều ở con cần được nhìn bằng một nhịp mềm hơn.',
    description:
      'Một lối vào dành cho cha mẹ muốn có thêm ngôn ngữ quan sát con, không gắn nhãn và không đóng khung con.',
    cta: 'Tôi muốn hiểu con mình',
    href: '/kidbook',
  },
];

const boundaries = [
  'Không hứa một phiên sẽ thay đổi cả đời sống.',
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

      <main className="min-h-screen bg-[#100f0c] text-[#f7efd9]">
        <section className="relative overflow-hidden px-6 py-8 md:px-10 lg:px-14">
          <div className="absolute inset-x-0 top-0 h-40 bg-[radial-gradient(circle_at_top,_rgba(201,168,76,0.13),_rgba(16,15,12,0)_64%)]" />

          <nav
            aria-label="Điều hướng chính"
            className="relative z-10 mx-auto flex max-w-6xl items-center justify-between gap-6 py-4"
          >
            <Link href="/" className="group inline-flex flex-col">
              <span className="text-[10px] font-medium uppercase tracking-[0.34em] text-[#c9a84c]">
                Kenji Phạm
              </span>
              <span className="font-serif text-2xl italic text-[#e0c373] transition-colors group-hover:text-[#f7efd9]">
                Essence Coaching
              </span>
            </Link>
            <div className="hidden items-center gap-6 text-xs uppercase tracking-[0.18em] text-[#cbbd9d] md:flex">
              <a href="#kenji" className="transition-colors hover:text-[#f7efd9]">
                Kenji
              </a>
              <a href="#he-essence" className="transition-colors hover:text-[#f7efd9]">
                Essence
              </a>
              <Link href="/kidbook" className="transition-colors hover:text-[#f7efd9]">
                Hạt Mầm
              </Link>
              <a href="#ghi-chep" className="transition-colors hover:text-[#f7efd9]">
                Ghi chép
              </a>
            </div>
          </nav>

          <div className="relative z-10 mx-auto flex min-h-[calc(100vh-96px)] max-w-6xl items-center py-16 md:py-20">
            <div className="fade-in-section max-w-4xl">
              <p className="mb-5 text-[11px] font-medium uppercase tracking-[0.28em] text-[#c9a84c]">
                Kenji Phạm — Essence Coach
              </p>
              {/* HERO COPY: chờ bản duyệt từ Kenji, không tự viết */}
              <h1 className="text-5xl leading-[1.02] text-[#f7efd9] md:text-6xl lg:text-7xl">
                Khi bạn bắt đầu nhìn rõ cách mình gồng lên, một bước đi nhỏ cũng có thể trở nên khác.
              </h1>
              <p className="mt-7 max-w-2xl text-base leading-8 text-[#d8ccb0] md:text-lg">
                Một không gian đi chậm, đủ rõ và đủ có ranh giới để bạn nhận ra điều đang lặp lại trong đời sống.
              </p>
              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <a
                  href="#kenji"
                  className="inline-flex min-h-12 items-center justify-center border border-[#6d5521] px-6 text-center text-xs font-medium uppercase tracking-[0.18em] text-[#e0c373] transition-colors hover:border-[#c9a84c] hover:text-[#f7efd9]"
                >
                  Bước vào Essence
                </a>
                <Link
                  href="/kidbook"
                  className="inline-flex min-h-12 items-center justify-center px-2 text-center text-xs font-medium uppercase tracking-[0.18em] text-[#d8ccb0] transition-colors hover:text-[#f7efd9] sm:px-4"
                >
                  Tôi muốn hiểu con mình
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section id="kenji" className="px-6 py-24 md:px-10 lg:px-14">
          <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-[0.82fr_1fr] md:items-center">
            <div className="fade-in-section">
              <div className="relative aspect-[4/5] overflow-hidden border border-[#3a2c16] bg-[#15120e]">
                <Image
                  src="/klp.jpg"
                  alt="Kenji Phạm — Essence Coach, founder Essence Coaching System"
                  fill
                  sizes="(min-width: 768px) 38vw, 100vw"
                  className="object-cover"
                  priority
                />
              </div>
            </div>
            <div className="fade-in-section">
              <p className="mb-4 text-[11px] uppercase tracking-[0.28em] text-[#c9a84c]">
                Kenji là ai?
              </p>
              <h2 className="text-4xl leading-tight text-[#f7efd9] md:text-5xl">
                Kenji Phạm là Essence Coach và founder Essence Coaching System.
              </h2>
              <div className="mt-7 space-y-5 text-base leading-8 text-[#d8ccb0] md:text-lg">
                <p>
                  Kenji xây Essence như một cách làm việc có cấu trúc với bản sắc, phản xạ cảm xúc và những bước nhỏ sau khi một người nhìn rõ mình hơn.
                </p>
                <p>
                  Trong hệ này, con người giữ vai trò trung tâm: Kenji lắng nghe, đặt ranh giới và duyệt những gì được đưa ra ngoài; công nghệ chỉ đứng phía sau để nâng đỡ quy trình.
                </p>
              </div>
              <a
                href="#he-essence"
                className="mt-8 inline-flex text-xs font-medium uppercase tracking-[0.18em] text-[#e0c373] transition-colors hover:text-[#f7efd9]"
              >
                Hiểu Essence là gì
              </a>
            </div>
          </div>
        </section>

        <section id="bat-dau" className="px-6 py-24 md:px-10 lg:px-14">
          <div className="mx-auto max-w-6xl">
            <div className="fade-in-section mb-10 max-w-2xl">
              <p className="mb-4 text-[11px] uppercase tracking-[0.28em] text-[#c9a84c]">
                Bạn đang đứng ở đâu?
              </p>
              <h2 className="text-4xl leading-tight text-[#f7efd9] md:text-5xl">
                Hai trạng thái thường mở ra cánh cửa đầu tiên.
              </h2>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {selfRecognitionStates.map((state) => {
                const content = (
                  <>
                    <p className="text-[10px] uppercase tracking-[0.26em] text-[#c9a84c]">
                      {state.label}
                    </p>
                    <h3 className="mt-6 text-3xl leading-tight text-[#f7efd9]">
                      {state.title}
                    </h3>
                    <p className="mt-5 min-h-24 text-sm leading-7 text-[#d8ccb0]">
                      {state.description}
                    </p>
                    <span className="mt-8 inline-flex text-xs font-medium uppercase tracking-[0.16em] text-[#e0c373]">
                      {state.cta}
                    </span>
                  </>
                );

                return state.href.startsWith('/') ? (
                  <Link
                    key={state.title}
                    href={state.href}
                    className="fade-in-section border border-[#2f281b] bg-[#15120e] p-7 transition-colors hover:border-[#8a6820]"
                  >
                    {content}
                  </Link>
                ) : (
                  <a
                    key={state.title}
                    href={state.href}
                    className="fade-in-section border border-[#2f281b] bg-[#15120e] p-7 transition-colors hover:border-[#8a6820]"
                  >
                    {content}
                  </a>
                );
              })}
            </div>
          </div>
        </section>

        <section id="he-essence" className="px-6 py-24 md:px-10 lg:px-14">
          <div className="mx-auto max-w-6xl">
            <div className="fade-in-section grid gap-10 border-y border-[#2f281b] py-14 md:grid-cols-[0.72fr_1fr]">
              <div>
                <p className="mb-4 text-[11px] uppercase tracking-[0.28em] text-[#c9a84c]">
                  Essence là gì?
                </p>
                <h2 className="text-4xl leading-tight text-[#f7efd9] md:text-5xl">
                  Không bắt đầu bằng việc sửa bạn.
                </h2>
              </div>
              <div className="space-y-5 text-base leading-8 text-[#d8ccb0] md:text-lg">
                <p>
                  Essence là một cách phản tư có cấu trúc: nhìn rõ bản sắc, nhận ra phản xạ cảm xúc và chọn một bước kế tiếp đủ thật trong đời sống.
                </p>
                <p>
                  Nó giữ ranh giới rõ: không phán định con người, không hứa kết quả nhanh, không biến bất kỳ bản đồ nào thành lời kết luận cố định.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="ban-sac-hat-mam" className="px-6 py-24 md:px-10 lg:px-14">
          <div className="fade-in-section mx-auto grid max-w-6xl gap-10 border border-[#3a2c16] bg-[#15120e] p-7 md:grid-cols-[0.9fr_1.1fr] md:p-10">
            <div>
              <p className="mb-4 text-[11px] uppercase tracking-[0.28em] text-[#c9a84c]">
                Ấn phẩm Bản Sắc Hạt Mầm
              </p>
              <div className="mb-5 inline-flex border border-[#c9a84c] px-3 py-2 text-[10px] uppercase tracking-[0.2em] text-[#e0c373]">
                Đang mở
              </div>
              <h2 className="text-4xl leading-tight text-[#f7efd9] md:text-5xl">
                Một cách dịu và rõ để cha mẹ quan sát con.
              </h2>
            </div>
            <div className="space-y-6 text-base leading-8 text-[#d8ccb0]">
              <p>
                Ấn phẩm này không gắn nhãn trẻ, không dự báo tương lai của con và không thần bí hóa con. Nó là một cửa sổ để hiểu con qua khuynh hướng, nhịp phản ứng và những gợi ý quan sát gần gũi.
              </p>
              <p>
                Mục tiêu là giúp cha mẹ có thêm ngôn ngữ để ở cạnh hạt mầm bản sắc của con một cách bình tĩnh hơn.
              </p>
              <Link
                href="/kidbook"
                className="inline-flex min-h-12 items-center justify-center border border-[#c9a84c] bg-[#c9a84c] px-6 text-center text-xs font-medium uppercase tracking-[0.18em] text-[#100f0c] transition-colors hover:bg-[#e0c373]"
              >
                Tôi muốn hiểu con mình
              </Link>
            </div>
          </div>
        </section>

        <section id="ranh-gioi" className="px-6 py-24 md:px-10 lg:px-14">
          <div className="mx-auto max-w-6xl">
            <div className="fade-in-section mb-10 max-w-2xl">
              <p className="mb-4 text-[11px] uppercase tracking-[0.28em] text-[#c9a84c]">
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
                  className="fade-in-section border border-[#2f281b] bg-[#15120e] p-5 text-sm leading-7 text-[#d8ccb0]"
                >
                  {boundary}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="ghi-chep" className="px-6 py-24 md:px-10 lg:px-14">
          <div className="fade-in-section mx-auto max-w-6xl border-y border-[#2f281b] py-14">
            <div className="grid gap-10 md:grid-cols-[0.75fr_1fr]">
              <div>
                <p className="mb-4 text-[11px] uppercase tracking-[0.28em] text-[#c9a84c]">
                  Ghi chép Essence
                </p>
                <h2 className="text-4xl leading-tight text-[#f7efd9] md:text-5xl">
                  Sắp mở.
                </h2>
              </div>
              <p className="text-base leading-8 text-[#d8ccb0] md:text-lg">
                Một không gian ghi chép về bản sắc, phản tư, tâm lý chiều sâu, AI-native workflow và cách xây một đời sống có cấu trúc hơn từ những quan sát nhỏ.
              </p>
            </div>
          </div>
        </section>

        <footer className="px-6 pb-12 pt-16 md:px-10 lg:px-14">
          <div className="mx-auto flex max-w-6xl flex-col gap-8 border-t border-[#2f281b] pt-8 text-sm leading-7 text-[#d8ccb0] md:flex-row md:items-end md:justify-between">
            <div>
              <p className="font-serif text-2xl italic text-[#e0c373]">Essence Coaching</p>
              <p className="mt-3 max-w-xl">
                Kenji Phạm — Essence Coach. Liên hệ và các thông tin pháp lý sẽ được cập nhật trong bản chính thức.
              </p>
            </div>
            <div className="max-w-md md:text-right">
              <p>Dành cho đối tác & nhà tài trợ — hồ sơ Essence công khai đang chuẩn bị.</p>
              <Link
                href="/ai-startup"
                className="mt-2 inline-flex text-xs uppercase tracking-[0.16em] text-[#e0c373] transition-colors hover:text-[#f7efd9]"
              >
                Xem AI Startup Dossier
              </Link>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}
