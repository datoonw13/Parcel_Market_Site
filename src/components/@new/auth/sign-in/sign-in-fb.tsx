"use client";

import { useCallback, useEffect, useState } from "react";
import { UserSource } from "@/types/common";
import FacebookLogin, { ProfileSuccessResponse, SuccessResponse } from "@greatsumini/react-facebook-login";

const SignInFacebook = ({
  onSuccess,
}: {
  onSuccess: (data: {
    authAccessToken: string;
    authFirstName: string;
    authLastName: string;
    authEmail: string;
    userSource: UserSource;
  }) => void;
}) => {
  const [successData, setSuccessData] = useState<SuccessResponse | null>(null);
  const [profileSuccess, setProfileSuccess] = useState<ProfileSuccessResponse | null>(null);

  const handleSubmit = useCallback(async () => {
    if (successData && profileSuccess) {
      onSuccess({
        authAccessToken: successData.accessToken,
        authFirstName: profileSuccess.name?.split(" ")[0]!,
        authLastName: profileSuccess.name?.split(" ")[1]!,
        authEmail: profileSuccess.email!,
        userSource: UserSource.Facebook,
      });
    }
  }, [onSuccess, profileSuccess, successData]);

  useEffect(() => {
    handleSubmit();
  }, [handleSubmit]);

  return (
    <FacebookLogin
      appId="1270724550695755"
      onSuccess={async (data) => {
        setSuccessData(data);
      }}
      onFail={(error) => {
        console.log("Login Failed!", error);
      }}
      onProfileSuccess={(response) => {
        setProfileSuccess(response);
      }}
      fields="name,email"
    />
  );
};

export default SignInFacebook;
