"use client";

import { moneyFormatter } from "@/helpers/common";
import { cn } from "@/lib/utils";
import { PropertyDataSchema } from "@/zod-validations/volt-new";
import { orderBy } from "lodash";
import moment from "moment";
import { Dispatch, FC, Fragment, SetStateAction, useMemo, useRef, useState } from "react";
import { FaLocationDot } from "react-icons/fa6";
import { LuArrowUpDown } from "react-icons/lu";
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";
import { RiArrowUpDownFill } from "react-icons/ri";
import { z } from "zod";

const HEADERS = {
  parcelNumber: {
    label: "Parcel ID",
    sort: false,
  },
  county: {
    label: "County",
    sort: false,
  },
  acreage: {
    label: "Acreage",
    sort: false,
  },
  soldPrice: {
    label: "Sold Price",
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

const hasSellingProperty = (
  sellingPropertyParcelNumberNoFormatting: string,
  data: z.infer<typeof PropertyDataSchema>["assessments"][0]
) => {
  if (data.isBulked) {
    return !!data.data.properties.find((el) => el.parcelNumberNoFormatting === sellingPropertyParcelNumberNoFormatting);
  }
  return data.data.parcelNumberNoFormatting === sellingPropertyParcelNumberNoFormatting;
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
    classNames = `${classNames} border-y-[#FCEDB6] bg-[#FEFAEB]`;
    if (hovered) {
      classNames = `${classNames} bg-[#fdf5d8]`;
    }
    if (selected) {
      classNames = `${classNames} bg-[#fdf5d8]`;
    }
  }

  if (hasSellingProperty) {
    console.log("aqa");

    classNames = `${classNames} border-y-[#17DC66]`;
  }
  return cn(classNames);
};

interface VoltDetailsCalculationTableProps {
  data: z.infer<typeof PropertyDataSchema>;
  setPropertiesInteraction: Dispatch<
    SetStateAction<{
      [key: string]: "hovered" | "popup";
    }>
  >;
  propertiesInteraction: { [key: string]: "hovered" | "popup" };
  isNonValidMedianHighlighted: boolean;
}

const VoltDetailsCalculationTable: FC<VoltDetailsCalculationTableProps> = ({
  data,
  propertiesInteraction,
  setPropertiesInteraction,
  isNonValidMedianHighlighted,
}) => {
  const timerRef = useRef<ReturnType<typeof setTimeout>>(null);

  const [sort, setSort] = useState<Partial<{ [key in keyof typeof HEADERS]: "asc" | "desc" }>>({ pricePerAcreage: "asc" });
  const sortKey = Object.keys(sort)[0] as keyof typeof HEADERS;
  const sortValue = Object.values(sort)[0];
  const assessments = useMemo(() => {
    if (sortKey === "lastSaleDate") {
      return [...data.assessments].sort((d1, d2) => {
        const date1 = d1.isBulked ? d1.data.properties[0].lastSalesDate : d1.data.lastSalesDate;
        const date2 = d2.isBulked ? d2.data.properties[0].lastSalesDate : d2.data.lastSalesDate;
        return sortValue === "asc"
          ? new Date(date1).getTime() - new Date(date2).getTime()
          : new Date(date2).getTime() - new Date(date1).getTime();
      });
    }
    return orderBy(data.assessments, [`data.${sortKey}`], [sortValue]);
  }, [data.assessments, sortKey, sortValue]);

  return (
    <div className="w-full mb-0.5">
      {/* [&>tbody>tr:last-child>td:first-child]:rounded-bl-2xl [&>tbody>tr:last-child>td:last-child]:rounded-br-2xl */}

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
                className="bg-grey-30 text-sm font-semibold sticky top-0 shadow-5"
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
          {assessments.map((assessment) =>
            assessment.isBulked ? (
              <Fragment key={assessment.data.id}>
                <tr
                  className={cn(
                    "cursor-pointer border-t  transition-all",
                    generateClasses({
                      hasSellingProperty: hasSellingProperty(data.parcelNumberNoFormatting, assessment),
                      hovered: propertiesInteraction[assessment.data.id] === "hovered",
                      selected: propertiesInteraction[assessment.data.id] === "popup",
                      isMedianValid: assessment.data.isMedianValid,
                      isNonValidMedianHighlighted,
                    })
                  )}
                  onClick={() => {
                    const newData = { ...propertiesInteraction };
                    Object.keys(newData).forEach((key) => {
                      if (newData[key] === "popup" && key !== assessment.data.id) {
                        delete newData[key];
                      }
                    });

                    if (newData[assessment.data.id] === "popup") {
                      delete newData[assessment.data.id];
                    } else {
                      newData[assessment.data.id] = "popup";
                    }
                    setPropertiesInteraction({ ...newData });
                  }}
                  onMouseEnter={() => {
                    if (propertiesInteraction && propertiesInteraction[assessment.data.id] !== "popup") {
                      const newData = Object.keys(propertiesInteraction).reduce((acc, cur) => {
                        if (propertiesInteraction[cur] === "popup") {
                          return {
                            ...acc,
                            cur: "popup",
                          };
                        }
                        return {
                          ...acc,
                        };
                      }, {});
                      setPropertiesInteraction((prev) => ({ ...prev, [assessment.data.id]: "hovered" }));
                    }
                  }}
                  onMouseLeave={() => {
                    setPropertiesInteraction((prev) => {
                      if (propertiesInteraction && propertiesInteraction[assessment.data.id] !== "popup") {
                        const newData = { ...prev };
                        delete newData[assessment.data.id];
                        return newData;
                      }
                      return prev;
                    });
                  }}
                >
                  <td className="text-grey-800 text-xs">Multiple</td>
                  <td className="text-grey-800 text-xs">{assessment.data.county}</td>
                  <td className="text-grey-800 text-xs">{assessment.data.acreage.toFixed(2)}</td>
                  <td className="text-grey-800 text-xs">{moneyFormatter.format(assessment.data.price)}</td>
                  <td className="text-grey-800 text-xs">{moneyFormatter.format(assessment.data.pricePerAcreage)}</td>
                  <td className="text-grey-800 text-xs">{moment(assessment.data.properties[0].lastSalesDate).format("MM-DD-YYYY")}</td>
                  <td className="text-grey-800 text-xs">
                    <div className="flex items-center gap-2 justify-end">
                      {propertiesInteraction[assessment.data.id] === "popup" ? (
                        <MdKeyboardArrowDown className="size-5" />
                      ) : (
                        <MdKeyboardArrowUp className="size-5" />
                      )}
                      {hasSellingProperty(data.parcelNumberNoFormatting, assessment) && (
                        <FaLocationDot className="text-primary-dark size-4" />
                      )}
                    </div>
                  </td>
                </tr>
                {propertiesInteraction[assessment.data.id] === "popup" &&
                  assessment.data.properties.map((childAssessment) => (
                    <tr key={childAssessment.parcelNumberNoFormatting} className={cn("border-t")}>
                      <td className="text-grey-800 bg-grey-50 text-xs !pl-7 ">{childAssessment.parcelNumberNoFormatting}</td>
                      <td className="text-grey-800 bg-grey-50 text-xs !pl-7 ">{assessment.data.county}</td>
                      <td className="text-grey-800 bg-grey-50 text-xs !pl-7 ">{assessment.data.acreage.toFixed(2)}</td>
                      <td className="text-grey-800 bg-grey-50 text-xs !pl-7 ">{moneyFormatter.format(assessment.data.price)}</td>
                      <td className="text-grey-800 bg-grey-50 text-xs !pl-7 ">{moneyFormatter.format(assessment.data.pricePerAcreage)}</td>
                      <td className="text-grey-800 bg-grey-50 text-xs !pl-7 ">
                        {moment(assessment.data.properties[0].lastSalesDate).format("MM-DD-YYYY")}
                      </td>
                      <td className="text-grey-800 bg-grey-50 text-xs !pl-7 ">
                        <div className="flex items-center gap-2 justify-end">
                          <MdKeyboardArrowUp className="size-5 opacity-0" />
                          {hasSellingProperty(data.parcelNumberNoFormatting, { isBulked: false, data: childAssessment }) && (
                            <FaLocationDot className="text-primary-dark size-4" />
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
              </Fragment>
            ) : (
              <tr
                key={assessment.data.parcelNumberNoFormatting}
                className={generateClasses({
                  hasSellingProperty: hasSellingProperty(data.parcelNumberNoFormatting, assessment),
                  hovered: propertiesInteraction[assessment.data.parcelNumberNoFormatting] === "hovered",
                  selected: propertiesInteraction[assessment.data.parcelNumberNoFormatting] === "popup",
                  isMedianValid: assessment.data.isMedianValid,
                  isNonValidMedianHighlighted,
                })}
                onClick={() => {
                  const newData = { ...propertiesInteraction };
                  Object.keys(newData).forEach((key) => {
                    if (newData[key] === "popup" && key !== assessment.data.parcelNumberNoFormatting) {
                      delete newData[key];
                    }
                  });

                  if (newData[assessment.data.parcelNumberNoFormatting] === "popup") {
                    newData[assessment.data.parcelNumberNoFormatting] = "hovered";
                  } else {
                    newData[assessment.data.parcelNumberNoFormatting] = "popup";
                  }
                  setPropertiesInteraction({ ...newData });
                }}
                onMouseEnter={() => {
                  if (propertiesInteraction && propertiesInteraction[assessment.data.parcelNumberNoFormatting] !== "popup") {
                    setPropertiesInteraction((prev) => ({ ...prev, [assessment.data.parcelNumberNoFormatting]: "hovered" }));
                  }
                }}
                onMouseLeave={() => {
                  setPropertiesInteraction((prev) => {
                    if (propertiesInteraction && propertiesInteraction[assessment.data.parcelNumberNoFormatting] !== "popup") {
                      const newData = { ...prev };
                      delete newData[assessment.data.parcelNumberNoFormatting];
                      return newData;
                    }
                    return prev;
                  });
                }}
              >
                <td className="text-grey-800 text-xs">{assessment.data.parcelNumberNoFormatting}</td>
                <td className="text-grey-800 text-xs">{assessment.data.county}</td>
                <td className="text-grey-800 text-xs">{assessment.data.acreage.toFixed(2)}</td>
                <td className="text-grey-800 text-xs">{moneyFormatter.format(assessment.data.lastSalesPrice)}</td>
                <td className="text-grey-800 text-xs">{moneyFormatter.format(assessment.data.pricePerAcreage)}</td>
                <td className="text-grey-800 text-xs">{moment(assessment.data.lastSalesDate).format("MM-DD-YYYY")}</td>
                <td className="text-grey-800 text-xs !pl-7 ">
                  <div className="flex items-center gap-2 justify-end">
                    <MdKeyboardArrowUp className="size-5 opacity-0" />
                    {hasSellingProperty(data.parcelNumberNoFormatting, assessment) && (
                      <FaLocationDot className="text-primary-dark size-4" />
                    )}
                  </div>
                </td>
              </tr>
            )
          )}
        </tbody>
      </table>
    </div>
  );
};

export default VoltDetailsCalculationTable;
