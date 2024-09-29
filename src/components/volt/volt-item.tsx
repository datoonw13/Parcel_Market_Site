import { removeParcelNumberFormatting, moneyFormatter } from "@/helpers/common";
import { getAllStates } from "@/helpers/states";
import { cn } from "@/lib/utils";
import { IMap } from "@/types/map";
import { IPropertyBaseInfo, IPropertyOwner, IPropertyPricePerAcre, IPropertySaleHistory } from "@/types/property";
import moment from "moment";
import React, { FC } from "react";

type VoltItemData = IPropertyBaseInfo & Partial<IPropertySaleHistory> & Partial<IPropertyOwner> & Partial<IPropertyPricePerAcre>;

interface VoltItemProps {
  data: VoltItemData;
  selected?: boolean;
  onHover?: (property: VoltItemData) => void;
  onMouseLeave?: (property: VoltItemData) => void;
  onSelect?: (property: VoltItemData) => void;
  id: string;
  isHighlighted?: boolean;
}

const VoltItem: FC<VoltItemProps> = ({ data, selected, onHover, onMouseLeave, onSelect, id, isHighlighted }) => (
  <div
    className={cn(
      "p-5 rounded-2xl border border-[#D5D3D3] space-y-2 cursor-pointer transition-all duration-100",
      selected && " !border-primary-main-400 !bg-primary-main-50",
      isHighlighted && "bg-grey-50 border-[#D5D3D3]",
      "hover:bg-grey-50 hover:border-[#D5D3D3]"
    )}
    onMouseEnter={() => onHover && onHover(data)}
    onMouseLeave={() => onMouseLeave && onMouseLeave(data)}
    onClick={() => onSelect && onSelect(data)}
    id={id}
  >
    <div className="w-full flex justify-between items-center gap-6">
      {data.owner ? (
        <div className="grid">
          <p className="text-lg font-semibold truncate">{data.owner || "N/A"}</p>
          <p className="text-xs text-grey-600 font-medium">
            {data.state.label}/{data.county.label}
          </p>
        </div>
      ) : (
        <div className="grid">
          <p className="text-xs text-grey-600 font-medium">State/County</p>
          <p className="text-sm font-semibold">
            {" "}
            {data.state.label}/{data.county.label.replace("County", "")}
          </p>
        </div>
      )}
      <div className="grid" style={{ maxWidth: 110 }}>
        <p className="text-sm text-grey-600 font-medium w-max">Parcel Number:</p>
        <p className="text-sm font-medium truncate">{data.parcelNumberNoFormatting}</p>
      </div>
    </div>
    <hr className="bg-gray-100" />
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
        {data.pricePerAcreage && (
          <p className="text-xs text-grey-600">
            Per acre Price: <span className="text-black font-medium">{moneyFormatter.format(data.pricePerAcreage)}</span>
          </p>
        )}
        {data.lastSaleDate && (
          <p className="text-xs text-grey-600">
            Last Sale Date: <span className="text-black font-medium">{moment(data.lastSaleDate).format("MM/DD/YYYY")}</span>
          </p>
        )}
      </div>
    </div>
  </div>
);

export default VoltItem;
