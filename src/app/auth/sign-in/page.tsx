"use client";

import ForgotPasswordButton from "@/components/@new/user/profile/modals/forgot-password/forgot-password-button";
import FacebookAuthProvider from "@/components/auth/facebook-auth-provider";
import GoogleAuthProvider from "@/components/auth/google-auth-provider/google-auth-provider";
import SignInForm from "@/components/auth/sign-in";
import routes from "@/helpers/routes";
import useNotification from "@/hooks/useNotification";
import { useAuth } from "@/lib/auth/auth-context";
import { authWithCredentialsAction, authWithSocialNetworkAction } from "@/server-actions/new-auth/new-auth";
import { UserSource } from "@/types/common";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";

const SignInPage = () => {
  const router = useRouter();
  const params = useSearchParams();
  const { notify } = useNotification();
  const [authPending, startAuthTransition] = useTransition();
  const [openModal, setOpenModal] = useState(false);
  const [userSource, setUserSource] = useState(UserSource.System);
  const [requestPending, setRequestPending] = useState(false);
  const { signIn } = useAuth();
  const REDIRECT_URL = params.get("onSuccessRedirectUrl") || routes.volt.fullUrl;

  return (
    <SignInForm
      defaultSignIn={async (data) => {
        setUserSource(UserSource.System);
        setRequestPending(true);
        const request = await authWithCredentialsAction(data);
        if (request.errorMessage) {
          notify({ title: "Error", description: request.errorMessage }, { variant: "error" });
          setRequestPending(false);
        } else {
          signIn(request.data!, () => {
            startAuthTransition(() => {
              setTimeout(() => {
                router.push(REDIRECT_URL);
              }, 1000);
            });
          });
        }
      }}
      authWithCredentialsPending={userSource === UserSource.System && (authPending || requestPending)}
      onSignUp={() => {
        const newSearchParams = new URLSearchParams();
        if (params.get("onSuccessRedirectUrl")) {
          newSearchParams.append("onSuccessRedirectUrl", params.get("onSuccessRedirectUrl") as string);
        }
        router.push(`${routes.auth.signUp.fullUrl}?${newSearchParams.toString()}`);
      }}
      forgotPasswordButton={() => <ForgotPasswordButton openModal={openModal} setOpenModal={setOpenModal} user={null} />}
      authProviders={() => (
        <div className="flex flex-col gap-3 w-full">
          <GoogleAuthProvider
            label="Sign in with Google"
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
                    onSuccessRedirectUrl: REDIRECT_URL,
                  });
                  router.push(`${routes.auth.signUp.fullUrl}?${params.toString()}`);
                });
              } else if (request.errorMessage) {
                notify({ title: "Error", description: request.errorMessage }, { variant: "error" });
                setRequestPending(false);
              } else {
                signIn(request.data!, () => {
                  startAuthTransition(() => {
                    router.push(REDIRECT_URL);
                  });
                });
              }
            }}
          />
          <FacebookAuthProvider
            label="Sign in with Facebook"
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
                    onSuccessRedirectUrl: REDIRECT_URL,
                  });
                  router.push(`${routes.auth.signUp.fullUrl}?${params.toString()}`);
                });
              } else if (request.errorMessage) {
                notify({ title: "Error", description: request.errorMessage }, { variant: "error" });
                setRequestPending(false);
              } else {
                signIn(request.data!, () => {
                  startAuthTransition(() => {
                    router.push(REDIRECT_URL);
                  });
                });
              }
            }}
          />
        </div>
      )}
      className="sm:py-10 md:py-12 lg:py-14 xl:py-16 max-w-72 mx-auto"
    />
  );
};

export default SignInPage;
