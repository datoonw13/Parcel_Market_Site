import { ReactNode } from "react";
import type { Metadata } from "next";
// eslint-disable-next-line camelcase
import { Inter, Bricolage_Grotesque } from "next/font/google";
import "./globals.css";
import clsx from "clsx";
import LandingFooter from "@/components/landing/LandingFooter";
import { usePathname } from "next/navigation";
import StoreProvider from "./StoreProvider";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-inter",
});

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["400"],
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
          <body className={clsx(inter.className, inter.variable, bricolage.variable, "h-screen")}>{children}</body>
        </html>
      </StoreProvider>
    </>
  );
}
