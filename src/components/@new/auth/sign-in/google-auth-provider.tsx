"use client";

import { ReactNode } from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import SignInGoogle from "./sign-in-google";

const GoogleAuthProvider = () => (
  <GoogleOAuthProvider clientId="428513511195-dcmr74bq5f6sitpidje63os8kq58ktpe.apps.googleusercontent.com">
    <SignInGoogle />
  </GoogleOAuthProvider>
);

export default GoogleAuthProvider;
