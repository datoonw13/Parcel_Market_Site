import { moneyFormatter } from "@/helpers/common";
import { cn } from "@/lib/utils";
import React, { FC } from "react";

interface VoltItemProps {
  data: {
    owner: string;
    parcelNumber: string;
    acreage: number;
    pricePerAcre: number | null;
  };
  selected?: boolean;
}

const VoltItem: FC<VoltItemProps> = ({ data, selected }) => (
  <div className={cn("p-5 rounded-2xl border border-gray-100 space-y-2 cursor-pointer", selected && "shadow-5 border-primary-main-400")}>
    <div className="flex justify-between items-center gap-4">
      <div>
        <p className="text-lg font-semibold">{data.owner}</p>
        <p className="text-xs text-grey-600 font-medium">Business owner</p>
      </div>
      <div>
        <p className="text-sm text-grey-600 font-medium">Parcel Number:</p>
        <p className="text-sm font-medium">{data.parcelNumber}</p>
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
