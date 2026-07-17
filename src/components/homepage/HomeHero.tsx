import ImageSlot from "./ImageSlot";

// Section 2 — Hero: trạng thái con người. Nền CREAM (không phải ivory —
// luật #2 của brief). Chữ lớn nhất mắt nhìn thấy nhưng KHÔNG phải heading
// (H1 duy nhất của trang nằm ở section ④ KietTac) — dùng <p>, không <h1>.
// Ảnh 1 (4:5, kenji-portrait) tràn xuống ranh giới sang section ③ bằng margin âm.
export default function HomeHero() {
  return (
    <section className="bg-e26-cream px-6 pt-28 pb-20 md:pt-40 md:pb-0 relative overflow-visible">
      <div className="max-w-[1120px] mx-auto">
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

          {/* Ảnh 1 — tràn xuống ranh giới sang section ③ (margin âm phía dưới) */}
          <div className="e26-reveal md:col-span-5 relative z-10 -mb-16 md:-mb-32">
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
