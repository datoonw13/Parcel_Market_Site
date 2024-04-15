"use client";

import Footer from "@/components/Footer";
import LogoHeader from "@/components/shared/LogoHeader";
import useAuthCheck from "@/hooks/useAuthCheck";
import LoadingCircle from "@/icons/LoadingCircle";
import { useAppSelector } from "@/lib/hooks";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";

const AuthLayout = ({
  children,
}: Readonly<{
  children: ReactNode;
}>) => {
  const path = usePathname();
  const router = useRouter();
  const { pending, user } = useAppSelector((state) => state.authedUser);
  const isSignUp = path.includes("sign-up");

  useAuthCheck();

  useEffect(() => {
    if (!pending && user) {
      router.push("/");
    }
  }, [pending, router, user]);

  return (
    <GoogleOAuthProvider clientId="428513511195-dcmr74bq5f6sitpidje63os8kq58ktpe.apps.googleusercontent.com">
      <div>
        <LogoHeader />
        <div className="px-4 py-8 md:pb-12 lg:pb-16 xl:pb-18 2xl:pb-20 flex flex-col gap-10 max-w-[430px] m-auto">
          <div className="w-[80%] sm:w-[100%] m-auto">
            <h1 className="text-2xl font-bold font-bricolage text-green-900 text-center mb-6">
              {isSignUp ? "Sign up with Parcel Market" : "Sign in with your email"}
            </h1>
            <p className="text-xl text-dark-green-500 text-center font-medium">
              {isSignUp
                ? "We will not provide your information to anyone outside our affiliated partners and we respect your privacy"
                : "Enter the email address associated with your account."}
            </p>
          </div>
          {pending ? (
            <div className="w-[260px] flex m-auto">
              <LoadingCircle />
            </div>
          ) : (
            children
          )}
        </div>
      </div>
      <section>
        <Footer />
      </section>
    </GoogleOAuthProvider>
  );
};

export default AuthLayout;
