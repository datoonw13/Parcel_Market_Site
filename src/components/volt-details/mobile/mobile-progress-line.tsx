"use client";

import { cn } from "@/lib/utils";
import { IoInformationCircleOutline } from "react-icons/io5";
import { FaLocationDot } from "react-icons/fa6";
import { Dispatch, FC, SetStateAction } from "react";
import { PropertyDataSchema } from "@/zod-validations/volt-new";
import { z } from "zod";
import Image from "next/image";
import { IPropertiesInteraction } from "@/types/volt";
import { Tooltip } from "../../ui/tooltip";
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover";

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
  const assessments = isNonValidMedianHighlighted ? data.assessments.data.filter((el) => el.data.isMedianValid) : data.assessments.data;

  return (
    <div id="volt-progress-line" className="border border-primary-main-400 bg-[#FAFFFB] py-3 px-4  space-y-8 relative z-10 rounded-2xl">
      <div className="grid grid-cols-2 items-center justify-between gap-4 border-b border-b-[#C3EBD3] pb-3">
        <div className="flex items-center gap-2">
          <div className={cn(`bg-white size-6 rounded-full flex items-center justify-center relative`)}>
            <div className="size-4 border-2 rounded-full border-primary-main" />
            <div className="size-2 bg-primary-main rounded-full absolute" />
          </div>
          <div className="flex items-center gap-2">
            <p className="font-semibold text-xs text-grey-600 table-fixed table w-full">
              <span
                style={{
                  display: "table-cell",
                  whiteSpace: "nowrap",
                  textOverflow: "ellipsis",
                  overflow: "hidden",
                }}
                className={cn(!isSubscribed && "blur-[2px]")}
              >
                {data.assessments.calculations.avgPriceOfAllAssessments.formattedString}
              </span>{" "}
              <span className="text-grey-600 text-xs">- APPA</span>
            </p>
            <Tooltip renderButton={<IoInformationCircleOutline className="size-5 text-grey-600" />} renderContent="Some text." />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className={cn(`bg-white size-6  rounded-full flex items-center justify-center relative`)}>
            <div className="size-4 border-2 rounded-full border-warning" />
            <div className="size-2 bg-warning rounded-full absolute" />
          </div>
          <div className="flex items-center gap-2">
            <p className="font-semibold text-xs text-grey-600 table-fixed table w-full">
              <span
                style={{
                  display: "table-cell",
                  whiteSpace: "nowrap",
                  textOverflow: "ellipsis",
                  overflow: "hidden",
                }}
                className={cn(!isSubscribed && "blur-[2px]")}
              >
                {data.pricePerAcreage.formattedString}
              </span>{" "}
              <span
                style={{
                  display: "table-cell",
                  whiteSpace: "nowrap",
                  textOverflow: "ellipsis",
                  overflow: "hidden",
                }}
                className="text-grey-600 text-xs"
              >
                - VOLT PPA
              </span>
            </p>
            <Tooltip renderButton={<IoInformationCircleOutline className="size-5 text-grey-600" />} renderContent="Some text." />
          </div>
        </div>
      </div>

      <div className="relative">
        <div className="relative">
          <hr className="w-full h-1.5 rounded-lg" style={{ background: "linear-gradient(90deg, #16DB65 8%, #05471C 95.44%)" }} />
          <div
            style={{
              left: `calc(${
                data.assessments.calculations.avgPriceOfAllAssessments.axis[`${isNonValidMedianHighlighted ? "valid" : "all"}`]
              }%)`,
            }}
            className="absolute top-[50%] -translate-y-[50%]"
          >
            <div className={cn(`bg-white size-6  rounded-full flex items-center justify-center relative`)}>
              <div className="size-5 border-2 rounded-full border-primary-main" />
              <div className="size-3 bg-primary-main rounded-full absolute" />
            </div>
          </div>
          <div
            style={{ left: `calc(${data.pricePerAcreage.axis[`${isNonValidMedianHighlighted ? "valid" : "all"}`]}%)` }}
            className="absolute top-[50%] -translate-y-[50%]"
          >
            <div className={cn(`bg-white size-6  rounded-full flex items-center justify-center relative`)}>
              <div className="size-5 border-2 rounded-full border-warning" />
              <div className="size-3 bg-warning rounded-full absolute" />
            </div>
          </div>
          {assessments.map((property) => {
            const { hovered, isActive, popup } = getState(property.data.id, propertiesInteraction);
            return (
              <Popover key={property.data.id} open={propertiesInteraction.hover?.openId === property.data.id}>
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
                        isActive ? "min-w-7 min-h-7 h-7" : "min-w-5 min-h-5 h-5"
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
            <span className={cn(!isSubscribed && "blur-[2px]")}>
              {
                data.assessments.calculations[`${isNonValidMedianHighlighted ? "minPriceOfValidAssessments" : "minPriceOfAllAssessments"}`]
                  .formattedString
              }
            </span>{" "}
            <span className="text-grey-600 font-semibold text-xs">- LPPA</span>
          </p>
          <p className="font-semibold text-xs">
            <span className="text-grey-600 font-semibold text-xs">HPPA - </span>{" "}
            <span className={cn(!isSubscribed && "blur-[2px]")}>
              {
                data.assessments.calculations[`${isNonValidMedianHighlighted ? "maxPriceOfValidAssessments" : "maxPriceOfAllAssessments"}`]
                  .formattedString
              }
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default VoltDetailsMobileProgressLine;
