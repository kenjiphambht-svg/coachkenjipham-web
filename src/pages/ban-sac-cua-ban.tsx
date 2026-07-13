import Head from "next/head";
import Link from "next/link";
import { SEO } from "@/components/SEO";
import HomeHeader from "@/components/homepage/HomeHeader";
import HomeFooter from "@/components/homepage/HomeFooter";
import SkeletonSection from "@/components/skeleton/SkeletonSection";

// ============================================================
// /ban-sac-cua-ban — HUB MỚI, đối xứng với /ban-sac-cua-con nhưng cho
// dòng người lớn. KHUNG (noindex). Không có brief 03 riêng cho route này
// (được yêu cầu tạo mới trong task này) — section map tự thiết kế đối
// xứng theo /ban-sac-cua-con, đúng cấu trúc 3 thẻ mà Kenji chỉ định.
// Chỉ 1 thẻ có lối vào active (Lặng 90' → /lang-90 thật); 2 thẻ còn lại
// "sắp mở", không có link.
// ============================================================
export default function BanSacCuaBanPage() {
  return (
    <>
      <SEO
        title="Bản Sắc Của Bạn — cửa dành cho người lớn (Bản khung)"
        description="Dòng coaching cho chính bạn — ngồi lại và nhìn rõ vòng lặp đang giữ mình. Trang đang dựng khung, chờ Kenji duyệt nội dung."
        url="https://coachkenjipham.com/ban-sac-cua-ban"
      />
      <Head>
        <meta name="robots" content="noindex" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png" />
      </Head>

      <HomeHeader />
      <main className="bg-e26-ivory">
        <div className="max-w-[720px] mx-auto px-6 pt-14 pb-4">
          <p className="font-sans text-sm text-e26-text-2">Bản Sắc Của Bạn</p>
          <h1 className="font-serif font-light text-[34px] md:text-[46px] text-e26-text mt-3">
            [HERO — chờ nội dung]
          </h1>
        </div>

        <SkeletonSection tone="white" label="[SECTION 1 — một đoạn cho cảm giác người lớn]" />
        <SkeletonSection tone="ivory" label="[SECTION 2 — dòng coaching này là gì / không là gì]" />

        {/* SECTION 3 — 3 thẻ */}
        <section className="bg-e26-cream px-6 py-16 md:py-24 border-b border-e26-border">
          <div className="max-w-[1120px] mx-auto">
            <p className="font-serif text-xl md:text-2xl text-e26-text mb-2">
              [SECTION 3 — 3 thẻ dòng người lớn]
            </p>
            <p className="font-sans text-sm text-e26-text-2 mb-10">
              Nội dung sẽ được Kenji duyệt và đưa vào sau — xem file GOI-XX tương ứng trong Drive.
            </p>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-e26-white border border-e26-border p-8">
                <p className="font-sans text-xs tracking-[0.08em] uppercase text-e26-text-2 mb-3">
                  1:1 · 90 phút
                </p>
                <h3 className="font-serif text-xl text-e26-text mb-4">Lặng 90&apos;</h3>
                <Link
                  href="/lang-90"
                  className="font-sans text-[14px] text-e26-text underline underline-offset-4 decoration-e26-border hover:text-e26-gold-deep hover:decoration-e26-gold transition-colors duration-300"
                >
                  Xem chi tiết
                </Link>
              </div>
              <div className="bg-e26-white border border-e26-border p-8 opacity-70">
                <p className="font-sans text-xs tracking-[0.08em] uppercase text-e26-text-2 mb-3">
                  Hành trình dài hơn
                </p>
                <h3 className="font-serif text-xl text-e26-text-2 mb-4">Dấu Ấn Của Bạn</h3>
                <p className="font-sans text-sm text-e26-text-2">Sắp mở</p>
              </div>
              <div className="bg-e26-white border border-e26-border p-8 opacity-70">
                <p className="font-sans text-xs tracking-[0.08em] uppercase text-e26-text-2 mb-3">
                  Ấn phẩm cá nhân
                </p>
                <h3 className="font-serif text-xl text-e26-text-2 mb-4">Bạn Là Duy Nhất</h3>
                <p className="font-sans text-sm text-e26-text-2">Sắp mở</p>
              </div>
            </div>
          </div>
        </section>

        <SkeletonSection
          tone="ivory"
          label="[SECTION 4 — Ranh giới nghề, nhắc lại ngắn]"
          note="Xem /ve-kenji mục Ranh giới nghề — bản rút gọn cho trang này sẽ do Kenji duyệt riêng."
        />

        {/* SECTION 5 — CTA chính lặp lại */}
        <section className="max-w-[720px] mx-auto px-6 py-16 md:py-24 text-center">
          <Link
            href="/lang-90"
            className="inline-block bg-e26-gold text-e26-black rounded-none font-sans font-medium text-[13px] tracking-[0.08em] uppercase px-10 py-4 hover:bg-e26-gold-deep hover:text-e26-ivory transition-colors duration-300"
          >
            Xem Lặng 90&apos;
          </Link>
        </section>
      </main>
      <HomeFooter />
    </>
  );
}
