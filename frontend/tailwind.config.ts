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
        // ── RPG Dark Fantasy Design System ───────────────────────────
        // Surfaces
        "bg-canvas":           "#0d0e12",
        "bg-surface":          "#161920",
        "bg-surface-elevated": "#222733",
        // Borders
        "border-muted":        "#2d3545",
        "border-accent":       "#c5a880",
        // Text
        "text-primary":        "#e2e8f0",
        "text-muted":          "#94a3b8",
        // Brand
        "brand-gold":          "#d4af37",
        "brand-crimson":       "#991b1b",
        "brand-mana":          "#2563eb",
        // Rarity tiers
        "rarity-common":       "#94a3b8",
        "rarity-rare":         "#2563eb",
        "rarity-epic":         "#a855f7",
        "rarity-legendary":    "#f59e0b",
        // ── Legacy aliases so existing className strings keep compiling ──
        primary:        "#161920",
        canvas:         "#0d0e12",
        ink:            "#e2e8f0",
        muted:          "#94a3b8",
        "body-muted":   "#94a3b8",
        "soft-stone":   "#222733",
        "pale-green":   "#222733",
        "pale-blue":    "#1a1f2e",
        "deep-green":   "#991b1b",
        "dark-navy":    "#0d0e12",
        hairline:       "#2d3545",
        "card-border":  "#2d3545",
        "border-light": "#2d3545",
        slate:          "#94a3b8",
        "action-blue":  "#2563eb",
        "focus-blue":   "#2563eb",
        coral:          "#d4af37",
        "coral-soft":   "#c5a880",
        "on-primary":   "#e2e8f0",
        "on-dark":      "#e2e8f0",
        error:          "#991b1b",
        background:     "#0d0e12",
        foreground:     "#e2e8f0",
        surface:        "#161920",
        "surface-card": "#222733",
        "surface-border":"#2d3545",
        brand: {
          500: "#2563eb",
          600: "#d4af37",
          accent: "#d4af37",
        },
        tier: {
          sl: "#94a3b8",
          hl: "#2563eb",
          ex: "#f59e0b",
        },
      },
      fontFamily: {
        // Display — Cinzel (Trajan-style tactical serif)
        display: ["'Cinzel'", "Trajan", "Georgia", "serif"],
        // Body / UI — Inter
        sans: ["Inter", "ui-sans-serif", "system-ui"],
        // Technical mono — Fira Code
        mono: ["'Fira Code'", "'JetBrains Mono'", "Menlo", "ui-monospace", "monospace"],
      },
      borderRadius: {
        // Strictly flat — max 2px per DESIGN.md
        none: "0px",
        xs:   "1px",
        sm:   "2px",
        md:   "2px",
        lg:   "2px",
        xl:   "2px",
        pill: "2px",
        full: "2px",
      },
      letterSpacing: {
        "display-tight": "0.15em",
        "heading-tight": "0.12em",
        "mono-label":    "0.08em",
      },
      animation: {
        "fade-up":       "fadeUp 0.2s linear both",
        "pulse-slow":    "pulse 3s cubic-bezier(0.4,0,0.6,1) infinite",
        "pulse-glow":    "pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "flame-flicker": "flicker 1.5s infinite alternate",
        "scan-line":     "scanLine 4s linear infinite",
      },
      keyframes: {
        fadeUp: {
          "0%":   { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "pulse-glow": {
          "0%, 100%": { opacity: "1" },
          "50%":      { opacity: "0.7" },
        },
        flicker: {
          "0%":   { transform: "scale(1)" },
          "100%": { transform: "scale(1.1)" },
        },
        scanLine: {
          "0%":   { backgroundPosition: "0 0" },
          "100%": { backgroundPosition: "0 100%" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
