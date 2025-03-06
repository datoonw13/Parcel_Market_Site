"use client";

import SignUp from "@/components/@new/auth/sign-up/sign-up-form";
import SignUpReason from "@/components/@new/auth/sign-up/sign-up-reason";
import SignUpFinish from "@/components/@new/auth/sign-up/sign-up-finish";
import { IUserSignUp } from "@/types/auth";
import { FC, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ITokens, UserSource } from "@/types/common";

enum SignUpSteps {
  SELECT_REASONS,
  USER_INFO,
  FINISH,
}

interface SignUpFormProps {
  modal?: {
    showSignIn: () => void;
    onRegister: () => void;
    onAuth: () => void;
    closeModal: () => void;
  };
}

const SignUpForm: FC<SignUpFormProps> = ({ modal }) => {
  const params = useSearchParams();
  const userSource = (params.get("userSource") as UserSource) || UserSource.System;
  const [step, setStep] = useState(SignUpSteps.SELECT_REASONS);
  const [registrationReasons, setRegistrationReasons] = useState<IUserSignUp["registrationReasons"] | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [tokens, setTokens] = useState<null | ITokens>(null);

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
          modal={modal}
          setErrorMessage={setErrorMessage}
          setEmail={setEmail}
          setFinishStep={(tokens) => {
            setTokens(tokens);
            setStep(SignUpSteps.FINISH);
          }}
        />
      )}
      {step === SignUpSteps.SELECT_REASONS && (
        <SignUpReason
          onNext={(value) => {
            setRegistrationReasons(value);
            setStep(SignUpSteps.USER_INFO);
          }}
          modal={modal}
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
                userSource,
              }
            : { variant: "success", email: email!, userSource, tokens })}
        />
      )}
    </div>
  );
};

export default SignUpForm;
