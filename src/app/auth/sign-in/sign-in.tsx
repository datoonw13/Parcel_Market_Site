"use client";

import { FC, useState } from "react";
import { EyeIcon1, EyeIcon2 } from "@/components/@new/icons/EyeIcons";
import Divider from "@/components/@new/shared/Divider";
import Button from "@/components/@new/shared/forms/Button";
import CheckBox from "@/components/@new/shared/forms/CheckBox";
import routes from "@/helpers/routes";
import { useRouter } from "next/navigation";
import GoogleAuthProvider from "@/components/@new/auth/sign-in/google-auth-provider";
import ForgotPasswordButton from "@/components/@new/user/profile/modals/forgot-password/forgot-password-button";
import { TextInput } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { defaultSignInSchema } from "@/zod-validations/auth-validations";
import { zodResolver } from "@hookform/resolvers/zod";
import useAuth from "@/hooks/useAuth";

interface SignInFormProps {
  onSignUpClick?: () => void;
}

const SignInForm: FC<SignInFormProps> = ({ onSignUpClick }) => {
  const router = useRouter();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [remember, setRemember] = useState(false);
  const [forgotPasswordModal, setForgotPasswordModal] = useState(false);
  const { defaultSignIn } = useAuth();
  const {
    handleSubmit,
    formState: { isValid, isSubmitting },
    register,
  } = useForm<z.infer<typeof defaultSignInSchema>>({
    resolver: zodResolver(defaultSignInSchema),
  });

  const onSubmit = handleSubmit(async (data) => defaultSignIn(data, remember));

  return (
    <div className="flex flex-col gap-8 justify-center items-center max-w-[296px] w-full m-auto sm:py-10 md:py-12 lg:py-14 xl:py-16 h-full">
      <h1 className="font-semibold text-2xl md:text-5xl">Sign In</h1>
      <div className="flex flex-col gap-4 w-full">
        <TextInput label="Email" id="sign-in-email-input" {...register("email")} />
        <TextInput
          label="Password"
          type={passwordVisible ? "text" : "password"}
          endIcon={
            <div className="cursor-pointer" onClick={() => setPasswordVisible(!passwordVisible)}>
              {passwordVisible ? <EyeIcon1 /> : <EyeIcon2 />}
            </div>
          }
          id="sign-in-password-input"
          {...register("password")}
        />
        <div className="flex justify-between gap-4">
          <CheckBox checked={remember} onChange={() => setRemember(!remember)} label="Remember me" name="sign-in-remember" />
          <ForgotPasswordButton user={null} openModal={forgotPasswordModal} setOpenModal={setForgotPasswordModal} />
        </div>
        <Button loading={isSubmitting} disabled={!isValid} onClick={onSubmit} className="mt-4" type="submit">
          Sign In
        </Button>
      </div>
      <Divider label="OR" className="my-3" />
      <GoogleAuthProvider />
      <p className="font-medium text-sm mt-auto">
        Don&apos;t have an account?{" "}
        <span
          id="sign-in-no-account-button"
          onClick={(e) => {
            if (onSignUpClick) {
              e.preventDefault();
              onSignUpClick();
            } else {
              router.push(`/${routes.auth.url}/${routes.auth.signUp.url}`);
            }
          }}
        >
          <span className="font-medium text-sm text-primary-main underline cursor-pointer">Sign Up</span>
        </span>
      </p>
    </div>
  );
};

export default SignInForm;
