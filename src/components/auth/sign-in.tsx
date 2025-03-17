"use client";

import { ElementType, FC, ReactElement, useState } from "react";
import { EyeIcon1, EyeIcon2 } from "@/components/@new/icons/EyeIcons";
import Divider from "@/components/@new/shared/Divider";
import Button from "@/components/@new/shared/forms/Button";
import CheckBox from "@/components/@new/shared/forms/CheckBox";
import { TextInput } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { defaultSignInSchema } from "@/zod-validations/auth-validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";

interface SignInFormProps {
  authProviders?: () => ReactElement;
  onSignUp: () => void;
  defaultSignIn: (data: z.infer<typeof defaultSignInSchema> & { remember: boolean }) => Promise<void>;
  forgotPasswordButton?: ElementType;
  className?: string;
  authPending?: boolean;
}

const SignInForm: FC<SignInFormProps> = ({
  forgotPasswordButton: ForgotPasswordButton,
  onSignUp,
  defaultSignIn,
  className,
  authProviders: AuthProviders,
  authPending,
}) => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [remember, setRemember] = useState(false);
  const {
    handleSubmit,
    formState: { isValid, isSubmitting },
    register,
  } = useForm<z.infer<typeof defaultSignInSchema>>({
    resolver: zodResolver(defaultSignInSchema),
  });

  const onSubmit = handleSubmit(async (data) => defaultSignIn({ ...data, remember }));

  // const defaultSignIn = async (values: z.infer<typeof defaultSignInSchema>, remember: boolean) => {
  //   const req = await defaultSignInAction(values, remember);

  //   if (req.errorMessage || !req.data) {
  //     notify({ title: "Auth", description: req.errorMessage }, { variant: "error" });
  //     return;
  //   }
  //   if (modal?.onAuth) {
  //     modal?.onAuth();
  //   } else {
  //     router.replace(routes.volt.fullUrl);
  //   }
  // };

  // const onSubmit = handleSubmit(async (data) => defaultSignIn(data, remember));

  // const onThirdPartyAuthSuccess = async (data: {
  //   authAccessToken: string;
  //   authFirstName: string;
  //   authLastName: string;
  //   authEmail: string;
  //   userSource: UserSource;
  // }) => {
  //   const { data: requestData, errorMessage } = await thirdPartyAuthAction(data.authAccessToken, data.userSource);
  //   const params = new URLSearchParams(searchParams.toString());
  //   Object.keys(data).forEach((key) => {
  //     params.set(key, data[key as keyof typeof data]);
  //   });
  //   if (errorMessage) {
  //     if (modal?.showSignUp) {
  //       modal.showSignUp();
  //       router.push(`${pathname}?${params.toString()}`);
  //       return;
  //     }
  //     router.push(`${routes.auth.signUp.fullUrl}?${params.toString()}`);
  //     return;
  //   }

  //   // on Success auth
  //   if (modal?.onAuth) {
  //     modal?.onAuth();
  //     return;
  //   }
  //   router.replace(routes.volt.fullUrl);
  // };

  return (
    <div className={cn("flex flex-col gap-8 justify-center items-center w-full h-full", className)}>
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
          {ForgotPasswordButton && <ForgotPasswordButton />}
        </div>
        <Button loading={isSubmitting || authPending} disabled={!isValid} onClick={onSubmit} className="mt-4" type="submit">
          Sign In
        </Button>
      </div>
      <Divider label="OR" className="my-3" />
      {AuthProviders && <AuthProviders />}
      <p className="font-medium text-sm mt-auto">
        Don&apos;t have an account?{" "}
        <span id="sign-in-no-account-button" onClick={onSignUp}>
          <span className="font-medium text-sm text-primary-main underline cursor-pointer">Sign Up</span>
        </span>
      </p>
    </div>
  );
};

export default SignInForm;
