import Head from "next/head";
import { SEO } from "@/components/SEO";
import GrainOverlay from "@/components/homepage/GrainOverlay";
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
import SignatureEnding from "@/components/homepage/SignatureEnding";
import HomeFooter from "@/components/homepage/HomeFooter";
import { useHomeReveal } from "@/components/homepage/useHomeReveal";

// Canonical Villa composition — Essence 2026. This is the single
// implementation source rendered by both the canonical route `/` and the
// contained migration-evidence route `/trang-chu-v2`. Both remain NOINDEX
// until the separately approved M6 Search Indexing Launch.
//
// SỬA 20/07/2026 — nội dung chữ toàn trang đồng bộ theo Google Doc "HOMEPAGE
// V9-FINAL — NGUỒN SỰ THẬT CHO CHỮ" (brief V9-FINAL). Thêm 2 khối MỚI:
// Signature Moment (②b, giữa Hero/Kiệt Tác) và Signature Ending (⑨b, trước
// Footer) — cả hai là 1 câu serif italic căn giữa, không ảnh không nút, chỉ
// dựng khối tĩnh + fade-in cơ bản (animation/scroll-lock thật để dành PR
// Light System sau).
// SỬA 21/07/2026 (brief Kenji hoà vào đen + vệt sơn sáng) — Signature Moment
// (②b) KHÔNG còn là section riêng nền kem nữa: đã GỠ <SignatureMoment />
// khỏi đây, câu chữ dời vào NGAY TRONG HomeHero.tsx (đứng trên vệt sơn sáng
// giữa vùng tối cuối Hero, nơi ảnh Kenji đang chìm dần) — xem ghi chú đầy đủ
// tại HomeHero.tsx (khối "LỚP 4"). File SignatureMoment.tsx không còn được
// dùng ở đâu (đã grep xác nhận) nên đã xoá khỏi repo.
// NỘI DUNG THEO BAN-CHOT.md (16/07/2026). ĐẢO MẠCH 19/07/2026 (Experience
// Bible): mở cửa → gọi cảm xúc → KHOẢNG LẶNG (Kiệt Tác) → rồi mới Kenji. Thứ
// tự: Header, Hero (bao gồm Signature Moment ②b ở cuối), Kiệt Tác (H1 duy
// nhất, ĐEN), Kenji Là Ai, Hai Cửa, Essence Là Gì, An Định → An Thịnh, cầu
// nối ảnh, Điều Essence Không Hứa (teaser), Một Góc Để Quay Lại, Signature
// Ending, Footer.
// Đã bỏ HatMamSection khỏi trang chủ (Hạt Mầm giờ dẫn qua thẻ "Bản Sắc Của
// Con" ở Hai Cửa) — GIỮ NGUYÊN file HatMamSection.tsx trong repo, không xoá.
// Nhịp sáng-tối SAU ĐẢO: kem (Hero) → ĐEN (Kiệt Tác) → kem (Kenji, Hai Cửa,
// Essence) → ĐEN (An Định → An Thịnh) → kem → đen (footer). Vẫn ĐÚNG 2 khối
// tối giữa trang. Ảnh hero chờm ranh giới kem→đen (kỹ thuật đắt).
// Motion: reveal riêng của homepage (.e26-reveal, 250ms/12px) — useHomeReveal.
interface VillaPageProps {
  pageUrl: "https://coachkenjipham.com/" | "https://coachkenjipham.com/trang-chu-v2";
}

export default function VillaPage({ pageUrl }: VillaPageProps) {
  useHomeReveal();

  return (
    <>
      <SEO
        title="Kenji Phạm — Huấn luyện viên Tâm lý Chiều sâu, Essence Coach"
        ogTitle="Kenji Phạm — Essence Coaching"
        description="Essence Coaching là hành trình do Kenji Phạm kiến tạo, giúp bạn nhận ra bản sắc, sống đúng nhịp của mình và để An Thịnh trở thành kết quả tự nhiên."
        ogDescription="Nhìn rõ điều đang vận hành bên trong, nhận ra bản sắc và sống đúng nhịp của mình — để An Thịnh không còn là điều phải mãi theo đuổi."
        image="https://coachkenjipham.com/essence-og-1200x630.png"
        url={pageUrl}
      />

      <Head>
        <meta name="robots" content="noindex" />
        {/* CANONICAL — Founder Decision 02/08/2026: domain canonical chính thức
            là apex `https://coachkenjipham.com` (KHÔNG www). Mọi absolute URL ở
            đây (canonical, og:url, JSON-LD url) đã dùng đúng apex.
            SELF-CANONICAL theo `pageUrl`, không hardcode "/": `/trang-chu-v2`
            vẫn đang chờ Kenji quyết disposition (L0 C-01) — trỏ canonical của
            nó về "/" sẽ là một quyết định hợp nhất mà C-01 chưa cho phép suy ra.
            Cả 2 route đều noindex nên thẻ này hiện KHÔNG có tác dụng indexing;
            nó tồn tại để khi M6 kích hoạt index thì không phải sửa bù SEO.
            HẠ TẦNG (đã xong 02/08/2026, verify live): apex là Primary Domain
            trên Vercel, www trả 308 vĩnh viễn về apex, HTTP→HTTPS đúng, không
            vòng lặp. Chuẩn hoá host CHỈ nằm ở Vercel dashboard — KHÔNG thêm
            redirect theo host vào vercel.json (chồng 2 lớp = rủi ro vòng lặp).
            Bằng chứng: docs/website/homepage/HOMEPAGE_FINAL_COMPLETION_RECORD.md
            mục 4. */}
        <link rel="canonical" href={pageUrl} />
        {/* Favicon bộ 2026 — chỉ gắn riêng trang này (không sửa _document.tsx/SEO.tsx
            dùng chung, vì /kidbook và /ai-startup cũng gọi component đó). */}
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/favicon-192.png" />
        <link rel="icon" type="image/png" sizes="512x512" href="/favicon-512.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon-180.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        {/* Person + Organization JSON-LD — cấu trúc theo "Schema đề xuất" trong
            BAN-CHOT.md (thay cho WebSite schema của bản trước). Tên entity theo
            L0 C-07 (31/07/2026): "Essence Coaching" — không hậu tố "System". */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "Kenji Phạm",
              alternateName: "Coach Kenji Phạm",
              jobTitle: "Huấn luyện viên Tâm lý Chiều sâu, Essence Coach",
              worksFor: {
                "@type": "Organization",
                name: "Essence Coaching",
              },
              address: {
                "@type": "PostalAddress",
                addressLocality: "Sài Gòn",
                addressCountry: "VN",
              },
              url: pageUrl,
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Essence Coaching",
              founder: {
                "@type": "Person",
                name: "Kenji Phạm",
              },
              address: {
                "@type": "PostalAddress",
                addressLocality: "Sài Gòn",
                addressCountry: "VN",
              },
              url: pageUrl,
            }),
          }}
        />
      </Head>

      <GrainOverlay />
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
        <SignatureEnding />
      </main>
      <HomeFooter />
    </>
  );
}
