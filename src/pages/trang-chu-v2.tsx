import Head from "next/head";
import { SEO } from "@/components/SEO";
import HomeHeader from "@/components/homepage/HomeHeader";
import HomeHero from "@/components/homepage/HomeHero";
import KenjiSection from "@/components/homepage/KenjiSection";
import KietTac from "@/components/homepage/KietTac";
import TwoStates from "@/components/homepage/TwoStates";
import WhatIsEssence from "@/components/homepage/WhatIsEssence";
import AnDinhAnThinh from "@/components/homepage/AnDinhAnThinh";
import ImageBridge from "@/components/homepage/ImageBridge";
import NotPromised from "@/components/homepage/NotPromised";
import NotesTeaser from "@/components/homepage/NotesTeaser";
import HomeFooter from "@/components/homepage/HomeFooter";
import { useHomeReveal } from "@/components/homepage/useHomeReveal";

// Homepage V2 — Essence 2026. Route TẠM /trang-chu-v2 để Kenji xem bản nháp
// trên domain thật mà không đụng "/" (Coming Soon) đang sống. NOINDEX — chưa
// công khai cho Google. Khi duyệt xong, nội dung này sẽ thay thế index.tsx
// thật và route tạm này sẽ được gỡ (theo Migration Strategy — Phase 0 audit).
//
// NỘI DUNG THEO BAN-CHOT.md (16/07/2026). ĐẢO MẠCH 19/07/2026 (Experience
// Bible): mở cửa → gọi cảm xúc → KHOẢNG LẶNG (Kiệt Tác) → rồi mới Kenji. Thứ
// tự: Header, Hero, Kiệt Tác (H1 duy nhất, ĐEN), Kenji Là Ai, Hai Cửa, Essence
// Là Gì, An Định → An Thịnh, cầu nối ảnh, Điều Essence Không Hứa (teaser), Ghi
// Chép + Lối Ra, Footer.
// Đã bỏ HatMamSection khỏi trang chủ (Hạt Mầm giờ dẫn qua thẻ "Bản Sắc Của
// Con" ở Hai Cửa) — GIỮ NGUYÊN file HatMamSection.tsx trong repo, không xoá.
// Nhịp sáng-tối SAU ĐẢO: kem (Hero) → ĐEN (Kiệt Tác) → kem (Kenji, Hai Cửa,
// Essence) → ĐEN (An Định → An Thịnh) → kem → đen (footer). Vẫn ĐÚNG 2 khối
// tối giữa trang. Ảnh hero chờm ranh giới kem→đen (kỹ thuật đắt).
// Motion: reveal riêng của homepage (.e26-reveal, 250ms/12px) — useHomeReveal.
export default function TrangChuV2Page() {
  useHomeReveal();

  return (
    <>
      <SEO
        title="Kenji Phạm | Huấn luyện viên Tâm lý Chiều sâu"
        description="Câu chuyện cuộc sống của bạn là một kiệt tác. Cùng Kenji Phạm dọn phản xạ cũ, thiết lập nhịp sống mới và kiến tạo đời sống An Thịnh từ bản sắc thật."
        ogDescription="Câu chuyện cuộc sống của bạn là một kiệt tác. Essence Coaching by Kenji Phạm — Sài Gòn"
        image="https://coachkenjipham.com/essence-og-1200x630.png"
        url="https://coachkenjipham.com/trang-chu-v2"
      />

      <Head>
        <meta name="robots" content="noindex" />
        {/* Favicon bộ 2026 — chỉ gắn riêng trang này (không sửa _document.tsx/SEO.tsx
            dùng chung, vì /kidbook và /ai-startup cũng gọi component đó). */}
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/favicon-192.png" />
        <link rel="icon" type="image/png" sizes="512x512" href="/favicon-512.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon-180.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        {/* Person + Organization JSON-LD — theo "Schema đề xuất" trong BAN-CHOT.md
            (thay cho WebSite schema của bản trước). */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "Kenji Phạm",
              alternateName: "Coach Kenji Phạm",
              jobTitle: "Huấn luyện viên Tâm lý Chiều sâu",
              worksFor: {
                "@type": "Organization",
                name: "Essence Coaching System",
              },
              address: {
                "@type": "PostalAddress",
                addressLocality: "Sài Gòn",
                addressCountry: "VN",
              },
              url: "https://coachkenjipham.com/trang-chu-v2",
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Essence Coaching System",
              founder: {
                "@type": "Person",
                name: "Kenji Phạm",
              },
              address: {
                "@type": "PostalAddress",
                addressLocality: "Sài Gòn",
                addressCountry: "VN",
              },
              url: "https://coachkenjipham.com/trang-chu-v2",
            }),
          }}
        />
      </Head>

      <HomeHeader />
      <main className="bg-e26-ivory">
        <HomeHero />
        <KietTac />
        <KenjiSection />
        <TwoStates />
        <WhatIsEssence />
        <AnDinhAnThinh />
        <ImageBridge />
        <NotPromised />
        <NotesTeaser />
      </main>
      <HomeFooter />
    </>
  );
}
