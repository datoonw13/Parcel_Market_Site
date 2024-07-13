"use client";

import { valueLandAtom } from "@/atoms/value-land-atom";
import routes from "@/helpers/routes";
import { useAtom } from "jotai";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import dynamic from "next/dynamic";
import clsx from "clsx";
import Button from "../shared/forms/Button";
import { LocationIcon1 } from "../icons/LocationIcons";

const Map = dynamic(() => import("@/components/shared/Map"), { ssr: false });

const ValueLandFound = () => {
  const router = useRouter();
  const [valueLand, setValueLand] = useAtom(valueLandAtom);

  useEffect(() => {
    if (!valueLand.lands) {
      router.replace(routes.valueLand.fullUrl);
    }
  }, [router, valueLand]);

  return (
    <div className="space-y-8 h-full justify-between gap-2 flex flex-col">
      <div className="mx-4 md:mx-6 lg:mx-8 lg:p-6 xl:p-8 lg:border lg:border-grey-100 rounded-2xl h-full space-y-3 md:space-y-4">
        <div className="rounded-2xl [&>div]:rounded-2xl h-60 sm:h-[230px] md:h-[220px] lg:h-[200px]">
          {valueLand.lands && valueLand.lands.length > 0 && (
            <Map
              data={valueLand.lands.map((el) => ({
                centerCoordinate: [Number(el.properties.fields.lat), Number(el.properties.fields.lon)],
                polygon: el.geometry.coordinates,
                owner: el.properties.fields.owner,
                parcelNumber: el.properties.fields.parcelnumb,
                showMarker: true,
                markerColor: "default",
                popup: {
                  owner: {
                    label: "Owner",
                    value: el.properties.fields.owner,
                  },
                  parcelNumber: {
                    label: "Parcel Number",
                    value: el.properties.fields.parcelnumb,
                  },
                  showSelectButton: !!(valueLand.lands && valueLand.lands.length > 1),
                },
              }))}
              selectedParcelNumber={valueLand.selectedLand?.properties.fields.parcelnumb || ""}
              onSelect={(parcelNumber) => {
                const item = valueLand.lands?.find((el) => el.properties.fields.parcelnumb === parcelNumber);
                if (item) {
                  setValueLand((prev) => ({ ...prev, selectedLand: item }));
                }
              }}
              onDiscard={() => setValueLand((prev) => ({ ...prev, selectedLand: null }))}
              zoom={5}
              geolibInputCoordinates={valueLand.lands.map((el) => [Number(el.properties.fields.lat), Number(el.properties.fields.lon)])}
            />
          )}
        </div>
        <div
          className=" border border-grey-100 rounded-2xl [&>div:not(:last-child)]:border-b [&>div:not(:last-child)]:border-b-grey-100 
        [&>div:last-child]:rounded-b-2xl [&>div:first-child]:rounded-t-2xl"
        >
          {valueLand.lands?.map((land) => (
            <div
              key={land.properties.fields.parcelnumb_no_formatting}
              onClick={() => setValueLand((prev) => ({ ...prev, selectedLand: land }))}
              className={clsx(
                "flex justify-between gap-2 py-3 px-4 cursor-pointer transition-all duration-100 hover:bg-primary-main-50",
                land.properties.fields.parcelnumb_no_formatting === valueLand.selectedLand?.properties.fields.parcelnumb_no_formatting &&
                  "bg-primary-main-100"
              )}
            >
              <div className="flex items-center gap-2">
                <LocationIcon1 className="fill-[#F44D61] !min-w-4 !min-h-4" />
                <p className="text-sm text-grey-600">
                  Parcel Number: <span className="font-medium text-sm text-black">#{land.properties.fields.parcelnumb_no_formatting}</span>
                </p>
              </div>
              <p className="text-sm text-grey-600">
                Acreages: <span className="font-medium text-sm text-black">{land.properties.fields.ll_gisacre} Acres</span>
              </p>
            </div>
          ))}
        </div>
      </div>
      <div className="border-t border-t-grey-100 flex flex-col sm:flex-row justify-end gap-3 px-4 md:px-6 lg:px-8 py-4">
        <Button variant="secondary">Back</Button>
        <Button>Continue</Button>
      </div>
    </div>
  );
};

export default ValueLandFound;
