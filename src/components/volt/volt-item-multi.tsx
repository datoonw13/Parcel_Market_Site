import { cn } from "@/lib/utils";
import {
  IPropertyBaseInfo,
  IPropertyOwner,
  IPropertyPricePerAcre,
  IPropertySaleHistory,
  IPropertyUsedForCalculation,
} from "@/types/property";
import React, { FC } from "react";

type VoltItemData = IPropertyBaseInfo & Partial<IPropertySaleHistory> & Partial<IPropertyOwner> & Partial<IPropertyPricePerAcre>;

interface VoltItemMultiProps {
  data: IPropertyUsedForCalculation[];
  onHover: (id: VoltItemData | VoltItemData[]) => void;
  onMouseLeave: (id: VoltItemData | VoltItemData[]) => void;
  onSelect: (id: VoltItemData | VoltItemData[]) => void;
  highlightedItemParcelNumber: string | string[] | null;
  selectedItemParcelNumber: string | string[] | null;
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
      selected && " !border-primary-main-400 !bg-primary-main-50",
      "hover:bg-grey-50 hover:border-[#D5D3D3]"
    )}
  >
    <div
      onMouseEnter={() => onHover(data)}
      onMouseLeave={() => onMouseLeave(data)}
      onClick={() => {
        onSelect(data);
      }}
      className="space-y-3 px-5 py-4"
    >
      <div className="flex justify-between gap-6 pb-3 border-b border-[#D5D3D3]">
        <h1 className="font-semibold">Sold in Bulk</h1>
        <h2 className="font-medium text-xs text-grey-800">09/17/2024</h2>
      </div>
      <ul className="grid grid-cols-2 gap-1">
        <li className="text-xs text-grey-600">
          State: <span className="text-black font-medium">State</span>
        </li>
        <li className="text-xs text-grey-600">
          Sold Price: <span className="text-black font-medium">Sold Price</span>
        </li>
        <li className="text-xs text-grey-600">
          Acreage: <span className="text-black font-medium">Acreage</span>
        </li>

        <li className="text-xs text-grey-600">
          Per acre Price: <span className="text-black font-medium">Per acre Price</span>
        </li>
      </ul>
    </div>
    <div className="p-3 grid grid-cols-3 gap-1 rounded-b-2xl bg-grey-100 h-full py-3">
      {data.map((item, itemI) => (
        <div
          onMouseEnter={() => onHover(item)}
          onMouseLeave={() => onMouseLeave(item)}
          onClick={() => onSelect(item)}
          key={item.id + itemI.toString()}
          id={`calculation-${item.id}`}
          className={cn(
            "p-2 rounded-lg bg-white space-y-2 border border-transparent hover:bg-grey-50 hover:border-[#D5D3D3]",
            !Array.isArray(selectedItemParcelNumber) &&
              selectedItemParcelNumber === item.parcelNumberNoFormatting &&
              "border !border-primary-main-400 !bg-primary-main-50",
            !Array.isArray(highlightedItemParcelNumber) &&
              highlightedItemParcelNumber === item.parcelNumberNoFormatting &&
              "bg-grey-50 border-[#D5D3D3]"
          )}
        >
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
