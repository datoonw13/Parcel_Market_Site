"use client";

import { Dispatch, FC, SetStateAction, useEffect, useRef } from "react";
import { VoltWrapperValuesModel } from "@/types/volt";
import { getStateValue } from "@/helpers/states";
import { capitalize } from "lodash";
import { cn } from "@/lib/utils";
import { MapInteractionModel } from "@/types/common";
import { removeParcelNumberFormatting } from "@/helpers/common";
import { IDecodedAccessToken } from "@/types/auth";
import VoltItem from "./volt-item";

interface VoltSearchResultProps {
  setValues: Dispatch<SetStateAction<VoltWrapperValuesModel>>;
  values: VoltWrapperValuesModel;
  showOnlyTitle?: boolean;
  className?: string;
  mapInteraction: MapInteractionModel;
  setMpaInteraction: Dispatch<SetStateAction<MapInteractionModel>>;
}

const VoltSearchResult: FC<VoltSearchResultProps> = ({
  setValues,
  values,
  showOnlyTitle,
  className,
  mapInteraction,
  setMpaInteraction,
}) => {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.scrollIntoView();
    }
  }, []);

  return (
    <div ref={ref} className={cn("space-y-4", className)}>
      <div className="space-y-1">
        <h1 className="font-semibold text-lg">Did we find your property?</h1>
        {!showOnlyTitle && <h2 className="text-sm text-grey-800">Use the map or list below to select your property.</h2>}
      </div>
      {!showOnlyTitle && (
        <div className="flex flex-col gap-2">
          {values.searchResult?.map((item) => (
            <VoltItem
              id={`search-result-${item.properties.fields.parcelnumb_no_formatting}`}
              key={item.properties.fields.parcelnumb}
              data={{
                acreage: Number(item.properties.fields.ll_gisacre),
                owner: item.properties.fields.owner,
                parcelNumber: item.properties.fields.parcelnumb_no_formatting,
                pricePerAcre: null,
                state: getStateValue(item.properties.fields.state2)?.label || "",
                county: capitalize(item.properties.fields.county),
              }}
              onHover={(parcelNumberNoFormatting) => {
                setMpaInteraction((prevData) => ({
                  ...prevData,
                  hoveredParcelNumber: removeParcelNumberFormatting(parcelNumberNoFormatting),
                  zoom: true,
                }));
              }}
              onMouseLeave={() => {
                setMpaInteraction((prevData) => ({
                  ...prevData,
                  hoveredParcelNumber: null,
                  zoom: false,
                }));
              }}
              selected={item.properties.fields.parcelnumb_no_formatting === values.selectedItem?.properties.fields.parcelnumb_no_formatting}
              onSelect={(parcelNumberNoFormatting) => {
                const item = values.searchResult?.find((el) => el.properties.fields.parcelnumb_no_formatting === parcelNumberNoFormatting);
                if (item) {
                  setValues((prev) => ({ ...prev, selectedItem: item }));
                }
                setMpaInteraction((prevData) => ({
                  ...prevData,
                  openPopperParcelNumber: parcelNumberNoFormatting,
                  zoom: true,
                }));
              }}
              isHighlighted={
                mapInteraction.hoveredParcelNumber === item.properties.fields.parcelnumb_no_formatting ||
                mapInteraction.openPopperParcelNumber === item.properties.fields.parcelnumb_no_formatting
              }
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default VoltSearchResult;
