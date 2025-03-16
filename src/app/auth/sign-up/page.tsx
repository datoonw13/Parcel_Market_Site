"use client";

import SignUp from "@/components/auth/sign-up/sign-up";
import routes from "@/helpers/routes";
import AuthClient from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useState } from "react";

enum SignUpSteps {
  SELECT_REASONS,
  USER_INFO,
  FINISH,
}

const SignUpPage = () => {
  const router = useRouter();
  const [step, setStep] = useState(SignUpSteps.SELECT_REASONS);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);

  return (
    <SignUp
      step={step}
      setStep={setStep}
      errorMessage={errorMessage}
      setErrorMessage={setErrorMessage}
      email={email}
      setEmail={setEmail}
      showSignIn={() => {
        router.push(routes.auth.signIn.fullUrl);
      }}
      onSubmit={async (data) => {
        try {
          await AuthClient.signUp({
            ...data,
            onSuccess: () => {
              setEmail(data.email);
              setStep(SignUpSteps.FINISH);
            },
            onError: (errorMessage) => {
              setErrorMessage(errorMessage);
              setStep(SignUpSteps.FINISH);
            },
          });
        } catch (error) {
          console.log(error, 22);
        }
      }}
      isTransitioning={false}
      className="m-auto sm:p-10 md:p-12 lg:p-14 xl:p-16"
      redirectAfterSuccessPage={() => {
        router.push(routes.volt.fullUrl);
      }}
    />
  );
};

export default SignUpPage;
