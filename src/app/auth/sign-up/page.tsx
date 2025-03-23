"use client";

import SignUp from "@/components/auth/sign-up/sign-up";
import routes from "@/helpers/routes";
import AuthClient from "@/lib/auth/auth-client";
import { ITokens } from "@/types/common";
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
  const [tokens, setTokens] = useState<ITokens | null>(null);

  return (
    <SignUp
      step={step}
      setStep={setStep}
      errorMessage={errorMessage}
      setErrorMessage={setErrorMessage}
      email={email}
      setEmail={setEmail}
      tokens={tokens}
      showSignIn={() => {
        router.push(routes.auth.signIn.fullUrl);
      }}
      onSubmit={async (data) => {
        await AuthClient.signUp({
          ...data,
          onSuccess: (result) => {
            setEmail(data.email);
            setStep(SignUpSteps.FINISH);
            if (result.data?.access_token && result.data?.refresh_token) {
              setTokens({ access_token: result.data.access_token, refresh_token: result.data.refresh_token });
            }
          },
          onError: (errorMessage) => {
            setErrorMessage(errorMessage);
            setStep(SignUpSteps.FINISH);
          },
        });
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
