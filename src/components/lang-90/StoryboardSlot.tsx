type StoryboardSlotProps = {
  id: "SB-01" | "SB-02" | "SB-03" | "SB-04" | "SB-05";
  className?: string;
};

export default function StoryboardSlot({ id, className = "" }: StoryboardSlotProps) {
  return (
    // Intentional editorial pause: replace this scoped slot with the matching storyboard asset later.
    <div
      aria-hidden="true"
      data-storyboard-slot={id}
      className={`overflow-hidden bg-e26-cream-deep ${className}`}
    />
  );
}
