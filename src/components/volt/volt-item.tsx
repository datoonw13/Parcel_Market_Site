import { removeParcelNumberFormatting, moneyFormatter } from "@/helpers/common";
import { getAllStates } from "@/helpers/states";
import { cn } from "@/lib/utils";
import { IMap } from "@/types/map";
import React, { FC } from "react";

interface VoltItemProps {
  data: {
    owner: string;
    parcelNumber: string;
    acreage: number;
    pricePerAcre?: number | null;
    state: string;
    county: string;
    lastSalePrice?: number;
    lastSaleDate?: string;
  };
  selected?: boolean;
  onHover?: (parcelNumberNoFormatting: string) => void;
  onMouseLeave?: (parcelNumberNoFormatting: string) => void;
  onSelect?: (parcelNumberNoFormatting: string) => void;
  id: string;
  isHighlighted?: boolean;
}

const VoltItem: FC<VoltItemProps> = ({ data, selected, onHover, onMouseLeave, onSelect, id, isHighlighted }) => (
  <div
    className={cn(
      "p-5 rounded-2xl border border-gray-100 space-y-2 cursor-pointer",
      selected && "shadow-5 !border-primary-main-400",
      isHighlighted && "shadow-5 border-primary-main-100",
      "hover:shadow-5 hover:border-primary-main-100"
    )}
    onMouseEnter={() => onHover && onHover(removeParcelNumberFormatting(data.parcelNumber))}
    onMouseLeave={() => onMouseLeave && onMouseLeave(removeParcelNumberFormatting(data.parcelNumber))}
    onClick={() => onSelect && onSelect(removeParcelNumberFormatting(data.parcelNumber))}
  >
    <div className="w-full flex justify-between items-center gap-6" id={id}>
      <div className="grid">
        <p className="text-lg font-semibold truncate">{data.owner || "N/A"}</p>
        <p className="text-xs text-grey-600 font-medium">
          {data.state}/{data.county}
        </p>
      </div>
      <div className="grid" style={{ maxWidth: 110 }}>
        <p className="text-sm text-grey-600 font-medium w-max">Parcel Number:</p>
        <p className="text-sm font-medium truncate">{data.parcelNumber}</p>
      </div>
    </div>
    <hr className="bg-gray-100" />
    {/* <div className="flex justify-between items-center gap-4">
      <p className="text-xs text-grey-600">
        Acreage:{" "}
        <span className="text-black font-medium">
          {data.acreage.toLocaleString("en-US", { maximumFractionDigits: 2, minimumFractionDigits: 2 })}
        </span>
      </p>
      {data.pricePerAcre && (
        <p className="text-xs text-grey-600">
          Per acre Price: <span className="text-black font-medium">{moneyFormatter.format(data.pricePerAcre)}</span>
        </p>
      )}
    </div> */}
    <div className="flex gap-2 justify-between">
      <div className="space-y-1">
        <p className="text-xs text-grey-600">
          Acreage:{" "}
          <span className="text-black font-medium">
            {data.acreage.toLocaleString("en-US", { maximumFractionDigits: 2, minimumFractionDigits: 2 })}
          </span>
        </p>
        {data.lastSalePrice && (
          <p className="text-xs text-grey-600">
            Sold Price: <span className="text-black font-medium">{moneyFormatter.format(data.lastSalePrice)}</span>
          </p>
        )}
      </div>
      <div className="space-y-1">
        {data.pricePerAcre && (
          <p className="text-xs text-grey-600">
            Per acre Price: <span className="text-black font-medium">{moneyFormatter.format(data.pricePerAcre)}</span>
          </p>
        )}
        {data.lastSaleDate && (
          <p className="text-xs text-grey-600">
            Last Sale Date: <span className="text-black font-medium">{data.lastSaleDate}</span>
          </p>
        )}
      </div>
    </div>
    {/* <div className="flex justify-between items-center gap-4">
      {data.lastSalePrice && (
        <p className="text-xs text-grey-600">
          Sold Price: <span className="text-black font-medium">{moneyFormatter.format(data.lastSalePrice)}</span>
        </p>
      )}
      {data.lastSaleDate && (
        <p className="text-xs text-grey-600">
          Last Sale Date: <span className="text-black font-medium">{data.lastSaleDate}</span>
        </p>
      )}
    </div> */}
  </div>
);

export default VoltItem;
