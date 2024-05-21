"use client";

import { Inter } from "next/font/google";
import { createTheme } from "@mui/material/styles";

declare module "@mui/material/styles" {
  interface Palette {
    darkGreen: Palette["primary"];
    black: string;
    white: string;
  }
  interface PaletteOptions {
    darkGreen: PaletteOptions["primary"];
    black: string;
    white: string;
  }
}

declare module "@mui/material/Button" {
  interface ButtonPropsColorOverrides {
    darkGreen: true;
  }
}

const inter = Inter({
  weight: ["300", "400", "500", "700", "800"],
  subsets: ["latin"],
  display: "swap",
});

const { palette, spacing, breakpoints } = createTheme();

const customPalette = {
  ...palette,
  action: {
    disabled: "rgba(34, 34, 34, 0.2)",
    disabledBackground: "#F4F4F4",
  },
  primary: {
    "50": "#F3F9F5",
    "100": "#E7F3EC",
    "200": "#CFE8D9",
    "400": "#9FD1B3",
    "600": "#6EB98C",
    light: "#3EA266",
    main: "#0E8B40",
    dark: "#084E24",
  },
  darkGreen: palette.augmentColor({
    color: {
      "50": "#F2F6F4",
      "100": "#E6EDE8",
      "200": "#CDDAD2",
      "400": "#9BB5A4",
      light: "#699177",
      main: "#376C49",
      dark: "#05471C",
    },
  }),
  grey: {
    A100: "#F8F8F8",
    "50": "#F4F4F4",
    "100": "#E9E9E9",
    "200": "#D3D3D3",
    "400": "#A7A7A7",
    "600": "#7A7A7A",
    "800": "#4E4E4E",
  },
  black: "#222222",
  white: "#FFFFFF",
  success: {
    main: "#16DB65",
  },
  info: {
    main: "#4BB3FF",
  },
  warning: {
    main: "#FF9900",
  },
  error: {
    main: "#D3220B",
  },
};

const theme = createTheme({
  typography: {
    fontFamily: inter.style.fontFamily,
  },
  palette: customPalette,
  components: {
    MuiInputLabel: {
      styleOverrides: {
        root: {
          fontSize: 12,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          padding: spacing(1.5, 3),
          borderRadius: spacing(1),
        },
        outlined: {
          background: customPalette.white,
          color: customPalette.black,
          border: `1px solid ${customPalette.primary[400]}`,
          "&:hover": {
            background: customPalette.primary[200],
          },
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: "filled",
      },
      styleOverrides: {
        root: {
          fontSize: 12,
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          fontSize: 12,
          borderRadius: `${spacing(1)} !important`,
          backgroundColor: `transparent !important`,
          border: `1px solid ${customPalette.grey[200]}`,
        },
      },
    },
    MuiFilledInput: {
      defaultProps: {
        disableUnderline: true,
      },
      styleOverrides: {
        input: {
          borderRadius: `${spacing(1)} !important`,
        },
      },
    },
    MuiContainer: {
      styleOverrides: {
        root: {
          px: { xs: 2.5, md: 5 },
          py: { xs: 2, sm: 2.5, md: 3 },
          paddingLeft: spacing(2.5),
          paddingRight: spacing(2.5),
          paddingTop: spacing(2),
          paddingBottom: spacing(2),
          [breakpoints.up("sm")]: {
            paddingTop: spacing(2),
            paddingBottom: spacing(2),
          },
          [breakpoints.up("md")]: {
            paddingLeft: spacing(5),
            paddingRight: spacing(5),
            paddingTop: spacing(3),
            paddingBottom: spacing(3),
          },
        },
      },
    },
  },
});

export default theme;
