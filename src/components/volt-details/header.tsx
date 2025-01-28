import React, { FC, TransitionStartFunction } from "react";
import { z } from "zod";
import { voltDetailsFiltersValidations } from "@/zod-validations/filters-validations";
import VoltDetailsFiltersWrapper from "./filters/wrapper";

interface VoltDetailsHeaderProps {
  searchParams: { [key: string]: string };
  initialFilters: z.infer<typeof voltDetailsFiltersValidations>;
  startFetchingTransition: TransitionStartFunction;
}

const VoltDetailsHeader: FC<VoltDetailsHeaderProps> = ({ searchParams, initialFilters, startFetchingTransition }) => {
  console.log("aee");

  return (
    <div className="border-y border-y-grey-100 px-6 py-3 bg-[#F7F7F7]">
      <VoltDetailsFiltersWrapper
        searchParams={searchParams}
        initialFilters={initialFilters}
        startFetchingTransition={startFetchingTransition}
      />
    </div>
  );
};

export default VoltDetailsHeader;
