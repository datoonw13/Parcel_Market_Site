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
import { TooltipContent, TooltipProvider, TooltipTrigger } from "@radix-ui/react-tooltip";
import Image from "next/image";
import { motion } from "framer-motion";
import { Tooltip } from "@/components/ui/tooltip";
import { IoBookmarkOutline } from "react-icons/io5";
import { breakPoints } from "../../../../tailwind.config";

type IItem = z.infer<typeof PropertyDataSchema>["assessments"]["data"][0] & { isBulked: true };

interface VoltItemMultiProps {
  data: IItem;
  setPropertiesInteraction: Dispatch<SetStateAction<IPropertiesInteraction>>;
  propertiesInteraction: IPropertiesInteraction;
  isNonValidMedianHighlighted: boolean;
  sellingPropertyId: string;
}

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
      <div className="space-y-3 py-4">
        <div className="flex justify-between items-start gap-6 pb-3 border-b border-[#D5D3D3] px-4">
          <h1 className="font-semibold">
            Multiple Parcel Sale /{" "}
            <span className="font-medium text-xs text-grey-800">{moment(data.data.lastSaleDate).format("MM/DD/YYYY")}</span>
          </h1>
        </div>
        <div className="border-[#D5D3D3] border-b flex px-4 !m-0 py-2 gap-3">
          {data.data.hasSellingProperty ? (
            <div className="relative z-0 min-w-5 min-h-5 h-5">
              <Image alt="" src={`/map/pins/green-${data.data.group}.svg`} fill loading="eager" className="w-full h-full  object-cover" />
            </div>
          ) : (
            <div className={cn("relative min-w-[20px] min-h-[20px] h-[20px] w-[20px] z-0")}>
              <Image
                alt=""
                src={`/map/pins/${isNonValidMedianHighlighted && !data.data.isMedianValid ? "yellow" : "red"}-${data.data.group}.svg`}
                fill
                loading="eager"
                className="w-full h-full  object-cover"
              />
            </div>
          )}
          <p className="text-xs font-medium">
            Lands marked with{" "}
            <span className={cn(isNonValidMedianHighlighted && !data.data.isMedianValid ? "text-warning" : "text-error")}>
              ({data.data.group.toLocaleUpperCase()})
            </span>{" "}
            where sold together
          </p>
        </div>
        <ul className="grid grid-cols-2 gap-1 px-4">
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
        style={{ gridTemplateColumns: `repeat(${data.data.properties.length === 2 ? 2 : 8}, 1fr)` }}
        className={cn(
          `p-3 gap-1 grid rounded-b-2xl bg-grey-100 h-full py-3 `,
          data.data.properties.length > 2 && "[&>div]:col-[span_4/auto]",
          data.data.properties.length >= 3 && data.data.properties.length % 2 === 1 && "[&>*:nth-last-child(-n+1)]:col-[span_8/auto]"
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
