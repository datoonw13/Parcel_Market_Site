import { IMap } from "@/types/map";
import { VoltPriceCalculationRes, VoltSearchModel, VoltSearchResultModel } from "@/types/volt";
import React, { Dispatch, FC, SetStateAction, useEffect, useRef } from "react";
import { removeParcelNumberFormatting } from "@/helpers/common";
import VoltItem from "./volt-item";

interface VoltCalculationProps {
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
  onSearchResultItemHover?: (parcelNumberNoFormatting: string) => void;
  onSearchResultItemMouseLeave?: (parcelNumberNoFormatting: string) => void;
  highlightedParcelNumber: string | null;
}

const VoltCalculation: FC<VoltCalculationProps> = ({
  values,
  setValues,
  highlightedParcelNumber,
  onSearchResultItemHover,
  onSearchResultItemMouseLeave,
}) => {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.scrollIntoView();
    }
  }, []);

  return (
    <>
      <div ref={ref} className="space-y-4">
        <div className="space-y-1">
          <h1 className="font-semibold text-lg">Subject Parcel</h1>
          <h2 className="text-sm text-grey-800">This is the parcel of land that you searched.</h2>
        </div>
        <div className="flex flex-col gap-2">
          {values.selectedItem && (
            <VoltItem
              onHover={onSearchResultItemHover}
              onMouseLeave={onSearchResultItemMouseLeave}
              id={`calculation-${values.selectedItem.properties.fields.parcelnumb}`}
              data={{
                acreage: Number(values.selectedItem.properties.fields.ll_gisacre),
                owner: values.selectedItem.properties.fields.owner,
                parcelNumber: values.selectedItem.properties.fields.parcelnumb_no_formatting,
                pricePerAcre: null,
              }}
              selected
              isHighlighted={highlightedParcelNumber === values.selectedItem.properties.fields.parcelnumb_no_formatting}
            />
          )}
        </div>
      </div>
      <div className="space-y-4">
        <div className="space-y-1">
          <h1 className="font-semibold text-lg">Recent Sales</h1>
          <h2 className="text-sm text-grey-800">
            These are vacant land parcels that have sold in the past two years, within 10 miles of the subject parcel and are of similar
            acreage.
          </h2>
        </div>
        <div className="flex flex-col gap-2">
          {values.calculation?.properties.map((item) => (
            <VoltItem
              id={`calculation-${removeParcelNumberFormatting(item.parselId)}`}
              onHover={onSearchResultItemHover}
              onMouseLeave={onSearchResultItemMouseLeave}
              key={item.parselId}
              data={{
                acreage: Number(item.arcage),
                owner: item.owner || "",
                parcelNumber: item.parselId,
                pricePerAcre: Number(item.lastSalesPrice) / Number(item.arcage),
              }}
              isHighlighted={highlightedParcelNumber === removeParcelNumberFormatting(item.parselId)}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default VoltCalculation;
