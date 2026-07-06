// Slot ảnh không khí — chỗ chờ ảnh web-ready. Chỉ khung hairline + label nhỏ,
// không màu/hiệu ứng mới. Khi có ảnh: thay khối này bằng <Image> cùng tỉ lệ.
// ratio: "3/2" (ngang rộng) hoặc "4/5" (dọc).
export default function ImageSlot({
  ratio,
  label,
  className = "",
}: {
  ratio: "3/2" | "4/5";
  label: string;
  className?: string;
}) {
  const aspect = ratio === "3/2" ? "aspect-[3/2]" : "aspect-[4/5]";
  return (
    <div
      className={`w-full ${aspect} border border-e26-border flex items-center justify-center ${className}`}
      role="img"
      aria-label={label}
    >
      <span className="font-sans text-xs text-e26-text-2">{label}</span>
    </div>
  );
}
