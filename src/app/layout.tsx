import { ReactNode } from "react";
import type { Metadata } from "next";
// eslint-disable-next-line camelcase
import { Inter, Bricolage_Grotesque } from "next/font/google";
import "./globals.css";
import clsx from "clsx";
import { Toaster } from "react-hot-toast";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";
import { Box, ThemeProvider } from "@mui/material";
import theme from "@/theme";
import StoreProvider from "./StoreProvider";
import "simplebar-react/dist/simplebar.min.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
});

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-bricolage",
  display: "swap",
  adjustFontFallback: false,
});

export const metadata: Metadata = {
  title: "Parcel Market",
  description: "Value, buy, and sell vacant land",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <>
      <StoreProvider>
        <html lang="en">
          <body className={clsx(inter.className, inter.variable, bricolage.variable, "h-screen")}>
            <AppRouterCacheProvider>
              <ThemeProvider theme={theme}>
                <Toaster position="top-right" />

                {children}
              </ThemeProvider>
            </AppRouterCacheProvider>
          </body>
        </html>
      </StoreProvider>
    </>
  );
}
