"use client";

// import Button from "@/components/shared/Button";
import Divider from "@/components/shared/Divider";
// import TextField from "@/components/shared/TextField";
import routes from "@/helpers/routes";
import GoogleIcon from "@/icons/GoogleIcon";
import { useAuthMutation, useGoogleAuthMutation } from "@/lib/features/apis/authApi";
import { useAppSelector } from "@/lib/hooks";
import { ISignIn } from "@/types/auth";
import { signInSchema } from "@/validations/auth-validation";
import { yupResolver } from "@hookform/resolvers/yup";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useGoogleLogin } from "@react-oauth/google";
import { Button, TextField } from "@mui/material";

const SignIn = () => {
  const router = useRouter();
  const { selectedParcelOptions } = useAppSelector((state) => state.authedUser);
  const [showPassword, setShowPassword] = useState(false);
  const [authUser, { isLoading }] = useAuthMutation();
  const [googleAuth, { isLoading: googleAuthLoading, data }] = useGoogleAuthMutation();

  const {
    handleSubmit,
    formState: { errors, isSubmitted },
    setValue,
    watch,
  } = useForm<ISignIn>({
    resolver: yupResolver(signInSchema),
    defaultValues: {
      email: null,
      password: null,
    },
  });

  const onSubmit = handleSubmit(async (data) => {
    try {
      const res = await authUser(data).unwrap();
      toast.success("You have successfully logged in");
      router.push(selectedParcelOptions ? routes.propertySearch.signature : routes.home.root);
      localStorage.setItem("token", res.data.access_token);
    } catch (error) {
      localStorage.removeItem("token");
    }
  });

  const onGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const res = await googleAuth(tokenResponse.access_token).unwrap();
        if ("access_token" in res.data) {
          toast.success("You have successfully logged in");
          router.push(selectedParcelOptions ? routes.propertySearch.signature : routes.home.root);
          localStorage.setItem("token", res.data.access_token);
        } else {
          router.push(`${routes.auth.signUp}?email=${res.data.email}&name=${res.data.name}&token=${res.data.token}`);
        }
      } catch (error) {}
    },
  });

  return (
    <>
      {/* <TextField
        label="Email"
        placeholder="Enter your email"
        name="email"
        error={!!errors.email}
        helperText={errors.email?.message}
        onChange={(value) => setValue("email", value || null, { shouldValidate: isSubmitted, shouldDirty: isSubmitted })}
        value={watch("email") || ""}
      /> */}
      <TextField label="aee" />
      {/* <TextField
        type={showPassword ? "text" : "password"}
        label="Password"
        placeholder="Enter password"
        endIcon={
          <Button type="none" classNames="!p-0 text-dark-green" onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? "hidden" : "show"}
          </Button>
        }
        onChange={(value) => setValue("password", value || null, { shouldValidate: isSubmitted, shouldDirty: isSubmitted })}
        name="password"
        error={!!errors.password}
        helperText={errors.password?.message}
        value={watch("password") || ""}
      />
      <Button onClick={onSubmit} loading={isLoading}>
        Continue
      </Button>
      <Divider label="OR" />
      <Button loading={googleAuthLoading} type="tertiary" startIcon={<GoogleIcon />} disableStartIconColor onClick={onGoogleLogin}>
        Sign in with google
      </Button>
      <Divider />
      <div className="flex items-center justify-between">
        <p>Don’t have an account yet?</p>
        <Link href={routes.auth.signUp}>
          <Button type="tertiary">Get Started</Button>
        </Link>
      </div> */}
    </>
  );
};

export default SignIn;
