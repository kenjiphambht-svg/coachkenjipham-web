import Head from "next/head";
import { SEO } from "@/components/SEO";
import HomeHeader from "@/components/homepage/HomeHeader";
import HomeFooter from "@/components/homepage/HomeFooter";

// ============================================================
// /lien-he — KHUNG (noindex). Theo brief 03 mục 10.
// CTA chính (email) là REAL — mailto hoạt động ngay. Kênh Messenger/Zalo
// đã có sẵn qua FloatingZaloButton toàn site (_app.tsx) nên không lặp lại
// link riêng ở đây. "Form tối giản" CHƯA nối backend (repo chỉ có
// src/pages/api/hello.ts stub) — để placeholder rõ ràng, không dựng form
// giả không gửi đi đâu.
// ============================================================
export default function LienHePage() {
  return (
    <>
      <SEO
        title="Liên hệ — Kenji Phạm (Bản khung)"
        description="Một cánh cửa liên hệ rõ, không rào cản. Trang đang dựng khung, chờ Kenji duyệt nội dung."
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
          <h1 className="font-serif font-light text-[34px] md:text-[46px] text-e26-text mt-3">
            [HERO — chờ nội dung]
          </h1>
        </div>

        <section className="bg-e26-white px-6 py-16 md:py-24 border-b border-e26-border">
          <div className="max-w-[720px] mx-auto">
            <p className="font-serif text-xl md:text-2xl text-e26-text mb-3">
              [SECTION — kênh liên hệ nhanh]
            </p>
            <p className="font-sans text-sm text-e26-text-2 mb-8">
              Nội dung sẽ được Kenji duyệt và đưa vào sau — xem file GOI-XX tương ứng trong Drive.
              Nút Zalo góc màn hình đã hoạt động (dùng chung toàn site).
            </p>
            <a
              href="mailto:kenjipham.bht@gmail.com"
              className="inline-block bg-e26-gold text-e26-black rounded-none font-sans font-medium text-[13px] tracking-[0.08em] uppercase px-9 py-4 hover:bg-e26-gold-deep hover:text-e26-ivory transition-colors duration-300"
            >
              Gửi email cho Kenji
            </a>
          </div>
        </section>

        <section className="bg-e26-ivory px-6 py-16 md:py-24">
          <div className="max-w-[720px] mx-auto">
            <p className="font-serif text-xl md:text-2xl text-e26-text mb-3">
              [SECTION — form tối giản (tên · email · lời nhắn)]
            </p>
            <p className="font-sans text-sm text-e26-text-2">
              Chưa nối backend gửi form ở bước dựng khung này (xem File 07 để nối API + chống
              spam nhẹ dạng honeypot). Hiện tại dùng email/Zalo ở trên là kênh thật.
            </p>
          </div>
        </section>
      </main>
      <HomeFooter />
    </>
  );
}
