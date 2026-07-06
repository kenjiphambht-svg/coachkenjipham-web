import Link from "next/link";
import ImageSlot from "./ImageSlot";

// Section 5 — Bản Sắc Hạt Mầm: cửa active chính. Nền cream publication.
// Heading + kicker căn trái; nội dung 7/12, slot ảnh 4:5 bên phải 5/12.
// Số section ma "05" Cormorant ~200px, opacity 6%, góc trái trên, sau nội dung.
// NÚT VÀNG DUY NHẤT CỦA TRANG — 0px radius, 16×36, chữ 13px uppercase.
// CTA tạm trỏ /kidbook (live funnel) cho đến khi landing mới sẵn sàng + Kenji duyệt migration.
// Ngôn ngữ trẻ em theo docs/brand/CHILD_LANGUAGE_RULES.md: không gán nhãn,
// không dự đoán tương lai, không bắt con gánh cảm xúc gia đình.
export default function HatMamSection() {
  return (
    <section id="hat-mam" className="bg-e26-cream px-6 py-16 md:py-32 scroll-mt-10">
      <div className="max-w-[1120px] mx-auto relative">
        <span
          className="hidden md:block absolute -top-10 left-0 font-serif font-light text-[200px] leading-none text-e26-black opacity-[0.06] select-none pointer-events-none"
          aria-hidden="true"
        >
          05
        </span>

        <div className="relative grid md:grid-cols-12 gap-10 md:gap-16 items-start">
          {/* --- Nội dung 7/12 --- */}
          <div className="md:col-span-7">
            <p className="e26-reveal font-sans text-xs tracking-[0.08em] uppercase text-e26-gold-deep mb-5">
              Đang mở
            </p>
            <h2 className="e26-reveal font-serif font-normal text-[28px] md:text-[40px] leading-tight text-e26-text mb-3">
              Ấn phẩm Bản Sắc Hạt Mầm
            </h2>
            <p className="e26-reveal font-sans text-[15px] text-e26-text-2 mb-8">
              Dành cho ba mẹ có con 0–6 tuổi.
            </p>

            <p className="e26-reveal font-sans text-[17px] leading-[1.65] text-e26-text-2 max-w-xl mb-6">
              Có những ngày ba mẹ nhìn con mà bối rối — thương rất nhiều, nhưng chưa hiểu
              con đang cần gì. Ấn phẩm này là một cửa sổ quan sát mềm hơn: viết riêng cho
              từng bé, về khí chất, nhịp cảm xúc và cách con thấy an toàn.
            </p>

            <ul className="e26-reveal space-y-2 font-sans text-[15px] leading-[1.6] text-e26-text-2 mb-6">
              <li>Không gán nhãn con.</li>
              <li>Không dự đoán tương lai của con.</li>
              <li>Không bắt con gánh cảm xúc của gia đình.</li>
            </ul>

            <p className="e26-reveal font-sans text-[15px] leading-[1.6] text-e26-text-2 mb-10">
              Mỗi bản đều do Kenji viết và đích thân duyệt trước khi gửi đến ba mẹ.
            </p>

            <div className="e26-reveal">
              <Link
                href="/kidbook"
                className="inline-block bg-e26-gold text-e26-black rounded-none font-sans font-medium text-[13px] tracking-[0.08em] uppercase px-9 py-4 hover:bg-e26-gold-deep hover:text-e26-ivory transition-colors duration-300"
              >
                Tìm hiểu ấn phẩm Hạt Mầm
              </Link>
            </div>
          </div>

          {/* --- Slot ảnh ấn phẩm 5/12 (fallback cream + hairline vàng) --- */}
          <div className="e26-reveal md:col-span-5">
            <ImageSlot ratio="4/5" />
          </div>
        </div>
      </div>
    </section>
  );
}
