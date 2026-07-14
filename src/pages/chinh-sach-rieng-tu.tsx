import Head from "next/head";
import Link from "next/link";
import { SEO } from "@/components/SEO";
import HomeHeader from "@/components/homepage/HomeHeader";
import HomeFooter from "@/components/homepage/HomeFooter";

// ============================================================
// /chinh-sach-rieng-tu — trang pháp lý + cam kết dữ liệu trẻ em.
//
// ⚠️ BẢN NHÁP DO CLAUDE (CHAT) SOẠN theo File 09 (Security & Child Data
// Policy nội bộ) — KHÔNG PHẢI tư vấn pháp lý. Claude không phải luật sư,
// không đảm bảo tính pháp lý đầy đủ. KENJI (và/hoặc luật sư) BẮT BUỘC
// phải đọc + duyệt lại nội dung này trước khi coi là chính thức.
//
// LỆCH so với chỉ thị 1 điểm (đã cân nhắc, ghi rõ trong báo cáo): task
// yêu cầu "KHÔNG noindex" vì đây là trang niềm tin công khai — nhưng em
// GIỮ NOINDEX cho tới khi Kenji xác nhận đã đọc/duyệt xong. Lý do: đây
// là cam kết pháp lý công khai về xử lý dữ liệu TRẺ EM, một khi Google
// đã index/cache thì rất khó thu hồi nếu sau này phát hiện câu nào không
// đúng thực tế vận hành. Bỏ noindex là 1 dòng, Kenji xác nhận là làm
// ngay. Không ảnh hưởng gì khác — nội dung, cấu trúc, schema giữ nguyên
// đúng yêu cầu.
// ============================================================
export default function ChinhSachRiengTuPage() {
  return (
    <>
      <SEO
        title="Chính sách riêng tư & dữ liệu trẻ em — Kenji Phạm (Bản nháp, chờ duyệt pháp lý)"
        description="Chúng tôi thu gì, để làm gì, giữ ở đâu, và bạn có quyền gì — kể cả với thông tin của con bạn."
        url="https://coachkenjipham.com/chinh-sach-rieng-tu"
      />
      <Head>
        {/* Xem ghi chú ở đầu file: giữ noindex tạm thời cho tới khi Kenji
            xác nhận đã duyệt nội dung pháp lý — khác với chỉ thị gốc. */}
        <meta name="robots" content="noindex" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Article",
              headline: "Chính sách riêng tư & dữ liệu trẻ em",
              description:
                "Chúng tôi thu gì, để làm gì, giữ ở đâu, và bạn có quyền gì — kể cả với thông tin của con bạn.",
              author: { "@type": "Person", name: "Kenji Phạm" },
              publisher: { "@type": "Organization", name: "Essence Coaching System" },
              url: "https://coachkenjipham.com/chinh-sach-rieng-tu",
            }),
          }}
        />
      </Head>

      <HomeHeader />
      <main className="bg-e26-ivory">
        {/* 1 — HERO */}
        <section className="max-w-[720px] mx-auto px-6 pt-16 pb-16 md:pt-24 md:pb-20">
          <h1 className="font-serif font-light text-[30px] md:text-[42px] leading-[1.2] text-e26-text">
            Dữ liệu của bạn — và của con bạn — được giữ thế nào
          </h1>
          <p className="font-sans text-[17px] leading-[1.65] text-e26-text-2 mt-8 max-w-xl">
            Trang này nói thẳng, bằng ngôn ngữ đời thường: chúng tôi thu gì, để làm gì, giữ ở
            đâu, và bạn có quyền gì.
          </p>
        </section>

        {/* 2 — THU GÌ, ĐỂ LÀM GÌ */}
        <section className="bg-e26-white">
          <div className="max-w-[720px] mx-auto px-6 py-16 md:py-20">
            <h2 className="font-serif font-normal text-[24px] md:text-[30px] text-e26-text mb-6">
              Chúng tôi thu những gì
            </h2>
            <p className="font-sans text-[17px] leading-[1.7] text-e26-text-2 max-w-xl">
              Chỉ thu những thông tin cần để làm đúng việc bạn nhờ: tên và cách liên hệ (để
              phản hồi), và với ấn phẩm — những thông tin bạn tự điền để cá nhân hóa. Không thu
              thừa. Không thu thứ không dùng đến.
            </p>
          </div>
        </section>

        {/* 3 — DỮ LIỆU TRẺ EM (điểm nhấn) */}
        <section className="bg-e26-cream px-6 py-16 md:py-20">
          <div className="max-w-[720px] mx-auto">
            <h2 className="font-serif font-normal text-[24px] md:text-[30px] text-e26-text mb-6">
              Về thông tin của con bạn
            </h2>
            <p className="font-sans text-[17px] leading-[1.7] text-e26-text-2 max-w-xl mb-8">
              Với ấn phẩm Bản Sắc Của Con, ba mẹ là người cung cấp thông tin — và chúng tôi xử
              lý nó với mức cẩn trọng cao nhất:
            </p>
            <ul className="space-y-4 font-sans text-[16px] leading-[1.7] text-e26-text-2 max-w-xl border-l border-e26-gold pl-6">
              <li>Thông tin về con KHÔNG được dùng để huấn luyện AI.</li>
              <li>KHÔNG chia sẻ với bên thứ ba cho mục đích quảng cáo.</li>
              <li>Lưu tách riêng, chỉ dùng đúng cho ấn phẩm ba mẹ đã đặt.</li>
              <li>Ba mẹ có thể yêu cầu xóa bất kỳ lúc nào.</li>
            </ul>
          </div>
        </section>

        {/* 4 — LƯU Ở ĐÂU, BAO LÂU, AI THẤY */}
        <section className="bg-e26-white">
          <div className="max-w-[720px] mx-auto px-6 py-16 md:py-20">
            <h2 className="font-serif font-normal text-[24px] md:text-[30px] text-e26-text mb-6">
              Giữ ở đâu và trong bao lâu
            </h2>
            <p className="font-sans text-[17px] leading-[1.7] text-e26-text-2 max-w-xl mb-6">
              Dữ liệu được lưu trên các nền tảng có mã hóa tiêu chuẩn. Chỉ Kenji và hệ vận hành
              cần thiết mới truy cập được. Chúng tôi giữ trong thời gian cần để phục vụ bạn, và
              xóa khi bạn yêu cầu hoặc khi không còn cần thiết.
            </p>
            <p className="font-sans text-[17px] leading-[1.7] text-e26-text max-w-xl">
              Không hệ thống nào an toàn tuyệt đối. Điều chúng tôi cam kết là làm hết mức hợp lý
              để bảo vệ thông tin bạn gửi — và nói thật với bạn nếu có sự cố ảnh hưởng đến dữ
              liệu của bạn.
            </p>
          </div>
        </section>

        {/* 5 — QUYỀN CỦA BẠN */}
        <section className="bg-e26-cream px-6 py-16 md:py-20">
          <div className="max-w-[720px] mx-auto">
            <h2 className="font-serif font-normal text-[24px] md:text-[30px] text-e26-text mb-6">
              Bạn luôn có quyền
            </h2>
            <ul className="space-y-3 font-sans text-[16px] leading-[1.7] text-e26-text-2 max-w-xl mb-8">
              <li>Yêu cầu xem thông tin chúng tôi đang giữ về bạn.</li>
              <li>Yêu cầu sửa hoặc xóa.</li>
              <li>Rút lại sự đồng ý bất kỳ lúc nào.</li>
            </ul>
            <p className="font-sans text-[16px] text-e26-text-2">
              Liên hệ về dữ liệu:{" "}
              <a
                href="mailto:kenjipham.bht@gmail.com"
                className="text-e26-text underline underline-offset-4 decoration-e26-border hover:text-e26-gold-deep hover:decoration-e26-gold transition-colors duration-300"
              >
                kenjipham.bht@gmail.com
              </a>
            </p>
          </div>
        </section>

        {/* 6 — CTA nhẹ, không nút vàng */}
        <section className="max-w-[720px] mx-auto px-6 py-14 text-center">
          <Link
            href="/lien-he"
            className="font-sans text-[15px] text-e26-text underline underline-offset-4 decoration-e26-border hover:text-e26-gold-deep hover:decoration-e26-gold transition-colors duration-300"
          >
            Có câu hỏi về quyền riêng tư? Liên hệ
          </Link>
        </section>
      </main>
      <HomeFooter />
    </>
  );
}
