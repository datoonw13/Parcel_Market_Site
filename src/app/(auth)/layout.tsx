"use client";

import AuthHeader from "@/components/auth/AuthHeader";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

const AuthLayout = ({
  children,
}: Readonly<{
  children: ReactNode;
}>) => {
  const path = usePathname();
  const isSignUp = path.includes("sign-up");

  return (
    <div>
      <AuthHeader />
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
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
