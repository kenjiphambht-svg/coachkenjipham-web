import Image from "next/image";
import ImageSlot from "./ImageSlot";

// Ảnh trang trí (alt rỗng, aria-hidden) — phủ lớp cream ~90% lên trên để chữ
// hero giữ nguyên độ tương phản đọc được (không đổi màu chữ hiện tại).
const HERO_BG_SRC: string | undefined = "/images/home/bg-hero-light.webp";

// Section 2 — Hero: trạng thái con người, dựng theo hệ KHỐI-LỚP (18/07/2026).
// Nền CREAM (không phải ivory — luật #2). Chữ lớn nhất mắt nhìn thấy nhưng
// KHÔNG phải heading (H1 duy nhất ở section ④ KietTac) — dùng <p>, không <h1>.
//   Lớp 1 (dưới): ảnh bg-hero-light phủ TRỌN section + lớp cream ~90% → chữ
//                 nổi trên nền nắng (kỹ thuật A).
//   Lớp 2: khối chữ hero.
//   Lớp 3 (trên): ảnh kenji-portrait. MOBILE thu còn ~85% chiều ngang, lệch
//                 phải, mép trái hở nền → thấy lớp 1 → có chiều sâu. Ảnh vẫn
//                 chờm xuống ranh giới ②→③ (kỹ thuật C). DESKTOP giữ 2 cột.
export default function HomeHero() {
  return (
    <section className="bg-e26-cream px-6 pt-28 pb-20 md:pt-40 md:pb-0 relative overflow-visible">
      {/* LỚP 1 — ảnh nền phủ trọn section (inset-0), cream ~90% giữ tương phản
          chữ. Đã đo thật ở PR trước: chữ hero vẫn đọc rõ trên nền này. */}
      {HERO_BG_SRC && (
        <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
          <Image src={HERO_BG_SRC} alt="" fill className="object-cover" priority />
          <div className="absolute inset-0 bg-e26-cream/90" />
        </div>
      )}
      <div className="relative z-10 max-w-[1120px] mx-auto">
        <div className="grid md:grid-cols-12 gap-10 items-end">
          {/* LỚP 2 — khối chữ. Eyebrow đã bỏ (18/07/2026): tên+chức danh đã có
              ở logo header và section ③ — câu lớn đứng một mình ngay từ đầu.
              (Việc bỏ eyebrow cũng gỡ luôn gạch vàng hairline ở đây → toàn
              trang còn đúng 3 điểm vàng: brush ④, hover ⑤, ebook ⑨.) */}
          <div className="md:col-span-7 md:pb-40">
            <p className="e26-reveal font-serif font-light text-[38px] md:text-[66px] leading-[1.08] text-e26-text text-balance">
              Lâu rồi, chưa ai hỏi bạn đang thế nào.
            </p>
            <p className="e26-reveal font-sans text-[17px] leading-[1.65] text-e26-text-2 mt-10 max-w-xl">
              Bạn vẫn đi làm. Vẫn không quên sinh nhật của ai. Vẫn kịp trả lời những tin nhắn
              công việc lúc tối muộn. Bề ngoài, mọi thứ có vẻ rất ổn.
            </p>
            <p className="e26-reveal font-sans text-[17px] leading-[1.65] text-e26-text-2 mt-6 max-w-xl">
              Ở Essence, không ai hối thúc bạn phải khá lên. Một chỗ để bạn ngồi xuống, nhìn
              rõ hơn, rồi tự chọn nhịp đi tiếp.
            </p>
          </div>

          {/* LỚP 3 — ảnh chân dung.
              MOBILE: w-[85%] + ml-auto → thu hẹp, lệch phải, hở nền trái.
              DESKTOP: md:w-full md:ml-0 → trả về full cột 5/12 như cũ.
              -mb-4/-mb-10: chờm xuống ranh giới ②→③ (giữ từ trước, đã đo không
              đè chữ ③). */}
          <div className="e26-reveal md:col-span-5 relative z-10 -mb-4 md:-mb-10 w-[85%] ml-auto md:w-full md:ml-0">
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
