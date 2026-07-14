import Head from "next/head";
import { SEO } from "@/components/SEO";
import { useLandingReveal } from "@/components/landing-hat-mam/useLandingReveal";
import Room1HeroKP from "@/components/landing-kham-pha/Room1HeroKP";
import Room2HeartKP from "@/components/landing-kham-pha/Room2HeartKP";
import Room3ProductKP from "@/components/landing-kham-pha/Room3ProductKP";
import Room4ProcessKP from "@/components/landing-kham-pha/Room4ProcessKP";
import Room5KenjiPackagesKP from "@/components/landing-kham-pha/Room5KenjiPackagesKP";
import Room6FAQKP, { FAQS } from "@/components/landing-kham-pha/Room6FAQKP";

// ============================================================
// /an-pham-ban-sac-kham-pha — ấn phẩm "Bản Sắc Khám Phá" (7–14 tuổi).
// TRẠNG THÁI: PREVIEW (chưa mở). Điều kiện mở khóa 'live' nằm trong
// docs/product/LAUNCH_CHECKLIST_KHAM_PHA.md — KHÔNG ai tự mở sớm hơn,
// kể cả khi Kenji yêu cầu nhanh trong lúc hứng (đúng chỉ thị task).
//
// TÁI DÙNG layout/component pattern của landing Hạt Mầm
// (src/components/landing-hat-mam/) — không viết layout mới:
//   - AudioNote, MockupSlot, icons, useLandingReveal: IMPORT THẲNG
//     (component thuần túy, không có copy Hạt Mầm cứng trong đó).
//   - 6 Room component riêng trong src/components/landing-kham-pha/:
//     copy khác Hạt Mầm nên phải là file riêng, nhưng class/cấu trúc
//     JSX (hm-reveal, bg-e26-*, spacing, grid) giữ Y HỆT.
// 7 "phòng" nội dung dàn trên 6 file component (Room1 gộp Phòng 1+2,
// giống cách Room1Entrance.tsx gốc gộp Section 1+2 — đúng tiền lệ).
//
// KHÔNG link từ nav/homepage/hub — hub /ban-sac-cua-con giữ nguyên thẻ
// "Sắp mở" hiện tại, KHÔNG bị đổi (đã kiểm bằng git diff trước khi commit).
//
// GHI CHÚ MINH BẠCH (đọc trước khi duyệt):
// - Đoạn Kenji ở Phòng 6 CHƯA có nội dung — Kenji chưa điền khi gửi task
//   (bracket "[KENJI VIẾT...]" vẫn còn nguyên). Để placeholder rõ ràng,
//   không tự soạn giọng Kenji.
// - "[X ngày]" (Phòng 5 + FAQ #5): task để trống, chưa có số cụ thể.
// - Schema Product: preview, KHÔNG kèm offers/price — đúng LINE_STATUS.
// ============================================================
export default function AnPhamBanSacKhamPhaPage() {
  useLandingReveal();

  return (
    <>
      <SEO
        title="Bản Sắc Khám Phá — 7–14 tuổi (Preview, Bản nháp)"
        description="Con đang bước ra thế giới. Ấn phẩm viết riêng về cách con học, cách con cảm, và điều con cần khi va vấp. Sắp mở."
        image="/essence-og-1200x630.png"
        url="https://coachkenjipham.com/an-pham-ban-sac-kham-pha"
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
              name: "Bản Sắc Khám Phá",
              description:
                "Ấn phẩm viết riêng cho con 7–14 tuổi — bản đồ quan sát về cách con học, cách con cảm, điều làm trái tim con mở ra, và điều con cần khi va vấp.",
              brand: { "@type": "Brand", name: "Essence Coaching" },
              url: "https://coachkenjipham.com/an-pham-ban-sac-kham-pha",
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
        <Room1HeroKP />
        <Room2HeartKP />
        <Room3ProductKP />
        <Room4ProcessKP />
        <Room5KenjiPackagesKP />
        <Room6FAQKP />
      </main>
    </>
  );
}
