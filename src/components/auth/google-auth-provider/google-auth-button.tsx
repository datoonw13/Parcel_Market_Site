import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useGoogleLogin } from "@react-oauth/google";
import { AiOutlineGooglePlus } from "react-icons/ai";

const GoogleAuthButton = ({
  onSuccess,
  pending,
  label,
  disabled,
}: {
  disabled?: boolean;
  onSuccess: (token: string) => void;
  pending: boolean;
  label: string;
}) => {
  const [loading, setLoading] = useState(false);

  const login = useGoogleLogin({
    onSuccess: async (data) => {
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
      disabled={disabled}
      onClick={() => {
        login();
        setLoading(true);
      }}
      loading={loading || pending}
      className="bg-error/70 hover:bg-error/80 w-full"
    >
      <div className="flex items-center gap-3">
        <AiOutlineGooglePlus className="size-6" /> {label}
      </div>
    </Button>
  );
};

export default GoogleAuthButton;
