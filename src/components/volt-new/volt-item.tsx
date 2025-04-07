"use client";

import { moneyFormatter } from "@/helpers/common";
import { cn } from "@/lib/utils";
import { IPropertyBaseInfo, IPropertyOwner, IPropertyPricePerAcre, IPropertySaleHistory } from "@/types/property";
import moment from "moment";
import React, { FC, ReactElement, useEffect, useRef, useState } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";

type VoltItemData = IPropertyBaseInfo & Partial<IPropertySaleHistory> & Partial<IPropertyOwner> & Partial<IPropertyPricePerAcre>;

interface VoltItemProps {
  data: VoltItemData;
  selected?: boolean;
  onHover?: (property: VoltItemData) => void;
  onMouseLeave?: (property: VoltItemData) => void;
  onSelect?: (property: VoltItemData) => void;
  id: string;
  isHighlighted?: boolean;
  isSellingProperty: boolean;
  isAdditional?: boolean;
}

const VoltItem: FC<VoltItemProps> = ({
  data,
  selected,
  onHover,
  onMouseLeave,
  onSelect,
  id,
  isHighlighted,
  isSellingProperty,
  isAdditional,
}) => {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <div
      className={cn(
        "p-5 rounded-2xl border  cursor-pointer transition-all duration-100",
        isAdditional ? "border-[#fcedb6] bg-[#fef7dd99] hover:bg-[#fef7ddcc]" : "border-[#D5D3D3]",
        selected && !isAdditional && " !border-primary-main-400 !bg-primary-main-50",
        selected && isAdditional && " !bg-[#fef7dd]",
        isHighlighted && !isAdditional && "bg-grey-50 border-[#D5D3D3]",
        isHighlighted && isAdditional && "bg-[#f7edc6]",
        isAdditional ? "" : "hover:bg-grey-50 hover:border-[#D5D3D3]"
      )}
      onMouseEnter={() => onHover && onHover(data)}
      onMouseLeave={() => onMouseLeave && onMouseLeave(data)}
      onClick={() => onSelect && onSelect(data)}
      id={id}
    >
      <div className="text-start [&>svg]:hidden py-0">
        <div className="w-full space-y-2 ">
          <div className="w-full flex justify-between items-center gap-6">
            <div className="w-full space-y-0.5">
              <div className="grid grid-cols-[minmax(0,_max-content)_minmax(0,_max-content)] justify-between items-center w-full gap-6">
                {data.owner ? (
                  <p className="text-lg font-semibold truncate">{data.owner || "N/A"}</p>
                ) : (
                  <p className="text-xs text-grey-600 font-medium">State/County</p>
                )}
                <p className="text-sm text-grey-600 font-medium w-max">Parcel Number:</p>
              </div>
              <div className="grid grid-cols-[minmax(0,_max-content)_minmax(0,_max-content)] justify-between items-baseline w-full gap-6">
                <p className={data.owner ? "text-xs text-grey-600 font-medium" : "text-sm font-semibold"}>
                  {data.state.label}/{data?.county?.label?.replace("County", "")}
                </p>
                <p className="text-sm font-medium truncate">{data.parcelNumberNoFormatting}</p>
              </div>
            </div>
          </div>
          <hr className="bg-gray-100" />
          <div className="flex gap-2 justify-between">
            <div className="space-y-1">
              <p className="text-xs text-grey-600">
                Acreage: <span className="text-black font-medium">{data.acreage}</span>
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
                  {isSellingProperty ? "VOLT Value Per Acreage" : "Sold Price Per Acre"}:{" "}
                  <span className="text-black font-medium">{moneyFormatter.format(data.pricePerAcreage)}</span>
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
      </div>
    </div>
  );
};

export default VoltItem;
