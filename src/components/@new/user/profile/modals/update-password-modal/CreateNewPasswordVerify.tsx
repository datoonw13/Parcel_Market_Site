"use client";

import ResendButton from "@/components/@new/shared/ResendButton";
import Button from "@/components/@new/shared/forms/Button";
import { sendPasswordResetCodeAction, setNewPasswordAction } from "@/server-actions/user/actions";
import { FC, useState } from "react";
// import toast from "react-hot-toast";
import TextField from "@/components/@new/shared/forms/text-field";
import useNotification from "@/hooks/useNotification";

interface CreateNewPasswordVerifyProps {
  passwords: { oldPassword: string; newPassword: string };
  handleClose: () => void;
}
const CreateNewPasswordVerify: FC<CreateNewPasswordVerifyProps> = ({ passwords, handleClose }) => {
  const [codeSending, setCodeSending] = useState(false);
  const [passwordUpdating, setPasswordUpdating] = useState(false);
  const [code, setCode] = useState("");
  const { notify } = useNotification();

  const handleResend = async () => {
    setCodeSending(true);
    const { errorMessage } = await sendPasswordResetCodeAction(passwords);
    setCodeSending(false);
    if (errorMessage) {
      notify({ title: "Error", description: errorMessage }, { variant: "error" });
      throw Error();
    }
  };

  const onSubmit = async () => {
    setPasswordUpdating(true);
    const { errorMessage } = await setNewPasswordAction({ code, newPassword: passwords.newPassword });
    if (errorMessage) {
      notify({ title: "Error", description: errorMessage }, { variant: "error" });
      setPasswordUpdating(false);
    } else {
      notify({ title: "Information Has been updated", description: "Your Information has been successfully Updated." });
      handleClose();
    }
  };

  return (
    <div className="flex flex-col justify-between h-full">
      <div className="space-y-4">
        <TextField placeholder="Code" value={code} onChange={(value) => setCode(value)} />
        <ResendButton
          handleResend={async () => {
            await handleResend();
          }}
        />
      </div>
      <div className="w-full flex flex-col-reverse sm:flex-row gap-3 mt-8">
        <Button className="w-full" variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button className="w-full" disabled={codeSending || !code} loading={passwordUpdating} onClick={onSubmit}>
          Continue
        </Button>
      </div>
    </div>
  );
};

export default CreateNewPasswordVerify;
