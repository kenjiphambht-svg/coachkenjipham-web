import { useState, FormEvent } from "react";
import Head from "next/head";
import Link from "next/link";
import { SEO } from "@/components/SEO";
import HomeHeader from "@/components/homepage/HomeHeader";
import HomeFooter from "@/components/homepage/HomeFooter";

// ============================================================
// /ban-la-duy-nhat — ấn phẩm "Bạn Là Duy Nhất". TRẠNG THÁI: PREVIEW
// (chưa mở bán, chưa hiện giá). Noindex, không có trong nav chính — chỉ
// vào được từ hub /ban-sac-cua-ban (đã gắn link ở đó cùng lượt này).
//
// GHI CHÚ MINH BẠCH (đọc trước khi duyệt):
// 1) "5 chương tiêu biểu" (Phòng 4): task yêu cầu lấy từ
//    template-ban-la-duy-nhat — đã tìm khắp repo (`find . -iname
//    "*ban-la-duy-nhat*"`), KHÔNG tồn tại. Để placeholder rõ ràng theo
//    đúng phương án dự phòng task đã cho, không tự bịa tên chương.
// 2) Phòng 5 "nhận trong [X] ngày" — task để [X] là chỗ trống, Kenji
//    chưa cho số ngày cụ thể. Giữ nguyên dạng placeholder, không đoán số.
// 3) Phòng 7 FAQ — task chỉ cho SẴN câu trả lời cho câu hỏi "18-21 tuổi
//    tự mua được không?". 3 câu còn lại task chỉ liệt kê câu hỏi, không
//    kèm câu trả lời — để placeholder chờ Kenji viết, không tự soạn câu
//    trả lời cho một trang bán hàng thật.
// 4) Cầu nối child-safety: Giao Mùa (14–21 tuổi) CHƯA tồn tại route thật
//    trong repo nên không thể phát hiện "đến từ trang Giao Mùa" bằng
//    referrer thật. Thay vì cài logic phát hiện referrer cho một trang
//    chưa tồn tại (dễ vỡ/không kiểm chứng được), hiện dòng cầu nối
//    LUÔN LUÔN gần FAQ — an toàn hơn cho tình huống một người dưới 18
//    lỡ vào thẳng trang này mà không qua Giao Mùa.
// 5) Schema Product: bỏ hẳn "offers" (không có object Offer nào thiếu
//    giá/không hợp lệ) — đúng yêu cầu "không hiện giá ở trạng thái
//    preview", giữ Product ở mức name/description/brand.
// 6) "Ghi danh sớm": không có backend thu email thật (chỉ có
//    src/pages/api/hello.ts stub) — dùng mailto (cùng pattern đã dùng ở
//    /lien-he, /lang-90/xac-nhan.tsx). Cần hỏi Kenji nếu muốn nâng cấp
//    lên dịch vụ thu email thật (Web3Forms/Mailchimp...).
// ============================================================
export default function BanLaDuyNhatPage() {
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
      const subject = "Ghi danh sớm — Bạn Là Duy Nhất";
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
        title="Bạn Là Duy Nhất — ấn phẩm viết riêng (Preview, Bản nháp)"
        description="Một bản viết riêng về bạn — bản đồ quan sát về khí chất, kiểu gồng, vòng lặp, và mùa phát triển bạn đang đi qua. Sắp mở."
        url="https://coachkenjipham.com/ban-la-duy-nhat"
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
              name: "Bạn Là Duy Nhất",
              description:
                "Ấn phẩm viết riêng — bản đồ quan sát về khí chất, kiểu gồng, vòng lặp, và mùa phát triển bạn đang đi qua.",
              brand: { "@type": "Organization", name: "Essence Coaching System" },
            }),
          }}
        />
      </Head>

      <HomeHeader />
      <main className="bg-e26-ivory">
        {/* PHÒNG 1 — HERO */}
        <section className="max-w-[720px] mx-auto px-6 pt-16 pb-20 md:pt-24 md:pb-28">
          <p className="font-sans text-sm text-e26-text-2">Bản Sắc Của Bạn · ấn phẩm viết riêng</p>
          <h1 className="font-serif font-light text-[34px] md:text-[48px] leading-[1.2] text-e26-text mt-4 max-w-lg">
            Bạn đã làm bao nhiêu bài trắc nghiệm về mình rồi?
          </h1>
          <p className="font-sans text-[17px] leading-[1.65] text-e26-text-2 mt-8 max-w-xl">
            Và vẫn thấy thiếu một thứ: một bản viết RIÊNG về bạn — không phải một trong 16 ô,
            không phải một nhãn bốn chữ cái. Bạn Là Duy Nhất là bản đồ quan sát về khí chất,
            kiểu gồng, vòng lặp — và mùa phát triển bạn đang đi qua.
          </p>
          <div className="flex flex-wrap items-center gap-x-8 gap-y-4 mt-10">
            <a
              href="#san-pham"
              className="font-sans text-[15px] text-e26-text underline underline-offset-4 decoration-e26-border hover:text-e26-gold-deep hover:decoration-e26-gold transition-colors duration-300"
            >
              Xem bên trong có gì
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
              &ldquo;Hiểu mình không phải tìm ra câu trả lời đúng. Là ngừng trả lời bằng câu của
              người khác.&rdquo;
            </p>
          </div>
        </section>

        {/* PHÒNG 3 — CÓ THỂ BẠN ĐANG Ở ĐÂY */}
        <section className="max-w-[720px] mx-auto px-6 py-16 md:py-24">
          <h2 className="font-serif font-normal text-[26px] md:text-[34px] text-e26-text mb-10">
            Có thể bạn đang ở đây
          </h2>
          <ul className="space-y-6 font-sans text-[17px] leading-[1.65] text-e26-text-2">
            <li className="border-t border-e26-border pt-6">
              Bạn biết rõ điểm mạnh yếu trên giấy — nhưng vẫn lặp đúng một kiểu vấp, ở công việc
              mới, mối quan hệ mới.
            </li>
            <li className="border-t border-e26-border pt-6">
              Bạn đọc nhiều về tính cách, mà càng đọc càng thấy mình vừa giống mọi kiểu, vừa
              không giống kiểu nào.
            </li>
            <li className="border-t border-e26-border pt-6">
              Bạn không khủng hoảng. Bạn chỉ muốn, một lần, được nhìn mình cho tử tế.
            </li>
          </ul>
        </section>

        {/* PHÒNG 4 — SẢN PHẨM (Là / Không là) */}
        <section id="san-pham" className="bg-e26-cream px-6 py-16 md:py-24 scroll-mt-10">
          <div className="max-w-[720px] mx-auto">
            <h2 className="font-serif font-normal text-[26px] md:text-[34px] text-e26-text mb-10">
              Bên trong có gì
            </h2>
            <div className="space-y-8">
              <div>
                <p className="font-sans text-xs tracking-[0.08em] uppercase text-e26-text-2 mb-3">
                  Là
                </p>
                <p className="font-sans text-[17px] leading-[1.7] text-e26-text-2 max-w-xl">
                  Ấn phẩm ~14 chương viết riêng từ dữ liệu của bạn — cách bạn bước vào đời, cách
                  bạn thấy an toàn, kiểu gồng, cách bạn yêu và làm việc, và mùa 7 năm bạn đang đi
                  qua đang hỏi bạn điều gì. Mỗi bản do Kenji đích thân duyệt. Giao qua phòng đọc
                  riêng + PDF A5.
                </p>
              </div>
              <div>
                <p className="font-sans text-xs tracking-[0.08em] uppercase text-e26-text-2 mb-3">
                  Không là
                </p>
                <p className="font-sans text-[17px] leading-[1.7] text-e26-text-2 max-w-xl">
                  Không trắc nghiệm xếp ô; không đoán tương lai; không phán bạn hợp nghề gì, hợp
                  ai; không thay chuyên môn khi bạn thật sự cần hỗ trợ sâu.
                </p>
              </div>
              <div className="border border-e26-border bg-e26-white p-6">
                <p className="font-sans text-xs tracking-[0.08em] uppercase text-e26-text-2 mb-3">
                  5 chương tiêu biểu
                </p>
                <p className="font-sans text-[15px] leading-[1.6] text-e26-text-2">
                  [5 chương tiêu biểu — chờ template]
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* PHÒNG 5 — QUY TRÌNH & RIÊNG TƯ */}
        <section className="max-w-[720px] mx-auto px-6 py-16 md:py-24">
          <h2 className="font-serif font-normal text-[26px] md:text-[34px] text-e26-text mb-8">
            Quy trình & riêng tư
          </h2>
          <p className="font-serif text-xl leading-snug text-e26-text mb-8 max-w-xl">
            Phiếu tự điền 20 phút → Kenji soạn và duyệt → nhận trong{" "}
            <span className="text-e26-text-2">[X ngày — Kenji điền số cụ thể]</span>.
          </p>
          <p className="font-sans text-[16px] leading-[1.7] text-e26-text-2 max-w-xl">
            Dữ liệu chỉ dùng cho bản của bạn, không công khai, không huấn luyện AI, xóa theo yêu
            cầu.
          </p>
        </section>

        {/* PHÒNG 6 — GIÁ (preview) */}
        <section id="ghi-danh" className="bg-e26-cream px-6 py-16 md:py-24 text-center scroll-mt-10">
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
        <section className="max-w-[720px] mx-auto px-6 py-16 md:py-24">
          <h2 className="font-serif font-normal text-[26px] md:text-[34px] text-e26-text mb-10">
            Vài câu hỏi thật
          </h2>
          <div className="space-y-8">
            <div className="border-t border-e26-border pt-6">
              <p className="font-serif text-xl text-e26-text mb-2">Khác trắc nghiệm chỗ nào?</p>
              <p className="font-sans text-[15px] text-e26-text-2">
                [Câu trả lời — chờ Kenji cung cấp]
              </p>
            </div>
            <div className="border-t border-e26-border pt-6">
              <p className="font-serif text-xl text-e26-text mb-2">Cần thông tin gì để làm?</p>
              <p className="font-sans text-[15px] text-e26-text-2">
                [Câu trả lời — chờ Kenji cung cấp]
              </p>
            </div>
            <div className="border-t border-e26-border pt-6">
              <p className="font-serif text-xl text-e26-text mb-2">
                18–21 tuổi tự mua được không?
              </p>
              <p className="font-sans text-[16px] leading-[1.7] text-e26-text-2">
                Được, tự điền tự quyết.
              </p>
            </div>
            <div className="border-t border-e26-border pt-6">
              <p className="font-serif text-xl text-e26-text mb-2">Bao lâu nhận được?</p>
              <p className="font-sans text-[15px] text-e26-text-2">
                [Câu trả lời — chờ Kenji cung cấp]
              </p>
            </div>
          </div>

          {/* Cầu nối child-safety — luôn hiện (xem ghi chú đầu file) */}
          <p className="font-sans text-[14px] text-e26-text-2 mt-10 border-l border-e26-gold pl-4">
            Ấn phẩm cho tuổi dưới 18 được làm cùng ba mẹ —{" "}
            <Link
              href="/ban-sac-cua-con"
              className="underline underline-offset-4 decoration-e26-border hover:text-e26-gold-deep hover:decoration-e26-gold transition-colors duration-300"
            >
              xem dòng Của Con
            </Link>
            .
          </p>

          <div className="text-center mt-14">
            <a
              href="#ghi-danh"
              className="inline-block border border-e26-text text-e26-text font-sans font-medium text-[13px] tracking-[0.08em] uppercase px-8 py-3.5 hover:border-e26-gold-deep hover:text-e26-gold-deep transition-colors duration-300"
            >
              Ghi danh sớm
            </a>
          </div>

          <p className="font-serif italic text-lg text-e26-text-2 text-center mt-16">
            &ldquo;Không ai sống đời bạn giỏi hơn bạn. Bản đồ chỉ giúp bạn lái tỉnh hơn.&rdquo;
          </p>
        </section>
      </main>
      <HomeFooter />
    </>
  );
}
