"use client";

import { GoogleOAuthProvider } from "@react-oauth/google";
import GoogleAuthButton from "./google-auth-button";

const GoogleAuthProvider = ({ onSuccess, pending }: { pending: boolean; onSuccess: (token: string) => void }) => (
  <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_AUTH_GOOGLE_ID || ""}>
    <GoogleAuthButton onSuccess={onSuccess} pending={pending} />
  </GoogleOAuthProvider>
);

export default GoogleAuthProvider;
