"use client";

import clsx from "clsx";
import { useGoogleLogin } from "@react-oauth/google";
import { useState } from "react";
import GoogleAuthProvider from "./google-auth-provider";
import { GoogleIcon1 } from "../../icons/SocialNetworkIcons";
import { LoadingIcon1 } from "../../icons/LoadingIcons";

const SignInGoogle = () => {
  const [loading, setLoading] = useState(false);
  const login = useGoogleLogin({
    onSuccess: (token) => {
      console.log(token);
      setLoading(false);
      // onSuccess(token);
    },
    onError: () => {
      setLoading(false);
    },
    error_callback: () => {
      setLoading(false);
    },
  });

  return (
    <button
      type="button"
      className={clsx(
        "w-full p-3 flex justify-center items-center gap-4 shadow-[0px_2px_3px_0px_rgba(0,0,0,0.17)] text-black-400 font-medium rounded-[40px]"
      )}
      onClick={() => {
        setLoading(true);
        login();
      }}
      disabled={loading}
    >
      <GoogleIcon1 />
      Continue with Google
      {loading && <LoadingIcon1 className="fill-black-400" />}
    </button>
  );
};

export default SignInGoogle;
