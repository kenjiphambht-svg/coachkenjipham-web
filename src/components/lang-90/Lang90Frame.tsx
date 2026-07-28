import type { ReactNode } from "react";

export const utilityClass = "font-sans font-medium";

export const sectionLabelClass =
  utilityClass + " text-[11px] uppercase leading-[1.45] tracking-[0.08em] text-e26-text-2 md:text-xs";
export const darkSectionLabelClass =
  utilityClass + " text-[11px] uppercase leading-[1.45] tracking-[0.08em] text-e26-text-dark-2 md:text-xs";
export const bodyClass =
  "max-w-[680px] font-sans text-[18px] font-normal leading-[1.72] text-e26-text-2 md:text-[19px] md:leading-[1.75] lg:text-[20px]";
export const darkBodyClass =
  "max-w-[680px] font-sans text-[18px] font-normal leading-[1.72] text-e26-text-dark md:text-[19px] md:leading-[1.75] lg:text-[20px]";

export function Lang90Footer({ children }: { children: ReactNode }) {
  return (
    <section className="bg-e26-ivory px-6 py-16 md:py-[90px]">
      <div className="mx-auto max-w-[720px] text-center">{children}</div>
    </section>
  );
}
