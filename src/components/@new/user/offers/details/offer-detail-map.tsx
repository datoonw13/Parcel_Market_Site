"use client";

import { FC } from "react";
import dynamic from "next/dynamic";
import { SellingPropertyDetails } from "@/types/property";

const Map = dynamic(() => import("@/components/shared/map/Map"), { ssr: false });

interface OfferDetailMapProps {
  data: SellingPropertyDetails;
}
const OfferDetailMap: FC<OfferDetailMapProps> = ({ data }) => (
  <div className="w-full h-44 sm:h-48 md:h-72 rounded-2xl [&>.leaflet-container]:rounded-2xl mb-3">
    <Map
      properties={[
        {
          latitude: Number(data.lat || 1),
          longitude: Number(data.lon || 1),
          parcelNumber: data.parcelNumber,
          center: true,
          polygon: JSON.parse(data.coordinates),
        },
      ]}
      zoom={13}
    />
  </div>
);

export default OfferDetailMap;
