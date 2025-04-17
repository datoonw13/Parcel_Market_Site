"use client";

import { LoadingIcon2 } from "@/components/@new/icons/LoadingIcons";
import FacebookAuthProvider from "@/components/auth/facebook-auth-provider";
import GoogleAuthProvider from "@/components/auth/google-auth-provider/google-auth-provider";
import SignUp from "@/components/auth/sign-up/sign-up";
import routes from "@/helpers/routes";
import useNotification from "@/hooks/useNotification";
import { useAuth } from "@/lib/auth/auth-context";
import { authWithSocialNetworkAction, signUpUserAction } from "@/server-actions/new-auth/new-auth";
import { IUserSignUp } from "@/types/auth";
import { UserSource } from "@/types/common";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";

enum SignUpSteps {
  SELECT_REASONS,
  USER_INFO,
  FINISH,
}

const SignUpPage = () => {
  const router = useRouter();
  const { notify } = useNotification();
  const { signIn } = useAuth();
  const [step, setStep] = useState(SignUpSteps.SELECT_REASONS);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const params = useSearchParams();
  const [email, setEmail] = useState<string | null>(null);
  const [authPending, startAuthTransition] = useTransition();
  const [userSource, setUserSource] = useState(UserSource.System);
  const [requestPending, setRequestPending] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const [registrationReasons, setRegistrationReasons] = useState<IUserSignUp["registrationReasons"] | null>(null);

  const REDIRECT_URL_AFTER_SUCCESS_PAGE = params.get("onSuccessRedirectUrl") || routes.volt.fullUrl;

  return (
    <>
      {showLoader && (
        <div className="fixed w-full h-full top-0 left-0 bg-white z-20 flex items-center justify-center">
          <div className="fixed w-full h-full top-0 left-0 bg-black-1000/10 flex items-center justify-center" />
          <div className="rounded-2xl bg-transparent p-6 max-w-md space-y-4">
            <div className="relative w-fit mx-auto">
              <svg
                className="absolute -top-[-50%] translate-y-[-50%] left-[50%] translate-x-[-50%]"
                width="21"
                height="24"
                viewBox="0 0 21 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M10.1721 8.10277L11.3736 1.47938C11.5124 0.711291 10.9417 0 10.1852 0H1.20935C0.54185 0 0 0.559838 0 1.24949V7.24002C0 7.89182 0.484262 8.43543 1.11511 8.48411L8.8921 9.11697C9.50725 9.16835 10.0622 8.73022 10.1747 8.10277H10.1721Z"
                  fill="#0E8B40"
                />
                <path
                  d="M17.282 0H15.2586C14.6775 0 14.1775 0.427316 14.0702 1.0169L11.2562 16.5247C11.1175 17.2928 11.6881 18.0041 12.4446 18.0041H17.282C18.9756 18.0041 20.3473 16.5869 20.3473 14.837V3.167C20.3473 1.41717 18.9756 0 17.282 0Z"
                  fill="#16DB65"
                />
                <path
                  d="M8.15655 11.7192L1.30358 11.1621C0.599438 11.1053 0 11.6787 0 12.4062V22.5238C0 23.2135 0.54185 23.7733 1.20935 23.7733H6.32682C6.90794 23.7733 7.4079 23.346 7.51523 22.7537L9.25072 13.1905C9.38422 12.4603 8.87378 11.7733 8.15655 11.7138V11.7192Z"
                  fill="#05471C"
                />
              </svg>
              <LoadingIcon2 className="animate-spin size-12 text-primary-main" />
            </div>
          </div>
        </div>
      )}
      <SignUp
        step={step}
        setStep={setStep}
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
        email={email}
        setEmail={setEmail}
        showSignIn={() => {
          router.push(`${routes.auth.signIn.fullUrl}?onSuccessRedirectUrl=${REDIRECT_URL_AFTER_SUCCESS_PAGE}`);
        }}
        registrationReasons={registrationReasons}
        setRegistrationReasons={setRegistrationReasons}
        authProviders={() => (
          <div className="flex flex-col gap-3 w-full">
            {userSource !== UserSource.Facebook && (
              <GoogleAuthProvider
                label="Sign up with Google"
                disabled={userSource === UserSource.Google}
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
                    setRequestPending(false);
                  } else if (request.errorMessage) {
                    notify({ title: "Error", description: request.errorMessage }, { variant: "error" });
                    setRequestPending(false);
                  } else {
                    setShowLoader(true);
                    signIn(request.data!, () => {
                      startAuthTransition(() => {
                        router.push(REDIRECT_URL_AFTER_SUCCESS_PAGE);
                      });
                    });
                  }
                }}
              />
            )}
            {userSource !== UserSource.Google && (
              <FacebookAuthProvider
                label="Sign up with Facebook"
                disabled={userSource === UserSource.Facebook}
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
                      setRequestPending(false);
                    });
                  } else if (request.errorMessage) {
                    notify({ title: "Error", description: request.errorMessage }, { variant: "error" });
                    setRequestPending(false);
                  } else {
                    setShowLoader(true);
                    signIn(request.data!, () => {
                      startAuthTransition(() => {
                        router.push(REDIRECT_URL_AFTER_SUCCESS_PAGE);
                      });
                    });
                  }
                }}
              />
            )}
          </div>
        )}
        onSubmit={async (data) => {
          const request = await signUpUserAction({ ...data, redirectUrl: REDIRECT_URL_AFTER_SUCCESS_PAGE });
          if (request.errorMessage) {
            setErrorMessage(request.errorMessage);
            setStep(SignUpSteps.FINISH);
          } else if (data.userSource === UserSource.Google || data.userSource === UserSource.Facebook) {
            const params = new URLSearchParams();
            params.set("jwt", request.data!.access_token);
            params.set("jwtRefresh", request.data!.refresh_token);
            params.set("redirectUrl", REDIRECT_URL_AFTER_SUCCESS_PAGE);
            router.push(
              `${
                registrationReasons?.length === 1 && registrationReasons[0] === ("LandOwner" as any)
                  ? routes.auth.signUp.successLandOwner.fullUrl
                  : routes.auth.signUp.success.fullUrl
              }?${params.toString()}`
            );
          } else {
            setEmail(data.email);
            setStep(SignUpSteps.FINISH);
          }
        }}
        isTransitioning={false}
        className="m-auto sm:p-10 md:p-12 lg:p-14 xl:p-16"
      />
    </>
  );
};

export default SignUpPage;
