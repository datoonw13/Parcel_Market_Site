import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useGoogleLogin } from "@react-oauth/google";
import { AiOutlineGooglePlus } from "react-icons/ai";

const GoogleAuthButton = ({ onSuccess }: { onSuccess: (token: string) => void }) => {
  const [loading, setLoading] = useState(false);

  const login = useGoogleLogin({
    onSuccess: async (data) => {
      // const googleCredentialsReq = await fetch(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${data.access_token}`);
      // const googleCredentials = (await googleCredentialsReq.json()) as { email: string; family_name: string; given_name: string };
      onSuccess(data.access_token);
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
      <div className="flex items-center gap-3">
        <AiOutlineGooglePlus className="size-6" /> Sign in with Google
      </div>
    </Button>
  );
};

export default GoogleAuthButton;
