"use client";

import SignUp from "@/components/@new/auth/sign-up/sign-up-form";
import SignUpReason from "@/components/@new/auth/sign-up/sign-up-reason";
import SignUpFinish from "@/components/@new/auth/sign-up/sign-up-finish";
import { IUserSignUp } from "@/types/auth";
import { FC, useEffect, useState } from "react";

enum SignUpSteps {
  SELECT_REASONS,
  USER_INFO,
  FINISH,
}

interface SignUpFormProps {
  onSignInClick?: () => void;
  // onSuccess: () => void;
  googleAuth?: {
    redirectOnSignUp?: (data: { email: string; firstName: string; lastName: string; accessToken: string }) => void;
    onSuccessFinish: () => void;
  };
  onEmailSignUpFinish?: () => void;
}

const SignUpForm: FC<SignUpFormProps> = ({ onSignInClick, googleAuth, onEmailSignUpFinish }) => {
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
      {step === SignUpSteps.USER_INFO && (
        <SignUp
          registrationReasons={registrationReasons!}
          onBack={() => {
            setRegistrationReasons(null);
            setStep(SignUpSteps.SELECT_REASONS);
          }}
          googleAuth={googleAuth}
          onSignInClick={onSignInClick}
          onFinish={(errorMessage, email) => {
            setStep(SignUpSteps.FINISH);
            if (errorMessage) {
              setErrorMessage(errorMessage);
            }
            if (email) {
              setEmail(email);
              onEmailSignUpFinish && onEmailSignUpFinish();
            }
          }}
        />
      )}
      {step === SignUpSteps.SELECT_REASONS && (
        <SignUpReason
          onNext={(value) => {
            setRegistrationReasons(value);
            setStep(SignUpSteps.USER_INFO);
          }}
          onSignInClick={onSignInClick}
        />
      )}
      {step === SignUpSteps.FINISH && (
        <SignUpFinish
          {...(errorMessage
            ? {
                variant: "error",
                errorMessage,
                resetSignUp: () => {
                  setStep(SignUpSteps.SELECT_REASONS);
                  setErrorMessage(null);
                },
              }
            : { variant: "success", email: email! })}
        />
      )}
    </div>
  );
};

export default SignUpForm;
