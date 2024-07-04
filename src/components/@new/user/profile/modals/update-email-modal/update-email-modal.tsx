"use client";

import React, { FC, useState } from "react";
import dynamic from "next/dynamic";
import Button from "@/components/@new/shared/forms/Button";
import { IUser } from "@/types/auth";
import TextField from "@/components/@new/shared/forms/TextField";
import { EyeIcon1, EyeIcon2 } from "@/components/@new/icons/EyeIcons";
import { Password } from "@mui/icons-material";
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

const generateModalMeta = (step: UpdateEmailSteps, user: IUser) => {
  switch (step) {
    case UpdateEmailSteps.NEW_EMAIL:
      return {
        title: "Deleting your account",
        description: "When you delete your account, all of your saved data will also be deleted.",
      };
    case UpdateEmailSteps.CODE:
      return {
        title: "Deleting your account",
        description:
          "We're sorry to see you go. Once the deletion process begins, you won't be able to reactivate your account or retrieve any of the content or information you have added.",
      };
    default:
      return {
        title: "Change Email",
        description: "For your security, please re-enter your password to continue",
      };
  }
};

const UpdateEmailModalContent: FC<Pick<UpdateEmailModalProps, "handleClose" | "user">> = async ({ handleClose, user }) => {
  const [step, setStep] = useState<UpdateEmailSteps>(UpdateEmailSteps.PASSWORD);
  const [showPassword, setShowPassword] = useState(false);
  const [values, setValues] = useState({
    password: "",
  });
  // const modalMeta = generateModalMeta(step, null);

  const handleNext = async () => {};

  const goBack = () => {};
  return (
    <ProfileModalContentWrapper title={''} description={''} handleClose={handleClose}>
      <div className="flex justify-between flex-col h-full">
        {step === UpdateEmailSteps.PASSWORD && (
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
        <div className="w-full flex flex-col-reverse sm:flex-row gap-3 mt-8">
          <Button className="w-full" variant="secondary" onClick={goBack}>
            Back
          </Button>
          <Button
            className="w-full"
            // loading={removePending}
            // disabled={
            //   (step === AccountRemoveSteps.TYPE_PASSWORD && !values.password) ||
            //   (step === AccountRemoveSteps.SELECT_REASON && !values.deletionResult)
            // }
            onClick={handleNext}
          >
            Test
            {/* {step === AccountRemoveSteps.CONFIRM_DELETE ? "Delete" : "Continue"} */}
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
