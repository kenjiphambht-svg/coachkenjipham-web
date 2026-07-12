import Head from "next/head";
import { SEO } from "@/components/SEO";
import Room1Entrance from "@/components/landing-hat-mam/Room1Entrance";
import Room2Heart from "@/components/landing-hat-mam/Room2Heart";
import Room3Product from "@/components/landing-hat-mam/Room3Product";
import Room4Inside from "@/components/landing-hat-mam/Room4Inside";
import Room5KenjiProcess from "@/components/landing-hat-mam/Room5KenjiProcess";
import Room6Decision, { FAQS } from "@/components/landing-hat-mam/Room6Decision";
import Room7Doors from "@/components/landing-hat-mam/Room7Doors";
import { useLandingReveal } from "@/components/landing-hat-mam/useLandingReveal";

// ============================================================
// LANDING BẢN SẮC HẠT MẦM V3 — /an-pham-ban-sac-hat-mam
// NOINDEX — đây là bản nháp đưa lên domain thật để Kenji xem trực tiếp,
// chưa công khai cho Google. /kidbook vẫn là funnel sống, không bị đụng.
// Mode: Hạt Mầm warm publication, light-led (token v1.1 ghi đè phần màu của V3).
// 18 section tổ chức thành 7 "căn phòng":
//   Phòng 1 — Cửa vào (S1 Hero + S2 Khoảng lặng — dark silence duy nhất giữa trang)
//   Phòng 2 — Nỗi lòng của ba mẹ (S3)
//   Phòng 3 — Hiểu sản phẩm (S4 là gì + S5 ba mùa + S6 vì sao 0–7)
//   Phòng 4 — Bên trong ấn phẩm (S7 năm chương + S8 preview + S9 cách đọc)
//   Phòng 5 — Con người & quy trình (S10 Kenji + S11 quy trình)
//   Phòng 6 — Quyết định (S12 hai gói + S13 phản hồi [ẩn] + S14 FAQ + S15 phù hợp)
//   Phòng 7 — Cửa ra (S16 trên 7 tuổi + S17 CTA cuối + S18 cánh cửa sau + Footer signature)
// Copy: NGUYÊN VĂN docs/product/landing-hat-mam-v3-copy.md — không tự viết.
// Route live /kidbook giữ nguyên, không đụng (Migration Strategy — Phase 0 audit).
// Nút vàng đầy: 3 (Hero, Gói 1, CTA cuối) — mỗi viewport một.
// ============================================================
export default function LandingHatMamPage() {
  useLandingReveal();

  return (
    <>
      <SEO
        title="Ấn phẩm Bản Sắc Hạt Mầm — Bản Sắc Của Con | Kenji Phạm (Bản nháp)"
        description="Ấn phẩm cá nhân hóa cho bé 0–7 tuổi — nhịp điệu riêng, cảm xúc đầu đời và hạt mầm tài năng của con. Không dán nhãn, không dự đoán số phận."
        image="/og-image.png"
        url="https://coachkenjipham.com/an-pham-ban-sac-hat-mam"
      />

      <Head>
        <meta name="robots" content="noindex" />
        {/* Product schema (docs/website/master-plan/03 mục 6: Product + FAQPage).
            Không aggregateRating — chưa có review thật được phép dùng. */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Product",
              name: "Ấn phẩm Bản Sắc Hạt Mầm",
              description:
                "Ấn phẩm cá nhân hóa dành cho bé 0–7 tuổi, thuộc dòng Bản Sắc Của Con — khoảng 30 trang, 5 chương, viết riêng cho từng bé.",
              brand: { "@type": "Brand", name: "Essence Coaching" },
              url: "https://coachkenjipham.com/an-pham-ban-sac-hat-mam",
              offers: [
                {
                  "@type": "Offer",
                  name: "Gói 1 — Ấn phẩm Bản Sắc",
                  price: "2000000",
                  priceCurrency: "VND",
                  availability: "https://schema.org/InStock",
                  url: "https://coachkenjipham.com/an-pham-ban-sac-hat-mam#hai-goi",
                },
                {
                  "@type": "Offer",
                  name: "Gói 2 — Trò Chuyện Cùng Kenji",
                  price: "3500000",
                  priceCurrency: "VND",
                  availability: "https://schema.org/InStock",
                  url: "https://coachkenjipham.com/an-pham-ban-sac-hat-mam#hai-goi",
                },
              ],
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
        <Room1Entrance />
        <Room2Heart />
        <Room3Product />
        <Room4Inside />
        <Room5KenjiProcess />
        <Room6Decision />
        <Room7Doors />
      </main>
    </>
  );
}
