import { GoogleIcon1 } from "@/components/@new/icons/SocialNetworkIcons";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { UserSource } from "@/types/common";
import { useGoogleLogin } from "@react-oauth/google";
import React, { useState } from "react";
import { AiOutlineGooglePlus } from "react-icons/ai";

const GoogleAuthButton = ({
  onSuccess,
}: {
  onSuccess: (data: {
    authAccessToken: string;
    authFirstName: string;
    authLastName: string;
    authEmail: string;
    authUserSource: UserSource;
  }) => void;
}) => {
  const [loading, setLoading] = useState(false);

  const login = useGoogleLogin({
    onSuccess: async (data) => {
      const googleCredentialsReq = await fetch(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${data.access_token}`);
      const googleCredentials = (await googleCredentialsReq.json()) as { email: string; family_name: string; given_name: string };
      onSuccess({
        authAccessToken: data.access_token,
        authFirstName: googleCredentials.given_name,
        authLastName: googleCredentials.family_name,
        authEmail: googleCredentials.email,
        authUserSource: UserSource.Google,
      });
    },
    onError: () => {
      setLoading(false);
    },
    error_callback: () => {
      setLoading(false);
    },
  });
  return (
    <Button
      onClick={() => {
        login();
        setLoading(true);
      }}
      loading={loading}
      className="bg-error/70 hover:bg-error/80 w-full"
    >
      {/* <button
      type="button"
      className={cn(
        "w-full p-3 flex justify-center items-center gap-4 shadow-xl text-black-400 font-medium rounded-[40px]",
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
    </button> */}
      <div className="flex items-center gap-3">
        <AiOutlineGooglePlus className="size-6" /> Sign in with Google
      </div>
    </Button>
  );
};

export default GoogleAuthButton;
