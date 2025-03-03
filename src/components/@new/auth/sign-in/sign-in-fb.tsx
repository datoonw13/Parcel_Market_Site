"use client";

import { useCallback, useEffect, useState } from "react";
import useAuth from "@/hooks/useAuth";
import { thirdPartyAuthAction } from "@/server-actions/auth/auth";
import { UserSource } from "@/types/common";
import FacebookLogin, { ProfileSuccessResponse, SuccessResponse } from "@greatsumini/react-facebook-login";

const SignInFacebook = () => {
  const { thirdPartyAuth } = useAuth();

  const [successData, setSuccessData] = useState<SuccessResponse | null>(null);
  const [profileSuccess, setProfileSuccess] = useState<ProfileSuccessResponse | null>(null);

  const handleSubmit = useCallback(async () => {
    if (successData && profileSuccess) {
      const { data: requestData, errorMessage } = await thirdPartyAuthAction(successData.accessToken, UserSource.Facebook);
      if (errorMessage) {
        thirdPartyAuth.error({
          authAccessToken: successData.accessToken,
          authFirstName: profileSuccess.name?.split(" ")[0]!,
          authLastName: profileSuccess.name?.split(" ")[1]!,
          authEmail: profileSuccess.email!,
        });
      } else {
        thirdPartyAuth.success(requestData?.decodedAccessToken.planSelected);
      }
    }
  }, [profileSuccess, successData, thirdPartyAuth]);

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
