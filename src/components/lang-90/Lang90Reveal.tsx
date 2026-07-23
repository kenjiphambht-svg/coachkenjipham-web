import { useEffect, useRef, useState, type ReactNode } from "react";

type Lang90RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: "none" | "short" | "long";
};

export default function Lang90Reveal({
  children,
  className = "",
  delay = "none",
}: Lang90RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion || !("IntersectionObserver" in window)) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12 }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const delayClass = {
    none: "",
    short: "delay-150",
    long: "delay-300",
  }[delay];

  return (
    <div
      ref={ref}
      className={`motion-reduce:transform-none motion-reduce:transition-none transition-all duration-700 ease-out ${delayClass} ${
        visible ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
      } ${className}`}
    >
      {children}
    </div>
  );
}
