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
        ink: "#0c2128",
        mist: "#7d828c",
        // reference design palette (kairos system, ported verbatim)
        surface: "#edf0ee",
        "surface-2": "#e2e8e5",
        "surface-3": "#d6dedb",
        "ink-2": "#3d5155",
        "ink-3": "#6b7c7d",
        amber: "#b8722e",
        "amber-deep": "#8f5520",
        teal: "#0f4a52",
        "teal-lift": "#15616c",
        sand: "#e5dccb",
        "sand-lift": "#dcd1bc",
        daylight: "#eae3d5",
        "daylight-line": "#d6ccb8",
        "sea-deep": "#0d3b44",
        grout: "#0e1a20",
        "grout-2": "#16262d",
        // shadcn/ui tokens (light + dark via .dark class)
        background: "var(--background)",
        foreground: "var(--foreground)",
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        chart: {
          "1": "var(--chart-1)",
          "2": "var(--chart-2)",
          "3": "var(--chart-3)",
          "4": "var(--chart-4)",
          "5": "var(--chart-5)",
        },
        sidebar: {
          DEFAULT: "var(--sidebar)",
          foreground: "var(--sidebar-foreground)",
          primary: "var(--sidebar-primary)",
          "primary-foreground": "var(--sidebar-primary-foreground)",
          accent: "var(--sidebar-accent)",
          "accent-foreground": "var(--sidebar-accent-foreground)",
          border: "var(--sidebar-border)",
          ring: "var(--sidebar-ring)",
        },
      },
      fontFamily: {
        display: ["var(--font-gambarino)", "Georgia", "Times New Roman", "serif"],
        body: ["var(--font-sentient)", "Georgia", "Times New Roman", "serif"],
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
