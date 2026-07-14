import Head from "next/head";
import { SEO } from "@/components/SEO";
import { useLandingReveal } from "@/components/landing-hat-mam/useLandingReveal";
import Room1HeroGM from "@/components/landing-giao-mua/Room1HeroGM";
import Room2HeartGM from "@/components/landing-giao-mua/Room2HeartGM";
import Room3ProductGM from "@/components/landing-giao-mua/Room3ProductGM";
import Room4ProcessGM from "@/components/landing-giao-mua/Room4ProcessGM";
import Room5KenjiPackagesGM from "@/components/landing-giao-mua/Room5KenjiPackagesGM";
import Room6FAQGM, { FAQS } from "@/components/landing-giao-mua/Room6FAQGM";

// ============================================================
// /an-pham-ban-sac-giao-mua — ấn phẩm "Bản Sắc Giao Mùa" (14–21 tuổi).
// TRẠNG THÁI: PREVIEW (chưa mở). Điều kiện mở khóa 'live' nằm trong
// docs/product/LAUNCH_CHECKLIST_GIAO_MUA.md — KHÔNG ai tự mở sớm hơn.
//
// Sản phẩm này CHẠM QUYỀN TỰ QUYẾT của người trẻ 14-21 — giữ đúng 2
// chốt đạo đức đã cài trong nội dung, không rút gọn:
// 1) Ấn phẩm đứng về phía MỐI QUAN HỆ, không đứng về phía ba mẹ để "xử"
//    con (Room3ProductGM.tsx, bullet "Không phải là" thứ 4).
// 2) Khuyến khích con biết + mời con tham gia tự nguyện từ 15 tuổi
//    (Room4ProcessGM.tsx box "Bảo mật & tôn trọng"; FAQ #3).
//
// TÁI DÙNG layout/component pattern landing Hạt Mầm — cùng cách đã áp
// dụng cho /an-pham-ban-sac-kham-pha (không viết lại LINE_STATUS/mailto
// từ đầu, chỉ đổi giá trị/nội dung riêng cho sản phẩm này).
//
// KHÔNG link từ nav/homepage/hub — hub /ban-sac-cua-con giữ nguyên thẻ
// "Sắp mở" hiện tại, KHÔNG bị đổi (đã kiểm bằng git diff trước khi commit).
//
// GHI CHÚ MINH BẠCH:
// - Đoạn Kenji ở Phòng 6 CHƯA có nội dung — Kenji chưa điền khi gửi
//   task (bracket "[KENJI VIẾT...]" vẫn còn nguyên). Không tự soạn.
// - "[X ngày]" (Phòng 5 + FAQ #6): task để trống, chưa có số cụ thể.
// - Schema Product: preview, KHÔNG kèm offers/price.
// ============================================================
export default function AnPhamBanSacGiaoMuaPage() {
  useLandingReveal();

  return (
    <>
      <SEO
        title="Bản Sắc Giao Mùa — 14–21 tuổi (Preview, Bản nháp)"
        description="Con vẫn ở trong nhà. Nhưng có một cánh cửa đã khép hờ. Ấn phẩm viết riêng giúp ba mẹ đứng đúng khoảng cách với con tuổi giao mùa. Sắp mở."
        image="/essence-og-1200x630.png"
        url="https://coachkenjipham.com/an-pham-ban-sac-giao-mua"
      />
      <Head>
        <meta name="robots" content="noindex" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/favicon-192.png" />
        <link rel="icon" type="image/png" sizes="512x512" href="/favicon-512.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon-180.png" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Product",
              name: "Bản Sắc Giao Mùa",
              description:
                "Ấn phẩm viết riêng cho người trẻ 14–21 tuổi — bản đồ quan sát về điều con đang yêu, điều con đang muốn, ý chí và ranh giới, và khoảng cách đúng ba mẹ cần giữ.",
              brand: { "@type": "Brand", name: "Essence Coaching" },
              url: "https://coachkenjipham.com/an-pham-ban-sac-giao-mua",
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: FAQS.map((f) => ({
                "@type": "Question",
                name: f.q,
                acceptedAnswer: { "@type": "Answer", text: f.a },
              })),
            }),
          }}
        />
      </Head>

      <main className="bg-e26-ivory">
        <Room1HeroGM />
        <Room2HeartGM />
        <Room3ProductGM />
        <Room4ProcessGM />
        <Room5KenjiPackagesGM />
        <Room6FAQGM />
      </main>
    </>
  );
}
