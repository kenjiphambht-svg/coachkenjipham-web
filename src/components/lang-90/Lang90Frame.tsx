import type { ReactNode } from "react";

import { lang90Cormorant, lang90Newsreader } from "./Lang90Typography";

export const sectionLabelClass =
  `${lang90Newsreader.className} text-[12px] font-medium uppercase tracking-[0.14em] text-e26-text-2 md:text-[13px]`;
export const darkSectionLabelClass =
  `${lang90Newsreader.className} text-[12px] font-medium uppercase tracking-[0.14em] text-e26-text-dark-2 md:text-[13px]`;
export const bodyClass =
  `${lang90Newsreader.className} max-w-[680px] text-[17px] font-normal leading-[1.8] text-e26-text-2 lg:text-[18px] lg:leading-[1.85]`;
export const whisperClass =
  `${lang90Cormorant.className} text-[22px] font-normal italic leading-[1.45] text-e26-text md:text-[26px] lg:text-[30px] lg:leading-[1.42]`;
export const headingClass =
  `${lang90Newsreader.className} text-[30px] font-medium leading-[1.2] md:text-[38px] md:leading-[1.18] lg:text-[46px] lg:leading-[1.16]`;

export function Lang90Header() {
  return (
    <header className="relative z-10 bg-e26-black px-6 pt-7 md:pt-10">
      <p className={`mx-auto max-w-6xl ${darkSectionLabelClass} text-[9px] sm:text-[12px]`}>
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
