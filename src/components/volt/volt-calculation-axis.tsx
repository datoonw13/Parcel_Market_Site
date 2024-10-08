import { moneyFormatter, removeParcelNumberFormatting } from "@/helpers/common";
import { cn } from "@/lib/utils";
import { IDecodedAccessToken } from "@/types/auth";
import { MapInteractionModel } from "@/types/common";
import { Dispatch, SetStateAction } from "react";
import { FaLocationDot } from "react-icons/fa6";
import useMediaQuery from "@/hooks/useMediaQuery";
import { breakPoints } from "../../../tailwind.config";

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
  responsiveBreakpoint = "md",
}: {
  data: {
    pricePerAcre: number;
    parcelNumberNoFormatting: string;
    acreage: number;
    price: number;
    isMainLand: boolean;
  }[];
  setOpenPropertyDetailWarningModal: Dispatch<SetStateAction<boolean>>;
  user: IDecodedAccessToken | null;
  voltValue: number;
  mapInteraction: MapInteractionModel;
  setMpaInteraction: Dispatch<SetStateAction<MapInteractionModel>>;
  responsiveBreakpoint?: keyof typeof breakPoints;
}) => {
  const { targetReached: isSmallDevice } = useMediaQuery(parseFloat(breakPoints[responsiveBreakpoint]));
  const averagePricePerAcre = Number((data.reduce((acc, cur) => acc + cur.pricePerAcre, 0) / data.length).toFixed(2));
  const minPricePerAcre = Math.min(...data.map((el) => el.pricePerAcre));
  const maxPricePerAcre = Math.max(...data.map((el) => el.pricePerAcre));

  const getItemXAxisPositionInPercent = (price: number) =>
    Number((((price - minPricePerAcre) / (maxPricePerAcre - minPricePerAcre)) * 100).toFixed(2));

  return (
    <>
      <div
        className={cn(
          `border border-primary-main-400 rounded-2xl flex gap-4 gap-y-3 gap-x-10`,
          isSmallDevice ? "px-4 py-5 flex-col" : "p-8 flex-row"
        )}
      >
        <div
          className={cn(
            `
            flex items-center gap-2 mt-4 w-full relative
          `,
            isSmallDevice
              ? "flex-col"
              : "flex-row after:content-['Min_Price_Per_Acre'] after:absolute after:top-[40px] after:text-xs after:text-gray-600  before:content-['Max_Price_Per_Acre'] before:absolute before:top-[40px] before:right-0 before:text-xs before:text-gray-600"
          )}
        >
          <p className={cn(`text-xs text-gray-600`, isSmallDevice ? "hidden" : "block")}>Min</p>
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
                className={cn(
                  `bg-white size-6  rounded-full flex items-center justify-center relative`,
                  isSmallDevice
                    ? ""
                    : "after:content-['Average_Price_Per_Acre'] after:absolute after:top-[25px] after:text-xs after:text-gray-600 after:w-max"
                )}
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
                    hoveredParcelNumber: property.parcelNumberNoFormatting,
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
                      openPopperParcelNumber: property.parcelNumberNoFormatting,
                    }));
                  }
                }}
                key={property.parcelNumberNoFormatting}
                style={{ left: `calc(${getItemXAxisPositionInPercent(property.pricePerAcre)}% - 0px)` }}
                className={cn(
                  `cursor-pointer absolute top-0 -translate-y-full text-[#F78290] -translate-x-1/2 transition-all duration-100 hover:scale-150 hover:text-[#FF2F48]`,
                  isSmallDevice ? "size-5" : "size-6",
                  (mapInteraction.hoveredParcelNumber === property.parcelNumberNoFormatting ||
                    mapInteraction.openPopperParcelNumber === property.parcelNumberNoFormatting) &&
                    "scale-150 text-[#FF2F48]"
                )}
              />
            ))}
          </div>
          <p className={cn("text-xs text-gray-600 ", isSmallDevice ? "hidden" : "block")}>Max</p>
          <div className={cn("flex justify-between w-full", isSmallDevice ? "" : "hidden")}>
            <p className="text-xs text-gray-600">Min</p>
            <p className="text-xs text-gray-600">Max</p>
          </div>
        </div>

        <div className={cn("border-t border-t-gray-200 flex gap-4", isSmallDevice ? "py-3" : "py-0 border-y-0")}>
          <div className="space-y-1">
            <p className={cn("text-xs font-medium text-gray-600", isSmallDevice ? "" : "hidden")}>
              Min Price Per Acre: <span className="text-black font-semibold">{moneyFormatter.format(minPricePerAcre)}</span>
            </p>
            <p className={cn("text-xs font-medium text-gray-600", isSmallDevice ? "" : "hidden")}>
              Average Price Per Acre: <span className="text-black font-semibold">{moneyFormatter.format(averagePricePerAcre)}</span>
            </p>
            <p className={cn("text-xs font-medium text-gray-600", isSmallDevice ? "" : "hidden")}>
              Max Price Per Acre: <span className="text-black font-semibold">{moneyFormatter.format(maxPricePerAcre)}</span>
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
