"use client";

import { moneyFormatter } from "@/helpers/common";
import { cn } from "@/lib/utils";
import { IBulkPropertiesUsedForCalculation } from "@/types/property";
import moment from "moment";
import React, { FC } from "react";
import { FaCircleInfo } from "react-icons/fa6";
import useMediaQuery from "@/hooks/useMediaQuery";
import { IoMdClose } from "react-icons/io";
import { Tooltip } from "../ui/tooltip";
import { breakPoints } from "../../../tailwind.config";
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from "../ui/dialogs/drawer";

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
}) => {
  const { targetReached: isSmallDevice } = useMediaQuery(parseFloat(breakPoints.sm));
  return (
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
        <div className="flex justify-between items-center gap-6 pb-3 border-b border-[#D5D3D3]">
          <h1 className="font-semibold">
            Multiple Parcel Sale /{" "}
            <span className="font-medium text-xs text-grey-800">{moment(data.data.properties[0].lastSaleDate).format("MM/DD/YYYY")}</span>
          </h1>
          {!isSmallDevice && (
            <Tooltip
              contentClasses="bg-white text-black font-light"
              renderButton={<FaCircleInfo className="size-5 text-grey-200 cursor-pointer" />}
              renderContent={
                <div className="space-y-3">
                  <h1 className="font-semibold text-xs">What does &quot;Multiple Parcels&quot; Mean?</h1>
                  <p className="font-light text-xs text-start leading-0">
                    Now we have information about when more than one land was sold on the same day, all of these lands were within a ten
                    mile radius of each other and had identical prices, and all such lands were sold to the same person. When the lands meet
                    these criteria, we assume that these are lands sold in bulk.
                  </p>
                </div>
              }
            />
          )}
          {isSmallDevice && (
            <>
              <Drawer>
                <DrawerTrigger asChild>
                  <FaCircleInfo className="size-5 text-grey-200 cursor-pointer" />
                </DrawerTrigger>
                <DrawerContent>
                  <DrawerHeader>
                    <div className="flex justify-between items-start mb-3 gap-6">
                      <DrawerTitle className="text-start">What does &quot;Multiple Parcels&quot; Mean?</DrawerTitle>
                      <DrawerTrigger>
                        <IoMdClose className="size-5 text-grey-600 cursor-pointer flex ml-auto" />
                      </DrawerTrigger>
                    </div>
                    <DrawerDescription className="text-start">
                      Now we have information about when more than one land was sold on the same day, all of these lands were within a ten
                      mile radius of each other and had identical prices, and all such lands were sold to the same person. When the lands
                      meet these criteria, we assume that these are lands sold in bulk.
                    </DrawerDescription>
                  </DrawerHeader>
                </DrawerContent>
              </Drawer>
            </>
          )}
        </div>
        <ul className="grid grid-cols-2 gap-1">
          <li className="text-xs text-grey-600">
            State: <span className="text-black font-medium">{data.data.state.label}</span>
          </li>
          <li className="text-xs text-grey-600">
            Sold Price: <span className="text-black font-medium">{moneyFormatter.format(data.data.price)}</span>
          </li>
          <li className="text-xs text-grey-600">
            Acreage: <span className="text-black font-medium">{data.data.acreage.toFixed(2)}</span>
          </li>

          <li className="text-xs text-grey-600">
            Sold Price Per Acre: <span className="text-black font-medium">{moneyFormatter.format(data.data.pricePerAcreage)}</span>
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
};

export default VoltItemMulti;
