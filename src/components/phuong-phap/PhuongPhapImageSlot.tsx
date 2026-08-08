import { cn } from "@/lib/utils";
import styles from "@/styles/phuong-phap.module.css";

type Props = {
  className?: string;
  ratio?: "portrait" | "editorial";
};

// Intentional image-ready surface. Production imagery can replace the inner
// plane without changing the surrounding scene geometry or reading order.
export function PhuongPhapImageSlot({ className, ratio = "portrait" }: Props) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        styles.imageSlot,
        ratio === "portrait" ? "aspect-[4/5]" : "aspect-[3/4]",
        className
      )}
    >
      <span className={styles.imageSlotLight} />
      <span className={styles.imageSlotLine} />
    </div>
  );
}
