type LightscapeScene = "opening" | "signal" | "release" | "doorway" | "dawn";

type Lang90LightscapeProps = {
  scene: LightscapeScene;
  alt: string;
  className?: string;
  priority?: boolean;
};

const assets: Record<LightscapeScene, { desktop: string; mobile: string }> = {
  opening: {
    desktop: "/images/lang-90/lang90-lightscape-opening-v02-desktop",
    mobile: "/images/lang-90/lang90-lightscape-opening-v02-mobile",
  },
  signal: {
    desktop: "/images/lang-90/lang90-lightscape-signal-v02-desktop",
    mobile: "/images/lang-90/lang90-lightscape-signal-v02-mobile",
  },
  release: {
    desktop: "/images/lang-90/lang90-lightscape-release-v02-desktop",
    mobile: "/images/lang-90/lang90-lightscape-release-v02-mobile",
  },
  doorway: {
    desktop: "/images/lang-90/lang90-lightscape-doorway-v02-desktop",
    mobile: "/images/lang-90/lang90-lightscape-doorway-v02-mobile",
  },
  dawn: {
    desktop: "/images/lang-90/sb-03-dawn-transition-desktop-v01",
    mobile: "/images/lang-90/sb-03-dawn-transition-mobile-v01",
  },
};

export default function Lang90Lightscape({
  scene,
  alt,
  className = "",
  priority = false,
}: Lang90LightscapeProps) {
  const asset = assets[scene];

  return (
    <picture className="absolute inset-0 block">
      <source media="(min-width: 768px)" srcSet={asset.desktop + ".webp"} type="image/webp" />
      <source srcSet={asset.mobile + ".webp"} type="image/webp" />
      <img
        src={asset.mobile + ".webp"}
        alt={alt}
        width={752}
        height={941}
        sizes="100vw"
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        decoding="async"
        className={["h-full w-full object-cover", className].join(" ")}
      />
    </picture>
  );
}
