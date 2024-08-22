"use client";

import { formatParcelNumber, numFormatter } from "@/helpers/common";
import { SellingPropertyDetails, UsedForPriceCalculationItem } from "@/types/property";
import { LatLngTuple, Marker } from "leaflet";
import dynamic from "next/dynamic";
import { FC } from "react";

const Map = dynamic(() => import("@/components/shared/map/Map"), { ssr: false });

interface PropertyModel {
  id: string;
  latitude: number;
  longitude: number;
  parcelNumber: string;
  acreage: number;
}
interface CalculationMapProps {
  properties: Array<PropertyModel & { lastSalePrice: number }>;
  sellingProperty: PropertyModel & { salePrice: number; coordinates: string; owner: string };
  setMarkerRef: (id: string, ref: Marker) => void;
  markerMouseEnter: (id: string) => void;
  markerMouseLeave: (id: string) => void;
  popupOpen: (id: string) => void;
  popupClose: (id: string) => void;
}

const CalculationMap: FC<CalculationMapProps> = ({
  setMarkerRef,
  markerMouseEnter,
  markerMouseLeave,
  popupClose,
  popupOpen,
  properties,
  sellingProperty,
}) => {
  // const usedForPriceCalculation = data
  //   .filter((el) => el.parcelNumber !== "03-0429-004-01-09")
  //   .map((el) => ({
  //     centerCoordinate: [Number(el.latitude), Number(el.longitude)] as LatLngTuple,
  //     parcelNumber: el.parcelNumber,
  //     showMarker: true,
  //     active: el.active,
  //     popup: {
  //       parcelNumber: {
  //         label: "Parcel Number",
  //         value: el.parcelNumber,
  //       },
  //       acreage: {
  //         label: "Acreage",
  //         value: el.arcage,
  //       },
  //       lastSaleDate: {
  //         label: "Last Sale Date",
  //         value: el.lastSalesDate!,
  //       },
  //       lastSalePrice: {
  //         label: "Last Sale Price",
  //         value: numFormatter.format(Number(el.lastSalesPrice) / Number(el.arcage)),
  //       },
  //       showSelectButton: false,
  //     },
  //   }));

  // const mainLand = {
  //   centerCoordinate: [Number(mainLandData?.latitude || 0), Number(mainLandData?.longitude) || 0] as LatLngTuple,
  //   parcelNumber: mainLandData?.parcelNumber || "",
  //   showMarker: true,
  //   active: true,
  //   polygon: mainLandData ? JSON.parse(mainLandData.coordinates) : [],
  //   popup: {
  //     owner: {
  //       label: "Owner",
  //       value: mainLandData?.owner || "",
  //     },
  //     acreage: {
  //       label: "Acreage",
  //       value: mainLandData?.acreage || "",
  //     },
  //     pricePerAcreage: {
  //       label: "Price Per Acreage",
  //       value: mainLandData ? numFormatter.format(mainLandData.salePrice / Number(mainLandData.acreage)) : "",
  //     },
  //   },
  // } as any;

  const mainLandSaleHistory = properties.filter(
    (property) => formatParcelNumber(property.parcelNumber) === formatParcelNumber(sellingProperty.parcelNumber)
  );

  const mapItems = [
    {
      id: sellingProperty.id,
      parcelNumber: sellingProperty.parcelNumber,
      latitude: Number(sellingProperty.latitude),
      longitude: Number(sellingProperty.longitude),
      polygon: JSON.parse(sellingProperty.coordinates),
      markerType: "active" as const,
      center: true,
      popup: (
        <div className="flex flex-col gap-1">
          <p className="!p-0 !m-0">
            Owner: <b>{sellingProperty.owner}</b>
          </p>
          <p className="!p-0 !m-0">
            Acreage: <b>{sellingProperty.acreage}</b>
          </p>
          <p className="!p-0 !m-0">
            Price Per Acreage: <b>{numFormatter.format(sellingProperty.salePrice / sellingProperty.acreage)}</b>
          </p>
        </div>
      ),
    },
    ...properties,
  ];
  console.log(mainLandSaleHistory);

  return (
    <div className="bg-primary-main-100 h-52 sm:h-60 md:h-96 lg:h-[448px] rounded-2xl [&>div]:rounded-2xl">
      <Map
        markerMouseEnter={markerMouseEnter}
        markerMouseLeave={markerMouseLeave}
        popupOpen={popupOpen}
        popupClose={popupClose}
        setMarkerRef={setMarkerRef}
        zoom={10}
        properties={mapItems}
      />
    </div>
  );
};

export default CalculationMap;
