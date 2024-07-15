"use client";

import React, { FC, useState } from "react";
import dynamic from "next/dynamic";
import Button from "@/components/@new/shared/forms/Button";
import { IUser } from "@/types/auth";
import TextField from "@/components/@new/shared/forms/TextField";
import { EyeIcon1, EyeIcon2 } from "@/components/@new/icons/EyeIcons";
import { sendEmailResetCodeAction, setNewEmailAction } from "@/server-actions/user/actions";
import toast from "react-hot-toast";
import { emailSchema } from "@/zod-validations/auth-validations";
import { maskEmail } from "@/helpers/common";
import ResendButton from "@/components/@new/shared/ResendButton";
import ProfileModalContentWrapper from "../ProfileModalContentWrapper";

const ResponsiveModal = dynamic(() => import("../../../../shared/modals/ResponsiveModal"), { ssr: false });

interface UpdateEmailModalProps {
  open: boolean;
  handleClose: () => void;
  user: IUser;
}

enum UpdateEmailSteps {
  PASSWORD,
  NEW_EMAIL,
  CODE,
}

const generateModalMeta = (step: UpdateEmailSteps, user: IUser, newEmail: string) => {
  switch (step) {
    case UpdateEmailSteps.NEW_EMAIL:
      return {
        title: "Enter New Email",
        description: `Please enter your new email address and we will send you code to confirm this changes`,
      };
    case UpdateEmailSteps.CODE:
      return {
        title: "Change Email",
        description: `Enter the code we sent to ${maskEmail(newEmail)}`,
      };
    default:
      return {
        title: "Change Email",
        description: `Your current email is ${user.email}`,
      };
  }
};

const UpdateEmailModalContent: FC<Pick<UpdateEmailModalProps, "handleClose" | "user">> = ({ handleClose, user }) => {
  const [step, setStep] = useState<UpdateEmailSteps>(UpdateEmailSteps.PASSWORD);
  const [pending, setPending] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [values, setValues] = useState({
    password: "",
    email: "",
    code: "",
  });
  const { description, title } = generateModalMeta(step, user, values.email);

  const handleCodeSend = async ({ resend }: { resend?: boolean }) => {
    setPending(true);
    const { errorMessage } = await sendEmailResetCodeAction({ password: values.password, newEmail: values.email });
    if (!errorMessage) {
      !resend && setStep(UpdateEmailSteps.CODE);
      setPending(false);
      return { error: false };
    }

    toast.error(errorMessage);
    setPending(false);

    return { error: true };
  };

  const handleEmailUpdate = async () => {
    setPending(true);
    const { errorMessage } = await setNewEmailAction({ code: values.code, email: values.email });
    if (!errorMessage) {
      handleClose();
    } else {
      toast.error(errorMessage);
      setPending(false);
    }
  };

  const handleNext = async () => {
    if (step === UpdateEmailSteps.PASSWORD) {
      setStep(UpdateEmailSteps.NEW_EMAIL);
    }
    if (step === UpdateEmailSteps.NEW_EMAIL) {
      await handleCodeSend({ resend: false });
    }
    if (step === UpdateEmailSteps.CODE) {
      await handleEmailUpdate();
    }
  };

  const goBack = () => {
    if (step === UpdateEmailSteps.PASSWORD) {
      handleClose();
    } else {
      setStep(step - 1);
    }
  };

  return (
    <ProfileModalContentWrapper title={title} description={description} handleClose={handleClose}>
      <div className="flex justify-between flex-col h-full">
        {step === UpdateEmailSteps.PASSWORD && (
          <div className="space-y-4">
            <TextField
              placeholder="Enter Your Password"
              type={showPassword ? "text" : "password"}
              endIcon={
                <div className="cursor-pointer" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeIcon1 /> : <EyeIcon2 />}
                </div>
              }
              value={values.password}
              onChange={(password) => setValues({ ...values, password })}
            />
            <button type="button" className="font-medium text-xs text-primary-main">
              Forgot Password?
            </button>
          </div>
        )}
        {step === UpdateEmailSteps.NEW_EMAIL && (
          <TextField placeholder="Enter New Email Address" value={values.email} onChange={(email) => setValues({ ...values, email })} />
        )}
        {step === UpdateEmailSteps.CODE && (
          <div className="space-y-4">
            <TextField placeholder="Code" value={values.code} onChange={(code) => setValues({ ...values, code })} />
            <ResendButton
              handleResend={async () => {
                const { error } = await handleCodeSend({ resend: true });
                if (error) {
                  throw new Error();
                }
              }}
            />
          </div>
        )}
        <div className="w-full flex flex-col-reverse md:grid md:grid-cols-2 gap-3 mt-8">
          <Button className="w-full" variant="secondary" onClick={goBack}>
            Back
          </Button>
          <Button
            className="w-full"
            disabled={
              (step === UpdateEmailSteps.PASSWORD && !values.password) ||
              (step === UpdateEmailSteps.NEW_EMAIL && !emailSchema.safeParse(values.email).success) ||
              (step === UpdateEmailSteps.CODE && !values.code)
            }
            loading={pending}
            onClick={handleNext}
          >
            {step === UpdateEmailSteps.CODE ? "Change Email" : "Continue"}
          </Button>
        </div>
      </div>
    </ProfileModalContentWrapper>
  );
};

const UpdateEmailModal: FC<UpdateEmailModalProps> = ({ open, handleClose, user }) => (
  <ResponsiveModal
    content={open && <UpdateEmailModalContent handleClose={handleClose} user={user} />}
    responsiveContent={open && <UpdateEmailModalContent handleClose={handleClose} user={user} />}
    open={open}
    handleClose={handleClose}
    desktopModalContentClasses="max-w-lg w-full"
  />
);

export default UpdateEmailModal;
