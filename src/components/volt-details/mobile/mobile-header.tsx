"use client";

import React, { Dispatch, FC, SetStateAction, TransitionStartFunction } from "react";
import { z } from "zod";
import { IoInformationCircleOutline } from "react-icons/io5";
import { cn } from "@/lib/utils";
import { PropertyDataSchema } from "@/zod-validations/volt-new";
import { voltDetailsFiltersValidations } from "@/zod-validations/filters-validations";
import { Tooltip } from "../../ui/tooltip";
import { Switch } from "../../ui/switch";
import VoltMobileFilters from "./volt-mobile-filters";
import VoltDetailsFiltersWrapper from "../filters/wrapper";

interface VoltDetailsMobileHeaderProps {
  startFetchingTransition: TransitionStartFunction;
  data: z.infer<typeof PropertyDataSchema>;
  isNonValidMedianHighlighted: boolean;
  setNonValidMedianHighlighted: Dispatch<SetStateAction<boolean>>;
  propertyTypes: Array<{ id: number; group: "vacant-land" | "other"; value: string }>;
  filters: z.infer<typeof voltDetailsFiltersValidations>;
  setFilters: Dispatch<SetStateAction<z.infer<typeof voltDetailsFiltersValidations>>>;
  isSubscribed: boolean;
  mapLayers: {
    label: string;
    value: string;
  }[];
  setSelectedLayer: Dispatch<SetStateAction<string>>;
  selectedLayer: string;
}

const VoltDetailsMobileHeader: FC<VoltDetailsMobileHeaderProps> = ({
  startFetchingTransition,
  data,
  isNonValidMedianHighlighted,
  setNonValidMedianHighlighted,
  propertyTypes,
  filters,
  setFilters,
  isSubscribed,
  mapLayers,
  selectedLayer,
  setSelectedLayer,
}) => {
  // Show warnig
  console.log("ae");

  return (
    <div className="grid grid-cols-[1fr_minmax(0,_max-content)] gap-2 border-y bg-grey-30 p-3">
      <div className="grid grid-cols-2 gap-2">
        <div className="border rounded-xl py-2 px-3 h-9 bg-white text-xs font-medium flex items-center justify-between gap-2">
          <div
            style={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            Avg: <span className={cn(!isSubscribed && "blur-[2px]")}>{data.nonVoltPrice.formattedString}</span>
          </div>
          <Tooltip renderButton={<IoInformationCircleOutline className="size-5 text-grey-600" />} renderContent="Some text." />
        </div>
        <div className="border rounded-xl py-2 px-3 h-9 bg-white text-xs font-medium flex items-center justify-between gap-2">
          <div
            className="flex items-center gap-2 justify-between"
            style={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            <div
              style={{
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              VOLT:{" "}
              <span className={cn(!isSubscribed && "blur-[2px]")}>
                {data.assessments.calculations.avgPriceOfAssessments.all.formattedString}
              </span>
            </div>
            <Tooltip renderButton={<IoInformationCircleOutline className="size-5 text-grey-600" />} renderContent="Some text." />
          </div>
          <Switch
            checked={isNonValidMedianHighlighted}
            onCheckedChange={() => setNonValidMedianHighlighted(!isNonValidMedianHighlighted)}
            className="[&:has([data-state=checked])]:bg-warning"
          />
        </div>
      </div>
      <VoltDetailsFiltersWrapper
        filters={filters}
        propertyTypes={propertyTypes}
        setFilters={setFilters}
        startFetchingTransition={startFetchingTransition}
        mapLayers={mapLayers}
        setSelectedLayer={setSelectedLayer}
        selectedLayer={selectedLayer}
      />
    </div>
  );
};

export default VoltDetailsMobileHeader;
