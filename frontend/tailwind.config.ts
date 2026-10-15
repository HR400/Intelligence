import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // ── Cohere Design System ──────────────────────────────
        primary:        "#17171c",   // near-black CTA / footer
        "cohere-black": "#000000",
        ink:            "#212121",   // default body text
        "deep-green":   "#003c33",   // product hero bands
        "dark-navy":    "#071829",   // security / financial bands
        canvas:         "#ffffff",
        "soft-stone":   "#eeece7",   // product cards, warm neutral
        "pale-green":   "#edfce9",   // North-page section backdrops
        "pale-blue":    "#f1f5ff",   // blog CTA surface
        hairline:       "#d9d9dd",
        "border-light": "#e5e7eb",
        "card-border":  "#f2f2f2",
        muted:          "#93939f",
        slate:          "#75758a",
        "body-muted":   "#616161",
        "action-blue":  "#1863dc",
        "focus-blue":   "#4c6ee6",
        coral:          "#ff7759",
        "coral-soft":   "#ffad9b",
        "form-focus":   "#9b60aa",
        "on-primary":   "#ffffff",
        "on-dark":      "#ffffff",
        error:          "#b30000",
        // ── Legacy aliases so existing classes don't break ────
        background:       "#ffffff",
        foreground:       "#212121",
        surface:          "#ffffff",
        "surface-card":   "#eeece7",
        "surface-border": "#d9d9dd",
        brand: {
          500: "#1863dc",
          600: "#17171c",
          accent: "#ff7759",
        },
        tier: {
          sl: "#003c33",
          hl: "#1863dc",
          ex: "#ff7759",
        },
      },
      fontFamily: {
        // Display – CohereText feel via Space Grotesk
        display: ["'Space Grotesk'", "Inter", "ui-sans-serif", "system-ui"],
        // Body / UI – Unica77 feel via Inter
        sans: ["Inter", "ui-sans-serif", "system-ui"],
        // Technical mono labels – CohereMono feel
        mono: ["'Space Mono'", "Menlo", "ui-monospace", "monospace"],
      },
      borderRadius: {
        xs:   "4px",
        sm:   "8px",
        md:   "16px",
        lg:   "22px",
        xl:   "30px",
        pill: "32px",
        full: "9999px",
      },
      letterSpacing: {
        "display-tight": "-0.02em",
        "heading-tight": "-0.01em",
        "mono-label":    "0.02em",
      },
      animation: {
        "fade-up":    "fadeUp 0.35s ease-out both",
        "pulse-slow": "pulse 3s cubic-bezier(0.4,0,0.6,1) infinite",
        // keep existing animations
        "pulse-glow":   "pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "flame-flicker":"flicker 1.5s infinite alternate",
      },
      keyframes: {
        fadeUp: {
          "0%":   { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "pulse-glow": {
          "0%, 100%": { opacity: "1" },
          "50%":      { opacity: "0.85" },
        },
        flicker: {
          "0%":   { transform: "scale(1)" },
          "100%": { transform: "scale(1.15)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;

