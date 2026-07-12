import Image from "next/image";

// Slot mockup trang ấn phẩm (tỉ lệ A5 dọc ~5:7). Chưa có bản dummy web-ready →
// placeholder nền cream + hairline vàng, không chữ, không viền hộp.
// TUYỆT ĐỐI không dùng ảnh trang thật của khách — chỉ thay bằng bản DUMMY
// (docs/brand/image-system/01 loại 4). Khi có ảnh: truyền src/alt.
export default function MockupSlot({
  src,
  alt = "",
  className = "",
}: {
  src?: string;
  alt?: string;
  className?: string;
}) {
  if (src) {
    return (
      <div className={`relative w-full aspect-[5/7] overflow-hidden ${className}`}>
        <Image src={src} alt={alt} fill sizes="(max-width: 768px) 80vw, 30vw" className="object-cover" />
      </div>
    );
  }
  return (
    <div className={`relative w-full aspect-[5/7] bg-e26-cream ${className}`} aria-hidden="true">
      <div className="absolute left-0 right-0 bottom-1/3 h-px bg-e26-gold" />
    </div>
  );
}
