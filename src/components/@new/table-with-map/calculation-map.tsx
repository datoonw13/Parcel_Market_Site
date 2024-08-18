"use client";

import { numFormatter } from "@/helpers/common";
import { SellingPropertyDetails, UsedForPriceCalculationItem } from "@/types/property";
import { LatLngTuple, Marker } from "leaflet";
import dynamic from "next/dynamic";
import { FC } from "react";

const Map = dynamic(() => import("@/components/shared/map/Map"), { ssr: false });

interface CalculationMapProps {
  data: Array<
    NonNullable<
      Pick<
        UsedForPriceCalculationItem,
        "arcage" | "county" | "latitude" | "longitude" | "parcelNumber" | "lastSalesDate" | "lastSalesPrice"
      >
    > & { active: boolean }
  >;
  setMarkerRef: (key: string, ref: Marker) => void;
  markerMouseEnter: (value: LatLngTuple) => void;
  markerMouseLeave: (value: LatLngTuple) => void;
  popupOpen: (value: LatLngTuple) => void;
  popupClose: (value: LatLngTuple) => void;
  mainLandData?: {
    latitude: number;
    longitude: number;
    coordinates: string;
    owner: string;
    parcelNumber: string;
    acreage: string;
    salePrice: number;
  };
}

const CalculationMap: FC<CalculationMapProps> = ({
  data,
  setMarkerRef,
  markerMouseEnter,
  markerMouseLeave,
  popupClose,
  popupOpen,
  mainLandData,
}) => {
  const usedForPriceCalculation = data
    .filter((el) => el.parcelNumber !== "03-0429-004-01-09")
    .map((el) => ({
      centerCoordinate: [Number(el.latitude), Number(el.longitude)] as LatLngTuple,
      parcelNumber: el.parcelNumber,
      showMarker: true,
      active: el.active,
      popup: {
        parcelNumber: {
          label: "Parcel Number",
          value: el.parcelNumber,
        },
        acreage: {
          label: "Acreage",
          value: el.arcage,
        },
        lastSaleDate: {
          label: "Last Sale Date",
          value: el.lastSalesDate!,
        },
        lastSalePrice: {
          label: "Last Sale Price",
          value: numFormatter.format(Number(el.lastSalesPrice) / Number(el.arcage)),
        },
        showSelectButton: false,
      },
    }));

  const mainLand = {
    centerCoordinate: [Number(mainLandData?.latitude || 0), Number(mainLandData?.longitude) || 0] as LatLngTuple,
    parcelNumber: mainLandData?.parcelNumber || "",
    showMarker: true,
    active: true,
    polygon: mainLandData ? JSON.parse(mainLandData.coordinates) : [],
    popup: {
      owner: {
        label: "Owner",
        value: mainLandData?.owner || "",
      },
      acreage: {
        label: "Acreage",
        value: mainLandData?.acreage || "",
      },
      pricePerAcreage: {
        label: "Price Per Acreage",
        value: mainLandData ? numFormatter.format(mainLandData.salePrice / Number(mainLandData.acreage)) : "",
      },
    },
  } as any;

  return (
    <div className="bg-error-100 h-52 sm:h-60 md:h-96 lg:h-[448px] rounded-2xl [&>div]:rounded-2xl">
      <Map
        markerMouseEnter={markerMouseEnter}
        markerMouseLeave={markerMouseLeave}
        popupOpen={popupOpen}
        popupClose={popupClose}
        setMarkerRef={setMarkerRef}
        geolibInputCoordinates={
          mainLandData ? [[mainLandData.latitude, mainLandData.longitude]] : data.map((el) => [Number(el.latitude), Number(el.longitude)])
        }
        zoom={10}
        data={mainLandData ? [mainLand, ...usedForPriceCalculation] : usedForPriceCalculation}
      />
    </div>
  );
};

export default CalculationMap;
