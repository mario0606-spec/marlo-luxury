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
        // marianni brand palette (MAR-10)
        gold: {
          50:  "#fdf8ee",
          100: "#f8efd4",
          200: "#f0dba4",
          300: "#e5c46d",
          400: "#d9aa47",
          500: "#C9A84C", // Warm Gold — primary brand colour
          600: "#a9883a",
          700: "#84672c",
          800: "#6b5224",
          900: "#584420",
          950: "#2f2310",
        },
        // marianni semantic tokens
        ivory:   "#FAF7F2",
        cream:   "#F0E6D3",
        charcoal: "#1C1C1C",
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        sans:    ["var(--font-sans)",    "system-ui", "sans-serif"],
        serif:   ["var(--font-display)", "Georgia", "serif"],
      },
    },
  },
  plugins: [],
};
export default config;
