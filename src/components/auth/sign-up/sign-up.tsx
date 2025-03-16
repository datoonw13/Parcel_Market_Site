"use client";

import { IUserSignUp } from "@/types/auth";
import { FC, ReactElement, useEffect, useState } from "react";
import { UserSource } from "@/types/common";
import SignUpForm from "./sign-up-form";
import SignUpReason from "./sign-up-reason";
import SignUpFinish from "./sign-up-finish";

enum SignUpSteps {
  SELECT_REASONS,
  USER_INFO,
  FINISH,
}

interface SignUpProps {
  showSignIn: () => void;
  authProviders?: () => ReactElement;
  onSubmit: (data: IUserSignUp & { userSource: UserSource }) => void;
}

const SignUp: FC<SignUpProps> = ({ showSignIn, authProviders, onSubmit }) => {
  const [step, setStep] = useState(SignUpSteps.SELECT_REASONS);
  const [registrationReasons, setRegistrationReasons] = useState<IUserSignUp["registrationReasons"] | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    if (step === SignUpSteps.SELECT_REASONS) {
      setErrorMessage(null);
    }
  }, [step]);

  return (
    <div className="flex flex-col gap-8 items-center w-full m-auto sm:p-10 md:p-12 lg:p-14 xl:p-16 h-full">
      {step === SignUpSteps.SELECT_REASONS && (
        <SignUpReason
          onNext={(value) => {
            setRegistrationReasons(value);
            setStep(SignUpSteps.USER_INFO);
          }}
          showSignIn={showSignIn}
        />
      )}
      {step === SignUpSteps.USER_INFO && (
        <SignUpForm
          authProviders={authProviders}
          registrationReasons={registrationReasons!}
          goBack={() => {
            setRegistrationReasons(null);
            setStep(SignUpSteps.SELECT_REASONS);
          }}
          onFinish={(data) => {
            if (data.isError) {
              setErrorMessage(data.errorMessage);
            } else {
              setEmail(data.email);
            }
            setStep(SignUpSteps.FINISH);
          }}
          showSignIn={showSignIn}
          onSubmit={onSubmit}
        />
      )}
      {step === SignUpSteps.FINISH && (
        <SignUpFinish
          errorMessage={errorMessage}
          email={email}
          resetSignUp={() => {
            setStep(SignUpSteps.SELECT_REASONS);
            setErrorMessage(null);
            setEmail(null);
          }}
        />
      )}
    </div>
  );
};

export default SignUp;
