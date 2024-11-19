import { EyeIcon1, EyeIcon2 } from "@/components/@new/icons/EyeIcons";
import { LoadingIcon1 } from "@/components/@new/icons/LoadingIcons";
import ResendButton from "@/components/@new/shared/ResendButton";
import ResponsiveModal from "@/components/@new/shared/modals/ResponsiveModal";
import DialogActions from "@/components/@new/shared/modals/dialog/dialog-actions";
import { TextInput } from "@/components/ui/input";
import { cn, maskEmail } from "@/helpers/common";
import useEnterClick from "@/hooks/useEnterClick";
import useNotification from "@/hooks/useNotification";
import { sendResetPasswordVerificationCodeAction, setResetPasswordNewPasswordAction } from "@/server-actions/user/actions";
import { IDecodedAccessToken, IUser } from "@/types/auth";
import { emailSchema, passwordSchema } from "@/zod-validations/auth-validations";
import { FC, useCallback, useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";

enum ForgotPasswordSteps {
  EMAIL,
  VERIFICATION_CODE,
  NEW_PASSWORD,
}

interface ForgotPasswordModalProps {
  open: boolean;
  closeModal: () => void;
  user: IDecodedAccessToken | IUser | null;
}

const renderModalHeader = (step: ForgotPasswordSteps, email?: string) => {
  switch (step) {
    case ForgotPasswordSteps.VERIFICATION_CODE:
      return {
        title: "Enter Code",
        description: `Enter the code we sent to ${email ? maskEmail(email) : ""} `,
      };
    case ForgotPasswordSteps.NEW_PASSWORD:
      return {
        title: "Enter New Password",
        description: `Password should contain minimum 8 characters. Use at least one uppercase letter, numbers & any special characters`,
      };
    default:
      return {
        title: "Forgot Password?",
        description: "Please enter your email address ",
      };
  }
};

const renderButtonsLabel = (step: ForgotPasswordSteps, user: boolean) => {
  switch (step) {
    case ForgotPasswordSteps.VERIFICATION_CODE:
      return {
        closeLabel: user ? "Cancel" : "Back",
        submitLabel: "Continue",
      };
    case ForgotPasswordSteps.NEW_PASSWORD:
      return {
        closeLabel: "Back",
        submitLabel: "Save",
      };
    default:
      return {
        closeLabel: "Cancel",
        submitLabel: "Continue",
      };
  }
};

const RenderContent: FC<ForgotPasswordModalProps> = ({ closeModal, open, user }) => {
  const { notify } = useNotification();
  const [step, setStep] = useState<ForgotPasswordSteps>(ForgotPasswordSteps.EMAIL);
  const [values, setValues] = useState({ email: "", code: "", newPassword: "", repeatNewPassword: "" });
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showRepeatNewPassword, setShowRepeatNewPassword] = useState(false);
  const { title, description } = renderModalHeader(step, values.email);
  const { closeLabel, submitLabel } = renderButtonsLabel(step, !!user);
  const [pending, setPending] = useState(false);

  const onCancel = () => {
    if (step === ForgotPasswordSteps.VERIFICATION_CODE && !user) {
      setStep(ForgotPasswordSteps.EMAIL);
      setValues({ ...values, code: "", newPassword: "", repeatNewPassword: "" });
    }
    if (step === ForgotPasswordSteps.NEW_PASSWORD) {
      setShowNewPassword(false);
      setShowRepeatNewPassword(false);
      setStep(ForgotPasswordSteps.VERIFICATION_CODE);
    } else {
      closeModal();
    }
  };

  const sendResetPasswordVerificationCode = useCallback(async () => {
    setPending(true);
    const { errorMessage } = await sendResetPasswordVerificationCodeAction(values.email);

    if (!errorMessage || errorMessage.includes("You have to wait 1 minute after sending another code")) {
      setStep(ForgotPasswordSteps.VERIFICATION_CODE);
      setPending(false);
    } else {
      closeModal();
    }
    return { errorMessage: errorMessage === "You have to wait 1 minute after sending another code" ? "" : errorMessage };
  }, [closeModal, values.email]);

  const onNext = async () => {
    if (isNextButtonDisabled()) {
      return;
    }

    let error = "";
    if (step === ForgotPasswordSteps.EMAIL) {
      const { errorMessage } = await sendResetPasswordVerificationCode();
      if (errorMessage) {
        error = errorMessage;
      }
    } else if (step === ForgotPasswordSteps.VERIFICATION_CODE) {
      setStep(ForgotPasswordSteps.NEW_PASSWORD);
    } else {
      setPending(true);
      const { errorMessage } = await setResetPasswordNewPasswordAction({
        newPassword: values.newPassword,
        code: values.code,
        email: values.email,
      });
      if (errorMessage) {
        error = errorMessage;
        setPending(false);
      } else {
        notify({ title: "Password Reset", description: "Your password has been successfully changed" });
        closeModal();
      }
    }
    setPending(false);
    if (error) {
      notify({ title: "Password Reset", description: error }, { variant: "error" });
    }
  };

  const isNextButtonDisabled = () => {
    if (step === ForgotPasswordSteps.EMAIL) {
      return !emailSchema.safeParse(values.email).success;
    }
    if (step === ForgotPasswordSteps.VERIFICATION_CODE) {
      return !values.code;
    }
    return !passwordSchema.safeParse(values.newPassword).success || values.newPassword !== values.repeatNewPassword;
  };

  useEnterClick(onNext);

  useEffect(() => {
    if (user && step === ForgotPasswordSteps.EMAIL && values.email) {
      sendResetPasswordVerificationCode();
    }
  }, [user, step, sendResetPasswordVerificationCode, values.email]);

  useEffect(() => {
    if (user) {
      setValues({ ...values, email: user.email });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return (
    <div className={cn("flex flex-col", "h-[70vh]", "md:bg-white md:shadow-3 md:max-w-lg md:w-full md:rounded-2xl md:h-fit")}>
      {user && pending && step === ForgotPasswordSteps.EMAIL ? (
        <LoadingIcon1 className="!size-8 my-auto mx-auto flex md:my-28" color="primary-main" />
      ) : (
        <>
          <IoMdClose className="hidden md:flex size-6 cursor-pointer text-grey-600 ml-auto mt-4 mr-4" onClick={closeModal} />
          <div className="space-y-4 md:space-y-6">
            <div className={cn("border-b border-b-grey-100 px-5 pb-4 pt-1", "md:border-b-0 md:py-0 md:px-8")}>
              <h1 className="font-semibold text-lg">{title}</h1>
              <h2 className="text-grey-800 text-xs">{description}</h2>
            </div>
            <div className="px-5 md:px-8">
              {step === ForgotPasswordSteps.EMAIL && (
                <TextInput
                  placeholder="Enter Your Email"
                  value={values.email}
                  onChange={(e) => setValues({ ...values, email: e.target.value })}
                  id="forgot-password-email-input"
                />
              )}
              {step === ForgotPasswordSteps.VERIFICATION_CODE && (
                <div className="space-y-4">
                  <TextInput
                    id="forgot-password-code-input"
                    placeholder="Code"
                    value={values.code}
                    onChange={(e) => setValues({ ...values, code: e.target.value })}
                  />
                  <ResendButton
                    label="Send New Code"
                    handleResend={async () => {
                      const { errorMessage } = await sendResetPasswordVerificationCodeAction(values.email);
                      if (errorMessage) {
                        throw new Error(errorMessage);
                      }
                    }}
                  />
                </div>
              )}
              {step === ForgotPasswordSteps.NEW_PASSWORD && (
                <div className="space-y-4">
                  <TextInput
                    id="forgot-password-new-password-input"
                    type={showNewPassword ? "text" : "password"}
                    placeholder="New password"
                    value={values.newPassword}
                    onChange={(e) => setValues({ ...values, newPassword: e.target.value })}
                    endIcon={
                      <div className="cursor-pointer" onClick={() => setShowNewPassword(!showNewPassword)}>
                        {showNewPassword ? <EyeIcon1 /> : <EyeIcon2 />}
                      </div>
                    }
                  />
                  <TextInput
                    type={showRepeatNewPassword ? "text" : "password"}
                    placeholder="Re-type new password"
                    id="forgot-password-confirm-new-password-input"
                    value={values.repeatNewPassword}
                    onChange={(e) => setValues({ ...values, repeatNewPassword: e.target.value })}
                    endIcon={
                      <div className="cursor-pointer" onClick={() => setShowRepeatNewPassword(!showRepeatNewPassword)}>
                        {showRepeatNewPassword ? <EyeIcon1 /> : <EyeIcon2 />}
                      </div>
                    }
                  />
                </div>
              )}
            </div>
          </div>
          <DialogActions
            className="!border-t-0 mt-auto md:pt-8"
            closeLabel={closeLabel}
            submitLabel={submitLabel}
            onClose={onCancel}
            onSubmit={onNext}
            submitPending={pending}
            disableSubmit={isNextButtonDisabled()}
          />
        </>
      )}
    </div>
  );
};

const ForgotPasswordModal: FC<ForgotPasswordModalProps> = (props) => {
  const { closeModal, open } = props;

  return (
    <ResponsiveModal
      content={open && <RenderContent {...props} />}
      responsiveContent={open && <RenderContent {...props} />}
      open={open}
      handleClose={closeModal}
    />
  );
};

export default ForgotPasswordModal;
