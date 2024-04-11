"use client";

import PropertySearchFound from "@/components/property-search/PropertySearchFound";
import PropertySearchInfo from "@/components/property-search/PropertySearchInfo";
import Button from "@/components/shared/Button";
import ProgressBar from "@/components/shared/ProgressBar";
import { ISearchProperty } from "@/types/property";
import { searchPropertySchema } from "@/validations/property-schemas";
import { yupResolver } from "@hookform/resolvers/yup";
import clsx from "clsx";
import { useState } from "react";
import { useForm } from "react-hook-form";

enum StepsEnum {
  INFO,
  FOUND,
  ABOUT,
  ESTIMATED_PRICE,
  SIGNATURE,
}

const PropertySearch = () => {
  const [step, setStep] = useState<StepsEnum>(StepsEnum.INFO);
  const {
    handleSubmit,
    formState: { isDirty, errors, isSubmitted },
    setValue,
    trigger,
    watch,
    clearErrors,
  } = useForm<ISearchProperty>({
    resolver: yupResolver(searchPropertySchema),
    defaultValues: {
      info: {
        county: null,
        owner: null,
        parcelNumber: null,
        state: null,
      },
      about: {
        improvementsValue: null,
        langCoverType: null,
        propertyAccess: null,
        propertyCondition: null,
        propertyRestriction: null,
        waterFeature: null,
        waterFront: null,
        wetProperty: null,
      },
      found: {
        parcelNumber: null,
      },
    },
    reValidateMode: "onChange",
  });

  const onSubmit = handleSubmit(
    (data) => {},
    (error) => {
      if (step === StepsEnum.INFO && !error.info) {
        setStep(StepsEnum.FOUND);
        clearErrors();
      }
      if (step === StepsEnum.FOUND && !error.found) {
        setStep(StepsEnum.ABOUT);
        clearErrors();
      }
    }
  );

  const onRegridError = () => {
    setStep(StepsEnum.INFO);
  };

  return (
    <div className="px-4 md:px-8 lg:px-12 lx:px-16 2xl:px-20 py-10 flex flex-col gap-10">
      <>
        <ProgressBar currentStep={1} totalSteps={4} goBack={() => {}} />
        <div>
          <h1 className="text-dark-green font-bricolage font-bold text-2xl mb-6">Property information</h1>
          <h2 className="text-dark-green-500 font-medium text-xl">Let’s find your property using some basic property information</h2>
        </div>
      </>
      {step === StepsEnum.INFO && (
        <PropertySearchInfo setValue={setValue} trigger={trigger} errors={errors} isSubmitted={isSubmitted} watch={watch} />
      )}
      {step === StepsEnum.FOUND && <PropertySearchFound setValue={setValue} watch={watch} onError={onRegridError} />}
      <div
        className={clsx(
          step === StepsEnum.FOUND &&
            "fixed bottom-0 bg-white w-full drop-shadow-2xl shadow-2xl py-4 left-0 px-4 md:px-8 lg:px-12 lx:px-16 2xl:px-20"
        )}
      >
        <Button classNames="mt-4 md:w-fit" onClick={onSubmit} disabled={step === StepsEnum.FOUND && !watch("found.parcelNumber")}>
          Continue
        </Button>
      </div>
    </div>
  );
};

export default PropertySearch;
