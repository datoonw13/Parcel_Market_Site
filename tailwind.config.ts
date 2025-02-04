import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

export const colors = {
  backdrop: "rgba(22, 28, 36, 0.4)",
  grey: {
    30: "rgba(248, 248, 248, 1)",
    50: "rgba(244, 244, 244, 1)",
    100: "rgba(233, 233, 233, 1)",
    200: "rgba(211, 211, 211, 1)",
    400: "rgba(167, 167, 167, 1)",
    600: "rgba(122, 122, 122, 1)",
    800: "rgba(78, 78, 78, 1)",
    DEFAULT: "rgba(78, 78, 78, 1)",
  },
  primary: {
    dark: {
      50: "rgba(242, 246, 244, 1)",
      100: "rgba(230, 237, 232, 1)",
      200: "rgba(205, 218, 210, 1)",
      400: "rgba(155, 181, 164, 1)",
      600: "rgba(105, 145, 119, 1)",
      800: "rgba(55, 108, 73, 1)",
      1000: "rgba(5, 71, 28, 1)",
      DEFAULT: "rgba(5, 71, 28, 1)",
    },
    main: {
      50: "rgba(243, 249, 245, 1)",
      100: "rgba(231, 243, 236, 1)",
      200: "rgba(207, 232, 217, 1)",
      400: "rgba(159, 209, 179, 1)",
      600: "rgba(110, 185, 140, 1)",
      800: "rgba(62, 162, 102, 1)",
      1000: "rgba(14, 139, 64, 1)",
      DEFAULT: "rgba(14, 139, 64, 1)",
      hover: "rgba(8, 78, 36, 1)",
    },
  },
  black: {
    50: "rgba(34, 34, 34, 0.05) ",
    100: "rgba(34, 34, 34, 0.1)",
    200: "rgba(34, 34, 34, 0.2)",
    400: "rgba(34, 34, 34, 0.4)",
    600: "rgba(34, 34, 34, 0.6)",
    800: "rgba(34, 34, 34, 0.8)",
    1000: "rgba(34, 34, 34, 1)",
    DEFAULT: "rgba(34, 34, 34, 1)",
  },
  white: {
    50: "rgba(255, 255, 255, 0.05)",
    100: "rgba(255, 255, 255, 0.1)",
    200: "rgba(255, 255, 255, 0.2))",
    400: "rgba(255, 255, 255, 0.4)",
    600: "rgba(255, 255, 255, 0.6)",
    800: "rgba(255, 255, 255, 0.8)",
    1000: "rgba(255, 255, 255, 1)",
    DEFAULT: "rgba(255, 255, 255, 1)",
  },
  success: {
    DEFAULT: "rgba(22, 219, 101, 1)",
  },
  warning: {
    100: "rgba(255, 243, 224, 1)",
    DEFAULT: "rgba(255, 153, 0, 1)",
  },
  error: {
    100: "rgba(211, 34, 11, 0.1)",
    400: "rgba(211, 34, 11, 0.4)",
    hover: "rgba(146, 18, 1, 1)",
    DEFAULT: "rgba(211, 34, 11, 1)",
  },
  info: {
    100: "rgba(53, 156, 239, 0.1)",
    DEFAULT: "rgba(53, 156, 239, 1)",
  },
};

export const breakPoints = {
  xs: "0px",
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
  "2xl": "1536px",
};

const config: Config = {
  darkMode: ["class"],
  content: ["./src/pages/**/*.{js,ts,jsx,tsx,mdx}", "./src/components/**/*.{js,ts,jsx,tsx,mdx}", "./src/app/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    screens: breakPoints,
    extend: {
      fontFamily: {
        inter: ["var(--font-inter)"],
        bricolage: ["var(--font-bricolage)"],
      },
      boxShadow: {
        "1": "0px 8px 24px 0px rgba(0, 0, 0, 0.08)",
        "2": "6px 10px 16px 0px rgba(0, 0, 0, 0.12)",
        "3": "0px -8px 20px 0px #00000014",
        "4": "0px 0px 14px 0px rgba(0, 0, 0, 0.08)",
        "5": "0px 4px 20px 0px rgba(0, 0, 0, 0.08)",
        "6": "0 4px 20px 0 rgba(0,0,0,.25)",
      },
      fontSize: {
        xss: ["0.625rem", "14px"],
        xs: ["0.75rem", "22px"],
        sm: ["0.875rem", "24px"],
        base: ["1rem", "28px"],
        lg: ["1.125rem", "28px"],
        "2xl": ["1.5rem", "32px"],
        "3xl": ["1.75rem", "40px"],
        "4xl": ["2rem", "48px"],
        "5xl": ["2.25rem", "48px"],
        "6xl": ["3rem", "48px"],
        "7xl": ["4rem", "80px"],
        "8xl": ["6rem", "112px"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      colors,
      maxWidth: {
        "8xl": "1536px",
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  // safelist: [{ pattern: /([a-zA-Z]+)-./ }]
  plugins: [animate],
};
export default config;
