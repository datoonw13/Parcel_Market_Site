"use client";

import { ReactNode } from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import SignInGoogle from "./sign-in-google";

const GoogleAuthProvider = ({
  onSuccessFinish,
  redirectOnSignUp,
}: {
  onSuccessFinish: (accessToken: string) => void;
  redirectOnSignUp: (data: { email: string; firstName: string; lastName: string; accessToken: string }) => void;
}) => (
  <GoogleOAuthProvider clientId="1044615132913-47b2qev9mdhs25jspgblbqfmg7ndugpd.apps.googleusercontent.com">
    <SignInGoogle onSuccessFinish={onSuccessFinish} redirectOnSignUp={redirectOnSignUp} />
  </GoogleOAuthProvider>
);

export default GoogleAuthProvider;
