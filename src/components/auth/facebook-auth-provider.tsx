"use client";

import { useCallback, useEffect, useState } from "react";
import { UserSource } from "@/types/common";
import FacebookLogin, { ProfileSuccessResponse, SuccessResponse } from "@greatsumini/react-facebook-login";
import { FaFacebookF } from "react-icons/fa6";
import { Button } from "../ui/button";

const FacebookAuthProvider = ({
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
  const [successData, setSuccessData] = useState<SuccessResponse | null>(null);
  const [profileSuccess, setProfileSuccess] = useState<ProfileSuccessResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = useCallback(async () => {
    if (successData && profileSuccess) {
      onSuccess({
        authAccessToken: successData.accessToken,
        authFirstName: profileSuccess.name?.split(" ")[0]!,
        authLastName: profileSuccess.name?.split(" ")[1]!,
        authEmail: profileSuccess.email!,
        authUserSource: UserSource.Facebook,
      });
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
          onClick={() => {
            setLoading(true);
            onClick.onClick && onClick.onClick();
          }}
          loading={!onClick.onClick || loading}
          className="bg-blue-900/70 hover:bg-blue-900/80 w-full"
        >
          <div className="flex items-center gap-3">
            <FaFacebookF className="size-4" /> Sign in with Facebook
          </div>
        </Button>
      )}
    />
  );
};

export default FacebookAuthProvider;
