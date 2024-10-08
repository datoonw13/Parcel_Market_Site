"use client";

import { Inter } from "next/font/google";
import { createTheme } from "@mui/material/styles";

declare module "@mui/material/styles" {
  interface Palette {
    darkGreen: Palette["primary"];
    green: Palette["grey"];
    black: string;
    white: string;
  }
  interface PaletteOptions {
    darkGreen: PaletteOptions["primary"];
    green: PaletteOptions["grey"];
    black: string;
    white: string;
  }
}

declare module "@mui/material/Button" {
  interface ButtonPropsColorOverrides {
    darkGreen: true;
  }
}

// const inter = Inter({
//   weight: ["300", "400", "500", "700", "800"],
//   subsets: ["latin"],
//   display: "swap",
// });

const { palette, spacing, breakpoints, shadows } = createTheme();

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
  green: {
    "50": "#F3F9F5",
    "100": "#E7F3EC",
    "200": "#CFE8D9",
    "400": "#9FD1B3",
    "600": "#6EB98C",
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

const newShadows = shadows;
shadows[1] = "0px 0px 30px 0px rgba(0, 0, 0, 0.08)";
shadows[2] = "0px 12px 50px 0px rgba(0, 0, 0, 0.08)";

const theme = createTheme({
  typography: {
    // fontFamily: inter.style.fontFamily,
  },
  palette: customPalette,
  components: {
    MuiInputLabel: {
      styleOverrides: {
        root: {
          fontSize: 12,
          fontWeight: 500,
        },
        shrink: {
          background: customPalette.white,
          padding: "4px 0",
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          fontSize: 12,
          minHeight: 52,
        },
        input: {
          "&::placeholder": {
            opacity: 1,
            color: customPalette.grey[800],
          },
        },
      },
    },
    MuiInput: {
      defaultProps: {
        disableUnderline: true,
      },
    },
    MuiFilledInput: {
      defaultProps: {
        disableUnderline: true,
      },
      styleOverrides: {
        root: {
          background: "transparent !important",
          borderWidth: 1,
          borderRadius: 10,
          borderColor: customPalette.grey[100],
          "&:hover:not(.Mui-error):not(.Mui-focused)": {
            borderColor: customPalette.grey[200],
          },
          "&.Mui-error": {
            borderColor: customPalette.error.main,
          },
          "&.Mui-focused:not(.Mui-error)": {
            borderColor: customPalette.primary.main,
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          "&:hover:not(.Mui-focused):not(.Mui-error) > .MuiOutlinedInput-notchedOutline": {
            borderColor: customPalette.grey[200],
          },
        },
        notchedOutline: {
          borderColor: customPalette.grey[100],
          borderWidth: `1px !important`,
          borderRadius: 10,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          padding: spacing(1.5, 3),
          borderRadius: spacing(1),
          textTransform: "none",
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
    MuiContainer: {
      styleOverrides: {
        root: {
          px: { xs: 2.5, md: 5 },
          py: { xs: 2, sm: 2.5, md: 3 },
          paddingLeft: spacing(2.5),
          paddingRight: spacing(2.5),
          [breakpoints.up("md")]: {
            paddingLeft: spacing(5),
            paddingRight: spacing(5),
          },
        },
      },
    },
    MuiRadio: {
      defaultProps: {
        color: "success",
      },
    },
    MuiAutocomplete: {
      styleOverrides: {
        paper: {
          borderRadius: spacing(1.5),
          maxHeight: "25vh",
          marginTop: spacing(0.5),
        },
        listbox: {
          padding: 0,
        },
        option: {
          padding: "12px 16px !important",
          fontSize: 12,
          fontWeight: 500,
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          "&:after": {
            borderTop: `thin solid #D9D9D9`,
          },
          "&:before": {
            borderTop: `thin solid #D9D9D9`,
          },
          "& span": {
            color: customPalette.grey[800],
            fontSize: 14,
            fontWeight: 500,
          },
          width: "100%",
        },
      },
    },
  },
  shadows: [...newShadows],
});

export default theme;
