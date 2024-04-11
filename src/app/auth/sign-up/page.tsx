"use client";

import type { ISignUp } from "@/types/auth";
import Button from "@/components/shared/Button";
import TextField from "@/components/shared/TextField";
import { signUpSchema } from "@/validations/auth-validation";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRegisterMutation } from "@/lib/features/apis/authApi";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const SignUp = () => {
  const router = useRouter();
  const [registerUser, { isLoading }] = useRegisterMutation();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setConfirmShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ISignUp>({ resolver: yupResolver(signUpSchema) });

  const onSubmit = handleSubmit(async (data) => {
    try {
      const res = await registerUser(data).unwrap();
      toast.success(res.message);
      router.push(`/sign-in`);
    } catch (error) {}
  });
  return (
    <>
      <TextField
        label="Name"
        placeholder="Enter your name"
        register={register}
        name="name"
        error={!!errors.name}
        helperText={errors.name?.message}
      />
      <TextField
        label="Email"
        placeholder="Enter your email"
        register={register}
        name="email"
        error={!!errors.email}
        helperText={errors.email?.message}
      />
      <TextField
        label="Mailing Address"
        placeholder="Your address"
        register={register}
        name="mailingAddress"
        error={!!errors.mailingAddress}
        helperText={errors.mailingAddress?.message}
      />
      <div className="flex gap-6">
        <TextField
          info="your info here"
          label="State"
          placeholder="State"
          register={register}
          name="state"
          error={!!errors.state}
          helperText={errors.state?.message}
        />
        <TextField
          info="your info here"
          label="County"
          placeholder="County"
          register={register}
          name="county"
          error={!!errors.county}
          helperText={errors.county?.message}
        />
      </div>
      <TextField
        type={showPassword ? "text" : "password"}
        label="Password"
        placeholder="Enter password"
        endIcon={
          <Button classNames="!p-0" type="text" onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? "hidden" : "show"}
          </Button>
        }
        register={register}
        name="password"
        error={!!errors.password}
        helperText={errors.password?.message}
      />
      <TextField
        type={showConfirmPassword ? "text" : "password"}
        label="Repeat"
        placeholder="Repeat password"
        endIcon={
          <Button classNames="!p-0" type="text" onClick={() => setConfirmShowPassword(!showPassword)}>
            {showConfirmPassword ? "hidden" : "show"}
          </Button>
        }
        register={register}
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
