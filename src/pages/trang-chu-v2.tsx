import Head from "next/head";
import { SEO } from "@/components/SEO";
import HomeHeader from "@/components/homepage/HomeHeader";
import HomeHero from "@/components/homepage/HomeHero";
import KenjiSection from "@/components/homepage/KenjiSection";
import TwoStates from "@/components/homepage/TwoStates";
import WhatIsEssence from "@/components/homepage/WhatIsEssence";
import HatMamSection from "@/components/homepage/HatMamSection";
import NotPromised from "@/components/homepage/NotPromised";
import NotesTeaser from "@/components/homepage/NotesTeaser";
import HomeFooter from "@/components/homepage/HomeFooter";
import CinematicControls from "@/components/homepage/CinematicControls";
import { useHomeReveal } from "@/components/homepage/useHomeReveal";

// Homepage V2 — Essence 2026. Route TẠM /trang-chu-v2 để Kenji xem bản nháp
// trên domain thật mà không đụng "/" (Coming Soon) đang sống. NOINDEX — chưa
// công khai cho Google. Khi duyệt xong, nội dung này sẽ thay thế index.tsx
// thật và route tạm này sẽ được gỡ (theo Migration Strategy — Phase 0 audit).
// Mode: Light-led premium with dark silence section
// (docs/brand/design-system/08_PAGE_APPLICATION_GUIDE_2026.md mục 1).
// 8 section cố định theo docs/website/master-plan/04_HOMEPAGE_10000_USD_SPEC.md mục 2.
// Motion: reveal riêng của homepage (.e26-reveal, 250ms/12px) — useHomeReveal bên dưới.
export default function TrangChuV2Page() {
  useHomeReveal();

  return (
    <>
      <SEO
        title="Kenji Phạm — Essence Coach | Essence Coaching System (Bản nháp)"
        description="Kenji Phạm — Essence Coach tại Sài Gòn. Một không gian có cấu trúc và ranh giới an toàn: để bạn nhìn rõ mình, và để ba mẹ hiểu con hơn."
        image="/essence-og-1200x630.png"
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
        {/* WebSite + Person JSON-LD (docs/website/master-plan/03_PAGE_BRIEFS_PUBLIC_PAGES.md mục 1) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "Essence Coaching",
              url: "https://coachkenjipham.com/trang-chu-v2",
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "Kenji Phạm",
              alternateName: "Coach Kenji Phạm",
              jobTitle: "Essence Coach",
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
      </Head>

      <HomeHeader />
      {/* Chế độ điện ảnh theo cú vuốt — chỉ mobile, mặc định bật, có nút tắt.
          Desktop + prefers-reduced-motion: cuộn tự do như cũ, không đổi gì. */}
      <CinematicControls />
      <main className="bg-e26-ivory">
        <HomeHero />
        <KenjiSection />
        <TwoStates />
        <WhatIsEssence />
        <HatMamSection />
        <NotPromised />
        <NotesTeaser />
      </main>
      <HomeFooter />
    </>
  );
}
