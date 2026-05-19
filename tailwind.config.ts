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
        gold: {
          50: "#fdf9ed",
          100: "#f9f0d0",
          200: "#f3dfa0",
          300: "#ecc766",
          400: "#e5af38",
          500: "#d4922a",
          600: "#b87320",
          700: "#8e531c",
          800: "#74431d",
          900: "#62391b",
          950: "#371d0b",
        },
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Georgia", "serif"],
      },
    },
  },
  plugins: [],
};
export default config;
