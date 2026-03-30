import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        audiowide: ["var(--font-audiowide)", "sans-serif"],
        mono: ["var(--font-space-mono)", "monospace"],
      },
      colors: {
        studio: {
          bg: "#070709",
          surface: "#0e0e11",
          panel: "#16161b",
          border: "#25252e",
          muted: "#72727e",
        },
        amber: {
          glow: "#f59e0b",
          dim: "#b45309",
          soft: "#fbbf24",
        },
      },
      animation: {
        "bar-bounce": "barBounce 0.6s ease-in-out infinite alternate",
        "glow-pulse": "glowPulse 2s ease-in-out infinite",
        "key-press": "keyPress 0.15s ease-out",
      },
      keyframes: {
        barBounce: {
          "0%": { transform: "scaleY(0.2)" },
          "100%": { transform: "scaleY(1)" },
        },
        glowPulse: {
          "0%, 100%": {
            boxShadow: "0 0 8px rgba(245, 158, 11, 0.3)",
          },
          "50%": {
            boxShadow:
              "0 0 24px rgba(245, 158, 11, 0.8), 0 0 48px rgba(245, 158, 11, 0.3)",
          },
        },
        keyPress: {
          "0%": { transform: "scaleY(1)" },
          "50%": { transform: "scaleY(0.95)" },
          "100%": { transform: "scaleY(1)" },
        },
      },
      backgroundImage: {
        "dot-grid":
          "radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)",
        "amber-glow":
          "radial-gradient(ellipse at center, rgba(245,158,11,0.15) 0%, transparent 70%)",
      },
      backgroundSize: {
        "dot-24": "24px 24px",
      },
    },
  },
  plugins: [],
};

export default config;
