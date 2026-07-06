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
import { useHomeReveal } from "@/components/homepage/useHomeReveal";

// Homepage V2 — Essence 2026.
// Mode: Light-led premium with dark silence section
// (docs/brand/design-system/08_PAGE_APPLICATION_GUIDE_2026.md mục 1).
// 8 section cố định theo docs/website/master-plan/04_HOMEPAGE_10000_USD_SPEC.md mục 2.
// Motion: reveal riêng của homepage (.e26-reveal, 250ms/12px) — useHomeReveal bên dưới.
// Không dùng .fade-in-section để không phụ thuộc hook mist dùng chung với route live.
export default function HomePage() {
  useHomeReveal();

  return (
    <>
      <SEO
        title="Kenji Phạm — Essence Coach | Essence Coaching System"
        description="Kenji Phạm — Essence Coach tại Sài Gòn. Một không gian có cấu trúc và ranh giới an toàn: để bạn nhìn rõ mình, và để ba mẹ hiểu con hơn."
        image="/og-image.png"
        url="https://coachkenjipham.com"
      />

      <Head>
        {/* WebSite + Person JSON-LD (docs/website/master-plan/03_PAGE_BRIEFS_PUBLIC_PAGES.md mục 1) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "Essence Coaching",
              url: "https://coachkenjipham.com",
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
              url: "https://coachkenjipham.com",
            }),
          }}
        />
      </Head>

      <HomeHeader />
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
