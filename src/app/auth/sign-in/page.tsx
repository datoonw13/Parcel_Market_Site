"use client";

import ForgotPasswordButton from "@/components/@new/user/profile/modals/forgot-password/forgot-password-button";
import FacebookAuthProvider from "@/components/auth/facebook-auth-provider";
import GoogleAuthProvider from "@/components/auth/google-auth-provider/google-auth-provider";
import SignInForm from "@/components/auth/sign-in";
import routes from "@/helpers/routes";
import useNotification from "@/hooks/useNotification";
import AuthClient from "@/lib/auth-client";
import { getUserAction } from "@/server-actions/user/actions";
import { IUserBaseInfo } from "@/types/auth";
import { UserSource } from "@/types/common";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";

const SignInPage = () => {
  const router = useRouter();
  const { notify } = useNotification();
  const [authPending, startAuthTransition] = useTransition();
  const [openModal, setOpenModal] = useState(false);
  const [user, setUser] = useState<IUserBaseInfo | null>(null);

  useEffect(() => {
    getUserAction().then((data) => {
      setUser(data);
    });
  }, []);

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
              router.push(routes.volt.fullUrl);
            });
          },
        });
      }}
      authPending={authPending}
      onSignUp={() => router.push(routes.auth.signUp.fullUrl)}
      forgotPasswordButton={() => <ForgotPasswordButton openModal={openModal} setOpenModal={setOpenModal} user={user} />}
      authProviders={() => (
        <div className="flex flex-col gap-3 w-full">
          <GoogleAuthProvider
            onSuccess={async (token) => {
              await AuthClient.thirdPartyAuth({
                token,
                userSource: UserSource.Google,
                remember: false,
                onSuccess: () => {
                  router.push(routes.volt.fullUrl);
                },
                onError: () => {
                  const params = new URLSearchParams({ userSource: UserSource.Google, accessToken: token });
                  router.push(`${routes.auth.signUp.fullUrl}?${params.toString()}`);
                },
              });
            }}
          />
          <FacebookAuthProvider
            onSuccess={async (token) => {
              const request = await AuthClient.thirdPartyAuth({
                token,
                userSource: UserSource.Facebook,
                remember: false,
                onSuccess: () => {
                  router.push(routes.volt.fullUrl);
                },
                onError: () => {
                  const params = new URLSearchParams({ userSource: UserSource.Facebook, accessToken: token });
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
