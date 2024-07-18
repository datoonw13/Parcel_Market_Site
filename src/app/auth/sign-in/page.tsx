"use client";

import { forwardRef, useRef, useState } from "react";
import { EyeIcon1, EyeIcon2 } from "@/components/@new/icons/EyeIcons";
import Divider from "@/components/@new/shared/Divider";
import Button from "@/components/@new/shared/forms/Button";
import GoogleButton from "@/components/@new/shared/forms/Button/GoogleButton";
import CheckBox from "@/components/@new/shared/forms/CheckBox";
import TextField from "@/components/@new/shared/forms/TextField";
import routes from "@/helpers/routes";
import useEnterClick from "@/hooks/useEnterClick";
import Link from "next/link";
import { useFormState, useFormStatus } from "react-dom";
import toast from "react-hot-toast";
import { signInUserAction } from "@/server-actions/user/actions";
import { useRouter, useSearchParams } from "next/navigation";

const SignInPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const ref = useRef<HTMLButtonElement | null>(null);
  const [passwordVisible, setPasswordVisible] = useState(false);

  const signIn = async (prevState: any, formData: FormData) => {
    const request = await signInUserAction(prevState, formData);
    if (request.errorMessage) {
      toast.error(request.errorMessage);
    } else {
      const redirectTo = searchParams.get("from");
      router.push(redirectTo ? `${redirectTo}?${searchParams.toString()}` : routes.home.fullUrl);
    }
  };

  const [state, formAction] = useFormState(signIn, null);

  useEnterClick(ref?.current?.onclick);

  return (
    <div className="flex flex-col gap-8 justify-center items-center max-w-[296px] w-full m-auto sm:py-10 md:py-12 lg:py-14 xl:py-16 h-full">
      <h1 className="font-semibold text-2xl md:text-5xl">Sign In</h1>
      <form className="flex flex-col gap-4 w-full" action={formAction}>
        <TextField label="Email" name="email" />
        <TextField
          label="Password"
          type={passwordVisible ? "text" : "password"}
          name="password"
          endIcon={
            <div className="cursor-pointer" onClick={() => setPasswordVisible(!passwordVisible)}>
              {passwordVisible ? <EyeIcon1 /> : <EyeIcon2 />}
            </div>
          }
        />
        <div className="flex justify-between gap-4">
          <CheckBox label="Remember me" name="sign-in-remember" />
          <Link href="/">
            <p className="text-xs font-medium text-primary-main">Forgot Password?</p>
          </Link>
        </div>
        <SubmitButton ref={ref} />
      </form>
      <Divider label="OR" className="my-3" />
      <GoogleButton onClick={() => {}} />
      <p className="font-medium text-sm mt-auto">
        Don&apos;t have an account?{" "}
        <Link href={`/${routes.auth.url}/${routes.auth.signUp.url}`}>
          <span className="font-medium text-sm text-primary-main underline">Sign Up</span>
        </Link>
      </p>
    </div>
  );
};

export default SignInPage;

const SubmitButton = forwardRef<HTMLButtonElement | null>((_, ref) => {
  const { pending } = useFormStatus();
  return (
    <Button ref={ref} loading={pending} className="mt-4" type="submit">
      Sign In
    </Button>
  );
});
