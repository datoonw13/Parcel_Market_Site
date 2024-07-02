"use client";

import React, { FC, useState } from "react";
import dynamic from "next/dynamic";
import { RemoveIcon2 } from "@/components/@new/icons/RemoveIcons";
import Divider from "@/components/@new/shared/Divider";
import TextField from "@/components/@new/shared/forms/TextField";
import { EyeIcon1, EyeIcon2 } from "@/components/@new/icons/EyeIcons";
import Button from "@/components/@new/shared/forms/Button";
import ProfileModalContentWrapper from "../ProfileModalContentWrapper";

const ResponsiveModal = dynamic(() => import("../../../../shared/modals/ResponsiveModal"), { ssr: false });

interface DeleteAccountModalProps {
  open: boolean;
  handleClose: () => void;
}

enum AccountRemoveSteps {
  TYPE_PASSWORD,
  SELECT_REASON,
  CONFIRM_DELETE,
}

const generateModalMeta = (step: AccountRemoveSteps) => {
  switch (step) {
    case AccountRemoveSteps.SELECT_REASON:
      return {
        title: "Deleting your account",
        description: "When you delete your account, all of your saved data will also be deleted.",
      };
    case AccountRemoveSteps.CONFIRM_DELETE:
      return {
        title: "Deleting your account",
        description:
          "We're sorry to see you go. Once the deletion process begins, you won't be able to reactivate your account or retrieve any of the content or information you have added.",
      };
    default:
      return {
        title: "Delete Account",
        description: "For your security, please re-enter your password to continue",
      };
  }
};

const DeleteAccountModalContent: FC<Pick<DeleteAccountModalProps, "handleClose">> = ({ handleClose }) => {
  const [step, setStep] = useState<AccountRemoveSteps>(AccountRemoveSteps.TYPE_PASSWORD);
  const [values, setValues] = useState<{ password: string }>({
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  return (
    <ProfileModalContentWrapper
      title={generateModalMeta(step).title}
      description={generateModalMeta(step).description}
      handleClose={handleClose}
    >
      <div className="flex justify-between flex-col h-full">
        {step === AccountRemoveSteps.TYPE_PASSWORD && (
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
        )}
        <div className="w-full flex flex-col-reverse sm:flex-row gap-3">
          <Button className="w-full" variant="secondary">
            Cancel
          </Button>
          <Button className="w-full">Continue</Button>
        </div>
      </div>
    </ProfileModalContentWrapper>
  );
};

const DeleteAccountModal: FC<DeleteAccountModalProps> = ({ open, handleClose }) => (
  <ResponsiveModal
    content={open && <DeleteAccountModalContent handleClose={handleClose} />}
    responsiveContent={open && <DeleteAccountModalContent handleClose={handleClose} />}
    open={open}
    handleClose={handleClose}
    desktopModalContentClasses="max-w-lg w-full"
  />
);

export default DeleteAccountModal;
