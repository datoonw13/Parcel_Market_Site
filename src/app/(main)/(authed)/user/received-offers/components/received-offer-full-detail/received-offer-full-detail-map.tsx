"use client";

import { ISellingProperty } from "@/types/find-property";
import dynamic from "next/dynamic";
import { FC } from "react";

const Map = dynamic(() => import("@/components/shared/Map"), { ssr: false });

interface ReceivedOfferFullDetailMapProps {
  data: ISellingProperty;
}
const ReceivedOfferFullDetailMap: FC<ReceivedOfferFullDetailMapProps> = ({ data }) => {
  const mapOptions = {
    data: [
      {
        centerCoordinate: [Number(data.lat), Number(data.lon)] as any,
        polygon: JSON.parse(data.coordinates),
        owner: data.owner,
        parcelNumber: data.parcelNumber,
        showMarker: true,
        markerColor: "red" as const,
      },
    ],
  };
  return (
    <div className="w-full h-44 sm:h-48 md:h-72 rounded-2xl [&>.leaflet-container]:rounded-2xl mb-3">
      <Map data={mapOptions.data} geolibInputCoordinates={[[Number(data.lat), Number(data.lon)]]} zoom={13} />
    </div>
  );
};

export default ReceivedOfferFullDetailMap;
