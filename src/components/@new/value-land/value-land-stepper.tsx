"use client";

import { uuid } from "short-uuid";
import clsx from "clsx";
import { usePathname } from "next/navigation";
import routes from "@/helpers/routes";
import { CheckIcon3 } from "../icons/CheckIcons";
import Divider from "../shared/Divider";

const currentStep = (path: string) => {
  switch (path) {
    case routes.valueLand.found.fullUrl:
      return 2;
    case routes.valueLand.value.fullUrl:
      return 3;
    default:
      return 1;
  }
};
const steps = 3;

const ValueLandStepper = () => {
  const pathname = usePathname();
  return (
    pathname !== routes.valueLand.about.fullUrl && (
      <div className="relative h-8 flex items-center mx-4 md:mx-6 lg:mx-8 mb-6">
        <Divider />
        <div className="absolute flex justify-between gap-2 w-full">
          {new Array(steps)
            .fill(0)
            .map((_, i) => i + 1)
            .map((step) =>
              step >= currentStep(pathname) ? (
                <div
                  className={clsx(
                    "w-8 h-8 rounded-full border flex items-center justify-center bg-white z-10 top-[-50%] transform-y-[50%] font-medium",
                    currentStep(pathname) === step ? "border-success" : "border-grey-200"
                  )}
                  key={uuid()}
                >
                  {step}
                </div>
              ) : (
                <div className="w-8 h-8 bg-success rounded-full flex justify-center items-center" key={uuid()}>
                  <CheckIcon3 color="white" className="!w-6 !h-4" />
                </div>
              )
            )}
        </div>
      </div>
    )
  );
};

export default ValueLandStepper;
