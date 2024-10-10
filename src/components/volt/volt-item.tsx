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
  map?: ReactElement;
}

const VoltItem: FC<VoltItemProps> = ({ map, data, selected, onHover, onMouseLeave, onSelect, id, isHighlighted }) => {
  const [open, setOpen] = useState("");

  const ref = useRef<HTMLDivElement>(null);

  const handleClickOutside = (event: any) => {
    if (ref.current && !ref.current.contains(event.target)) {
      setOpen("");
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, []);

  return (
    <Accordion
      ref={ref}
      type="single"
      collapsible
      value={open}
      onValueChange={(value) => {
        if (map) {
          setOpen(value);
        } else {
        }
      }}
    >
      <AccordionItem
        value={data.id.toString()}
        className={cn(
          "p-5 rounded-2xl border border-[#D5D3D3] cursor-pointer transition-all duration-100",
          selected && " !border-primary-main-400 !bg-primary-main-50",
          isHighlighted && "bg-grey-50 border-[#D5D3D3]",
          "hover:bg-grey-50 hover:border-[#D5D3D3]"
        )}
        onMouseEnter={() => onHover && onHover(data)}
        onMouseLeave={() => onMouseLeave && onMouseLeave(data)}
        onClick={() => onSelect && onSelect(data)}
        id={id}
      >
        <AccordionTrigger className="text-start [&>svg]:hidden py-0">
          <div className="w-full space-y-2 ">
            <div className="w-full flex justify-between items-center gap-6">
              {data.owner ? (
                <div className="grid">
                  <p className="text-lg font-semibold truncate">{data.owner || "N/A"}</p>
                  <p className="text-xs text-grey-600 font-medium">
                    {data.state.label}/{data?.county?.label?.replace("County", "")}
                  </p>
                </div>
              ) : (
                <div className="grid">
                  <p className="text-xs text-grey-600 font-medium">State/County</p>
                  <p className="text-sm font-semibold">
                    {" "}
                    {data.state.label}/{data?.county?.label?.replace("County", "")}
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
        </AccordionTrigger>
        {map && (
          <AccordionContent>
            <div
              style={{ aspectRatio: "3/1" }}
              className="bg-primary-main-100 w-full h-52 sm:h-56 md:h-60 rounded-lg [&>div]:rounded-lg mt-8"
            >
              {map}
            </div>
          </AccordionContent>
        )}
      </AccordionItem>
    </Accordion>
  );
};

export default VoltItem;
