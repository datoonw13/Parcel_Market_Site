"use client";

import React, { Dispatch, FC, SetStateAction, TransitionStartFunction, useMemo } from "react";
import { z } from "zod";
import { voltDetailsFiltersValidations } from "@/zod-validations/filters-validations";
import { FaCircleInfo } from "react-icons/fa6";
import { IoInformationCircleOutline } from "react-icons/io5";
import useMediaQuery from "@/hooks/useMediaQuery";
import { cn } from "@/lib/utils";
import { moneyFormatter } from "@/helpers/common";
import moment from "moment";
import { PropertyDataSchema } from "@/zod-validations/volt-new";
import VoltDetailsFiltersWrapper from "./filters/wrapper";
import { Tooltip } from "../ui/tooltip";
import { Switch } from "../ui/switch";
import VoltDetailsFiltersDropDown from "./filters/dropdown";

interface VoltDetailsHeaderProps {
  searchParams: { [key: string]: string };
  initialFilters: z.infer<typeof voltDetailsFiltersValidations>;
  startFetchingTransition: TransitionStartFunction;
  data: z.infer<typeof PropertyDataSchema>;
  setBackDrop: (value: boolean) => void;
  isNonValidMedianHighlighted: boolean;
  setNonValidMedianHighlighted: Dispatch<SetStateAction<boolean>>;
}

const VoltDetailsHeader: FC<VoltDetailsHeaderProps> = ({
  searchParams,
  initialFilters,
  startFetchingTransition,
  data,
  setBackDrop,
  isNonValidMedianHighlighted,
  setNonValidMedianHighlighted,
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
      <div className={cn("border-y border-y-grey-100 px-6 py-3 bg-[#F7F7F7] w-full grid  gap-6 grid-cols-[1fr_minmax(0,_max-content)]")}>
        <div className={cn("grid w-full grid-cols-[1fr_minmax(0,_max-content)]", isSmallDevice ? " gap-8" : "gap-14")}>
          <VoltDetailsFiltersWrapper
            searchParams={searchParams}
            initialFilters={initialFilters}
            startFetchingTransition={startFetchingTransition}
            onFilterToggle={setBackDrop}
          />
          <div className="flex items-center gap-2">
            <div className="border border-grey-100 bg-white px-3 py-2 flex justify-between items-center rounded-xl gap-4 h-full">
              <p className="text-sm font-medium">Avg: {moneyFormatter.format(avgPriceOfAssessments)}</p>
              <Tooltip renderButton={<IoInformationCircleOutline className="size-5 text-grey-600" />} renderContent="Some text." />
            </div>
            <div className="border border-grey-100 bg-white flex justify-between items-center rounded-xl h-full">
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
        <VoltDetailsFiltersDropDown
          onClose={() => {
            setBackDrop(false);
          }}
          onOpen={() => {
            setBackDrop(true);
          }}
          label={`${data.acreage.toFixed(2)} Acre, ${data.propertyType || "N/A"}`}
          value="Subject Parcel"
          renderContent={() => (
            <ul className="min-w-[--radix-popper-anchor-width] p-4 space-y-4">
              <li className="text-grey-600 font-medium text-sm marker:text-primary-main-400  ml-4 list-disc">
                Owner: <span className="text-sm font-medium text-black">{data?.owner}</span>
              </li>
              <li className="text-grey-600 font-medium text-sm marker:text-primary-main-400  ml-4 list-disc">
                Parcel ID: <span className="text-sm font-medium text-black">{data?.parcelNumber}</span>
              </li>
              <li className="text-grey-600 font-medium text-sm marker:text-primary-main-400  ml-4 list-disc">
                Acreage: <span className="text-sm font-medium text-black">{data?.acreage}</span>
              </li>
              <li className="text-grey-600 font-medium text-sm marker:text-primary-main-400  ml-4 list-disc">
                State/County: <span className="text-sm font-medium text-black">ae</span>
              </li>
              <li className="text-grey-600 font-medium text-sm marker:text-primary-main-400  ml-4 list-disc">
                Volt Value: <span className="text-sm font-medium text-black">{data?.price && moneyFormatter.format(data?.price)}</span>
              </li>
              <li className="text-grey-600 font-medium text-sm marker:text-primary-main-400  ml-4 list-disc">
                Price Per Acreage:{" "}
                <span className="text-sm font-medium text-black">{moneyFormatter.format(data.price / data.acreage)}</span>
              </li>
              <li className="text-grey-600 font-medium text-sm marker:text-primary-main-400  ml-4 list-disc">
                Property Type: <span className="text-sm font-medium text-black">{data?.propertyType || "N/A"}</span>
              </li>
              <li className="text-grey-600 font-medium text-sm marker:text-primary-main-400  ml-4 list-disc">
                Search Date: <span className="text-sm font-medium text-black">{moment(data.dateCreated).format("MM-DD-YYYY")}</span>
              </li>
            </ul>
          )}
        />
      </div>
    )
  );
};

export default VoltDetailsHeader;
