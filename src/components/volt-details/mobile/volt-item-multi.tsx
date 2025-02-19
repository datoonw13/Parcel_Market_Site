"use client";

import { moneyFormatter } from "@/helpers/common";
import { cn } from "@/lib/utils";
import moment from "moment";
import React, { Dispatch, FC, SetStateAction } from "react";
import { FaCircleInfo, FaLocationDot } from "react-icons/fa6";
import useMediaQuery from "@/hooks/useMediaQuery";
import { IoMdClose } from "react-icons/io";
import { z } from "zod";
import { PropertyDataSchema } from "@/zod-validations/volt-new";
import { IPropertiesInteraction } from "@/types/volt";
import { Tooltip } from "../../ui/tooltip";
import { breakPoints } from "../../../../tailwind.config";
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from "../../ui/dialogs/drawer";

type IItem = z.infer<typeof PropertyDataSchema>["assessments"]["data"][0] & { isBulked: true };

interface VoltItemMultiProps {
  data: IItem;
  setPropertiesInteraction: Dispatch<SetStateAction<IPropertiesInteraction>>;
  propertiesInteraction: IPropertiesInteraction;
  isNonValidMedianHighlighted: boolean;
  sellingPropertyId: string;
}

// const hasSellingProperty = (sellingPropertyId: string, data: z.infer<typeof PropertyDataSchema>["assessments"]["data"][0]) => {
//   if (data.isBulked) {
//     return !!data.data.properties.find((el) => el.id === sellingPropertyId);
//   }
//   return data.data.id === sellingPropertyId;
// };

const generateClasses = (data: {
  selected: boolean;
  hovered: boolean;
  isMedianValid: boolean;
  hasSellingProperty: boolean;
  isNonValidMedianHighlighted: boolean;
}) => {
  const { hasSellingProperty, hovered, isMedianValid, isNonValidMedianHighlighted, selected } = data;
  let classNames = "border";

  if (isMedianValid || (!isMedianValid && !isNonValidMedianHighlighted)) {
    if (hovered) {
      classNames = `${classNames} bg-grey-30/60`;
    }
    if (selected) {
      classNames = `${classNames} bg-grey-50`;
    }
  }

  if (!isMedianValid && isNonValidMedianHighlighted) {
    classNames = `${classNames} bg-[#FEFAEB]`;
    if (hovered) {
      classNames = `${classNames} bg-[#fdf5d8]`;
    }
    if (selected) {
      classNames = `${classNames} bg-[#fdf5d8]`;
    }
  }

  // if (hasSellingProperty) {
  //   classNames = `${classNames} outline outline-primary-main outline-1`;
  // }
  return cn(classNames);
};

const getState = (id: string, propertiesInteraction: IPropertiesInteraction) => {
  const hovered = propertiesInteraction.hover?.openId === id;
  const popup = propertiesInteraction.popup?.openId === id;

  return {
    hovered,
    popup,
    isActive: hovered || popup,
  };
};

const VoltItemMulti: FC<VoltItemMultiProps> = ({
  data,
  isNonValidMedianHighlighted,
  propertiesInteraction,
  sellingPropertyId,
  setPropertiesInteraction,
}) => {
  const { targetReached: isSmallDevice } = useMediaQuery(parseFloat(breakPoints.sm));
  const { hovered, popup } = getState(data.data.id, propertiesInteraction);

  return (
    <div
      className={cn(
        "rounded-2xl",
        generateClasses({
          hasSellingProperty: data.data.hasSellingProperty,
          hovered,
          selected: popup,
          isMedianValid: data.data.isMedianValid,
          isNonValidMedianHighlighted,
        })
      )}
      onClick={() => {
        setPropertiesInteraction((prev) => ({
          ...prev,
          popup:
            prev.popup?.openId !== data.data.id
              ? {
                  clickId: data.data.id,
                  isBulked: false,
                  openId: data.data.id,
                }
              : null,
        }));
      }}
      onMouseEnter={() => {
        if (!popup) {
          setPropertiesInteraction((prev) => ({
            ...prev,
            hover: {
              clickId: data.data.id,
              isBulked: false,
              openId: data.data.id,
            },
          }));
        }
      }}
      onMouseLeave={() => {
        setPropertiesInteraction((prev) => ({ ...prev, hover: null }));
      }}
      id={`calculation-${data.data.id}`}
    >
      <div className="space-y-3 px-5 py-4">
        <div className="flex justify-between items-start gap-6 pb-3 border-b border-[#D5D3D3]">
          <h1 className="font-semibold">
            Multiple Parcel Sale /{" "}
            <span className="font-medium text-xs text-grey-800">{moment(data.data.lastSaleDate).format("MM/DD/YYYY")}</span>
          </h1>
          {data.data.hasSellingProperty && <FaLocationDot className="text-primary-dark size-4 relative z-0 mt-1" />}
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
          <div key={item.id + itemI.toString()} className={cn("p-2 rounded-lg bg-white space-y-2 border border-transparent")}>
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
