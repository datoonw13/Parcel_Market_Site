"use client";

import React, { FC, useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { useRouter, useSearchParams } from "next/navigation";
import { resendSignUpVerificationCodeAction } from "@/server-actions/user/actions";
import toast from "react-hot-toast";
import { ITokens, UserSource } from "@/types/common";
import { FaCheck } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { setAuthTokens } from "@/server-actions/auth/auth";
import { Button } from "@/components/ui/button";

interface SignUpFinishPropsProps {
  errorMessage: string | null;
  email: string | null;
  resetSignUp: () => void;
  onSuccessRedirect: () => void;
  tokens: ITokens | null;
}

const SignUpFinish: FC<SignUpFinishPropsProps> = ({ email, errorMessage, resetSignUp, tokens, onSuccessRedirect }) => {
  const router = useRouter();
  const params = useSearchParams();
  const [resendLoading, setResendLoading] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  const resendEmail = async () => {
    setResendLoading(true);
    const { errorMessage } = await resendSignUpVerificationCodeAction(email!);
    if (errorMessage) {
      toast.error(errorMessage);
    } else {
      toast.success("Verification code sent successfully");
    }
    setResendLoading(false);
  };

  useEffect(() => {
    if (tokens) {
      timerRef.current = setTimeout(() => {
        setAuthTokens((tokens as ITokens).refresh_token, (tokens as ITokens).access_token);
        onSuccessRedirect();
      }, 5000);
    }

    return () => {
      window.clearTimeout(timerRef.current);
    };
  }, [onSuccessRedirect, router, tokens]);

  if (errorMessage) {
    return (
      <div className="h-full">
        <div className={clsx("w-12 h-12 rounded-full flex justify-center items-center mb-4 m-auto bg-error")}>
          <IoClose className="text-white size-6" />
        </div>
        <div className="space-y-1 mb-8 md:mb-6">
          <h1 className="text-center text-lg font-medium">Something Occurred</h1>
          <h2 className="text-center text-sm text-grey-800">{errorMessage && errorMessage}</h2>
        </div>
        <div className="flex justify-center">
          <Button onClick={resetSignUp} color="error" className="bg-error/70 hover:bg-error w-full">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full">
      <div className={clsx("w-12 h-12 rounded-full flex justify-center items-center mb-4 m-auto bg-success")}>
        <FaCheck className="text-white size-5" />
      </div>
      <div className="space-y-1 mb-8 md:mb-6">
        <h1 className="text-center text-lg font-medium">{!tokens ? "Your request has been sent" : "Registration Successfully"}</h1>
        <h2 className="text-center text-sm text-grey-800">
          {!tokens
            ? "Please check your email and confirm your email address"
            : "Welcome to Parcel Market. You are now registered and ready to explore"}
        </h2>
      </div>
      <div className="flex justify-center">
        <Button
          onClick={() => {
            if (!tokens) {
              resendEmail();
              return;
            }
            setAuthTokens((tokens as ITokens).refresh_token, (tokens as ITokens).access_token);
            onSuccessRedirect();
          }}
          loading={resendLoading}
        >
          {!tokens ? "Resend Email" : "Continue"}
        </Button>
      </div>
    </div>
  );
};

export default SignUpFinish;
