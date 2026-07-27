import type { ReactNode } from "react";

export const utilityClass = "font-sans font-medium";

export const sectionLabelClass =
  `${utilityClass} text-xs uppercase tracking-[0.14em] text-e26-text-2`;
export const darkSectionLabelClass =
  `${utilityClass} text-xs uppercase tracking-[0.14em] text-e26-text-dark-2`;
export const bodyClass =
  "max-w-[680px] font-sans text-[18px] font-normal leading-[1.72] text-e26-text-2 md:text-[19px] md:leading-[1.75] lg:text-[20px]";

export function Lang90Header() {
  return (
    <header className="relative z-10 bg-e26-black px-6 pt-7 md:pt-10">
      <p className={`mx-auto max-w-6xl ${darkSectionLabelClass} text-[11px] tracking-[0.08em] sm:text-xs sm:tracking-[0.14em]`}>
        Kenji Phạm · Essence Coach · Sài Gòn
      </p>
    </header>
  );
}

export function Lang90Footer({ children }: { children: ReactNode }) {
  return (
    <footer className="bg-e26-black px-6 py-16 md:py-[90px]">
      <div className="mx-auto max-w-[720px] text-center">{children}</div>
    </footer>
  );
}
