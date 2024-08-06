"use client";

import React, { FC, useState } from "react";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import routes from "@/helpers/routes";
import { resendSignUpVerificationCodeAction } from "@/server-actions/user/actions";
import toast from "react-hot-toast";
import { CheckIcon3 } from "../../icons/CheckIcons";
import Button from "../../shared/forms/Button";
import { RemoveIcon2 } from "../../icons/RemoveIcons";

type SignUpFinishProps =
  | { variant: "success"; errorMessage?: never; resetSignUp?: never; email: string }
  | { variant: "error"; errorMessage: string; resetSignUp: () => void; email?: never };

const SignUpFinish: FC<SignUpFinishProps> = ({ variant = "success", errorMessage, resetSignUp, email }) => {
  const router = useRouter();
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
  const handleClick = () => {
    if (variant === "error") {
      resetSignUp!();
    } else {
      resendEmail();
    }
  };
  return (
    <div className="h-full">
      <div
        className={clsx(
          "w-12 h-12 rounded-full flex justify-center items-center mb-4 m-auto",
          variant === "success" ? "bg-success" : "bg-error"
        )}
      >
        {variant === "success" ? <CheckIcon3 color="white" /> : <RemoveIcon2 color="white" />}
      </div>
      <div className="space-y-1 mb-8 md:mb-6">
        <h1 className="text-center text-lg font-medium">{variant === "success" ? "Your request has been sent" : "Something Occurred"}</h1>
        <h2 className="text-center text-sm text-grey-800">
          {variant === "success" ? "Please check your email and confirm your email address" : errorMessage}
        </h2>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Button variant="secondary" onClick={() => router.push(routes.auth.signIn.fullUrl)}>
          Close
        </Button>
        <Button onClick={handleClick} color={variant === "success" ? "default" : "error"} loading={resendLoading}>
          {variant === "success" ? "Resend Email" : "Try Again"}
        </Button>
      </div>
    </div>
  );
};

export default SignUpFinish;
