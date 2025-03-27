"use client";

import { cn } from "@/lib/utils";
import moment from "moment";
import React, { Dispatch, FC, SetStateAction } from "react";
import { PropertyDataSchema } from "@/zod-validations/volt-new";
import { z } from "zod";
import { IPropertiesInteraction } from "@/types/volt";
import { FaLocationDot } from "react-icons/fa6";
import Image from "next/image";
import { motion } from "framer-motion";
import { Tooltip } from "@/components/ui/tooltip";

type IItem = z.infer<typeof PropertyDataSchema>["assessments"]["data"][0] & { isBulked: false };

interface VoltItemProps {
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
  isSellingProperty: boolean;
  isNonValidMedianHighlighted: boolean;
}) => {
  const { isSellingProperty, hovered, isMedianValid, isNonValidMedianHighlighted, selected } = data;
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

  // if (isSellingProperty) {
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

const VoltItem: FC<VoltItemProps> = ({
  data,
  isNonValidMedianHighlighted,
  propertiesInteraction,
  setPropertiesInteraction,
  sellingPropertyId,
}) => {
  const { hovered, popup } = getState(data.data.id, propertiesInteraction);

  return (
    <div
      className={cn(
        "p-2 rounded-2xl",
        generateClasses({
          isSellingProperty: data.data.isSellingProperty,
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
      id={data.data.id}
    >
      <div className="text-start [&>svg]:hidden py-0">
        <div className="w-full space-y-2 ">
          <div className="w-full flex justify-between items-start gap-6">
            <div className="w-full space-y-0.5">
              <div className="grid grid-cols-[minmax(0,_max-content)_minmax(0,_max-content)] justify-between items-center w-full gap-6">
                <p className="text-xs text-grey-600 font-medium">State/County</p>
                <p className="text-sm text-grey-600 font-medium w-max">Parcel Number:</p>
              </div>
              <div className="grid grid-cols-[minmax(0,_max-content)_minmax(0,_max-content)] justify-between items-baseline w-full gap-6">
                <p className="text-sm font-semibold">
                  {data.data?.state.label}/{data.data?.county?.label?.replace("County", "")}
                </p>
                <p className="text-sm font-medium truncate">{data.data.parcelNumber.formattedString}</p>
              </div>
            </div>
            {data.data.isSellingProperty && (
              <Tooltip
                renderButton={
                  <div className="relative z-0 min-w-5 min-h-5 h-5">
                    <Image alt="" src="/map/pins/green-default.svg" fill loading="eager" className="w-full h-full  object-cover" />
                  </div>
                }
                renderContent={
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.1 }}
                    onAnimationStart={() => {
                      const el = document.querySelector<HTMLElement>("[data-radix-popper-content-wrapper]");
                      if (el) {
                        el.style.setProperty("--radix-popper-zIndex", "20");
                      }
                    }}
                  >
                    <div
                      className="p-0.5"
                      style={{
                        background: "linear-gradient(99.77deg, #17DC66 -8.11%, #06481D 182.53%)",
                        borderRadius: 12,
                        boxShadow: "0px 4px 12px 0px #0000001F",
                      }}
                    >
                      <div style={{ borderRadius: 10 }} className="bg-white p-3">
                        <p className="font-medium text-xs max-w-44">Subject Land</p>
                      </div>
                    </div>
                  </motion.div>
                }
                buttonClassName="sticky top-0"
                contentClasses="bg-transparent border-0 p-0 text-black text-start"
              />
            )}
          </div>
          <hr className="bg-gray-100" />
          <div className="flex gap-2 justify-between">
            <div className="space-y-1">
              <p className="text-xs text-grey-600">
                Acreage: <span className="text-black font-medium">{data.data.acreage.formattedString}</span>
              </p>
              {data.data.lastSalePrice && (
                <p className="text-xs text-grey-600">
                  Sold Price: <span className="text-black font-medium">{data.data.lastSalePrice.formattedString}</span>
                </p>
              )}
            </div>
            <div className="space-y-1">
              {data.data.pricePerAcreage && (
                <p className="text-xs text-grey-600">
                  Sold Price Per Acre <span className="text-black font-medium">{data.data.pricePerAcreage.formattedString}</span>
                </p>
              )}
              {data.data.lastSaleDate && (
                <p className="text-xs text-grey-600">
                  Last Sale Date: <span className="text-black font-medium">{moment(data.data.lastSaleDate).format("MM/DD/YYYY")}</span>
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
