"use client";

import { IUserSignUp } from "@/types/auth";
import { Dispatch, FC, ReactElement, SetStateAction, useEffect, useState } from "react";
import { ITokens, UserSource } from "@/types/common";
import { cn } from "@/lib/utils";
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
  onSubmit: (data: IUserSignUp & { userSource: UserSource; token?: string }) => Promise<void>;
  className?: string;
  isTransitioning?: boolean;
  step: SignUpSteps;
  setStep: Dispatch<SetStateAction<SignUpSteps>>;
  errorMessage: string | null;
  setErrorMessage: Dispatch<SetStateAction<string | null>>;
  email: string | null;
  setEmail: Dispatch<SetStateAction<string | null>>;
  redirectAfterSuccessPage: () => void;
  tokens: ITokens | null;
}

const SignUp: FC<SignUpProps> = ({
  showSignIn,
  authProviders,
  onSubmit,
  className,
  isTransitioning,
  email,
  errorMessage,
  setEmail,
  setErrorMessage,
  setStep,
  step,
  redirectAfterSuccessPage,
  tokens,
}) => {
  const [registrationReasons, setRegistrationReasons] = useState<IUserSignUp["registrationReasons"] | null>(null);

  useEffect(() => {
    if (step === SignUpSteps.SELECT_REASONS) {
      setErrorMessage(null);
    }
  }, [setErrorMessage, step]);

  return (
    <div className={cn("flex flex-col gap-8 items-center w-full h-full", className)}>
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
          showSignIn={showSignIn}
          onSubmit={onSubmit}
          isTransitioning={isTransitioning}
        />
      )}
      {step === SignUpSteps.FINISH && (
        <SignUpFinish
          tokens={tokens}
          errorMessage={errorMessage}
          email={email}
          resetSignUp={() => {
            setStep(SignUpSteps.SELECT_REASONS);
            setErrorMessage(null);
            setEmail(null);
          }}
          onSuccessRedirect={redirectAfterSuccessPage}
        />
      )}
    </div>
  );
};

export default SignUp;
