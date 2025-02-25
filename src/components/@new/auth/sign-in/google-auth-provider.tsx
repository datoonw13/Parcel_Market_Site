"use client";

import { ReactNode } from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import SignInGoogle from "./sign-in-google";

const GoogleAuthProvider = ({ onSuccess }: { onSuccess?: () => void }) => (
  <GoogleOAuthProvider clientId="1044615132913-47b2qev9mdhs25jspgblbqfmg7ndugpd.apps.googleusercontent.com">
    <SignInGoogle onSuccess={onSuccess} />
  </GoogleOAuthProvider>
);

export default GoogleAuthProvider;
