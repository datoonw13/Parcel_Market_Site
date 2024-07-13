"use client";

import { uuid } from "short-uuid";
import clsx from "clsx";
import Divider from "../shared/Divider";
import { CheckIcon3 } from "../icons/CheckIcons";

const ValueLandStepper = ({ steps, currentStep }: { steps: number; currentStep: number }) => (
  <div className="relative h-8 flex items-center">
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
);

export default ValueLandStepper;
