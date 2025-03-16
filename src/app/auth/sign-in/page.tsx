"use client";

import FacebookAuthProvider from "@/components/auth/facebook-auth-provider";
import GoogleAuthProvider from "@/components/auth/google-auth-provider/google-auth-provider";
import SignInForm from "@/components/auth/sign-in";
import routes from "@/helpers/routes";
import useNotification from "@/hooks/useNotification";
import AuthClient from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

const SignInPage = () => {
  const router = useRouter();
  const { notify } = useNotification();
  const [authPending, startAuthTransition] = useTransition();

  return (
    <SignInForm
      defaultSignIn={async (data) => {
        await AuthClient.defaultAuth({
          ...data,
          onError: (errorMessage) => {
            notify({ title: "Error", description: errorMessage }, { variant: "error" });
          },
          onSuccess: () => {
            startAuthTransition(() => {
              router.push(routes.home.fullUrl);
            });
          },
        });
      }}
      authPending={authPending}
      onSignUp={() => router.push(routes.auth.signUp.fullUrl)}
      ForgotPasswordButton={undefined}
      authProviders={() => (
        <div className="flex flex-col gap-3 w-full">
          <GoogleAuthProvider
            onSuccess={async (data) => {
              const request = await AuthClient.thirdPartyAuth({
                token: data.authAccessToken,
                userSource: data.authUserSource,
                remember: false,
                onSuccess: () => {
                  router.push(routes.home.fullUrl);
                },
                onError: () => {
                  const params = new URLSearchParams(data);
                  router.push(`${routes.auth.signUp.fullUrl}?${params.toString()}`);
                },
              });
            }}
          />
          <FacebookAuthProvider
            onSuccess={async (data) => {
              const request = await AuthClient.thirdPartyAuth({
                token: data.authAccessToken,
                userSource: data.authUserSource,
                remember: false,
                onSuccess: () => {
                  router.push(routes.home.fullUrl);
                },
                onError: () => {
                  const params = new URLSearchParams(data);
                  router.push(`${routes.auth.signUp.fullUrl}?${params.toString()}`);
                },
              });
            }}
          />
        </div>
      )}
      className="sm:py-10 md:py-12 lg:py-14 xl:py-16 max-w-72 mx-auto"
    />
  );
};

export default SignInPage;
