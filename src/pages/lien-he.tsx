import { useState, FormEvent } from "react";
import Head from "next/head";
import Link from "next/link";
import { SEO } from "@/components/SEO";
import HomeHeader from "@/components/homepage/HomeHeader";
import HomeFooter from "@/components/homepage/HomeFooter";

// ============================================================
// /lien-he — noindex (chờ Kenji duyệt). Theo brief: "một cửa rõ, không
// rào cản". Copy NGUYÊN VĂN theo task.
//
// KÊNH GỬI FORM: repo KHÔNG có backend nhận form thật (chỉ có
// src/pages/api/hello.ts stub — không phải API thật). Giải pháp đơn giản
// nhất đang có sẵn trong repo là mailto (đúng pattern đã dùng ở
// /lang-90/xac-nhan.tsx) — submit sẽ build 1 mailto: link từ 3 trường
// và mở app mail của người dùng, đồng thời hiện thông báo cảm ơn ngay
// (không phụ thuộc mail client có mở được hay không).
// ⚠️ CẦN HỎI KENJI: nếu muốn form gửi thẳng vào hộp thư mà KHÔNG cần
// người dùng tự bấm gửi trên app mail của họ (trải nghiệm mượt hơn),
// cần một dịch vụ nhận form nhẹ (vd Web3Forms/Formspree) hoặc API route
// tự viết + SMTP — cả hai đều cần thêm tài khoản/API key bên ngoài, nên
// chưa tự làm mà không hỏi trước (đúng luật "không thêm dependency khi
// chưa được duyệt").
// Honeypot: trường ẩn "company" — bot thường tự điền mọi input thấy
// được trong DOM, người thật không thấy nó nên luôn để trống. Có giá
// trị: coi là bot, không mở mailto, nhưng vẫn hiện lời cảm ơn (không lộ
// cho bot biết đã bị chặn).
// ============================================================
export default function LienHePage() {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [message, setMessage] = useState("");
  const [company, setCompany] = useState(""); // honeypot — người thật không điền
  const [showErrors, setShowErrors] = useState(false);
  const [sent, setSent] = useState(false);

  const valid = name.trim() !== "" && contact.trim() !== "" && message.trim() !== "";

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!valid) {
      setShowErrors(true);
      return;
    }
    const isBot = company.trim() !== "";
    if (!isBot) {
      const subject = `Liên hệ từ ${name}`;
      const body = [`Tên: ${name}`, `Liên hệ: ${contact}`, ``, message].join("\n");
      window.location.href = `mailto:kenjipham.bht@gmail.com?subject=${encodeURIComponent(
        subject
      )}&body=${encodeURIComponent(body)}`;
    }
    setSent(true);
  };

  const labelCls = "block font-sans text-[15px] text-e26-text mb-2";
  const inputCls =
    "w-full px-4 py-3 border border-e26-border bg-e26-white font-sans text-[15px] focus:outline-none focus:border-e26-gold-deep transition-colors";

  return (
    <>
      <SEO
        title="Liên hệ — Kenji Phạm (Bản nháp)"
        description="Có điều gì bạn muốn hỏi trước không? Không cần trịnh trọng — viết đúng điều bạn đang băn khoăn."
        url="https://coachkenjipham.com/lien-he"
      />
      <Head>
        <meta name="robots" content="noindex" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ContactPage",
              name: "Liên hệ — Kenji Phạm",
              url: "https://coachkenjipham.com/lien-he",
            }),
          }}
        />
      </Head>

      <HomeHeader />
      <main className="bg-e26-ivory min-h-[70vh]">
        {/* 1 — HERO */}
        <section className="max-w-[720px] mx-auto px-6 pt-16 pb-12 md:pt-24 md:pb-16">
          <h1 className="font-serif font-light text-[32px] md:text-[44px] leading-[1.2] text-e26-text max-w-lg">
            Có điều gì bạn muốn hỏi trước không?
          </h1>
          <p className="font-sans text-[17px] leading-[1.65] text-e26-text-2 mt-6 max-w-xl">
            Không cần trịnh trọng. Viết đúng điều bạn đang băn khoăn — tôi đọc và phản hồi khi
            có thể.
          </p>
        </section>

        {/* 2 — KÊNH LIÊN HỆ CHÍNH */}
        <section className="bg-e26-white">
          <div className="max-w-[720px] mx-auto px-6 py-12">
            <div className="space-y-3 font-sans text-[16px] text-e26-text">
              <p>
                Email:{" "}
                <a
                  href="mailto:kenjipham.bht@gmail.com"
                  className="underline underline-offset-4 decoration-e26-border hover:text-e26-gold-deep hover:decoration-e26-gold transition-colors duration-300"
                >
                  kenjipham.bht@gmail.com
                </a>
              </p>
              <p>
                Zalo / Messenger:{" "}
                <a
                  href="https://www.facebook.com/coachkenjipham"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-4 decoration-e26-border hover:text-e26-gold-deep hover:decoration-e26-gold transition-colors duration-300"
                >
                  facebook.com/coachkenjipham
                </a>
              </p>
            </div>
          </div>
        </section>

        {/* 3 — FORM TỐI GIẢN */}
        <section className="bg-e26-cream px-6 py-16 md:py-20">
          <div className="max-w-[560px] mx-auto">
            {sent ? (
              <p className="font-serif text-xl text-e26-text">
                Cảm ơn bạn. Tôi sẽ đọc và phản hồi khi có thể.
              </p>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="space-y-6">
                <div>
                  <label htmlFor="name" className={labelCls}>
                    Tên (hoặc cách bạn muốn được gọi)
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={inputCls}
                  />
                  {showErrors && name.trim() === "" && (
                    <p className="font-sans text-[13px] text-e26-gold-deep mt-1">
                      Cho tôi biết tên gọi nhé.
                    </p>
                  )}
                </div>
                <div>
                  <label htmlFor="contact" className={labelCls}>
                    Email hoặc số điện thoại
                  </label>
                  <input
                    id="contact"
                    type="text"
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    className={inputCls}
                  />
                  {showErrors && contact.trim() === "" && (
                    <p className="font-sans text-[13px] text-e26-gold-deep mt-1">
                      Cho tôi một cách liên hệ nhé.
                    </p>
                  )}
                </div>
                <div>
                  <label htmlFor="message" className={labelCls}>
                    Lời nhắn
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className={`${inputCls} resize-none`}
                  />
                  {showErrors && message.trim() === "" && (
                    <p className="font-sans text-[13px] text-e26-gold-deep mt-1">
                      Viết giúp tôi một dòng nhé.
                    </p>
                  )}
                </div>

                {/* Honeypot — ẩn khỏi người thật, bot thường tự điền */}
                <div aria-hidden="true" style={{ position: "absolute", left: "-9999px", width: 1, height: 1, overflow: "hidden" }}>
                  <label htmlFor="company">Company</label>
                  <input
                    id="company"
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-e26-gold text-e26-black rounded-none font-sans font-medium text-[13px] tracking-[0.08em] uppercase py-4 hover:bg-e26-gold-deep hover:text-e26-ivory transition-colors duration-300"
                >
                  Gửi lời nhắn
                </button>
              </form>
            )}
          </div>
        </section>

        {/* 4 — DÒNG TRẤN AN NHẸ */}
        <section className="max-w-[720px] mx-auto px-6 py-10">
          <p className="font-sans text-[13px] leading-[1.7] text-e26-text-2 max-w-xl">
            Mọi điều bạn nhắn được giữ kín. Nếu bạn đang trong một tình huống khẩn cấp về sức
            khỏe tinh thần, xin liên hệ chuyên gia tâm lý lâm sàng hoặc đường dây hỗ trợ phù hợp
            — đó là nơi có thể giúp bạn nhanh và đúng hơn.
          </p>
        </section>

        {/* 5 — Hợp tác & đầu tư: giữ lối vào /ai-startup sau khi link Dossier
            bị bỏ khỏi HomeFooter.tsx (theo BRIEF-CLAUDE-CODE-trang-chu-CHOT.md).
            Nhỏ, cuối trang, không phải khối nổi bật. */}
        <div className="max-w-[720px] mx-auto px-6 mt-12 pt-8 border-t border-e26-border text-center">
          <p className="font-sans text-sm text-e26-text-2">
            Dành cho đối tác &amp; nhà tài trợ —{" "}
            <Link
              href="/ai-startup"
              className="underline underline-offset-4 decoration-e26-border hover:text-e26-gold-deep hover:decoration-e26-gold transition-colors duration-300"
            >
              Essence AI Startup Dossier
            </Link>
          </p>
        </div>
      </main>
      <HomeFooter />
    </>
  );
}
