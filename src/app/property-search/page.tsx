"use client";

import PropertySearchAbout from "@/components/property-search/PropertySearchAbout";
import PropertySearchEstimatedPrice from "@/components/property-search/PropertySearchEstimatedPrice";
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
    formState: { errors, isSubmitted },
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
      signature: null,
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
      if (step === StepsEnum.ABOUT && !error.about) {
        setStep(StepsEnum.ESTIMATED_PRICE);
        clearErrors();
      }
    }
  );

  const onRegridError = () => {
    setStep(StepsEnum.INFO);
  };

  const isNextButtonDisabled = () => {
    if (step === StepsEnum.FOUND && !watch("found.parcelNumber")) {
      return true;
    }
    if (step === StepsEnum.ABOUT && Object.values(watch("about")).some((el) => !el)) {
      return true;
    }
    return false;
  };

  const buttonLabel = () => {
    if (step === StepsEnum.FOUND) {
      return "Tell us about your property";
    }
    if (step === StepsEnum.ABOUT) {
      return "Find out Your Estimated Sale Price";
    }
    return "Continue";
  };

  const generateHeader = () => {
    if (step === StepsEnum.INFO) {
      return {
        title: "Property information",
        desc: "Let’s find your property using some basic property information ",
      };
    }
    if (step === StepsEnum.FOUND) {
      return {
        title: "Did we find your property?",
        desc: "Select your property from the list below",
      };
    }
    if (step === StepsEnum.ABOUT) {
      return {
        title: "Tell us about your property",
        desc: "Please provide us with a little information about the land. Parcel Market's unique algorithms use this information to give you the best valuation possible.",
      };
    }
    if (step === StepsEnum.ESTIMATED_PRICE) {
      return {
        title: "Your estimated land value:",
        desc: "",
      };
    }
    return {
      title: "",
      desc: "",
    };
  };

  return (
    <div className="px-4 md:px-8 lg:px-12 lx:px-16 2xl:px-20 py-10 flex flex-col gap-10">
      <>
        <ProgressBar currentStep={step + 1} totalSteps={4} goBack={() => setStep(step - 1)} />
        <div>
          <h1 className="text-dark-green font-bricolage font-bold text-2xl mb-6">{generateHeader().title}</h1>
          {generateHeader().desc && <h2 className="text-dark-green-500 font-medium text-xl">{generateHeader().desc}</h2>}
        </div>
      </>
      {step === StepsEnum.INFO && (
        <PropertySearchInfo setValue={setValue} trigger={trigger} errors={errors} isSubmitted={isSubmitted} watch={watch} />
      )}
      {step === StepsEnum.FOUND && <PropertySearchFound setValue={setValue} watch={watch} onError={onRegridError} />}
      {step === StepsEnum.ABOUT && <PropertySearchAbout setValue={setValue} watch={watch} />}
      {step === StepsEnum.ESTIMATED_PRICE && <PropertySearchEstimatedPrice watch={watch} />}

      <div
        className={clsx(
          step === StepsEnum.FOUND &&
            "fixed bottom-0 bg-white w-full drop-shadow-2xl shadow-2xl py-4 left-0 px-4 md:px-8 lg:px-12 lx:px-16 2xl:px-20"
        )}
      >
        {step < StepsEnum.ESTIMATED_PRICE && (
          <Button classNames="mt-4 md:w-fit" onClick={onSubmit} disabled={isNextButtonDisabled()}>
            {buttonLabel()}
          </Button>
        )}
      </div>
    </div>
  );
};

export default PropertySearch;
