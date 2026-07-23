import type { ReactNode } from "react";

export const sectionLabelClass =
  "font-sans text-[12px] font-medium uppercase tracking-[0.18em] text-e26-text-2";
export const bodyClass =
  "font-sans font-normal text-[17px] md:text-[18px] leading-[1.9] text-e26-text-2";
export const whisperClass =
  "font-serif text-[21px] md:text-[23px] italic font-normal leading-[1.5] text-e26-text/75";
export const headingClass =
  "font-serif text-[30px] md:text-[42px] italic font-medium leading-[1.25] text-e26-text";

export function Lang90Header() {
  return (
    <header className="relative z-10 px-6 pt-7 md:pt-10">
      <p className="mx-auto max-w-6xl font-sans text-[9px] font-medium uppercase tracking-[0.14em] text-e26-text-dark-2 sm:text-[12px] sm:tracking-[0.18em]">
        Kenji Phạm · Essence Coach · Sài Gòn
      </p>
    </header>
  );
}

export function Lang90ImagePlaceholder({
  label,
  className = "",
}: {
  label: string;
  className?: string;
}) {
  return (
    <div
      aria-hidden="true"
      className={`relative overflow-hidden bg-e26-cream-deep ${className}`}
    >
      <div className="absolute inset-0 bg-[linear-gradient(145deg,rgba(26,26,26,0.1),transparent_55%)]" />
      <span className="absolute bottom-5 left-5 right-5 font-sans text-[11px] font-medium uppercase tracking-[0.18em] text-e26-text-2/70">
        {label}
      </span>
    </div>
  );
}

export function Lang90Footer({ children }: { children: ReactNode }) {
  return (
    <footer className="bg-e26-black px-6 py-16 md:py-20">
      <div className="mx-auto max-w-[720px] text-center">{children}</div>
    </footer>
  );
}
