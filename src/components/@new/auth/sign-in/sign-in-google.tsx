"use client";

import { useGoogleLogin } from "@react-oauth/google";
import { useState } from "react";
import { cn } from "@/helpers/common";
import useAuth from "@/hooks/useAuth";
import { googleSignInAction } from "@/server-actions/auth/auth";
import { GoogleIcon1 } from "../../icons/SocialNetworkIcons";

const SignInGoogle = () => {
  const [loading, setLoading] = useState(false);
  const { googleAuth } = useAuth();

  const login = useGoogleLogin({
    onSuccess: async (data) => {
      const { data: requestData, errorMessage } = await googleSignInAction(data.access_token, false);
      if (errorMessage) {
        const googleCredentialsReq = await fetch(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${data.access_token}`);
        const googleCredentials = (await googleCredentialsReq.json()) as { email: string; family_name: string; given_name: string };
        googleAuth.error({
          accessToken: data.access_token,
          firstName: googleCredentials.given_name,
          lastName: googleCredentials.family_name,
          email: googleCredentials.email,
        });
        return;
      }
      googleAuth.success(requestData?.decodedAccessToken.planSelected);
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
      id="google-auth-button"
    >
      <GoogleIcon1 />
      Continue with Google
    </button>
  );
};

export default SignInGoogle;
