"use client";

import { ISellingProperty } from "@/types/find-property";
import CalculationMap from "./calculation-map";
import LandPriceCalculationTable from "./calculation-table";

const RecentSalesList = ({ data }: { data: NonNullable<ISellingProperty["usedForPriceCalculations"]> }) => {
  console.log("aq");

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <h1 className="text-center font-semibold text-lg md:text-xl lg:text-2xl">Recent Sales List</h1>
        <h2 className="text-center text-grey-800 text-sm">
          Below are recent sales used by VOLT for similar acreage within 10 miles and over the past 2 years.
        </h2>
      </div>
      <CalculationMap data={data} />
      <LandPriceCalculationTable data={data} />
    </div>
  );
};

export default RecentSalesList;
