"use client";

import React, { FC, useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import routes from "@/helpers/routes";
import { resendSignUpVerificationCodeAction } from "@/server-actions/user/actions";
import toast from "react-hot-toast";
import { ITokens, UserSource } from "@/types/common";
import { FaCheck } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { setAuthTokens } from "@/server-actions/auth/auth";
import Button from "../../shared/forms/Button";

type SignUpFinishProps =
  | {
      variant: "success";
      errorMessage?: never;
      resetSignUp?: never;
      email: string;
      userSource: UserSource;
      modal?: {
        showSignIn: () => void;
        onRegister: () => void;
        onAuth: () => void;
        closeModal: () => void;
      };
      tokens: ITokens | null;
    }
  | {
      variant: "error";
      errorMessage: string;
      resetSignUp: () => void;
      email?: never;
      userSource: UserSource;
      modal?: {
        showSignIn: () => void;
        onRegister: () => void;
        onAuth: () => void;
        closeModal: () => void;
      };
      tokens?: unknown;
    };

const SignUpFinish: FC<SignUpFinishProps> = ({ variant = "success", errorMessage, resetSignUp, email, userSource, modal, tokens }) => {
  const router = useRouter();
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
  const handleClick = () => {
    if (variant === "error") {
      resetSignUp!();
      return;
    }
    if (variant === "success" && !(userSource === UserSource.System || userSource === UserSource.Unknown)) {
      setAuthTokens((tokens as ITokens).refresh_token, (tokens as ITokens).access_token);
      if (modal) {
        modal.closeModal();
        modal.onAuth();
        return;
      }
      router.push(routes.home.fullUrl);
      return;
    }
    resendEmail();
  };

  useEffect(
    () => () => {
      if (variant === "success" && tokens) {
        setAuthTokens((tokens as ITokens).refresh_token, (tokens as ITokens).access_token);
      }
    },
    [tokens, variant]
  );

  useEffect(() => {
    if (variant === "success" && !(userSource === UserSource.System || userSource === UserSource.Unknown)) {
      timerRef.current = setTimeout(() => {
        setAuthTokens((tokens as ITokens).refresh_token, (tokens as ITokens).access_token);
        if (modal) {
          modal.closeModal();
          modal.onAuth();
          return;
        }
        router.push(routes.home.fullUrl);
      }, 5000);
    }

    return () => {
      window.clearTimeout(timerRef.current);
    };
  }, [modal, router, tokens, userSource, variant]);

  return (
    <div className="h-full">
      <div
        className={clsx(
          "w-12 h-12 rounded-full flex justify-center items-center mb-4 m-auto",
          variant === "success" ? "bg-success" : "bg-error"
        )}
      >
        {variant === "success" ? <FaCheck className="text-white size-5" /> : <IoClose className="text-white size-6" />}
      </div>
      <div className="space-y-1 mb-8 md:mb-6">
        <h1 className="text-center text-lg font-medium">
          {variant === "error" && "Something Occurred"}
          {variant === "success" && (userSource === UserSource.System || userSource === UserSource.Unknown) && "Your request has been sent"}
          {variant === "success" && !(userSource === UserSource.System || userSource === UserSource.Unknown) && "Registration Successfully"}
        </h1>
        <h2 className="text-center text-sm text-grey-800">
          {errorMessage && errorMessage}
          {variant === "success" &&
            (userSource === UserSource.System || userSource === UserSource.Unknown) &&
            "Please check your email and confirm your email address"}
          {variant === "success" &&
            !(userSource === UserSource.System || userSource === UserSource.Unknown) &&
            "Welcome to Parcel Market. You are now registered and"}
        </h2>
      </div>
      <div className="flex justify-center">
        <Button onClick={handleClick} color={variant === "success" ? "default" : "error"} loading={resendLoading}>
          {variant === "error" && "Try Again"}
          {variant === "success" && (userSource === UserSource.System || userSource === UserSource.Unknown) && "Resend Email"}
          {variant === "success" && !(userSource === UserSource.System || userSource === UserSource.Unknown) && "Continue"}
        </Button>
      </div>
    </div>
  );
};

export default SignUpFinish;
