import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        marlo: {
          gold: "#C9A96E",
          dark: "#1A1A1A",
          cream: "#FAF8F5",
        },
        gold: {
          50: "#faf7f0",
          100: "#f3ecda",
          200: "#e6d6b4",
          300: "#d4b886",
          400: "#c9a96e",
          500: "#b5903c",
          600: "#a07a2e",
          700: "#7a5c22",
          800: "#5e4720",
          900: "#4a3a1d",
          950: "#2c2010",
        },
        stone: {
          50: "#fafaf9",
          100: "#f5f5f4",
          200: "#e7e5e4",
          300: "#d6d3d1",
          400: "#a8a29e",
          500: "#78716c",
          600: "#57534e",
          700: "#44403c",
          800: "#292524",
          900: "#1c1917",
          950: "#0c0a09",
        },
      },
      fontFamily: {
        serif: ["Georgia", "Times New Roman", "serif"],
      },
    },
  },
  plugins: [],
};
export default config;
