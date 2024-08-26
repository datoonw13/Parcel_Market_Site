"use client";

import { cn, formatParcelNumber, numFormatter } from "@/helpers/common";
import { useAtom } from "jotai";
import { valueLandAtom } from "@/atoms/value-land-atom";
import clsx from "clsx";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import routes from "@/helpers/routes";
import { IDecodedAccessToken } from "@/types/auth";
import { LocationIcon2 } from "../../icons/LocationIcons";
import ResponsiveWarningModal from "../../shared/modals/ResponsiveWarningModal";
import { InfoIcon2 } from "../../icons/InfoIcons";

const CalculationDetails = ({ user }: { user: IDecodedAccessToken | null }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const [valueLandData, setValueLandData] = useAtom(valueLandAtom);
  const [openWarningModal, setOpenWarningModal] = useState(false);

  if (!valueLandData.calculatedPrice) {
    return null;
  }
  const voltValue = valueLandData.calculatedPrice.price;
  const pins = valueLandData.calculatedPrice.properties
    .map((el) => ({ ...el, pricePerAcreage: Number(el.price) / Number(el.arcage) }))
    .sort((a, b) => Number(a.price) / Number(a.arcage) - Number(b.price) / Number(b.arcage));
  const minPricePerAcre = pins[0].pricePerAcreage;
  const maxPricePerAcre = pins[pins.length - 1].pricePerAcreage;
  const xAxisMiddlePoint = {
    value: (minPricePerAcre + maxPricePerAcre) / 2,
    percent: 50,
  };
  const averagePrice = {
    value: pins.reduce((acc, cur) => acc + cur.pricePerAcreage, 0) / pins.length,
    percent:
      ((pins.reduce((acc, cur) => acc + cur.pricePerAcreage, 0) / pins.length - minPricePerAcre) / (maxPricePerAcre - minPricePerAcre)) *
      100,
  };
  const pinsWithPercent = pins.map((el) => ({
    ...el,
    parcelNumber: el.parselId,
    percent: ((el.pricePerAcreage - minPricePerAcre) / (maxPricePerAcre - minPricePerAcre)) * 100,
  }));

  return (
    <>
      <ResponsiveWarningModal
        customIcon={<InfoIcon2 className="!w-4 !h-4 min-w-4 min-h-4" color="primary-main" />}
        open={openWarningModal}
        variant="success"
        closeModal={() => setOpenWarningModal(false)}
        onOK={() => {
          if (!user) {
            params.set("from", routes.valueLand.value.fullUrl);
            router.replace(`${routes.auth.signIn.fullUrl}?${params.toString()}`);
          } else {
            router.push(routes.user.subscription.fullUrl);
          }
        }}
        onCancel={() => setOpenWarningModal(false)}
        title={!user ? "Log in to See the information" : "Closed content"}
        description={
          !user
            ? "Your are not logged in, if you want to see this information please log into your account"
            : "Subscribe now to view, save, and export sales data."
        }
        okLabel={!user ? "Log In" : "Subscribe"}
        cancelLabel="Close"
      />
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
              style={{ left: `${averagePrice.percent}%` }}
              className={`
            -translate-x-1/2
            w-5 h-5 rounded-full bg-white
            absolute top-1/2 -translate-y-1/2 
            after:content-[''] after:absolute after:top-1/2 after:-translate-y-1/2 after:w-4 after:h-4 
            after:border-2 after:border-primary-main after:rounded-full after:left-1/2 after:-translate-x-1/2
            before:content-[''] before:absolute before:top-1/2 before:-translate-y-1/2 before:w-2 before:h-2 
          before:bg-primary-main before:rounded-full before:left-1/2 before:-translate-x-1/2`}
            />
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
            {pinsWithPercent.map((el) => (
              <div
                key={el.pricePerAcreage.toString()}
                className="absolute -translate-x-1/2 top-0 -translate-y-full"
                style={{ left: `${el.percent}%` }}
                onClick={() => {
                  if (!user || !user.isSubscribed) {
                    setOpenWarningModal(true);
                  }
                }}
                onMouseEnter={() => {
                  const isSellingProperty =
                    formatParcelNumber(el.parcelNumber) ===
                    formatParcelNumber(valueLandData.selectedLand?.properties.fields.parcelnumb_no_formatting || "");
                  setValueLandData((prev) => ({
                    ...prev,
                    mapInteraction: {
                      hoveredLand: isSellingProperty
                        ? formatParcelNumber(valueLandData.selectedLand?.properties.fields.parcelnumb_no_formatting || "")
                        : formatParcelNumber(el.parcelNumber),
                    },
                  }));
                }}
                onMouseLeave={() => {
                  setValueLandData((prev) => ({ ...prev, mapInteraction: { hoveredLand: null } }));
                }}
              >
                <LocationIcon2
                  className={clsx(
                    formatParcelNumber(valueLandData.mapInteraction.hoveredLand || "") === formatParcelNumber(el.parcelNumber)
                      ? "!w-6 min-w-6 !h-8 min-h-8 [&>path:first-child]:!fill-[#F44D61]"
                      : "!w-5 min-w-5 !h-6 min-h-6 "
                  )}
                />
              </div>
            ))}
          </div>
          <p className="text-xs text-grey-600 hidden md:block">Max</p>
          <div className="flex justify-between w-full md:hidden">
            <p className="text-xs text-grey-600">Min</p>
            <p className="text-xs text-grey-600">Max</p>
          </div>
        </div>
        <div className={cn("mt-6 md:mt-2 relative")}>
          <p className="text-xs text-grey-600 md:absolute md:left-0">
            <span className="md:hidden">Minimum</span> Per Acre:{" "}
            <span className="text-black font-medium">{numFormatter.format(minPricePerAcre)}</span>
          </p>
          <p style={{ left: `${averagePrice.percent}%` }} className={cn(`text-xs text-grey-600 md:absolute md:-translate-x-1/2`)}>
            <span className="md:hidden">Average: </span>
            <span className="text-black font-medium">{numFormatter.format(Number(averagePrice.value))}</span>
          </p>
          <p className={cn(`text-xs text-grey-600 md:absolute md:left-1/2 md:-translate-x-1/2`)}>
            <span className="md:hidden">Mid point: </span>
            <span className={cn(`text-black font-medium`)}>{numFormatter.format(Number(xAxisMiddlePoint.value))}</span>
          </p>
          <p className="text-xs text-grey-600 md:absolute md:right-0 md:top-0">
            <span className="md:hidden">Maximum</span> Per Acre:{" "}
            <span className="text-black font-medium">{numFormatter.format(maxPricePerAcre)}</span>
          </p>
        </div>
      </div>
    </>
  );
};

export default CalculationDetails;
