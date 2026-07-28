import Image from "next/image";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

// Ảnh nền dùng chung cho /ve-kenji — brief "LẮP 5 ẢNH THẬT" 29/07/2026.
// next/image + fill: cần cha có position:relative và chiều cao thật (đến từ
// nội dung bên trong, không đặt height cố định — object-cover tự phủ kín).
// Overlay là lớp rgba(26,26,26, X) tuý chỉnh theo section, KHÔNG đổi ảnh gốc.
export function VeKenjiSectionImage({
  src,
  overlay = 0,
  className,
  imgClassName,
  children,
  priority = false,
}: {
  src: string;
  overlay?: number;
  className?: string;
  imgClassName?: string;
  children: ReactNode;
  priority?: boolean;
}) {
  return (
    <div className={cn("relative overflow-hidden", className)}>
      <Image
        src={src}
        alt=""
        aria-hidden="true"
        fill
        priority={priority}
        sizes="100vw"
        className={cn("object-cover", imgClassName)}
      />
      {overlay > 0 && (
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{ background: `rgba(26, 26, 26, ${overlay})` }}
        />
      )}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
