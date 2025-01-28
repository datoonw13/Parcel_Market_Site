"use client";

import { FC, useTransition } from "react";
import { z } from "zod";
import { voltDetailsFiltersValidations } from "@/zod-validations/filters-validations";
import { IVoltPriceCalculation } from "@/types/volt";
import VoltDetails from "./details";
import VoltDetailsHeaderLogo from "./logo";
import VoltDetailsHeader from "./header";

interface VoltDetailsLayoutProps {
  searchParams: { [key: string]: string };
  initialFilters: z.infer<typeof voltDetailsFiltersValidations>;
  loading?: boolean;
  data: {
    data: IVoltPriceCalculation & { dateCreated: Date };
    additionalData: IVoltPriceCalculation & { dateCreated: Date };
  } | null;
}

const VoltDetailsLayout: FC<VoltDetailsLayoutProps> = ({ initialFilters, searchParams, loading, data }) => {
  const [isFetching, startFetchingTransition] = useTransition();
  const averageOfPropertiesUsedForCal = data?.data
    ? data?.data.propertiesUsedForCalculation.reduce((acc, cur) => acc + cur.data.pricePerAcreage, 0) /
      data?.data.propertiesUsedForCalculation.length
    : null;

  return (
    <div className="h-screen flex flex-col">
      <VoltDetailsHeaderLogo />
      <VoltDetailsHeader
        data={
          data?.data && averageOfPropertiesUsedForCal
            ? {
                owner: data.data.owner,
                parcelNumber: data.data.parcelNumberNoFormatting,
                acreage: Number(data.data.acreage.toFixed(2)),
                stateAndCounty: `${data.data.state.label}/${data.data.county.label}`,
                price: data?.data.price,
                pricePerAcreage: data.data.pricePerAcreage,
                propertyType: data.data.propertyType,
                searchDate: data.data.dateCreated,
                averageOfPropertiesUsedForCal,
              }
            : null
        }
        initialFilters={initialFilters}
        searchParams={searchParams}
        startFetchingTransition={startFetchingTransition}
      />
      <div className="w-full h-full overflow-hidden">
        <VoltDetails data={data} averageOfPropertiesUsedForCal={averageOfPropertiesUsedForCal || 0} loading={loading || isFetching} />;
      </div>
    </div>
  );
};

export default VoltDetailsLayout;
