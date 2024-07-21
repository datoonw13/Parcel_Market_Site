"use client";

import { FC } from "react";
import { ISellingProperty } from "@/types/find-property";
import dynamic from "next/dynamic";

const Map = dynamic(() => import("@/components/shared/map/Map"), { ssr: false });

interface OfferDetailMapProps {
  data: ISellingProperty;
}
const OfferDetailMap: FC<OfferDetailMapProps> = ({ data }) => {
  const mapOptions = {
    data: [
      {
        centerCoordinate: [Number(data.lat), Number(data.lon)] as any,
        polygon: JSON.parse(data.coordinates),
        owner: data.owner,
        parcelNumber: data.parcelNumber,
        showMarker: true,
        markerColor: "default" as const,
      },
    ],
  };
  return (
    <div className="w-full h-44 sm:h-48 md:h-72 rounded-2xl [&>.leaflet-container]:rounded-2xl mb-3">
      <Map data={mapOptions.data} geolibInputCoordinates={[[Number(data.lat), Number(data.lon)]]} zoom={13} />
    </div>
  );
};

export default OfferDetailMap;
