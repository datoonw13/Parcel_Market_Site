"use client";

import { moneyFormatter } from "@/helpers/common";
import { cn, hideNumber } from "@/lib/utils";
import { PropertyDataSchema } from "@/zod-validations/volt-new";
import { orderBy } from "lodash";
import moment from "moment";
import Image from "next/image";
import { Dispatch, FC, Fragment, SetStateAction, useMemo, useRef, useState } from "react";
import { FaLocationDot } from "react-icons/fa6";
import { LuArrowUpDown } from "react-icons/lu";
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";
import { RiArrowUpDownFill } from "react-icons/ri";
import { z } from "zod";
import { TooltipContent, TooltipProvider, TooltipTrigger, Tooltip } from "@radix-ui/react-tooltip";
import { IPropertiesInteraction } from "@/types/volt";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import NoDataIcon from "../@new/icons/no-data";

const HEADERS = {
  acreage: {
    label: "Acreage",
    sort: false,
  },
  parcelNumber: {
    label: "Parcel ID",
    sort: false,
  },
  stateCounty: {
    label: "State/County",
    sort: false,
  },
  propertyType: {
    label: "Property Type",
    sort: false,
  },
  soldPrice: {
    label: "Last Sale Price",
    sort: false,
  },
  pricePerAcreage: {
    label: "Price Per Acre",
    sort: true,
  },
  lastSaleDate: {
    label: "Last Sale Date",
    sort: true,
  },
  opt: {
    label: "",
    sort: false,
  },
};

const hasSellingProperty = (sellingPropertyId: string, data: z.infer<typeof PropertyDataSchema>["assessments"]["data"][0]) => {
  if (data.isBulked) {
    return !!data.data.properties.find((el) => el.id === sellingPropertyId);
  }
  return data.data.id === sellingPropertyId;
};

const generateClasses = (data: {
  selected: boolean;
  hovered: boolean;
  isMedianValid: boolean;
  hasSellingProperty: boolean;
  isNonValidMedianHighlighted: boolean;
}) => {
  const { hasSellingProperty, hovered, isMedianValid, isNonValidMedianHighlighted, selected } = data;
  let classNames = "border-y";

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

  if (hasSellingProperty) {
    classNames = `${classNames} outline outline-primary-main outline-1`;
  }
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

interface VoltDetailsCalculationTableProps {
  data: z.infer<typeof PropertyDataSchema>;
  setPropertiesInteraction: Dispatch<SetStateAction<IPropertiesInteraction>>;
  propertiesInteraction: IPropertiesInteraction;
  isNonValidMedianHighlighted: boolean;
  isSubscribed: boolean;
}

const VoltDetailsCalculationTable: FC<VoltDetailsCalculationTableProps> = ({
  data,
  propertiesInteraction,
  setPropertiesInteraction,
  isNonValidMedianHighlighted,
  isSubscribed,
}) => {
  const timerRef = useRef<ReturnType<typeof setTimeout>>(null);

  const [sort, setSort] = useState<Partial<{ [key in keyof typeof HEADERS]: "asc" | "desc" }>>({ pricePerAcreage: "asc" });
  const sortKey = Object.keys(sort)[0] as keyof typeof HEADERS;
  const sortValue = Object.values(sort)[0];
  const assessments = useMemo(() => {
    if (sortKey === "lastSaleDate") {
      return [...data.assessments.data].sort((d1, d2) => {
        const date1 = d1.isBulked ? d1.data.lastSaleDate : d1.data.lastSaleDate;
        const date2 = d2.isBulked ? d2.data.lastSaleDate : d2.data.lastSaleDate;
        return sortValue === "asc"
          ? new Date(date1).getTime() - new Date(date2).getTime()
          : new Date(date2).getTime() - new Date(date1).getTime();
      });
    }
    return orderBy(data.assessments.data, [`data.${sortKey === "pricePerAcreage" ? "pricePerAcreage.value" : sortKey}`], [sortValue]);
  }, [data.assessments, sortKey, sortValue]);

  return (
    <div className="w-full mb-0.5">
      <table
        className={cn(
          `w-full 
          [&>thead>tr>th]:p-3 
          [&>thead>tr>th:first-child]:pl-6 
          [&>thead>tr>th:last-child]:pr-6
          [&>tbody>tr>td]:p-4 
          [&>tbody>tr>td:first-child]:pl-6
          [&>tbody>tr>td:last-child]:pr-6
          `
        )}
      >
        <thead>
          <tr className="">
            {Object.keys(HEADERS).map((key) => (
              <th
                style={{
                  boxShadow: "inset 0 1px 0 #E9E9E9, inset 0 0px 0 #000000",
                }}
                align="left"
                className="bg-grey-30 text-sm font-semibold sticky top-0 shadow-5 z-10"
                key={key}
              >
                <div
                  onClick={() => {
                    setSort({ [key]: sort[key as keyof typeof HEADERS] === "desc" ? "asc" : "desc" });
                  }}
                  className={cn("flex items-center gap-2", HEADERS[key as keyof typeof HEADERS].sort && "cursor-pointer")}
                >
                  {HEADERS[key as keyof typeof HEADERS].label}
                  {HEADERS[key as keyof typeof HEADERS].sort && (
                    <svg width="16" height="20" viewBox="0 0 16 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M14.2929 14.0406C14.6834 14.4311 15.3166 14.4311 15.7071 14.0406C16.0976 13.6501 16.0976 13.0169 15.7071 12.6264L11.7071 8.62639C11.5196 8.43885 11.2652 8.3335 11 8.3335C10.7348 8.3335 10.4804 8.43885 10.2929 8.62639L6.29289 12.6264C5.90237 13.0169 5.90237 13.6501 6.29289 14.0406C6.68342 14.4311 7.31658 14.4311 7.70711 14.0406L10 11.7477V18.3335C10 18.8858 10.4477 19.3335 11 19.3335C11.5523 19.3335 12 18.8858 12 18.3335V11.7477L14.2929 14.0406Z"
                        fill={sort[key as keyof typeof HEADERS] && sort[key as keyof typeof HEADERS] === "asc" ? "#222222" : "#828282"}
                      />
                      <path
                        d="M8.29289 5.9594C8.68342 5.56887 9.31658 5.56887 9.70711 5.95939C10.0976 6.34992 10.0976 6.98308 9.70711 7.37361L5.70711 11.3736C5.51957 11.5611 5.26521 11.6665 5 11.6665C4.73478 11.6665 4.48043 11.5611 4.29289 11.3736L0.292893 7.37361C-0.0976316 6.98309 -0.0976306 6.34992 0.292893 5.9594C0.683418 5.56887 1.31658 5.56887 1.70711 5.9594L4 8.25229V1.6665C4 1.11422 4.44771 0.666502 5 0.666502C5.55228 0.666502 6 1.11422 6 1.6665V8.25229L8.29289 5.9594Z"
                        fill={sort[key as keyof typeof HEADERS] && sort[key as keyof typeof HEADERS] === "desc" ? "#222222" : "#828282"}
                      />
                    </svg>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {assessments.length === 0 && (
            <tr>
              <td colSpan={7}>
                <div className="w-full h-60 flex justify-center items-center flex-col py-10">
                  <NoDataIcon className="size-52" />
                  <h2 className="font-semibold">No result found</h2>
                </div>
              </td>
            </tr>
          )}
          {assessments.map((assessment) => {
            const { hovered, popup } = getState(assessment.data.id, propertiesInteraction);

            return assessment.isBulked ? (
              <Fragment key={assessment.data.id}>
                <tr
                  className={cn(
                    "cursor-pointer border-t  transition-all",
                    generateClasses({
                      hasSellingProperty: hasSellingProperty(data.id, assessment),
                      hovered,
                      selected: popup,
                      isMedianValid: assessment.data.isMedianValid,
                      isNonValidMedianHighlighted,
                    })
                  )}
                  onClick={() => {
                    setPropertiesInteraction((prev) => ({
                      ...prev,
                      popup:
                        prev.popup?.openId !== assessment.data.id
                          ? {
                              clickId: assessment.data.id,
                              isBulked: assessment.isBulked,
                              openId: assessment.data.id,
                            }
                          : null,
                    }));
                  }}
                  onMouseEnter={() => {
                    if (!popup) {
                      setPropertiesInteraction((prev) => ({
                        ...prev,
                        hover: {
                          clickId: assessment.data.id,
                          isBulked: assessment.isBulked,
                          openId: assessment.data.id,
                        },
                      }));
                    }
                  }}
                  onMouseLeave={() => {
                    setPropertiesInteraction((prev) => ({ ...prev, hover: null }));
                  }}
                >
                  <td className="text-grey-800 text-xs">{assessment.data.acreage.formattedString}</td>
                  <td className="text-grey-800 text-xs">{assessment.data.totalProperties} Parcels</td>
                  <td className="text-grey-800 text-xs">
                    {assessment.data.state.label}/
                    {assessment.data.uniqueCounties > 1 ? `${assessment.data.uniqueCounties} Counties` : assessment.data.county.label}
                  </td>
                  <td className="text-grey-800 text-xs">
                    {assessment.data.uniquePropertyTypes === 1
                      ? assessment.data.propertyType
                      : `${assessment.data.uniquePropertyTypes} Property Types`}
                  </td>
                  <td className="text-grey-800 text-xs">
                    <span className={cn(!isSubscribed && "blur-[2px] relative z-0")}>{assessment.data.price.formattedString}</span>
                  </td>
                  <td className="text-grey-800 text-xs">
                    <span className={cn(!isSubscribed && "blur-[2px] relative z-0")}>
                      {assessment.data.pricePerAcreage.formattedString}
                    </span>
                  </td>
                  <td className="text-grey-800 text-xs">{moment(assessment.data.lastSaleDate).format("MM-DD-YYYY")}</td>
                  <td className="text-grey-800 text-xs">
                    <div className="flex items-center gap-2 justify-end">
                      {popup ? <MdKeyboardArrowDown className="size-5" /> : <MdKeyboardArrowUp className="size-5" />}
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            {hasSellingProperty(data.id, assessment) ? (
                              <div className="relative min-w-5 min-h-5 h-5 z-10">
                                <Image
                                  alt=""
                                  src={`/map/pins/green-${assessment.data.group}.svg`}
                                  fill
                                  loading="eager"
                                  className="w-full h-full  object-cover"
                                />
                              </div>
                            ) : (
                              <div className="relative min-w-5 min-h-5 h-5 z-10">
                                <Image
                                  alt=""
                                  src={`/map/pins/${isNonValidMedianHighlighted && !assessment.data.isMedianValid ? "yellow" : "red"}-${
                                    assessment.data.group
                                  }.svg`}
                                  fill
                                  loading="eager"
                                  className="w-full h-full  object-cover"
                                />
                              </div>
                            )}
                          </TooltipTrigger>
                          <TooltipContent>
                            <div
                              className="p-0.5"
                              style={{
                                background: "linear-gradient(98.26deg, #FA98A3 12.83%, #FF001F 138.73%)",
                                borderRadius: 12,
                                boxShadow: "0px 4px 12px 0px #0000001F",
                              }}
                            >
                              <div style={{ borderRadius: 10 }} className="bg-white p-3">
                                <p className="font-medium text-xs max-w-44">
                                  Lands marked with{" "}
                                  <span className="font-semibold text-[#F44D61]">({assessment.data.group.toLocaleUpperCase()})</span> where
                                  sold together
                                </p>
                              </div>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </td>
                </tr>
                {popup &&
                  assessment.data.properties.map((childAssessment) => (
                    <tr key={childAssessment.id} className={cn("border-t")}>
                      <td className="text-grey-800 bg-grey-50 text-xs !pl-7 ">{childAssessment.acreage.formattedString}</td>
                      <td className="text-grey-800 bg-grey-50 text-xs !pl-7 ">{childAssessment.parcelNumber.formattedString}</td>
                      <td className="text-grey-800 bg-grey-50 text-xs !pl-7 ">
                        {assessment.data.state.label}/{assessment.data.county.label}
                      </td>
                      <td className="text-grey-800 bg-grey-50 text-xs !pl-7 ">{assessment.data.propertyType}</td>
                      <td className="text-grey-800 bg-grey-50 text-xs !pl-7 ">
                        <span>-</span>
                      </td>
                      <td className="text-grey-800 bg-grey-50 text-xs !pl-7 ">
                        <span>-</span>
                      </td>
                      <td className="text-grey-800 bg-grey-50 text-xs !pl-7 ">
                        {moment(assessment.data.lastSaleDate).format("MM-DD-YYYY")}
                      </td>
                      <td className="text-grey-800 bg-grey-50 text-xs !pl-7 ">
                        <div className="flex items-center gap-2 justify-end">
                          <MdKeyboardArrowUp className="size-5 opacity-0" />
                          {hasSellingProperty(data.id, { isBulked: false, data: childAssessment }) && (
                            <FaLocationDot className="text-primary-dark size-4" />
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
              </Fragment>
            ) : (
              <tr
                key={assessment.data.id}
                className={generateClasses({
                  hasSellingProperty: hasSellingProperty(data.id, assessment),
                  hovered,
                  selected: popup,
                  isMedianValid: assessment.data.isMedianValid,
                  isNonValidMedianHighlighted,
                })}
                onClick={() => {
                  setPropertiesInteraction((prev) => ({
                    ...prev,
                    popup: {
                      clickId: assessment.data.id,
                      isBulked: assessment.isBulked,
                      openId: assessment.data.id,
                    },
                  }));
                }}
                onMouseEnter={() => {
                  if (!popup) {
                    setPropertiesInteraction((prev) => ({
                      ...prev,
                      hover: {
                        clickId: assessment.data.id,
                        isBulked: assessment.isBulked,
                        openId: assessment.data.id,
                      },
                    }));
                  }
                }}
                onMouseLeave={() => {
                  setPropertiesInteraction((prev) => ({ ...prev, hover: null }));
                }}
              >
                <td className="text-grey-800 text-xs">{assessment.data.acreage.formattedString}</td>
                <td className="text-grey-800 text-xs">{assessment.data.parcelNumber.formattedString}</td>
                <td className="text-grey-800 text-xs">
                  {assessment.data.state.label}/{assessment.data.county.label}
                </td>
                <td className="text-grey-800 text-xs">
                  <span className={cn(!isSubscribed && "blur-[2px] relative z-0")}>{assessment.data.propertyType}</span>
                </td>
                <td className="text-grey-800 text-xs">
                  <span className={cn(!isSubscribed && "blur-[2px] relative z-0")}>{assessment.data.lastSalePrice.formattedString}</span>
                </td>
                <td className="text-grey-800 text-xs">
                  <span className={cn(!isSubscribed && "blur-[2px] relative z-0")}>{assessment.data.pricePerAcreage.formattedString}</span>
                </td>
                <td className="text-grey-800 text-xs">{moment(assessment.data.lastSaleDate).format("MM-DD-YYYY")}</td>
                <td className="text-grey-800 text-xs !pl-7 ">
                  <div className="flex items-center gap-2 justify-end">
                    <MdKeyboardArrowUp className="size-5 opacity-0" />
                    {hasSellingProperty(data.id, assessment) && <FaLocationDot className="text-primary-dark size-4" />}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default VoltDetailsCalculationTable;
