"use client";

import React, { FC, useState } from "react";
import useMediaQuery from "@/hooks/useMediaQuery";
import { IDecodedAccessToken } from "@/types/auth";
import { VoltSteps } from "@/types/volt";
import VoltDesktop from "./volt-desktop";
import VoltMobile from "./volt-mobile";

interface VoltWrapperProps {
  user: IDecodedAccessToken | null;
}

const VoltWrapper: FC<VoltWrapperProps> = ({ user }) => {
  const isSmallDevice = useMediaQuery(1024);
  const [step, setStep] = useState(VoltSteps.SEARCH);

  return (
    <div className="h-screen">
      {!isSmallDevice && <VoltDesktop user={user} step={step} setStep={setStep} />}
      {isSmallDevice && <VoltMobile />}
    </div>
  );
};

export default VoltWrapper;
