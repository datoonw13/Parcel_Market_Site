"use client";

import { useAtom } from "jotai";
import { Dispatch, FC, SetStateAction, useEffect, useRef } from "react";
import { VoltPriceCalculationRes, VoltSearchModel, VoltSearchResultModel } from "@/types/volt";
import { IMap } from "@/types/map";
import { getStateValue } from "@/helpers/states";
import { capitalize } from "lodash";
import VoltItem from "./volt-item";

interface VoltSearchResultProps {
  onSearchResultItemHover?: (parcelNumberNoFormatting: string) => void;
  onSearchResultItemMouseLeave?: (parcelNumberNoFormatting: string) => void;
  highlightedParcelNumber: string | null;
  setValues: Dispatch<
    SetStateAction<{
      searchDetails: VoltSearchModel | null;
      searchResult: VoltSearchResultModel | null;
      selectedItem: IMap[0] | null;
      calculation: VoltPriceCalculationRes | null;
    }>
  >;
  values: {
    searchDetails: VoltSearchModel | null;
    searchResult: VoltSearchResultModel | null;
    selectedItem: IMap[0] | null;
    calculation: VoltPriceCalculationRes | null;
  };
}

const VoltSearchResult: FC<VoltSearchResultProps> = ({
  onSearchResultItemHover,
  onSearchResultItemMouseLeave,
  highlightedParcelNumber,
  setValues,
  values,
}) => {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.scrollIntoView();
    }
  }, []);

  return (
    <div ref={ref} className="space-y-4 pb-6">
      <div className="space-y-1">
        <h1 className="font-semibold text-lg">Did we find your property?</h1>
        <h2 className="text-sm text-grey-800">Use the map or list below to select your property.</h2>
      </div>
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
            onHover={onSearchResultItemHover}
            onMouseLeave={onSearchResultItemMouseLeave}
            selected={item.properties.fields.parcelnumb_no_formatting === values.selectedItem?.properties.fields.parcelnumb_no_formatting}
            onSelect={(parcelNumber) => {
              const item = values.searchResult?.find((el) => el.properties.fields.parcelnumb_no_formatting === parcelNumber);
              if (item) {
                setValues((prev) => ({ ...prev, selectedItem: item }));
              }
            }}
            isHighlighted={highlightedParcelNumber === item.properties.fields.parcelnumb_no_formatting}
          />
        ))}
      </div>
    </div>
  );
};

export default VoltSearchResult;
