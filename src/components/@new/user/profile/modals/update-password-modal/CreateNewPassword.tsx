"use client";

import { EyeIcon1, EyeIcon2 } from "@/components/@new/icons/EyeIcons";
import Button from "@/components/@new/shared/forms/Button";
import { sendPasswordResetCodeAction } from "@/server-actions/user/actions";
import { userPasswordResetValidations } from "@/zod-validations/auth-validations";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import useNotification from "@/hooks/useNotification";
import { TextInput } from "@/components/ui/input";

const CreateNewPassword = ({
  onNext,
  handleClose,
  openForgotPasswordModal,
}: {
  onNext: (oldPassword: string, newPassword: string) => void;
  handleClose: () => void;
  openForgotPasswordModal: () => void;
}) => {
  const { notify } = useNotification();
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    repeatNew: false,
  });

  const {
    handleSubmit,
    formState: { isSubmitted, errors, isSubmitting },
    setValue,
    watch,
  } = useForm<z.infer<typeof userPasswordResetValidations>>({
    resolver: zodResolver(userPasswordResetValidations),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      repeatNewPassword: "",
    },
  });

  const onSubmit = handleSubmit(async (data) => {
    const { errorMessage } = await sendPasswordResetCodeAction(data);
    if (errorMessage) {
      notify({ title: "Error", description: errorMessage }, { variant: "error" });
    } else {
      onNext(data.oldPassword, data.newPassword);
    }
  });

  return (
    <>
      <div className="space-y-4 mb-8">
        <TextInput
          placeholder="Current password"
          type={showPassword.current ? "text" : "password"}
          endIcon={
            <div className="cursor-pointer" onClick={() => setShowPassword({ ...showPassword, current: !showPassword.current })}>
              {showPassword.current ? <EyeIcon1 /> : <EyeIcon2 />}
            </div>
          }
          value={watch("oldPassword")}
          onChange={(e) => setValue("oldPassword", e.target.value, { shouldValidate: isSubmitted })}
          error={!!errors.oldPassword}
        />
        <div className="space-y-1">
          <TextInput
            placeholder="New password"
            type={showPassword.new ? "text" : "password"}
            endIcon={
              <div className="cursor-pointer" onClick={() => setShowPassword({ ...showPassword, new: !showPassword.new })}>
                {showPassword.new ? <EyeIcon1 /> : <EyeIcon2 />}
              </div>
            }
            value={watch("newPassword")}
            onChange={(e) => setValue("newPassword", e.target.value, { shouldValidate: isSubmitted })}
            error={!!errors.newPassword}
          />
          {errors.newPassword && <p className="text-xss text-error font-medium">{errors.newPassword.message}</p>}
        </div>
        <div className="space-y-1">
          <TextInput
            placeholder="Re-type password"
            type={showPassword.repeatNew ? "text" : "password"}
            endIcon={
              <div className="cursor-pointer" onClick={() => setShowPassword({ ...showPassword, repeatNew: !showPassword.repeatNew })}>
                {showPassword.repeatNew ? <EyeIcon1 /> : <EyeIcon2 />}
              </div>
            }
            value={watch("repeatNewPassword")}
            onChange={(e) => setValue("repeatNewPassword", e.target.value, { shouldValidate: isSubmitted })}
            error={!!errors.repeatNewPassword}
          />
          {errors.repeatNewPassword && <p className="text-xss text-error font-medium">{errors.repeatNewPassword.message}</p>}
        </div>
        <Button
          onClick={openForgotPasswordModal}
          variant="secondary"
          className="!outline-none !text-xs !font-medium !text-primary-main !p-0"
        >
          Forgot Password?
        </Button>
      </div>
      <div className="w-full flex flex-col-reverse sm:flex-row gap-3 mt-auto md:mt-8">
        <Button className="w-full" variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button className="w-full" onClick={onSubmit} disabled={Object.values(watch()).some((el) => !el)} loading={isSubmitting}>
          Continue
        </Button>
      </div>
    </>
  );
};

export default CreateNewPassword;
