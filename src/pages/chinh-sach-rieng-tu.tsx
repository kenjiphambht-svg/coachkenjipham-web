import Head from "next/head";
import Link from "next/link";
import { SEO } from "@/components/SEO";
import HomeHeader from "@/components/homepage/HomeHeader";
import HomeFooter from "@/components/homepage/HomeFooter";
import SkeletonSection from "@/components/skeleton/SkeletonSection";

// ============================================================
// /chinh-sach-rieng-tu — KHUNG (noindex). Section map theo brief 03 mục 9.
// Trang pháp lý — placeholder-only ở bước khung này, nội dung thật (đặc
// biệt phần dữ liệu trẻ em) BẮT BUỘC do Kenji viết/duyệt, không tự suy
// diễn ở bước dựng khung.
// ============================================================
export default function ChinhSachRiengTuPage() {
  return (
    <>
      <SEO
        title="Chính sách riêng tư & dữ liệu trẻ em (Bản khung)"
        description="Chúng tôi thu thập gì, dùng để làm gì, và dữ liệu trẻ em được xử lý ra sao. Trang đang dựng khung, chờ Kenji duyệt nội dung."
        url="https://coachkenjipham.com/chinh-sach-rieng-tu"
      />
      <Head>
        <meta name="robots" content="noindex" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png" />
      </Head>

      <HomeHeader />
      <main className="bg-e26-ivory">
        <div className="max-w-[720px] mx-auto px-6 pt-14 pb-4">
          <p className="font-sans text-sm text-e26-text-2">Chính sách riêng tư</p>
          <h1 className="font-serif font-light text-[30px] md:text-[40px] text-e26-text mt-3">
            [HERO — chờ nội dung]
          </h1>
        </div>

        <SkeletonSection tone="white" label="[SECTION 1 — thu thập gì, để làm gì]" />
        <SkeletonSection
          tone="ivory"
          label="[SECTION 2 — dữ liệu trẻ em được xử lý ra sao (điểm nhấn)]"
          note="Xem File 09 nội bộ — bản công khai bắt buộc do Kenji duyệt, không tự suy diễn."
        />
        <SkeletonSection tone="cream" label="[SECTION 3 — lưu ở đâu, bao lâu, ai thấy]" />
        <SkeletonSection tone="ivory" label="[SECTION 4 — quyền yêu cầu xóa]" />
        <SkeletonSection tone="white" label="[SECTION 5 — cam kết không dùng dữ liệu con để huấn luyện AI]" />
        <SkeletonSection tone="ivory" label="[SECTION 6 — liên hệ về dữ liệu]" />

        <section className="max-w-[720px] mx-auto px-6 py-14 text-center">
          <Link
            href="/lien-he"
            className="font-sans text-[15px] text-e26-text underline underline-offset-4 decoration-e26-border hover:text-e26-gold-deep hover:decoration-e26-gold transition-colors duration-300"
          >
            Có câu hỏi về dữ liệu của bạn? Liên hệ
          </Link>
        </section>
      </main>
      <HomeFooter />
    </>
  );
}
