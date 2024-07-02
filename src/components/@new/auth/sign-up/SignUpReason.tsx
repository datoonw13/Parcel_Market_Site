"use client";

import React, { useState } from "react";
import { IUserSignUp } from "@/types/auth";
import clsx from "clsx";
import Link from "next/link";
import routes from "@/helpers/routes";
import CheckBox from "../../shared/forms/CheckBox";
import Button from "../../shared/forms/Button";

const SignUpReason = ({ onNext }: { onNext: (type: IUserSignUp["registrationReason"]) => void }) => {
  const [value, setValue] = useState<IUserSignUp["registrationReason"]>();
  return (
    <>
      <div className="max-w-xl">
        <h1 className="font-semibold text-2xl md:text-5xl text-center">Welcome to Parcel Market</h1>
        <h3 className="text-grey-800 mt-3 text-center text-xs md:text-base">First, tell us why are you here and select all that apply</h3>
      </div>
      <div className="flex flex-col max-w-fit w-full gap-3">
        <CheckBox
          className={clsx(
            `!w-full p-6 sm:min-h-[76px] border border-grey-100 rounded-2xl hover:bg-primary-main-100
          hover:border-primary-main-400 !text-black text-xs md:text-base checked:bg-primary-dark`,
            value === "sellLandQuickly" && "bg-primary-main-100 border-primary-main-400"
          )}
          label="I want to sell my land quickly"
          checked={value === "sellLandQuickly"}
          onChange={() => setValue("sellLandQuickly")}
        />
        <CheckBox
          className={clsx(
            `!w-full p-6 sm:min-h-[76px] border border-grey-100 rounded-2xl hover:bg-primary-main-100
            hover:border-primary-main-400 !text-black text-xs md:text-base checked:bg-primary-dark`,
            value === "lookingForLandDeal" && "bg-primary-main-100 border-primary-main-400"
          )}
          label="I am looking for a land deal"
          checked={value === "lookingForLandDeal"}
          onChange={() => setValue("lookingForLandDeal")}
        />
        <CheckBox
          className={clsx(
            `!w-full p-6 sm:min-h-[76px] border border-grey-100 rounded-2xl hover:bg-primary-main-100
          hover:border-primary-main-400 !text-black text-xs md:text-base checked:bg-primary-dark`,
            value === "researchingPropertyData" && "bg-primary-main-100 border-primary-main-400"
          )}
          label="I am researching property data"
          checked={value === "researchingPropertyData"}
          onChange={() => setValue("researchingPropertyData")}
        />
        <CheckBox
          className={clsx(
            `!w-full p-6 sm:min-h-[76px] border border-grey-100 rounded-2xl hover:bg-primary-main-100
        hover:border-primary-main-400 !text-black text-xs md:text-base checked:bg-primary-dark`,
            value === "realEstateProfessional" && "bg-primary-main-100 border-primary-main-400"
          )}
          label={
            <p className="flex gap-1">
              I&apos;m a licensed or <span className="sm:hidden">RE</span>
              <span className="hidden sm:block w-max">certified real estate</span> professional
            </p>
          }
          checked={value === "realEstateProfessional"}
          onChange={() => setValue("realEstateProfessional")}
        />
        <Button disabled={!value} className="w-full mt-5" onClick={() => value && onNext(value)}>
          Create Account
        </Button>
        <p className="mt-3 text-center font-medium text-sm">
          Already have an account?{" "}
          <Link href={routes.auth.signIn.url}>
            <span className="underline text-primary-main font-medium text-sm">Sign In</span>
          </Link>
        </p>
      </div>
    </>
  );
};

export default SignUpReason;
