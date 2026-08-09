import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Common = {
  children: ReactNode;
  className?: string;
  id?: string;
};

// Five route-scoped typography roles for /phuong-phap. These components
// express hierarchy; scene-level spacing remains with the page composition.
export function EssenceDisplay({
  children,
  className,
  as: As = "h1",
}: Common & { as?: ElementType }) {
  return (
    <As
      className={cn(
        "max-w-[780px] font-serif font-medium text-e26-text [text-wrap:balance]",
        "text-[42px] leading-[1.04] tracking-[-0.025em] md:text-[64px] lg:text-[72px] md:leading-[1.01]",
        className
      )}
    >
      {children}
    </As>
  );
}

export function EssenceAnchor({
  children,
  className,
  as: As = "h2",
  level = "h2",
}: Common & { as?: ElementType; level?: "h2" | "h3" }) {
  return (
    <As
      className={cn(
        "font-serif font-medium text-e26-text [text-wrap:balance]",
        level === "h2" &&
          "text-[34px] leading-[1.12] tracking-[-0.015em] md:text-[48px] md:leading-[1.08]",
        level === "h3" &&
          "text-[27px] leading-[1.18] tracking-[-0.01em] md:text-[34px] md:leading-[1.14]",
        className
      )}
    >
      {children}
    </As>
  );
}

export function EssenceBody({ children, className, as: As = "p" }: Common & { as?: ElementType }) {
  return (
    <As
      className={cn(
        "max-w-[660px] font-sans font-normal text-e26-text-2 [text-wrap:pretty]",
        "text-[17px] leading-[1.76] tracking-normal md:text-[19px] md:leading-[1.78]",
        className
      )}
    >
      {children}
    </As>
  );
}

export function EssenceLeadIn({
  children,
  className,
  as: As = "p",
}: Common & { as?: ElementType }) {
  return (
    <As
      className={cn(
        "max-w-[680px] font-sans text-[17px] font-semibold leading-[1.7] tracking-[-0.005em] text-e26-text [text-wrap:pretty] md:text-[19px] md:leading-[1.72]",
        className
      )}
    >
      {children}
    </As>
  );
}

export function EssenceAccent({ children, className, as: As = "p" }: Common & { as?: ElementType }) {
  return (
    <As
      className={cn(
        "font-serif italic font-normal text-e26-text [text-wrap:balance]",
        "text-[25px] leading-[1.38] tracking-normal md:text-[32px] md:leading-[1.32]",
        className
      )}
    >
      {children}
    </As>
  );
}

export function EssenceUtility({
  children,
  className,
  as: As = "p",
  variant = "label",
}: Common & { as?: ElementType; variant?: "label" | "numeral" }) {
  return (
    <As
      className={cn(
        variant === "label" &&
          "font-sans text-[12px] font-medium uppercase leading-[1.4] tracking-[0.18em] text-e26-text-2 md:text-[13px]",
        variant === "numeral" &&
          "font-serif text-[48px] font-normal leading-none tracking-[0.02em] text-e26-text md:text-[58px]",
        className
      )}
    >
      {children}
    </As>
  );
}
