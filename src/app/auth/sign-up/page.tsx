"use client";

import type { ISignUp } from "@/types/auth";
import Button from "@/components/shared/Button";
import TextField from "@/components/shared/TextField";
import { signUpSchema } from "@/validations/auth-validation";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRegisterMutation } from "@/lib/features/apis/authApi";
import { useRouter } from "next/navigation";
import { usaStatesFull } from "typed-usa-states";
import Select from "@/components/shared/Select";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import routes from "@/helpers/routes";
import { setAuthPending, setAuthedUser } from "@/lib/features/slices/authedUserSlice";

const getAllStates = () =>
  usaStatesFull
    .filter((el) => el.contiguous)
    .map((state) => ({ label: state.name, value: state.abbreviation.toLowerCase(), counties: state.counties }));

const getCounties = (state: string | null) => {
  if (!state) {
    return [];
  }
  const counties = getAllStates().find(({ value }) => value === state)?.counties || [];
  const formattedCounties = counties.map((el) => ({ label: el, value: el.split(" ")[0].toLowerCase() }));
  return formattedCounties;
};

const getStateValue = (state: string | null) => {
  if (!state) {
    return null;
  }
  return getAllStates().find((el) => el.value === state) || null;
};

const getCountyValue = (county: string | null, state: string | null) => {
  if (!county || !state) {
    return null;
  }
  return getCounties(state).find(({ value }) => value === county) || null;
};

const SignUp = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { selectedParcelNumber } = useAppSelector((state) => state.authedUser);
  const [registerUser, { isLoading }] = useRegisterMutation();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setConfirmShowPassword] = useState(false);

  const {
    handleSubmit,
    watch,
    formState: { errors, isSubmitted },
    setValue,
    getValues,
  } = useForm<ISignUp>({
    resolver: yupResolver(signUpSchema),
    defaultValues: {
      confirmPassword: null,
      county: null,
      email: null,
      mailingAddress: null,
      name: null,
      password: null,
      state: null,
    },
  });

  const onSubmit = handleSubmit(async (data) => {
    try {
      const res = await registerUser(data).unwrap();
      router.push(selectedParcelNumber ? routes.propertySearch.signature : routes.home.root);
      localStorage.setItem("token", res.data.user.token);
      dispatch(setAuthPending(true));
    } catch (error) {}
  });

  return (
    <>
      <TextField
        label="Name"
        placeholder="Enter your name"
        onChange={(value) => setValue("name", value || null, { shouldValidate: isSubmitted, shouldDirty: isSubmitted })}
        value={watch("name") || ""}
        name="name"
        error={!!errors.name}
        helperText={errors.name?.message}
      />
      <TextField
        label="Email"
        placeholder="Enter your email"
        onChange={(value) => setValue("email", value || null, { shouldValidate: isSubmitted, shouldDirty: isSubmitted })}
        value={watch("email") || ""}
        name="email"
        error={!!errors.email}
        helperText={errors.email?.message}
      />
      <TextField
        label="Mailing Address"
        placeholder="Your address"
        onChange={(value) => setValue("mailingAddress", value || null, { shouldValidate: isSubmitted, shouldDirty: isSubmitted })}
        value={watch("mailingAddress") || ""}
        name="mailingAddress"
        error={!!errors.mailingAddress}
        helperText={errors.mailingAddress?.message}
      />
      <div className="flex items-baseline gap-6">
        <Select
          value={getStateValue(watch("state"))}
          options={getAllStates()}
          name="state"
          info="your info here"
          label="State"
          placeholder="State"
          error={!!errors?.state}
          helperText={errors?.state?.message}
          onChange={(value) => {
            setValue("state", value, { shouldDirty: isSubmitted, shouldValidate: isSubmitted });
            setValue("county", null);
          }}
        />
        <Select
          options={getCounties(watch("state"))}
          value={getCountyValue(watch("county"), watch("state"))}
          name="county"
          info="your info here"
          label="County"
          placeholder="County"
          error={!!errors?.county}
          helperText={errors?.county?.message}
          disabled={!watch("state")}
          onChange={(value) => setValue("county", value?.split(" ")?.[0].toLowerCase() || "", { shouldDirty: true, shouldValidate: true })}
        />
      </div>
      <TextField
        type={showPassword ? "text" : "password"}
        label="Password"
        placeholder="Enter password"
        endIcon={
          <Button classNames="!p-0" type="none" onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? "hidden" : "show"}
          </Button>
        }
        onChange={(value) => setValue("password", value || null, { shouldValidate: isSubmitted, shouldDirty: isSubmitted })}
        value={watch("password") || ""}
        name="password"
        error={!!errors.password}
        helperText={errors.password?.message}
      />
      <TextField
        type={showConfirmPassword ? "text" : "password"}
        label="Repeat"
        placeholder="Repeat password"
        endIcon={
          <Button classNames="!p-0" type="none" onClick={() => setConfirmShowPassword(!showPassword)}>
            {showConfirmPassword ? "hidden" : "show"}
          </Button>
        }
        onChange={(value) => setValue("confirmPassword", value || null, { shouldValidate: isSubmitted, shouldDirty: isSubmitted })}
        value={watch("confirmPassword") || ""}
        name="confirmPassword"
        error={!!errors.confirmPassword}
        helperText={errors.confirmPassword?.message}
      />
      <Button loading={isLoading} onClick={onSubmit}>
        Create Account
      </Button>
    </>
  );
};

export default SignUp;
