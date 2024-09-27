import { moneyFormatter, removeParcelNumberFormatting } from "@/helpers/common";
import { cn } from "@/lib/utils";
import { IDecodedAccessToken } from "@/types/auth";
import { MapInteractionModel } from "@/types/common";
import React, { Dispatch, SetStateAction } from "react";
import { FaLocationDot } from "react-icons/fa6";

const CalculatePrice = ({ price }: { price: number }) => (
  <div>
    <h1 className="text-sm font-medium text-gray-800 w-max">VOLT Value</h1>
    <h2 className="text-2xl xl:text-4xl font-bold">{moneyFormatter.format(price)}</h2>
  </div>
);

const VoltPriceCalculationAxis = ({
  data,
  setOpenPropertyDetailWarningModal,
  user,
  voltValue,
  mapInteraction,
  setMpaInteraction,
}: {
  data: {
    pricePerAcre: number;
    parcelNumber: string;
    acreage: number;
    price: number;
    isMainLand: boolean;
  }[];
  setOpenPropertyDetailWarningModal: Dispatch<SetStateAction<boolean>>;
  user: IDecodedAccessToken | null;
  voltValue: number;
  mapInteraction: MapInteractionModel;
  setMpaInteraction: Dispatch<SetStateAction<MapInteractionModel>>;
}) => {
  const averagePricePerAcre = Number((data.reduce((acc, cur) => acc + cur.pricePerAcre, 0) / data.length).toFixed(2));
  const minPricePerAcre = Math.min(...data.map((el) => el.pricePerAcre));
  const maxPricePerAcre = Math.max(...data.map((el) => el.pricePerAcre));

  const getItemXAxisPositionInPercent = (price: number) =>
    Number((((price - minPricePerAcre) / (maxPricePerAcre - minPricePerAcre)) * 100).toFixed(2));

  return (
    <>
      <div className="border border-primary-main-400 rounded-2xl px-4 py-5 lg:p-8 flex flex-col lg:flex-row gap-4 gap-y-3 gap-x-10">
        <div
          className={`
          flex flex-col lg:flex-row items-center gap-2 mt-4 w-full relative
            lg:after:content-['Min_Price_Per_Acre'] after:absolute after:top-[40px] after:text-xs after:text-gray-600
            lg:before:content-['Max_Price_Per_Acre'] before:absolute before:top-[40px] before:right-0 before:text-xs before:text-gray-600
          `}
        >
          <p className="text-xs text-gray-600 hidden lg:block">Min</p>
          <div
            className={`position relative w-full 
        
          `}
          >
            <div className="bg-primary-main-400 h-1.5 rounded-2xl" />
            <div
              style={{
                width:
                  getItemXAxisPositionInPercent(averagePricePerAcre) > 0
                    ? `calc(${getItemXAxisPositionInPercent(averagePricePerAcre)}% + 12px)`
                    : 0,
              }}
              className="bg-primary-main h-1.5 rounded-2xl absolute top-0"
            />
            <div
              style={{ left: `calc(${getItemXAxisPositionInPercent(averagePricePerAcre)}%)` }}
              className="absolute top-[50%] -translate-y-[50%]"
            >
              <div
                className={`bg-white size-6  rounded-full flex items-center justify-center relative 
               lg:after:content-['Average_Price_Per_Acre'] after:absolute after:top-[25px] after:text-xs after:text-gray-600 after:w-max
              `}
              >
                <div className="size-5 border-2 rounded-full border-primary-main" />
                <div className="size-3 bg-primary-main rounded-full absolute" />
              </div>
            </div>
            {/* Pins */}
            {data.map((property) => (
              <FaLocationDot
                onMouseEnter={() => {
                  setMpaInteraction((prevData) => ({
                    ...prevData,
                    hoveredParcelNumber: removeParcelNumberFormatting(property.parcelNumber),
                    zoom: true,
                  }));
                }}
                onMouseLeave={() => {
                  setMpaInteraction((prevData) => ({
                    ...prevData,
                    hoveredParcelNumber: null,
                    zoom: false,
                  }));
                }}
                onClick={() => {
                  if ((!user || !user.isSubscribed) && !property.isMainLand) {
                    setOpenPropertyDetailWarningModal(true);
                  } else {
                    setMpaInteraction((prevData) => ({
                      ...prevData,
                      openPopperParcelNumber: removeParcelNumberFormatting(property.parcelNumber),
                    }));
                  }
                }}
                key={property.parcelNumber}
                style={{ left: `calc(${getItemXAxisPositionInPercent(property.pricePerAcre)}% - 0px)` }}
                className={cn(
                  `cursor-pointer absolute top-0 -translate-y-full text-[#F78290] size-5 lg:size-6 -translate-x-1/2 transition-all duration-100 hover:scale-150 hover:text-[#FF2F48]`,
                  (mapInteraction.hoveredParcelNumber === removeParcelNumberFormatting(property.parcelNumber) ||
                    mapInteraction.openPopperParcelNumber === removeParcelNumberFormatting(property.parcelNumber)) &&
                    "scale-150 text-[#FF2F48] "
                )}
              />
            ))}
          </div>
          <p className="text-xs text-gray-600 hidden lg:block">Max</p>
          <div className="flex justify-between w-full lg:hidden">
            <p className="text-xs text-gray-600">Min</p>
            <p className="text-xs text-gray-600">Max</p>
          </div>
        </div>

        <div className="py-3 lg:py-0 border-t border-t-gray-200 lg:border-y-0 flex gap-4">
          <div className="space-y-1">
            <p className="lg:hidden text-xs font-medium text-gray-600">
              Min Price Per Acre: <span className="text-black font-semibold">{moneyFormatter.format(20000)}</span>
            </p>
            <p className="lg:hidden text-xs font-medium text-gray-600">
              Average Price Per Acre: <span className="text-black font-semibold">{moneyFormatter.format(20000)}</span>
            </p>
            <p className="lg:hidden text-xs font-medium text-gray-600">
              Max Price Per Acre: <span className="text-black font-semibold">{moneyFormatter.format(20000)}</span>
            </p>
          </div>
          <div className="ml-auto">
            <CalculatePrice price={voltValue} />
          </div>
        </div>
      </div>
    </>
  );
};

export default VoltPriceCalculationAxis;
