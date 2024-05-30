"use client";

import SignUpForm from "@/components/sign-up/SignUpForm";
import SignUpSelectRole from "@/components/sign-up/SignUpSelectRole";
import { ISignUp } from "@/types/auth";
import { Box } from "@mui/material";
import React, { useState } from "react";

enum Steps {
  SELECT_TYPE,
  SIGNUP_FORM,
}

const SignUp = () => {
  const [type, setType] = useState<null | ISignUp["type"]>(null);
  const [step, setStep] = useState<Steps>(Steps.SELECT_TYPE);

  return (
    <Box sx={{ height: "100%" }}>
      {step === Steps.SELECT_TYPE ? (
        <SignUpSelectRole onNext={() => setStep(Steps.SIGNUP_FORM)} type={type} setType={setType} />
      ) : (
        <SignUpForm goBack={() => setStep(Steps.SELECT_TYPE)} />
      )}
    </Box>
  );
};

export default SignUp;
