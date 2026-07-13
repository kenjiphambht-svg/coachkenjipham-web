import Head from "next/head";
import Link from "next/link";
import { SEO } from "@/components/SEO";
import HomeHeader from "@/components/homepage/HomeHeader";
import HomeFooter from "@/components/homepage/HomeFooter";
import SkeletonSection from "@/components/skeleton/SkeletonSection";

// ============================================================
// /ban-sac-cua-con — HUB dòng phụ huynh. KHUNG (noindex).
// Section map theo brief 03 mục 5. Route THẬT chưa từng tồn tại trước
// task này (đã kiểm bằng `ls src/pages/` trước khi tạo).
// Chỉ 1 thẻ có lối vào active (Hạt Mầm → /an-pham-ban-sac-hat-mam thật);
// 2 thẻ còn lại "sắp mở", không có link (đúng yêu cầu — không giả vờ đã có).
// ============================================================
export default function BanSacCuaConPage() {
  return (
    <>
      <SEO
        title="Bản Sắc Của Con — bản đồ quan sát cho ba mẹ (Bản khung)"
        description="Dòng ấn phẩm giúp ba mẹ hiểu con hơn theo từng độ tuổi. Trang đang dựng khung, chờ Kenji duyệt nội dung."
        url="https://coachkenjipham.com/ban-sac-cua-con"
      />
      <Head>
        <meta name="robots" content="noindex" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png" />
      </Head>

      <HomeHeader />
      <main className="bg-e26-ivory">
        <div className="max-w-[720px] mx-auto px-6 pt-14 pb-4">
          <p className="font-sans text-sm text-e26-text-2">Bản Sắc Của Con</p>
          <h1 className="font-serif font-light text-[34px] md:text-[46px] text-e26-text mt-3">
            [HERO — chờ nội dung]
          </h1>
        </div>

        <SkeletonSection tone="white" label="[SECTION 1 — một đoạn cho cảm giác ba mẹ]" />
        <SkeletonSection tone="ivory" label="[SECTION 2 — dòng sản phẩm này là gì / không là gì]" />

        {/* SECTION 3 — 3 thẻ độ tuổi */}
        <section className="bg-e26-cream px-6 py-16 md:py-24 border-b border-e26-border">
          <div className="max-w-[1120px] mx-auto">
            <p className="font-serif text-xl md:text-2xl text-e26-text mb-2">
              [SECTION 3 — 3 thẻ theo độ tuổi]
            </p>
            <p className="font-sans text-sm text-e26-text-2 mb-10">
              Nội dung sẽ được Kenji duyệt và đưa vào sau — xem file GOI-XX tương ứng trong Drive.
            </p>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-e26-white border border-e26-border p-8">
                <p className="font-sans text-xs tracking-[0.08em] uppercase text-e26-text-2 mb-3">
                  0–7 tuổi
                </p>
                <h3 className="font-serif text-xl text-e26-text mb-4">Bản Sắc Hạt Mầm</h3>
                <Link
                  href="/an-pham-ban-sac-hat-mam"
                  className="font-sans text-[14px] text-e26-text underline underline-offset-4 decoration-e26-border hover:text-e26-gold-deep hover:decoration-e26-gold transition-colors duration-300"
                >
                  Xem ấn phẩm
                </Link>
              </div>
              <div className="bg-e26-white border border-e26-border p-8 opacity-70">
                <p className="font-sans text-xs tracking-[0.08em] uppercase text-e26-text-2 mb-3">
                  8–13 tuổi
                </p>
                <h3 className="font-serif text-xl text-e26-text-2 mb-4">Khám Phá</h3>
                <p className="font-sans text-sm text-e26-text-2">Sắp mở</p>
              </div>
              <div className="bg-e26-white border border-e26-border p-8 opacity-70">
                <p className="font-sans text-xs tracking-[0.08em] uppercase text-e26-text-2 mb-3">
                  14–18 tuổi
                </p>
                <h3 className="font-serif text-xl text-e26-text-2 mb-4">Giao Mùa</h3>
                <p className="font-sans text-sm text-e26-text-2">Sắp mở</p>
              </div>
            </div>
          </div>
        </section>

        <SkeletonSection
          tone="ivory"
          label="[SECTION 4 — Luật an toàn ngôn ngữ trẻ em, công khai]"
          note="Xem docs/brand/CHILD_LANGUAGE_RULES.md nội bộ — bản công khai sẽ được Kenji duyệt riêng."
        />

        {/* SECTION 5 — CTA chính lặp lại */}
        <section className="max-w-[720px] mx-auto px-6 py-16 md:py-24 text-center">
          <Link
            href="/an-pham-ban-sac-hat-mam"
            className="inline-block bg-e26-gold text-e26-black rounded-none font-sans font-medium text-[13px] tracking-[0.08em] uppercase px-10 py-4 hover:bg-e26-gold-deep hover:text-e26-ivory transition-colors duration-300"
          >
            Xem ấn phẩm Bản Sắc Hạt Mầm
          </Link>
        </section>
      </main>
      <HomeFooter />
    </>
  );
}
