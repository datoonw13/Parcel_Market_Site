"use client";

import routes from "@/helpers/routes";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useState } from "react";
import { TermsConditionsDialog } from "../shared/terms-conditions";
import { PrivacyPolicyDialog } from "../shared/privacy-policy";

const VoltFooter = ({ className }: { className?: string }) => {
  const [openTermsDialog, setTermsDialog] = useState(false);
  const [openPrivacyDialog, setPrivacyDialog] = useState(false);
  return (
    <>
      <TermsConditionsDialog open={openTermsDialog} closeModal={() => setTermsDialog(false)} />
      <PrivacyPolicyDialog open={openPrivacyDialog} closeModal={() => setPrivacyDialog(false)} />
      <div className={cn("flex items-center justify-between", className)}>
        <div className="flex gap-3 items-center justify-center lg:justify-start">
          <p onClick={() => setPrivacyDialog(true)} className="cursor-pointer text-sm text-gray-800">
            Privacy Policy
          </p>
          <div className="w-[1px] h-4 bg-gray-200" />
          <p onClick={() => setTermsDialog(true)} className="cursor-pointer text-sm text-gray-800">
            Terms of use
          </p>
        </div>
        <p className="text-xs font-medium text-grey-600 text-center lg:text-start">
          ©{new Date().getFullYear()} Parcel Market. All rights reserved.
        </p>
      </div>
    </>
  );
};

export default VoltFooter;
