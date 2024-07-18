"use client";

import routes from "@/helpers/routes";
import { usePathname } from "next/navigation";

const getStepInfo = (path: string) => {
  switch (path) {
    case routes.valueLand.found.fullUrl:
      return {
        stepTitle: "Did we find your property?",
        stepDesc: "Select your property from the list below",
      };
    case routes.valueLand.about.fullUrl:
      return {
        stepTitle: "Tell us about your property",
        stepDesc:
          "Please provide us with a little information about the land. Parcel Market's unique algorithms use this information to give you the best valuation possible.",
      };
    case routes.valueLand.value.fullUrl:
      return {
        stepTitle: null,
        stepDesc: null,
      };
    default:
      return {
        stepTitle: "Property information",
        stepDesc: "Let’s find your property using some basic property information",
      };
  }
};

const ValueLandStepInfo = () => {
  const pathname = usePathname();
  const { stepDesc, stepTitle } = getStepInfo(pathname);

  return (stepTitle || stepDesc) &&   (
    <div className="space-y-3 px-4 md:px-6 lg:px-8">
      {stepTitle && <h1 className="text-lg sm:text-xl md:text-2xl font-bold">{stepTitle}</h1>}
      {stepDesc && <h6 className="font-medium text-sm md:text-base text-grey-800">{stepDesc}</h6>}
    </div>
  );
};

export default ValueLandStepInfo;
