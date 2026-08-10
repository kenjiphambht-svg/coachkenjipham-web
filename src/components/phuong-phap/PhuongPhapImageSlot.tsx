import Image from "next/image";
import { cn } from "@/lib/utils";
import styles from "@/styles/phuong-phap.module.css";

type Props = {
  alt?: string;
  className?: string;
  ratio?: "portrait" | "editorial";
  src?: string;
  variant?: "doorKenji" | "doorSelf" | "doorChild";
};

export function PhuongPhapImageSlot({
  alt = "",
  className,
  ratio = "portrait",
  src,
  variant,
}: Props) {
  return (
    <div
      aria-hidden={src ? undefined : true}
      className={cn(
        styles.imageSlot,
        ratio === "portrait" ? "aspect-[4/5]" : "aspect-[3/4]",
        variant && styles[variant],
        className
      )}
    >
      {src ? (
        <Image
          alt={alt}
          className={cn("object-cover", variant && styles[`${variant}Image`])}
          fill
          sizes="(min-width: 1024px) 34vw, (min-width: 768px) 46vw, 90vw"
          src={src}
          unoptimized
        />
      ) : (
        <>
          <span className={styles.imageSlotLight} />
          <span className={styles.imageSlotLine} />
        </>
      )}
    </div>
  );
}
