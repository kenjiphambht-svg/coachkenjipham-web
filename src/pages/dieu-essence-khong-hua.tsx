import Head from "next/head";
import Link from "next/link";
import { SEO } from "@/components/SEO";
import HomeHeader from "@/components/homepage/HomeHeader";
import HomeFooter from "@/components/homepage/HomeFooter";
import SkeletonSection from "@/components/skeleton/SkeletonSection";

// ============================================================
// /dieu-essence-khong-hua — KHUNG (noindex). Section map theo brief 03 mục 8.
// LƯU Ý: nội dung "không hứa" gần như trùng với NotPromised.tsx (đã có
// copy thật, Kenji đã duyệt cho /trang-chu-v2) — nhưng task này yêu cầu
// RÕ mỗi trang khung chỉ là placeholder, không tự đổ nội dung thật vào
// dù đã có sẵn ở nơi khác. Cờ này nêu lại trong báo cáo để Kenji quyết
// định có muốn tái dùng nguyên văn NotPromised cho trang riêng này không.
// CTA "đặt nhẹ" theo đúng brief — không dùng nút vàng ở đây.
// ============================================================
export default function DieuEssenceKhongHuaPage() {
  return (
    <>
      <SEO
        title="Điều Essence không hứa (Bản khung)"
        description="Những điều Essence không hứa — và những gì Essence cam kết giữ được. Trang đang dựng khung, chờ Kenji duyệt nội dung."
        url="https://coachkenjipham.com/dieu-essence-khong-hua"
      />
      <Head>
        <meta name="robots" content="noindex" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png" />
      </Head>

      <HomeHeader />
      <main className="bg-e26-ivory">
        <div className="max-w-[720px] mx-auto px-6 pt-14 pb-4">
          <p className="font-sans text-sm text-e26-text-2">Điều Essence không hứa</p>
          <h1 className="font-serif font-light text-[34px] md:text-[46px] text-e26-text mt-3">
            [HERO — chờ nội dung]
          </h1>
        </div>

        <SkeletonSection tone="white" label="[SECTION 1 — vì sao có trang này]" />
        <SkeletonSection
          tone="ivory"
          label="[SECTION 2 — danh sách 'không hứa' (5 mục theo brief)]"
          note="Nội dung gần giống NotPromised.tsx đã duyệt cho /trang-chu-v2 — chờ Kenji xác nhận có tái dùng nguyên văn hay viết riêng cho trang này."
        />
        <SkeletonSection tone="cream" label="[SECTION 3 — đổi lại, Essence cam kết gì]" />
        <SkeletonSection tone="ivory" label="[SECTION 4 — mời đối chiếu]" />

        {/* CTA — "đặt nhẹ" theo brief, không dùng nút vàng */}
        <section className="max-w-[720px] mx-auto px-6 py-16 md:py-20 text-center">
          <p className="font-sans text-sm text-e26-text-2 mb-5">Bắt đầu từ cửa phù hợp với bạn</p>
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
            <Link
              href="/ban-sac-cua-con"
              className="font-sans text-[15px] text-e26-text underline underline-offset-4 decoration-e26-border hover:text-e26-gold-deep hover:decoration-e26-gold transition-colors duration-300"
            >
              Cho con của bạn
            </Link>
            <Link
              href="/ban-sac-cua-ban"
              className="font-sans text-[15px] text-e26-text underline underline-offset-4 decoration-e26-border hover:text-e26-gold-deep hover:decoration-e26-gold transition-colors duration-300"
            >
              Cho chính bạn
            </Link>
          </div>
        </section>
      </main>
      <HomeFooter />
    </>
  );
}
