"use client";

import Button from "@/components/@new/shared/forms/Button";
import routes from "@/helpers/routes";
import useNotification from "@/hooks/useNotification";
import { getUserAction, resendSignUpVerificationCodeAction, signInUserManuallyAction } from "@/server-actions/user/actions";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";

const AccountActivation = ({
  email,
  errorMessage,
  data,
}: {
  email: string;
  errorMessage?: string | null;
  data: {
    access_token: string;
    refresh_token: string;
  } | null;
}) => {
  const router = useRouter();
  const [resendLoading, setResendLoading] = useState(false);
  const { notify } = useNotification();

  const resendEmail = async () => {
    setResendLoading(true);
    const { errorMessage } = await resendSignUpVerificationCodeAction(email!);
    if (errorMessage) {
      toast.error(errorMessage);
      notify({ title: "Error", description: errorMessage });
    } else {
      notify({ title: "Success", description: "Verification code sent successfully" });
    }
    setResendLoading(false);
  };

  const redirectToParcel = useCallback(async () => {
    const user = await getUserAction();
    if (user) {
      router.push(`${routes.volt.fullUrl}/${localStorage.getItem("voltLastFetchedId")}`);
      localStorage.removeItem("voltLastFetchedId");
    }
  }, [router]);

  useEffect(() => {
    if (!errorMessage && data) {
      notify({ title: "Success", description: "Your email address has been successfully activate. Now you are logged in." });

      signInUserManuallyAction(data);
      if (localStorage.getItem("voltLastFetchedId")) {
        redirectToParcel();
      } else {
        router.push(routes.volt.fullUrl);
      }
    }
  }, [data, errorMessage, notify, redirectToParcel, router]);

  return (
    errorMessage && (
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
          <Button id="acc-verification-close-btn" variant="secondary" onClick={() => router.push(routes.auth.signIn.fullUrl)}>
            Close
          </Button>
          <Button id="acc-verification-resend-btn" onClick={resendEmail} loading={resendLoading}>
            Resend Email
          </Button>
        </div>
      </div>
    )
  );
};

export default AccountActivation;
