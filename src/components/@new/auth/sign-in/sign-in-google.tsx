"use client";

import { useGoogleLogin } from "@react-oauth/google";
import { useState } from "react";
import { cn } from "@/helpers/common";
import { googleSignInUserAction } from "@/server-actions/user/actions";
import { useRouter, useSearchParams } from "next/navigation";
import routes from "@/helpers/routes";
import { GoogleIcon1 } from "../../icons/SocialNetworkIcons";

const SignInGoogle = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams.toString());
  const [loading, setLoading] = useState(false);
  const login = useGoogleLogin({
    onSuccess: async (data) => {
      const { data: requestData, errorMessage } = await googleSignInUserAction(data.access_token);
      if (errorMessage) {
        const googleCredentialsReq = await fetch(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${data.access_token}`);
        const googleCredentials = (await googleCredentialsReq.json()) as { email: string; family_name: string; given_name: string };
        router.push(
          `${routes.auth.signUp.fullUrl}?access_token=${data.access_token}&firstName=${googleCredentials.given_name}&lastName=${googleCredentials.family_name}&email=${googleCredentials.email}`
        );
      } else {
        if (params.get("from")) {
          const fromUrl = params.get("from");
          params.delete("from");
          params.set("from", routes.auth.signIn.fullUrl);
          const newLocation = `${fromUrl}?${params.toString()}`;
          router.replace(newLocation);
          return;
        }
        router.replace(requestData?.payload.planSelected ? routes.home.fullUrl : routes.userSubscription.fullUrl);
      }
    },
    onError: () => {
      setLoading(false);
    },
    error_callback: () => {
      setLoading(false);
    },
  });

  return (
    <button
      type="button"
      className={cn(
        "w-full p-3 flex justify-center items-center gap-4 shadow-[0px_2px_3px_0px_rgba(0,0,0,0.17)] text-black-400 font-medium rounded-[40px]",
        loading && "opacity-40"
      )}
      onClick={() => {
        setLoading(true);
        login();
      }}
      disabled={loading}
    >
      <GoogleIcon1 />
      Continue with Google
    </button>
  );
};

export default SignInGoogle;
