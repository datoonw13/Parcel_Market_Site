"use client";

import React, { FC, useState } from "react";
import useMediaQuery from "@/hooks/useMediaQuery";
import { IDecodedAccessToken } from "@/types/auth";
import { VoltPriceCalculationRes, VoltSearchModel, VoltSearchResultModel, VoltSteps } from "@/types/volt";
import { IMap } from "@/types/map";
import VoltDesktop from "./volt-desktop";
import VoltMobile from "./volt-mobile";

interface VoltWrapperProps {
  user: IDecodedAccessToken | null;
}

const VoltWrapper: FC<VoltWrapperProps> = ({ user }) => {
  const { targetReached: isSmallDevice } = useMediaQuery(1024);
  const [step, setStep] = useState(VoltSteps.SEARCH);
  const [values, setValues] = useState<{
    searchDetails: VoltSearchModel | null;
    searchResult: VoltSearchResultModel | null;
    selectedItem: IMap[0] | null;
    calculation: VoltPriceCalculationRes | null;
  }>({
    searchDetails: null,
    searchResult: null,
    selectedItem: null,
    calculation: null,
  });

  console.log(window.history);

  return (
    <div className="h-screen">
      {!isSmallDevice && <VoltDesktop values={values} setValues={setValues} user={user} step={step} setStep={setStep} />}
      {isSmallDevice && <VoltMobile />}
    </div>
  );
};

export default VoltWrapper;
