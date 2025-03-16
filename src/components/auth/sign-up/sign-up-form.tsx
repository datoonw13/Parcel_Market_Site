import { FC, ReactElement, useEffect, useMemo, useState } from "react";
import Divider from "@/components/@new/shared/Divider";
import CheckBox from "@/components/@new/shared/forms/CheckBox";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { userSignUpValidation } from "@/zod-validations/auth-validations";
import { IUserSignUp } from "@/types/auth";
import { useSearchParams } from "next/navigation";
import { TextInput } from "@/components/ui/input";
import { TermsConditionsDialog } from "@/components/shared/terms-conditions";
import { PrivacyPolicyDialog } from "@/components/shared/privacy-policy";
import { UserSource } from "@/types/common";
import { signUpUserAction } from "@/server-actions/auth/auth";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { Button } from "@/components/ui/button";

interface SignUpFormProps {
  goBack: () => void;
  registrationReasons: IUserSignUp["registrationReasons"];
  showSignIn: () => void;
  onFinish: (data: { isError: true; errorMessage: string } | { isError: false; email: string }) => void;
  authProviders?: () => ReactElement;
  onSubmit: (data: IUserSignUp & { userSource: UserSource }) => void;
}

const SignUpForm: FC<SignUpFormProps> = ({ registrationReasons, goBack, showSignIn, onFinish, authProviders: AuthProviders, onSubmit }) => {
  const searchParams = useSearchParams();
  const params = useMemo(() => new URLSearchParams(searchParams.toString()), [searchParams]);
  const [openTermsDialog, setTermsDialog] = useState(false);
  const [openPrivacyDialog, setPrivacyDialog] = useState(false);
  const [visiblePassword, setVisiblePassword] = useState(false);
  const [visibleRepeatPassword, setVisibleRepeatPassword] = useState(false);
  const isThirdPartyAuth = params.get("authUserSource") === UserSource.Facebook || params.get("authUserSource") === UserSource.Google;
  const {
    handleSubmit,
    formState: { isSubmitted, errors, isSubmitting },
    setValue,
    watch,
    getValues,
    reset,
  } = useForm<IUserSignUp>({
    resolver: zodResolver(userSignUpValidation(isThirdPartyAuth)),
    defaultValues: {
      email: "",
      firstName: "",
      lastName: "",
      registrationReasons,
      subscribeToEmail: false,
    },
  });

  const onClick = handleSubmit((data) => onSubmit({ ...data, userSource: (params.get("userSource") as UserSource) || UserSource.System }));

  useEffect(() => {
    if (params.get("authUserSource") && params.get("authUserSource") !== UserSource.System) {
      const email = params.get("authEmail");
      const firstName = params.get("authFirstName");
      const lastName = params.get("authLastName");
      if (email && firstName && lastName) {
        reset({
          ...getValues(),
          email,
          firstName,
          lastName,
        });
      }
    }
  }, [getValues, params, reset, searchParams]);

  return (
    <>
      <TermsConditionsDialog open={openTermsDialog} closeModal={() => setTermsDialog(false)} />
      <PrivacyPolicyDialog open={openPrivacyDialog} closeModal={() => setPrivacyDialog(false)} />
      <div>
        <h1 className="font-semibold text-2xl md:text-5xl text-center">Sign Up</h1>
        <h3 className="text-grey-800 mt-3 text-center">Create account</h3>
      </div>
      {AuthProviders && <AuthProviders />}
      <Divider label="OR" className="my-1.5" />
      <div className="w-full flex flex-col gap-4">
        <div className="w-full grid grid-cols-1 gap-4 sm:grid-cols-2">
          <TextInput
            onChange={(e) => {
              if (/^[a-zA-Z]+$/.test(e.target.value) || e.target.value === "") {
                setValue("firstName", e.target.value, { shouldValidate: isSubmitted });
              }
            }}
            required
            className="w-full"
            label="First Name"
            value={watch("firstName")}
            error={!!errors.firstName}
            id="sign-up-firstname-input"
          />
          <TextInput
            onChange={(e) => {
              if (/^[a-zA-Z]+$/.test(e.target.value) || e.target.value === "") {
                setValue("lastName", e.target.value, { shouldValidate: isSubmitted });
              }
            }}
            required
            className="w-full"
            label="Last Name"
            value={watch("lastName")}
            error={!!errors.lastName}
            id="sign-up-lastname-input"
          />
          <TextInput
            onChange={(e) => setValue("email", e.target.value, { shouldValidate: isSubmitted })}
            required
            className="w-full"
            label="Email Address"
            disabled={!!isThirdPartyAuth}
            value={watch("email")}
            error={!!errors.email}
            id="sign-up-email-input"
          />
          {!isThirdPartyAuth && (
            <>
              <div className="space-y-1">
                <TextInput
                  className="w-full"
                  label="Password"
                  value={watch("password") || ""}
                  onChange={(e) => setValue("password", e.target.value, { shouldValidate: isSubmitted })}
                  type={visiblePassword ? "text" : "password"}
                  endIcon={
                    <div className="cursor-pointer" onClick={() => setVisiblePassword(!visiblePassword)}>
                      {visiblePassword ? <FaRegEye /> : <FaRegEyeSlash />}
                    </div>
                  }
                  error={!!errors.password}
                  id="sign-up-password-input"
                />
                {errors.password && <p className="text-xss text-error font-medium">{errors.password.message}</p>}
              </div>
              <div className="space-y-1">
                <TextInput
                  value={watch("repeatPassword") || ""}
                  onChange={(e) => setValue("repeatPassword", e.target.value, { shouldValidate: isSubmitted })}
                  className="w-full"
                  label="Retype Password"
                  type={visibleRepeatPassword ? "text" : "password"}
                  endIcon={
                    <div className="cursor-pointer" onClick={() => setVisibleRepeatPassword(!visibleRepeatPassword)}>
                      {visibleRepeatPassword ? <FaRegEye /> : <FaRegEyeSlash />}
                    </div>
                  }
                  error={!!errors.repeatPassword}
                  id="sign-up-repeatPassword-input"
                />
                {errors.repeatPassword && <p className="text-xss text-error font-medium">{errors.repeatPassword.message}</p>}
              </div>
            </>
          )}
        </div>
        <CheckBox
          onChange={() => setValue("subscribeToEmail", !watch("subscribeToEmail"))}
          label="Click here to receive news and updates from Parcel Market."
          className="col-span-2"
        />
        <CheckBox
          error={!!errors.agreeTerm}
          checked={watch("agreeTerm")}
          onChange={() => setValue("agreeTerm", !watch("agreeTerm"), { shouldValidate: isSubmitted })}
          label={
            <p>
              Yes, I understand and agree to the Parcel Market
              <span onClick={() => setTermsDialog(true)} className="underline text-primary-main cursor-pointer px-1">
                Terms of Service
              </span>
              and
              <span onClick={() => setPrivacyDialog(true)} className="underline text-primary-main cursor-pointer px-1">
                Privacy Policy.
              </span>
            </p>
          }
          className="col-span-2"
        />
      </div>
      <div className="w-full flex flex-col-reverse sm:flex-row justify-between items-center gap-4">
        <p className="text-center font-medium text-sm">
          Already have an account?{" "}
          <span
            id="sign-up-signin-redirect-button"
            className="underline text-primary-main font-medium text-sm cursor-pointer"
            onClick={showSignIn}
          >
            Sign In
          </span>
        </p>
        <div className="flex gap-3 flex-col-reverse sm:flex-row w-full sm:w-fit items-center sm:items-end">
          <Button id="sign-up-back-input" className="w-full max-w-96 sm:w-fit" variant="secondary" onClick={goBack}>
            Back
          </Button>
          <Button
            id="sign-up-accept-input"
            className="w-full max-w-96 sm:w-fit"
            onClick={onClick}
            loading={isSubmitting}
            disabled={!watch("agreeTerm")}
          >
            Create Account
          </Button>
        </div>
      </div>
    </>
  );
};

export default SignUpForm;
