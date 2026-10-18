import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["var(--display)"],
        sans: ["var(--sans)"],
        mono: ["var(--mono)"],
      },
      colors: {
        // Design tokens from globals.css; they switch with the light, dark and wizard themes.
        paper: "var(--paper)",
        surface: "var(--surface)",
        ink: {
          DEFAULT: "var(--ink)",
          2: "var(--ink-2)",
          3: "var(--ink-3)",
        },
        line: "var(--line)",
        cobalt: {
          DEFAULT: "var(--cobalt)",
          fill: "var(--cobalt-fill)",
          deep: "var(--cobalt-deep)",
          soft: "var(--cobalt-soft)",
        },
        // Legacy channels used by the wizard-mode music player.
        background: "rgb(var(--background))",
        foreground: "rgb(var(--foreground))",
        muted: "rgb(var(--muted))",
        accent: "rgb(var(--accent))",
      },
      boxShadow: {
        "glass-inset": "inset 0 17px 5px -9px rgba(254, 254, 91, 0.05)",
        "glass-sm": "5px 5px 20px 0px rgba(254, 254, 91, 0.3)",
      },
      screens: {
        xs: "480px",
      },
    },
  },
  plugins: [],
};
export default config;
