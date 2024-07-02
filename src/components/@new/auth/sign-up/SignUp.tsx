import React, { FC, useMemo, useState } from "react";
import Divider from "@/components/@new/shared/Divider";
import AutoComplete from "@/components/@new/shared/forms/AutoComplete";
import GoogleButton from "@/components/@new/shared/forms/Button/GoogleButton";
import CheckBox from "@/components/@new/shared/forms/CheckBox";
import { getAllStates, getCitiesByState } from "@/helpers/states";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { userSignUpValidation } from "@/zod-validations/auth-validations";
import { IUserSignUp } from "@/types/auth";
import routes from "@/helpers/routes";
import { signUpUserAction } from "@/server-actions/user-actions";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Button from "../../shared/forms/Button";
import TextField from "../../shared/forms/TextField";
import { EyeIcon1, EyeIcon2 } from "../../icons/EyeIcons";

interface SignUpProps {
  onBack: () => void;
  registrationReason: IUserSignUp["registrationReason"];
}
const SignUp: FC<SignUpProps> = ({ registrationReason, onBack }) => {
  const router = useRouter();
  const [visiblePassword, setVisiblePassword] = useState(false);
  const [visibleRepeatPassword, setVisibleRepeatPassword] = useState(false);
  const {
    handleSubmit,
    formState: { isSubmitted, errors, isSubmitting },
    setValue,
    watch,
  } = useForm<IUserSignUp>({
    resolver: zodResolver(userSignUpValidation),
    defaultValues: {
      city: "",
      email: "",
      firstName: "",
      lastName: "",
      password: "",
      postalCode: "",
      state: "",
      streetName: "",
      unitNumber: "",
      registrationReason,
      agreeTerm: false,
      sendEmailTips: false,
      repeatPassword: "",
    },
  });
  const selectedState = watch("state");

  const cities = useMemo(() => getCitiesByState(selectedState), [selectedState]);

  const onSubmit = handleSubmit(async (data) => {
    const { error, message } = await signUpUserAction(data);
    if (error && message) {
      toast.error(message);
    }
    if (!error && message) {
      toast.success(message, { duration: 3000 });
      router.replace(`/${routes.home.url}`);
    }
  });

  return (
    <>
      <div>
        <h1 className="font-semibold text-2xl md:text-5xl text-center">Sign Up</h1>
        <h3 className="text-grey-800 mt-3 text-center">Create account</h3>
      </div>
      <GoogleButton className="!w-fit px-14" onClick={() => {}} />
      <Divider label="OR" className="my-1.5" />
      <div className="w-full flex flex-col sm:grid sm:grid-cols-2 gap-4">
        <TextField
          onChange={(value) => setValue("firstName", value, { shouldValidate: isSubmitted })}
          required
          className="w-full"
          label="First Name"
          value={watch("firstName")}
          error={!!errors.firstName}
        />
        <TextField
          onChange={(value) => setValue("lastName", value, { shouldValidate: isSubmitted })}
          required
          className="w-full"
          label="Last Name"
          value={watch("lastName")}
          error={!!errors.lastName}
        />
        <TextField
          onChange={(value) => setValue("email", value, { shouldValidate: isSubmitted })}
          required
          className="w-full"
          label="Email Address"
          value={watch("email")}
          error={!!errors.email}
        />
        <TextField
          onChange={(value) => setValue("streetName", value, { shouldValidate: isSubmitted })}
          required
          className="w-full"
          label="Street Address"
          value={watch("streetName")}
          error={!!errors.streetName}
        />
        <TextField
          onChange={(value) => setValue("unitNumber", value, { shouldValidate: isSubmitted })}
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
            setValue("city", "", { shouldValidate: isSubmitted });
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
        <AutoComplete
          options={cities}
          getOptionLabel={(item) => item.label}
          getOptionKey={(item) => item.value}
          onChange={(item) => setValue("city", item?.value ?? "", { shouldValidate: isSubmitted })}
          placeholder="City"
          value={cities.find((el) => el.value === watch("city")) || null}
          onFilter={(searchValue, items) =>
            items.filter((item) => item.label.toLocaleLowerCase().includes(searchValue.toLocaleLowerCase()))
          }
          required
          disabled={!watch("state")}
          getSelectedOption={(item) => item.value === watch("city")}
          error={!!errors.city}
        />
        <TextField
          required
          className="w-full"
          label="Postal Code"
          onChange={(value) => setValue("postalCode", value, { shouldValidate: isSubmitted })}
          value={watch("postalCode")}
          error={!!errors.postalCode}
        />
        <TextField
          className="w-full"
          label="Password"
          value={watch("password")}
          onChange={(value) => setValue("password", value, { shouldValidate: isSubmitted })}
          type={visiblePassword ? "text" : "password"}
          endIcon={
            <div className="cursor-pointer" onClick={() => setVisiblePassword(!visiblePassword)}>
              {visiblePassword ? <EyeIcon1 /> : <EyeIcon2 />}
            </div>
          }
          error={!!errors.password}
        />
        <TextField
          value={watch("repeatPassword")}
          onChange={(value) => setValue("repeatPassword", value, { shouldValidate: isSubmitted })}
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
          <Button className="w-full max-w-96 sm:w-fit" onClick={onSubmit} loading={isSubmitting}>
            Create Account
          </Button>
        </div>
      </div>
    </>
  );
};

export default SignUp;
