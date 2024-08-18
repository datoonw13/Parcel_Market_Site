import { LoadingIcon1 } from "@/components/@new/icons/LoadingIcons";
import ResendButton from "@/components/@new/shared/ResendButton";
import TextField from "@/components/@new/shared/forms/text-field";
import ResponsiveModal from "@/components/@new/shared/modals/ResponsiveModal";
import DialogActions from "@/components/@new/shared/modals/dialog/dialog-actions";
import { cn, maskEmail } from "@/helpers/common";
import useNotification from "@/hooks/useNotification";
import LoadingCircle from "@/icons/LoadingCircle";
import {
  resetPasswordVerificationCodeVerifyAction,
  sendResetPasswordVerificationCodeAction,
  setResetPasswordNewPasswordAction,
} from "@/server-actions/user/actions";
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
        description: `Your password must be at least 8 characters and should include a combination of numbers, letters and special characters (!$@%).`,
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
        closeLabel: "Cancel",
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
  const [values, setValues] = useState({ email: "", code: "", password: "", repeatPassword: "" });
  const { title, description } = renderModalHeader(step, values.email);
  const { closeLabel, submitLabel } = renderButtonsLabel(step, !!user);
  const [pending, setPending] = useState(false);

  const onCancel = () => {
    if (step === ForgotPasswordSteps.VERIFICATION_CODE && !user) {
      setStep(ForgotPasswordSteps.EMAIL);
      setValues({ ...values, code: "" });
    } else {
      closeModal();
    }
  };

  const sendResetPasswordVerificationCode = useCallback(async () => {
    setPending(true);
    const { errorMessage } = await sendResetPasswordVerificationCodeAction(values.email);
    if (!errorMessage) {
      setStep(ForgotPasswordSteps.VERIFICATION_CODE);
      setPending(false);
    } else {
      closeModal();
    }
    return { errorMessage };
  }, [closeModal, values.email]);

  const onNext = async () => {
    let error = "";
    if (step === ForgotPasswordSteps.EMAIL) {
      const { errorMessage } = await sendResetPasswordVerificationCode();
      if (errorMessage) {
        error = errorMessage;
      }
    } else if (step === ForgotPasswordSteps.VERIFICATION_CODE) {
      setPending(true);
      const { errorMessage } = await resetPasswordVerificationCodeVerifyAction(values.code);
      if (errorMessage) {
        error = errorMessage;
      } else {
        setStep(ForgotPasswordSteps.NEW_PASSWORD);
      }
      setPending(false);
    } else {
      setPending(true);
      const { errorMessage } = await setResetPasswordNewPasswordAction(values.code);
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
    return !passwordSchema.safeParse(values.password).success || values.password !== values.repeatPassword;
  };

  useEffect(() => {
    if (user && step === ForgotPasswordSteps.EMAIL) {
      sendResetPasswordVerificationCode();
    }
  }, [user, step, sendResetPasswordVerificationCode]);

  useEffect(() => {
    if (user) {
      setValues({ ...values, email: user.email });
    }
  }, [user, values]);

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
                <TextField placeholder="Enter Your Email" value={values.email} onChange={(email) => setValues({ ...values, email })} />
              )}
              {step === ForgotPasswordSteps.VERIFICATION_CODE && (
                <div className="space-y-4">
                  <TextField placeholder="Code" value={values.code} onChange={(code) => setValues({ ...values, code })} />
                  <ResendButton
                    label="Send New Code"
                    handleResend={async () => {
                      const { errorMessage } = await sendResetPasswordVerificationCodeAction(values.email);
                      if (errorMessage) {
                        throw new Error();
                      }
                    }}
                  />
                </div>
              )}
              {step === ForgotPasswordSteps.NEW_PASSWORD && (
                <div className="space-y-4">
                  <TextField
                    placeholder="New password"
                    value={values.password}
                    onChange={(password) => setValues({ ...values, password })}
                  />
                  <TextField
                    placeholder="Re-type new password"
                    value={values.repeatPassword}
                    onChange={(repeatPassword) => setValues({ ...values, repeatPassword })}
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
