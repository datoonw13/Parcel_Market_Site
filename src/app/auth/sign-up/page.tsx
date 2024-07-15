"use client";

import SignUp from "@/components/@new/auth/sign-up/sign-up-form";
import SignUpReason from "@/components/@new/auth/sign-up/sign-up-reason";
import { IUserSignUp } from "@/types/auth";
import { useState } from "react";

const SignInPage = () => {
  const [registrationReasons, setRegistrationReasons] = useState<IUserSignUp["registrationReasons"] | null>(null);

  return (
    <div className="flex flex-col gap-8 items-center w-full m-auto sm:p-10 md:p-12 lg:p-14 xl:p-16 h-full">
      {registrationReasons && <SignUp registrationReasons={registrationReasons} onBack={() => setRegistrationReasons(null)} />}
      {!registrationReasons && <SignUpReason onNext={(value) => setRegistrationReasons(value)} />}
    </div>
  );
};

export default SignInPage;
