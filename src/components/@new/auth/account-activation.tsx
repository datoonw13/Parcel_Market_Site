"use client";

import Button from "@/components/@new/shared/forms/Button";
import routes from "@/helpers/routes";
import { resendSignUpVerificationCodeAction } from "@/server-actions/user/actions";
import { useRouter } from "next/navigation";
import { useState } from "react";

const AccountActivation = ({ email }: { email: string }) => {
  const router = useRouter();
  const [resendLoading, setResendLoading] = useState(false);

  const resendEmail = async () => {
    setResendLoading(true);
    await resendSignUpVerificationCodeAction(email!);
    setResendLoading(false);
  };

  return (
    <div className="sm:p-16">
      <div className="w-12 h-12 rounded-full flex justify-center items-center m-auto bg-info text-white font-semibold rotate-180 text-lg mb-4">
        !
      </div>
      <div className="space-y-1 mb-8 md:mb-6 max-w-96 mx-auto">
        <h1 className="text-center text-lg font-medium">Link has been expired</h1>
        <h2 className="text-center text-sm text-grey-800">
          Your validation link has been expired, please resend request to continue process
        </h2>
      </div>
      <div className="grid grid-cols-2 gap-3  max-w-96 mx-auto">
        <Button variant="secondary" onClick={() => router.push(routes.auth.signIn.fullUrl)}>
          Close
        </Button>
        <Button onClick={resendEmail} loading={resendLoading}>
          Resend Email
        </Button>
      </div>
    </div>
  );
};

export default AccountActivation;