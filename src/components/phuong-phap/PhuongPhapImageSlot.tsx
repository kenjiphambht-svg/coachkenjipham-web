import Image from "next/image";
import { cn } from "@/lib/utils";
import styles from "@/styles/phuong-phap.module.css";

type Props = {
  alt?: string;
  className?: string;
  ratio?: "portrait" | "editorial";
  src?: string;
};

export function PhuongPhapImageSlot({ alt = "", className, ratio = "portrait", src }: Props) {
  return (
    <div
      aria-hidden={src ? undefined : true}
      className={cn(
        styles.imageSlot,
        ratio === "portrait" ? "aspect-[4/5]" : "aspect-[3/4]",
        className
      )}
    >
      {src ? (
        <Image
          alt={alt}
          className="object-cover"
          fill
          sizes="(min-width: 1024px) 33vw, 100vw"
          src={src}
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
