"use client";

import React, { FC, useState } from "react";
import useMediaQuery from "@/hooks/useMediaQuery";
import { IDecodedAccessToken } from "@/types/auth";
import { VoltSteps } from "@/types/volt";
import dynamic from "next/dynamic";
import VoltDesktop from "./volt-desktop";
import VoltMobile from "./volt-mobile";

const ResponsiveDialog = dynamic(() => import("@/components/ui/dialogs/responsive-dialog"), { ssr: false });

interface VoltWrapperProps {
  user: IDecodedAccessToken | null;
}

const VoltWrapper: FC<VoltWrapperProps> = ({ user }) => {
  const isSmallDevice = useMediaQuery(1024);
  const [step, setStep] = useState(VoltSteps.SEARCH);

  return (
    <div className="h-screen">
      <ResponsiveDialog open responsiveContent={<div>qwdqwd</div>} content={<div>qwdqw</div>} closeModal={() => console.log("clo")} />
      {!isSmallDevice && <VoltDesktop user={user} step={step} setStep={setStep} />}
      {isSmallDevice && <VoltMobile />}
    </div>
  );
};

export default VoltWrapper;
