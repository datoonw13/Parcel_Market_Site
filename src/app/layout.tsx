import { ReactNode } from "react";
import type { Metadata } from "next";
// eslint-disable-next-line camelcase
import { Inter, Bricolage_Grotesque } from "next/font/google";
import "./globals.css";
import clsx from "clsx";
import { Toaster } from "react-hot-toast";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";
import { ThemeProvider } from "@mui/material";
import theme from "@/theme";
import NextTopLoader from "nextjs-toploader";
import { Provider } from "jotai";
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
            <NextTopLoader color="#0E8B40" showSpinner={false} />
            <AppRouterCacheProvider>
              <Provider>
                <ThemeProvider theme={theme}>
                  <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
                  {children}
                </ThemeProvider>
              </Provider>
            </AppRouterCacheProvider>
          </body>
        </html>
      </StoreProvider>
    </>
  );
}
