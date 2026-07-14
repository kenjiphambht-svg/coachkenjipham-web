import Head from "next/head";
import { SEO } from "@/components/SEO";
import HomeHeader from "@/components/homepage/HomeHeader";
import HomeFooter from "@/components/homepage/HomeFooter";

// ============================================================
// /lien-he — theo brief 03 mục 10 ("một cánh cửa liên hệ rõ, không rào
// cản"). Nội dung thật (không còn placeholder/ghi chú nội bộ hiển thị
// công khai). Vẫn NOINDEX — chưa công khai cho Google, chờ Kenji duyệt.
// Chỉ 2 kênh thật đang có: email (mailto) + Zalo (FloatingZaloButton
// dùng chung toàn site qua _app.tsx). Không dựng form — repo chưa có
// backend nhận form (chỉ có src/pages/api/hello.ts stub); không hứa một
// tính năng chưa tồn tại.
// ============================================================
export default function LienHePage() {
  return (
    <>
      <SEO
        title="Liên hệ — Kenji Phạm (Bản nháp)"
        description="Một cách liên hệ rõ, không rào cản. Email hoặc Zalo — chọn cách nào tiện cho bạn."
        url="https://coachkenjipham.com/lien-he"
      />
      <Head>
        <meta name="robots" content="noindex" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png" />
      </Head>

      <HomeHeader />
      <main className="bg-e26-ivory min-h-[70vh]">
        <div className="max-w-[720px] mx-auto px-6 pt-14 pb-4">
          <p className="font-sans text-sm text-e26-text-2">Liên hệ</p>
          <h1 className="font-serif font-light text-[34px] md:text-[46px] text-e26-text mt-4 max-w-lg">
            Muốn nhắn gì, cứ nhắn thẳng.
          </h1>
          <p className="font-sans text-[17px] leading-[1.65] text-e26-text-2 mt-6 max-w-xl">
            Không cần rào trước, không cần viết dài. Chọn cách nào tiện cho bạn.
          </p>
        </div>

        <section className="bg-e26-white px-6 py-16 md:py-24">
          <div className="max-w-[720px] mx-auto">
            <h2 className="font-serif font-normal text-[24px] md:text-[30px] text-e26-text mb-4">
              Hai cách để tới được tôi
            </h2>
            <p className="font-sans text-[17px] leading-[1.7] text-e26-text-2 max-w-xl mb-8">
              Nhắn Zalo qua nút góc màn hình để trao đổi nhanh, hoặc gửi email nếu bạn muốn
              viết dài hơn một chút.
            </p>
            <a
              href="mailto:kenjipham.bht@gmail.com"
              className="inline-block bg-e26-gold text-e26-black rounded-none font-sans font-medium text-[13px] tracking-[0.08em] uppercase px-9 py-4 hover:bg-e26-gold-deep hover:text-e26-ivory transition-colors duration-300"
            >
              Gửi email cho Kenji
            </a>
          </div>
        </section>
      </main>
      <HomeFooter />
    </>
  );
}
