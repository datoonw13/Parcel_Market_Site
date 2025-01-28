"use client";

import React, { FC, TransitionStartFunction } from "react";
import { z } from "zod";
import { voltDetailsFiltersValidations } from "@/zod-validations/filters-validations";
import { FaCircleInfo } from "react-icons/fa6";
import { IoInformationCircleOutline } from "react-icons/io5";
import useMediaQuery from "@/hooks/useMediaQuery";
import { cn } from "@/lib/utils";
import VoltDetailsFiltersWrapper from "./filters/wrapper";
import { Tooltip } from "../ui/tooltip";
import { Switch } from "../ui/switch";
import VoltDetailsFiltersDropDown from "./filters/dropdown";

interface VoltDetailsHeaderProps {
  searchParams: { [key: string]: string };
  initialFilters: z.infer<typeof voltDetailsFiltersValidations>;
  startFetchingTransition: TransitionStartFunction;
}

const VoltDetailsHeader: FC<VoltDetailsHeaderProps> = ({ searchParams, initialFilters, startFetchingTransition }) => {
  const { detecting, targetReached: isSmallDevice } = useMediaQuery(1440);

  return (
    !detecting && (
      <div className={cn("border-y border-y-grey-100 px-6 py-3 bg-[#F7F7F7] w-full grid  gap-6 grid-cols-[1fr_minmax(0,_max-content)]")}>
        <div className={cn("grid w-full grid-cols-[1fr_minmax(0,_max-content)]", isSmallDevice ? " gap-8" : "gap-14")}>
          <VoltDetailsFiltersWrapper
            searchParams={searchParams}
            initialFilters={initialFilters}
            startFetchingTransition={startFetchingTransition}
          />
          <div className="flex items-center gap-2">
            <div className="border border-grey-100 bg-white px-3 py-2 flex justify-between items-center rounded-xl gap-4 h-full">
              <p className="text-sm font-medium">Avg: 1,239$</p>
              <Tooltip renderButton={<IoInformationCircleOutline className="size-5 text-grey-600" />} renderContent="Some text." />
            </div>
            <div className="border border-grey-100 bg-white flex justify-between items-center rounded-xl h-full">
              <div className="p-3 border-r flex items-center gap-2">
                <p className="text-sm font-medium">Avg: 1,239$</p>
                <Tooltip renderButton={<IoInformationCircleOutline className="size-5 text-warning" />} renderContent="Some text." />
              </div>
              <div className="p-3 flex">
                <Switch className="[&:has([data-state=checked])]:bg-warning" />
              </div>
            </div>
          </div>
        </div>
        <VoltDetailsFiltersDropDown label="12.3 Acre, Residental - Vacant Land" value="Subject land" renderContent={() => <div>ae</div>} />
      </div>
    )
  );
};

export default VoltDetailsHeader;
