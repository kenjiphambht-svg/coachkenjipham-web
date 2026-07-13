import Head from "next/head";
import Link from "next/link";
import { SEO } from "@/components/SEO";
import HomeHeader from "@/components/homepage/HomeHeader";
import HomeFooter from "@/components/homepage/HomeFooter";
import SkeletonSection from "@/components/skeleton/SkeletonSection";

// ============================================================
// /phuong-phap — KHUNG (noindex). Section map theo brief 03 mục 4.
// Đây là bản DỰNG KHUNG + ĐIỀU HƯỚNG, không phải bản launch — nội dung
// từng section là placeholder rõ ràng, chờ Kenji duyệt & đổ chữ thật.
// ============================================================
export default function PhuongPhapPage() {
  return (
    <>
      <SEO
        title="Phương pháp Essence — nhìn rõ trước khi đi sâu (Bản khung)"
        description="Essence làm việc kiểu gì — ở mức public-safe. Trang đang dựng khung, chờ Kenji duyệt nội dung."
        url="https://coachkenjipham.com/phuong-phap"
      />
      <Head>
        <meta name="robots" content="noindex" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png" />
      </Head>

      <HomeHeader />
      <main className="bg-e26-ivory">
        <div className="max-w-[720px] mx-auto px-6 pt-14 pb-4">
          <p className="font-sans text-sm text-e26-text-2">Phương pháp</p>
          <h1 className="font-serif font-light text-[34px] md:text-[46px] text-e26-text mt-3">
            [HERO — chờ nội dung]
          </h1>
        </div>

        <SkeletonSection
          tone="white"
          label="[SECTION 1 — Essence bắt đầu từ nhìn rõ, không từ sửa bạn]"
        />
        <SkeletonSection
          tone="ivory"
          label="[SECTION 2 — Khái niệm nền bằng ngôn ngữ đời: vòng lặp, kiểu gồng, bản đồ quan sát]"
        />
        <SkeletonSection
          tone="cream"
          label="[SECTION 3 — Cách một hành trình diễn ra (khái quát)]"
        />
        <SkeletonSection
          tone="white"
          label="[SECTION 4 — Vai trò AI phía sau + Kenji duyệt bản cuối]"
        />
        <SkeletonSection
          tone="ivory"
          label="[SECTION 5 — Ranh giới]"
        />

        {/* CTA cuối — cửa Hạt Mầm là cửa active chính theo brief Homepage,
            cửa người lớn là lối phụ (đúng thứ tự đã áp dụng ở TwoStates). */}
        <section className="max-w-[720px] mx-auto px-6 py-16 md:py-24 text-center">
          <h2 className="font-serif font-normal text-[26px] md:text-[32px] text-e26-text mb-4">
            Bắt đầu từ cửa phù hợp với bạn
          </h2>
          <p className="font-sans text-sm text-e26-text-2 mb-10">
            Nội dung sẽ được Kenji duyệt và đưa vào sau — xem file GOI-XX tương ứng trong Drive.
          </p>
          <div className="flex flex-col items-center gap-6">
            <Link
              href="/ban-sac-cua-con"
              className="inline-block bg-e26-gold text-e26-black rounded-none font-sans font-medium text-[13px] tracking-[0.08em] uppercase px-10 py-4 hover:bg-e26-gold-deep hover:text-e26-ivory transition-colors duration-300"
            >
              Cho con của bạn
            </Link>
            <Link
              href="/ban-sac-cua-ban"
              className="font-sans text-[15px] text-e26-text underline underline-offset-4 decoration-e26-border hover:text-e26-gold-deep hover:decoration-e26-gold transition-colors duration-300"
            >
              Cho chính bạn
            </Link>
            <Link
              href="/dieu-essence-khong-hua"
              className="font-sans text-sm text-e26-text-2 underline underline-offset-4 decoration-e26-border hover:text-e26-gold-deep transition-colors"
            >
              Điều Essence không hứa
            </Link>
          </div>
        </section>
      </main>
      <HomeFooter />
    </>
  );
}
