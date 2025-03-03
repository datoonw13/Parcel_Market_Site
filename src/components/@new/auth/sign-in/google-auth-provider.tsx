"use client";

import { ReactNode } from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import SignInGoogle from "./sign-in-google";

const GoogleAuthProvider = () => (
  <GoogleOAuthProvider clientId="1044615132913-47b2qev9mdhs25jspgblbqfmg7ndugpd.apps.googleusercontent.com">
    <SignInGoogle />
  </GoogleOAuthProvider>
);

export default GoogleAuthProvider;
