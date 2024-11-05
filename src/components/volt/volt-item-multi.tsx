import { cn } from "@/lib/utils";
import {
  IBulkPropertiesUsedForCalculation,
  IPropertyBaseInfo,
  IPropertyOwner,
  IPropertyPricePerAcre,
  IPropertySaleHistory,
} from "@/types/property";
import moment from "moment";
import React, { FC } from "react";

interface VoltItemMultiProps {
  data: IBulkPropertiesUsedForCalculation;
  onHover: (parcelNumberNoFormatting: string) => void;
  onMouseLeave: (parcelNumberNoFormatting: string) => void;
  onSelect: (parcelNumberNoFormatting: string) => void;
  highlightedItemParcelNumber: string | null;
  selectedItemParcelNumber: string | null;
  selected?: boolean;
}

const VoltItemMulti: FC<VoltItemMultiProps> = ({
  data,
  onHover,
  onMouseLeave,
  onSelect,
  highlightedItemParcelNumber,
  selectedItemParcelNumber,
  selected,
}) => (
  <div
    className={cn(
      "rounded-2xl border border-[#D5D3D3] cursor-pointer transition-all duration-100",
      selectedItemParcelNumber &&
        data.data.parcelNumberNoFormatting.includes(selectedItemParcelNumber) &&
        "!border-primary-main-400 !bg-primary-main-50",
      highlightedItemParcelNumber &&
        data.data.parcelNumberNoFormatting.includes(highlightedItemParcelNumber) &&
        "bg-grey-50 border-[#D5D3D3]",
      "hover:bg-grey-50 hover:border-[#D5D3D3]"
    )}
    onMouseEnter={() => onHover(data.data.parcelNumberNoFormatting)}
    onMouseLeave={() => onMouseLeave(data.data.parcelNumberNoFormatting)}
    onClick={() => {
      onSelect(data.data.parcelNumberNoFormatting);
    }}
    id={`calculation-${data.data.parcelNumberNoFormatting}`}
  >
    <div className="space-y-3 px-5 py-4">
      <div className="flex justify-between gap-6 pb-3 border-b border-[#D5D3D3]">
        <h1 className="font-semibold">Sold in Bulk</h1>
        <h2 className="font-medium text-xs text-grey-800">{moment(data.data.properties[0].lastSaleDate).format("MM/DD/YYYY")}</h2>
      </div>
      <ul className="grid grid-cols-2 gap-1">
        <li className="text-xs text-grey-600">
          State: <span className="text-black font-medium">{data.data.state.label}</span>
        </li>
        <li className="text-xs text-grey-600">
          Sold Price: <span className="text-black font-medium">{data.data.price.toFixed(2)}</span>
        </li>
        <li className="text-xs text-grey-600">
          Acreage: <span className="text-black font-medium">{data.data.acreage.toFixed(2)}</span>
        </li>

        <li className="text-xs text-grey-600">
          Per acre Price: <span className="text-black font-medium">{data.data.pricePerAcreage.toFixed(2)}</span>
        </li>
      </ul>
    </div>
    <div className="p-3 grid grid-cols-3 gap-1 rounded-b-2xl bg-grey-100 h-full py-3">
      {data.data.properties.map((item, itemI) => (
        <div key={item.id + itemI.toString()} className={cn("p-2 rounded-lg bg-white space-y-2 border border-transparent")}>
          <p className="text-xs text-grey-600">
            Acreage: <span className="text-black font-medium">{item.acreage.toFixed(2)}</span>
          </p>
          <p className="text-xs text-grey-600">
            Parcel Number: <span className="text-black font-medium">#{item.parcelNumberNoFormatting}</span>
          </p>
        </div>
      ))}
    </div>
  </div>
);

export default VoltItemMulti;
