import React, { FC, useEffect, useState } from "react";
import Divider from "@/components/@new/shared/Divider";
import AutoComplete from "@/components/@new/shared/forms/AutoComplete";
import CheckBox from "@/components/@new/shared/forms/CheckBox";
import { getAllStates } from "@/helpers/states";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { userSignUpValidation } from "@/zod-validations/auth-validations";
import { IDecodedAccessToken, IUserSignUp } from "@/types/auth";
import routes from "@/helpers/routes";
import { googleSignUpUserAction, signUpUserAction } from "@/server-actions/user/actions";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import useNotification from "@/hooks/useNotification";
import { subscribeAction } from "@/server-actions/common-actions";
import { NumberInput, TextInput } from "@/components/ui/input";
import { TermsConditionsDialog } from "@/components/shared/terms-conditions";
import { PrivacyPolicyDialog } from "@/components/shared/privacy-policy";
import { decode, JwtPayload } from "jsonwebtoken";
import Button from "../../shared/forms/Button";
import { EyeIcon1, EyeIcon2 } from "../../icons/EyeIcons";
import GoogleAuthProvider from "../sign-in/google-auth-provider";

interface SignUpProps {
  onBack: () => void;
  registrationReasons: IUserSignUp["registrationReasons"];
  onFinish: (errorMessage?: string, email?: string) => void;
  onSignInClick?: () => void;
  googleAuth: {
    redirectOnSignUp?: (data: { email: string; firstName: string; lastName: string; accessToken: string }) => void;
    onSuccessFinish: () => void;
  };
}

const SignUp: FC<SignUpProps> = ({ registrationReasons, onBack, onFinish, onSignInClick, googleAuth }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams.toString());
  const access_token = searchParams.get("access_token");
  const firstName = searchParams.get("firstName");
  const lastName = searchParams.get("lastName");
  const email = searchParams.get("email");
  const isGoogleUser = access_token && firstName && lastName && email;
  const { notify } = useNotification();
  const [openTermsDialog, setTermsDialog] = useState(false);
  const [openPrivacyDialog, setPrivacyDialog] = useState(false);
  const [visiblePassword, setVisiblePassword] = useState(false);
  const [visibleRepeatPassword, setVisibleRepeatPassword] = useState(false);
  const pathname = usePathname();
  const {
    handleSubmit,
    formState: { isSubmitted, errors, isSubmitting },
    setValue,
    watch,
    getValues,
    reset,
  } = useForm<IUserSignUp>({
    resolver: zodResolver(userSignUpValidation(!!isGoogleUser)),
    defaultValues: {
      city: "",
      email: "",
      firstName: "",
      lastName: "",
      postalCode: "",
      state: "",
      streetName: "",
      unitNumber: "",
      registrationReasons,
      agreeTerm: false,
      subscribeToEmail: false,
    },
  });

  const onSubmit = handleSubmit(async (data) => {
    const source = document.referrer || searchParams.get("utm_source") || "no referrer";
    if (isGoogleUser) {
      const { data: requestData, errorMessage } = await googleSignUpUserAction({ ...data, source }, access_token);
      if (errorMessage) {
        notify({ title: errorMessage }, { variant: "error" });
      } else {
        if (googleAuth.onSuccessFinish) {
          googleAuth.onSuccessFinish();
          return;
        }
        if (params.get("from")) {
          const fromUrl = params.get("from");
          params.delete("from");
          params.set("from", routes.auth.signIn.fullUrl);
          const newLocation = `${fromUrl}?${params.toString()}`;
          router.replace(newLocation);
          return;
        }

        const decodeAccessToken = decode(requestData?.access_token || "");
        const planSelected =
          decodeAccessToken &&
          typeof decodeAccessToken === "object" &&
          (decodeAccessToken as JwtPayload & IDecodedAccessToken).planSelected;

        router.replace(planSelected ? routes.home.fullUrl : routes.userSubscription.fullUrl);
      }
    } else {
      const request = await signUpUserAction({ ...data, source });
      if (request?.errorMessage) {
        onFinish(request.errorMessage);
      } else {
        onFinish(undefined, watch("email"));
      }
    }
  });

  const onGoogleAuthRedirectSignup = (data: { email: string; firstName: string; lastName: string; accessToken: string }) => {
    if (googleAuth.redirectOnSignUp) {
      googleAuth.redirectOnSignUp(data);
    } else {
      router.push(
        `${routes.auth.signUp.fullUrl}?access_token=${data.accessToken}&firstName=${data.firstName}&lastName=${data.lastName}&email=${data.email}`
      );
    }
  };

  useEffect(() => {
    if (isGoogleUser) {
      reset({ ...getValues(), email, firstName, lastName });
    }
  }, [access_token, email, firstName, getValues, isGoogleUser, lastName, reset, searchParams]);

  return (
    <>
      <TermsConditionsDialog open={openTermsDialog} closeModal={() => setTermsDialog(false)} />
      <PrivacyPolicyDialog open={openPrivacyDialog} closeModal={() => setPrivacyDialog(false)} />
      <div>
        <h1 className="font-semibold text-2xl md:text-5xl text-center">Sign Up</h1>
        <h3 className="text-grey-800 mt-3 text-center">Create account</h3>
      </div>
      <div className="w-full max-w-72 flex">
        <GoogleAuthProvider redirectOnSignUp={onGoogleAuthRedirectSignup} onSuccessFinish={() => {}} />
      </div>
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
            disabled={!!isGoogleUser}
            value={watch("email")}
            error={!!errors.email}
            id="sign-up-email-input"
          />
          <TextInput
            onChange={(e) => setValue("streetName", e.target.value, { shouldValidate: isSubmitted })}
            required
            className="w-full"
            label="Street Address"
            value={watch("streetName")}
            error={!!errors.streetName}
            id="sign-up-streetName-input"
          />
          <TextInput
            onChange={(e) => setValue("unitNumber", e.target.value, { shouldValidate: isSubmitted })}
            className="w-full"
            label="Unit Number"
            value={watch("unitNumber")}
            error={!!errors.unitNumber}
            id="sign-up-unitNumber-input"
          />
          <AutoComplete
            id="sign-up-state-input"
            options={getAllStates()}
            getOptionLabel={(item) => item.label}
            getOptionKey={(item) => item.value}
            onChange={(item) => {
              setValue("state", item?.value ?? "", { shouldValidate: isSubmitted });
            }}
            placeholder="State"
            value={getAllStates().find((el) => el.value === watch("state")) || null}
            onFilter={(searchValue, items) =>
              items.filter((item) => item.label.toLocaleLowerCase().includes(searchValue.toLocaleLowerCase()))
            }
            required
            getSelectedOption={(item) => item.value === watch("state")}
            error={!!errors.state}
          />
          <TextInput
            required
            className="w-full row-start-6 sm:row-start-auto"
            label="City"
            onChange={(e) => {
              if (/^[a-zA-Z]+$/.test(e.target.value) || e.target.value === "") {
                setValue("city", e.target.value, { shouldValidate: isSubmitted });
              }
            }}
            value={watch("city")}
            error={!!errors.city}
            id="sign-up-city-input"
          />
          <NumberInput
            required
            className="w-full"
            label="Postal Code"
            onValueChange={(e) => setValue("postalCode", e.value, { shouldValidate: isSubmitted })}
            value={watch("postalCode")}
            error={!!errors.postalCode}
            thousandSeparator={false}
            decimalScale={0}
            id="sign-up-postalCode-input"
          />
          {!isGoogleUser && (
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
                      {visiblePassword ? <EyeIcon1 /> : <EyeIcon2 />}
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
                      {visibleRepeatPassword ? <EyeIcon1 /> : <EyeIcon2 />}
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
            onClick={() => {
              if (onSignInClick) {
                onSignInClick();
              } else {
                router.push(routes.auth.signIn.fullUrl);
              }
            }}
          >
            Sign In
          </span>
        </p>
        <div className="flex gap-3 flex-col-reverse sm:flex-row w-full sm:w-fit items-center sm:items-end">
          <Button id="sign-up-back-input" className="w-full max-w-96 sm:w-fit" variant="secondary" onClick={onBack}>
            Back
          </Button>
          <Button
            id="sign-up-accept-input"
            className="w-full max-w-96 sm:w-fit"
            onClick={onSubmit}
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

export default SignUp;
