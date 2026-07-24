type StoryboardSlotProps = {
  id: "SB-HERO" | "SB-01" | "SB-02" | "SB-03" | "SB-04" | "SB-05";
  tone?: "hero" | "night" | "paper" | "dawn" | "closing";
  className?: string;
};

const tonalFields = {
  hero: "bg-e26-black before:bg-[radial-gradient(ellipse_at_72%_28%,rgba(180,178,169,0.16),transparent_48%)] after:bg-[linear-gradient(160deg,rgba(250,249,247,0.05),transparent_44%,rgba(0,0,0,0.22))]",
  night: "bg-e26-black before:bg-[radial-gradient(ellipse_at_24%_72%,rgba(180,178,169,0.14),transparent_46%)] after:bg-[linear-gradient(145deg,rgba(250,249,247,0.04),transparent_55%,rgba(0,0,0,0.16))]",
  paper: "bg-e26-cream-deep before:bg-[radial-gradient(ellipse_at_70%_24%,rgba(255,255,255,0.52),transparent_46%)] after:bg-[linear-gradient(145deg,rgba(95,94,90,0.04),transparent_58%)]",
  dawn: "bg-e26-ivory before:bg-[radial-gradient(ellipse_at_76%_22%,rgba(255,255,255,0.88),transparent_42%)] after:bg-[linear-gradient(155deg,rgba(233,230,220,0.42),transparent_58%)]",
  closing: "bg-e26-cream-deep before:bg-[radial-gradient(ellipse_at_28%_72%,rgba(255,255,255,0.34),transparent_44%)] after:bg-[linear-gradient(145deg,rgba(95,94,90,0.08),transparent_62%)]",
};

export default function StoryboardSlot({ id, tone = "paper", className = "" }: StoryboardSlotProps) {
  return (
    // Future asset mount: preserve this crop and tonal field when replacing with <Image> or <picture>.
    <div
      aria-hidden="true"
      data-storyboard-slot={id}
      className={`relative isolate overflow-hidden ${tonalFields[tone]} before:absolute before:inset-0 before:content-[''] after:absolute after:inset-0 after:content-[''] ${className}`}
    >
      <div className="absolute inset-0 border border-transparent transition-transform duration-1000 ease-out motion-reduce:transition-none" />
    </div>
  );
}
