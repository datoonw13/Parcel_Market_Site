import { removeParcelNumberFormatting, moneyFormatter } from "@/helpers/common";
import { cn } from "@/lib/utils";
import { IMap } from "@/types/map";
import React, { FC } from "react";

interface VoltItemProps {
  data: {
    owner: string;
    parcelNumber: string;
    acreage: number;
    pricePerAcre: number | null;
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
        <p className="text-xs text-grey-600 font-medium">Business owner</p>
      </div>
      <div className="grid" style={{ maxWidth: 110 }}>
        <p className="text-sm text-grey-600 font-medium w-max">Parcel Number:</p>
        <p className="text-sm font-medium truncate">{data.parcelNumber}</p>
      </div>
    </div>
    <hr className="bg-gray-100" />
    <div className="flex justify-between items-center gap-4">
      <p className="text-xs text-grey-600">
        Acreage:{" "}
        <span className="text-black font-medium">
          {data.acreage.toLocaleString("en-US", { maximumFractionDigits: 2, minimumFractionDigits: 2 })}
        </span>
      </p>
      <p className="text-xs text-grey-600">
        Per acre Price:{" "}
        <span className="text-black font-medium">{data.pricePerAcre ? moneyFormatter.format(data.pricePerAcre) : "N/A"}</span>
      </p>
    </div>
  </div>
);

export default VoltItem;
