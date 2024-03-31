"use client";

import Button from "@/components/shared/Button";
import TextField from "@/components/shared/TextField";
import { useState } from "react";

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <>
      <TextField label="Name" placeholder="Enter your name" />
      <TextField label="Email" placeholder="Enter your email" />
      <TextField label="Mailing Address" placeholder="Your address" />
      <div className="flex items-center gap-6">
        <TextField info="your info here" label="State" placeholder="State" />
        <TextField info="your info here" label="Country" placeholder="Country" />
      </div>
      <TextField
        label="Password"
        placeholder="Enter password"
        endIcon={
          <Button classNames="!p-0" type="text" onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? "hidden" : "show"}
          </Button>
        }
      />
      <Button>Create Account</Button>
    </>
  );
};

export default SignUp;
