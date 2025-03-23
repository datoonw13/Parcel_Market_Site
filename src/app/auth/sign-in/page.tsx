"use client";

import ForgotPasswordButton from "@/components/@new/user/profile/modals/forgot-password/forgot-password-button";
import FacebookAuthProvider from "@/components/auth/facebook-auth-provider";
import GoogleAuthProvider from "@/components/auth/google-auth-provider/google-auth-provider";
import SignInForm from "@/components/auth/sign-in";
import routes from "@/helpers/routes";
import useNotification from "@/hooks/useNotification";
import { authWithCredentialsAction, authWithSocialNetworkAction, setAuthTokensAction } from "@/server-actions/new-auth/new-auth";
import { revalidateAllPath } from "@/server-actions/subscription/actions";
import { UserSource } from "@/types/common";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

const REDIRECT_URL = routes.volt.fullUrl;

const SignInPage = () => {
  const router = useRouter();
  const { notify } = useNotification();
  const [authPending, startAuthTransition] = useTransition();
  const [openModal, setOpenModal] = useState(false);
  const [userSource, setUserSource] = useState(UserSource.System);
  const [requestPending, setRequestPending] = useState(false);

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
          setAuthTokensAction([
            {
              token: request.data!.access_token,
              tokenName: "jwt",
              remember: false,
            },
            {
              token: request.data!.refresh_token,
              tokenName: "jwt-refresh",
              remember: data.remember,
            },
          ]);
          await revalidateAllPath();
          startAuthTransition(() => {
            setTimeout(() => {
              router.push(REDIRECT_URL);
            }, 500);
          });
        }
      }}
      authWithCredentialsPending={userSource === UserSource.System && (authPending || requestPending)}
      onSignUp={() => router.push(routes.auth.signUp.fullUrl)}
      forgotPasswordButton={() => <ForgotPasswordButton openModal={openModal} setOpenModal={setOpenModal} user={null} />}
      authProviders={() => (
        <div className="flex flex-col gap-3 w-full">
          <GoogleAuthProvider
            pending={userSource === UserSource.Google && (authPending || requestPending)}
            onSuccess={async (token) => {
              setUserSource(UserSource.Google);
              setRequestPending(true);
              const request = await authWithSocialNetworkAction({ token, userSource: UserSource.Google });
              if (request.errorMessage) {
                startAuthTransition(() => {
                  const params = new URLSearchParams({
                    userSource: UserSource.Google,
                    accessToken: token,
                    onSuccessRedirectUrl: REDIRECT_URL,
                  });
                  router.push(`${routes.auth.signUp.fullUrl}?${params.toString()}`);
                });
              } else {
                setAuthTokensAction([
                  {
                    token: request.data!.access_token,
                    tokenName: "jwt",
                    remember: false,
                  },
                  {
                    token: request.data!.refresh_token,
                    tokenName: "jwt-refresh",
                    remember: false,
                  },
                ]);
                revalidateAllPath();
                startAuthTransition(() => {
                  router.push(REDIRECT_URL);
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
              if (request.errorMessage) {
                startAuthTransition(() => {
                  const params = new URLSearchParams({
                    userSource: UserSource.Facebook,
                    accessToken: token,
                    onSuccessRedirectUrl: REDIRECT_URL,
                  });
                  router.push(`${routes.auth.signUp.fullUrl}?${params.toString()}`);
                });
              } else {
                setAuthTokensAction([
                  {
                    token: request.data!.access_token,
                    tokenName: "jwt",
                    remember: false,
                  },
                  {
                    token: request.data!.refresh_token,
                    tokenName: "jwt-refresh",
                    remember: false,
                  },
                ]);
                revalidateAllPath();
                startAuthTransition(() => {
                  router.push(REDIRECT_URL);
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
