import Image from "next/image";

// Slot ảnh homepage. Có src → render ảnh đúng tỉ lệ đầy đủ (3:2 hoặc 4:5).
// Chưa có src → fallback tự trọng: khối cream thuần, không chữ, không viền,
// chiều cao ~60% tỉ lệ gốc, một hairline vàng 1px chạy ngang ở 1/3 dưới.
// Khi có ảnh web-ready: chỉ cần truyền src/alt, layout không đổi.
export default function ImageSlot({
  ratio,
  src,
  alt = "",
  className = "",
}: {
  ratio: "3/2" | "4/5";
  src?: string;
  alt?: string;
  className?: string;
}) {
  if (src) {
    const aspect = ratio === "3/2" ? "aspect-[3/2]" : "aspect-[4/5]";
    return (
      <div className={`relative w-full ${aspect} overflow-hidden ${className}`}>
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
        />
      </div>
    );
  }

  // Fallback: 3:2 (cao 66.7% ngang) → 5:2 (40%); 4:5 (125%) → 4:3 (75%)
  const aspect = ratio === "3/2" ? "aspect-[5/2]" : "aspect-[4/3]";
  return (
    <div className={`relative w-full ${aspect} bg-e26-cream ${className}`} aria-hidden="true">
      <div className="absolute left-0 right-0 bottom-1/3 h-px bg-e26-gold" />
    </div>
  );
}
