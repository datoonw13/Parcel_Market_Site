"use client";

import SignUp from "@/components/@new/auth/sign-up/SignUp";
import SignUpReason from "@/components/@new/auth/sign-up/SignUpReason";
import { IUserSignUp } from "@/types/auth";
import { useState } from "react";

const SignInPage = () => {
  const [registrationReason, setRegistrationReason] = useState<IUserSignUp["registrationReason"] | null>(null);

  return (
    <div className="flex flex-col gap-8 items-center w-full m-auto sm:p-10 md:p-12 lg:p-14 xl:p-16 h-full">
      {registrationReason && <SignUp registrationReason={registrationReason} onBack={() => setRegistrationReason(null)} />}
      {!registrationReason && <SignUpReason onNext={(value) => setRegistrationReason(value)} />}
    </div>
  );
};

export default SignInPage;
