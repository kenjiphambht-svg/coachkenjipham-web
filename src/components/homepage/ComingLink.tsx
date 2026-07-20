import Link from "next/link";
import type { ReactNode } from "react";

// Luật "chưa mở" V9 (Kenji 20/07/2026) — KHÔNG còn nhãn "(sắp mở)". Trang
// chưa dựng thì chữ/card hiện mờ, không bấm được, KHÔNG <a>/<Link>, KHÔNG
// href, KHÔNG hover effect — sự chưa-mở đã được giải thích bằng câu trong
// body ("đang được viết dần") rồi.
// Khi trang đích xong: chỉ cần truyền `href` — component tự đổi span mờ
// thành <Link> sống, không phải sửa lại từng chỗ gọi.
export default function ComingLink({
  href,
  children,
  className = "",
}: {
  href?: string;
  children: ReactNode;
  className?: string;
}) {
  if (href) {
    return (
      <Link href={href} className={className}>
        {children}
      </Link>
    );
  }

  return (
    <span className={`${className} opacity-45 cursor-default select-none`.trim()}>
      {children}
    </span>
  );
}
