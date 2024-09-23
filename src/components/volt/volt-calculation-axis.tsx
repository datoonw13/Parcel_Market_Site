import { moneyFormatter, removeParcelNumberFormatting } from "@/helpers/common";
import { cn } from "@/lib/utils";
import React from "react";
import { FaLocationDot } from "react-icons/fa6";

const CalculatePrice = ({ price }: { price: number }) => (
  <div>
    <h1 className="text-sm font-medium text-gray-800 w-max">VOLT Value</h1>
    <h2 className="text-2xl xl:text-4xl font-bold">{moneyFormatter.format(price)}</h2>
  </div>
);

const VoltPriceCalculationAxis = ({
  data,
  highlightedParcelNumber,
  onPinHover,
}: {
  data: {
    pricePerAcre: number;
    parcelNumber: string;
    acreage: number;
    price: number;
  }[];
  highlightedParcelNumber: string | null;
  onPinHover?: (parcelNumberNoFormatting: string) => void;
}) => {
  const averagePricePerAcre = Number((data.reduce((acc, cur) => acc + cur.pricePerAcre, 0) / data.length).toFixed(2));
  const minPricePerAcre = Math.min(...data.map((el) => el.pricePerAcre));
  const maxPricePerAcre = Math.max(...data.map((el) => el.pricePerAcre));

  const getItemXAxisPositionInPercent = (price: number) =>
    Number((((price - minPricePerAcre) / (maxPricePerAcre - minPricePerAcre)) * 100).toFixed(2));

  return (
    <div className="border border-primary-main-400 rounded-2xl px-4 py-6 xl:p-6 lg:p-8 flex flex-col xl:flex-row gap-4 xl:gap-3 xl:gap-x-10">
      <div
        className={`
          flex flex-col xl:flex-row items-center gap-2 mt-4 w-full relative
            xl:after:content-['Min_Price_Per_Acre'] after:absolute after:top-[40px] after:text-xs after:text-gray-600
            xl:before:content-['Max_Price_Per_Acre'] before:absolute before:top-[40px] before:right-0 before:text-xs before:text-gray-600
          `}
      >
        <p className="text-xs text-gray-600 hidden xl:block">Min</p>
        <div
          className={`position relative w-full 
        
          `}
        >
          {/* Main thumb */}
          <div className="bg-primary-main-400 h-1.5 rounded-2xl" />
          {/* Secondary thumb */}
          <div
            style={{
              width:
                getItemXAxisPositionInPercent(averagePricePerAcre) > 0
                  ? `calc(${getItemXAxisPositionInPercent(averagePricePerAcre)}% + 12px)`
                  : 0,
            }}
            className="bg-primary-main h-1.5 rounded-2xl absolute top-0"
          />
          {/* Thumb dot */}
          <div
            style={{ left: `calc(${getItemXAxisPositionInPercent(averagePricePerAcre)}%)` }}
            className="absolute top-[50%] -translate-y-[50%]"
          >
            <div
              className={`bg-white size-6  rounded-full flex items-center justify-center relative 
               xl:after:content-['Average_Price_Per_Acre'] after:absolute after:top-[25px] after:text-xs after:text-gray-600 after:w-max
              `}
            >
              <div className="size-5 border-2 rounded-full border-primary-main" />
              <div className="size-3 bg-primary-main rounded-full absolute" />
            </div>
          </div>
          {/* Pins */}
          {data.map((property) => (
            <FaLocationDot
              onMouseEnter={() => onPinHover && onPinHover(removeParcelNumberFormatting(property.parcelNumber))}
              key={property.parcelNumber}
              style={{ left: `calc(${getItemXAxisPositionInPercent(property.pricePerAcre)}% - 0px)` }}
              className={cn(
                `cursor-pointer absolute top-0 -translate-y-full text-[#F78290] size-5 xl:size-6 -translate-x-1/2 transition-all duration-100 hover:scale-150 hover:text-[#FF2F48]`,
                highlightedParcelNumber === removeParcelNumberFormatting(property.parcelNumber) && "scale-150 text-[#FF2F48] "
              )}
            />
          ))}
        </div>
        <p className="text-xs text-gray-600 hidden xl:block">Max</p>
        <div className="flex justify-between w-full xl:hidden">
          <p className="text-xs text-gray-600">Min</p>
          <p className="text-xs text-gray-600">Max</p>
        </div>
      </div>

      <div className="py-3 xl:py-0 border-t border-t-gray-200 xl:border-y-0 flex gap-4">
        <div className="space-y-1">
          <p className="xl:hidden text-xs font-medium text-gray-600">
            Min Price Per Acre: <span className="text-black font-semibold">{moneyFormatter.format(20000)}</span>
          </p>
          <p className="xl:hidden text-xs font-medium text-gray-600">
            Average Price Per Acre: <span className="text-black font-semibold">{moneyFormatter.format(20000)}</span>
          </p>
          <p className="xl:hidden text-xs font-medium text-gray-600">
            Max Price Per Acre: <span className="text-black font-semibold">{moneyFormatter.format(20000)}</span>
          </p>
        </div>
        <div className="ml-auto">
          <CalculatePrice price={12211233} />
        </div>
      </div>
    </div>
  );
};

export default VoltPriceCalculationAxis;
