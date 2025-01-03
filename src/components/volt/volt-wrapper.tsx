"use client";

import React, { FC, useCallback, useEffect, useRef, useState } from "react";
import useMediaQuery from "@/hooks/useMediaQuery";
import { IDecodedAccessToken } from "@/types/auth";
import { VoltSteps, VoltWrapperValuesModel } from "@/types/volt";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { LuLoader2 } from "react-icons/lu";
import { saveSearchDataAction, testAction } from "@/server-actions/volt/actions";
import VoltDesktop from "./volt-desktop";
import VoltMobile from "./volt-mobile/volt-mobile";
import PropertyDetailWarningModal from "./property-detail-warning-modal";

interface VoltWrapperProps {
  user: IDecodedAccessToken | null;
}

const initialValues = {
  searchDetails: null,
  searchResult: null,
  selectedItem: null,
  calculation: null,
  additionalDataResult: null,
};

const VoltWrapper: FC<VoltWrapperProps> = ({ user }) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const { targetReached: isSmallDevice, detecting } = useMediaQuery(1024);
  const [step, setStep] = useState(VoltSteps.SEARCH);
  const [values, setValues] = useState<VoltWrapperValuesModel>(initialValues);
  const [dataSaved, setDataSaved] = useState(false);
  const [dataSaving, setDataSaving] = useState(false);
  const [openPropertyDetailWarningModal, setOpenPropertyDetailWarningModal] = useState(false);

  const resumeVoltFlow = useCallback(() => {
    try {
      const {
        values: data,
        step,
        dataSaved,
      }: { step: VoltSteps; values: typeof values; dataSaved: boolean } = JSON.parse(sessionStorage.getItem("volt") || "");
      setStep(step);
      setValues(data);
      setDataSaved(dataSaved);
    } catch (error) {}
  }, []);

  const handleCalculationDataSave = useCallback(async () => {
    if (!values.calculation) {
      return;
    }
    setDataSaving(true);
    const { errorMessage } = await saveSearchDataAction(Number(values.calculation.id));
    if (errorMessage) {
      setValues(initialValues);
      setStep(VoltSteps.SEARCH);
    }
    setDataSaved(true);
    setDataSaving(false);
  }, [values.calculation]);

  const saveData = useCallback(() => {
    if (step > VoltSteps.SEARCH) {
      const data = {
        dataSaved,
        step,
        values,
      };
      const stringifiedData = JSON.stringify(data);
      sessionStorage.setItem("volt", stringifiedData);
    }
  }, [dataSaved, step, values]);

  useEffect(() => {
    saveData();
  }, [saveData, step, dataSaved]);

  useEffect(() => {
    resumeVoltFlow();
  }, [resumeVoltFlow]);

  useEffect(() => {
    if (user && step === VoltSteps.CALCULATION && !dataSaved) {
      handleCalculationDataSave();
    }
  }, [step, dataSaved, user, handleCalculationDataSave]);

  return (
    <>
      <button
        type="button"
        onClick={async () => {
          const res = await testAction(59000);
          console.log(res);
        }}
      >
        server action 59
      </button>
      <button
        type="button"
        onClick={async () => {
          const res = await testAction(60000);
          console.log(res);
        }}
      >
        server action 60
      </button>
      <button
        type="button"
        onClick={async () => {
          const res = await testAction(61000);
          console.log(res);
        }}
      >
        server action 61
      </button>

      <button
        type="button"
        onClick={async () => {
          const res = await fetch(`https://run.mocky.io/v3/83848510-6583-43ea-9081-d84c21902f88?mocky-delay=${61000}ms`);
          console.log(JSON.stringify(res));
        }}
      >
        server action 61 custom
      </button>
      <PropertyDetailWarningModal
        closeModal={() => setOpenPropertyDetailWarningModal(false)}
        open={openPropertyDetailWarningModal}
        user={user}
        onOK={() => sessionStorage.setItem("volt", JSON.stringify({ step, values }))}
      />
      <div className="h-dvh relative ">
        {dataSaving && (
          <div className="absolute h-full w-full flex justify-center items-center z-20 bg-black-200">
            <LuLoader2 className="animate-spin size-9 text-primary-main-200" />
          </div>
        )}
        {!isSmallDevice && !detecting && (
          <VoltDesktop
            setOpenPropertyDetailWarningModal={setOpenPropertyDetailWarningModal}
            values={values}
            setValues={setValues}
            user={user}
            step={step}
            setStep={setStep}
            setDataSaved={setDataSaved}
          />
        )}
        {isSmallDevice && !detecting && (
          <VoltMobile
            user={user}
            setOpenPropertyDetailWarningModal={setOpenPropertyDetailWarningModal}
            values={values}
            setValues={setValues}
            step={step}
            setStep={setStep}
            setDataSaved={setDataSaved}
          />
        )}
      </div>
    </>
  );
};

export default VoltWrapper;
