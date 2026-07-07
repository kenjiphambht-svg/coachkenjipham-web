// Icon line-art tự vẽ cho landing Hạt Mầm — stroke 1.5px, màu theo currentColor
// (đặt text-e26-gold ở nơi dùng). Không icon library màu mè.
// 3 icon mùa: mầm cây / kính lúp / lá chuyển mùa. 5 icon chương: hạt mầm /
// sóng cảm xúc / ngọn cờ nhỏ (ý chí) / đóa hoa / phong thư.

const base = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function IconSeedling({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} {...base} aria-hidden="true">
      <path d="M16 28V16" />
      <path d="M16 16C16 10 12 7 6 7c0 6 4 9 10 9Z" />
      <path d="M16 13c0-4.5 3-7 8-7 0 4.5-3 7-8 7Z" />
    </svg>
  );
}

export function IconMagnifier({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} {...base} aria-hidden="true">
      <circle cx="14" cy="14" r="8" />
      <path d="M20 20l7 7" />
    </svg>
  );
}

export function IconLeafSeason({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} {...base} aria-hidden="true">
      <path d="M26 6C14 6 7 13 6 26c13-1 20-8 20-20Z" />
      <path d="M6 26C13 19 19 13 26 6" />
    </svg>
  );
}

export function IconSeed({ className = "w-7 h-7" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} {...base} aria-hidden="true">
      <path d="M16 27c-5 0-8-3-8-8 0-6 4-11 8-13 4 2 8 7 8 13 0 5-3 8-8 8Z" />
      <path d="M16 27V14" />
    </svg>
  );
}

export function IconWaves({ className = "w-7 h-7" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} {...base} aria-hidden="true">
      <path d="M4 12c4-4 8-4 12 0s8 4 12 0" />
      <path d="M4 20c4-4 8-4 12 0s8 4 12 0" />
    </svg>
  );
}

export function IconFlag({ className = "w-7 h-7" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} {...base} aria-hidden="true">
      <path d="M9 28V5" />
      <path d="M9 6h13l-3 4.5L22 15H9" />
    </svg>
  );
}

export function IconFlower({ className = "w-7 h-7" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} {...base} aria-hidden="true">
      <circle cx="16" cy="13" r="3" />
      <path d="M16 10c0-3 0-5 0-6M18.6 11.5l4.2-3M18.6 14.5l4.2 3M13.4 11.5l-4.2-3M13.4 14.5l-4.2 3" />
      <path d="M16 16v12" />
      <path d="M16 22c-3 0-5-1.5-6-4M16 24c3 0 5-1.5 6-4" />
    </svg>
  );
}

export function IconLetter({ className = "w-7 h-7" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} {...base} aria-hidden="true">
      <rect x="5" y="9" width="22" height="16" />
      <path d="M5 10l11 8 11-8" />
    </svg>
  );
}
