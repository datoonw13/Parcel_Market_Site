import React, { FC, useEffect, useState } from "react";
import Divider from "@/components/@new/shared/Divider";
import AutoComplete from "@/components/@new/shared/forms/AutoComplete";
import CheckBox from "@/components/@new/shared/forms/CheckBox";
import { getAllStates } from "@/helpers/states";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { userSignUpValidation } from "@/zod-validations/auth-validations";
import { IUserSignUp } from "@/types/auth";
import routes from "@/helpers/routes";
import { googleSignUpUserAction, signUpUserAction } from "@/server-actions/user/actions";
import { useRouter, useSearchParams } from "next/navigation";
import useNotification from "@/hooks/useNotification";
import { subscribeAction } from "@/server-actions/common-actions";
import { NumberInput, TextInput } from "@/components/ui/input";
import Button from "../../shared/forms/Button";
import { EyeIcon1, EyeIcon2 } from "../../icons/EyeIcons";
import GoogleAuthProvider from "../sign-in/google-auth-provider";

interface SignUpProps {
  onBack: () => void;
  registrationReasons: IUserSignUp["registrationReasons"];
  onFinish: (errorMessage?: string, email?: string) => void;
}

const SignUp: FC<SignUpProps> = ({ registrationReasons, onBack, onFinish }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const access_token = searchParams.get("access_token");
  const firstName = searchParams.get("firstName");
  const lastName = searchParams.get("lastName");
  const email = searchParams.get("email");
  const isGoogleUser = access_token && firstName && lastName && email;
  const { notify } = useNotification();
  const [visiblePassword, setVisiblePassword] = useState(false);
  const [visibleRepeatPassword, setVisibleRepeatPassword] = useState(false);
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
      sendEmailTips: false,
    },
  });

  const onSubmit = handleSubmit(async (data) => {
    if (isGoogleUser) {
      const { data: requestData, errorMessage } = await googleSignUpUserAction(data, access_token);
      if (errorMessage) {
        notify({ title: errorMessage }, { variant: "error" });
      } else {
        if (params.get("from")) {
          const fromUrl = params.get("from");
          params.delete("from");
          params.set("from", routes.auth.signIn.fullUrl);
          const newLocation = `${fromUrl}?${params.toString()}`;
          router.replace(newLocation);
          return;
        }
        router.replace(requestData?.payload.planSelected ? routes.home.fullUrl : routes.userSubscription.fullUrl);
      }
    } else {
      if (data.sendEmailTips) {
        await subscribeAction(data.email);
      }
      const request = await signUpUserAction(data);
      if (request?.errorMessage) {
        onFinish(request.errorMessage);
      } else {
        onFinish(undefined, watch("email"));
      }
    }
  });

  useEffect(() => {
    if (isGoogleUser) {
      reset({ ...getValues(), email, firstName, lastName });
    }
  }, [access_token, email, firstName, getValues, isGoogleUser, lastName, reset, searchParams]);

  return (
    <>
      <div>
        <h1 className="font-semibold text-2xl md:text-5xl text-center">Sign Up</h1>
        <h3 className="text-grey-800 mt-3 text-center">Create account</h3>
      </div>
      <div className="w-full max-w-72 flex">
        <GoogleAuthProvider />
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
          />
          <TextInput
            onChange={(e) => setValue("email", e.target.value, { shouldValidate: isSubmitted })}
            required
            className="w-full"
            label="Email Address"
            disabled={!!isGoogleUser}
            value={watch("email")}
            error={!!errors.email}
          />
          <TextInput
            onChange={(e) => setValue("streetName", e.target.value, { shouldValidate: isSubmitted })}
            required
            className="w-full"
            label="Address"
            value={watch("streetName")}
            error={!!errors.streetName}
          />
          <TextInput
            onChange={(e) => setValue("unitNumber", e.target.value, { shouldValidate: isSubmitted })}
            className="w-full"
            label="Unit Number"
            value={watch("unitNumber")}
            error={!!errors.unitNumber}
          />
          <AutoComplete
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
                />
                {errors.repeatPassword && <p className="text-xss text-error font-medium">{errors.repeatPassword.message}</p>}
              </div>
            </>
          )}
        </div>
        <CheckBox
          onChange={() => setValue("sendEmailTips", !watch("sendEmailTips"))}
          label="Send me emails with tips on how to find talent that fits my needs."
          className="col-span-2"
        />
        <CheckBox
          error={!!errors.agreeTerm}
          checked={watch("agreeTerm")}
          onChange={() => setValue("agreeTerm", !watch("agreeTerm"), { shouldValidate: isSubmitted })}
          label={
            <p>
              Yes, I understand and agree to the Parcel Market
              <Link href="/">
                <span className="underline text-primary-main px-1">Terms of Service</span>
              </Link>
              and
              <Link href="/">
                <span className="underline text-primary-main px-1">Privacy Policy.</span>
              </Link>
            </p>
          }
          className="col-span-2"
        />
      </div>
      <div className="w-full flex flex-col-reverse sm:flex-row justify-between items-center gap-4">
        <p className="text-center font-medium text-sm">
          Already have an account?{" "}
          <Link href={routes.auth.signIn.url}>
            <span className="underline text-primary-main font-medium text-sm">Sign In</span>
          </Link>
        </p>
        <div className="flex gap-3 flex-col-reverse sm:flex-row w-full sm:w-fit items-center sm:items-end">
          <Button className="w-full max-w-96 sm:w-fit" variant="secondary" onClick={onBack}>
            Back
          </Button>
          <Button className="w-full max-w-96 sm:w-fit" onClick={onSubmit} loading={isSubmitting} disabled={!watch("agreeTerm")}>
            Create Account
          </Button>
        </div>
      </div>
    </>
  );
};

export default SignUp;
