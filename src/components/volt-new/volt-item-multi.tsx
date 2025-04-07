"use client";

import { moneyFormatter } from "@/helpers/common";
import { cn } from "@/lib/utils";
import { IBulkPropertiesUsedForCalculation } from "@/types/property";
import moment from "moment";
import React, { FC } from "react";
import { FaCircleInfo } from "react-icons/fa6";
import useMediaQuery from "@/hooks/useMediaQuery";
import { IoMdClose } from "react-icons/io";
import { PropertyDataSchema } from "@/zod-validations/volt-new";
import { z } from "zod";
import { Tooltip } from "../ui/tooltip";
import { breakPoints } from "../../../tailwind.config";
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from "../ui/dialogs/drawer";

type IItem = z.infer<typeof PropertyDataSchema>["assessments"]["data"][0] & { isBulked: true };

interface VoltItemMultiProps {
  data: IItem;
  onHover: (property: IItem) => void;
  onMouseLeave: (property: IItem) => void;
  onSelect: (property: IItem) => void;
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
        // selectedItemParcelNumber &&
        //   data.data.parcelNumberNoFormatting.includes(selectedItemParcelNumber) &&
        //   "!border-primary-main-400 !bg-primary-main-50",
        // highlightedItemParcelNumber &&
        //   data.data.parcelNumberNoFormatting.includes(highlightedItemParcelNumber) &&
        //   "bg-grey-50 border-[#D5D3D3]",
        "hover:bg-grey-50 hover:border-[#D5D3D3]"
      )}
      onMouseEnter={() => onHover(data)}
      onMouseLeave={() => onMouseLeave(data)}
      onClick={() => {
        onSelect(data);
      }}
      id={`calculation-${data.data.id}`}
    >
      <div className="space-y-3 px-5 py-4">
        <div className="flex justify-between items-center gap-6 pb-3 border-b border-[#D5D3D3]">
          <h1 className="font-semibold">
            Multiple Parcel Sale /{" "}
            <span className="font-medium text-xs text-grey-800">{moment(data.data.lastSaleDate).format("MM/DD/YYYY")}</span>
          </h1>
        </div>
        <ul className="grid grid-cols-2 gap-1">
          <li className="text-xs text-grey-600">
            State: <span className="text-black font-medium">{data.data.state.label}</span>
          </li>
          <li className="text-xs text-grey-600">
            Sold Price: <span className="text-black font-medium">{data.data.lastSalePrice.formattedString}</span>
          </li>
          <li className="text-xs text-grey-600">
            Acreage: <span className="text-black font-medium">{data.data.acreage.formattedString}</span>
          </li>

          <li className="text-xs text-grey-600">
            Sold Price Per Acre: <span className="text-black font-medium">{data.data.pricePerAcreage.formattedString}</span>
          </li>
        </ul>
      </div>
      <div
        style={{ gridTemplateColumns: `repeat(${data.data.properties.length === 2 ? 2 : 12}, 1fr)` }}
        className={cn(
          `p-3 gap-1 grid  rounded-b-2xl bg-grey-100 h-full py-3  `,
          data.data.properties.length > 2 && "[&>div]:col-[span_4/auto]",
          data.data.properties.length > 3 && data.data.properties.length % 3 === 1 && "[&>*:nth-last-child(-n+1)]:col-[span_12/auto]",
          data.data.properties.length > 3 && data.data.properties.length % 3 === 2 && "[&>*:nth-last-child(-n+2)]:col-[span_6/auto]"
        )}
      >
        {data.data.properties.map((item, itemI) => (
          <div
            // style={{ gridColumn: "span 4/auto" }}
            key={item.id + itemI.toString()}
            className={cn("p-2 rounded-lg bg-white space-y-2 border border-transparent")}
          >
            <p className="text-xs text-grey-600">
              Acreage: <span className="text-black font-medium">{item.acreage.formattedString}</span>
            </p>
            <p className="text-xs text-grey-600">
              Parcel Number: <span className="text-black font-medium">#{item.parcelNumber.formattedString}</span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VoltItemMulti;
