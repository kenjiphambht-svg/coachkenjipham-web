import { useState, FormEvent } from "react";
import Image from "next/image";
import { LINE_STATUS, GIAO_MUA_PRICING } from "@/config/giaoMuaLaunch";

// ============================================================
// PHÒNG 6 — KENJI & GÓI. Tái dùng pattern "S10 Kenji là ai" +
// "S12 hai gói" (Hạt Mầm) — cùng cách đã dùng cho
// Room5KenjiPackagesKP.tsx (Khám Phá). Copy NGUYÊN VĂN theo task.
//
// ⚠️ ĐOẠN KENJI CHƯA CÓ: task ghi "[KENJI VIẾT — 3-4 câu quan sát 10
// năm về tuổi giao mùa...]" — Kenji CHƯA điền đoạn này khi gửi task.
// Không tự bịa giọng Kenji — để khối placeholder rõ ràng.
//
// LINE_STATUS (src/config/giaoMuaLaunch.ts) điều khiển khối giá + CTA
// gói mà KHÔNG cần sửa layout — cùng cơ chế đã dùng cho Khám Phá.
// ============================================================
export default function Room5KenjiPackagesGM() {
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState(""); // honeypot
  const [showError, setShowError] = useState(false);
  const [registered, setRegistered] = useState(false);

  const isPreview = LINE_STATUS === "preview";

  const handleRegister = (e: FormEvent) => {
    e.preventDefault();
    if (email.trim() === "") {
      setShowError(true);
      return;
    }
    const isBot = company.trim() !== "";
    if (!isBot) {
      const subject = "Ghi danh sớm — Bản Sắc Giao Mùa";
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
      {/* --- KENJI LÀ AI --- */}
      <section className="bg-e26-cream px-6 py-16 md:py-32">
        <div className="max-w-[1040px] mx-auto">
          <div className="grid md:grid-cols-12 gap-10 md:gap-16 items-start">
            <figure className="hm-reveal md:col-span-4">
              <div className="relative w-full aspect-[4/5] overflow-hidden">
                <Image
                  src="/klp.jpg"
                  alt="Kenji Phạm — Essence Coach"
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover"
                />
              </div>
              <figcaption className="font-sans text-sm text-e26-text-2 pt-3 pb-3 border-b border-e26-border">
                Kenji Phạm — Essence Coach
              </figcaption>
            </figure>

            <div className="md:col-span-8 max-w-[620px]">
              <h2 className="hm-reveal font-serif font-normal text-[28px] md:text-[38px] leading-tight text-e26-text mb-8">
                Người viết cuốn sách của con
              </h2>

              <div className="hm-reveal border border-e26-border bg-e26-white p-6 mb-8">
                <p className="font-sans text-[15px] leading-[1.7] text-e26-text-2">
                  [KENJI VIẾT — chờ 3-4 câu quan sát 10 năm về tuổi giao mùa: điều gì anh hay
                  thấy lặp lại giữa ba mẹ và con tuổi teen, điều gì anh ước ba mẹ hiểu sớm hơn về
                  khoảng cách đúng. Chưa có nội dung — không tự soạn thay Kenji.]
                </p>
              </div>

              <div className="hm-reveal border-t border-e26-border pt-8">
                <p className="font-sans text-[15px] leading-[1.7] text-e26-text-2">
                  Vì mỗi ấn phẩm cần được đọc, phân tích, viết lại và biên tập như một bản chân
                  dung riêng, Kenji chỉ nhận tối đa{" "}
                  <span className="font-medium text-e26-text">10 ấn phẩm mỗi tháng</span> để giữ
                  chất lượng từng bản.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- HAI CÁCH ĐỒNG HÀNH --- */}
      <section className="bg-e26-ivory px-6 py-16 md:py-32">
        <div className="max-w-[1040px] mx-auto">
          <h2 className="hm-reveal font-serif font-normal text-[28px] md:text-[38px] leading-tight text-e26-text mb-14 max-w-[720px]">
            Hai cách đồng hành
          </h2>

          <div className="grid md:grid-cols-2 gap-10 md:gap-8 mb-14">
            {/* Gói 1 */}
            <div className="hm-reveal bg-e26-white border border-e26-border p-8 md:p-10 flex flex-col">
              <h3 className="font-serif text-2xl text-e26-text mb-4">
                {GIAO_MUA_PRICING.goi1.name}
              </h3>
              <p className="font-sans text-[15px] leading-[1.65] text-e26-text-2 mb-6 flex-1">
                Ấn phẩm Giao Mùa đầy đủ.
              </p>
              <p className="font-serif text-2xl text-e26-text mb-6">
                {isPreview ? "Giá công bố khi mở cửa" : GIAO_MUA_PRICING.goi1.priceDisplay}
              </p>
              {isPreview ? (
                <a
                  href="#ghi-danh"
                  className="mt-auto inline-block text-center border border-e26-text text-e26-text rounded-none font-sans font-medium text-[13px] tracking-[0.08em] uppercase px-9 py-4 hover:border-e26-gold-deep hover:text-e26-gold-deep transition-colors duration-300"
                >
                  Ghi danh sớm
                </a>
              ) : (
                <a
                  href={GIAO_MUA_PRICING.goi1.formUrl}
                  className="mt-auto inline-block text-center bg-e26-gold text-e26-black rounded-none font-sans font-medium text-[13px] tracking-[0.08em] uppercase px-9 py-4 hover:bg-e26-gold-deep hover:text-e26-ivory transition-colors duration-300"
                >
                  Tôi muốn nhận ấn phẩm
                </a>
              )}
            </div>

            {/* Gói 2 */}
            <div className="hm-reveal hm-d1 bg-e26-white border border-e26-border p-8 md:p-10 flex flex-col">
              <h3 className="font-serif text-2xl text-e26-text mb-4">
                {GIAO_MUA_PRICING.goi2.name}
              </h3>
              <p className="font-sans text-[15px] leading-[1.65] text-e26-text-2 mb-6 flex-1">
                Ấn phẩm + 45 phút trò chuyện riêng (ba mẹ, hoặc ba mẹ cùng con nếu con muốn).
              </p>
              <p className="font-serif text-2xl text-e26-text mb-6">
                {isPreview ? "Giá công bố khi mở cửa" : GIAO_MUA_PRICING.goi2.priceDisplay}
              </p>
              {isPreview ? (
                <a
                  href="#ghi-danh"
                  className="mt-auto inline-block text-center border border-e26-text text-e26-text rounded-none font-sans font-medium text-[13px] tracking-[0.08em] uppercase px-9 py-4 hover:border-e26-gold-deep hover:text-e26-gold-deep transition-colors duration-300"
                >
                  Ghi danh sớm
                </a>
              ) : (
                <a
                  href={GIAO_MUA_PRICING.goi2.formUrl}
                  className="mt-auto inline-block text-center bg-e26-gold text-e26-black rounded-none font-sans font-medium text-[13px] tracking-[0.08em] uppercase px-9 py-4 hover:bg-e26-gold-deep hover:text-e26-ivory transition-colors duration-300"
                >
                  Tôi muốn Kenji cùng đọc với mình
                </a>
              )}
            </div>
          </div>

          {/* Form ghi danh sớm — chỉ hiện ở trạng thái preview */}
          {isPreview && (
            <div id="ghi-danh" className="bg-e26-cream border border-e26-border p-8 md:p-10 max-w-[560px] scroll-mt-10">
              <p className="font-serif text-xl text-e26-text mb-6">
                Ghi danh sớm — nhận tin đầu tiên khi mở cửa
              </p>
              {registered ? (
                <p className="font-serif text-lg text-e26-text">
                  Cảm ơn ba mẹ đã ghi danh. Kenji sẽ báo ngay khi ấn phẩm mở cửa.
                </p>
              ) : (
                <form onSubmit={handleRegister} noValidate>
                  <label htmlFor="reg-email" className="sr-only">
                    Email ghi danh sớm
                  </label>
                  <input
                    id="reg-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email của ba mẹ"
                    className={`${inputCls} mb-3`}
                  />
                  {showError && (
                    <p className="font-sans text-[13px] text-e26-gold-deep mb-3">
                      Cho Kenji một email để báo ba mẹ khi mở cửa nhé.
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
          )}
        </div>
      </section>
    </>
  );
}
