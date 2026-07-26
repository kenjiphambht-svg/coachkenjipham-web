import type { ReactNode } from "react";

// Shared homepage typography roles. Lặng keeps its own scale and rhythm, but
// never introduces a separate font system.
export const displayClass = "font-serif font-medium";
export const sectionAnchorClass = "font-serif font-medium";
export const utilityClass = "font-sans font-medium";
export const headerMetaClass =
  `${utilityClass} text-[10px] uppercase tracking-[0.08em] text-e26-text-dark-2 sm:text-xs sm:tracking-[0.18em]`;

export const sectionLabelClass =
  `${utilityClass} text-xs uppercase tracking-[0.18em] text-e26-text-2`;
export const darkSectionLabelClass =
  `${utilityClass} text-xs uppercase tracking-[0.18em] text-e26-text-dark-2`;
export const bodyClass =
  "max-w-[680px] font-sans text-[18px] font-normal leading-[1.9] text-e26-text-2";
export const whisperClass =
  "font-serif text-[21px] font-normal italic leading-[1.7] text-e26-text md:text-[23px]";
export const headingClass =
  `${sectionAnchorClass} text-[30px] leading-[1.25] md:text-[42px]`;

export function Lang90Header() {
  return (
    <header className="relative z-10 bg-e26-black px-6 pt-7 md:pt-10">
      <p className={`mx-auto max-w-6xl ${headerMetaClass}`}>
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
