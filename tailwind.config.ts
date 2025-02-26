import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        poppin: ["var(--font-poppins)"],
      },
      colors: {
        color_1: "#f1f1f1",
        color_2: "#ffffff4d",
        color_3: "#8758ff",
        color_4: "#c5aeff",
        color_5: "#1A1A40",
        color_6: "#282851",
        color_7: "#3e3e5a",
        color_8: "#80c0eb",
        color_9: "#3d79b1",
      },
      screens: {
        xs: "450px",
        "2xl": "1440px",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
