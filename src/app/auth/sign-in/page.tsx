"use client";

import { EyeIcon1, EyeIcon2 } from "@/components/@new/icons/EyeIcons";
import Divider from "@/components/@new/shared/Divider";
import Button from "@/components/@new/shared/forms/Button";
import GoogleButton from "@/components/@new/shared/forms/Button/GoogleButton";
import CheckBox from "@/components/@new/shared/forms/CheckBox";
import TextField from "@/components/@new/shared/forms/TextField";
import Link from "next/link";
import React, { useState } from "react";

const SignInPage = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);

  return (
    <div className="flex flex-col gap-8 justify-center items-center max-w-[296px] w-full m-auto sm:py-10 md:py-12 lg:py-14 xl:py-16 h-full">
      <h1 className="font-semibold text-2xl md:text-5xl">Sign In</h1>
      <form className="flex flex-col gap-4 w-full">
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
        <Button className="mt-4">Sign In</Button>
      </form>
      <Divider label="OR" className="my-3" />
      <GoogleButton onClick={() => {}} />
      <p className="font-medium text-sm mt-auto">Don't have an account? <Link href={'/'}><span className="font-medium text-sm text-primary-main underline">Sign Up</span></Link></p>
    </div>
  );
};

export default SignInPage;
