"use client";

import { FC, forwardRef, useRef, useState } from "react";
import { EyeIcon1, EyeIcon2 } from "@/components/@new/icons/EyeIcons";
import Divider from "@/components/@new/shared/Divider";
import Button from "@/components/@new/shared/forms/Button";
import CheckBox from "@/components/@new/shared/forms/CheckBox";
import routes from "@/helpers/routes";
import { useFormState, useFormStatus } from "react-dom";
import toast from "react-hot-toast";
import { signInUserAction } from "@/server-actions/user/actions";
import { useRouter } from "next/navigation";
import GoogleAuthProvider from "@/components/@new/auth/sign-in/google-auth-provider";
import ForgotPasswordButton from "@/components/@new/user/profile/modals/forgot-password/forgot-password-button";
import { TextInput } from "@/components/ui/input";
import { decode } from "jsonwebtoken";
import { IDecodedAccessToken } from "@/types/auth";
import { JwtPayload } from "jwt-decode";

interface SignInFormProps {
  searchParams: { [key: string]: string };
  onSignUpClick?: () => void;
  onSuccessFinish?: () => void;
  googleAuth: {
    onSuccessFinish?: () => void;
    redirectOnSignUp?: (data: { email: string; firstName: string; lastName: string; accessToken: string }) => void;
  };
}

const SignInForm: FC<SignInFormProps> = ({ searchParams, googleAuth, onSignUpClick, onSuccessFinish }) => {
  const router = useRouter();
  const ref = useRef<HTMLButtonElement | null>(null);
  const params = new URLSearchParams(searchParams);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [remember, setRemember] = useState(false);
  const [forgotPasswordModal, setForgotPasswordModal] = useState(false);

  const signIn = async (prevState: any, formData: FormData) => {
    const request = await signInUserAction(prevState, formData, remember);
    if (request.errorMessage) {
      toast.error(request.errorMessage);
    } else {
      if (onSuccessFinish) {
        onSuccessFinish();
        return;
      }
      if (params.get("redirect_uri") && params.get("redirect_uri") === routes.volt.fullUrl) {
        const redirectUri = params.get("redirect_uri");
        const newLocation = `${redirectUri}?resume=true`;
        router.replace(newLocation);
        return;
      }
      const decodeAccessToken = decode(request.data?.access_token || "");
      const planSelected =
        decodeAccessToken && typeof decodeAccessToken === "object" && (decodeAccessToken as JwtPayload & IDecodedAccessToken).planSelected;

      router.replace(planSelected ? routes.home.fullUrl : routes.userSubscription.fullUrl);
    }
  };

  const onGoogleAuthSuccessFinish = (accessToken: string) => {
    if (googleAuth.onSuccessFinish) {
      googleAuth.onSuccessFinish();
    } else {
      const decodeAccessToken = decode(accessToken);
      const planSelected =
        decodeAccessToken && typeof decodeAccessToken === "object" && (decodeAccessToken as JwtPayload & IDecodedAccessToken).planSelected;
      router.replace(planSelected ? routes.home.fullUrl : routes.userSubscription.fullUrl);
    }
  };

  const onGoogleAuthRedirectSignup = (data: { email: string; firstName: string; lastName: string; accessToken: string }) => {
    if (googleAuth.redirectOnSignUp) {
      googleAuth.redirectOnSignUp(data);
    } else {
      router.push(
        `${routes.auth.signUp.fullUrl}?access_token=${data.accessToken}&firstName=${data.firstName}&lastName=${data.lastName}&email=${data.email}`
      );
    }
  };

  const [state, formAction] = useFormState(signIn, null);

  return (
    <div className="flex flex-col gap-8 justify-center items-center max-w-[296px] w-full m-auto sm:py-10 md:py-12 lg:py-14 xl:py-16 h-full">
      <h1 className="font-semibold text-2xl md:text-5xl">Sign In</h1>
      <form className="flex flex-col gap-4 w-full" action={forgotPasswordModal ? () => {} : formAction}>
        <TextInput label="Email" name="email" id="sign-in-email-input" />
        <TextInput
          label="Password"
          type={passwordVisible ? "text" : "password"}
          name="password"
          endIcon={
            <div className="cursor-pointer" onClick={() => setPasswordVisible(!passwordVisible)}>
              {passwordVisible ? <EyeIcon1 /> : <EyeIcon2 />}
            </div>
          }
          id="sign-in-password-input"
        />
        <div className="flex justify-between gap-4">
          <CheckBox checked={remember} onChange={() => setRemember(!remember)} label="Remember me" name="sign-in-remember" />
          <ForgotPasswordButton user={null} openModal={forgotPasswordModal} setOpenModal={setForgotPasswordModal} />
        </div>
        <SubmitButton ref={ref} />
      </form>
      <Divider label="OR" className="my-3" />
      <GoogleAuthProvider onSuccessFinish={onGoogleAuthSuccessFinish} redirectOnSignUp={onGoogleAuthRedirectSignup} />
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

const SubmitButton = forwardRef<HTMLButtonElement | null>((_, ref) => {
  const { pending } = useFormStatus();
  return (
    <Button ref={ref} loading={pending} className="mt-4" type="submit">
      Sign In
    </Button>
  );
});
