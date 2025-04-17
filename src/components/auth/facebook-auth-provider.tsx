"use client";

import { useCallback, useEffect, useState } from "react";
import { UserSource } from "@/types/common";
import FacebookLogin, { ProfileSuccessResponse, SuccessResponse } from "@greatsumini/react-facebook-login";
import { FaFacebookF } from "react-icons/fa6";
import { Button } from "../ui/button";

const FacebookAuthProvider = ({
  onSuccess,
  pending,
  label,
  disabled,
}: {
  disabled?: boolean;
  label: string;
  pending: boolean;
  onSuccess: (token: string) => void;
}) => {
  const [successData, setSuccessData] = useState<SuccessResponse | null>(null);
  const [profileSuccess, setProfileSuccess] = useState<ProfileSuccessResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = useCallback(async () => {
    if (successData && profileSuccess) {
      onSuccess(successData.accessToken);
    }
  }, [onSuccess, profileSuccess, successData]);

  useEffect(() => {
    handleSubmit();
  }, [handleSubmit]);

  return (
    <FacebookLogin
      appId={process.env.NEXT_PUBLIC_FB_ID || ""}
      onSuccess={async (data) => {
        setSuccessData(data);
        setLoading(false);
      }}
      onProfileSuccess={(response) => {
        setProfileSuccess(response);
      }}
      onFail={() => {
        setLoading(false);
      }}
      fields="name,email"
      render={(onClick) => (
        <Button
          disabled={disabled}
          onClick={() => {
            setLoading(true);
            onClick.onClick && onClick.onClick();
          }}
          loading={!onClick.onClick || loading || pending}
          className="bg-blue-900/70 hover:bg-blue-900/80 w-full"
        >
          <div className="flex items-center gap-3">
            <FaFacebookF className="size-4" /> {label}
          </div>
        </Button>
      )}
    />
  );
};

export default FacebookAuthProvider;
