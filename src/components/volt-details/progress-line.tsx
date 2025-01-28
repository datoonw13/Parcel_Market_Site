"use client";

import { cn } from "@/lib/utils";
import { IoInformationCircleOutline } from "react-icons/io5";
import { FaLocationDot } from "react-icons/fa6";
import { IVoltPriceCalculation } from "@/types/volt";
import { FC } from "react";
import { moneyFormatter } from "@/helpers/common";
import { Tooltip } from "../ui/tooltip";

interface VoltDetailsProgressLineProps {
  data: IVoltPriceCalculation & { dateCreated: Date };
  averageOfPropertiesUsedForCal: number;
}

const VoltDetailsProgressLine: FC<VoltDetailsProgressLineProps> = ({ averageOfPropertiesUsedForCal, data }) => {
  //   const averagePricePerAcre = Number((data.reduce((acc, cur) => acc + cur.pricePerAcre, 0) / data.length).toFixed(2));
  const allPrices = data.propertiesUsedForCalculation
    .map((el) => (el.isBulked ? el.data.properties.map((childEl) => childEl.pricePerAcreage) : el.data.pricePerAcreage))
    .flat();
  const minPricePerAcre = Math.min(...allPrices);
  const maxPricePerAcre = Math.max(...allPrices);

  const getItemXAxisPositionInPercent = (price: number) =>
    Number((((price - minPricePerAcre) / (maxPricePerAcre - minPricePerAcre)) * 100).toFixed(2));

  console.log(minPricePerAcre, maxPricePerAcre, data);

  return (
    <div className="border border-primary-main-400 bg-[#FAFFFB] p-5 rounded-2xl space-y-12">
      <div className="flex items-center justify-between gap-4 border-b border-b-[#C3EBD3] pb-3">
        <div className="flex gap-4 items-center">
          <div className="flex items-center gap-2">
            <div className={cn(`bg-white size-6  rounded-full flex items-center justify-center relative`)}>
              <div className="size-5 border-2 rounded-full border-primary-main" />
              <div className="size-3 bg-primary-main rounded-full absolute" />
            </div>
            <div className="flex items-center gap-2">
              <p className="font-semibold text-xs">
                {moneyFormatter.format(averageOfPropertiesUsedForCal)} <span className="text-grey-600">- Average PPA</span>
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
                {moneyFormatter.format(data.pricePerAcreage)} <span className="text-grey-600">- VOLT PPA</span>
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
            style={{ left: `calc(${getItemXAxisPositionInPercent(averageOfPropertiesUsedForCal)}%)` }}
            className="absolute top-[50%] -translate-y-[50%]"
          >
            <div className={cn(`bg-white size-6  rounded-full flex items-center justify-center relative`)}>
              <div className="size-5 border-2 rounded-full border-primary-main" />
              <div className="size-3 bg-primary-main rounded-full absolute" />
            </div>
          </div>
          <div
            style={{ left: `calc(${getItemXAxisPositionInPercent(data.pricePerAcreage)}%)` }}
            className="absolute top-[50%] -translate-y-[50%]"
          >
            <div className={cn(`bg-white size-6  rounded-full flex items-center justify-center relative`)}>
              <div className="size-5 border-2 rounded-full border-warning" />
              <div className="size-3 bg-warning rounded-full absolute" />
            </div>
          </div>
          {data.propertiesUsedForCalculation.map((property) => (
            <FaLocationDot
              onMouseEnter={() => {
                //   setMpaInteraction((prevData) => ({
                //     ...prevData,
                //     hoveredParcelNumber: property.parcelNumberNoFormatting,
                //     zoom: true,
                //   }));
              }}
              onMouseLeave={() => {}}
              onClick={() => {}}
              key={property.data.parcelNumberNoFormatting}
              style={{ left: `calc(${getItemXAxisPositionInPercent(property.data.pricePerAcreage)}% - 0px)` }}
              className={cn(
                `size-6 cursor-pointer absolute top-0 -translate-y-full text-[#F78290] -translate-x-1/2 transition-all duration-100 hover:scale-150 `,
                `${
                  data.parcelNumberNoFormatting === property.data.parcelNumberNoFormatting
                    ? "text-primary-dark"
                    : "text-[#F78290] hover:text-[#FF2F48]"
                }`
                //   isActive(mapInteraction.openPopperParcelNumber, mapInteraction.hoveredParcelNumber, property).active &&
                //     "scale-150 text-[#FF2F48]",
                //   isActive(mapInteraction.openPopperParcelNumber, mapInteraction.hoveredParcelNumber, property).highlighted &&
                //     "scale-150 text-[#FF2F48]"
              )}
            />
          ))}
        </div>
        <div className="flex items-center justify-between mt-2">
          <p className="font-semibold text-xs">
            {moneyFormatter.format(minPricePerAcre)}{" "}
            <span className="text-grey-600 font-semibold text-xs">- Lowest sale reported per acre</span>
          </p>
          <p className="font-semibold text-xs">
            <span className="text-grey-600 font-semibold text-xs">Highest sale reported per acre - </span>{" "}
            {moneyFormatter.format(maxPricePerAcre)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default VoltDetailsProgressLine;
