"use client";

import { cn } from "@/lib/utils";
import { VoltWrapperValuesModel } from "@/types/volt";
import { FC, useEffect } from "react";
import { useAtom, useSetAtom } from "jotai";
import { useResetAtom } from "jotai/utils";
import { propertyInteractionAtom } from "@/atoms/property-interaction-atom";
import VoltItem from "./volt-item";
import { voltAtom } from "./volt-atom";

interface IVoltSearchResults {
  data: NonNullable<VoltWrapperValuesModel["searchResult"]>;
  className?: string;
}

const VoltSearchResults: FC<IVoltSearchResults> = ({ data, className }) => {
  const [voltAtomValue, setVoltAtom] = useAtom(voltAtom);
  const resetVoltAtom = useResetAtom(voltAtom);

  useEffect(() => {
    setVoltAtom((prev) => ({
      ...prev,
      searchResults: data,
      sellingPropertyParcelNumber: data.length === 1 ? data[0].parcelNumberNoFormatting : null,
    }));
    return () => {
      resetVoltAtom();
    };
  }, [data, resetVoltAtom, setVoltAtom]);

  return (
    <div className={cn("space-y-4", className)}>
      <div className="space-y-1">
        <h1 className="font-semibold text-lg">Did we find your property?</h1>
        <h2 className="text-sm text-grey-800">Use the map or list below to select your property.</h2>
      </div>
      <div className="flex flex-col gap-2">
        {data.map((item) => (
          <VoltItem
            isSellingProperty
            id={`search-result-${item.id}`}
            key={item.id}
            data={item}
            onMouseEnter={(property) => {
              setVoltAtom((prevData) => ({
                ...prevData,
                hoveredParcelNumber:
                  property.parcelNumberNoFormatting === prevData.selectedParcelNumber ? null : property.parcelNumberNoFormatting,
                zoomMap: data.length > 1,
              }));
            }}
            onMouseLeave={() => {
              setVoltAtom((prevData) => ({
                ...prevData,
                hoveredParcelNumber: null,
                zoomMap: false,
              }));
            }}
            selected={
              item.parcelNumberNoFormatting === voltAtomValue.selectedParcelNumber ||
              voltAtomValue.sellingPropertyParcelNumber === item.parcelNumberNoFormatting
            }
            onSelect={(property) => {
              setVoltAtom((prevData) => ({
                ...prevData,
                hoveredParcelNumber: null,
                selectedParcelNumber: property.parcelNumberNoFormatting,
                zoom: true,
              }));
            }}
            isHighlighted={
              voltAtomValue.hoveredParcelNumber === item.parcelNumberNoFormatting ||
              voltAtomValue.selectedParcelNumber === item.parcelNumberNoFormatting
            }
          />
        ))}
      </div>
    </div>
  );
};
export default VoltSearchResults;
