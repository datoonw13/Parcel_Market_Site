"use client";

import { numFormatter } from "@/helpers/common";
import { ISellingProperty } from "@/types/find-property";
import { LatLngTuple, Map as LeafletMap, Marker } from "leaflet";
import dynamic from "next/dynamic";
import { FC } from "react";

const Map = dynamic(() => import("@/components/shared/map/Map"), { ssr: false });

interface CalculationMapProps {
  data: NonNullable<ISellingProperty["usedForPriceCalculations"]>;
  setMapRef: (ref: LeafletMap) => void;
  setMarkerRef: (key: string, ref: Marker) => void;
}

const CalculationMap: FC<CalculationMapProps> = ({ data, setMapRef, setMarkerRef }) => (
  <div className="bg-error-100 h-52 sm:h-60 md:h-96 lg:h-[448px] rounded-2xl [&>div]:rounded-2xl">
    <Map
      setMapRef={setMapRef}
      initialMarkerOpacity={0.5}
      setMarkerRef={setMarkerRef}
      geolibInputCoordinates={data.map((el) => [Number(el.latitude), Number(el.longitude)])}
      zoom={10}
      data={[
        ...data.map((el) => ({
          centerCoordinate: [Number(el.latitude), Number(el.longitude)] as LatLngTuple,
          parcelNumber: el.parcelNumber,
          showMarker: true,
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
              value: numFormatter.format(Number(el.lastSalesPrice)),
            },
            showSelectButton: false,
          },
        })),
      ]}
    />
  </div>
);

export default CalculationMap;
