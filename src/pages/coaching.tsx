import Head from "next/head";
import { SEO } from "@/components/SEO";
import GrainOverlay from "@/components/homepage/GrainOverlay";
import HomeHeader from "@/components/homepage/HomeHeader";
import HomeHero from "@/components/homepage/HomeHero";
import KietTac from "@/components/homepage/KietTac";
import KenjiSection from "@/components/homepage/KenjiSection";
import TwoStates from "@/components/homepage/TwoStates";
import WhatIsEssence from "@/components/homepage/WhatIsEssence";
import AnDinhAnThinh from "@/components/homepage/AnDinhAnThinh";
import ImageBridge from "@/components/homepage/ImageBridge";
import SignatureEnding from "@/components/homepage/SignatureEnding";
import HomeFooter from "@/components/homepage/HomeFooter";
import { useHomeReveal } from "@/components/homepage/useHomeReveal";

const CANONICAL_URL = "https://coachkenjipham.com/coaching";

export default function CoachingPage() {
  useHomeReveal();

  return (
    <>
      <SEO
        title="ESSENCE Coaching — Kenji Phạm"
        ogTitle="ESSENCE Coaching — Kenji Phạm"
        description="ESSENCE Coaching — không gian dành cho đời sống cá nhân, bản sắc, lựa chọn, vai trò và những điều bạn muốn đưa vào cách mình sống."
        ogDescription="ESSENCE Coaching — từ điều được nhận ra đến cách bạn thật sự sống với lựa chọn của mình."
        image="https://coachkenjipham.com/essence-og-1200x630.png"
        url={CANONICAL_URL}
      />

      <Head>
        <meta name="robots" content="noindex" />
        <link rel="canonical" href={CANONICAL_URL} />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/favicon-192.png" />
        <link rel="icon" type="image/png" sizes="512x512" href="/favicon-512.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon-180.png" />
      </Head>

      <GrainOverlay />
      <HomeHeader homeIa />
      <main className="bg-e26-ivory">
        <HomeHero />
        <KietTac />
        <KenjiSection />
        <TwoStates />
        <WhatIsEssence />
        <AnDinhAnThinh />
        <ImageBridge />
        <SignatureEnding />
      </main>
      <HomeFooter homeIa />
    </>
  );
}
