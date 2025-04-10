"use client";

import React, { FC, useState } from "react";
import dynamic from "next/dynamic";
import { EyeIcon1, EyeIcon2 } from "@/components/@new/icons/EyeIcons";
import Button from "@/components/@new/shared/forms/Button";
import RadioButton from "@/components/@new/shared/forms/RadioButton";
import { DeletionAccountReason } from "@/types/auth";
import { logOutUserAction, removeUserAccountAction } from "@/server-actions/user/actions";
import toast from "react-hot-toast";
import TextField from "@/components/@new/shared/forms/text-field";
import useNotification from "@/hooks/useNotification";
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
        title: "Deleting your account",
        description: (
          <span>
            For security reasons, please type <span className="font-extrabold">DELETE</span> in the field below to proceed.
          </span>
        ),
      };
  }
};

const DeleteAccountModalContent: FC<Pick<DeleteAccountModalProps, "handleClose">> = ({ handleClose }) => {
  const [step, setStep] = useState<AccountRemoveSteps>(AccountRemoveSteps.TYPE_PASSWORD);
  const [values, setValues] = useState<{ password: string; deletionResult: DeletionAccountReason | null }>({
    password: "",
    deletionResult: null,
  });
  const [removePending, setRemovePending] = useState(false);
  const { notify } = useNotification();

  const handleNext = async () => {
    if (step !== AccountRemoveSteps.CONFIRM_DELETE) {
      if (step === AccountRemoveSteps.TYPE_PASSWORD && values.password.toLocaleLowerCase() !== "delete") {
        notify({ title: "Error", description: "Please type 'DELETE' exactly as instructed to continue." }, { variant: "error" });
        return;
      }
      setStep(step + 1);
    } else {
      setRemovePending(true);
      if (values.deletionResult && values.password) {
        const { errorMessage } = await removeUserAccountAction({ deletionResult: values.deletionResult });
        if (errorMessage) {
          toast.error(errorMessage);
          setRemovePending(false);
        } else {
          toast.success("Account has been removed");
          await logOutUserAction();
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
            placeholder="Type here"
            type="text"
            value={values.password}
            onChange={(password) => setValues({ ...values, password })}
          />
        )}
        {step === AccountRemoveSteps.SELECT_REASON && (
          <div className="border border-grey-100 rounded-xl p-6 space-y-4">
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
            color={step === AccountRemoveSteps.CONFIRM_DELETE ? "error" : "default"}
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
