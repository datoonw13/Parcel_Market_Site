"use client";

import { numFormatter } from "@/helpers/common";
import { useAtom, useAtomValue } from "jotai";
import { valueLandAtom } from "@/atoms/value-land-atom";
import { LocationIcon2 } from "../../icons/LocationIcons";

const CalculationDetails = () => {
  const valueLandData = useAtomValue(valueLandAtom);

  if (!valueLandData.calculatedPrice) {
    return null;
  }

  const voltValue = valueLandData.calculatedPrice.price;
  const minPricePerAcre = valueLandData.calculatedPrice.range.min;
  const maxPricePerAcre = valueLandData.calculatedPrice.range.max;
  const data = valueLandData.calculatedPrice.properties.map((el) => el.price / el.arcage);
  const averagePrice = (
    valueLandData.calculatedPrice.properties.reduce((acc, cur) => acc + cur.price / cur.arcage, 0) /
    valueLandData.calculatedPrice.properties.length
  ).toFixed(2);

  const formattedData = data.map((el) => ({ value: el, percent: Math.floor((100 * el) / maxPricePerAcre) }));

  return (
    <div className="bg-primary-main-50 border border-primary-main-400 rounded-2xl px-4 sm:px-5 md:px-6 lg:px-8 py-6 md:py-8">
      <div>
        <h2 className="text-center font-medium text-sm text-grey-800">VOLT Value</h2>
        <h1 className="text-center font-semibold text-3xl md:text-4xl">{numFormatter.format(voltValue)}</h1>
      </div>
      <div className="flex flex-col md:flex-row gap-2 items-center mt-14">
        <p className="text-xs text-grey-600 hidden md:block">Min</p>
        <div className="w-full h-1.5 rounded-3xl bg-primary-main-400 relative">
          <div className="h-1.5 rounded-3xl bg-primary-main absolute w-[50%]" />
          <div
            className={`
            left-[50%] -translate-x-1/2
            w-5 h-5 rounded-full bg-white
            absolute top-1/2 -translate-y-1/2 
            after:content-[''] after:absolute after:top-1/2 after:-translate-y-1/2 after:w-4 after:h-4 
            after:border-2 after:border-primary-main after:rounded-full after:left-1/2 after:-translate-x-1/2
            before:content-[''] before:absolute before:top-1/2 before:-translate-y-1/2 before:w-2 before:h-2 
          before:bg-primary-main before:rounded-full before:left-1/2 before:-translate-x-1/2`}
          />
          {formattedData.map((el) => (
            <div key={el.value} className="absolute -translate-x-1/2 top-0 -translate-y-full" style={{ left: `${el.percent}%` }}>
              <LocationIcon2 className="!w-5 min-w-5 !h-6 min-h-6" />
            </div>
          ))}
        </div>
        <p className="text-xs text-grey-600 hidden md:block">Max</p>
        <div className="flex justify-between w-full md:hidden">
          <p className="text-xs text-grey-600">Min</p>
          <p className="text-xs text-grey-600">Max</p>
        </div>
      </div>
      <div className="mt-6 md:mt-2 flex flex-col md:flex-row md:justify-between gap-2.5">
        <p className="text-xs text-grey-600">
          <span className="md:hidden">Minimum</span> Per Acre:{" "}
          <span className="text-black font-medium">{numFormatter.format(minPricePerAcre)}</span>
        </p>
        <p className="text-xs text-grey-600">
          <span className="md:hidden">Average</span> Per Acre:{" "}
          <span className="text-black font-medium">{numFormatter.format(Number(averagePrice))}</span>
        </p>
        <p className="text-xs text-grey-600">
          <span className="md:hidden">Maximum</span> Per Acre:{" "}
          <span className="text-black font-medium">{numFormatter.format(maxPricePerAcre)}</span>
        </p>
      </div>
    </div>
  );
};

export default CalculationDetails;
