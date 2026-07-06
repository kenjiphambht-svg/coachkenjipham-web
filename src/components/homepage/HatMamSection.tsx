import Link from "next/link";
import ImageSlot from "./ImageSlot";

// Section 5 — Bản Sắc Hạt Mầm: cửa active chính. Nền cream publication.
// Kicker "Đang mở" + numeral Cormorant mờ. NÚT VÀNG DUY NHẤT CỦA TRANG.
// Slot ảnh 4:5 (mockup ấn phẩm, chờ bản web-ready).
// CTA tạm trỏ /kidbook (live funnel) cho đến khi landing mới sẵn sàng + Kenji duyệt migration.
// Ngôn ngữ trẻ em theo docs/brand/CHILD_LANGUAGE_RULES.md: không dán nhãn,
// không đoán tương lai, chỉ gợi ý quan sát.
export default function HatMamSection() {
  return (
    <section id="hat-mam" className="bg-e26-cream px-6 py-20 md:py-28 scroll-mt-10">
      <div className="max-w-3xl mx-auto text-center">
        <span
          className="fade-in-section block font-serif font-light text-[80px] leading-none text-e26-border mb-2"
          aria-hidden="true"
        >
          05
        </span>
        <p className="fade-in-section font-sans text-xs tracking-[0.08em] uppercase text-e26-gold-deep mb-5">
          Đang mở
        </p>
        <h2 className="fade-in-section font-serif font-normal text-[28px] md:text-[40px] leading-tight text-e26-text mb-4">
          Ấn phẩm Bản Sắc Hạt Mầm
        </h2>
        <p className="fade-in-section font-sans text-[15px] text-e26-text-2 mb-8">
          Dành cho ba mẹ có con 0–6 tuổi.
        </p>

        <div className="fade-in-section max-w-xs mx-auto mb-10">
          <ImageSlot ratio="4/5" label="Ảnh ấn phẩm — chờ bản web-ready" />
        </div>

        <p className="fade-in-section font-sans text-[17px] leading-[1.65] text-e26-text-2 max-w-2xl mx-auto mb-6">
          Một ấn phẩm viết riêng cho từng bé — như một bản đồ quan sát về khí chất,
          nhịp cảm xúc và cách con thấy an toàn. Không dán nhãn con, không đoán trước
          tương lai của con. Chỉ là những gợi ý quan sát, để ba mẹ có thể để ý và hiểu
          con hơn mỗi ngày.
        </p>
        <p className="fade-in-section font-sans text-[15px] leading-[1.6] text-e26-text-2 mb-10">
          Mỗi bản đều do Kenji viết và đích thân duyệt trước khi gửi đến ba mẹ.
        </p>
        <div className="fade-in-section">
          <Link
            href="/kidbook"
            className="inline-block bg-e26-gold text-e26-black font-sans font-medium text-[15px] px-10 py-4 hover:opacity-90 transition-opacity duration-300"
          >
            Tìm hiểu ấn phẩm Hạt Mầm
          </Link>
        </div>
      </div>
    </section>
  );
}
