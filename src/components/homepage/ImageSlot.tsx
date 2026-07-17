import Image from "next/image";

// Slot ảnh homepage. Có src → render ảnh đúng tỉ lệ đầy đủ (3:2 hoặc 4:5).
// Chưa có src → fallback tự trọng: khối cream thuần, không chữ, không viền,
// chiều cao ~60% tỉ lệ gốc, một hairline vàng 1px chạy ngang ở 1/3 dưới.
// Khi có ảnh web-ready: chỉ cần truyền src/alt, layout không đổi.
const ASPECT_CLASS: Record<"3/2" | "4/5" | "21/9" | "16/9", string> = {
  "3/2": "aspect-[3/2]",
  "4/5": "aspect-[4/5]",
  "21/9": "aspect-[21/9]",
  "16/9": "aspect-[16/9]",
};

// Fallback (chưa có src): giữ tự trọng bằng cách hạ chiều cao thay vì kéo full
// tỉ lệ gốc — 3:2→5:2, 4:5→4:3, 21:9→21:6, 16:9→16:5 (theo brief ảnh trang chủ).
const FALLBACK_ASPECT_CLASS: Record<"3/2" | "4/5" | "21/9" | "16/9", string> = {
  "3/2": "aspect-[5/2]",
  "4/5": "aspect-[4/3]",
  "21/9": "aspect-[21/6]",
  "16/9": "aspect-[16/5]",
};

export default function ImageSlot({
  ratio,
  src,
  alt = "",
  className = "",
}: {
  ratio: "3/2" | "4/5" | "21/9" | "16/9";
  src?: string;
  alt?: string;
  className?: string;
}) {
  if (src) {
    return (
      <div className={`relative w-full ${ASPECT_CLASS[ratio]} overflow-hidden ${className}`}>
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

  return (
    <div
      className={`relative w-full ${FALLBACK_ASPECT_CLASS[ratio]} bg-e26-cream ${className}`}
      aria-hidden="true"
    >
      <div className="absolute left-0 right-0 bottom-1/3 h-px bg-e26-gold" />
    </div>
  );
}
