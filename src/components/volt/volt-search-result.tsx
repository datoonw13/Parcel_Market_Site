"use client";

import { Dispatch, FC, SetStateAction, useEffect, useRef } from "react";
import { VoltWrapperValuesModel } from "@/types/volt";
import { cn, isElementVisible } from "@/lib/utils";
import { MapInteractionModel } from "@/types/common";
import { removeParcelNumberFormatting } from "@/helpers/common";
import VoltItem from "./volt-item";

interface VoltSearchResultProps {
  setValues: Dispatch<SetStateAction<VoltWrapperValuesModel>>;
  values: VoltWrapperValuesModel;
  className?: string;
  mapInteraction: MapInteractionModel;
  setMpaInteraction: Dispatch<SetStateAction<MapInteractionModel>>;
}

const VoltSearchResult: FC<VoltSearchResultProps> = ({ setValues, values, className, mapInteraction, setMpaInteraction }) => {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.scrollIntoView();
    }
  }, []);

  useEffect(() => {
    if (
      (mapInteraction.hoveredParcelNumber || mapInteraction.openPopperParcelNumber) &&
      !isElementVisible(`search-result-${mapInteraction.hoveredParcelNumber}`, "volt-scroll")
    ) {
      document
        .getElementById(`calculation-${mapInteraction.hoveredParcelNumber}`)
        ?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [mapInteraction.hoveredParcelNumber, mapInteraction.openPopperParcelNumber]);

  return (
    <div ref={ref} className={cn("space-y-4", className)}>
      <div className="space-y-1">
        <h1 className="font-semibold text-lg">Did we find your property?</h1>
        <h2 className="text-sm text-grey-800">Use the map or list below to select your property.</h2>
      </div>
      <div className="flex flex-col gap-2">
        {values.searchResult?.map((item) => (
          <VoltItem
            id={`search-result-${item.id}`}
            key={item.id}
            data={item}
            onHover={(property) => {
              setMpaInteraction((prevData) => ({
                ...prevData,
                hoveredParcelNumber: removeParcelNumberFormatting(property.parcelNumberNoFormatting),
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
            selected={item.parcelNumberNoFormatting === values.selectedItem?.parcelNumberNoFormatting}
            onSelect={(property) => {
              const item = values.searchResult?.find((el) => el.parcelNumberNoFormatting === property.parcelNumberNoFormatting);
              if (item) {
                setValues((prev) => ({ ...prev, selectedItem: item }));
              }
              setMpaInteraction((prevData) => ({
                ...prevData,
                openPopperParcelNumber: property.parcelNumberNoFormatting,
                zoom: true,
              }));
            }}
            isHighlighted={
              mapInteraction.hoveredParcelNumber === item.parcelNumberNoFormatting ||
              mapInteraction.openPopperParcelNumber === item.parcelNumberNoFormatting
            }
          />
        ))}
      </div>
    </div>
  );
};

export default VoltSearchResult;
