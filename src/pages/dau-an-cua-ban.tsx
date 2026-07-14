import { useState, FormEvent } from "react";
import Head from "next/head";
import { SEO } from "@/components/SEO";
import HomeHeader from "@/components/homepage/HomeHeader";
import HomeFooter from "@/components/homepage/HomeFooter";

// ============================================================
// /dau-an-cua-ban — ấn phẩm "Dấu Ấn Của Bạn". TRẠNG THÁI: PREVIEW
// (chưa mở bán, chưa hiện giá). Noindex, không có trong nav chính — chỉ
// vào được từ hub /ban-sac-cua-ban (đã gắn link thẻ 2 ở đó cùng lượt này).
//
// THIẾT KẾ: sắc độ trắng/ivory sạch nhất hệ theo đúng chỉ thị — CHỈ dùng
// bg-e26-ivory/bg-e26-white xen kẽ (không cream, không khối màu nhấn
// ngoài 1 nút vàng), không border-accent trang trí — gần đơn sắc, khác
// hẳn /ban-la-duy-nhat (page preview song song, có nhiều điểm nhấn hơn).
//
// GHI CHÚ MINH BẠCH:
// - FAQ "Online hay trực tiếp?": task chỉ liệt kê câu hỏi, không kèm
//   câu trả lời — để placeholder, không tự soạn đáp án cho trang bán.
// - "Ghi danh sớm": không có backend thu email thật, dùng mailto — cùng
//   hạn chế đã nêu ở /lien-he và /ban-la-duy-nhat.
// - Schema Product: không kèm "offers"/"price" — đúng yêu cầu preview.
// ============================================================
export default function DauAnCuaBanPage() {
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState(""); // honeypot
  const [showError, setShowError] = useState(false);
  const [registered, setRegistered] = useState(false);

  const handleRegister = (e: FormEvent) => {
    e.preventDefault();
    if (email.trim() === "") {
      setShowError(true);
      return;
    }
    const isBot = company.trim() !== "";
    if (!isBot) {
      const subject = "Ghi danh sớm — Dấu Ấn Của Bạn";
      const body = `Email ghi danh: ${email}`;
      window.location.href = `mailto:kenjipham.bht@gmail.com?subject=${encodeURIComponent(
        subject
      )}&body=${encodeURIComponent(body)}`;
    }
    setRegistered(true);
  };

  const inputCls =
    "w-full px-4 py-3 border border-e26-border bg-e26-white font-sans text-[15px] focus:outline-none focus:border-e26-gold-deep transition-colors";

  return (
    <>
      <SEO
        title="Dấu Ấn Của Bạn — phiên 150 phút + bản phân tích hai lớp (Preview, Bản nháp)"
        description="150 phút trò chuyện riêng với Kenji, và một bản viết hai lớp về điều đang thật sự vận hành phía dưới những gì bạn đã học. Sắp mở."
        url="https://coachkenjipham.com/dau-an-cua-ban"
      />
      <Head>
        <meta name="robots" content="noindex" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Product",
              name: "Dấu Ấn Của Bạn",
              description:
                "Phiên 150 phút trò chuyện riêng với Kenji, cùng một bản viết hai lớp về điều đang thật sự vận hành phía dưới những gì bạn đã học.",
              brand: { "@type": "Organization", name: "Essence Coaching System" },
            }),
          }}
        />
      </Head>

      <HomeHeader />
      <main className="bg-e26-ivory">
        {/* PHÒNG 1 — HERO */}
        <section className="bg-e26-ivory max-w-[720px] mx-auto px-6 pt-16 pb-20 md:pt-24 md:pb-28">
          <p className="font-sans text-sm text-e26-text-2">
            Bản Sắc Của Bạn · phiên 150 phút + bản phân tích hai lớp
          </p>
          <h1 className="font-serif font-light text-[32px] md:text-[44px] leading-[1.25] text-e26-text mt-4 max-w-lg">
            Bạn đã học đủ nhiều về chính mình. Có lẽ vấn đề không phải thiếu kiến thức.
          </h1>
          <p className="font-sans text-[17px] leading-[1.65] text-e26-text-2 mt-8 max-w-xl">
            Dấu Ấn Của Bạn là 150 phút trò chuyện riêng với Kenji — không thêm một hệ thống mới
            nào vào đầu bạn — và một bản viết hai lớp về điều đang thật sự vận hành phía dưới
            những gì bạn đã học.
          </p>
          <div className="flex flex-wrap items-center gap-x-8 gap-y-4 mt-10">
            <a
              href="#cach-lam-viec"
              className="font-sans text-[15px] text-e26-text underline underline-offset-4 decoration-e26-border hover:text-e26-gold-deep hover:decoration-e26-gold transition-colors duration-300"
            >
              Xem cách nó làm việc
            </a>
            <a
              href="#ghi-danh"
              className="inline-block border border-e26-text text-e26-text font-sans font-medium text-[13px] tracking-[0.08em] uppercase px-8 py-3.5 hover:border-e26-gold-deep hover:text-e26-gold-deep transition-colors duration-300"
            >
              Ghi danh sớm
            </a>
          </div>
        </section>

        {/* PHÒNG 2 — KHOẢNG LẶNG */}
        <section className="bg-e26-white px-6 py-24 md:py-40">
          <div className="max-w-[640px] mx-auto text-center">
            <p className="font-serif italic text-2xl md:text-3xl leading-[1.5] text-e26-text">
              &ldquo;Khi bạn đã có quá nhiều bản đồ, thứ bạn cần không phải thêm một tấm nữa. Là
              một người ngồi xuống cùng bạn xem bạn đang đứng ở đâu.&rdquo;
            </p>
          </div>
        </section>

        {/* PHÒNG 3 — CÓ THỂ BẠN ĐANG Ở ĐÂY */}
        <section className="bg-e26-ivory max-w-[720px] mx-auto px-6 py-16 md:py-24">
          <h2 className="font-serif font-normal text-[26px] md:text-[34px] text-e26-text mb-10">
            Có thể bạn đang ở đây
          </h2>
          <ul className="space-y-6 font-sans text-[17px] leading-[1.65] text-e26-text-2">
            <li className="border-t border-e26-border pt-6">
              Bạn đã qua các khóa, các thầy, các hệ thống — mỗi thứ đúng một ít, và bạn rối hơn
              trước.
            </li>
            <li className="border-t border-e26-border pt-6">
              Bạn bắt đầu nghi ngờ cả những điều từng giúp mình.
            </li>
            <li className="border-t border-e26-border pt-6">
              Bạn không muốn được truyền cảm hứng nữa. Bạn muốn được nhìn thẳng.
            </li>
          </ul>
        </section>

        {/* PHÒNG 4 — CÁCH NÓ LÀM VIỆC (Là / Không là) */}
        <section id="cach-lam-viec" className="bg-e26-white px-6 py-16 md:py-24 scroll-mt-10">
          <div className="max-w-[720px] mx-auto">
            <h2 className="font-serif font-normal text-[26px] md:text-[34px] text-e26-text mb-10">
              Cách nó làm việc
            </h2>
            <div className="space-y-8">
              <div>
                <p className="font-sans text-xs tracking-[0.08em] uppercase text-e26-text-2 mb-3">
                  Là
                </p>
                <p className="font-sans text-[17px] leading-[1.7] text-e26-text-2 max-w-xl">
                  Một phiên 150 phút — bạn nói, Kenji hỏi, không giảng bài. Sau phiên, bạn nhận
                  ấn phẩm Dấu Ấn Của Bạn: hai lớp nhìn (lớp tính cách đang vận hành, và dòng
                  chảy sâu hơn phía dưới), những gì đã mở ra trong chính buổi nói chuyện, một
                  bảng &ldquo;ngôn ngữ mới cho chuyện cũ&rdquo;, và giao thức 14 ngày — kèm một
                  lời dặn quan trọng: ngưng nạp thêm khung mới trong 30 ngày. Giao qua phòng đọc
                  riêng + PDF A5, Kenji duyệt từng trang.
                </p>
              </div>
              <div>
                <p className="font-sans text-xs tracking-[0.08em] uppercase text-e26-text-2 mb-3">
                  Không là
                </p>
                <p className="font-sans text-[17px] leading-[1.7] text-e26-text-2 max-w-xl">
                  Không phải một hệ thống mới để bạn học; không nghi lễ, không &ldquo;khai
                  mở&rdquo;, không hứa bừng tỉnh; không trị liệu; không bán tiếp gì trong phiên.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* PHÒNG 5 — QUY TRÌNH & RIÊNG TƯ */}
        <section className="bg-e26-ivory max-w-[720px] mx-auto px-6 py-16 md:py-24">
          <h2 className="font-serif font-normal text-[26px] md:text-[34px] text-e26-text mb-8">
            Quy trình & riêng tư
          </h2>
          <p className="font-serif text-xl leading-snug text-e26-text mb-8 max-w-xl">
            Phiếu → hẹn phiên → phiên 150&apos; → ấn phẩm trong 7 ngày → hẹn nhìn lại ngày 30.
          </p>
          <p className="font-sans text-[16px] leading-[1.7] text-e26-text-2 max-w-xl">
            Dữ liệu chỉ dùng cho bản của bạn, không công khai, không huấn luyện AI, xóa theo yêu
            cầu.
          </p>
        </section>

        {/* PHÒNG 6 — GIÁ (preview) */}
        <section id="ghi-danh" className="bg-e26-white px-6 py-16 md:py-24 text-center scroll-mt-10">
          <div className="max-w-[560px] mx-auto">
            <p className="font-serif text-2xl md:text-3xl text-e26-text mb-10">
              Giá công bố khi mở cửa
            </p>
            {registered ? (
              <p className="font-serif text-xl text-e26-text">
                Cảm ơn bạn đã ghi danh. Tôi sẽ báo khi ấn phẩm mở cửa.
              </p>
            ) : (
              <form onSubmit={handleRegister} noValidate className="max-w-sm mx-auto">
                <label htmlFor="reg-email" className="sr-only">
                  Email ghi danh sớm
                </label>
                <input
                  id="reg-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email của bạn"
                  className={`${inputCls} mb-3`}
                />
                {showError && (
                  <p className="font-sans text-[13px] text-e26-gold-deep mb-3">
                    Cho tôi một email để báo bạn khi mở cửa nhé.
                  </p>
                )}
                {/* Honeypot — ẩn khỏi người thật */}
                <div
                  aria-hidden="true"
                  style={{ position: "absolute", left: "-9999px", width: 1, height: 1, overflow: "hidden" }}
                >
                  <label htmlFor="reg-company">Company</label>
                  <input
                    id="reg-company"
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
                  Ghi danh sớm
                </button>
              </form>
            )}
          </div>
        </section>

        {/* PHÒNG 7 — FAQ + CTA */}
        <section className="bg-e26-ivory max-w-[720px] mx-auto px-6 py-16 md:py-24">
          <h2 className="font-serif font-normal text-[26px] md:text-[34px] text-e26-text mb-10">
            Vài câu hỏi thật
          </h2>
          <div className="space-y-8">
            <div className="border-t border-e26-border pt-6">
              <p className="font-serif text-xl text-e26-text mb-2">
                Khác Bạn Là Duy Nhất chỗ nào?
              </p>
              <p className="font-sans text-[16px] leading-[1.7] text-e26-text-2">
                Có phiên 1:1 và bản viết từ chính cuộc gặp.
              </p>
            </div>
            <div className="border-t border-e26-border pt-6">
              <p className="font-serif text-xl text-e26-text mb-2">&ldquo;Hai lớp&rdquo; nghĩa là gì?</p>
              <p className="font-sans text-[16px] leading-[1.7] text-e26-text-2">
                Hai góc nhìn về cùng một con người, không phải hai lá số để so.
              </p>
            </div>
            <div className="border-t border-e26-border pt-6">
              <p className="font-serif text-xl text-e26-text mb-2">
                Có cần tin vào công cụ nào không?
              </p>
              <p className="font-sans text-[16px] leading-[1.7] text-e26-text-2">
                Không, chỉ cần kể thật.
              </p>
            </div>
            <div className="border-t border-e26-border pt-6">
              <p className="font-serif text-xl text-e26-text mb-2">Online hay trực tiếp?</p>
              <p className="font-sans text-[15px] text-e26-text-2">
                [Câu trả lời — chờ Kenji cung cấp]
              </p>
            </div>
          </div>

          <div className="text-center mt-14">
            <a
              href="#ghi-danh"
              className="inline-block border border-e26-text text-e26-text font-sans font-medium text-[13px] tracking-[0.08em] uppercase px-8 py-3.5 hover:border-e26-gold-deep hover:text-e26-gold-deep transition-colors duration-300"
            >
              Ghi danh sớm
            </a>
          </div>

          <p className="font-serif italic text-lg text-e26-text-2 text-center mt-16">
            &ldquo;Bạn không cần thêm một câu trả lời hay. Bạn cần một câu hỏi đúng.&rdquo;
          </p>
        </section>
      </main>
      <HomeFooter />
    </>
  );
}
