import type { ReactNode } from "react";

type ClassNameProps = {
  className?: string;
};

export function Lang90HeroComposition({ className = "" }: ClassNameProps) {
  return (
    <h1 className={`max-w-[820px] text-e26-text-dark ${className}`}>
      <span className="block font-serif text-[25px] font-medium leading-[1.12] tracking-[-0.018em] sm:text-[42px] md:text-[50px] lg:text-[62px]">
        Khi đầu óc đã tính đủ mọi đường,
      </span>
      <span className="mt-1 block font-serif text-[24px] font-medium leading-[1.2] tracking-[-0.01em] sm:text-[32px] md:text-[38px] lg:text-[48px]">
        nhưng bạn vẫn không biết
      </span>
      <span className="mt-2 block font-serif text-[34px] font-normal italic leading-[1.08] tracking-[-0.02em] sm:text-[46px] md:text-[56px] lg:text-[68px]">
        đâu là bước của mình.
      </span>
    </h1>
  );
}

export function Lang90SignalComposition({
  align = "left",
  className = "",
}: ClassNameProps & { align?: "left" | "center" }) {
  const alignmentClass = align === "center" ? "mx-auto text-center" : "text-left";

  return (
    <div className={`${alignmentClass} ${className}`}>
      <p className="max-w-[760px] font-serif text-[30px] font-medium leading-[1.18] tracking-[-0.014em] text-e26-text-dark md:text-[40px] lg:text-[48px]">
        <span className="block">Có thể điều bạn cần lúc này</span>
        <span className="block">không phải thêm một câu trả lời.</span>
      </p>
      <p className="mt-12 font-serif text-[44px] font-normal italic leading-[1.04] tracking-[-0.022em] text-e26-text-dark md:mt-16 md:text-[60px] lg:text-[68px]">
        Mà là một khoảng đủ yên
      </p>
      <p className="mt-14 max-w-[820px] font-serif text-[36px] font-medium leading-[1.13] tracking-[-0.018em] text-e26-text-dark md:mt-20 md:text-[46px] lg:text-[56px]">
        <span className="block">để nghe rõ câu hỏi nào</span>
        <span className="block">
          <span className="font-normal italic">thật sự</span> cần được trả lời.
        </span>
      </p>
    </div>
  );
}

export function Lang90SectionHeading({ children, className = "" }: { children: ReactNode } & ClassNameProps) {
  return (
    <h2 className={`font-serif text-[30px] font-medium leading-[1.25] tracking-[-0.012em] md:text-[40px] lg:text-[42px] ${className}`}>
      {children}
    </h2>
  );
}

export function Lang90AccentVoice({ children, className = "" }: { children: ReactNode } & ClassNameProps) {
  return (
    <p className={`font-serif text-[22px] font-normal italic leading-[1.55] tracking-[-0.008em] md:text-[27px] md:leading-[1.5] ${className}`}>
      {children}
    </p>
  );
}
