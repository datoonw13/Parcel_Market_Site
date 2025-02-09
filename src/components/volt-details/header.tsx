"use client";

import React, { Dispatch, FC, SetStateAction, TransitionStartFunction, useCallback, useMemo, useRef } from "react";
import { z } from "zod";
import { IoInformationCircleOutline } from "react-icons/io5";
import useMediaQuery from "@/hooks/useMediaQuery";
import { cn, hideNumber } from "@/lib/utils";
import { moneyFormatter } from "@/helpers/common";
import { PropertyDataSchema } from "@/zod-validations/volt-new";
import { voltDetailsFiltersValidations } from "@/zod-validations/filters-validations";
import Link from "next/link";
import routes from "@/helpers/routes";
import VoltDetailsFiltersWrapper from "./filters/wrapper";
import { Tooltip } from "../ui/tooltip";
import { Switch } from "../ui/switch";

interface VoltDetailsHeaderProps {
  startFetchingTransition: TransitionStartFunction;
  data: z.infer<typeof PropertyDataSchema>;
  isNonValidMedianHighlighted: boolean;
  setNonValidMedianHighlighted: Dispatch<SetStateAction<boolean>>;
  propertyTypes: Array<{ id: number; group: "vacant-land" | "other"; value: string }>;
  filters: z.infer<typeof voltDetailsFiltersValidations>;
  setFilters: Dispatch<SetStateAction<z.infer<typeof voltDetailsFiltersValidations>>>;
  isSubscribed: boolean;
}

const VoltDetailsHeader: FC<VoltDetailsHeaderProps> = ({
  startFetchingTransition,
  data,
  isNonValidMedianHighlighted,
  setNonValidMedianHighlighted,
  propertyTypes,
  filters,
  setFilters,
  isSubscribed,
}) => {
  const { detecting, targetReached: isSmallDevice } = useMediaQuery(1440);

  const avgPriceOfAssessments = useMemo(() => {
    let totalPrices = 0;
    totalPrices = data.assessments.reduce((acc, cur) => acc + cur.data.pricePerAcreage, 0);
    const avgPrice = totalPrices / data.assessments.length;
    return avgPrice;
  }, [data.assessments]);

  return (
    !detecting && (
      <div
        className={cn(
          "grid w-full grid-cols-[1fr_minmax(0,_max-content)] sticky top-0 bottom-8 z-10 py-1.5 px-2 ",
          isSmallDevice ? " gap-8" : "gap-14"
        )}
      >
        <VoltDetailsFiltersWrapper
          startFetchingTransition={startFetchingTransition}
          filters={filters}
          setFilters={setFilters}
          propertyTypes={propertyTypes}
        />
        <div className="relative">
          <div className="grid grid-cols-2 gap-2">
            <div className="shadow-6 border border-grey-100 bg-white px-3 py-2 flex justify-between items-center rounded-xl gap-4 h-full">
              <p className="text-sm font-medium">
                Avg:{" "}
                <span className={cn(!isSubscribed && "blur-[2px]")}>
                  {isSubscribed ? moneyFormatter.format(avgPriceOfAssessments) : hideNumber(moneyFormatter.format(avgPriceOfAssessments))}
                </span>
              </p>
              <Tooltip renderButton={<IoInformationCircleOutline className="size-5 text-grey-600" />} renderContent="Some text." />
            </div>
            <div className="shadow-6 border border-grey-100 bg-white flex justify-between items-center rounded-xl h-full">
              <div className="p-3 border-r flex items-center gap-2">
                <p className="text-sm font-medium">
                  VOLT:
                  <span className={cn(!isSubscribed && "blur-[2px]")}>
                    {isSubscribed
                      ? moneyFormatter.format(data.price / data.acreage)
                      : hideNumber(moneyFormatter.format(data.price / data.acreage))}
                  </span>
                </p>
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
          {!isSubscribed && (
            <Link
              className="bg-white shadow-5 w-full text-center block absolute rounded-lg p-3 translate-y-2 font-medium underline text-primary-main"
              href={routes.user.subscription.fullUrl}
            >
              Subscribe to see prices
            </Link>
          )}
        </div>
      </div>
    )
  );
};

export default VoltDetailsHeader;
