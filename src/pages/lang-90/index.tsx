import Head from "next/head";

import Lang90Page from "@/components/lang-90/Lang90Page";
import { SEO } from "@/components/SEO";

export default function Lang90Landing() {
  return (
    <>
      <SEO
        title="Lặng 90 — Phiên 1:1 cùng Kenji Phạm"
        description="Một phiên 90 phút để làm chậm điều đang quá nhiễu, nhìn rõ một phản ứng hoặc vòng lặp chính và chọn một bước có thể thực hiện trong 48 giờ tiếp theo."
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
