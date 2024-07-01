"use client";

import SignUp from "@/components/@new/auth/SignUp";
import SignUpReason from "@/components/@new/auth/SignUpReason";


const SignInPage = () => (
  <div className="flex flex-col gap-8 items-center w-full m-auto sm:p-10 md:p-12 lg:p-14 xl:p-16 h-full">
    <SignUp />
    {/* <SignUpReason /> */}
  </div>
);

export default SignInPage;
