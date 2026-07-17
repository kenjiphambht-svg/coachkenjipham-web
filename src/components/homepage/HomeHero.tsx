import Image from "next/image";
import ImageSlot from "./ImageSlot";

// SWAP SLOT: khi có ảnh, đặt "/images/home/bg-hero-light.webp" vào đây.
// Ảnh trang trí (alt rỗng, aria-hidden) — phủ lớp cream ~90% lên trên để chữ
// hero giữ nguyên độ tương phản đọc được (không đổi màu chữ hiện tại).
const HERO_BG_SRC: string | undefined = undefined;

// Section 2 — Hero: trạng thái con người. Nền CREAM (không phải ivory —
// luật #2 của brief). Chữ lớn nhất mắt nhìn thấy nhưng KHÔNG phải heading
// (H1 duy nhất của trang nằm ở section ④ KietTac) — dùng <p>, không <h1>.
// Ảnh 1 (4:5, kenji-portrait) tràn xuống ranh giới sang section ③ bằng margin âm.
export default function HomeHero() {
  return (
    <section className="bg-e26-cream px-6 pt-28 pb-20 md:pt-40 md:pb-0 relative overflow-visible">
      {/* Lớp ảnh nền Hero — chưa có ảnh thật nên chưa render gì (nền vẫn là
          bg-e26-cream thuần của section). Khi HERO_BG_SRC có giá trị, layer
          này tự hiện: ảnh phủ full section + lớp cream 90% đè lên trên. */}
      {HERO_BG_SRC && (
        <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
          <Image src={HERO_BG_SRC} alt="" fill className="object-cover" />
          <div className="absolute inset-0 bg-e26-cream/90" />
        </div>
      )}
      <div className="relative z-10 max-w-[1120px] mx-auto">
        <div className="grid md:grid-cols-12 gap-10 items-end">
          <div className="md:col-span-7 md:pb-40">
            <p className="e26-reveal font-sans text-sm text-e26-text-2 mb-10">
              <span className="inline-block w-6 h-px bg-e26-gold align-middle mr-3" aria-hidden="true" />
              Kenji Phạm — Huấn luyện viên Tâm lý Chiều sâu
            </p>
            <p className="e26-reveal font-serif font-light text-[38px] md:text-[66px] leading-[1.08] text-e26-text text-balance">
              Lâu rồi, chưa ai hỏi bạn đang thế nào.
            </p>
            <p className="e26-reveal font-sans text-[17px] leading-[1.65] text-e26-text-2 mt-10 max-w-xl">
              Bạn vẫn đi làm. Vẫn không quên sinh nhật của ai. Vẫn kịp trả lời những tin nhắn
              công việc lúc tối muộn. Bề ngoài, mọi thứ có vẻ rất ổn.
            </p>
            <p className="e26-reveal font-sans text-[17px] leading-[1.65] text-e26-text-2 mt-6 max-w-xl">
              Ở Essence, không ai hối thúc bạn phải khá lên. Khung cửa này chỉ có một khoảng
              lặng. Một chỗ để bạn ngồi xuống, nhìn rõ hơn, rồi tự chọn nhịp đi tiếp.
            </p>
          </div>

          {/* Ảnh 1 — tràn xuống ranh giới sang section ③ (margin âm phía dưới).
              Đã THU HẸP mức tràn so với bản trước (-mb-16/-mb-32) — mức cũ khiến ảnh
              đè lên "Tôi là Kenji Phạm." ở section ③ (đã đo thật: đè 96px ở desktop
              1280px). Giá trị mới đã kiểm tra thật bằng getBoundingClientRect, không
              còn chồng chữ ở cả mobile lẫn desktop — xem thêm KenjiSection.tsx. */}
          <div className="e26-reveal md:col-span-5 relative z-10 -mb-4 md:-mb-10">
            <ImageSlot
              ratio="4/5"
              src="/images/home/kenji-portrait.webp"
              alt="Kenji Phạm — Huấn luyện viên Tâm lý Chiều sâu"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
