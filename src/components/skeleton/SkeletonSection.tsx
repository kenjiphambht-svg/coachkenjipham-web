// Khối placeholder dùng chung cho các trang KHUNG (chưa đổ nội dung thật).
// Chỉ hiện tiêu đề mô tả section + 1 dòng ghi rõ đây là chỗ chờ nội dung —
// không tự viết copy thật. Dùng ở 6 route khung mới (không dùng cho trang
// đã có nội dung thật như /ve-kenji, /lang-90, /trang-chu-v2).
interface SkeletonSectionProps {
  label: string;
  tone?: "ivory" | "cream" | "white";
  note?: string;
}

const TONE_BG: Record<NonNullable<SkeletonSectionProps["tone"]>, string> = {
  ivory: "bg-e26-ivory",
  cream: "bg-e26-cream",
  white: "bg-e26-white",
};

export default function SkeletonSection({
  label,
  tone = "ivory",
  note = "Nội dung sẽ được Kenji duyệt và đưa vào sau — xem file GOI-XX tương ứng trong Drive.",
}: SkeletonSectionProps) {
  return (
    <section className={`${TONE_BG[tone]} px-6 py-14 md:py-20 border-b border-e26-border`}>
      <div className="max-w-[720px] mx-auto">
        <p className="font-serif text-xl md:text-2xl text-e26-text mb-3">{label}</p>
        <p className="font-sans text-sm text-e26-text-2">{note}</p>
      </div>
    </section>
  );
}
