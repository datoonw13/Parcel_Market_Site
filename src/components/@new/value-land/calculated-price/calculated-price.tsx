import { getUserAction } from "@/server-actions/user/actions";
import CalculatedPriceDetails from "./caluclation-details";
import SubmitLand from "./submit-land";
import SaveCalculationData from "./save-calculation-data";
import CalculationDetailsMap from "./calculatation-details-map";

const ValueLandCalculatedPrice = async () => {
  const user = await getUserAction();
  return (
    <>
      <div className="mx-4 md:mx-6 lg:mx-8 pb-4 md:pb-6 lg:pb-8 space-y-12">
        <div className="space-y-4 md:space-y-6">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 justify-between">
            <div className="space-y-2">
              <h1 className="text-lg font-semibold">The average price for similar sized property in your area</h1>
              <h2 className="text-grey-800 text-sm">
                To view, save, or export sales data used in this calculation, you must sign in or create an account with us.
              </h2>
            </div>
            <SaveCalculationData user={user} />
          </div>
          <CalculatedPriceDetails />
        </div>
        <SubmitLand />
        <CalculationDetailsMap />
      </div>
    </>
  );
};

export default ValueLandCalculatedPrice;
