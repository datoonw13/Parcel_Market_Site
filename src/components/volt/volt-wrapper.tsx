"use client";

import React, { FC, useCallback, useEffect, useRef, useState } from "react";
import useMediaQuery from "@/hooks/useMediaQuery";
import { IDecodedAccessToken } from "@/types/auth";
import { VoltPriceCalculationRes, VoltSearchModel, VoltSearchResultModel, VoltSteps } from "@/types/volt";
import { IMap } from "@/types/map";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { LuLoader2 } from "react-icons/lu";
import { saveSearchDataAction } from "@/server-actions/volt/actions";
import VoltDesktop from "./volt-desktop";
import VoltMobile from "./volt-mobile";

interface VoltWrapperProps {
  user: IDecodedAccessToken | null;
}

const initialValues = {
  searchDetails: null,
  searchResult: null,
  selectedItem: null,
  calculation: null,
};

const VoltWrapper: FC<VoltWrapperProps> = ({ user }) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const { targetReached: isSmallDevice } = useMediaQuery(1024);
  const [step, setStep] = useState(VoltSteps.SEARCH);
  const [values, setValues] = useState<{
    searchDetails: VoltSearchModel | null;
    searchResult: VoltSearchResultModel | null;
    selectedItem: IMap[0] | null;
    calculation: VoltPriceCalculationRes | null;
  }>(initialValues);
  const [dataSaved, setDataSaved] = useState(false);
  const [dataSaving, setDataSaving] = useState(false);

  const resumeVoltFlow = useCallback(() => {
    const dataFromSessionStorage = sessionStorage.getItem("volt");
    const params = new URLSearchParams(searchParams);
    if (params.get("resume") && dataFromSessionStorage) {
      try {
        const { values: data, step }: { step: VoltSteps; values: typeof values } = JSON.parse(sessionStorage.getItem("volt") || "");
        setStep(step);
        setValues(data);
      } catch (error) {
      } finally {
        params.delete("resume");
        router.replace(`${pathname}?${params.toString()}`);
        sessionStorage.removeItem("volt");
      }
    }
  }, [pathname, router, searchParams]);

  const handleCalculationDataSave = useCallback(async () => {
    setDataSaving(true);
    const { errorMessage } = await saveSearchDataAction(values.calculation!.id);
    if (errorMessage) {
      setValues(initialValues);
      setStep(VoltSteps.CALCULATION);
    }
    setDataSaved(true);
    setDataSaving(false);
  }, [values.calculation]);

  useEffect(() => {
    resumeVoltFlow();
  }, [resumeVoltFlow]);

  useEffect(() => {
    if (user && step === VoltSteps.CALCULATION && !dataSaved) {
      handleCalculationDataSave();
    }
  }, [step, dataSaved, user, handleCalculationDataSave]);

  return (
    <div className="h-screen relative">
      {dataSaving && (
        <div className="absolute h-full w-full flex justify-center items-center z-20 bg-black-200">
          <LuLoader2 className="animate-spin size-9 text-primary-main-200" />
        </div>
      )}
      {!isSmallDevice && <VoltDesktop values={values} setValues={setValues} user={user} step={step} setStep={setStep} />}
      {isSmallDevice && <VoltMobile />}
    </div>
  );
};

export default VoltWrapper;
