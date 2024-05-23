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
import Header from "@/components/header/Header";
import LandingMain from "@/components/landing/LandingMain";
import LandingSection6 from "@/components/landing/LandingSection6";
import Footer from "@/components/landing/Footer";
import StoreProvider from "./StoreProvider";

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
                <Box sx={{ bgcolor: "white" }}>
                  <Header />
                  <LandingMain />
                </Box>
                {children}
                <LandingSection6 />
                <Box sx={{ bgcolor: "white", py: { xs: 10, md: 11, lg: 12.5 } }}>
                  <Footer />
                </Box>
              </ThemeProvider>
            </AppRouterCacheProvider>
          </body>
        </html>
      </StoreProvider>
    </>
  );
}
