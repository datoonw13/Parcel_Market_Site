"use client";

import React, { FC, useState } from "react";
import dynamic from "next/dynamic";
import { RemoveIcon2 } from "@/components/@new/icons/RemoveIcons";
import Divider from "@/components/@new/shared/Divider";
import TextField from "@/components/@new/shared/forms/TextField";
import { EyeIcon1, EyeIcon2 } from "@/components/@new/icons/EyeIcons";
import Button from "@/components/@new/shared/forms/Button";
import RadioButton from "@/components/@new/shared/forms/RadioButton";
import { DeletionAccountReason } from "@/types/auth";
import { removeUserAccountAction } from "@/server-actions/user-actions";
import toast from "react-hot-toast";
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
  const [values, setValues] = useState<{ password: string; deletionResult: DeletionAccountReason | null }>({
    password: "",
    deletionResult: null,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [removePending, setRemovePending] = useState(false);

  const handleNext = async () => {
    if (step !== AccountRemoveSteps.CONFIRM_DELETE) {
      setStep(step + 1);
    } else {
      setRemovePending(true);
      if (values.deletionResult && values.password) {
        const { error, message } = await removeUserAccountAction({ deletionResult: values.deletionResult, password: values.password });
        if (error) {
          toast.error(message);
          setRemovePending(false);
        }
        if (!error) {
          toast.success("Account has been removed");
        }
      }
    }
  };

  const goBack = () => {
    if (step !== AccountRemoveSteps.TYPE_PASSWORD) {
      setStep(step - 1);
    } else {
      handleClose();
    }
  };
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
        {step === AccountRemoveSteps.SELECT_REASON && (
          <div className="border border-grey-100 rounded-xl p-6 space-y-4">
            <RadioButton
              name={DeletionAccountReason.SoldLand}
              checked={values.deletionResult === DeletionAccountReason.SoldLand}
              onChange={() => setValues({ ...values, deletionResult: DeletionAccountReason.SoldLand })}
              label="Already sold on Parcel Marketplace"
            />
            <RadioButton
              name={DeletionAccountReason.SoldLandOutsideMarket}
              checked={values.deletionResult === DeletionAccountReason.SoldLandOutsideMarket}
              onChange={() => setValues({ ...values, deletionResult: DeletionAccountReason.SoldLandOutsideMarket })}
              label="I have sold my land somewhere else"
            />
            <RadioButton
              name={DeletionAccountReason.NotUseful}
              checked={values.deletionResult === DeletionAccountReason.NotUseful}
              onChange={() => setValues({ ...values, deletionResult: DeletionAccountReason.NotUseful })}
              label="I did not find Parcel Market Useful"
            />
            <RadioButton
              name={DeletionAccountReason.NoDataAccess}
              checked={values.deletionResult === DeletionAccountReason.NoDataAccess}
              onChange={() => setValues({ ...values, deletionResult: DeletionAccountReason.NoDataAccess })}
              label="I could not find the data I needed"
            />
            <RadioButton
              name={DeletionAccountReason.Complicated}
              checked={values.deletionResult === DeletionAccountReason.Complicated}
              onChange={() => setValues({ ...values, deletionResult: DeletionAccountReason.Complicated })}
              label="Parcel Market is too complicated"
            />
            <RadioButton
              name={DeletionAccountReason.TooExpensive}
              checked={values.deletionResult === DeletionAccountReason.TooExpensive}
              onChange={() => setValues({ ...values, deletionResult: DeletionAccountReason.TooExpensive })}
              label="I think the services are too expensive"
            />
          </div>
        )}
        {step === AccountRemoveSteps.CONFIRM_DELETE && <div />}
        <div className="w-full flex flex-col-reverse sm:flex-row gap-3 mt-8">
          <Button className="w-full" variant="secondary" onClick={goBack}>
            Back
          </Button>
          <Button
            className="w-full"
            loading={removePending}
            disabled={
              (step === AccountRemoveSteps.TYPE_PASSWORD && !values.password) ||
              (step === AccountRemoveSteps.SELECT_REASON && !values.deletionResult)
            }
            onClick={handleNext}
          >
            {step === AccountRemoveSteps.CONFIRM_DELETE ? "Delete" : "Continue"}
          </Button>
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
