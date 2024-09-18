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
import "simplebar-react/dist/simplebar.min.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getUserAction } from "@/server-actions/user/actions";
import ChatSession from "@/components/@new/chat/chat-session";
import AuthSessionProvider from "@/components/shared/auth-session-provider";
import Script from "next/script";
import { GoogleTagManager } from "@next/third-parties/google";

const inter = Inter({
  subsets: ["latin"],
  // weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
  adjustFontFallback: false,
});

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  // weight: ["400", "500", "600", "700"],
  variable: "--font-bricolage",
  display: "swap",
  adjustFontFallback: false,
});

export const metadata: Metadata = {
  title: "Parcel Market",
  description: "Value, buy, and sell vacant land",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const user = await getUserAction();

  return (
    <>
      <html lang="en">
        <GoogleTagManager gtmId="GTM-P2BZG9G9" />
        <body className={clsx(inter.className, inter.variable, bricolage.variable, "h-screen")}>
          <noscript>
            <iframe
              src="https://www.googletagmanager.com/ns.html?id=GTM-P2BZG9G9"
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
              title="google-tag-manager"
            />
          </noscript>
          <NextTopLoader color="#0E8B40" showSpinner={false} />
          <ToastContainer
            hideProgressBar
            autoClose={3500}
            toastClassName="!rounded-2xl !p-3"
            className="sm:max-w-sm !w-full"
            closeOnClick
            closeButton={false}
          />
          <AppRouterCacheProvider>
            <Provider>
              <ThemeProvider theme={theme}>
                <Toaster position="top-right" toastOptions={{ duration: 5000 }} />
                <AuthSessionProvider user={user}>
                  <ChatSession user={user}>{children}</ChatSession>
                </AuthSessionProvider>
              </ThemeProvider>
            </Provider>
          </AppRouterCacheProvider>
        </body>
        <Script strategy="lazyOnload" src="https://embed.tawk.to/66daa46a50c10f7a00a4a8d0/1i7314gmo" />
      </html>
    </>
  );
}
