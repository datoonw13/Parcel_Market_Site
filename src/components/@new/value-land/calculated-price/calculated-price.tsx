import { getUserAction } from "@/server-actions/user/actions";
import classes from "@/app/value-land/(main)/styles.module.css";
import clsx from "clsx";
import CalculatedPriceDetails from "./caluclation-details";
import SubmitLand from "./submit-land";
import SaveCalculationData from "./save-calculation-data";
import CalculationDetailsMap from "./calculatation-details-map";
import ValueLandStepper from "../value-land-stepper";

const ValueLandCalculatedPrice = async () => {
  const user = await getUserAction();

  return (
    <>
      <div className="h-full flex flex-col w-full gap-6 pb-4 sm:pb-5 md:pb-6 lg:pb-8">
        <ValueLandStepper currentStep={3} />
        <div className={clsx("flex flex-col sm:flex-row gap-3 sm:gap-6 justify-between", classes["content-space-x"])}>
          <div className="space-y-2">
            <h1 className="text-lg font-semibold">The average price for similar sized property in your area</h1>
            <h2 className="text-grey-800 text-sm">
              To view, save, or export sales data used in this calculation, you must sign in or create an account with us.
            </h2>
          </div>
          <SaveCalculationData user={user} />
        </div>
        <div className={clsx("space-y-12", classes["content-space-x"])}>
          <div className="space-y-4">
            <CalculatedPriceDetails user={user} />
            <div className="h-72 sm:h-80 w-full xl:hidden [&>div]:rounded-2xl">
              <CalculationDetailsMap user={user} />
            </div>
          </div>
          <SubmitLand />
        </div>
      </div>
    </>
  );
};

export default ValueLandCalculatedPrice;
