"use client";

import { cn } from "@/lib/utils";
import { IoInformationCircleOutline } from "react-icons/io5";
import { FaLocationDot } from "react-icons/fa6";
import { Dispatch, FC, SetStateAction, useMemo, useRef } from "react";
import { moneyFormatter } from "@/helpers/common";
import { PropertyDataSchema } from "@/zod-validations/volt-new";
import { z } from "zod";
import Image from "next/image";
import { Tooltip } from "../ui/tooltip";
import { Popover, PopoverContent, PopoverTrigger, PopoverArrow } from "../ui/popover";

interface VoltDetailsProgressLineProps {
  data: z.infer<typeof PropertyDataSchema>;
  setPropertiesInteraction: Dispatch<
    SetStateAction<{
      [key: string]: "hovered" | "popup";
    }>
  >;
  propertiesInteraction: { [key: string]: "hovered" | "popup" };
  isNonValidMedianHighlighted: boolean;
}

const hasSellingProperty = (
  sellingPropertyParcelNumberNoFormatting: string,
  data: z.infer<typeof PropertyDataSchema>["assessments"][0]
) => {
  if (data.isBulked) {
    return !!data.data.properties.find((el) => el.parcelNumberNoFormatting === sellingPropertyParcelNumberNoFormatting);
  }
  return data.data.parcelNumberNoFormatting === sellingPropertyParcelNumberNoFormatting;
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

const VoltDetailsProgressLine: FC<VoltDetailsProgressLineProps> = ({
  data,
  propertiesInteraction,
  setPropertiesInteraction,
  isNonValidMedianHighlighted,
}) => {
  const timerRef = useRef<ReturnType<typeof setTimeout>>();
  const avgPriceOfAllAssessments = useMemo(() => {
    let totalPrices = 0;
    totalPrices = data.assessments.reduce((acc, cur) => acc + cur.data.pricePerAcreage, 0);
    const avgPrice = totalPrices / data.assessments.length;
    return avgPrice;
  }, [data.assessments]);

  const assessments = isNonValidMedianHighlighted ? data.assessments.filter((el) => el.data.isMedianValid) : data.assessments;

  const allPrices = useMemo(() => assessments.map((el) => el.data.pricePerAcreage), [assessments]);

  const minPricePerAcre = Math.min(...allPrices);
  const maxPricePerAcre = Math.max(...allPrices);

  const getItemXAxisPositionInPercent = (price: number) =>
    Number((((price - minPricePerAcre) / (maxPricePerAcre - minPricePerAcre)) * 100).toFixed(2));

  return (
    <div
      id="volt-progress-line"
      className="border border-primary-main-400 bg-[#FAFFFB] py-3 px-4  border-t-0 space-y-8 relative z-10 shadow-3 -translate-y-0.5"
    >
      <div className="flex items-center justify-between gap-4 border-b border-b-[#C3EBD3] pb-3">
        <div className="flex gap-4 items-center">
          <div className="flex items-center gap-2">
            <div className={cn(`bg-white size-6  rounded-full flex items-center justify-center relative`)}>
              <div className="size-5 border-2 rounded-full border-primary-main" />
              <div className="size-3 bg-primary-main rounded-full absolute" />
            </div>
            <div className="flex items-center gap-2">
              <p className="font-semibold text-xs">
                {moneyFormatter.format(avgPriceOfAllAssessments)} <span className="text-grey-600">- Average PPA</span>
              </p>
              <Tooltip renderButton={<IoInformationCircleOutline className="size-5 text-grey-600" />} renderContent="Some text." />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className={cn(`bg-white size-6  rounded-full flex items-center justify-center relative`)}>
              <div className="size-5 border-2 rounded-full border-warning" />
              <div className="size-3 bg-warning rounded-full absolute" />
            </div>
            <div className="flex items-center gap-2">
              <p className="font-semibold text-xs">
                {moneyFormatter.format(data.price / data.acreage)} <span className="text-grey-600">- VOLT PPA</span>
              </p>
              <Tooltip renderButton={<IoInformationCircleOutline className="size-5 text-grey-600" />} renderContent="Some text." />
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <FaLocationDot className="text-primary-dark size-5" />
          <p className="text-primary-main text-xs font-medium">Subject Land</p>
          <Tooltip renderButton={<IoInformationCircleOutline className="size-6 text-primary-dark" />} renderContent="Some text." />
        </div>
      </div>

      <div className="relative">
        <div className="relative">
          <hr className="w-full h-1.5 rounded-lg" style={{ background: "linear-gradient(90deg, #16DB65 8%, #05471C 95.44%)" }} />
          <div
            style={{ left: `calc(${getItemXAxisPositionInPercent(avgPriceOfAllAssessments)}%)` }}
            className="absolute top-[50%] -translate-y-[50%]"
          >
            <div className={cn(`bg-white size-6  rounded-full flex items-center justify-center relative`)}>
              <div className="size-5 border-2 rounded-full border-primary-main" />
              <div className="size-3 bg-primary-main rounded-full absolute" />
            </div>
          </div>
          <div
            style={{ left: `calc(${getItemXAxisPositionInPercent(data.price / data.acreage)}%)` }}
            className="absolute top-[50%] -translate-y-[50%]"
          >
            <div className={cn(`bg-white size-6  rounded-full flex items-center justify-center relative`)}>
              <div className="size-5 border-2 rounded-full border-warning" />
              <div className="size-3 bg-warning rounded-full absolute" />
            </div>
          </div>
          {assessments.map((property) => {
            const parcelNumberNoFormatting = property.isBulked ? property.data.id : property.data.parcelNumberNoFormatting;
            return (
              <Popover key={parcelNumberNoFormatting} open={propertiesInteraction[parcelNumberNoFormatting] === "hovered"}>
                <PopoverTrigger className={cn("")} asChild>
                  <div
                    style={{ left: `calc(${getItemXAxisPositionInPercent(property.data.pricePerAcreage)}% - 0px)` }}
                    className="absolute top-0 -translate-y-full -translate-x-1/2"
                  >
                    <div
                      onMouseEnter={() => {
                        if (propertiesInteraction && propertiesInteraction[parcelNumberNoFormatting] !== "popup") {
                          setPropertiesInteraction((prev) => ({ ...prev, [parcelNumberNoFormatting]: "hovered" }));
                        }
                      }}
                      onMouseLeave={() => {
                        setPropertiesInteraction((prev) => {
                          if (prev && prev[parcelNumberNoFormatting] !== "popup") {
                            const newData = { ...prev };
                            delete newData[parcelNumberNoFormatting];
                            return newData;
                          }
                          return prev;
                        });
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
                        const newData = { ...propertiesInteraction };
                        Object.keys(newData).forEach((key) => {
                          if (newData[key] === "popup" && key !== parcelNumberNoFormatting) {
                            delete newData[key];
                          }
                        });

                        newData[parcelNumberNoFormatting] = "popup";
                        setPropertiesInteraction({ ...newData });
                      }}
                      key={property.isBulked ? property.data.id : property.data.parcelNumberNoFormatting}
                      className={cn(
                        `cursor-pointer transition-all duration-100 relative `,
                        propertiesInteraction[parcelNumberNoFormatting] ? "min-w-7 min-h-7 h-7" : "min-w-5 min-h-5 h-5"
                        // property.data.isMedianValid && "text-[#F78290] hover:text-[#FF2F48]",
                        // !property.data.isMedianValid && isNonValidMedianHighlighted && "text-[#ffae36] hover:text-[#FF9900]",
                        // !property.data.isMedianValid && !isNonValidMedianHighlighted && "text-[#F78290] hover:text-[#FF2F48]",
                        // !property.data.isMedianValid &&
                        //   !isNonValidMedianHighlighted &&
                        //   hasSellingProperty(data.parcelNumberNoFormatting, property) &&
                        //   "text-primary-dark hover:text-primary-dark"
                      )}
                    >
                      <Image
                        alt=""
                        src={`/map/pins/${getPin(
                          hasSellingProperty(data.parcelNumberNoFormatting, property),
                          property.data.isMedianValid,
                          !!propertiesInteraction[parcelNumberNoFormatting],
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
                        <span className="text-black font-medium">{moneyFormatter.format(property.data.pricePerAcreage)}</span>
                      </p>
                      <p className="text-xs text-grey-600">
                        Acreage: <span className="text-black font-medium">{property.data.acreage.toFixed(2)}</span>
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
            {moneyFormatter.format(minPricePerAcre)}{" "}
            <span className="text-grey-600 font-semibold text-sm">- Lowest sale reported per acre</span>
          </p>
          <p className="font-semibold text-sm">
            <span className="text-grey-600 font-semibold text-xs">Highest sale reported per acre - </span>{" "}
            {moneyFormatter.format(maxPricePerAcre)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default VoltDetailsProgressLine;
