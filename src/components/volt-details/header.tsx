"use client";

import React, { Dispatch, FC, SetStateAction, TransitionStartFunction, useCallback, useEffect, useMemo, useRef } from "react";
import { z } from "zod";
import { voltDetailsFiltersValidations } from "@/zod-validations/filters-validations";
import { IoInformationCircleOutline } from "react-icons/io5";
import useMediaQuery from "@/hooks/useMediaQuery";
import { cn } from "@/lib/utils";
import { moneyFormatter } from "@/helpers/common";
import { PropertyDataSchema } from "@/zod-validations/volt-new";
import VoltDetailsFiltersWrapper from "./filters/wrapper";
import { Tooltip } from "../ui/tooltip";
import { Switch } from "../ui/switch";

interface VoltDetailsHeaderProps {
  searchParams: { [key: string]: string };
  initialFilters: z.infer<typeof voltDetailsFiltersValidations>;
  startFetchingTransition: TransitionStartFunction;
  data: z.infer<typeof PropertyDataSchema>;
  isNonValidMedianHighlighted: boolean;
  setNonValidMedianHighlighted: Dispatch<SetStateAction<boolean>>;
  propertyTypes: Array<{ id: number; group: "vacant-land" | "other"; value: string }>;
}

const VoltDetailsHeader: FC<VoltDetailsHeaderProps> = ({
  searchParams,
  initialFilters,
  startFetchingTransition,
  data,
  isNonValidMedianHighlighted,
  setNonValidMedianHighlighted,
  propertyTypes,
}) => {
  const { detecting, targetReached: isSmallDevice } = useMediaQuery(1440);
  const ref = useRef<HTMLDivElement>(null);

  const avgPriceOfAssessments = useMemo(() => {
    let totalPrices = 0;
    totalPrices = data.assessments.reduce((acc, cur) => acc + cur.data.pricePerAcreage, 0);
    const avgPrice = totalPrices / data.assessments.length;
    return avgPrice;
  }, [data.assessments]);

  const handleResize = useCallback(() => {
    const el = document.getElementById("map-options");
    if (el && ref.current) {
      const { width } = el.getBoundingClientRect();
      ref.current.style.width = `calc(100% - ${width}px)`;
    }
  }, []);

  // useEffect(() => {
  //   handleResize();
  //   if (!detecting) {
  //     window.addEventListener("resize", handleResize);
  //   }
  //   return () => {
  //     window.removeEventListener("resize", handleResize);
  //   };
  // }, [handleResize, detecting]);

  return (
    !detecting && (
      <div
        ref={ref}
        className={cn(
          "grid w-full grid-cols-[1fr_minmax(0,_max-content)] sticky top-0 bottom-8 z-10 py-1.5 px-2 ",
          isSmallDevice ? " gap-8" : "gap-14"
        )}
      >
        <VoltDetailsFiltersWrapper
          searchParams={searchParams}
          initialFilters={initialFilters}
          startFetchingTransition={startFetchingTransition}
          propertyTypes={propertyTypes}
        />
        <div className="flex items-center gap-2">
          <div className="shadow-6 border border-grey-100 bg-white px-3 py-2 flex justify-between items-center rounded-xl gap-4 h-full">
            <p className="text-sm font-medium">Avg: {moneyFormatter.format(avgPriceOfAssessments)}</p>
            <Tooltip renderButton={<IoInformationCircleOutline className="size-5 text-grey-600" />} renderContent="Some text." />
          </div>
          <div className="shadow-6 border border-grey-100 bg-white flex justify-between items-center rounded-xl h-full">
            <div className="p-3 border-r flex items-center gap-2">
              <p className="text-sm font-medium">VOLT: {moneyFormatter.format(data.price / data.acreage)}</p>
              <Tooltip renderButton={<IoInformationCircleOutline className="size-5 text-warning" />} renderContent="Some text." />
            </div>
            <div className="p-3 flex">
              <Switch
                checked={isNonValidMedianHighlighted}
                onCheckedChange={() => setNonValidMedianHighlighted(!isNonValidMedianHighlighted)}
                className="[&:has([data-state=checked])]:bg-warning"
              />
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default VoltDetailsHeader;
