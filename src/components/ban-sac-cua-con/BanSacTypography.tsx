import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Common = {
  children: ReactNode;
  className?: string;
};

// Typography được khóa theo composition đã duyệt của /lang-90: Cormorant
// Garamond cho Display/Anchor/Accent và Inter cho Reading/Utility.
export function BanSacDisplay({ children, className, as: As = "h1" }: Common & { as?: ElementType }) {
  return (
    <As
      className={cn(
        "font-serif font-medium text-e26-text [text-wrap:balance]",
        "text-[34px] leading-[1.1] tracking-[-0.01em] md:text-[68px] md:leading-[1.05]",
        className
      )}
    >
      {children}
    </As>
  );
}

export function BanSacAnchor({
  children,
  className,
  as: As = "h2",
  level = "h2",
}: Common & { as?: ElementType; level?: "h2" | "h3" }) {
  return (
    <As
      className={cn(
        "font-serif font-medium text-e26-text [text-wrap:balance]",
        level === "h2" && "text-[30px] leading-[1.25] tracking-normal md:text-[42px]",
        level === "h3" && "text-[22px] leading-[1.25] tracking-normal md:text-[32px]",
        className
      )}
    >
      {children}
    </As>
  );
}

export function BanSacBody({ children, className, as: As = "p" }: Common & { as?: ElementType }) {
  return (
    <As
      className={cn(
        "max-w-[660px] font-sans font-normal text-e26-text [text-wrap:pretty]",
        "text-[17px] leading-[1.72] tracking-normal md:text-[19px] md:leading-[1.75]",
        className
      )}
    >
      {children}
    </As>
  );
}

export function BanSacAccent({ children, className, as: As = "p" }: Common & { as?: ElementType }) {
  return (
    <As
      className={cn(
        "font-serif font-normal italic text-e26-text [text-wrap:balance]",
        "text-[22px] leading-[1.5] tracking-normal md:text-[27px]",
        className
      )}
    >
      {children}
    </As>
  );
}

export function BanSacUtility({ children, className, as: As = "p" }: Common & { as?: ElementType }) {
  return (
    <As
      className={cn(
        "font-sans font-medium uppercase text-e26-text/65",
        "text-[12px] leading-[1.4] tracking-[0.14em] md:text-[13px]",
        className
      )}
    >
      {children}
    </As>
  );
}
