"use client";

import { useState } from "react";
import { GoogleOAuthProvider, useGoogleLogin } from "@react-oauth/google";
import { UserSource } from "@/types/common";
import GoogleAuthButton from "./google-auth-button";

const GoogleAuthProvider = ({
  onSuccess,
}: {
  onSuccess: (data: {
    authAccessToken: string;
    authFirstName: string;
    authLastName: string;
    authEmail: string;
    authUserSource: UserSource;
  }) => void;
}) => (
  <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_AUTH_GOOGLE_ID || ""}>
    <GoogleAuthButton onSuccess={onSuccess} />
  </GoogleOAuthProvider>
);

export default GoogleAuthProvider;
