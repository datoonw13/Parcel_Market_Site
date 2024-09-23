"use client";

import { useAtom } from "jotai";
import { Dispatch, FC, SetStateAction, useEffect, useRef } from "react";
import { VoltPriceCalculationRes, VoltSearchModel, VoltSearchResultModel } from "@/types/volt";
import { IMap } from "@/types/map";
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

function isElementVisible(ele: HTMLElement) {
  const rect = ele.getBoundingClientRect();
  const containerRect = ele.closest("#volt-scroll>div")?.getBoundingClientRect();

  if (!containerRect) {
    return false;
  }
  return rect.top >= containerRect.top && rect.bottom <= containerRect.bottom;
}

const VoltSearchResult: FC<VoltSearchResultProps> = ({
  onSearchResultItemHover,
  onSearchResultItemMouseLeave,
  highlightedParcelNumber,
  setValues,
  values,
}) => {
  const ref = useRef<HTMLDivElement | null>(null);

  const highlightItem = (parcelNumber: string) => {
    const item = document.getElementById(parcelNumber);
    if (item && ref.current) {
      if (!isElementVisible(item)) {
        item.scrollIntoView();
      }
    }
  };

  useEffect(() => {
    if (ref.current) {
      ref.current.scrollIntoView();
    }
  }, []);

  useEffect(() => {
    if (highlightedParcelNumber) {
      highlightItem(highlightedParcelNumber);
    }
  }, [highlightedParcelNumber]);

  return (
    <div ref={ref} className="space-y-4">
      <div className="space-y-1">
        <h1 className="font-semibold text-lg">Did we find your property?</h1>
        <h2 className="text-sm text-grey-800">Use the map or list below to select your property.</h2>
      </div>
      <div className="flex flex-col gap-2">
        {values.searchResult?.map((item) => (
          <VoltItem
            id={item.properties.fields.parcelnumb_no_formatting}
            key={item.properties.fields.parcelnumb}
            data={{
              acreage: Number(item.properties.fields.ll_gisacre),
              owner: item.properties.fields.owner,
              parcelNumber: item.properties.fields.parcelnumb_no_formatting,
              pricePerAcre: null,
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
