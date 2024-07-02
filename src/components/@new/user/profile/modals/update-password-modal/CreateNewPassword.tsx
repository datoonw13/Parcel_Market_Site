"use client";

import { EyeIcon1, EyeIcon2 } from "@/components/@new/icons/EyeIcons";
import Button from "@/components/@new/shared/forms/Button";
import TextField from "@/components/@new/shared/forms/TextField";
import { sendPasswordResetCodeAction } from "@/server-actions/user-actions";
import { userPasswordResetValidations } from "@/zod-validations/auth-validations";
import { useState } from "react";
import toast from "react-hot-toast";

const CreateNewPassword = ({ onNext, handleClose }: { onNext: (oldPassword: string, newPassword: string) => void, handleClose: () => void }) => {
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    repeatNew: false,
  });
  const [values, setValues] = useState({
    oldPassword: "",
    newPassword: "",
    repeatNewPassword: "",
  });
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    setLoading(true);
    const { error, message } = await sendPasswordResetCodeAction({ newPassword: values.newPassword, oldPassword: values.oldPassword });
    if (error) {
      toast.error(message);
      setLoading(false);
    } else {
      onNext(values.oldPassword, values.newPassword);
    }
  };
  return (
    <>
      <div className="space-y-4">
        <TextField
          placeholder="Current password"
          type={showPassword.current ? "text" : "password"}
          endIcon={
            <div className="cursor-pointer" onClick={() => setShowPassword({ ...showPassword, current: !showPassword.current })}>
              {showPassword.current ? <EyeIcon1 /> : <EyeIcon2 />}
            </div>
          }
          value={values.oldPassword}
          onChange={(oldPassword) => setValues({ ...values, oldPassword })}
        />
        <TextField
          placeholder="New password"
          type={showPassword.new ? "text" : "password"}
          endIcon={
            <div className="cursor-pointer" onClick={() => setShowPassword({ ...showPassword, new: !showPassword.new })}>
              {showPassword.new ? <EyeIcon1 /> : <EyeIcon2 />}
            </div>
          }
          value={values.newPassword}
          onChange={(newPassword) => setValues({ ...values, newPassword })}
        />
        <TextField
          placeholder="Re-type password"
          type={showPassword.repeatNew ? "text" : "password"}
          endIcon={
            <div className="cursor-pointer" onClick={() => setShowPassword({ ...showPassword, repeatNew: !showPassword.repeatNew })}>
              {showPassword.repeatNew ? <EyeIcon1 /> : <EyeIcon2 />}
            </div>
          }
          value={values.repeatNewPassword}
          onChange={(repeatNewPassword) => setValues({ ...values, repeatNewPassword })}
        />
        <button type="button" className="font-medium text-xs text-primary-main">
          Forgot Password?
        </button>
      </div>
      <div className="w-full flex flex-col-reverse sm:flex-row gap-3 mt-8">
        <Button className="w-full" variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button className="w-full" onClick={onSubmit} loading={loading} disabled={!userPasswordResetValidations.safeParse(values).success}>
          Continue
        </Button>
      </div>
    </>
  );
};

export default CreateNewPassword;
