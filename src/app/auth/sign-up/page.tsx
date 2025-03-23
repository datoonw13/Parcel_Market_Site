"use client";

import SignUp from "@/components/auth/sign-up/sign-up";
import routes from "@/helpers/routes";
import { signUpUserAction } from "@/server-actions/new-auth/new-auth";
import { UserSource } from "@/types/common";
import { useRouter } from "next/navigation";
import { useState } from "react";

enum SignUpSteps {
  SELECT_REASONS,
  USER_INFO,
  FINISH,
}

const REDIRECT_URL_AFTER_SUCCESS_PAGE = routes.home.fullUrl;

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
        const request = await signUpUserAction({ ...data });
        if (request.errorMessage) {
          setErrorMessage(request.errorMessage);
          setStep(SignUpSteps.FINISH);
        } else if (data.userSource === UserSource.Google || data.userSource === UserSource.Facebook) {
          const params = new URLSearchParams();
          params.set("jwt", request.data!.access_token);
          params.set("jwtRefresh", request.data!.refresh_token);
          params.set("redirectUrl", REDIRECT_URL_AFTER_SUCCESS_PAGE);
          router.push(`${routes.auth.signUp.success.fullUrl}?${params.toString()}`);
        } else {
          setStep(SignUpSteps.FINISH);
        }
      }}
      isTransitioning={false}
      className="m-auto sm:p-10 md:p-12 lg:p-14 xl:p-16"
    />
  );
};

export default SignUpPage;
