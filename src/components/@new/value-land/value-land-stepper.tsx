"use client";

import { uuid } from "short-uuid";
import clsx from "clsx";
import { usePathname } from "next/navigation";
import routes from "@/helpers/routes";
import classes from "@/app/value-land/styles.module.css";
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

const ValueLandStepper = ({ currentStep }: { currentStep: number }) => (
  <div className={clsx("border-b border-b-grey-100", classes["content-space-x"])}>
    <div className={clsx("relative flex items-center my-6 h-8")}>
      <Divider />
      <div className="absolute flex justify-between gap-2 w-full">
        {new Array(steps)
          .fill(0)
          .map((_, i) => i + 1)
          .map((step) =>
            step >= currentStep ? (
              <div
                className={clsx(
                  "w-8 h-8 rounded-full border flex items-center justify-center bg-white z-10 top-[-50%] transform-y-[50%] font-medium",
                  currentStep === step ? "border-success" : "border-grey-200"
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
  </div>
);

export default ValueLandStepper;
