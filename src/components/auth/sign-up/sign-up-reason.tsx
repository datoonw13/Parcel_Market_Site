"use client";

import React, { useState } from "react";
import { IUserSignUp } from "@/types/auth";
import routes from "@/helpers/routes";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { UnwrapArray } from "@/types/common";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

const SignUpReason = ({ onNext, showSignIn }: { onNext: (type: IUserSignUp["registrationReasons"]) => void; showSignIn: () => void }) => {
  const router = useRouter();
  const [value, setValue] = useState<IUserSignUp["registrationReasons"]>([]);

  const handleChange = (item: UnwrapArray<IUserSignUp["registrationReasons"]>) => {
    if (value.includes(item)) {
      setValue(value.filter((el) => el !== item));
    } else {
      setValue([...value, item]);
    }
  };

  return (
    <>
      <div className="max-w-xl">
        <h1 className="font-semibold text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-center">Welcome to Parcel Market</h1>
        <h3 className="text-grey-800 mt-3 text-center text-xs md:text-base">First, tell us why are you here and select all that apply</h3>
      </div>
      <div className="flex flex-col max-w-fit w-full gap-3">
        <Checkbox
          className={cn(
            "border p-4 lg:p-6 font-medium rounded-2xl hover:shadow-4 text-sm lg:text-base gap-2",
            value.includes("LandOwner") && "bg-primary-main-100 border-primary-main-400"
          )}
          id="LandOwner"
          label="I am a private landowner looking for values"
          checked={value.includes("LandOwner")}
          onClick={() => handleChange("LandOwner")}
        />
        <Checkbox
          className={cn(
            "border p-4 lg:p-6 font-medium rounded-2xl hover:shadow-4 text-sm lg:text-base gap-2",
            value.includes("CertifiedAppraiser") && "bg-primary-main-100 border-primary-main-400"
          )}
          id="CertifiedAppraiser"
          label="I am a certified appraiser researching values"
          checked={value.includes("CertifiedAppraiser")}
          onClick={() => handleChange("CertifiedAppraiser")}
        />
        <Checkbox
          className={cn(
            "border p-4 lg:p-6 font-medium rounded-2xl hover:shadow-4 text-sm lg:text-base gap-2",
            value.includes("LicensedAgent") && "bg-primary-main-100 border-primary-main-400"
          )}
          id="LicensedAgent"
          label="I am a licensed Real Estate Agent or Broker"
          checked={value.includes("LicensedAgent")}
          onClick={() => handleChange("LicensedAgent")}
        />
        <Checkbox
          className={cn(
            "border p-4 lg:p-6 font-medium rounded-2xl hover:shadow-4 text-sm lg:text-base gap-2",
            value.includes("LandInvestor") && "bg-primary-main-100 border-primary-main-400"
          )}
          id="LandInvestor"
          label="I am a land investor researching land values"
          checked={value.includes("LandInvestor")}
          onClick={() => handleChange("LandInvestor")}
        />
        <Button disabled={value.length === 0} className="w-full mt-5" onClick={() => value && onNext(value)}>
          Create Account
        </Button>
        <p className="mt-3 text-center font-medium text-sm">
          Already have an account?{" "}
          <span onClick={showSignIn} className="underline text-primary-main font-medium text-sm cursor-pointer">
            Sign In
          </span>
        </p>
      </div>
    </>
  );
};

export default SignUpReason;
