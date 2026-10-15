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
        background: "#090d16",
        surface: "#111827",
        "surface-card": "#182234",
        "surface-border": "#283548",
        brand: {
          500: "#3b82f6",
          600: "#2563eb",
          accent: "#60a5fa",
        },
        tier: {
          sl: "#10b981", // Emerald for SL
          hl: "#8b5cf6", // Purple for HL
          ex: "#f43f5e", // Crimson/Rose for EX
        },
      },
      fontFamily: {
        mono: ["var(--font-geist-mono)", "Menlo", "monospace"],
      },
      animation: {
        "pulse-glow": "pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "flame-flicker": "flicker 1.5s infinite alternate",
      },
      keyframes: {
        "pulse-glow": {
          "0%, 100%": { opacity: "1", filter: "drop-shadow(0 0 12px rgba(59, 130, 246, 0.5))" },
          "50%": { opacity: "0.85", filter: "drop-shadow(0 0 4px rgba(59, 130, 246, 0.2))" },
        },
        flicker: {
          "0%": { transform: "scale(1)" },
          "100%": { transform: "scale(1.15)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
