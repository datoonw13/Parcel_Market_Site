import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    colors: {
      white: "#FFFFFF",
      green: {
        DEFAULT: "#16DB65",
        100: "#E4F8E9",
        200: "#C6F1D0",
        300: "#A2EAB3",
        400: "#74E391",
        // 500: "#16DB65",
        600: "#14C45A",
        700: "#11AA4E",
        800: "#0E8B40",
        900: "#0A622D",
      },
      "dark-green": {
        DEFAULT: "#05471C",
        100: "#728375",
        // 200: "#05471C",
        300: "#044019",
        400: "#043716",
        500: "#032D12",
        600: "#02200D",
      },
      neutral: {
        DEFAULT: "#EAF2D7",
        100: "#FDFEFB",
        200: "#FBFCF8",
        300: "#F7FAF0",
        400: "#F3F7E8",
        500: "#EEF5E0",
        // 600: "#EAF2D7",
        700: "#D1D8C0",
        800: "#B5BBA7",
        900: "#949988",
        1000: "#696C60",
      },
      grey: {
        100: "#F2F3F2",
        200: "#E4E6E4",
        300: "#C6CBC6",
        400: "#A1AAA3",
      },
    },
    extend: {
      fontFamily: {
        inter: ["var(--font-inter)"],
        bricolage: ["var(--font-bricolage)"],
      },
    },
  },
  plugins: [],
};
export default config;
