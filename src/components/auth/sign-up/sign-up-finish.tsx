"use client";

import React, { FC, useState } from "react";
import clsx from "clsx";
import { resendSignUpVerificationCodeAction } from "@/server-actions/user/actions";
import toast from "react-hot-toast";
import { FaCheck } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { Button } from "@/components/ui/button";

interface SignUpFinishPropsProps {
  errorMessage: string | null;
  email: string | null;
  resetSignUp: () => void;
}

const SignUpFinish: FC<SignUpFinishPropsProps> = ({ email, errorMessage, resetSignUp }) => {
  const [resendLoading, setResendLoading] = useState(false);

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
        <h1 className="text-center text-lg font-medium">Your request has been sent</h1>
        <h2 className="text-center text-sm text-grey-800">Please check your email and confirm your email address</h2>
      </div>
      <div className="flex justify-center">
        <Button
          onClick={() => {
            resendEmail();
          }}
          loading={resendLoading}
        >
          Resend Email
        </Button>
      </div>
    </div>
  );
};

export default SignUpFinish;
