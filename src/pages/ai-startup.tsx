import { SEO } from "@/components/SEO";
import Head from "next/head";
import Room1Hero from "@/components/ai-startup/Room1Hero";
import Room2ProblemProduct from "@/components/ai-startup/Room2ProblemProduct";
import Room3Technology from "@/components/ai-startup/Room3Technology";
import Room4Safety from "@/components/ai-startup/Room4Safety";
import Room5ModulesUsers from "@/components/ai-startup/Room5ModulesUsers";
import Room6BusinessReadiness from "@/components/ai-startup/Room6BusinessReadiness";
import Room7ClosingAccess from "@/components/ai-startup/Room7ClosingAccess";
import { useAiStartupReveal } from "@/components/ai-startup/useAiStartupReveal";

// ============================================================
// /ai-startup — AI Startup Dossier. Khung kỹ thuật dựng lại theo Design System
// v1.1 (light-led, dark ≤25%, token --essence-*-2026), tổ chức 7 "phòng":
//   Phòng 1 — Cửa vào (Nav + Hero)
//   Phòng 2 — Vấn đề & Sản phẩm
//   Phòng 3 — Công nghệ
//   Phòng 4 — An toàn (dark silence DUY NHẤT toàn trang)
//   Phòng 5 — Sản phẩm sớm & người dùng mục tiêu
//   Phòng 6 — Kinh doanh & sẵn sàng
//   Phòng 7 — Cửa ra (Roadmap + Early Access form + Closing CTA + Footer)
// TOÀN BỘ chữ giữ nguyên văn 100% theo docs/product/ai-startup-noi-dung-cu.md —
// không viết thêm, không xóa, không diễn giải lại. Xem phiếu báo cáo cho các
// điểm nội dung cũ không khớp khung 7 phòng.
// Route policy (docs/website/master-plan/02): giữ, hạ xuống footer — KHÔNG là
// CTA cho phụ huynh. Trang này không được link từ đâu trong site, giữ nguyên.
// ============================================================
export default function AIStartupDossier() {
  useAiStartupReveal();

  return (
    <>
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              name: "Essence Coaching Personal Psychology Engine",
              applicationCategory: "BusinessApplication",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "USD",
              },
              operatingSystem: "Web",
              description:
                "Multi-agent Personal Psychology Engine for self-awareness, emotional regulation, and action planning",
              author: {
                "@type": "Person",
                name: "Kenji Phạm",
                jobTitle: "Essence Coach",
              },
              publisher: {
                "@type": "Organization",
                name: "Essence Coaching",
                url: "https://coachkenjipham.com",
                contactPoint: {
                  "@type": "ContactPoint",
                  email: "contact@coachkenjipham.com",
                  contactType: "Customer Service",
                },
              },
            }),
          }}
        />
      </Head>

      <SEO
        title="Essence Coaching AI Startup Dossier | Kenji Phạm"
        description="Essence Coaching is building a multi-agent Personal Psychology Engine for self-awareness, emotional regulation, and action planning — founded by Kenji Phạm in Vietnam."
        image="/og-image.png"
      />

      <main className="bg-e26-ivory">
        <Room1Hero />
        <Room2ProblemProduct />
        <Room3Technology />
        <Room4Safety />
        <Room5ModulesUsers />
        <Room6BusinessReadiness />
        <Room7ClosingAccess />
      </main>
    </>
  );
}
