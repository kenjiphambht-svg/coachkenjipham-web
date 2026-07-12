import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
        cream: "var(--cream)",
        ink: "var(--ink)",
        "body-text": "var(--body-text)",
        gold: "var(--gold)",
        "gold-brand": "var(--gold-brand)",
        "gold-deep": "var(--gold-deep)",
        "dark-section": "var(--dark-section)",
        "cream-light": "var(--cream-light)",
        "cream-muted": "var(--cream-muted)",
        // Essence 2026 tokens — new code only (AGENTS.md), song song với token legacy phía trên.
        // Nguồn: docs/brand/design-system/03_COLOR_TOKENS_2026.md
        "e26-white": "var(--essence-white-2026)",
        "e26-ivory": "var(--essence-ivory-2026)",
        "e26-cream": "var(--essence-cream-2026)",
        "e26-black": "var(--essence-black-2026)",
        "e26-text": "var(--essence-text-primary-2026)",
        "e26-text-2": "var(--essence-text-secondary-2026)",
        "e26-text-dark": "var(--essence-text-primary-dark-2026)",
        "e26-text-dark-2": "var(--essence-text-secondary-dark-2026)",
        "e26-border": "var(--essence-border-light-2026)",
        "e26-border-dark": "var(--essence-border-dark-2026)",
        "e26-gold": "var(--essence-gold-2026)",
        "e26-gold-deep": "var(--essence-gold-deep-2026)",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        serif: ["Cormorant Garamond", "Georgia", "serif"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "ping-slow": "ping 2.5s cubic-bezier(0, 0, 0.2, 1) infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;