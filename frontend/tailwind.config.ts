import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        charcoal: "#171e19",
        coal: "#272727",
        sage: "#b7c6c2",
        butter: "#ffe17c",
        paper: "#ffffff",
        app: "#08090a",
        pane: "#0b0c0e",
        rail: "#0c0d0f",
        indigo: "#5e6ad2",
        ink: "#f4f5f8",
        mist: "#7d828c",
      },
      fontFamily: {
        display: ["var(--font-anton)", "Impact", "sans-serif"],
        body: ["var(--font-satoshi)", "var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      backgroundImage: {
        grid: "linear-gradient(to right, #b7c6c220 1px, transparent 1px), linear-gradient(to bottom, #b7c6c220 1px, transparent 1px)",
      },
      backgroundSize: {
        grid: "40px 40px",
      },
    },
  },
  plugins: [],
};

export default config;
