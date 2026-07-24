import Head from "next/head";

import Lang90Page from "@/components/lang-90/Lang90Page";
import { SEO } from "@/components/SEO";

export default function Lang90Landing() {
  return (
    <>
      <SEO
        title="Lặng — Phiên 1:1 cùng Kenji Phạm"
        description="Một lần ngồi xuống đủ lâu để tiếng ồn bớt đi — và điều bạn thật sự nghĩ bắt đầu hiện ra."
        image="/essence-og-1200x630.png"
        url="https://coachkenjipham.com/lang-90"
      />
      <Head>
        <meta name="robots" content="noindex" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon-180.png" />
      </Head>
      <Lang90Page />
    </>
  );
}
