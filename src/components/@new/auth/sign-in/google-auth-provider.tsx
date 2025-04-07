"use client";

import { ReactNode } from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { UserSource } from "@/types/common";
import SignInGoogle from "./sign-in-google";

const GoogleAuthProvider = ({
  onSuccess,
}: {
  onSuccess: (data: {
    authAccessToken: string;
    authFirstName: string;
    authLastName: string;
    authEmail: string;
    userSource: UserSource;
  }) => void;
}) => (
  <GoogleOAuthProvider clientId="1044615132913-47b2qev9mdhs25jspgblbqfmg7ndugpd.apps.googleusercontent.com">
    <SignInGoogle onSuccess={onSuccess} />
  </GoogleOAuthProvider>
);

export default GoogleAuthProvider;
