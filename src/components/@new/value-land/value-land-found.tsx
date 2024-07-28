"use client";

import { valueLandAtom } from "@/atoms/value-land-atom";
import routes from "@/helpers/routes";
import { useAtom } from "jotai";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import clsx from "clsx";
import { calculateLandPriceAction } from "@/server-actions/value-land/actions";
import toast from "react-hot-toast";
import { IFindPropertyEstimatedPrice } from "@/types/find-property";
import classes from "@/app/value-land/(main)/styles.module.css";
import { Marker } from "leaflet";
import { ISignInResponse } from "@/types/auth";
import { Nullable } from "@/types/common";
import Button from "../shared/forms/Button";
import ValueLandStepper from "./value-land-stepper";
import { LocationIcon1 } from "../icons/LocationIcons";

const Map = dynamic(() => import("@/components/shared/map/Map"), { ssr: false });

const ValueLandFound = ({ user }: { user: Nullable<ISignInResponse["payload"]> }) => {
  const router = useRouter();
  const markerRefs = useRef<{ [key: string]: Marker }>();
  const [valueLand, setValueLand] = useAtom(valueLandAtom);
  const [pending, setPending] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const onNext = async () => {
    if (!valueLand.selectedLand) {
      return;
    }
    const reqData: IFindPropertyEstimatedPrice = {
      body: {
        county: valueLand.selectedLand?.properties.fields.county.toLocaleLowerCase(),
        state: valueLand.selectedLand?.properties.fields.state2.toLocaleLowerCase(),
        parcelNumber: valueLand.selectedLand?.properties.fields.parcelnumb,
        owner: valueLand.selectedLand.properties.fields.owner,
        propertyType:
          valueLand.selectedLand.properties.fields?.zoning_description || valueLand.selectedLand.properties.fields.usedesc || "",
      },
      queryParams: {
        acre: valueLand.selectedLand.properties.fields.ll_gisacre.toString(),
        lat: valueLand.selectedLand.properties.fields.lat,
        lon: valueLand.selectedLand.properties.fields.lon,
      },
    };
    setPending(true);

    const { errorMessage, data } = await calculateLandPriceAction(reqData);
    if (errorMessage) {
      toast.error(errorMessage);
      setPending(false);
    } else {
      setValueLand((prev) => ({ ...prev, calculatedPrice: data, searchDataSaved: !!user }));
      router.push(routes.valueLand.value.fullUrl);
    }
  };

  return (
    <div className="h-full flex flex-col w-full gap-6">
      <ValueLandStepper currentStep={2} />
      <div className={clsx("space-y-3 md:space-y-2", classes["content-space-x"])}>
        <h1 className="text-lg font-semibold ">Did we find your property?</h1>
        <h2 className="text-sm text-grey-800">Use the map or list below to select your property.</h2>
      </div>
      <div className={clsx("flex flex-col  w-full", classes["content-space-x"])}>
        <div className="rounded-t-2xl [&>div]:rounded-t-2xl h-60 min-h-60 md:h-[220px] md:min-h-[220px]">
          {valueLand.lands && valueLand.lands.length > 0 && (
            <Map
              setMarkerRef={(key, ref) => {
                markerRefs.current = { ...markerRefs.current, [key]: ref };
              }}
              markerMouseEnter={(value) => {
                const key = JSON.stringify(value);
                setHoveredItem(key);
              }}
              markerMouseLeave={(value) => {
                setHoveredItem(null);
              }}
              popupOpen={(value) => {
                const selectedLand = valueLand.lands?.find(
                  (el) => Number(el.properties.fields.lat) === value[0] && Number(el.properties.fields.lon) === value[1]
                );
                if (selectedLand) {
                  setValueLand((prev) => ({ ...prev, selectedLand }));
                }
              }}
              popupClose={() => {
                // setValueLand((prev) => ({ ...prev, selectedLand: null }));
              }}
              data={valueLand.lands.map((el) => ({
                active:
                  hoveredItem === JSON.stringify([Number(el.properties.fields.lat), Number(el.properties.fields.lon)]) ||
                  JSON.stringify([
                    Number(valueLand.selectedLand?.properties.fields.lat),
                    Number(valueLand.selectedLand?.properties.fields.lon),
                  ]) === JSON.stringify([Number(el.properties.fields.lat), Number(el.properties.fields.lon)]),
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
        <div className="mt-3 lg:mt-0 lg:p-6 xl:p-8 lg:border lg:border-grey-100 rounded-b-2xl border-t-0 w-full flex">
          <div
            className=" border border-grey-100 rounded-2xl [&>div:not(:last-child)]:border-b [&>div:not(:last-child)]:border-b-grey-100
        [&>div:last-child]:rounded-b-2xl [&>div:first-child]:rounded-t-2xl flex flex-col w-full "
          >
            {valueLand.lands?.map((land) => (
              <div
                onMouseEnter={() =>
                  setHoveredItem(JSON.stringify([Number(land.properties.fields.lat), Number(land.properties.fields.lon)]))
                }
                onMouseLeave={() => setHoveredItem(null)}
                key={land.properties.fields.parcelnumb_no_formatting}
                onClick={() => {
                  setValueLand((prev) => ({ ...prev, selectedLand: land }));
                  const key = JSON.stringify([Number(land.properties.fields.lat), Number(land.properties.fields.lon)]);
                  if (markerRefs.current) {
                    markerRefs.current?.[key]?.openPopup();
                  }
                }}
                className={clsx(
                  "flex justify-between gap-2 py-3 px-4 cursor-pointer transition-all duration-100",
                  land.properties.fields.parcelnumb_no_formatting === valueLand.selectedLand?.properties.fields.parcelnumb_no_formatting &&
                    "bg-primary-main-100",
                  hoveredItem === JSON.stringify([Number(land.properties.fields.lat), Number(land.properties.fields.lon)]) &&
                    "bg-primary-main-50"
                )}
              >
                <div className="flex items-center gap-2">
                  <LocationIcon1 className="fill-[#F44D61] !min-w-4 !min-h-4" />
                  <p className="text-sm text-grey-600">
                    Parcel Number:{" "}
                    <span className="font-medium text-sm text-black">#{land.properties.fields.parcelnumb_no_formatting}</span>
                  </p>
                </div>
                <p className="text-sm text-grey-600">
                  Acreages: <span className="font-medium text-sm text-black">{land.properties.fields.ll_gisacre} Acres</span>
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className={classes.action}>
        <Button variant="secondary" onClick={() => router.push(routes.valueLand.fullUrl)}>
          Back
        </Button>
        <Button onClick={onNext} loading={pending} disabled={!valueLand.selectedLand}>
          Continue
        </Button>
      </div>
    </div>
  );
};

export default ValueLandFound;
