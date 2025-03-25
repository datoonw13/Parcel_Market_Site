import { ReactNode } from "react";
import type { Metadata, Viewport } from "next";
import { Inter, Bricolage_Grotesque } from "next/font/google";
import "./globals.css";
import clsx from "clsx";
import { Toaster } from "react-hot-toast";
import NextTopLoader from "nextjs-toploader";
import { Provider } from "jotai";
import "simplebar-react/dist/simplebar.min.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getUserAction } from "@/server-actions/user/actions";
import ChatSession from "@/components/@new/chat/chat-session";
import { GoogleTagManager, GoogleAnalytics } from "@next/third-parties/google";
import Chat from "@/components/shared/chat";
import { getUserSubscriptions, revalidateAllPath } from "@/server-actions/subscription/actions";
import Script from "next/script";
import Image from "next/image";
import DeviceDetect from "@/components/shared/DeviceDetect";
import AuthContextProvide from "@/lib/auth/auth-context";
import { getAuthedUserDataAction, isAuthenticatedAction, setAuthTokensAction } from "@/server-actions/new-auth/new-auth";
import { fetcher } from "@/server-actions/fetcher";
import { ISignInResponse } from "@/types/auth";

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
  other: {
    ...(process.env.NODE_ENV === "production" && { "facebook-domain-verification": "ioj6davcfxs2k7yp656xaihld7114b" }),
  },
};

export const viewport: Viewport = {
  initialScale: 1,
  width: "device-width",
  maximumScale: 1,
  viewportFit: "cover",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  // const user = await getUserAction();
  // const userSubscriptions = user ? await getUserSubscriptions() : null;
  const authOption = await isAuthenticatedAction();

  return (
    <>
      <html lang="en">
        {process.env.NODE_ENV === "production" && (
          <Script id="fb-pixel" strategy="afterInteractive">
            {`
               !function(f,b,e,v,n,t,s)
                {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                n.queue=[];t=b.createElement(e);t.async=!0;
                t.src=v;s=b.getElementsByTagName(e)[0];
                s.parentNode.insertBefore(t,s)}(window, document,'script',
                'https://connect.facebook.net/en_US/fbevents.js');
                fbq('init', '567998256023099');
                fbq('track', 'PageView');
              `}
          </Script>
        )}
        <GoogleTagManager gtmId="GTM-P59N8LFM" />
        <GoogleAnalytics gaId="G-SBBPRZKYR6" />
        <body className={clsx(inter.className, inter.variable, bricolage.variable, "h-dvh")}>
          {process.env.NODE_ENV === "production" && (
            <noscript>
              <Image
                alt=""
                height="1"
                width="1"
                style={{ display: "none" }}
                src="https://www.facebook.com/tr?id=567998256023099&ev=PageView&noscript=1"
              />
            </noscript>
          )}
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
          <DeviceDetect />
          <Provider>
            <Toaster position="top-right" toastOptions={{ duration: 5000 }} />
            <AuthContextProvide authOption={authOption}>{children}</AuthContextProvide>
          </Provider>
          <Chat />
        </body>
      </html>
    </>
  );
}
