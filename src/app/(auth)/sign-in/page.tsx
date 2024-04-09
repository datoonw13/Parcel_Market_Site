"use client";

import Button from "@/components/shared/Button";
import Divider from "@/components/shared/Divider";
import TextField from "@/components/shared/TextField";
import GoogleIcon from "@/icons/GoogleIcon";
import { useAuthMutation } from "@/lib/features/apis/authApi";
import { ISignIn } from "@/types/auth";
import { signInSchema } from "@/validations/auth-validation";
import { yupResolver } from "@hookform/resolvers/yup";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

const SignIn = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [authUser, { isLoading }] = useAuthMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ISignIn>({ resolver: yupResolver(signInSchema) });

  const onSubmit = handleSubmit(async (data) => {
    try {
      const res = await authUser(data).unwrap();
      toast.success("You have successfully logged in");
      router.push("/");
      localStorage.setItem("token", res.access_token);
    } catch (error) {}
  });

  return (
    <>
      <TextField
        label="Email"
        placeholder="Enter your email"
        register={register}
        name="email"
        error={!!errors.email}
        helperText={errors.email?.message}
      />
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
      <Button onClick={onSubmit} loading={isLoading}>
        Continue
      </Button>
      <Divider label="OR" />
      <Button type="tertiary" startIcon={<GoogleIcon />}>
        Sign in with google
      </Button>
      <Divider />
      <div className="flex items-center justify-between">
        <p>Don’t have an account yet?</p>
        <Link href="/sign-up">
          <Button type="tertiary">Get Started</Button>
        </Link>
      </div>
    </>
  );
};

export default SignIn;
