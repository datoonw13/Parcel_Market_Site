"use client";

import { cn, isLowercase } from "@/lib/utils";
import { IoInformationCircleOutline } from "react-icons/io5";
import { FaLocationDot } from "react-icons/fa6";
import { Dispatch, FC, SetStateAction } from "react";
import { PropertyDataSchema } from "@/zod-validations/volt-new";
import { z } from "zod";
import Image from "next/image";
import { IPropertiesInteraction } from "@/types/volt";
import { moneyFormatter } from "@/helpers/common";
import { Tooltip } from "../../ui/tooltip";
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover";
import { AvgPpaDescription, VoltPpaDescription } from "../tooltip-contents";

interface VoltDetailsMobileProgressLineProps {
  data: z.infer<typeof PropertyDataSchema>;
  setPropertiesInteraction: Dispatch<SetStateAction<IPropertiesInteraction>>;
  propertiesInteraction: IPropertiesInteraction;
  isNonValidMedianHighlighted: boolean;
  isSubscribed: boolean;
}

const hasSellingProperty = (sellingPropertyId: string, data: z.infer<typeof PropertyDataSchema>["assessments"]["data"][0]) => {
  if (data.isBulked) {
    return !!data.data.properties.find((el) => el.id === sellingPropertyId);
  }
  return data.data.id === sellingPropertyId;
};

const getPin = (
  hasSellingProperty: boolean,
  isMedianValid: boolean,
  isActive: boolean,
  isNonValidMedianHighlighted: boolean,
  group?: string
) => {
  if (isNonValidMedianHighlighted && !isMedianValid) {
    if (isActive) {
      return group ? `yellow-highlighted-${group}` : "yellow-highlighted-default";
    }
    return group ? `yellow-${group}` : "yellow-default";
  }
  if (hasSellingProperty) {
    if (isActive) {
      return group ? `green-highlighted-${group}` : "green-highlighted-default";
    }
    return group ? `green-${group}` : "green-default";
  }

  if (isActive) {
    return group ? `red-highlighted-${group}` : "red-highlighted-default";
  }
  return group ? `red-${group}` : "red-default";
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

const VoltDetailsMobileProgressLine: FC<VoltDetailsMobileProgressLineProps> = ({
  data,
  propertiesInteraction,
  setPropertiesInteraction,
  isNonValidMedianHighlighted,
  isSubscribed,
}) => {
  const assessments =
    isNonValidMedianHighlighted || data.assessments.data.length < 3
      ? data.assessments.data.filter((el) => el.data.isMedianValid)
      : data.assessments.data;

  return (
    <div id="volt-progress-line" className="border border-primary-main-400 bg-[#FAFFFB] p-3 space-y-8 relative z-10 rounded-2xl">
      <div className="grid grid-cols-2 items-center justify-between gap-2.5 border-b border-b-[#C3EBD3] pb-3">
        <div className="grid grid-cols-[minmax(0,_max-content)_minmax(0,_max-content)_minmax(0,_max-content)] items-center gap-1">
          <div className={cn(`bg-white min-w-3.5 w-3.5 min-h-3.5 h-3.5 rounded-full flex items-center justify-center relative`)}>
            <div className="min-w-3 w-3 min-h-3 h-3 border-2 rounded-full border-primary-main" />
            <div className="min-w-1 w-1 min-h-1 h-1 bg-primary-main rounded-full absolute" />
          </div>
          <div className="grid grid-cols-[minmax(0,_max-content)_minmax(0,_max-content)] items-center gap-1">
            <p className="font-semibold text-xs text-grey-600 table-fixed table w-fit">
              <span className={cn(!isSubscribed && !(data.assessments.data.length <= 1) && "blur-[2px]", "text-[11px]")}>
                {data.assessments.data.length <= 1 ? "$ NaN" : data.assessments.calculations.avgPriceOfAssessments.all.formattedString}
              </span>{" "}
              <span className="text-grey-600 text-[11px]">- APPA</span>
            </p>
            <Tooltip
              contentClasses="bg-transparent p-0 border-0 w-max max-w-xs"
              renderButton={<IoInformationCircleOutline className="size-3.5 text-grey-600" />}
              renderContent={
                <div
                  className="p-0.5"
                  style={{
                    background: "linear-gradient(98.26deg, #FA98A3 12.83%, #FF001F 138.73%)",
                    borderRadius: 12,
                    boxShadow: "0px 4px 12px 0px #0000001F",
                  }}
                >
                  <div style={{ borderRadius: 10 }} className="bg-white">
                    <AvgPpaDescription />
                  </div>
                </div>
              }
            />
          </div>
        </div>
        <div className="grid grid-cols-[minmax(0,_max-content)_minmax(0,_max-content)_minmax(0,_max-content)] items-center gap-1 justify-end">
          <div className={cn(`bg-white min-w-3.5 w-3.5 min-h-3.5 h-3.5 rounded-full flex items-center justify-center relative`)}>
            <div className="min-w-3 w-3 min-h-3 h-3 border-2 rounded-full border-warning" />
            <div className="min-w-1 w-1 min-h-1 h-1 bg-warning rounded-full absolute" />
          </div>
          <div className="grid grid-cols-[minmax(0,_max-content)_minmax(0,_max-content)_minmax(0,_max-content)] items-center gap-1">
            <p className="font-semibold text-xs text-grey-600 table-fixed table w-fit">
              <span className={cn(!isSubscribed && !(data.assessments.data.length < 3) && "blur-[2px]", "text-[11px]")}>
                {data.assessments.data.length < 3 ? "$ NaN " : data.voltPricePerAcreage.formattedString}
              </span>{" "}
              <span className="text-grey-600 text-[11px]">- VPPA</span>
            </p>
            <Tooltip
              contentClasses="bg-transparent p-0 border-0 w-max max-w-xs"
              renderButton={<IoInformationCircleOutline className="size-3.5 text-grey-600" />}
              renderContent={
                <div
                  className="p-0.5"
                  style={{
                    background: "linear-gradient(98.26deg, #FA98A3 12.83%, #FF001F 138.73%)",
                    borderRadius: 12,
                    boxShadow: "0px 4px 12px 0px #0000001F",
                  }}
                >
                  <div style={{ borderRadius: 10 }} className="bg-white max-h-96 overflow-auto">
                    <VoltPpaDescription />
                  </div>
                </div>
              }
            />
          </div>
        </div>
      </div>

      <div className="relative">
        <div className="relative">
          <hr className="w-full h-1.5 rounded-lg" style={{ background: "linear-gradient(90deg, #16DB65 8%, #05471C 95.44%)" }} />
          {!isNonValidMedianHighlighted && (
            <div
              style={{
                left: `calc(${
                  data.assessments.calculations.avgPriceOfAssessments[`${isNonValidMedianHighlighted ? "valid" : "all"}`].axis
                }%)`,
              }}
              className="absolute top-[50%] -translate-y-[50%]"
            >
              {data.assessments.data.length > 1 && (
                <div className={cn(`bg-white size-6  rounded-full flex items-center justify-center relative`)}>
                  <div className="size-5 border-2 rounded-full border-primary-main" />
                  <div className="size-3 bg-primary-main rounded-full absolute" />
                </div>
              )}
            </div>
          )}
          <div
            style={{ left: `calc(${data.voltPricePerAcreage.axis[`${isNonValidMedianHighlighted ? "valid" : "all"}`]}%)` }}
            className="absolute top-[50%] -translate-y-[50%]"
          >
            {data.assessments.data.length > 2 && (
              <div className={cn(`bg-white size-6  rounded-full flex items-center justify-center relative`)}>
                <div className="size-5 border-2 rounded-full border-warning" />
                <div className="size-3 bg-warning rounded-full absolute" />
              </div>
            )}
          </div>
          {assessments.map((property) => {
            const { hovered, isActive, popup } = getState(property.data.id, propertiesInteraction);
            return (
              <Popover key={property.data.id} open={false}>
                <PopoverTrigger className={cn("")} asChild>
                  <div
                    style={{
                      left: `calc(${property.data.pricePerAcreage.axis[`${isNonValidMedianHighlighted ? "valid" : "all"}`]}% - 0px)`,
                    }}
                    className="absolute top-0 -translate-y-full -translate-x-1/2"
                  >
                    <div
                      onMouseEnter={() => {
                        if (!popup) {
                          setPropertiesInteraction((prev) => ({
                            ...prev,
                            hover: {
                              clickId: property.data.id,
                              isBulked: property.isBulked,
                              openId: property.isBulked ? property.data.id : property.data.id,
                            },
                          }));
                        }
                      }}
                      onMouseLeave={() => {
                        setPropertiesInteraction((prev) => ({ ...prev, hover: null }));
                      }}
                      onDoubleClick={() => {
                        if (!property.isBulked) {
                          window.map.setZoom(14);
                          window.map.setCenter([property.data.longitude, property.data.latitude]);
                        } else {
                          window.map.setZoom(12);
                          window.map.setCenter([property.data.properties[0].longitude, property.data.properties[0].latitude]);
                        }
                      }}
                      onClick={() => {
                        setPropertiesInteraction((prev) => ({
                          ...prev,
                          popup: {
                            clickId: property.data.id,
                            isBulked: property.isBulked,
                            openId: property.isBulked ? property.data.id : property.data.id,
                          },
                        }));
                        if (!property.isBulked) {
                          window.map.setZoom(10);
                          window.map.setCenter([property.data.longitude, property.data.latitude]);
                        } else {
                          window.map.setZoom(10);
                          window.map.setCenter([property.data.properties[0].longitude, property.data.properties[0].latitude]);
                        }
                      }}
                      key={property.data.id}
                      className={cn(
                        `cursor-pointer transition-all duration-100 relative `,
                        isActive
                          ? `${
                              property.data.group && isLowercase(property.data.group)
                                ? "min-w-[31.5px] min-h-[31.5px] h-[31.5px]"
                                : "min-w-[30px] min-h-[30px] h-[30px]"
                            }`
                          : `${
                              property.data.group && isLowercase(property.data.group)
                                ? "min-w-[21.5px] min-h-[21.5px] h-[21.5px]"
                                : "min-w-[20px] min-h-[20px] h-[20px]"
                            }`
                      )}
                    >
                      <Image
                        alt=""
                        src={`/map/pins/${getPin(
                          hasSellingProperty(data.id, property),
                          property.data.isMedianValid,
                          isActive,
                          isNonValidMedianHighlighted,
                          property.isBulked ? property.data.group : undefined
                        )}.svg`}
                        fill
                        loading="eager"
                        className="w-full h-full  object-cover"
                      />
                    </div>
                  </div>
                </PopoverTrigger>
                <PopoverContent side="top" sideOffset={15} className="!outline-none">
                  {/* <PopoverArrow  /> */}
                  <div
                    className="p-0.5"
                    style={{
                      background: "linear-gradient(98.39deg, #17DC66 -6.77%, #06481D 112.7%)",
                      borderRadius: 12,
                      boxShadow: "0px 4px 12px 0px #0000001F",
                    }}
                  >
                    <div style={{ borderRadius: 10 }} className="bg-[#F1FEF4] p-3">
                      <p className="text-xs text-grey-600">
                        Price Per Acre:{" "}
                        <span className={cn("text-black font-medium", !isSubscribed && "blur-[2px]")}>
                          {property.data.pricePerAcreage.formattedString}
                        </span>
                      </p>
                      <p className="text-xs text-grey-600">
                        Acreage: <span className="text-black font-medium">{property.data.acreage.formattedString}</span>
                      </p>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            );
          })}
        </div>
        <div className="flex items-center justify-between mt-2">
          <p className="font-semibold text-xs">
            <span className={cn(!isSubscribed && !(data.assessments.data.length <= 1) && "blur-[2px]")}>
              {data.assessments.data.length <= 1
                ? "$ NaN"
                : data.assessments.calculations[
                    `${isNonValidMedianHighlighted ? "minPriceOfValidAssessments" : "minPriceOfAllAssessments"}`
                  ].formattedString}
            </span>{" "}
            <span className="text-grey-600 font-semibold text-xs">- LPPA</span>
          </p>
          <p className="font-semibold text-xs">
            <span className="text-grey-600 font-semibold text-xs">HPPA - </span>{" "}
            <span className={cn(!isSubscribed && !(data.assessments.data.length <= 1) && "blur-[2px]")}>
              {data.assessments.data.length <= 1
                ? "$ NaN"
                : data.assessments.calculations[
                    `${isNonValidMedianHighlighted ? "maxPriceOfValidAssessments" : "maxPriceOfAllAssessments"}`
                  ].formattedString}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default VoltDetailsMobileProgressLine;
