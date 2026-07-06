// Section 7 — Ghi chép Essence: một dòng trung thực, "sắp mở".
// Nền ivory — trả lại ánh sáng sau khoảng lặng, trước footer đen (đúng nhịp lặng–thở–lặng).
export default function NotesTeaser() {
  return (
    <section className="bg-e26-ivory px-6 py-16 md:py-20">
      <div className="max-w-2xl mx-auto text-center">
        <p className="fade-in-section font-serif text-2xl text-e26-text mb-3">Ghi chép Essence</p>
        <p className="fade-in-section font-sans text-[15px] leading-[1.65] text-e26-text-2">
          Những bài viết chậm về bản sắc, nội tâm và chuyện làm cha mẹ.
          Đang được viết — sẽ mở trong thời gian tới.
        </p>
      </div>
    </section>
  );
}
