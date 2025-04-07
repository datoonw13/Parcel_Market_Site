"use client";

import FacebookAuthProvider from "@/components/auth/facebook-auth-provider";
import GoogleAuthProvider from "@/components/auth/google-auth-provider/google-auth-provider";
import SignUp from "@/components/auth/sign-up/sign-up";
import routes from "@/helpers/routes";
import useNotification from "@/hooks/useNotification";
import { useAuth } from "@/lib/auth/auth-context";
import { authWithSocialNetworkAction, setAuthTokensAction, signUpUserAction } from "@/server-actions/new-auth/new-auth";
import { revalidateAllPath } from "@/server-actions/subscription/actions";
import { UserSource } from "@/types/common";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

enum SignUpSteps {
  SELECT_REASONS,
  USER_INFO,
  FINISH,
}

const REDIRECT_URL_AFTER_SUCCESS_PAGE = routes.volt.fullUrl;

const SignUpPage = () => {
  const router = useRouter();
  const { notify } = useNotification();
  const { signIn } = useAuth();
  const [step, setStep] = useState(SignUpSteps.SELECT_REASONS);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [authPending, startAuthTransition] = useTransition();
  const [userSource, setUserSource] = useState(UserSource.System);
  const [requestPending, setRequestPending] = useState(false);

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
      authProviders={() => (
        <div className="flex flex-col gap-3 w-full">
          <GoogleAuthProvider
            pending={userSource === UserSource.Google && (authPending || requestPending)}
            onSuccess={async (token) => {
              setUserSource(UserSource.Google);
              setRequestPending(true);
              const request = await authWithSocialNetworkAction({ token, userSource: UserSource.Google });
              if (request.errorMessage === "Invalid credentials") {
                startAuthTransition(() => {
                  const params = new URLSearchParams({
                    userSource: UserSource.Google,
                    accessToken: token,
                    onSuccessRedirectUrl: REDIRECT_URL_AFTER_SUCCESS_PAGE,
                  });
                  router.push(`${routes.auth.signUp.fullUrl}?${params.toString()}`);
                });
              } else if (request.errorMessage) {
                notify({ title: "Error", description: request.errorMessage }, { variant: "error" });
                setRequestPending(false);
              } else {
                signIn(request.data!, () => {
                  startAuthTransition(() => {
                    router.push(REDIRECT_URL_AFTER_SUCCESS_PAGE);
                  });
                });
              }
            }}
          />
          <FacebookAuthProvider
            pending={userSource === UserSource.Facebook && (authPending || requestPending)}
            onSuccess={async (token) => {
              setUserSource(UserSource.Facebook);
              setRequestPending(true);
              const request = await authWithSocialNetworkAction({ token, userSource: UserSource.Facebook });
              if (request.errorMessage === "Invalid credentials") {
                startAuthTransition(() => {
                  const params = new URLSearchParams({
                    userSource: UserSource.Facebook,
                    accessToken: token,
                    onSuccessRedirectUrl: REDIRECT_URL_AFTER_SUCCESS_PAGE,
                  });
                  router.push(`${routes.auth.signUp.fullUrl}?${params.toString()}`);
                });
              } else if (request.errorMessage) {
                notify({ title: "Error", description: request.errorMessage }, { variant: "error" });
                setRequestPending(false);
              } else {
                signIn(request.data!, () => {
                  startAuthTransition(() => {
                    router.push(REDIRECT_URL_AFTER_SUCCESS_PAGE);
                  });
                });
              }
            }}
          />
        </div>
      )}
      onSubmit={async (data) => {
        const request = await signUpUserAction({ ...data, redirectUrl: routes.volt.fullUrl });
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
          setEmail(data.email);
          setStep(SignUpSteps.FINISH);
        }
      }}
      isTransitioning={false}
      className="m-auto sm:p-10 md:p-12 lg:p-14 xl:p-16"
    />
  );
};

export default SignUpPage;
