import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    screens: {
      "2xl": "1400px",
    },
    extend: {
      colors: {},
      screens: {
        xs: "450px",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
