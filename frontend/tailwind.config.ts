import type { Config } from "tailwindcss";

/** Tokens aligned with DESIGN.md — The Digital Atheneum */
const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#f9f9fb",
        "surface-low": "#f3f3f5",
        surface: "#ffffff",
        primary: "#570000",
        "primary-hover": "#450000",
        "primary-container": "#800000",
        secondary: "#735c00",
        tertiary: "#00137f",
        "on-surface": "#1a1c1d",
        "on-surface-variant": "#5f5658",
        "outline-variant": "rgba(226, 191, 185, 0.35)",
        /** Semantic aliases used in components */
        "text-main": "#1a1c1d",
        "text-muted": "#5f5658",
        border: "rgba(226, 191, 185, 0.45)",
        accent: "#735c00",
        "accent-hover": "#5c4800",
      },
      fontFamily: {
        display: ["var(--font-newsreader)", "Georgia", "serif"],
        sans: ["var(--font-manrope)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 32px 64px -24px rgba(26, 28, 29, 0.06)",
        card: "0 2px 12px rgba(26, 28, 29, 0.04)",
        float: "0 8px 32px rgba(26, 28, 29, 0.05)",
      },
      borderRadius: {
        DEFAULT: "0.5rem",
        xl: "0.75rem",
        "2xl": "1rem",
      },
    },
  },
  plugins: [],
};

export default config;
